'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ position: 'relative', width: 32, height: 26, flexShrink: 0 }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: 7, background: 'var(--brick-red)', boxShadow: 'var(--shadow-sm)' }} />
        <div style={{ position: 'absolute', top: -5, left: 4, right: 4, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{ height: 9, borderRadius: 999, background: 'var(--brick-400)', border: '1.2px solid var(--brick-600)' }} />
          ))}
        </div>
      </div>
      <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: 20, lineHeight: 1, letterSpacing: '-0.01em', color: 'var(--midnight-500)', whiteSpace: 'nowrap' }}>
        Brick <b style={{ color: 'var(--brick-red)', fontWeight: 600 }}>Community</b>
      </span>
    </div>
  )
}

export function AppNav() {
  const path = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    setMenuOpen(false)
    router.push('/explorar')
    router.refresh()
  }

  const linkStyle = (href: string): React.CSSProperties => ({
    fontSize: 14, fontWeight: 500, textDecoration: 'none', padding: '6px 12px',
    borderRadius: 8, transition: 'background 140ms',
    color: path === href ? 'var(--midnight-500)' : 'var(--ink-500)',
    background: path === href ? 'var(--midnight-a10)' : 'transparent',
  })

  const initials = user?.user_metadata?.name
    ? (user.user_metadata.name as string).split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() ?? 'BC'

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 60,
      background: 'rgba(246,237,231,0.92)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto', padding: '0 24px',
        height: 60, display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <Link href="/" style={{ textDecoration: 'none', marginRight: 16 }}>
          <Logo />
        </Link>

        <Link href="/explorar" style={linkStyle('/explorar')}>Explorar</Link>
        {user && <Link href="/inventario" style={linkStyle('/inventario')}>Inventario</Link>}
        {user && <Link href="/wishlist" style={linkStyle('/wishlist')}>Wishlist</Link>}

        <div style={{ flex: 1 }} />

        <Link href="/vender" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          height: 38, padding: '0 18px', borderRadius: 999,
          background: 'var(--brick-500)', color: '#fff',
          fontSize: 14, fontWeight: 600, textDecoration: 'none',
          letterSpacing: '-0.01em',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
          Publicar
        </Link>

        {user ? (
          <div style={{ position: 'relative', marginLeft: 4 }}>
            <button
              onClick={() => setMenuOpen(o => !o)}
              style={{
                width: 38, height: 38, borderRadius: 999,
                background: 'var(--midnight-500)', color: 'var(--cream-50)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700, cursor: 'pointer', border: 'none',
                flexShrink: 0,
              }}
            >
              {initials}
            </button>

            {menuOpen && (
              <>
                <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 10 }} />
                <div style={{
                  position: 'absolute', top: '110%', right: 0, zIndex: 20,
                  background: 'var(--surface-raised)', border: '1px solid var(--border-subtle)',
                  borderRadius: 12, boxShadow: 'var(--shadow-lg)', minWidth: 180,
                  overflow: 'hidden',
                }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user.user_metadata?.name || user.email}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user.email}
                    </div>
                  </div>
                  <Link href="/inventario" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '11px 16px', fontSize: 14, color: 'var(--text-strong)', textDecoration: 'none' }}>Mi inventario</Link>
                  <Link href="/wishlist" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '11px 16px', fontSize: 14, color: 'var(--text-strong)', textDecoration: 'none' }}>Mi wishlist</Link>
                  <button onClick={handleSignOut} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '11px 16px', fontSize: 14, color: 'var(--brick-500)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)', borderTop: '1px solid var(--border-subtle)' }}>
                    Cerrar sesión
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <Link href="/auth/sign-in" style={{
            display: 'inline-flex', alignItems: 'center',
            height: 38, padding: '0 16px', borderRadius: 999,
            border: '1px solid var(--border-subtle)', background: 'var(--surface-raised)',
            color: 'var(--midnight-500)', fontSize: 14, fontWeight: 600, textDecoration: 'none',
            marginLeft: 4,
          }}>
            Entrar
          </Link>
        )}
      </div>
    </nav>
  )
}
