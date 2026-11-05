/**
 * Lagersynk mellan appen och Shopify. Appens lager gäller.
 * Används av scripts/shopify-sync.mjs (GitHub Actions, var 15:e minut) och
 * app/api/shopify-sync/route.ts (knappen i appen).
 *
 * Varje körning:
 *   1. Läser Shopifys saldon (för att upptäcka försäljning som sker medan synken kör).
 *   2. Nya webbordrar sedan synkens start drar av appens lager, en gång per order
 *      (shopify_apply_order, migration 026).
 *   3. Skriver appens saldon till Shopify för varianter med samma sku. Har Shopify-saldot
 *      ändrats sedan steg 1 hoppas varianten över och rättas vid nästa körning.
 *
 * @param {object} opts
 * @param {import('@supabase/supabase-js').SupabaseClient} opts.supabase  klient med service role-nyckeln
 * @param {{ domain: string, clientId: string, clientSecret: string }} opts.shopify
 * @param {boolean} [opts.dryRun]  visa vad som skulle hända, ändra inget
 * @param {(line: string) => void} [opts.log]
 * @returns {Promise<{ ordersApplied: number, updated: number, skipped: number, summary: string }>}
 */
export async function runShopifySync({ supabase, shopify, dryRun = false, log = console.log }) {
  const API_VERSION = '2025-01'

  // ── Shopify ─────────────────────────────────────────────────────────────────
  const tokenRes = await fetch(`https://${shopify.domain}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: shopify.clientId, client_secret: shopify.clientSecret, grant_type: 'client_credentials' }),
  })
  if (!tokenRes.ok) throw new Error(`Shopify-inloggning misslyckades: ${tokenRes.status}`)
  const token = (await tokenRes.json()).access_token

  async function gql(query, variables = {}) {
    const res = await fetch(`https://${shopify.domain}/admin/api/${API_VERSION}/graphql.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
      body: JSON.stringify({ query, variables }),
    })
    const json = await res.json()
    if (json.errors) throw new Error(JSON.stringify(json.errors))
    return json.data
  }

  async function fetchAll(query, pick, variables = {}) {
    const nodes = []
    let after = null
    do {
      const conn = pick(await gql(query, { ...variables, after }))
      nodes.push(...conn.nodes)
      after = conn.pageInfo.hasNextPage ? conn.pageInfo.endCursor : null
    } while (after)
    return nodes
  }

  // ── 1. Shopifys saldon per sku ──────────────────────────────────────────────
  const location = (await gql(`{ locations(first: 1) { nodes { id name } } }`)).locations.nodes[0]

  const variants = await fetchAll(
    `query($after: String) { productVariants(first: 250, after: $after) {
       pageInfo { hasNextPage endCursor }
       nodes { sku inventoryItem { id tracked inventoryLevel(locationId: "${location.id}") {
         quantities(names: ["available"]) { quantity } } } }
     } }`,
    (d) => d.productVariants
  )
  const shopifyBySku = new Map()
  for (const v of variants) {
    if (!v.sku || !v.inventoryItem.tracked || !v.inventoryItem.inventoryLevel) continue
    shopifyBySku.set(v.sku, {
      inventoryItemId: v.inventoryItem.id,
      available: v.inventoryItem.inventoryLevel.quantities[0]?.quantity ?? 0,
    })
  }

  // ── 2. Nya webbordrar drar av appens lager ──────────────────────────────────
  let { data: state, error: stateError } = await supabase.from('shopify_sync_state').select('*').single()
  if (stateError) {
    if (!dryRun) throw new Error(`Kör migration 026 först: ${stateError.message}`)
    state = { orders_since: new Date().toISOString() }
  }

  const orders = await fetchAll(
    `query($after: String, $q: String) { orders(first: 100, after: $after, query: $q, sortKey: CREATED_AT) {
       pageInfo { hasNextPage endCursor }
       nodes { id name createdAt cancelledAt
         lineItems(first: 100) { nodes { sku quantity title variantTitle } } }
     } }`,
    (d) => d.orders,
    { q: `created_at:>='${new Date(state.orders_since).toISOString()}'` }
  )

  const { data: done } = await supabase.from('shopify_orders').select('order_id')
  const doneIds = new Set((done ?? []).map((o) => o.order_id))

  let ordersApplied = 0
  for (const order of orders) {
    if (order.cancelledAt || doneIds.has(order.id)) continue
    const lines = order.lineItems.nodes
      .filter((l) => l.sku && l.quantity > 0)
      .map((l) => ({ sku: l.sku, quantity: l.quantity, title: [l.title, l.variantTitle].filter(Boolean).join(' – ') }))
    log(`Order ${order.name}: ${lines.map((l) => `${l.quantity} × ${l.sku}`).join(', ') || 'inga rader med sku'}`)
    if (dryRun) continue
    const { data: applied, error } = await supabase.rpc('shopify_apply_order', {
      p_order_id: order.id, p_order_name: order.name, p_created_at: order.createdAt, p_lines: lines,
    })
    if (error) throw new Error(`Order ${order.name}: ${error.message}`)
    if (applied) ordersApplied++
  }

  // ── 3. Appens saldon till Shopify ───────────────────────────────────────────
  const { data: inventory, error: invError } = await supabase.from('inventory').select('sku, quantity_in_stock').not('sku', 'is', null)
  if (invError) throw new Error(invError.message)

  let updated = 0, skipped = 0
  for (const item of inventory) {
    const shop = shopifyBySku.get(item.sku)
    if (!shop) continue
    const target = Math.max(0, item.quantity_in_stock ?? 0)
    if (target === shop.available) continue
    log(`${item.sku}: Shopify ${shop.available} → ${target}`)
    if (dryRun) continue
    const result = await gql(
      `mutation($input: InventorySetQuantitiesInput!) { inventorySetQuantities(input: $input) {
         userErrors { field message code } } }`,
      { input: {
        name: 'available',
        reason: 'correction',
        referenceDocumentUri: 'logistics://varvet-crm/lagersynk',
        quantities: [{ inventoryItemId: shop.inventoryItemId, locationId: location.id, quantity: target, compareQuantity: shop.available }],
      } }
    )
    const errors = result.inventorySetQuantities.userErrors
    if (errors.length) {
      // Oftast att någon handlat under körningen – rättas nästa gång
      log(`  hoppade över ${item.sku}: ${errors.map((e) => e.message).join('; ')}`)
      skipped++
    } else {
      updated++
    }
  }

  const summary = `${ordersApplied} nya webbordrar, ${updated} saldon uppdaterade i Shopify${skipped ? `, ${skipped} överhoppade` : ''}`
  if (!dryRun) {
    await supabase.from('shopify_sync_state').update({ last_run_at: new Date().toISOString(), last_result: summary }).eq('id', true)
  }
  return { ordersApplied, updated, skipped, summary: dryRun ? 'Torrkörning – inget ändrat.' : summary }
}
