// Phase 3a — Partner/Manager server functions (additive, admin/owner scoped by RLS)
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const PartnerType = z.enum([
  "vendor",
  "reseller",
  "affiliate",
  "franchise",
  "influencer",
  "partner",
]);

export const listPartners = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("partner_organizations")
      .select("id, name, type, status, tier, contact_email, owner_user_id, created_at")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw error;
    return { rows: data ?? [] };
  });

const CreateInput = z.object({
  name: z.string().min(1).max(200),
  type: PartnerType,
  tier: z.string().max(60).optional(),
  contact_email: z.string().email().optional(),
  owner_user_id: z.string().uuid().optional(),
});

export const createPartner = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => CreateInput.parse(input))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("partner_organizations")
      .insert({
        name: data.name,
        type: data.type,
        tier: data.tier ?? null,
        contact_email: data.contact_email ?? null,
        owner_user_id: data.owner_user_id ?? null,
      })
      .select()
      .single();
    if (error) throw error;
    return { row };
  });

const CommissionInput = z.object({
  partner_id: z.string().uuid(),
  rate_pct: z.number().min(0).max(100),
  model: z.string().default("revenue_share"),
  currency: z.string().length(3).default("USD"),
});

export const setPartnerCommission = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => CommissionInput.parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("partner_commissions").insert({
      partner_id: data.partner_id,
      rate_pct: data.rate_pct,
      model: data.model,
      currency: data.currency,
    });
    if (error) throw error;
    return { ok: true };
  });
