import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { runShopifySync } from '@/lib/shopifySync.mjs'

// Manuell lagersynk från appen. Samma synk som GitHub Actions kör var 15:e minut.
export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const { SHOPIFY_STORE_DOMAIN, SHOPIFY_CLIENT_ID, SHOPIFY_CLIENT_SECRET } = process.env
  if (!url || !serviceKey || !SHOPIFY_STORE_DOMAIN || !SHOPIFY_CLIENT_ID || !SHOPIFY_CLIENT_SECRET) {
    return NextResponse.json({ error: 'Synken är inte konfigurerad (miljövariabler saknas i Vercel).' }, { status: 500 })
  }

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } })

  // Bara inloggade användare i appen
  const accessToken = request.headers.get('authorization')?.replace(/^Bearer /, '')
  const { data: { user } } = accessToken ? await supabase.auth.getUser(accessToken) : { data: { user: null } }
  if (!user) return NextResponse.json({ error: 'Inte inloggad.' }, { status: 401 })

  try {
    const result = await runShopifySync({
      supabase,
      shopify: { domain: SHOPIFY_STORE_DOMAIN, clientId: SHOPIFY_CLIENT_ID, clientSecret: SHOPIFY_CLIENT_SECRET },
      log: () => {},
    })
    await supabase.from('activity_feed').insert({
      action: 'Synkade lagret med Shopify', entity_type: 'shopify_sync', entity_name: result.summary, user_email: user.email ?? null,
    })
    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 })
  }
}
