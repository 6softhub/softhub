import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import * as Icons from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { devSetRole } from "@/lib/auth-bridge";
import { ROLES, ROLE_ORDER, type RoleKey } from "@/lib/roles";

export const Route = createFileRoute("/login")({
  ssr: false,
  head: () => ({ meta: [{ title: "Sign in — Nexus" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<RoleKey>("admin");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  // If already signed in, jump to the role dashboard.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (cancelled || !data.user) return;
      const { data: profile } = await supabase
        .from("profiles")
        .select("active_role")
        .eq("id", data.user.id)
        .maybeSingle();
      const active = (profile as { active_role?: string | null } | null)?.active_role;
      const target = (ROLE_ORDER as readonly string[]).includes(active ?? "")
        ? (active as RoleKey)
        : "admin";
      navigate({ to: "/dashboard/$role", params: { role: target }, replace: true });
    })();
    return () => { cancelled = true; };
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/login`,
            data: { display_name: name || email.split("@")[0] },
          },
        });
        if (error) throw error;
        if (data.user) {
          await supabase.from("profiles").update({ active_role: role }).eq("id", data.user.id);
          // Grant that role.
          await supabase.from("user_roles").insert({ user_id: data.user.id, role });
        }
        toast.success("Account created — signing you in…");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.user) {
          await supabase.from("profiles").update({ active_role: role }).eq("id", data.user.id);
        }
      }
      devSetRole(role);
      navigate({ to: "/dashboard/$role", params: { role }, replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full grid lg:grid-cols-[1.1fr_1fr] bg-background relative overflow-hidden">
      {/* Left — brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-10 border-r border-border overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-[520px] h-[520px] rounded-full bg-accent/20 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent grid place-items-center shadow-lg shadow-primary/30">
            <Icons.Hexagon className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <div className="text-sm font-semibold tracking-tight">NEXUS</div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Master Control · v75.0</div>
          </div>
        </div>

        <div className="relative space-y-6 max-w-lg">
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Role-Based Access</div>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
              8 Role Dashboards.
            </span>
            <br />One Enterprise Brain.
          </h1>
          <p className="text-sm text-muted-foreground">
            Author · Vendor · Reseller · Affiliate · Influencer · Franchise · SEO · Admin —
            every workspace routed automatically after sign-in.
          </p>
        </div>

        <div className="relative flex items-center gap-4 text-[10px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> All systems nominal</span>
          <span>·</span>
          <span>© 2026 Nexus Industries</span>
        </div>
      </div>

      {/* Right — form */}
      <div className="relative flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md space-y-6">
          <div className="lg:hidden flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent grid place-items-center">
              <Icons.Hexagon className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="text-sm font-semibold">NEXUS</div>
          </div>

          <div className="inline-flex p-1 rounded-lg bg-muted text-xs">
            {(["signin", "signup"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`px-4 py-1.5 rounded-md transition-colors ${mode === m ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
              >
                {m === "signin" ? "Sign in" : "Create account"}
              </button>
            ))}
          </div>

          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              {mode === "signin" ? "Welcome back, Operator" : "Provision a new operator"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {mode === "signin" ? "Enter your credentials to load your role workspace." : "Pick a role — you'll land on that dashboard."}
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Display name</label>
                <div className="relative">
                  <Icons.User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input value={name} onChange={(e) => setName(e.target.value)} className="w-full h-10 pl-9 pr-3 rounded-md bg-card border border-border focus:border-primary outline-none text-sm" placeholder="Tony Stark" />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Work email</label>
              <div className="relative">
                <Icons.Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input value={email} onChange={(e) => setEmail(e.target.value)} required type="email" className="w-full h-10 pl-9 pr-3 rounded-md bg-card border border-border focus:border-primary outline-none text-sm" placeholder="you@company.com" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Password</label>
              <div className="relative">
                <Icons.Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} type={showPw ? "text" : "password"} className="w-full h-10 pl-9 pr-10 rounded-md bg-card border border-border focus:border-primary outline-none text-sm" placeholder="••••••••••" />
                <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPw ? <Icons.EyeOff className="w-4 h-4" /> : <Icons.Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Active role · lands you on the matching dashboard</label>
              <div className="grid grid-cols-4 gap-1.5">
                {ROLE_ORDER.map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setRole(k)}
                    className={`rounded-lg px-2 py-2 text-[11px] font-medium transition border ${role === k ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:bg-muted"}`}
                    title={ROLES[k].title}
                  >
                    {ROLES[k].name.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-md bg-gradient-to-r from-primary to-accent text-primary-foreground text-sm font-semibold shadow-lg shadow-primary/30 inline-flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <><Icons.Loader2 className="w-4 h-4 animate-spin" /> Authenticating…</>
              ) : (
                <>{mode === "signin" ? "Enter Command Center" : "Create account"} <Icons.ArrowRight className="w-4 h-4" /></>
              )}
            </button>

            <div className="text-center text-[11px] text-muted-foreground">
              <Link to="/" className="hover:text-foreground">← Back to marketplace</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
