
-- Phase 3a: Managers (partners) schema — additive only
CREATE TYPE public.partner_type AS ENUM ('vendor','reseller','affiliate','franchise','influencer','partner');
CREATE TYPE public.partner_status AS ENUM ('pending','active','suspended','terminated');

CREATE TABLE public.partner_organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type public.partner_type NOT NULL,
  owner_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status public.partner_status NOT NULL DEFAULT 'pending',
  tier TEXT,
  contact_email TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.partner_organizations TO authenticated;
GRANT ALL ON public.partner_organizations TO service_role;
ALTER TABLE public.partner_organizations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage partners" ON public.partner_organizations FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Owners read own partner" ON public.partner_organizations FOR SELECT TO authenticated
  USING (owner_user_id = auth.uid());
CREATE POLICY "Owners update own partner" ON public.partner_organizations FOR UPDATE TO authenticated
  USING (owner_user_id = auth.uid()) WITH CHECK (owner_user_id = auth.uid());
CREATE TRIGGER trg_partner_orgs_updated BEFORE UPDATE ON public.partner_organizations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.partner_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES public.partner_organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member',
  status public.partner_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (partner_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.partner_members TO authenticated;
GRANT ALL ON public.partner_members TO service_role;
ALTER TABLE public.partner_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage members" ON public.partner_members FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Members read own row" ON public.partner_members FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE TRIGGER trg_partner_members_updated BEFORE UPDATE ON public.partner_members
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.partner_commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES public.partner_organizations(id) ON DELETE CASCADE,
  rate_pct NUMERIC(6,3) NOT NULL DEFAULT 0,
  model TEXT NOT NULL DEFAULT 'revenue_share',
  currency TEXT NOT NULL DEFAULT 'USD',
  effective_from TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.partner_commissions TO authenticated;
GRANT ALL ON public.partner_commissions TO service_role;
ALTER TABLE public.partner_commissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage commissions" ON public.partner_commissions FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Owners read own commissions" ON public.partner_commissions FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.partner_organizations p WHERE p.id=partner_id AND p.owner_user_id=auth.uid()));
CREATE TRIGGER trg_partner_commissions_updated BEFORE UPDATE ON public.partner_commissions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.partner_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES public.partner_organizations(id) ON DELETE CASCADE,
  amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'pending',
  period_start DATE,
  period_end DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.partner_payouts TO authenticated;
GRANT ALL ON public.partner_payouts TO service_role;
ALTER TABLE public.partner_payouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage payouts" ON public.partner_payouts FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Owners read own payouts" ON public.partner_payouts FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.partner_organizations p WHERE p.id=partner_id AND p.owner_user_id=auth.uid()));
CREATE TRIGGER trg_partner_payouts_updated BEFORE UPDATE ON public.partner_payouts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.partner_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES public.partner_organizations(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.partner_events TO authenticated;
GRANT ALL ON public.partner_events TO service_role;
ALTER TABLE public.partner_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read all events" ON public.partner_events FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Owners read own events" ON public.partner_events FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.partner_organizations p WHERE p.id=partner_id AND p.owner_user_id=auth.uid()));
CREATE POLICY "Admins insert events" ON public.partner_events FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE INDEX idx_partner_orgs_owner ON public.partner_organizations(owner_user_id);
CREATE INDEX idx_partner_members_user ON public.partner_members(user_id);
CREATE INDEX idx_partner_events_partner ON public.partner_events(partner_id, created_at DESC);
