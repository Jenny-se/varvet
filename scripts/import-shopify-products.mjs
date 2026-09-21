/**
 * Import Shopify product CSV into Varvet CRM
 *
 * Usage:
 *   SUPABASE_URL=https://xxx.supabase.co \
 *   SUPABASE_SERVICE_ROLE_KEY=xxx \
 *   node scripts/import-shopify-products.mjs path/to/products.csv
 *
 * What it does:
 *   1. Imports unique products → receipt_products (for dropdown in receipt creation)
 *   2. Imports all variants → inventory (for stock tracking and receipt autocomplete)
 *
 * Safe to re-run: existing receipt_products are skipped by name, existing inventory
 * items by product_name+colorway combination.
 */

import * as fs from 'fs'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

// ── Read .env.local as fallback ───────────────────────────────────────────────
function loadEnvLocal() {
  const envPath = path.join(process.cwd(), '.env.local')
  if (!fs.existsSync(envPath)) return
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '')
    if (!process.env[key]) process.env[key] = val
  }
}
loadEnvLocal()

const csvPath = process.argv[2]
if (!csvPath) {
  console.error('Ange sökväg till CSV-filen som argument.')
  console.error('Exempel: node scripts/import-shopify-products.mjs produkter.csv')
  process.exit(1)
}

// Support both naming conventions
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('\nSaknar Supabase-inställningar. Kontrollera att .env.local innehåller:')
  console.error('  NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co')
  console.error('  SUPABASE_SERVICE_ROLE_KEY=xxx\n')
  process.exit(1)
}

// Validate URL format
try { new URL(supabaseUrl) } catch {
  console.error(`\nOgiltig SUPABASE_URL: "${supabaseUrl}"`)
  console.error('Ska vara i formatet: https://abcdefgh.supabase.co\n')
  process.exit(1)
}

console.log(`Supabase: ${supabaseUrl.replace(/\/\/(.{8}).*\.supabase/, '//$1***.supabase')}`)

const supabase = createClient(supabaseUrl, supabaseKey)

// ── CSV parser ──────────────────────────────────────────────────────────────

function parseRow(line) {
  const result = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      inQuotes = !inQuotes
    } else if (ch === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += ch
    }
  }
  result.push(current.trim())
  return result
}

function parseCSV(text) {
  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n').filter(l => l.trim())
  const headers = parseRow(lines[0])
  return lines.slice(1).map(line => {
    const values = parseRow(line)
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? '']))
  })
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function mapCategory(shopifyType) {
  switch (shopifyType) {
    case 'Garn': return 'yarn'
    case 'Stickor': return 'needles'
    default: return 'accessories'
  }
}

function vatRate(shopifyType) {
  return shopifyType === 'Bok' ? 6 : 25
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\nLäser ${csvPath}...`)
  const text = fs.readFileSync(csvPath, 'utf-8')
  const rows = parseCSV(text)
  console.log(`  ${rows.length} rader funna.`)

  // Group by Handle → each Handle = one unique product
  const byHandle = {}
  for (const row of rows) {
    const handle = row['Handle']
    if (!byHandle[handle]) byHandle[handle] = []
    byHandle[handle].push(row)
  }

  const handles = Object.keys(byHandle)
  console.log(`  ${handles.length} unika produkter.`)

  // ── 1. receipt_products ──────────────────────────────────────────────────

  console.log('\n[1/2] Importerar till receipt_products...')

  // Fetch existing names to avoid duplicates
  const { data: existing } = await supabase
    .from('receipt_products')
    .select('name')
  const existingNames = new Set((existing ?? []).map(p => p.name))

  const receiptRows = []
  let sortOrder = existingNames.size

  for (const [, variants] of Object.entries(byHandle)) {
    const first = variants[0]
    const title = first['Title']
    if (existingNames.has(title)) continue

    const price = parseFloat(first['Variant Price']) || 0
    const vat = vatRate(first['Type'])
    sortOrder++
    receiptRows.push({ name: title, default_price: price, vat_rate: vat, sort_order: sortOrder })
  }

  if (receiptRows.length === 0) {
    console.log('  Inga nya produkter att lägga till (alla finns redan).')
  } else {
    const { error } = await supabase.from('receipt_products').insert(receiptRows)
    if (error) {
      console.error('  Fel:', error.message)
    } else {
      console.log(`  ✓ ${receiptRows.length} produkter inlagda.`)
      for (const r of receiptRows) {
        console.log(`    • ${r.name} (${r.default_price} kr, ${r.vat_rate}% moms)`)
      }
    }
  }

  // ── 2. inventory ─────────────────────────────────────────────────────────

  console.log('\n[2/2] Importerar till inventory...')

  // Fetch existing to avoid duplicates (product_name + colorway)
  const { data: existingInv } = await supabase
    .from('inventory')
    .select('product_name, colorway')
  const existingSet = new Set(
    (existingInv ?? []).map(i => `${i.product_name}||${i.colorway ?? ''}`)
  )

  const inventoryRows = []
  for (const [, variants] of Object.entries(byHandle)) {
    const first = variants[0]
    const title = first['Title']
    const shopifyType = first['Type']
    const isYarn = shopifyType === 'Garn'
    const rawTags = first['Tags'].split(',').map(t => t.trim()).filter(Boolean)
    const category = mapCategory(shopifyType)

    for (const variant of variants) {
      const option1Value = variant['Option1 Value']
      const isDefaultTitle = !option1Value || option1Value === 'Default Title'

      // For yarn: keep product_name as brand name, put color in colorway
      // For needles/accessories: append size/variant to product_name
      const productName = isYarn
        ? title
        : isDefaultTitle ? title : `${title} ${option1Value}`
      const colorway = isYarn ? (option1Value || null) : null

      const key = `${productName}||${colorway ?? ''}`
      if (existingSet.has(key)) continue

      const qty = parseInt(variant['Variant Inventory Qty']) || 0
      const retailPrice = parseFloat(variant['Variant Price']) || null
      const costPrice = parseFloat(variant['Variant Cost']) || null
      const sku = variant['Variant SKU'] || null

      inventoryRows.push({
        product_name: productName,
        colorway,
        quantity_in_stock: qty,
        retail_price: retailPrice,
        cost_price: costPrice,
        category,
        tags: rawTags,
        low_stock_threshold: 5,
        notes: sku ? `SKU: ${sku}` : null,
      })
    }
  }

  if (inventoryRows.length === 0) {
    console.log('  Inga nya lagervarianter att lägga till (alla finns redan).')
  } else {
    let inserted = 0
    const batchSize = 50
    for (let i = 0; i < inventoryRows.length; i += batchSize) {
      const batch = inventoryRows.slice(i, i + batchSize)
      const { error } = await supabase.from('inventory').insert(batch)
      if (error) {
        console.error(`  Fel i batch ${i}–${i + batchSize}:`, error.message)
      } else {
        inserted += batch.length
        process.stdout.write(`\r  ${inserted}/${inventoryRows.length} rader...`)
      }
    }
    console.log(`\n  ✓ ${inserted} lagervarianter inlagda.`)
  }

  console.log('\nKlart!\n')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
