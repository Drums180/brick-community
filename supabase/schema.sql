-- ============================================================
-- Brick Community — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- ── Profiles ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID      PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT      NOT NULL DEFAULT '',
  username    TEXT      UNIQUE,
  city        TEXT,
  avatar_url  TEXT,
  rating      NUMERIC(3,2) DEFAULT 5.0,
  total_sales INT       DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Auto-create profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  );
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ── Listings ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS listings (
  id               UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id        UUID    NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title            TEXT    NOT NULL,
  description      TEXT    DEFAULT '',
  price            INTEGER,                    -- pesos MXN, null = intercambio
  price_negotiable BOOLEAN DEFAULT FALSE,
  condition        TEXT    NOT NULL CHECK (condition IN ('nuevo','como_nuevo','buen_estado','con_uso')),
  type             TEXT    NOT NULL CHECK (type IN ('venta','intercambio','en_vivo')),
  category         TEXT    NOT NULL CHECK (category IN ('sets','minifiguras','piezas','instrucciones')),
  theme            TEXT    DEFAULT '',
  city             TEXT    NOT NULL,
  lego_set_number  TEXT,
  images           TEXT[]  DEFAULT '{}',
  status           TEXT    DEFAULT 'activo' CHECK (status IN ('activo','vendido','pausado')),
  views            INTEGER DEFAULT 0,
  saved_count      INTEGER DEFAULT 0,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active listings are public"
  ON listings FOR SELECT USING (status = 'activo');
CREATE POLICY "Sellers can create listings"
  ON listings FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Sellers can update own listings"
  ON listings FOR UPDATE USING (auth.uid() = seller_id);
CREATE POLICY "Sellers can delete own listings"
  ON listings FOR DELETE USING (auth.uid() = seller_id);


-- ── Wishlist ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS wishlist_items (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, listing_id)
);

ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own wishlist"
  ON wishlist_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users add to own wishlist"
  ON wishlist_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users remove from own wishlist"
  ON wishlist_items FOR DELETE USING (auth.uid() = user_id);


-- ── Storage bucket for listing images ────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('listing-images', 'listing-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view listing images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'listing-images');

CREATE POLICY "Authenticated users can upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'listing-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update own images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'listing-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'listing-images' AND auth.uid()::text = (storage.foldername(name))[1]);
