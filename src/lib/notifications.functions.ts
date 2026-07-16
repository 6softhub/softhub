// Phase 3b — Notifications server functions (additive)
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export const listMyNotifications = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("notifications")
      .select("id, type, title, body, payload, seen, created_at")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw error;
    return { rows: data ?? [] };
  });

const MarkInput = z.object({ id: z.string().uuid() });

export const markNotificationSeen = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => MarkInput.parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("notifications")
      .update({ seen: true })
      .eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const unreadNotificationCount = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { count, error } = await context.supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("seen", false);
    if (error) throw error;
    return { count: count ?? 0 };
  });
