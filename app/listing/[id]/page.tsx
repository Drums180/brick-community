'use client'

import { use } from 'react'
import Link from 'next/link'
import { AppNav } from '../../../components/app-nav'
import { MOCK_LISTINGS, formatAge, formatPrice } from '../../../lib/mock-data'
import type { Listing } from '../../../lib/types'

// ─── Primitives ───────────────────────────────────────────────────────────────

function BrickSVG({ color, size = 80 }: { color: string; size?: number }) {
  const h = Math.round(size * 0.76)
  return (
    <svg width={size} height={h} viewBox="0 0 50 38" fill="none" aria-hidden>
      <rect x="1" y="10" width="48" height="27" rx="5" fill={color} opacity="0.4"/>
      <ellipse cx="14.5" cy="10" rx="9" ry="5.5" fill={color} opacity="0.5"/>
      <ellipse cx="35.5" cy="10" rx="9" ry="5.5" fill={color} opacity="0.5"/>
      <ellipse cx="14.5" cy="4.5" rx="7" ry="4" fill={color} opacity="0.4"/>
      <ellipse cx="35.5" cy="4.5" rx="7" ry="4" fill={color} opacity="0.4"/>
    </svg>
  )
}

const CONDITION_CFG = {
  nuevo:       { label: 'Nuevo',       bg: 'rgba(47,125,91,0.14)',  color: '#2f7d5b' },
  como_nuevo:  { label: 'Como nuevo',  bg: 'rgba(13,110,110,0.14)', color: '#0d6e6e' },
  buen_estado: { label: 'Buen estado', bg: 'rgba(180,83,9,0.14)',   color: '#b45309' },
  con_uso:     { label: 'Con uso',     bg: 'rgba(110,104,98,0.14)', color: '#6e6862' },
}

const TYPE_CFG = {
  venta:       { label: 'Venta directa',  bg: 'var(--midnight-a10)', color: 'var(--midnight-500)' },
  intercambio: { label: 'Intercambio',    bg: 'rgba(244,216,135,0.3)', color: '#8a7000' },
  en_vivo:     { label: '● En Vivo',      bg: 'rgba(173,9,34,0.1)',  color: 'var(--brick-500)' },
}

// ─── Main listing content ─────────────────────────────────────────────────────

function ListingDetail({ listing }: { listing: Listing }) {
  const condCfg = CONDITION_CFG[listing.condition]
  const typeCfg = TYPE_CFG[listing.type]
  const isLive = listing.type === 'en_vivo'
  const isSwap = listing.type === 'intercambio'

  const waMessage = encodeURIComponent(
    `Hola ${listing.seller.name}, vi tu anuncio de "${listing.title}" en Brick Community y me interesa. ¿Sigue disponible?`
  )

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px 80px' }}>
      {/* Back link */}
      <Link href="/explorar" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--text-muted)', textDecoration: 'none', marginBottom: 24, fontWeight: 500 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        Volver al mercado
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 40, alignItems: 'start' }}>

        {/* ── Left: image ── */}
        <div>
          {/* Main image */}
          <div style={{ borderRadius: 20, overflow: 'hidden', background: listing.bgColor, aspectRatio: '4/3', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, position: 'relative', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 40%, ${listing.accentColor}28, transparent 65%)` }} />
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <BrickSVG color={listing.accentColor} size={100} />
              <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: listing.accentColor, opacity: 0.7 }}>
                {listing.theme}
              </span>
              {listing.legoSetNumber && (
                <span style={{ fontSize: 13, color: listing.accentColor, opacity: 0.5, fontWeight: 600 }}>
                  Set #{listing.legoSetNumber}
                </span>
              )}
            </div>
            {isLive && (
              <div style={{ position: 'absolute', top: 16, left: 16, display: 'flex', alignItems: 'center', gap: 7, background: 'var(--brick-500)', color: '#fff', fontSize: 13, fontWeight: 700, padding: '6px 14px', borderRadius: 999 }}>
                <span style={{ width: 8, height: 8, borderRadius: 999, background: '#fff', animation: 'livePulse 2s infinite', display: 'inline-block' }} />
                EN VIVO
              </div>
            )}
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 24, marginTop: 16, padding: '0 4px' }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              {listing.views} visitas
            </span>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              {listing.saved} guardados
            </span>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', marginLeft: 'auto' }}>
              Publicado {formatAge(listing.daysAgo)}
            </span>
          </div>
        </div>

        {/* ── Right: details ── */}
        <div style={{ position: 'sticky', top: 80 }}>
          {/* Badges */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
            <span style={{ fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 999, background: condCfg.bg, color: condCfg.color }}>
              {condCfg.label}
            </span>
            <span style={{ fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 999, background: typeCfg.bg, color: typeCfg.color }}>
              {typeCfg.label}
            </span>
            <span style={{ fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 999, background: 'var(--midnight-a06)', color: 'var(--midnight-500)' }}>
              {listing.theme}
            </span>
          </div>

          {/* Title */}
          <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: 28, color: 'var(--text-strong)', margin: '0 0 16px', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
            {listing.title}
          </h1>

          {/* Price */}
          <div style={{ marginBottom: 20 }}>
            {isSwap && listing.price === 0 ? (
              <div>
                <span style={{ fontSize: 28, fontWeight: 700, color: 'var(--midnight-500)' }}>Intercambio</span>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '4px 0 0' }}>Sin costo — propone tu intercambio</p>
              </div>
            ) : (
              <div>
                <span style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-strong)', letterSpacing: '-0.02em' }}>{formatPrice(listing.price)}</span>
                {listing.priceNegotiable && (
                  <span style={{ marginLeft: 10, fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', background: 'var(--cream-200)', padding: '3px 9px', borderRadius: 999 }}>Precio negociable</span>
                )}
              </div>
            )}
          </div>

          <div style={{ height: 1, background: 'var(--border-subtle)', marginBottom: 20 }} />

          {/* Description */}
          <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase', margin: '0 0 10px' }}>Descripción</h3>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text-body)', margin: '0 0 24px' }}>
            {listing.description}
          </p>

          <div style={{ height: 1, background: 'var(--border-subtle)', marginBottom: 20 }} />

          {/* Seller card */}
          <div style={{ background: 'var(--surface-raised)', border: '1px solid var(--border-subtle)', borderRadius: 14, padding: '16px 18px', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 999, background: listing.seller.avatarBg, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, flexShrink: 0 }}>
                {listing.seller.avatarInitials}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-strong)' }}>{listing.seller.name}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
                  {listing.city} · {listing.seller.totalSales} ventas
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#f4d887' }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-strong)' }}>{listing.seller.rating.toFixed(1)}</span>
                </div>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>vendedor</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <a
              href={`https://wa.me/?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                height: 52, borderRadius: 999, background: '#25d366', color: '#fff',
                fontSize: 16, fontWeight: 600, textDecoration: 'none', fontFamily: 'var(--font-sans)',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
              Contactar por WhatsApp
            </a>

            {isSwap ? (
              <button style={{ height: 52, borderRadius: 999, border: '1.5px solid var(--midnight-500)', background: 'transparent', color: 'var(--midnight-500)', fontSize: 16, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>
                Proponer intercambio
              </button>
            ) : (
              <button style={{ height: 52, borderRadius: 999, border: '1.5px solid var(--border-subtle)', background: 'transparent', color: 'var(--text-strong)', fontSize: 16, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                Guardar en wishlist
              </button>
            )}
          </div>

          {/* Location */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 18, fontSize: 13, color: 'var(--text-muted)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {listing.city}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const listing = MOCK_LISTINGS.find(l => l.id === id)

  return (
    <div style={{ background: 'var(--surface-page)', minHeight: '100vh', fontFamily: 'var(--font-sans)' }}>
      <AppNav />
      {listing ? (
        <ListingDetail listing={listing} />
      ) : (
        <div style={{ maxWidth: 600, margin: '80px auto', textAlign: 'center', padding: '0 24px' }}>
          <p style={{ fontSize: 48, margin: '0 0 16px' }}>🧱</p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 28, color: 'var(--midnight-500)', margin: '0 0 12px' }}>Anuncio no encontrado</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Es posible que el anuncio haya sido eliminado o el enlace sea incorrecto.</p>
          <Link href="/explorar" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: 48, padding: '0 24px', borderRadius: 999, background: 'var(--midnight-500)', color: 'var(--cream-50)', textDecoration: 'none', fontWeight: 600, fontSize: 15, fontFamily: 'var(--font-sans)' }}>
            Ver todos los anuncios
          </Link>
        </div>
      )}
      <footer style={{ borderTop: '1px solid var(--border-subtle)', padding: '28px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
        Brick <b style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, color: 'var(--brick-red)' }}>Community</b> · Marketplace LEGO México · Beta
      </footer>
    </div>
  )
}
