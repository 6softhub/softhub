
-- ============ MARKETPLACE PRODUCTS ============
CREATE TABLE public.marketplace_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  tagline text,
  description text,
  business_category text,
  sub_category text,
  industry text,
  target_audience text,
  software_type text,
  deployment text,
  license text,
  version text,
  status text NOT NULL DEFAULT 'draft',
  is_published boolean NOT NULL DEFAULT false,
  product_owner text,
  product_manager text,
  cost_price numeric(12,2) DEFAULT 0,
  selling_price numeric(12,2) DEFAULT 0,
  currency text DEFAULT 'INR',
  stock_available boolean DEFAULT true,
  stock_quantity integer,
  timeline_start date,
  timeline_end date,
  demo_url text,
  live_url text,
  git_url text,
  thumbnail_url text,
  banner_url text,
  icon_url text,
  gallery jsonb DEFAULT '[]'::jsonb,
  videos jsonb DEFAULT '[]'::jsonb,
  attachments jsonb DEFAULT '[]'::jsonb,
  discount_rules jsonb DEFAULT '[]'::jsonb,
  coupons jsonb DEFAULT '[]'::jsonb,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.marketplace_products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.marketplace_products TO authenticated;
GRANT ALL ON public.marketplace_products TO service_role;
ALTER TABLE public.marketplace_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "mp_products_public_read" ON public.marketplace_products FOR SELECT USING (is_published = true OR auth.uid() IS NOT NULL);
CREATE POLICY "mp_products_auth_insert" ON public.marketplace_products FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "mp_products_auth_update" ON public.marketplace_products FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "mp_products_auth_delete" ON public.marketplace_products FOR DELETE TO authenticated USING (true);
CREATE INDEX idx_mp_products_category ON public.marketplace_products(business_category);
CREATE INDEX idx_mp_products_industry ON public.marketplace_products(industry);
CREATE INDEX idx_mp_products_status ON public.marketplace_products(status);

-- ============ SEO ============
CREATE TABLE public.marketplace_product_seo (
  product_id uuid PRIMARY KEY REFERENCES public.marketplace_products(id) ON DELETE CASCADE,
  seo_title text, seo_slug text, meta_title text, meta_description text,
  focus_keywords text[], secondary_keywords text[],
  canonical_url text, robots_meta text DEFAULT 'index,follow',
  og_title text, og_description text, og_image text,
  twitter_title text, twitter_description text, twitter_card text DEFAULT 'summary_large_image',
  schema_software_app jsonb, breadcrumb_schema jsonb, json_ld jsonb,
  sitemap_included boolean DEFAULT true, index_status text DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.marketplace_product_seo TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.marketplace_product_seo TO authenticated;
GRANT ALL ON public.marketplace_product_seo TO service_role;
ALTER TABLE public.marketplace_product_seo ENABLE ROW LEVEL SECURITY;
CREATE POLICY "mp_seo_read" ON public.marketplace_product_seo FOR SELECT USING (true);
CREATE POLICY "mp_seo_write" ON public.marketplace_product_seo FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============ COMMISSION ============
CREATE TABLE public.marketplace_product_commission (
  product_id uuid PRIMARY KEY REFERENCES public.marketplace_products(id) ON DELETE CASCADE,
  affiliate_pct numeric(5,2) DEFAULT 0, reseller_pct numeric(5,2) DEFAULT 0,
  franchise_pct numeric(5,2) DEFAULT 0, vendor_pct numeric(5,2) DEFAULT 0,
  reseller_price numeric(12,2), franchise_price numeric(12,2), vendor_price numeric(12,2),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.marketplace_product_commission TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.marketplace_product_commission TO authenticated;
GRANT ALL ON public.marketplace_product_commission TO service_role;
ALTER TABLE public.marketplace_product_commission ENABLE ROW LEVEL SECURITY;
CREATE POLICY "mp_comm_read" ON public.marketplace_product_commission FOR SELECT USING (true);
CREATE POLICY "mp_comm_write" ON public.marketplace_product_commission FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============ PROFIT ============
CREATE TABLE public.marketplace_product_profit (
  product_id uuid PRIMARY KEY REFERENCES public.marketplace_products(id) ON DELETE CASCADE,
  cost_price numeric(12,2) DEFAULT 0, selling_price numeric(12,2) DEFAULT 0,
  profit_margin_pct numeric(5,2) DEFAULT 0, estimated_profit numeric(12,2) DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.marketplace_product_profit TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.marketplace_product_profit TO authenticated;
GRANT ALL ON public.marketplace_product_profit TO service_role;
ALTER TABLE public.marketplace_product_profit ENABLE ROW LEVEL SECURITY;
CREATE POLICY "mp_profit_read" ON public.marketplace_product_profit FOR SELECT USING (true);
CREATE POLICY "mp_profit_write" ON public.marketplace_product_profit FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============ HASHTAGS ============
CREATE TABLE public.marketplace_product_hashtags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.marketplace_products(id) ON DELETE CASCADE,
  tag text NOT NULL, kind text NOT NULL DEFAULT 'primary',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.marketplace_product_hashtags TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.marketplace_product_hashtags TO authenticated;
GRANT ALL ON public.marketplace_product_hashtags TO service_role;
ALTER TABLE public.marketplace_product_hashtags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "mp_hash_read" ON public.marketplace_product_hashtags FOR SELECT USING (true);
CREATE POLICY "mp_hash_write" ON public.marketplace_product_hashtags FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE INDEX idx_mp_hashtags_product ON public.marketplace_product_hashtags(product_id);

-- ============ PRICING PLANS ============
CREATE TABLE public.marketplace_product_pricing_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.marketplace_products(id) ON DELETE CASCADE,
  plan_name text NOT NULL, billing_period text DEFAULT 'lifetime',
  cost_price numeric(12,2) DEFAULT 0, selling_price numeric(12,2) DEFAULT 0,
  features jsonb DEFAULT '[]'::jsonb, sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.marketplace_product_pricing_plans TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.marketplace_product_pricing_plans TO authenticated;
GRANT ALL ON public.marketplace_product_pricing_plans TO service_role;
ALTER TABLE public.marketplace_product_pricing_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "mp_pricing_read" ON public.marketplace_product_pricing_plans FOR SELECT USING (true);
CREATE POLICY "mp_pricing_write" ON public.marketplace_product_pricing_plans FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE INDEX idx_mp_pricing_product ON public.marketplace_product_pricing_plans(product_id);

-- ============ FEATURES ============
CREATE TABLE public.marketplace_product_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.marketplace_products(id) ON DELETE CASCADE,
  title text NOT NULL, description text, icon text, sort_order integer DEFAULT 0
);
GRANT SELECT ON public.marketplace_product_features TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.marketplace_product_features TO authenticated;
GRANT ALL ON public.marketplace_product_features TO service_role;
ALTER TABLE public.marketplace_product_features ENABLE ROW LEVEL SECURITY;
CREATE POLICY "mp_feat_read" ON public.marketplace_product_features FOR SELECT USING (true);
CREATE POLICY "mp_feat_write" ON public.marketplace_product_features FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE INDEX idx_mp_features_product ON public.marketplace_product_features(product_id);

-- ============ MODULES ============
CREATE TABLE public.marketplace_product_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.marketplace_products(id) ON DELETE CASCADE,
  name text NOT NULL, description text, sort_order integer DEFAULT 0
);
GRANT SELECT ON public.marketplace_product_modules TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.marketplace_product_modules TO authenticated;
GRANT ALL ON public.marketplace_product_modules TO service_role;
ALTER TABLE public.marketplace_product_modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "mp_mod_read" ON public.marketplace_product_modules FOR SELECT USING (true);
CREATE POLICY "mp_mod_write" ON public.marketplace_product_modules FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE INDEX idx_mp_modules_product ON public.marketplace_product_modules(product_id);

-- ============ TECHNOLOGY ============
CREATE TABLE public.marketplace_product_technology (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.marketplace_products(id) ON DELETE CASCADE,
  name text NOT NULL, category text, version text
);
GRANT SELECT ON public.marketplace_product_technology TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.marketplace_product_technology TO authenticated;
GRANT ALL ON public.marketplace_product_technology TO service_role;
ALTER TABLE public.marketplace_product_technology ENABLE ROW LEVEL SECURITY;
CREATE POLICY "mp_tech_read" ON public.marketplace_product_technology FOR SELECT USING (true);
CREATE POLICY "mp_tech_write" ON public.marketplace_product_technology FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE INDEX idx_mp_tech_product ON public.marketplace_product_technology(product_id);

-- ============ SCREENSHOTS ============
CREATE TABLE public.marketplace_product_screenshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.marketplace_products(id) ON DELETE CASCADE,
  url text NOT NULL, caption text, sort_order integer DEFAULT 0
);
GRANT SELECT ON public.marketplace_product_screenshots TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.marketplace_product_screenshots TO authenticated;
GRANT ALL ON public.marketplace_product_screenshots TO service_role;
ALTER TABLE public.marketplace_product_screenshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "mp_shot_read" ON public.marketplace_product_screenshots FOR SELECT USING (true);
CREATE POLICY "mp_shot_write" ON public.marketplace_product_screenshots FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE INDEX idx_mp_shots_product ON public.marketplace_product_screenshots(product_id);

-- ============ RELATED ============
CREATE TABLE public.marketplace_product_related (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.marketplace_products(id) ON DELETE CASCADE,
  related_product_id uuid NOT NULL REFERENCES public.marketplace_products(id) ON DELETE CASCADE,
  relation_kind text NOT NULL DEFAULT 'similar',
  UNIQUE (product_id, related_product_id, relation_kind)
);
GRANT SELECT ON public.marketplace_product_related TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.marketplace_product_related TO authenticated;
GRANT ALL ON public.marketplace_product_related TO service_role;
ALTER TABLE public.marketplace_product_related ENABLE ROW LEVEL SECURITY;
CREATE POLICY "mp_rel_read" ON public.marketplace_product_related FOR SELECT USING (true);
CREATE POLICY "mp_rel_write" ON public.marketplace_product_related FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE INDEX idx_mp_related_product ON public.marketplace_product_related(product_id);

-- ============ DOWNLOADS ============
CREATE TABLE public.marketplace_product_downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.marketplace_products(id) ON DELETE CASCADE,
  label text NOT NULL, url text NOT NULL, file_size bigint, version text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.marketplace_product_downloads TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.marketplace_product_downloads TO authenticated;
GRANT ALL ON public.marketplace_product_downloads TO service_role;
ALTER TABLE public.marketplace_product_downloads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "mp_dl_read" ON public.marketplace_product_downloads FOR SELECT USING (true);
CREATE POLICY "mp_dl_write" ON public.marketplace_product_downloads FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE INDEX idx_mp_dl_product ON public.marketplace_product_downloads(product_id);

-- ============ DOCUMENTATION ============
CREATE TABLE public.marketplace_product_documentation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.marketplace_products(id) ON DELETE CASCADE,
  title text NOT NULL, url text, content text, sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.marketplace_product_documentation TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.marketplace_product_documentation TO authenticated;
GRANT ALL ON public.marketplace_product_documentation TO service_role;
ALTER TABLE public.marketplace_product_documentation ENABLE ROW LEVEL SECURITY;
CREATE POLICY "mp_doc_read" ON public.marketplace_product_documentation FOR SELECT USING (true);
CREATE POLICY "mp_doc_write" ON public.marketplace_product_documentation FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE INDEX idx_mp_doc_product ON public.marketplace_product_documentation(product_id);

-- ============ VERSIONS ============
CREATE TABLE public.marketplace_product_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.marketplace_products(id) ON DELETE CASCADE,
  version text NOT NULL, released_at timestamptz DEFAULT now(),
  notes text, is_current boolean DEFAULT false
);
GRANT SELECT ON public.marketplace_product_versions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.marketplace_product_versions TO authenticated;
GRANT ALL ON public.marketplace_product_versions TO service_role;
ALTER TABLE public.marketplace_product_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "mp_ver_read" ON public.marketplace_product_versions FOR SELECT USING (true);
CREATE POLICY "mp_ver_write" ON public.marketplace_product_versions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE INDEX idx_mp_ver_product ON public.marketplace_product_versions(product_id);

-- ============ CHANGELOG ============
CREATE TABLE public.marketplace_product_changelog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.marketplace_products(id) ON DELETE CASCADE,
  entry_date timestamptz DEFAULT now(), title text NOT NULL,
  description text, change_type text
);
GRANT SELECT ON public.marketplace_product_changelog TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.marketplace_product_changelog TO authenticated;
GRANT ALL ON public.marketplace_product_changelog TO service_role;
ALTER TABLE public.marketplace_product_changelog ENABLE ROW LEVEL SECURITY;
CREATE POLICY "mp_chg_read" ON public.marketplace_product_changelog FOR SELECT USING (true);
CREATE POLICY "mp_chg_write" ON public.marketplace_product_changelog FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE INDEX idx_mp_chg_product ON public.marketplace_product_changelog(product_id);

-- ============ ANALYTICS ============
CREATE TABLE public.marketplace_product_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.marketplace_products(id) ON DELETE CASCADE,
  day date NOT NULL DEFAULT CURRENT_DATE,
  views integer DEFAULT 0, clicks integer DEFAULT 0,
  sales integer DEFAULT 0, revenue numeric(12,2) DEFAULT 0,
  UNIQUE(product_id, day)
);
GRANT SELECT ON public.marketplace_product_analytics TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.marketplace_product_analytics TO authenticated;
GRANT ALL ON public.marketplace_product_analytics TO service_role;
ALTER TABLE public.marketplace_product_analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "mp_an_read" ON public.marketplace_product_analytics FOR SELECT USING (true);
CREATE POLICY "mp_an_write" ON public.marketplace_product_analytics FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE INDEX idx_mp_an_product ON public.marketplace_product_analytics(product_id);

-- ============ TRIGGERS (reuse existing public.set_updated_at) ============
CREATE TRIGGER trg_mp_products_updated BEFORE UPDATE ON public.marketplace_products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_mp_seo_updated BEFORE UPDATE ON public.marketplace_product_seo
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_mp_commission_updated BEFORE UPDATE ON public.marketplace_product_commission
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_mp_profit_updated BEFORE UPDATE ON public.marketplace_product_profit
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ AUTO-CREATE COMPANIONS ============
CREATE OR REPLACE FUNCTION public.mp_auto_create_companions()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.marketplace_product_seo (product_id, seo_title, seo_slug, meta_title, meta_description)
    VALUES (NEW.id, NEW.name, NEW.slug, NEW.name, COALESCE(NEW.tagline, NEW.description))
    ON CONFLICT (product_id) DO NOTHING;
  INSERT INTO public.marketplace_product_commission (product_id) VALUES (NEW.id) ON CONFLICT DO NOTHING;
  INSERT INTO public.marketplace_product_profit (product_id, cost_price, selling_price, profit_margin_pct, estimated_profit)
    VALUES (
      NEW.id,
      COALESCE(NEW.cost_price,0),
      COALESCE(NEW.selling_price,0),
      CASE WHEN COALESCE(NEW.selling_price,0) > 0 THEN ROUND(((NEW.selling_price - NEW.cost_price) / NEW.selling_price * 100)::numeric, 2) ELSE 0 END,
      COALESCE(NEW.selling_price,0) - COALESCE(NEW.cost_price,0)
    )
    ON CONFLICT (product_id) DO NOTHING;
  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.mp_auto_create_companions() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER trg_mp_products_auto_companions
  AFTER INSERT ON public.marketplace_products
  FOR EACH ROW EXECUTE FUNCTION public.mp_auto_create_companions();
