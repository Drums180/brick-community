import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const { listingId, amount, title } = await request.json() as {
    listingId: string
    amount: number
    title: string
  }

  if (!listingId || !amount || !title) {
    return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
  }

  const origin = new URL(request.url).origin

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'mxn',
          product_data: {
            name: title,
            description: 'Brick Community — Marketplace LEGO México',
          },
          unit_amount: amount * 100, // Stripe uses centavos
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    metadata: { listingId, buyerId: user.id },
    success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}&listing=${listingId}`,
    cancel_url: `${origin}/listing/${listingId}`,
  })

  return NextResponse.json({ url: session.url })
}
