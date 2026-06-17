"use client";

import { useState, useEffect, useCallback } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────

const CHANNELS = [
  { id: "fbm",       label: "Facebook Marketplace" },
  { id: "grupos",    label: "Grupos de FB / WhatsApp" },
  { id: "bricklink", label: "BrickLink" },
  { id: "online",    label: "eBay / Mercado Libre" },
  { id: "bazares",   label: "Bazares y convenciones" },
  { id: "poco",      label: "Casi no lo hago, es un lío" },
];

const FORMSPREE = "https://formspree.io/f/mojzraqk";

const LIKERT = ["Nunca", "Lo dudo", "Tal vez", "Probable", "Sin duda"];

const PAY_OPTS = [
  { id: "gratis",   label: "Solo si es gratis",              sub: "Sin costo para mí" },
  { id: "comision", label: "Una comisión pequeña por venta", sub: "~5% al concretar una venta" },
  { id: "s49",      label: "Suscripción de $49 / mes",       sub: "Acceso completo" },
  { id: "s99",      label: "Suscripción de $99 / mes",       sub: "Si me ahorra tiempo de verdad" },
];

const CITIES = [
  { value: "",      label: "Selecciona tu ciudad" },
  { value: "gdl",   label: "Guadalajara" },
  { value: "cdmx",  label: "Ciudad de México" },
  { value: "mty",   label: "Monterrey" },
  { value: "pue",   label: "Puebla" },
  { value: "qro",   label: "Querétaro" },
  { value: "otra",  label: "Otra ciudad" },
];

// ─── Tiny primitives ──────────────────────────────────────────────────────────

type BtnVariant = "accent" | "primary" | "ghost" | "secondary";
type BtnSize = "sm" | "lg";

function Btn({
  variant = "primary",
  size = "lg",
  onClick,
  disabled,
  fullWidth,
  href,
  children,
}: {
  variant?: BtnVariant;
  size?: BtnSize;
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  href?: string;
  children: React.ReactNode;
}) {
  const base: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    fontFamily: "var(--font-sans)",
    fontWeight: 600,
    borderRadius: 999,
    textDecoration: "none",
    border: "none",
    transition: "opacity 160ms",
    whiteSpace: "nowrap",
    cursor: disabled ? "not-allowed" : "pointer",
    width: fullWidth ? "100%" : "auto",
    opacity: disabled ? 0.45 : 1,
    ...(size === "lg"
      ? { fontSize: 16, padding: "0 24px", height: 52 }
      : { fontSize: 14, padding: "0 16px", height: 38 }),
  };
  const variants: Record<BtnVariant, React.CSSProperties> = {
    accent:    { background: "var(--brick-500)",              color: "#fff" },
    primary:   { background: "var(--midnight-500)",           color: "var(--cream-50)" },
    ghost:     { background: "transparent", border: "1.5px solid var(--border-subtle)", color: "var(--midnight-500)" },
    secondary: { background: "rgba(246,237,231,0.15)", border: "1px solid var(--border-ondark)", color: "var(--cream-50)" },
  };
  const style = { ...base, ...variants[variant] };
  if (href) return <a href={href} style={style} target="_blank" rel="noopener">{children}</a>;
  return <button onClick={onClick} disabled={disabled} style={style}>{children}</button>;
}

function Tag({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 16px", borderRadius: 999, height: 38, cursor: "pointer",
        border: selected ? "1.5px solid var(--midnight-500)" : "1px solid var(--border-subtle)",
        background: selected ? "var(--midnight-500)" : "var(--surface-raised)",
        color: selected ? "var(--cream-50)" : "var(--text-strong)",
        fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 500,
        transition: "all 160ms var(--ease-out)",
      }}
    >{label}</button>
  );
}

function CardOption({ selected, onClick, icon, title, subtitle }: {
  selected: boolean; onClick: () => void;
  icon?: React.ReactNode; title: string; subtitle: string;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        textAlign: "left", cursor: "pointer", width: "100%", borderRadius: 14,
        padding: "15px 16px", display: "flex", alignItems: "center", gap: 13,
        border: selected ? "1.5px solid var(--midnight-500)" : "1px solid var(--border-subtle)",
        background: selected ? "var(--midnight-a06)" : "var(--surface-raised)",
        boxShadow: selected ? "0 0 0 3px var(--focus-ring)" : "var(--shadow-xs)",
        color: "var(--text-strong)", fontFamily: "var(--font-sans)",
        transition: "all 180ms var(--ease-out)",
      }}
    >
      {icon && <span style={{ flexShrink: 0 }}>{icon}</span>}
      <span style={{ flex: 1 }}>
        <span style={{ display: "block", fontWeight: 600 }}>{title}</span>
        <span style={{ display: "block", fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>{subtitle}</span>
      </span>
      {selected && (
        <span style={{ color: "var(--midnight-500)", display: "inline-flex", flexShrink: 0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
        </span>
      )}
    </button>
  );
}

function InputField({ label, type = "text", placeholder, value, onChange }: {
  label: string; type?: string; placeholder?: string;
  value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-strong)", marginBottom: 6 }}>{label}</label>
      <input
        type={type} placeholder={placeholder} value={value} onChange={onChange}
        style={{
          width: "100%", height: 48, padding: "0 14px", fontSize: 15,
          border: "1px solid var(--border-subtle)", borderRadius: 10,
          background: "var(--surface-raised)", color: "var(--text-strong)",
          fontFamily: "var(--font-sans)", outline: "none",
        }}
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options }: {
  label: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-strong)", marginBottom: 6 }}>{label}</label>
      <select
        value={value} onChange={onChange}
        style={{
          width: "100%", height: 48, padding: "0 14px", fontSize: 15,
          border: "1px solid var(--border-subtle)", borderRadius: 10,
          background: "var(--surface-raised)",
          color: value ? "var(--text-strong)" : "var(--text-muted)",
          fontFamily: "var(--font-sans)", outline: "none",
          appearance: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236e6862' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 14px center",
          paddingRight: 40,
        }}
      >
        {options.map(o => (
          <option key={o.value} value={o.value} disabled={o.value === ""}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

// ─── SVG Icons ───────────────────────────────────────────────────────────────

const IcoCheck = ({ color = "var(--brass-500)" }: { color?: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
);
const IcoLive = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="2"/><path d="M4.9 19.1a10 10 0 0 1 0-14.2M7.8 16.2a6 6 0 0 1 0-8.4M16.2 7.8a6 6 0 0 1 0 8.4M19.1 4.9a10 10 0 0 1 0 14.2"/>
  </svg>
);
const IcoSwap = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>
  </svg>
);
const IcoGrid = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="7" height="7" x="3"  y="3"  rx="1"/><rect width="7" height="7" x="14" y="3"  rx="1"/>
    <rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3"  y="14" rx="1"/>
  </svg>
);
const IcoBell = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
  </svg>
);
const IcoScan = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M7 12h10"/>
  </svg>
);

// ─── Logo ─────────────────────────────────────────────────────────────────────

function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ position: "relative", width: 38, height: 31, flexShrink: 0 }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 8, background: "var(--brick-red)", boxShadow: "var(--shadow-sm)" }} />
        <div style={{ position: "absolute", top: -6, left: 6, right: 6, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{ height: 11, borderRadius: 999, background: "var(--brick-400)", border: "1.4px solid var(--brick-600)" }} />
          ))}
        </div>
      </div>
      <span style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: 24, lineHeight: 1, letterSpacing: "-0.01em", color: dark ? "var(--cream-50)" : "var(--midnight-500)" }}>
        Brick <b style={{ color: "var(--brick-red)", fontWeight: 600 }}>Community</b>
      </span>
    </div>
  );
}

// ─── Live badge ───────────────────────────────────────────────────────────────

function LiveBadge({ count, dark = false }: { count: number; dark?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: dark ? "rgba(246,237,231,0.75)" : "var(--text-muted)" }}>
      <span style={{ width: 9, height: 9, borderRadius: 999, background: "var(--brick-500)", animation: "livePulse 2s infinite", flexShrink: 0 }} />
      <span>
        <b style={{ color: dark ? "var(--cream-50)" : "var(--text-strong)" }}>{count}</b>{" "}
        coleccionistas ya respondieron{!dark && " · Guadalajara, CDMX y Monterrey"}
      </span>
    </div>
  );
}

// ─── Eyebrow ──────────────────────────────────────────────────────────────────

function Eyebrow({ icon, text, brass = false }: { icon?: React.ReactNode; text: string; brass?: boolean }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 7,
      fontSize: 13, fontWeight: 600, letterSpacing: "0.02em",
      color: brass ? "var(--ink-700)" : "var(--brick-500)",
      background: brass ? "var(--brass-500)" : "rgba(173,9,34,0.08)",
      padding: "6px 13px", borderRadius: 999,
    }}>
      {icon}{text}
    </span>
  );
}

// ─── Animated scan panel ──────────────────────────────────────────────────────

function ScanPanel({ sm = false, showDetectLabel = true, darkBorder = false }: { sm?: boolean; showDetectLabel?: boolean; darkBorder?: boolean }) {
  const pad = sm ? 26 : 34;
  const innerW = sm ? "84%" : "80%";
  const innerR = sm ? 18 : 20;
  const iconSz = sm ? 16 : 18;
  const iconBox = sm ? 30 : 34;
  const iconR = sm ? 9 : 10;

  return (
    <div style={{
      position: "relative", background: "var(--midnight-500)", borderRadius: 24,
      padding: pad, aspectRatio: "1 / 1", display: "flex", alignItems: "center",
      justifyContent: "center", boxShadow: "var(--shadow-lg)", overflow: "hidden",
      ...(darkBorder ? { background: "rgba(246,237,231,0.05)", border: "1px solid var(--border-ondark)" } : {}),
    }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 80% at 50% 0%, rgba(244,216,135,0.16), transparent 60%)" }} />
      {showDetectLabel && (
        <div style={{ position: "absolute", top: 22, left: 22, zIndex: 3, fontSize: 12, fontWeight: 600, color: "var(--midnight-500)", background: "var(--brass-300)", padding: "6px 12px", borderRadius: 999, boxShadow: "var(--shadow-sm)" }}>
          Detectado por IA
        </div>
      )}
      {/* Floating card */}
      <div style={{
        position: "relative", zIndex: 2, width: innerW, aspectRatio: "1 / 1",
        borderRadius: innerR, background: "var(--cream-50)", boxShadow: "var(--shadow-lg)",
        overflow: "hidden", animation: "floatY 6s var(--ease-std) infinite",
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/brick-sticker.jpg" alt="LEGO brick" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", padding: "11%" }} />

        {/* Corner brackets (large only) */}
        {!sm && <>
          <div style={{ position: "absolute", top: 14, left:  14, width: 20, height: 20, borderTop:    "2px solid rgba(173,9,34,0.55)", borderLeft:   "2px solid rgba(173,9,34,0.55)", borderRadius: "4px 0 0 0" }} />
          <div style={{ position: "absolute", top: 14, right: 14, width: 20, height: 20, borderTop:    "2px solid rgba(173,9,34,0.55)", borderRight:  "2px solid rgba(173,9,34,0.55)", borderRadius: "0 4px 0 0" }} />
          <div style={{ position: "absolute", bottom: 70, left:  14, width: 20, height: 20, borderBottom: "2px solid rgba(173,9,34,0.55)", borderLeft:   "2px solid rgba(173,9,34,0.55)", borderRadius: "0 0 0 4px" }} />
          <div style={{ position: "absolute", bottom: 70, right: 14, width: 20, height: 20, borderBottom: "2px solid rgba(173,9,34,0.55)", borderRight:  "2px solid rgba(173,9,34,0.55)", borderRadius: "0 0 4px 0" }} />
        </>}

        {/* Scan line */}
        <div style={{ position: "absolute", left: "6%", right: "6%", height: 3, borderRadius: 2, background: "linear-gradient(90deg, transparent, var(--brick-500), transparent)", boxShadow: "0 0 14px 2px rgba(173,9,34,0.5)", top: "9%", animation: "scanSweep 2.6s var(--ease-std) infinite" }} />

        {/* Detected badge */}
        <div style={{ position: "absolute", left: 10, right: 10, bottom: 10, background: "var(--surface-raised)", borderRadius: 12, padding: sm ? "9px 11px" : "10px 12px", boxShadow: "var(--shadow-lg)", display: "flex", alignItems: "center", gap: sm ? 9 : 10, animation: "detectIn 0.5s var(--ease-out) 0.5s both" }}>
          <span style={{ width: iconBox, height: iconBox, borderRadius: iconR, background: "rgba(47,125,91,0.14)", color: "var(--status-success)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <IcoScan size={iconSz} />
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: sm ? 9 : 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", fontWeight: 600 }}>Identificado · 96%</div>
            <div style={{ fontSize: sm ? 13 : 14, fontWeight: 600, color: "var(--text-strong)" }}>Brick 2×2 · #3003</div>
          </div>
          {!sm && <span style={{ fontSize: 11, fontWeight: 600, color: "var(--brick-500)", background: "rgba(173,9,34,0.08)", padding: "4px 8px", borderRadius: 999, whiteSpace: "nowrap" }}>14 cerca</span>}
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Home() {
  const [step, setStep]       = useState(1);
  const [channels, setChannels] = useState<string[]>([]);
  const [wouldUse, setWouldUse] = useState(0);
  const [mode, setMode]       = useState("");
  const [pay, setPay]         = useState("");
  const [email, setEmail]     = useState("");
  const [city, setCity]       = useState("");
  const [name, setName]       = useState("");
  const [consent, setConsent] = useState(true);
  const [liveCount, setLiveCount] = useState(347);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const iv = setInterval(() => {
      if (Math.random() < 0.5) setLiveCount(c => c + 1);
    }, 9000);
    return () => clearInterval(iv);
  }, []);

  const jump = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: "smooth" });
  }, []);

  const toggleChannel = (id: string) =>
    setChannels(cs => cs.includes(id) ? cs.filter(x => x !== id) : [...cs, id]);

  const validEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const canContinue = () => {
    if (step === 1) return channels.length > 0 && wouldUse > 0;
    if (step === 2) return !!mode && !!pay;
    if (step === 3) return validEmail(email) && !!city;
    return true;
  };

  const handlePrimary = async () => {
    if (!canContinue()) return;
    if (step < 3) { setStep(s => s + 1); jump("encuesta"); return; }
    setSubmitting(true);
    try {
      await fetch(FORMSPREE, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          email,
          nombre: name || "(no proporcionado)",
          ciudad: CITIES.find(c => c.value === city)?.label ?? city,
          canales_actuales: channels.join(", "),
          usaria_en_vez_de_fb: wouldUse ? `${wouldUse} — ${LIKERT[wouldUse - 1]}` : "—",
          modo_favorito: { envivo: "Modo en vivo", intercambio: "Intercambio", inventario: "Mi inventario" }[mode] ?? mode,
          pagaria: PAY_OPTS.find(p => p.id === pay)?.label ?? pay,
          lista_de_deseos: consent ? "Sí" : "No",
        }),
      });
    } catch {
      // submission failure is non-blocking — still advance
    } finally {
      setSubmitting(false);
    }
    setStep(4);
    setLiveCount(c => c + 1);
    jump("encuesta");
  };

  const handleBack    = () => { setStep(s => Math.max(1, s - 1)); jump("encuesta"); };
  const handleRestart = () => {
    setStep(1); setChannels([]); setWouldUse(0); setMode(""); setPay("");
    setEmail(""); setCity(""); setName(""); jump("encuesta");
  };

  const progressPct  = `${(Math.min(step, 3) / 3) * 100}%`;
  const likerLabel   = wouldUse ? LIKERT[wouldUse - 1] : "—";
  const modeLabel    = { envivo: "Modo en vivo", intercambio: "Intercambio", inventario: "Mi inventario" }[mode] ?? "—";
  const payLabel     = PAY_OPTS.find(p => p.id === pay)?.label ?? "—";
  const cityLabel    = CITIES.find(c => c.value === city)?.label ?? "—";
  const shareUrl     = `https://wa.me/?text=${encodeURIComponent("Me apunté a Brick Community, un marketplace para coleccionistas de LEGO en México. Apúntate tú también.")}`;

  // ── Mode cards data
  const MODES = [
    { id: "envivo",      title: "Modo en vivo",  subtitle: "Subastas en vivo, estilo live selling.",    icon: <span style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(173,9,34,0.1)",    color: "var(--brick-500)",    display: "flex", alignItems: "center", justifyContent: "center" }}><IcoLive /></span> },
    { id: "intercambio", title: "Intercambio",   subtitle: "Trueque de piezas, sets y minifiguras.",    icon: <span style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(244,216,135,0.35)", color: "var(--brass-600)",    display: "flex", alignItems: "center", justifyContent: "center" }}><IcoSwap /></span> },
    { id: "inventario",  title: "Mi inventario", subtitle: "Publica tu colección y vende directo.",     icon: <span style={{ width: 42, height: 42, borderRadius: 12, background: "var(--midnight-a10)",     color: "var(--midnight-500)", display: "flex", alignItems: "center", justifyContent: "center" }}><IcoGrid /></span> },
  ];

  return (
    <div style={{ background: "var(--surface-page)", color: "var(--text-body)", fontFamily: "var(--font-sans)", minHeight: "100vh", overflowX: "hidden" }}>

      {/* ── NAV ── */}
      <nav style={{ position: "sticky", top: 0, zIndex: 60, background: "rgba(246,237,231,0.86)", backdropFilter: "blur(10px)", borderBottom: "1px solid var(--border-subtle)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Logo />
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <a href="#modos"    style={{ fontSize: 15, fontWeight: 500, color: "var(--ink-500)", textDecoration: "none" }}>Cómo funciona</a>
            <a href="#wishlist" style={{ fontSize: 15, fontWeight: 500, color: "var(--ink-500)", textDecoration: "none" }}>Lista de deseos</a>
            <a href="/explorar" style={{ fontSize: 15, fontWeight: 500, color: "var(--midnight-500)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
              Ver el marketplace
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <Btn variant="primary" size="sm" onClick={() => jump("encuesta")}>Responder encuesta</Btn>
          </div>
        </div>
      </nav>

      {/* ══════════ HERO ══════════ */}
      <div style={{ background: "var(--midnight-500)" }}>
          <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 32px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.08fr 0.92fr", gap: 56, alignItems: "center", padding: "64px 0 80px" }}>
              <div>
                <Eyebrow text="Una idea que estamos validando" brass />
                <h1 style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: 56, lineHeight: 1.04, letterSpacing: "-0.015em", color: "var(--cream-50)", margin: "20px 0 0" }}>
                  Deja de revisar grupos de Facebook todos los días.
                </h1>
                <p style={{ fontSize: 18, lineHeight: 1.65, color: "rgba(246,237,231,0.8)", margin: "20px 0 0", maxWidth: "32em" }}>
                  Brick Community —si la construimos— juntaría compra, venta e intercambio de LEGO en un solo lugar, con tu lista de deseos y avisos cuando algo aparece cerca de ti. Antes de programar nada, queremos tu opinión.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 9, marginTop: 22 }}>
                  {["Una sola app en vez de seis grupos", "Avisos cuando aparece lo que buscas, cerca de ti", "Vender e intercambiar sin descripciones eternas"].map(t => (
                    <div key={t} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15, color: "var(--cream-50)" }}>
                      <IcoCheck />{t}
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 30 }}>
                  <Btn variant="accent"    size="lg" onClick={() => jump("encuesta")}>Responder la encuesta · 1 min</Btn>
                  <Btn variant="secondary" size="lg" onClick={() => jump("modos")}>Ver cómo funciona</Btn>
                </div>
                <div style={{ marginTop: 24 }}>
                  <LiveBadge count={liveCount} dark />
                </div>
              </div>
              <ScanPanel showDetectLabel darkBorder />
            </div>
          </div>
        </div>

      {/* ══════════ MODES ══════════ */}
      <section id="modos" style={{ padding: "84px 0" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 48px" }}>
            <h2 style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: 40, lineHeight: 1.1, color: "var(--midnight-500)", letterSpacing: "-0.01em", margin: 0 }}>
              Tres formas de mover tu colección
            </h2>
            <p style={{ fontSize: 17, color: "var(--ink-500)", marginTop: 12, lineHeight: 1.6 }}>
              Estamos diseñando varios modos para adaptarnos a cómo ya te gusta comprar y vender LEGO. En la encuesta nos dices cuál te late más.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22 }}>
            {[
              { icon: <IcoLive />, bg: "rgba(173,9,34,0.1)", color: "var(--brick-500)",    title: "Modo en vivo",  desc: "Vende en vivo, estilo subasta, igual que en tus apps de live selling favoritas." },
              { icon: <IcoSwap />, bg: "rgba(244,216,135,0.35)", color: "var(--brass-600)", title: "Intercambio",   desc: "Conecta con otros coleccionistas y haz trueque de piezas, sets o minifiguras." },
              { icon: <IcoGrid />, bg: "var(--midnight-a10)", color: "var(--midnight-500)", title: "Mi inventario", desc: "Publica tu colección completa y vende directamente desde tu catálogo personal." },
            ].map(m => (
              <div key={m.title} style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "30px 26px", boxShadow: "var(--shadow-sm)" }}>
                <div style={{ width: 50, height: 50, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18, background: m.bg, color: m.color }}>{m.icon}</div>
                <h3 style={{ fontSize: 21, fontWeight: 700, color: "var(--text-strong)", margin: 0 }}>{m.title}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.6, color: "var(--ink-500)", marginTop: 8 }}>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ WISHLIST ══════════ */}
      <section id="wishlist" style={{ padding: "0 0 84px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ background: "var(--midnight-500)", borderRadius: 24, padding: 60, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 50, alignItems: "center" }}>
            <div>
              <h2 style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: 38, color: "var(--cream-50)", lineHeight: 1.1, letterSpacing: "-0.01em", margin: 0 }}>
                Crea tu lista de deseos
              </h2>
              <p style={{ fontSize: 17, lineHeight: 1.65, color: "rgba(246,237,231,0.78)", marginTop: 16 }}>
                Agrega las minifiguras o sets que estás buscando y te avisaríamos en cuanto alguien cerca de ti quiera venderlos o intercambiarlos. Olvídate de revisar grupos de Facebook todos los días.
              </p>
            </div>
            <div style={{ background: "var(--surface-raised)", borderRadius: 16, padding: "18px 20px", boxShadow: "var(--shadow-lg)", display: "flex", gap: 14, alignItems: "flex-start" }}>
              <span style={{ width: 42, height: 42, borderRadius: 999, background: "var(--brass-300)", color: "var(--ink-700)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <IcoBell />
              </span>
              <div>
                <div style={{ fontSize: 15, lineHeight: 1.5, color: "var(--text-strong)" }}>
                  Alguien en <b style={{ color: "var(--midnight-500)" }}>Guadalajara</b> quiere intercambiar la minifigura de{" "}
                  <b style={{ color: "var(--midnight-500)" }}>Boba Fett (1997)</b> que tienes en tu lista de deseos.
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>Hace 5 min · a 4 km de ti</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ SURVEY ══════════ */}
      <section id="encuesta" style={{ padding: "0 0 96px" }}>
        <div style={{ maxWidth: 660, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: 24, boxShadow: "var(--shadow-md)", padding: 38 }}>

            {/* Progress bar */}
            {step !== 4 && (
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--brick-500)" }}>Encuesta · 1 minuto</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)" }}>Paso {Math.min(step, 3)} de 3</span>
                </div>
                <div style={{ height: 6, borderRadius: 999, background: "var(--surface-sunken)", overflow: "hidden" }}>
                  <div style={{ width: progressPct, height: "100%", borderRadius: 999, background: "var(--brick-500)", transition: "width 320ms var(--ease-out)" }} />
                </div>
              </div>
            )}

            {/* ── Step 1 ── */}
            {step === 1 && (
              <div>
                <h3 style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: 26, color: "var(--midnight-500)", margin: 0, letterSpacing: "-0.01em" }}>
                  ¿Cómo compras, vendes o intercambias LEGO hoy?
                </h3>
                <p style={{ fontSize: 14, color: "var(--text-muted)", margin: "6px 0 18px" }}>Marca todo lo que uses.</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {CHANNELS.map(c => <Tag key={c.id} label={c.label} selected={channels.includes(c.id)} onClick={() => toggleChannel(c.id)} />)}
                </div>

                <div style={{ height: 1, background: "var(--border-subtle)", margin: "28px 0" }} />

                <h3 style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: 23, color: "var(--midnight-500)", margin: 0, lineHeight: 1.3, letterSpacing: "-0.01em" }}>
                  Si existiera Brick Community, ¿la usarías{" "}
                  <span style={{ color: "var(--brick-500)" }}>en lugar de Facebook Marketplace</span>?
                </h3>
                <p style={{ fontSize: 14, color: "var(--text-muted)", margin: "8px 0 18px", lineHeight: 1.55 }}>
                  Una app que organiza tu lista de deseos, te avisa cuando alguien cerca vende lo que buscas, y simplifica vender e intercambiar.
                </p>
                <div style={{ display: "flex", gap: 8 }}>
                  {LIKERT.map((label, i) => {
                    const sel = wouldUse === i + 1;
                    return (
                      <button key={label} onClick={() => setWouldUse(i + 1)} style={{
                        flex: 1, cursor: "pointer", borderRadius: 12, padding: "13px 4px",
                        display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                        border: sel ? "1.5px solid var(--midnight-500)" : "1px solid var(--border-subtle)",
                        background: sel ? "var(--midnight-500)" : "var(--surface-raised)",
                        color: sel ? "var(--cream-50)" : "var(--text-muted)",
                        fontFamily: "var(--font-sans)",
                        boxShadow: sel ? "var(--shadow-md)" : "var(--shadow-xs)",
                        transition: "all 180ms var(--ease-out)",
                      }}>
                        <span style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 600 }}>{i + 1}</span>
                        <span style={{ fontSize: 11, lineHeight: 1.2, textAlign: "center" }}>{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Step 2 ── */}
            {step === 2 && (
              <div>
                <h3 style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: 26, color: "var(--midnight-500)", margin: 0, letterSpacing: "-0.01em" }}>
                  ¿Qué modo te interesaría más?
                </h3>
                <p style={{ fontSize: 14, color: "var(--text-muted)", margin: "6px 0 18px" }}>Elige el que más se parezca a cómo te gusta hacerlo.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                  {MODES.map(m => (
                    <CardOption key={m.id} selected={mode === m.id} onClick={() => setMode(m.id)} icon={m.icon} title={m.title} subtitle={m.subtitle} />
                  ))}
                </div>

                <div style={{ height: 1, background: "var(--border-subtle)", margin: "28px 0" }} />

                <h3 style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: 23, color: "var(--midnight-500)", margin: 0, letterSpacing: "-0.01em" }}>
                  ¿Pagarías por usarla?
                </h3>
                <p style={{ fontSize: 14, color: "var(--text-muted)", margin: "6px 0 18px" }}>Sé honesto — esto nos ayuda a saber si el proyecto es viable.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                  {PAY_OPTS.map(p => (
                    <CardOption key={p.id} selected={pay === p.id} onClick={() => setPay(p.id)} title={p.label} subtitle={p.sub} />
                  ))}
                </div>
              </div>
            )}

            {/* ── Step 3 ── */}
            {step === 3 && (
              <div>
                <h3 style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: 26, color: "var(--midnight-500)", margin: 0, letterSpacing: "-0.01em" }}>
                  Déjanos tu correo y te avisamos
                </h3>
                <p style={{ fontSize: 14, color: "var(--text-muted)", margin: "6px 0 22px", lineHeight: 1.55 }}>
                  Si decidimos construirla, serías de los primeros en probarla. Nada de spam.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  <InputField label="Correo electrónico" type="email" placeholder="tucorreo@ejemplo.com" value={email} onChange={e => setEmail(e.target.value)} />
                  <SelectField label="¿En qué ciudad estás?" value={city} onChange={e => setCity(e.target.value)} options={CITIES} />
                  <InputField label="Tu nombre (opcional)" placeholder="¿Cómo te llamas?" value={name} onChange={e => setName(e.target.value)} />
                  <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                    <input type="checkbox" checked={consent} onChange={() => setConsent(c => !c)} style={{ marginTop: 2, accentColor: "var(--midnight-500)", width: 16, height: 16, flexShrink: 0 }} />
                    <span style={{ fontSize: 14, color: "var(--text-body)", lineHeight: 1.5 }}>
                      Quiero crear mi lista de deseos y recibir avisos cuando aparezca algo cerca.
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* ── Done ── */}
            {step === 4 && (
              <div style={{ textAlign: "center" }}>
                <div style={{ width: 64, height: 64, borderRadius: 999, background: "rgba(47,125,91,0.14)", color: "var(--status-success)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 22px" }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                </div>
                <h3 style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: 30, color: "var(--midnight-500)", margin: 0, letterSpacing: "-0.01em" }}>
                  ¡Gracias! Tu opinión cuenta.
                </h3>
                <p style={{ fontSize: 16, color: "var(--ink-500)", margin: "12px auto 0", maxWidth: "30em", lineHeight: 1.6 }}>
                  Eres el <b style={{ color: "var(--brick-500)" }}>#{liveCount}</b> en decirnos si Brick Community vale la pena. Te escribiremos en cuanto haya novedades.
                </p>
                <div style={{ textAlign: "left", background: "var(--surface-raised)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 22px", margin: "26px 0", display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    { label: "Usarías la app en vez de FB", value: likerLabel },
                    { label: "Modo favorito",                value: modeLabel },
                    { label: "Pagaría",                     value: payLabel },
                    { label: "Ciudad",                      value: cityLabel },
                  ].map(row => (
                    <div key={row.label} style={{ display: "flex", justifyContent: "space-between", gap: 16, fontSize: 14 }}>
                      <span style={{ color: "var(--text-muted)" }}>{row.label}</span>
                      <span style={{ fontWeight: 600, color: "var(--text-strong)", textAlign: "right" }}>{row.value}</span>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: 14, color: "var(--text-muted)", margin: "0 0 14px" }}>¿Conoces a otro coleccionista? Ayúdanos a validar la idea:</p>
                <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                  <Btn variant="accent" size="lg" href={shareUrl}>Compartir por WhatsApp</Btn>
                  <Btn variant="ghost"  size="lg" onClick={handleRestart}>Responder de nuevo</Btn>
                </div>
              </div>
            )}

            {/* Nav buttons */}
            {step !== 4 && (
              <div style={{ display: "flex", gap: 12, marginTop: 30 }}>
                {step > 1 && <Btn variant="ghost" size="lg" onClick={handleBack}>Atrás</Btn>}
                <div style={{ flex: 1 }}>
                  <Btn variant="accent" size="lg" fullWidth disabled={!canContinue() || submitting} onClick={handlePrimary}>
                    {submitting ? "Enviando…" : step < 3 ? "Continuar" : "Enviar mis respuestas"}
                  </Btn>
                </div>
              </div>
            )}

          </div>
          <p style={{ textAlign: "center", fontSize: 13, color: "var(--text-muted)", marginTop: 18 }}>
            Brick Community es un proyecto independiente de coleccionistas. No está afiliado a LEGO®.
          </p>
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer style={{ borderTop: "1px solid var(--border-subtle)", padding: "34px 0", textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 32px" }}>
          <span style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: 18, color: "var(--midnight-500)" }}>
            Brick <b style={{ color: "var(--brick-red)", fontWeight: 600 }}>Community</b>
          </span>
          <p style={{ marginTop: 10 }}>Hecho para la comunidad LEGO® de México · Validando la idea</p>
        </div>
      </footer>


    </div>
  );
}
