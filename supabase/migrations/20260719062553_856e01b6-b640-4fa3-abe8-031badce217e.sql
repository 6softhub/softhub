
-- Add the 7 marketplace/partner user roles used by the imported dashboards.
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'author';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'vendor';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'reseller';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'affiliate';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'influencer';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'franchise';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'seo';

-- Which of the user's roles is currently active — drives the dashboard router.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS active_role public.app_role;
