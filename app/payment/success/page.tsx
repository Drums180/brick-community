import Link from 'next/link'

export default function PaymentSuccessPage() {
  return (
    <div style={{ background: 'var(--surface-page)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', fontFamily: 'var(--font-sans)' }}>
      <div style={{ maxWidth: 480, textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, borderRadius: 999, background: 'rgba(47,125,91,0.14)', color: '#2f7d5b', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
        </div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 32, fontWeight: 600, color: 'var(--midnight-500)', margin: '0 0 12px', letterSpacing: '-0.01em' }}>
          ¡Pago exitoso!
        </h1>
        <p style={{ fontSize: 16, color: 'var(--ink-500)', margin: '0 0 32px', lineHeight: 1.65 }}>
          Tu compra fue procesada. El vendedor recibirá una notificación y se pondrá en contacto contigo para coordinar la entrega.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/explorar" style={{ display: 'inline-flex', alignItems: 'center', height: 52, padding: '0 28px', borderRadius: 999, background: 'var(--midnight-500)', color: 'var(--cream-50)', textDecoration: 'none', fontSize: 15, fontWeight: 600, fontFamily: 'var(--font-sans)' }}>
            Seguir explorando
          </Link>
        </div>
      </div>
    </div>
  )
}
