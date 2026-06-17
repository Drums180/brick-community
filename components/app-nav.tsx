'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

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

  const linkStyle = (href: string): React.CSSProperties => ({
    fontSize: 14, fontWeight: 500, textDecoration: 'none', padding: '6px 12px',
    borderRadius: 8, transition: 'background 140ms',
    color: path === href ? 'var(--midnight-500)' : 'var(--ink-500)',
    background: path === href ? 'var(--midnight-a10)' : 'transparent',
  })

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
        <Link href="/inventario" style={linkStyle('/inventario')}>Inventario</Link>
        <Link href="/wishlist" style={linkStyle('/wishlist')}>Wishlist</Link>

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

        <div style={{
          width: 38, height: 38, borderRadius: 999,
          background: 'var(--midnight-500)', color: 'var(--cream-50)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 700, cursor: 'pointer', marginLeft: 4,
          flexShrink: 0,
        }}>
          BC
        </div>
      </div>
    </nav>
  )
}
