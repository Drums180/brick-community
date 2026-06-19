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

function SignUpForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/explorar'

  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [done, setDone]         = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 8) { setError('La contraseña debe tener al menos 8 caracteres.'); return }
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${next}`,
      },
    })

    setLoading(false)
    if (error) {
      setError(error.message === 'User already registered' ? 'Ya existe una cuenta con ese correo.' : error.message)
      return
    }

    // If email confirmation is disabled in Supabase, sign in directly
    const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password })
    if (!signInErr) {
      router.push(next)
      router.refresh()
      return
    }

    // Otherwise show confirmation message
    setDone(true)
  }

  if (done) {
    return (
      <div style={{ background: 'var(--surface-page)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', fontFamily: 'var(--font-sans)' }}>
        <div style={{ maxWidth: 420, textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: 999, background: 'rgba(47,125,91,0.14)', color: '#2f7d5b', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 26, color: 'var(--midnight-500)', margin: '0 0 12px' }}>Revisa tu correo</h2>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.65 }}>
            Te enviamos un enlace de confirmación a <b>{email}</b>. Haz clic en él para activar tu cuenta.
          </p>
          <Link href="/explorar" style={{ display: 'inline-block', marginTop: 24, color: 'var(--midnight-500)', fontWeight: 600 }}>Volver al marketplace</Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--surface-page)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', fontFamily: 'var(--font-sans)' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link href="/" style={{ textDecoration: 'none' }}><Logo /></Link>
        </div>

        <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 20, padding: '36px 32px', boxShadow: 'var(--shadow-md)' }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 600, color: 'var(--midnight-500)', margin: '0 0 6px', letterSpacing: '-0.01em' }}>
            Crear cuenta
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '0 0 28px' }}>
            ¿Ya tienes cuenta?{' '}
            <Link href={`/auth/sign-in${next !== '/explorar' ? `?next=${next}` : ''}`} style={{ color: 'var(--midnight-500)', fontWeight: 600 }}>
              Inicia sesión
            </Link>
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-strong)', marginBottom: 6 }}>Nombre</label>
              <input
                type="text" value={name} onChange={e => setName(e.target.value)} required
                placeholder="¿Cómo te llamas?"
                style={{ width: '100%', height: 48, padding: '0 14px', fontSize: 15, border: '1px solid var(--border-subtle)', borderRadius: 10, background: 'var(--surface-raised)', color: 'var(--text-strong)', fontFamily: 'var(--font-sans)', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
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
                placeholder="Mínimo 8 caracteres"
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
              disabled={loading || !name || !email || !password}
              style={{ height: 52, borderRadius: 999, border: 'none', background: 'var(--brick-500)', color: '#fff', fontSize: 16, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontFamily: 'var(--font-sans)', marginTop: 4, transition: 'opacity 160ms' }}
            >
              {loading ? 'Creando cuenta…' : 'Crear cuenta gratis'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', marginTop: 16, lineHeight: 1.6 }}>
          Al registrarte aceptas que esto es una beta. No hay afiliación con LEGO®.
        </p>
      </div>
    </div>
  )
}

export default function SignUpPage() {
  return (
    <Suspense>
      <SignUpForm />
    </Suspense>
  )
}
