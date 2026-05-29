'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Fel e-post eller lösenord.')
      setLoading(false)
    }
    // On success, AuthProvider detects the session and redirects to /dashboard
  }

  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/varvet_logo.jpg"
            alt="Varvet"
            width={72}
            height={72}
            className="rounded-2xl shadow-sm mb-4"
          />
          <h1 className="text-2xl font-semibold text-warm-900 tracking-tight">Varvet</h1>
          <p className="text-sm text-warm-500 mt-1">Studio CRM · Gustavsberg</p>
        </div>

        {/* Form */}
        <div className="card p-6">
          <h2 className="text-sm font-semibold text-warm-800 mb-5">Logga in</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="label">E-post</label>
              <input
                type="email"
                className="input-field"
                placeholder="din@epost.se"
                required
                autoFocus
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="label">Lösenord</label>
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5 disabled:opacity-60 mt-2"
            >
              {loading ? 'Loggar in…' : 'Logga in'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-warm-400 mt-6">
          Varvet · Naturfiber &amp; gemenskap
        </p>
      </div>
    </div>
  )
}
