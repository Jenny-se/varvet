import { supabase } from './supabase'

const EXPIRES_IN = 3600 // 1 hour

// Extract storage path from either a full public URL or a plain path
export function extractPath(urlOrPath: string, bucket: string): string {
  if (urlOrPath.startsWith('http')) {
    const marker = `/storage/v1/object/public/${bucket}/`
    const idx = urlOrPath.indexOf(marker)
    if (idx !== -1) return urlOrPath.slice(idx + marker.length)
  }
  return urlOrPath
}

// Generate a single signed URL
export async function signedUrl(bucket: string, pathOrUrl: string): Promise<string | null> {
  if (!pathOrUrl) return null
  const path = extractPath(pathOrUrl, bucket)
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, EXPIRES_IN)
  if (error || !data) return null
  return data.signedUrl
}

// Generate signed URLs for multiple paths, returns id → signedUrl map
export async function signedUrls(
  bucket: string,
  items: { id: string; pathOrUrl: string }[]
): Promise<Record<string, string>> {
  const paths = items.map(i => extractPath(i.pathOrUrl, bucket))
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrls(paths, EXPIRES_IN)
  if (error || !data) return {}
  const result: Record<string, string> = {}
  data.forEach((entry, idx) => {
    if (entry.signedUrl) result[items[idx].id] = entry.signedUrl
  })
  return result
}

// Open a signed download URL in a new tab
export async function downloadSigned(bucket: string, pathOrUrl: string, filename: string) {
  const url = await signedUrl(bucket, pathOrUrl)
  if (!url) return
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.target = '_blank'
  a.click()
}
