import { AppNav } from '@/components/app-nav'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function InventarioPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: listings } = user
    ? await supabase
        .from('listings')
        .select('*')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false })
    : { data: [] }

  return (
    <div style={{ background: 'var(--surface-page)', minHeight: '100vh', fontFamily: 'var(--font-sans)' }}>
      <AppNav />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 24px 80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: 34, color: 'var(--midnight-500)', margin: 0, letterSpacing: '-0.01em' }}>
            Mi inventario
          </h1>
          <Link href="/vender" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 42, padding: '0 20px', borderRadius: 999, background: 'var(--brick-500)', color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-sans)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
            Publicar anuncio
          </Link>
        </div>

        {!listings || listings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 20px', display: 'block', opacity: 0.35 }}><path d="M20 7H4a2 2 0 0 0-2 2v6c0 1.1.9 2 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
            <p style={{ fontSize: 17, margin: '0 0 8px', fontWeight: 600, color: 'var(--text-strong)' }}>Aún no tienes anuncios</p>
            <p style={{ fontSize: 14, margin: '0 0 24px' }}>Publica tu primer LEGO y empieza a vender o intercambiar.</p>
            <Link href="/vender" style={{ display: 'inline-flex', alignItems: 'center', height: 48, padding: '0 24px', borderRadius: 999, background: 'var(--midnight-500)', color: 'var(--cream-50)', textDecoration: 'none', fontWeight: 600, fontSize: 15, fontFamily: 'var(--font-sans)' }}>
              Publicar mi primer anuncio
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
            {listings.map((l: Record<string, unknown>) => (
              <Link key={l.id as string} href={`/listing/${l.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ height: 140, background: 'var(--midnight-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cream-200)' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 15h6M9 12h2"/></svg>
                </div>
                <div style={{ padding: '14px 16px' }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-strong)', margin: '0 0 6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.title as string}</p>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
                    {l.price ? `$${(l.price as number).toLocaleString('es-MX')} MXN` : 'Intercambio'} · {l.city as string}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <footer style={{ borderTop: '1px solid var(--border-subtle)', padding: '28px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
        Brick <b style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, color: 'var(--brick-red)' }}>Community</b> · Beta
      </footer>
    </div>
  )
}
