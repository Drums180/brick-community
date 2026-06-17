import type { Listing, Seller } from './types'

const SELLERS: Record<string, Seller> = {
  carlos: {
    id: 's1', name: 'Carlos M.', avatarInitials: 'CM', avatarBg: '#1a4fa3',
    city: 'Guadalajara', rating: 4.9, totalSales: 47,
  },
  ana: {
    id: 's2', name: 'Ana L.', avatarInitials: 'AL', avatarBg: '#8d0a1c',
    city: 'Ciudad de México', rating: 4.8, totalSales: 23,
  },
  david: {
    id: 's3', name: 'David R.', avatarInitials: 'DR', avatarBg: '#2d5a27',
    city: 'Monterrey', rating: 4.7, totalSales: 89,
  },
  sofia: {
    id: 's4', name: 'Sofía P.', avatarInitials: 'SP', avatarBg: '#4a1942',
    city: 'Puebla', rating: 5.0, totalSales: 12,
  },
  miguel: {
    id: 's5', name: 'Miguel T.', avatarInitials: 'MT', avatarBg: '#0d3b66',
    city: 'Querétaro', rating: 4.6, totalSales: 31,
  },
  laura: {
    id: 's6', name: 'Laura G.', avatarInitials: 'LG', avatarBg: '#7b2d8b',
    city: 'Ciudad de México', rating: 4.9, totalSales: 156,
  },
}

export const MOCK_LISTINGS: Listing[] = [
  {
    id: 'l1',
    title: 'LEGO Star Wars 75192 Millennium Falcon — UCS',
    price: 18500, priceNegotiable: true,
    bgColor: '#151e2d', accentColor: '#c9a227',
    condition: 'como_nuevo', type: 'venta', category: 'sets', theme: 'Star Wars',
    seller: SELLERS.carlos,
    description: 'Set UCS Millennium Falcon en excelente estado. Completo con caja e instrucciones. Construido una sola vez para exhibición. Sin calcomanías dañadas. Envío disponible a toda la república a cargo del comprador.',
    city: 'Guadalajara', daysAgo: 2, views: 234, saved: 28, legoSetNumber: '75192',
  },
  {
    id: 'l2',
    title: 'Minifigura Boba Fett (2003) — sw0052',
    price: 0, priceNegotiable: false,
    bgColor: '#2a2010', accentColor: '#c9a227',
    condition: 'buen_estado', type: 'intercambio', category: 'minifiguras', theme: 'Star Wars',
    seller: SELLERS.ana,
    description: 'Boba Fett de 2003, pieza icónica del set 10123. Quiero cambiarla por Jango Fett de la misma época o piezas Technic. Dime qué tienes.',
    city: 'Ciudad de México', daysAgo: 1, views: 89, saved: 14,
  },
  {
    id: 'l3',
    title: 'LEGO Technic 42143 Ferrari Daytona SP3 — sellado',
    price: 9800, priceNegotiable: false,
    bgColor: '#8b0000', accentColor: '#ffd700',
    condition: 'nuevo', type: 'venta', category: 'sets', theme: 'Technic',
    seller: SELLERS.david,
    description: 'Ferrari Daytona SP3 sin abrir, caja sellada de fábrica. Precio justo, no acepto ofertas por debajo. Entrega en Monterrey o envío con costo adicional.',
    city: 'Monterrey', daysAgo: 0, views: 312, saved: 41, legoSetNumber: '42143',
  },
  {
    id: 'l4',
    title: 'LEGO City Comisaría de Policía 60316',
    price: 1400, priceNegotiable: true,
    bgColor: '#1d5fa4', accentColor: '#fdd835',
    condition: 'buen_estado', type: 'venta', category: 'sets', theme: 'City',
    seller: SELLERS.carlos,
    description: 'Comisaría completa, todas las piezas y minifiguras incluidas. Falta la caja pero las instrucciones están en buen estado. Ideal para niños o coleccionistas de City.',
    city: 'Guadalajara', daysAgo: 4, views: 67, saved: 8, legoSetNumber: '60316',
  },
  {
    id: 'l5',
    title: 'Lote 500+ piezas LEGO Technic mixtas',
    price: 800, priceNegotiable: true,
    bgColor: '#1a1a2e', accentColor: '#e94560',
    condition: 'con_uso', type: 'venta', category: 'piezas', theme: 'Technic',
    seller: SELLERS.sofia,
    description: 'Mezcla de piezas Technic: ejes, conectores, engranajes, neumáticos y más. Provienen de varios sets desarmados. Perfectas para proyectos MOC. Puedo separar por tipo si prefieres.',
    city: 'Puebla', daysAgo: 6, views: 45, saved: 5,
  },
  {
    id: 'l6',
    title: 'LEGO Harry Potter 75978 Callejón Diagón',
    price: 7200, priceNegotiable: false,
    bgColor: '#2d1b4e', accentColor: '#c9a227',
    condition: 'como_nuevo', type: 'venta', category: 'sets', theme: 'Harry Potter',
    seller: SELLERS.laura,
    description: 'Diagon Alley completo, construido y exhibido en vitrina. Con caja (algo golpeada) e instrucciones en perfecto estado. Todas las minifiguras y piezas especiales incluidas.',
    city: 'Ciudad de México', daysAgo: 3, views: 178, saved: 22, legoSetNumber: '75978',
  },
  {
    id: 'l7',
    title: 'Minifigura Batman TLBM — capa de tela original',
    price: 280, priceNegotiable: true,
    bgColor: '#1a2238', accentColor: '#ffd700',
    condition: 'buen_estado', type: 'intercambio', category: 'minifiguras', theme: 'DC',
    seller: SELLERS.miguel,
    description: 'Batman de The LEGO Batman Movie con capa de tela original. Acepto intercambio por minifiguras DC, Marvel o Star Wars de similar valor. O venta directa.',
    city: 'Querétaro', daysAgo: 7, views: 52, saved: 9,
  },
  {
    id: 'l8',
    title: 'LEGO Architecture 21056 Taj Mahal',
    price: 3200, priceNegotiable: false,
    bgColor: '#2d3436', accentColor: '#dfe6e9',
    condition: 'nuevo', type: 'venta', category: 'sets', theme: 'Architecture',
    seller: SELLERS.ana,
    description: 'Taj Mahal de la línea Architecture, sin abrir. Regalo de cumpleaños que no pude ensamblar. Precio igual al de tienda oficial, te ahorras la espera.',
    city: 'Ciudad de México', daysAgo: 5, views: 93, saved: 11, legoSetNumber: '21056',
  },
  {
    id: 'l9',
    title: 'LEGO Ideas 21337 Futbolín — EN VIVO hoy 8PM',
    price: 2800, priceNegotiable: false,
    bgColor: '#005f73', accentColor: '#94d2bd',
    condition: 'como_nuevo', type: 'en_vivo', category: 'sets', theme: 'Ideas',
    seller: SELLERS.david,
    description: '¡EN VIVO HOY 8PM! Futbolín LEGO Ideas completamente funcional, con todos sus jugadores. La subasta empieza en $2,800. ¡No te lo pierdas!',
    city: 'Monterrey', daysAgo: 0, views: 521, saved: 67, legoSetNumber: '21337',
  },
  {
    id: 'l10',
    title: 'Minifigura Darth Vader sw0577 — casco negro',
    price: 420, priceNegotiable: false,
    bgColor: '#0d0d0d', accentColor: '#e63946',
    condition: 'buen_estado', type: 'intercambio', category: 'minifiguras', theme: 'Star Wars',
    seller: SELLERS.carlos,
    description: 'Darth Vader del set 75093, casco y capa en buen estado. Busco intercambio por Luke Skywalker de la misma serie o piezas negras en cantidad.',
    city: 'Guadalajara', daysAgo: 2, views: 88, saved: 13,
  },
  {
    id: 'l11',
    title: 'LEGO Ninjago 71795 Templo del Dragón Ninja',
    price: 1800, priceNegotiable: true,
    bgColor: '#6b0000', accentColor: '#ffd700',
    condition: 'buen_estado', type: 'venta', category: 'sets', theme: 'Ninjago',
    seller: SELLERS.miguel,
    description: 'Templo del Dragón completo con todas las minifiguras y el gran dragón. Algunos toques de uso en piezas secundarias pero el dragón está impecable.',
    city: 'Querétaro', daysAgo: 9, views: 76, saved: 7, legoSetNumber: '71795',
  },
  {
    id: 'l12',
    title: 'LEGO Creator 31120 Castillo Medieval 3en1',
    price: 2100, priceNegotiable: false,
    bgColor: '#3a3028', accentColor: '#c8b88a',
    condition: 'como_nuevo', type: 'venta', category: 'sets', theme: 'Creator',
    seller: SELLERS.laura,
    description: 'Creator Medieval Castle en la versión del castillo. Montado y exhibido en vitrina. Las instrucciones para las otras dos versiones disponibles en PDF.',
    city: 'Ciudad de México', daysAgo: 11, views: 104, saved: 16, legoSetNumber: '31120',
  },
  {
    id: 'l13',
    title: 'LEGO Minecraft 21171 El Establo de Caballos',
    price: 650, priceNegotiable: true,
    bgColor: '#4a6741', accentColor: '#b5e61d',
    condition: 'buen_estado', type: 'venta', category: 'sets', theme: 'Minecraft',
    seller: SELLERS.sofia,
    description: 'Establo de Minecraft con todas las piezas y figuras de animales. Caja en mal estado pero el set está completo. Ideal para fans de Minecraft.',
    city: 'Puebla', daysAgo: 14, views: 38, saved: 3, legoSetNumber: '21171',
  },
  {
    id: 'l14',
    title: 'LEGO Disney 43212 Tren Celebración 100 años — EN VIVO',
    price: 1100, priceNegotiable: false,
    bgColor: '#0d3b66', accentColor: '#ffd60a',
    condition: 'nuevo', type: 'en_vivo', category: 'sets', theme: 'Disney',
    seller: SELLERS.ana,
    description: '¡SUBASTA EN VIVO mañana 7PM! Tren de Celebración Disney sin abrir, edición limitada 100 años. Precio de salida muy accesible. Figuras: Mickey, Minnie y Donald.',
    city: 'Ciudad de México', daysAgo: 1, views: 287, saved: 38, legoSetNumber: '43212',
  },
  {
    id: 'l15',
    title: 'Piezas Technic — 100 conectores y ejes mixtos',
    price: 350, priceNegotiable: true,
    bgColor: '#1a1a2e', accentColor: '#e94560',
    condition: 'buen_estado', type: 'intercambio', category: 'piezas', theme: 'Technic',
    seller: SELLERS.david,
    description: 'Lote de conectores, ejes y pasadores Technic de varios tamaños. Acepto intercambio por piezas de otras líneas que me interesen.',
    city: 'Monterrey', daysAgo: 8, views: 29, saved: 2,
  },
  {
    id: 'l16',
    title: 'LEGO Star Wars 75313 AT-AT Walker — UCS sellado',
    price: 28000, priceNegotiable: false,
    bgColor: '#151e2d', accentColor: '#c9a227',
    condition: 'nuevo', type: 'venta', category: 'sets', theme: 'Star Wars',
    seller: SELLERS.laura,
    description: 'AT-AT UCS sin abrir, caja sellada y perfecta. Más de 6,000 piezas. El set más grande de Star Wars hasta la fecha. Inversión segura. Solo entrega en CDMX.',
    city: 'Ciudad de México', daysAgo: 3, views: 891, saved: 102, legoSetNumber: '75313',
  },
]

export function formatAge(days: number): string {
  if (days === 0) return 'Hoy'
  if (days === 1) return 'Ayer'
  if (days < 7) return `Hace ${days} días`
  const weeks = Math.floor(days / 7)
  return `Hace ${weeks} semana${weeks > 1 ? 's' : ''}`
}

export function formatPrice(price: number): string {
  return '$' + price.toLocaleString('es-MX') + ' MXN'
}
