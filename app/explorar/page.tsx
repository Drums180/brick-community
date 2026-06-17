'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { AppNav } from '../../components/app-nav'
import { MOCK_LISTINGS, formatAge, formatPrice } from '../../lib/mock-data'
import type { Listing, ModeFilter, CatFilter } from '../../lib/types'

// ─── Shared primitives ────────────────────────────────────────────────────────

function BrickSVG({ color, size = 52 }: { color: string; size?: number }) {
  const h = Math.round(size * 0.76)
  return (
    <svg width={size} height={h} viewBox="0 0 50 38" fill="none" aria-hidden>
      <rect x="1" y="10" width="48" height="27" rx="5" fill={color} opacity="0.45"/>
      <ellipse cx="14.5" cy="10" rx="9" ry="5.5" fill={color} opacity="0.55"/>
      <ellipse cx="35.5" cy="10" rx="9" ry="5.5" fill={color} opacity="0.55"/>
      <ellipse cx="14.5" cy="4.5" rx="7" ry="4" fill={color} opacity="0.45"/>
      <ellipse cx="35.5" cy="4.5" rx="7" ry="4" fill={color} opacity="0.45"/>
    </svg>
  )
}

const CONDITION_CFG = {
  nuevo:       { label: 'Nuevo',       bg: 'rgba(47,125,91,0.14)',  color: '#2f7d5b' },
  como_nuevo:  { label: 'Como nuevo',  bg: 'rgba(13,110,110,0.14)', color: '#0d6e6e' },
  buen_estado: { label: 'Buen estado', bg: 'rgba(180,83,9,0.14)',   color: '#b45309' },
  con_uso:     { label: 'Con uso',     bg: 'rgba(110,104,98,0.14)', color: '#6e6862' },
}

function ConditionBadge({ c }: { c: Listing['condition'] }) {
  const cfg = CONDITION_CFG[c]
  return (
    <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 999, background: cfg.bg, color: cfg.color, whiteSpace: 'nowrap' }}>
      {cfg.label}
    </span>
  )
}

// ─── Listing card ─────────────────────────────────────────────────────────────

function ListingCard({ listing }: { listing: Listing }) {
  const [hovered, setHovered] = useState(false)
  const isLive = listing.type === 'en_vivo'
  const isSwap = listing.type === 'intercambio'

  return (
    <Link
      href={`/listing/${listing.id}`}
      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        background: 'var(--surface-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: hovered ? 'var(--shadow-md)' : 'var(--shadow-sm)',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        transition: 'box-shadow 180ms var(--ease-out), transform 180ms var(--ease-out)',
        cursor: 'pointer',
      }}>
        {/* Image area */}
        <div style={{ position: 'relative', height: 200, background: listing.bgColor, overflow: 'hidden' }}>
          {/* Radial glow */}
          <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 40%, ${listing.accentColor}22, transparent 65%)` }} />
          {/* Brick icon */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <BrickSVG color={listing.accentColor} size={52} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: listing.accentColor, opacity: 0.8 }}>
              {listing.theme}
            </span>
          </div>
          {/* Live badge */}
          {isLive && (
            <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', alignItems: 'center', gap: 6, background: 'var(--brick-500)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 999, letterSpacing: '0.04em' }}>
              <span style={{ width: 7, height: 7, borderRadius: 999, background: '#fff', animation: 'livePulse 2s infinite', display: 'inline-block' }} />
              EN VIVO
            </div>
          )}
          {/* Swap badge */}
          {isSwap && !isLive && (
            <div style={{ position: 'absolute', top: 10, left: 10, background: 'var(--brass-500)', color: 'var(--ink-700)', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 999 }}>
              Intercambio
            </div>
          )}
          {/* Saved count */}
          <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)', borderRadius: 999, padding: '4px 8px', color: '#fff', fontSize: 12 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            {listing.saved}
          </div>
          {/* Set number if exists */}
          {listing.legoSetNumber && (
            <div style={{ position: 'absolute', bottom: 10, right: 10, fontSize: 11, color: listing.accentColor, opacity: 0.6, fontWeight: 600 }}>
              #{listing.legoSetNumber}
            </div>
          )}
        </div>

        {/* Card body */}
        <div style={{ padding: '14px 16px 16px' }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 600, lineHeight: 1.4, color: 'var(--text-strong)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: 40 }}>
            {listing.title}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, gap: 8 }}>
            <div>
              {listing.type === 'intercambio' && listing.price === 0 ? (
                <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--midnight-500)' }}>Intercambio</span>
              ) : (
                <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-strong)' }}>
                  {formatPrice(listing.price)}
                  {listing.priceNegotiable && <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--text-muted)', marginLeft: 5 }}>negociable</span>}
                </span>
              )}
            </div>
            <ConditionBadge c={listing.condition} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{
              width: 28, height: 28, borderRadius: 999, flexShrink: 0,
              background: listing.seller.avatarBg, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 700,
            }}>
              {listing.seller.avatarInitials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: 13, color: 'var(--text-muted)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {listing.seller.name} · {listing.city}
              </span>
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap', flexShrink: 0 }}>
              {formatAge(listing.daysAgo)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

// ─── Filter pill ──────────────────────────────────────────────────────────────

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '7px 16px', borderRadius: 999, cursor: 'pointer',
        border: active ? '1.5px solid var(--midnight-500)' : '1px solid var(--border-subtle)',
        background: active ? 'var(--midnight-500)' : 'var(--surface-raised)',
        color: active ? 'var(--cream-50)' : 'var(--text-strong)',
        fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 500,
        transition: 'all 140ms var(--ease-out)',
        whiteSpace: 'nowrap',
      }}
    >{children}</button>
  )
}

// ─── Mode tab ─────────────────────────────────────────────────────────────────

function ModeTab({ active, onClick, children, liveCount }: { active: boolean; onClick: () => void; children: React.ReactNode; liveCount?: number }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '9px 18px', cursor: 'pointer', border: 'none', background: 'none',
        fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: active ? 600 : 400,
        color: active ? 'var(--midnight-500)' : 'var(--ink-400)',
        borderBottom: active ? '2px solid var(--midnight-500)' : '2px solid transparent',
        transition: 'all 140ms',
        display: 'flex', alignItems: 'center', gap: 7,
      }}
    >
      {children}
      {liveCount !== undefined && liveCount > 0 && (
        <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: '#fff', background: 'var(--brick-500)', padding: '2px 7px', borderRadius: 999 }}>
          <span style={{ width: 6, height: 6, borderRadius: 999, background: '#fff', animation: 'livePulse 2s infinite', display: 'inline-block' }} />
          {liveCount}
        </span>
      )}
    </button>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const MODES: { key: ModeFilter; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'venta', label: 'Venta' },
  { key: 'intercambio', label: 'Intercambio' },
  { key: 'en_vivo', label: 'En Vivo' },
]

const CATEGORIES: { key: CatFilter; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'sets', label: 'Sets' },
  { key: 'minifiguras', label: 'Minifiguras' },
  { key: 'piezas', label: 'Piezas' },
  { key: 'instrucciones', label: 'Instrucciones' },
]

const CITIES = ['Todas las ciudades', 'Guadalajara', 'Ciudad de México', 'Monterrey', 'Puebla', 'Querétaro']

export default function ExplorarPage() {
  const [mode, setMode] = useState<ModeFilter>('todos')
  const [cat, setCat] = useState<CatFilter>('todos')
  const [city, setCity] = useState('Todas las ciudades')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<'reciente' | 'precio_asc' | 'precio_desc' | 'populares'>('reciente')

  const liveCount = MOCK_LISTINGS.filter(l => l.type === 'en_vivo').length

  const filtered = useMemo(() => {
    let list = [...MOCK_LISTINGS]
    if (mode !== 'todos') list = list.filter(l => l.type === mode)
    if (cat !== 'todos') list = list.filter(l => l.category === cat)
    if (city !== 'Todas las ciudades') list = list.filter(l => l.city === city)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(l =>
        l.title.toLowerCase().includes(q) ||
        l.theme.toLowerCase().includes(q) ||
        l.seller.name.toLowerCase().includes(q) ||
        (l.legoSetNumber && l.legoSetNumber.includes(q))
      )
    }
    if (sort === 'precio_asc') list.sort((a, b) => a.price - b.price)
    else if (sort === 'precio_desc') list.sort((a, b) => b.price - a.price)
    else if (sort === 'populares') list.sort((a, b) => b.views - a.views)
    else list.sort((a, b) => a.daysAgo - b.daysAgo)
    return list
  }, [mode, cat, city, search, sort])

  return (
    <div style={{ background: 'var(--surface-page)', minHeight: '100vh', fontFamily: 'var(--font-sans)' }}>
      <AppNav />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px 64px' }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: 36, color: 'var(--midnight-500)', margin: '0 0 16px', letterSpacing: '-0.01em' }}>
            Explorar el mercado
          </h1>

          {/* Search bar */}
          <div style={{ position: 'relative', maxWidth: 560 }}>
            <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </div>
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar sets, minifiguras, piezas…"
              style={{
                width: '100%', height: 48, paddingLeft: 44, paddingRight: 18,
                fontSize: 15, border: '1.5px solid var(--border-subtle)', borderRadius: 12,
                background: 'var(--surface-raised)', color: 'var(--text-strong)',
                fontFamily: 'var(--font-sans)', outline: 'none',
                boxShadow: 'var(--shadow-xs)',
              }}
            />
          </div>
        </div>

        {/* Mode tabs */}
        <div style={{ borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: 4, marginBottom: 20, overflowX: 'auto' }}>
          {MODES.map(m => (
            <ModeTab key={m.key} active={mode === m.key} onClick={() => setMode(m.key)} liveCount={m.key === 'en_vivo' ? liveCount : undefined}>
              {m.label}
            </ModeTab>
          ))}
        </div>

        {/* Filter row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 28 }}>
          {CATEGORIES.map(c => (
            <Pill key={c.key} active={cat === c.key} onClick={() => setCat(c.key)}>{c.label}</Pill>
          ))}

          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, alignItems: 'center' }}>
            <select
              value={city}
              onChange={e => setCity(e.target.value)}
              style={{
                height: 38, padding: '0 32px 0 12px', borderRadius: 8, fontSize: 14,
                border: '1px solid var(--border-subtle)', background: 'var(--surface-raised)',
                color: 'var(--text-strong)', fontFamily: 'var(--font-sans)', cursor: 'pointer',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%236e6862' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center',
                appearance: 'none',
              }}
            >
              {CITIES.map(c => <option key={c}>{c}</option>)}
            </select>

            <select
              value={sort}
              onChange={e => setSort(e.target.value as typeof sort)}
              style={{
                height: 38, padding: '0 32px 0 12px', borderRadius: 8, fontSize: 14,
                border: '1px solid var(--border-subtle)', background: 'var(--surface-raised)',
                color: 'var(--text-strong)', fontFamily: 'var(--font-sans)', cursor: 'pointer',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%236e6862' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center',
                appearance: 'none',
              }}
            >
              <option value="reciente">Más reciente</option>
              <option value="precio_asc">Precio: menor a mayor</option>
              <option value="precio_desc">Precio: mayor a menor</option>
              <option value="populares">Más vistos</option>
            </select>
          </div>
        </div>

        {/* Result count */}
        <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20 }}>
          {filtered.length === 0
            ? 'Sin resultados'
            : <><b style={{ color: 'var(--text-strong)' }}>{filtered.length}</b> anuncio{filtered.length !== 1 ? 's' : ''}</>}
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
            {filtered.map(l => <ListingCard key={l.id} listing={l} />)}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 16px', display: 'block', opacity: 0.4 }}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <p style={{ fontSize: 16, margin: 0 }}>No encontramos anuncios con esos filtros.</p>
            <button onClick={() => { setMode('todos'); setCat('todos'); setCity('Todas las ciudades'); setSearch('') }}
              style={{ marginTop: 14, cursor: 'pointer', border: 'none', background: 'none', color: 'var(--midnight-500)', fontSize: 14, fontWeight: 600, textDecoration: 'underline', fontFamily: 'var(--font-sans)' }}>
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      <footer style={{ borderTop: '1px solid var(--border-subtle)', padding: '28px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
        Brick <b style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, color: 'var(--brick-red)' }}>Community</b> · Marketplace LEGO México · Beta
      </footer>
    </div>
  )
}
