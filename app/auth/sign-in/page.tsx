'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
      <div style={{ position: 'relative', width: 32, height: 26, flexShrink: 0 }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: 7, background: 'var(--brick-red)' }} />
        <div style={{ position: 'absolute', top: -5, left: 4, right: 4, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{ height: 9, borderRadius: 999, background: 'var(--brick-400)', border: '1.2px solid var(--brick-600)' }} />
          ))}
        </div>
      </div>
      <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: 22, color: 'var(--midnight-500)' }}>
        Brick <b style={{ color: 'var(--brick-red)' }}>Community</b>
      </span>
    </div>
  )
}

function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/explorar'

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Correo o contraseña incorrectos.')
      setLoading(false)
      return
    }

    router.push(next)
    router.refresh()
  }

  return (
    <div style={{ background: 'var(--surface-page)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', fontFamily: 'var(--font-sans)' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link href="/" style={{ textDecoration: 'none' }}><Logo /></Link>
        </div>

        <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 20, padding: '36px 32px', boxShadow: 'var(--shadow-md)' }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 600, color: 'var(--midnight-500)', margin: '0 0 6px', letterSpacing: '-0.01em' }}>
            Iniciar sesión
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '0 0 28px' }}>
            ¿No tienes cuenta?{' '}
            <Link href={`/auth/sign-up${next !== '/explorar' ? `?next=${next}` : ''}`} style={{ color: 'var(--midnight-500)', fontWeight: 600 }}>
              Regístrate gratis
            </Link>
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-strong)', marginBottom: 6 }}>Correo electrónico</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="tucorreo@ejemplo.com"
                style={{ width: '100%', height: 48, padding: '0 14px', fontSize: 15, border: '1px solid var(--border-subtle)', borderRadius: 10, background: 'var(--surface-raised)', color: 'var(--text-strong)', fontFamily: 'var(--font-sans)', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-strong)', marginBottom: 6 }}>Contraseña</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)} required
                placeholder="Tu contraseña"
                style={{ width: '100%', height: 48, padding: '0 14px', fontSize: 15, border: '1px solid var(--border-subtle)', borderRadius: 10, background: 'var(--surface-raised)', color: 'var(--text-strong)', fontFamily: 'var(--font-sans)', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            {error && (
              <div style={{ fontSize: 14, color: 'var(--brick-500)', background: 'rgba(173,9,34,0.08)', borderRadius: 8, padding: '10px 14px' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email || !password}
              style={{ height: 52, borderRadius: 999, border: 'none', background: 'var(--midnight-500)', color: 'var(--cream-50)', fontSize: 16, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontFamily: 'var(--font-sans)', marginTop: 4, transition: 'opacity 160ms' }}
            >
              {loading ? 'Entrando…' : 'Iniciar sesión'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', marginTop: 20 }}>
          <Link href="/explorar" style={{ color: 'var(--text-muted)' }}>← Volver al marketplace</Link>
        </p>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  )
}
