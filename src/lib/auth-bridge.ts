import { supabase } from "@/integrations/supabase/client";
import type { RoleKey } from "@/lib/roles";
import { isRoleKey, ROLE_ORDER } from "@/lib/roles";

/**
 * AUTH BRIDGE — wired to Lovable Cloud (Supabase) auth.
 *
 * `getAuthenticatedRole()` returns the currently signed-in user's ACTIVE
 * dashboard role (from `profiles.active_role`, falling back to the first
 * assigned role in `user_roles`, then null when signed-out).
 */

export const EXISTING_LOGIN_URL = "/login";
const ACTIVE_ROLE_STORAGE = "sv_active_role";

export async function getAuthenticatedRole(): Promise<RoleKey | null> {
  if (typeof window === "undefined") return null;

  // 1) Ask Supabase for the current user.
  const { data } = await supabase.auth.getUser();
  const user = data?.user;

  if (!user) {
    // Dev preview fallback — lets you browse dashboards without a session.
    const stored = window.localStorage.getItem(ACTIVE_ROLE_STORAGE);
    return isRoleKey(stored) ? stored : null;
  }

  // 2) Prefer explicit active_role on the profile.
  const { data: profile } = await supabase
    .from("profiles")
    .select("active_role")
    .eq("id", user.id)
    .maybeSingle();

  const active = (profile as { active_role?: string | null } | null)?.active_role;
  if (isRoleKey(active)) return active;

  // 3) Otherwise, pick the first role assigned in user_roles.
  const { data: rows } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id);

  if (rows?.length) {
    for (const r of rows) {
      const k = (r as { role: string }).role;
      if (isRoleKey(k)) return k;
    }
  }

  // 4) Last-resort dev fallback so the UI is never empty for a signed-in user.
  const stored = window.localStorage.getItem(ACTIVE_ROLE_STORAGE);
  return isRoleKey(stored) ? stored : ROLE_ORDER[0];
}

export async function signOut(): Promise<void> {
  try { await supabase.auth.signOut(); } catch { /* ignore */ }
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(ACTIVE_ROLE_STORAGE);
  }
}

/** Persist the active role in local storage AND (when signed in) on the profile. */
export function devSetRole(role: RoleKey) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(ACTIVE_ROLE_STORAGE, role);
  }
  // Fire-and-forget: sync onto the profile if a session exists.
  void (async () => {
    const { data } = await supabase.auth.getUser();
    if (!data?.user) return;
    await supabase.from("profiles").update({ active_role: role }).eq("id", data.user.id);
  })();
}
