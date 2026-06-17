'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { AppNav } from '../../components/app-nav'

// ─── Shared icons ─────────────────────────────────────────────────────────────

const IcoCamera = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
)

const IcoUpload = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
)

const IcoCheck = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5"/>
  </svg>
)

const IcoScan = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/>
    <path d="M7 12h10"/>
  </svg>
)

// ─── Card option ──────────────────────────────────────────────────────────────

function CardOpt({ selected, onClick, label, sub }: { selected: boolean; onClick: () => void; label: string; sub?: string }) {
  return (
    <button onClick={onClick} style={{
      textAlign: 'left', cursor: 'pointer', width: '100%', borderRadius: 12,
      padding: '13px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
      border: selected ? '1.5px solid var(--midnight-500)' : '1px solid var(--border-subtle)',
      background: selected ? 'var(--midnight-a06)' : 'var(--surface-raised)',
      boxShadow: selected ? '0 0 0 3px var(--focus-ring)' : 'var(--shadow-xs)',
      fontFamily: 'var(--font-sans)', transition: 'all 160ms var(--ease-out)',
    }}>
      <div>
        <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-strong)' }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{sub}</div>}
      </div>
      {selected && <span style={{ color: 'var(--midnight-500)', flexShrink: 0 }}><IcoCheck /></span>}
    </button>
  )
}

// ─── Progress stepper ─────────────────────────────────────────────────────────

function Stepper({ step, total }: { step: number; total: number }) {
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
      {Array.from({ length: total }, (_, i) => i + 1).map(n => (
        <div key={n} style={{ flex: 1, height: 4, borderRadius: 999, background: n <= step ? 'var(--brick-500)' : 'var(--surface-sunken)', transition: 'background 300ms' }} />
      ))}
    </div>
  )
}

// ─── Scanning animation ───────────────────────────────────────────────────────

function ScanningState() {
  return (
    <div style={{ textAlign: 'center', padding: '48px 0' }}>
      <div style={{ position: 'relative', width: 100, height: 100, margin: '0 auto 24px', borderRadius: 20, background: 'var(--midnight-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <div style={{ color: 'rgba(244,216,135,0.8)' }}><IcoScan /></div>
        <div style={{
          position: 'absolute', left: '8%', right: '8%', height: 2,
          background: 'linear-gradient(90deg, transparent, var(--brick-500), transparent)',
          boxShadow: '0 0 12px 2px rgba(173,9,34,0.6)',
          animation: 'scanSweep 1.6s ease-in-out infinite',
          top: '9%',
        }} />
      </div>
      <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--midnight-500)', margin: '0 0 6px' }}>Analizando imagen…</p>
      <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0 }}>La IA está identificando el set o las piezas</p>
    </div>
  )
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CONDITIONS = [
  { id: 'nuevo',       label: 'Nuevo', sub: 'Sin abrir, sellado de fábrica' },
  { id: 'como_nuevo',  label: 'Como nuevo', sub: 'Armado una vez, impecable' },
  { id: 'buen_estado', label: 'Buen estado', sub: 'Uso normal, completo' },
  { id: 'con_uso',     label: 'Con uso', sub: 'Visible desgaste, funcionando' },
]

const TYPES = [
  { id: 'venta',       label: 'Venta directa', sub: 'Establece un precio fijo' },
  { id: 'intercambio', label: 'Intercambio', sub: 'Propón qué quieres a cambio' },
  { id: 'en_vivo',     label: 'Subasta en vivo', sub: 'Vende en sesión en vivo' },
]

const CITIES = ['Guadalajara', 'Ciudad de México', 'Monterrey', 'Puebla', 'Querétaro', 'Otra ciudad']

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function VenderPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [scanning, setScanning] = useState(false)
  const [condition, setCondition] = useState('')
  const [type, setType] = useState('')
  const [price, setPrice] = useState('')
  const [priceNeg, setPriceNeg] = useState(false)
  const [city, setCity] = useState('')
  const [description, setDescription] = useState('')
  const [detectedTitle] = useState('LEGO City Comisaría de Policía 60316')
  const [detectedConfidence] = useState(94)
  const fileRef = useRef<HTMLInputElement>(null)

  const canPublish = condition && type && city && (type === 'intercambio' || price)

  const handleFileInput = () => {
    setScanning(true)
    setTimeout(() => { setScanning(false); setStep(2) }, 2600)
  }

  const handlePublish = () => {
    setStep(4)
  }

  return (
    <div style={{ background: 'var(--surface-page)', minHeight: '100vh', fontFamily: 'var(--font-sans)' }}>
      <AppNav />

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '32px 24px 80px' }}>

        {/* Back link — only on steps 1–3 */}
        {step < 4 && (
          <Link href="/explorar" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--text-muted)', textDecoration: 'none', marginBottom: 28, fontWeight: 500 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Cancelar
          </Link>
        )}

        {/* Header + progress */}
        {step < 4 && (
          <>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: 32, color: 'var(--midnight-500)', margin: '0 0 6px', letterSpacing: '-0.01em' }}>
              {step === 1 ? 'Publicar anuncio' : step === 2 ? '¡IA identificó tu LEGO!' : 'Detalles del anuncio'}
            </h1>
            <p style={{ fontSize: 15, color: 'var(--text-muted)', margin: '0 0 24px' }}>
              {step === 1 ? 'Toma o sube una foto — la IA hace el resto' : step === 2 ? 'Confirma qué detectamos y ajusta si es necesario' : 'Completa los últimos detalles y publica'}
            </p>
            <Stepper step={step} total={3} />
          </>
        )}

        {/* ══ Step 1: Upload ══ */}
        {step === 1 && (
          <div>
            {scanning ? (
              <ScanningState />
            ) : (
              <>
                {/* Upload zone */}
                <div
                  onClick={() => fileRef.current?.click()}
                  style={{
                    border: '2px dashed var(--border-subtle)', borderRadius: 20,
                    padding: '56px 24px', textAlign: 'center', cursor: 'pointer',
                    background: 'var(--surface-raised)',
                    transition: 'border-color 160ms, background 160ms',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--midnight-400)'; (e.currentTarget as HTMLDivElement).style.background = 'var(--midnight-a06)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-subtle)'; (e.currentTarget as HTMLDivElement).style.background = 'var(--surface-raised)' }}
                >
                  <div style={{ width: 64, height: 64, borderRadius: 999, background: 'var(--midnight-a10)', color: 'var(--midnight-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <IcoCamera />
                  </div>
                  <p style={{ fontSize: 17, fontWeight: 600, color: 'var(--midnight-500)', margin: '0 0 8px' }}>Arrastra una foto o toca aquí</p>
                  <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0 }}>JPG, PNG — hasta 20 MB</p>
                  <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileInput} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '20px 0' }}>
                  <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>o</span>
                  <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
                </div>

                {/* Upload button */}
                <button
                  onClick={() => fileRef.current?.click()}
                  style={{
                    width: '100%', height: 52, borderRadius: 999,
                    border: '1.5px solid var(--midnight-500)', background: 'transparent',
                    color: 'var(--midnight-500)', fontSize: 16, fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'var(--font-sans)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  }}
                >
                  <IcoUpload />
                  Subir desde galería
                </button>

                {/* Skip / manual entry */}
                <button
                  onClick={() => setStep(3)}
                  style={{ display: 'block', margin: '16px auto 0', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', textDecoration: 'underline' }}
                >
                  Prefiero capturar los datos manualmente
                </button>

                <div style={{ marginTop: 28, background: 'var(--brass-300)', borderRadius: 12, padding: '14px 18px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>✨</span>
                  <p style={{ fontSize: 13, color: 'var(--ink-700)', margin: 0, lineHeight: 1.6 }}>
                    <b>IA de reconocimiento:</b> nuestra IA identifica el número de set, el tema y el título automaticamente para que no tengas que escribirlo.
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {/* ══ Step 2: AI result ══ */}
        {step === 2 && (
          <div>
            {/* Detection card */}
            <div style={{ background: 'var(--surface-raised)', border: '1.5px solid rgba(47,125,91,0.3)', borderRadius: 20, padding: '24px 24px 20px', marginBottom: 24, boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(47,125,91,0.12)', color: '#2f7d5b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <IcoScan />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#2f7d5b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Identificado · {detectedConfidence}%</div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-strong)', marginTop: 2 }}>{detectedTitle}</div>
                </div>
              </div>

              {/* Confidence bar */}
              <div style={{ height: 6, borderRadius: 999, background: 'var(--surface-sunken)', overflow: 'hidden' }}>
                <div style={{ width: `${detectedConfidence}%`, height: '100%', borderRadius: 999, background: '#2f7d5b', transition: 'width 600ms var(--ease-out)' }} />
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>Confianza del modelo</div>
            </div>

            <p style={{ fontSize: 15, color: 'var(--text-body)', margin: '0 0 20px' }}>¿Es correcto lo que detectamos?</p>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setStep(3)}
                style={{ flex: 1, height: 52, borderRadius: 999, border: 'none', background: 'var(--midnight-500)', color: 'var(--cream-50)', fontSize: 16, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                <IcoCheck /> Sí, es correcto
              </button>
              <button
                onClick={() => setStep(3)}
                style={{ height: 52, padding: '0 22px', borderRadius: 999, border: '1.5px solid var(--border-subtle)', background: 'transparent', color: 'var(--text-strong)', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
              >
                Corregir
              </button>
            </div>

            <div style={{ marginTop: 20, padding: '14px 18px', background: 'var(--cream-200)', borderRadius: 12 }}>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
                Si el resultado no es exacto, podrás editar el título manualmente en el siguiente paso.
              </p>
            </div>
          </div>
        )}

        {/* ══ Step 3: Details ══ */}
        {step === 3 && (
          <div>
            {/* Detected title (editable) */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-strong)', marginBottom: 6 }}>Título del anuncio</label>
              <input
                type="text"
                defaultValue={detectedTitle}
                style={{ width: '100%', height: 48, padding: '0 14px', fontSize: 15, border: '1px solid var(--border-subtle)', borderRadius: 10, background: 'var(--surface-raised)', color: 'var(--text-strong)', fontFamily: 'var(--font-sans)', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            {/* Condition */}
            <div style={{ marginBottom: 22 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-strong)', marginBottom: 10 }}>Condición *</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {CONDITIONS.map(c => (
                  <CardOpt key={c.id} selected={condition === c.id} onClick={() => setCondition(c.id)} label={c.label} sub={c.sub} />
                ))}
              </div>
            </div>

            {/* Type */}
            <div style={{ marginBottom: 22 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-strong)', marginBottom: 10 }}>Tipo de anuncio *</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {TYPES.map(t => (
                  <CardOpt key={t.id} selected={type === t.id} onClick={() => setType(t.id)} label={t.label} sub={t.sub} />
                ))}
              </div>
            </div>

            {/* Price (only for venta / en_vivo) */}
            {(type === 'venta' || type === 'en_vivo') && (
              <div style={{ marginBottom: 22 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-strong)', marginBottom: 6 }}>
                  {type === 'en_vivo' ? 'Precio de salida (MXN) *' : 'Precio (MXN) *'}
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 15, color: 'var(--text-muted)', fontWeight: 600 }}>$</span>
                  <input
                    type="number"
                    min="0"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    placeholder="1,200"
                    style={{ width: '100%', height: 48, paddingLeft: 28, paddingRight: 14, fontSize: 15, border: '1px solid var(--border-subtle)', borderRadius: 10, background: 'var(--surface-raised)', color: 'var(--text-strong)', fontFamily: 'var(--font-sans)', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                {type === 'venta' && (
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, cursor: 'pointer', fontSize: 14, color: 'var(--text-body)' }}>
                    <input type="checkbox" checked={priceNeg} onChange={() => setPriceNeg(v => !v)} style={{ width: 16, height: 16, accentColor: 'var(--midnight-500)' }} />
                    Precio negociable
                  </label>
                )}
              </div>
            )}

            {/* City */}
            <div style={{ marginBottom: 22 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-strong)', marginBottom: 6 }}>Ciudad *</label>
              <select
                value={city}
                onChange={e => setCity(e.target.value)}
                style={{
                  width: '100%', height: 48, padding: '0 40px 0 14px', fontSize: 15,
                  border: '1px solid var(--border-subtle)', borderRadius: 10,
                  background: 'var(--surface-raised)', color: city ? 'var(--text-strong)' : 'var(--text-muted)',
                  fontFamily: 'var(--font-sans)', outline: 'none', appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236e6862' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', boxSizing: 'border-box',
                }}
              >
                <option value="">Selecciona tu ciudad</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Description */}
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-strong)', marginBottom: 6 }}>
                Descripción <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(opcional)</span>
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Estado detallado, qué incluye, condiciones de entrega…"
                rows={4}
                style={{ width: '100%', padding: '12px 14px', fontSize: 15, border: '1px solid var(--border-subtle)', borderRadius: 10, background: 'var(--surface-raised)', color: 'var(--text-strong)', fontFamily: 'var(--font-sans)', outline: 'none', resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.6 }}
              />
            </div>

            {/* Publish button */}
            <button
              onClick={handlePublish}
              disabled={!canPublish}
              style={{
                width: '100%', height: 54, borderRadius: 999, border: 'none',
                background: canPublish ? 'var(--brick-500)' : 'var(--surface-sunken)',
                color: canPublish ? '#fff' : 'var(--text-muted)',
                fontSize: 17, fontWeight: 700, cursor: canPublish ? 'pointer' : 'not-allowed',
                fontFamily: 'var(--font-sans)', transition: 'all 180ms',
              }}
            >
              Publicar anuncio
            </button>

            {!canPublish && (
              <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', marginTop: 10 }}>
                Completa los campos obligatorios (*) para continuar
              </p>
            )}
          </div>
        )}

        {/* ══ Step 4: Success ══ */}
        {step === 4 && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ width: 72, height: 72, borderRadius: 999, background: 'rgba(47,125,91,0.14)', color: '#2f7d5b', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            </div>

            <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: 32, color: 'var(--midnight-500)', margin: '0 0 12px', letterSpacing: '-0.01em' }}>
              ¡Anuncio publicado!
            </h1>
            <p style={{ fontSize: 16, color: 'var(--ink-500)', margin: '0 0 32px', lineHeight: 1.65, maxWidth: '28em', marginLeft: 'auto', marginRight: 'auto' }}>
              Tu <b>{detectedTitle}</b> ya aparece en Brick Community. Cualquier interesado podrá contactarte directamente.
            </p>

            <div style={{ background: 'var(--surface-raised)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: '20px 24px', marginBottom: 28, textAlign: 'left' }}>
              {[
                { label: 'Artículo', value: detectedTitle },
                { label: 'Condición', value: CONDITIONS.find(c => c.id === condition)?.label ?? condition },
                { label: 'Tipo', value: TYPES.find(t => t.id === type)?.label ?? type },
                { label: 'Precio', value: type === 'intercambio' ? 'Intercambio' : price ? `$${Number(price).toLocaleString('es-MX')} MXN` : '—' },
                { label: 'Ciudad', value: city },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, fontSize: 14, padding: '8px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{row.label}</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-strong)', textAlign: 'right', maxWidth: '60%' }}>{row.value}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/listing/l4" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: 52, padding: '0 28px', borderRadius: 999, background: 'var(--midnight-500)', color: 'var(--cream-50)', textDecoration: 'none', fontSize: 15, fontWeight: 600, fontFamily: 'var(--font-sans)' }}>
                Ver mi anuncio
              </Link>
              <button onClick={() => { setStep(1); setCondition(''); setType(''); setPrice(''); setCity(''); setDescription(''); setPriceNeg(false) }}
                style={{ height: 52, padding: '0 28px', borderRadius: 999, border: '1.5px solid var(--border-subtle)', background: 'transparent', color: 'var(--text-strong)', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                Publicar otro
              </button>
            </div>
          </div>
        )}
      </div>

      {step < 4 && (
        <footer style={{ borderTop: '1px solid var(--border-subtle)', padding: '28px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
          Brick <b style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, color: 'var(--brick-red)' }}>Community</b> · Marketplace LEGO México · Beta
        </footer>
      )}
    </div>
  )
}
