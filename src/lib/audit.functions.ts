// Phase 4 — Audit / Event Bus helpers (additive, uses existing audit_logs table)
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const LogInput = z.object({
  action: z.string().min(1).max(120),
  resource_type: z.string().max(80).optional(),
  resource_id: z.string().max(120).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const logAuditEvent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => LogInput.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase.from("audit_logs").insert({
      actor_id: userId,
      action: data.action,
      resource_type: data.resource_type ?? null,
      resource_id: data.resource_id ?? null,
      metadata: (data.metadata ?? {}) as never,
    });
    if (error) throw error;
    return { ok: true };
  });

const ListInput = z.object({
  limit: z.number().int().min(1).max(200).default(50),
  resource_type: z.string().optional(),
});

export const listAuditEvents = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => ListInput.parse(input))
  .handler(async ({ data, context }) => {
    let q = context.supabase
      .from("audit_logs")
      .select("id, actor_id, action, resource_type, resource_id, metadata, created_at")
      .order("created_at", { ascending: false })
      .limit(data.limit);
    if (data.resource_type) q = q.eq("resource_type", data.resource_type);
    const { data: rows, error } = await q;
    if (error) throw error;
    return { rows: rows ?? [] };
  });

// Lightweight event bus abstraction on top of audit_logs — namespaced by action="event:<topic>"
const PublishInput = z.object({
  topic: z.string().min(1).max(80),
  payload: z.record(z.string(), z.unknown()).optional(),
});

export const publishEvent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => PublishInput.parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("audit_logs").insert({
      actor_id: context.userId,
      action: `event:${data.topic}`,
      resource_type: "event",
      resource_id: data.topic,
      metadata: (data.payload ?? {}) as never,
    });
    if (error) throw error;
    return { ok: true };
  });
