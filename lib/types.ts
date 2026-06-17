export type Condition = 'nuevo' | 'como_nuevo' | 'buen_estado' | 'con_uso'
export type ListingType = 'venta' | 'intercambio' | 'en_vivo'
export type Category = 'sets' | 'minifiguras' | 'piezas' | 'instrucciones'
export type ModeFilter = 'todos' | ListingType
export type CatFilter = 'todos' | Category

export interface Seller {
  id: string
  name: string
  avatarInitials: string
  avatarBg: string
  city: string
  rating: number
  totalSales: number
}

export interface Listing {
  id: string
  title: string
  price: number
  priceNegotiable: boolean
  bgColor: string
  accentColor: string
  condition: Condition
  type: ListingType
  category: Category
  theme: string
  seller: Seller
  description: string
  city: string
  daysAgo: number
  views: number
  saved: number
  legoSetNumber?: string
}
