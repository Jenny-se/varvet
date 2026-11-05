/**
 * Lagersynk mellan appen och Shopify – körs av GitHub Actions var 15:e minut.
 * Logiken finns i lib/shopifySync.mjs (används också av knappen i appen).
 *
 * Usage:
 *   node scripts/shopify-sync.mjs            # synka
 *   node scripts/shopify-sync.mjs --dry-run  # visa vad som skulle hända, ändra inget
 *
 * Env (eller .env.local): SUPABASE_URL / NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
 *   SHOPIFY_STORE_DOMAIN, SHOPIFY_CLIENT_ID, SHOPIFY_CLIENT_SECRET
 */

import * as fs from 'fs'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'
import { runShopifySync } from '../lib/shopifySync.mjs'

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

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const { SHOPIFY_STORE_DOMAIN, SHOPIFY_CLIENT_ID, SHOPIFY_CLIENT_SECRET } = process.env
// Tål citattecken om nyckeln klistrats in som GitHub-secret direkt från .env.local
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim().replace(/^["']|["']$/g, '')

for (const [name, value] of Object.entries({ SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SHOPIFY_STORE_DOMAIN, SHOPIFY_CLIENT_ID, SHOPIFY_CLIENT_SECRET })) {
  if (!value) { console.error(`Saknar ${name}`); process.exit(1) }
}

const { summary } = await runShopifySync({
  supabase: createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } }),
  shopify: { domain: SHOPIFY_STORE_DOMAIN, clientId: SHOPIFY_CLIENT_ID, clientSecret: SHOPIFY_CLIENT_SECRET },
  dryRun: process.argv.includes('--dry-run'),
})
console.log(summary)
