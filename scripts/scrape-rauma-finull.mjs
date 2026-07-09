import * as cheerio from 'cheerio'
import { createClient } from '@supabase/supabase-js'

const PAGE_URL = 'https://garnr.se/p/rauma-finull/'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function scrape() {
  console.log(`Fetching ${PAGE_URL}...`)
  const res = await fetch(PAGE_URL, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; stock-tracker/1.0; +https://github.com/Jenny-se/varvet)' },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const html = await res.text()
  const $ = cheerio.load(html)

  const records = []

  // Strategy: find all links matching the color URL pattern /p/rauma-finull-[name]-[number]/
  // Then search for "i lager" text within the same container.
  $('a[href*="/p/rauma-finull-"]').each((_, el) => {
    const href = $(el).attr('href') ?? ''

    // Extract color number (last numeric segment) and slug from URL
    // e.g. /p/rauma-finull-lys-gra-403/ → number: 403, slug: lys-gra
    const urlMatch = href.match(/\/p\/rauma-finull-(.+?)-(\d+)\/?$/)
    if (!urlMatch) return

    const colorNumber = urlMatch[1]  // e.g. "lys-gra"
    const colorNumberId = urlMatch[2] // e.g. "403"

    // Get display name: prefer link text, fall back to slug
    const linkText = $(el).text().trim()
    // Link text might be "403 Lys grå" or just "Lys grå" — clean it up
    const colorName = linkText.replace(/^\d+\s*/, '').trim() || colorNumber.replace(/-/g, ' ')

    // Search for "i lager" in the link itself, then its parent containers
    let quantity = null
    const searchTargets = [$(el), $(el).parent(), $(el).parent().parent(), $(el).closest('li, article')]
    for (const $target of searchTargets) {
      $target.find('*').addBack().each((_, child) => {
        if (quantity !== null) return
        if ($(child).children().length > 0) return
        const text = $(child).text().trim()
        const stockMatch = text.match(/^(\d+)\s+i\s+lager$/i)
        if (stockMatch) quantity = parseInt(stockMatch[1], 10)
      })
      if (quantity !== null) break
    }

    // Also try regex on the container's full text as fallback
    if (quantity === null) {
      const containerText = $(el).closest('li, article, div').text()
      const fallback = containerText.match(/(\d+)\s+i\s+lager/i)
      if (fallback) quantity = parseInt(fallback[1], 10)
    }

    if (quantity === null) return // skip if no stock info found

    console.log(`  ${colorNumberId} ${colorName}: ${quantity} i lager`)
    records.push({ color_name: colorName, color_number: colorNumberId, quantity })
  })

  if (records.length === 0) {
    console.warn('No stock data found — page structure may have changed.')
    process.exit(1)
  }

  const snapshotDate = new Date().toISOString().split('T')[0]
  console.log(`\nFound ${records.length} colors. Inserting for ${snapshotDate}...`)

  // Delete today's existing records before re-inserting (allows re-runs)
  await supabase
    .from('stock_snapshots')
    .delete()
    .eq('snapshot_date', snapshotDate)
    .eq('product_url', PAGE_URL)

  const { error } = await supabase.from('stock_snapshots').insert(
    records.map(r => ({
      product_url: PAGE_URL,
      color_name: r.color_name,
      color_number: r.color_number,
      quantity: r.quantity,
      snapshot_date: snapshotDate,
    }))
  )

  if (error) {
    console.error('Database error:', error.message)
    process.exit(1)
  }

  console.log(`Done. Saved ${records.length} records.`)
}

scrape().catch(err => {
  console.error(err)
  process.exit(1)
})
