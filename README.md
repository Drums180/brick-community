# Brick Community — Landing Page (MVP)

A single-page validation landing for a LEGO minifig/set marketplace concept
(photo-based listing, sell/trade modes, wishlist notifications), targeted at
Mexico (content in Spanish).

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it.

## Before going live

1. **Set up Formspree**: create a free form at [formspree.io](https://formspree.io),
   then replace `FORMSPREE_ENDPOINT` in `app/page.tsx` with your real form
   endpoint (e.g. `https://formspree.io/f/abcd1234`). Until this is done, the
   signup form will not actually deliver submissions.
2. Update copy in `app/page.tsx` as needed (hero pitch, modes, wishlist
   examples).

## Deploying

The easiest option is [Vercel](https://vercel.com/new): connect this repo and
deploy — no extra configuration needed.
