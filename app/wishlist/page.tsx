import { AppNav } from '@/components/app-nav'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function WishlistPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: items } = user
    ? await supabase
        .from('wishlist_items')
        .select('listing_id, listings(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
    : { data: [] }

  return (
    <div style={{ background: 'var(--surface-page)', minHeight: '100vh', fontFamily: 'var(--font-sans)' }}>
      <AppNav />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 24px 80px' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: 34, color: 'var(--midnight-500)', margin: '0 0 8px', letterSpacing: '-0.01em' }}>
          Mi Wishlist
        </h1>
        <p style={{ fontSize: 15, color: 'var(--text-muted)', margin: '0 0 32px' }}>
          Guarda los sets que te interesan y te avisaremos cuando aparezcan cerca de ti.
        </p>

        {!items || items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 20px', display: 'block', opacity: 0.35 }}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            <p style={{ fontSize: 17, margin: '0 0 8px', fontWeight: 600, color: 'var(--text-strong)' }}>Tu wishlist está vacía</p>
            <p style={{ fontSize: 14, margin: '0 0 24px' }}>Guarda anuncios que te interesen desde el marketplace.</p>
            <Link href="/explorar" style={{ display: 'inline-flex', alignItems: 'center', height: 48, padding: '0 24px', borderRadius: 999, background: 'var(--midnight-500)', color: 'var(--cream-50)', textDecoration: 'none', fontWeight: 600, fontSize: 15, fontFamily: 'var(--font-sans)' }}>
              Explorar el marketplace
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
            {items.map((item: Record<string, unknown>) => {
              const l = item.listings as Record<string, unknown>
              if (!l) return null
              return (
                <Link key={item.listing_id as string} href={`/listing/${l.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ height: 140, background: 'var(--midnight-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cream-200)' }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  </div>
                  <div style={{ padding: '14px 16px' }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-strong)', margin: '0 0 6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.title as string}</p>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
                      {l.price ? `$${(l.price as number).toLocaleString('es-MX')} MXN` : 'Intercambio'} · {l.city as string}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
      <footer style={{ borderTop: '1px solid var(--border-subtle)', padding: '28px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
        Brick <b style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, color: 'var(--brick-red)' }}>Community</b> · Beta
      </footer>
    </div>
  )
}
