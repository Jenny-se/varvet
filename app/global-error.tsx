'use client'

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="sv">
      <body style={{ background: '#FAF8F5', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#5C5651', marginBottom: '1rem' }}>Något gick fel.</p>
          <button
            onClick={reset}
            style={{ background: '#527A52', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}
          >
            Försök igen
          </button>
        </div>
      </body>
    </html>
  )
}
