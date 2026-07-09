import * as cheerio from 'cheerio'
import { createClient } from '@supabase/supabase-js'

const PAGES = [
  'https://garnr.se/p/rauma-finull/',
  'https://garnr.se/p/rauma-fivel/',
  'https://garnr.se/p/rauma-lamull/',
]

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function scrapePage(pageUrl) {
  // Derive the product slug from the URL, e.g. "rauma-finull"
  const productSlug = pageUrl.match(/\/p\/([^/]+)\/?$/)?.[1] ?? ''

  console.log(`\nFetching ${pageUrl}...`)
  const res = await fetch(pageUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; stock-tracker/1.0; +https://github.com/Jenny-se/varvet)' },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${pageUrl}`)
  const html = await res.text()
  const $ = cheerio.load(html)

  const records = []

  // Find all links matching /p/[product-slug]-[color-slug]-[number]/
  $(`a[href*="/p/${productSlug}-"]`).each((_, el) => {
    const href = $(el).attr('href') ?? ''

    const urlMatch = href.match(new RegExp(`/p/${productSlug}-(.+?)-(\\d+)/?$`))
    if (!urlMatch) return

    const colorSlug = urlMatch[1]
    const colorNumber = urlMatch[2]

    const linkText = $(el).text().trim()
    const colorName = linkText.replace(/^\d+\s*/, '').trim() || colorSlug.replace(/-/g, ' ')

    let quantity = null
    const searchTargets = [$(el), $(el).parent(), $(el).parent().parent(), $(el).closest('li, article')]
    for (const $target of searchTargets) {
      $target.find('*').addBack().each((_, child) => {
        if (quantity !== null) return
        if ($(child).children().length > 0) return
        const stockMatch = $(child).text().trim().match(/^(\d+)\s+i\s+lager$/i)
        if (stockMatch) quantity = parseInt(stockMatch[1], 10)
      })
      if (quantity !== null) break
    }

    if (quantity === null) {
      const containerText = $(el).closest('li, article, div').text()
      const fallback = containerText.match(/(\d+)\s+i\s+lager/i)
      if (fallback) quantity = parseInt(fallback[1], 10)
    }

    if (quantity === null) return

    console.log(`  ${colorNumber} ${colorName}: ${quantity} i lager`)
    records.push({ color_name: colorName, color_number: colorNumber, quantity })
  })

  console.log(`  → ${records.length} färger hittade`)
  return records
}

async function scrape() {
  const snapshotDate = new Date().toISOString().split('T')[0]
  let totalSaved = 0

  for (const pageUrl of PAGES) {
    const records = await scrapePage(pageUrl)

    if (records.length === 0) {
      console.warn(`Inga färger hittades för ${pageUrl} — sidstrukturen kan ha ändrats.`)
      continue
    }

    // Delete today's existing records before re-inserting (allows re-runs)
    await supabase
      .from('stock_snapshots')
      .delete()
      .eq('snapshot_date', snapshotDate)
      .eq('product_url', pageUrl)

    const { error } = await supabase.from('stock_snapshots').insert(
      records.map(r => ({
        product_url: pageUrl,
        color_name: r.color_name,
        color_number: r.color_number,
        quantity: r.quantity,
        snapshot_date: snapshotDate,
      }))
    )

    if (error) {
      console.error(`Databasfel för ${pageUrl}:`, error.message)
    } else {
      totalSaved += records.length
    }
  }

  console.log(`\nKlart. Totalt sparade ${totalSaved} poster för ${snapshotDate}.`)
}

scrape().catch(err => {
  console.error(err)
  process.exit(1)
})
