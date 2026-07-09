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

  // Find all elements whose text matches "[number] i lager"
  $('*').each((_, el) => {
    const text = $(el).children().length === 0 ? $(el).text().trim() : null
    if (!text) return
    const match = text.match(/^(\d+)\s+i\s+lager$/i)
    if (!match) return

    const quantity = parseInt(match[1], 10)

    // Walk up to find the closest container with a link or image for color info
    const container = $(el).closest('li, article, div[class]')
    const link = container.find('a').first()
    const img = container.find('img').first()

    // Try to extract color number and name from link text or image alt
    let colorName = link.text().trim() || img.attr('alt') || ''
    let colorNumber = null

    // Color entries often look like "400 Hvit" or alt "Rauma Finull | 400 Hvit"
    const altText = img.attr('alt') ?? ''
    const nameMatch = altText.match(/\|\s*(\d+)\s+(.+)$/) ?? colorName.match(/^(\d+)\s+(.+)$/)
    if (nameMatch) {
      colorNumber = nameMatch[1]
      colorName = nameMatch[2].trim()
    }

    records.push({ color_name: colorName || null, color_number: colorNumber, quantity })
  })

  if (records.length === 0) {
    console.warn('No stock data found — page structure may have changed.')
    process.exit(1)
  }

  const snapshotDate = new Date().toISOString().split('T')[0]
  console.log(`Found ${records.length} colors. Inserting for ${snapshotDate}...`)

  // Check if we already scraped today to avoid duplicates
  const { count } = await supabase
    .from('stock_snapshots')
    .select('id', { count: 'exact', head: true })
    .eq('snapshot_date', snapshotDate)
    .eq('product_url', PAGE_URL)

  if (count && count > 0) {
    console.log(`Already scraped today (${count} records). Skipping.`)
    return
  }

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
