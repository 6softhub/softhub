
-- Replace permissive USING(true)/WITH CHECK(true) write policies with admin-only writes.
-- Public read policies are preserved.

DO $$
DECLARE
  t text;
  tbls text[] := ARRAY[
    'marketplace_products',
    'marketplace_product_seo',
    'marketplace_product_commission',
    'marketplace_product_profit',
    'marketplace_product_hashtags',
    'marketplace_product_pricing_plans',
    'marketplace_product_features',
    'marketplace_product_modules',
    'marketplace_product_technology',
    'marketplace_product_screenshots',
    'marketplace_product_related',
    'marketplace_product_downloads',
    'marketplace_product_documentation',
    'marketplace_product_versions',
    'marketplace_product_changelog',
    'marketplace_product_analytics'
  ];
  pol RECORD;
BEGIN
  FOREACH t IN ARRAY tbls LOOP
    FOR pol IN
      SELECT policyname FROM pg_policies
       WHERE schemaname = 'public' AND tablename = t
         AND cmd IN ('INSERT','UPDATE','DELETE','ALL')
    LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, t);
    END LOOP;
  END LOOP;
END $$;

-- Admin-only write policies via has_role()
CREATE POLICY "mp_products_admin_write" ON public.marketplace_products
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "mp_seo_admin_write" ON public.marketplace_product_seo
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "mp_comm_admin_write" ON public.marketplace_product_commission
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "mp_profit_admin_write" ON public.marketplace_product_profit
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "mp_hash_admin_write" ON public.marketplace_product_hashtags
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "mp_pricing_admin_write" ON public.marketplace_product_pricing_plans
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "mp_feat_admin_write" ON public.marketplace_product_features
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "mp_mod_admin_write" ON public.marketplace_product_modules
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "mp_tech_admin_write" ON public.marketplace_product_technology
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "mp_shot_admin_write" ON public.marketplace_product_screenshots
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "mp_rel_admin_write" ON public.marketplace_product_related
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "mp_dl_admin_write" ON public.marketplace_product_downloads
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "mp_doc_admin_write" ON public.marketplace_product_documentation
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "mp_ver_admin_write" ON public.marketplace_product_versions
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "mp_chg_admin_write" ON public.marketplace_product_changelog
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "mp_an_admin_write" ON public.marketplace_product_analytics
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
