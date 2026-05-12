import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import * as Icons from "lucide-react";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("operator@nexus.io");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate({ to: "/" });
    }, 700);
  };

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
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Authenticated Access</div>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
              75 Enterprise Dashboards.
            </span>
            <br />One Brain. One Login.
          </h1>
          <p className="text-sm text-muted-foreground">
            Datadog · Okta · Salesforce · Stripe · Palantir · GitHub · Snowflake · Bloomberg —
            unified into a single command surface protected by zero-trust SSO.
          </p>

          <div className="grid grid-cols-3 gap-3 pt-4">
            {[
              { k: "Modules", v: "75/75", tone: "text-success" },
              { k: "MFA", v: "96%", tone: "text-info" },
              { k: "Latency", v: "42ms", tone: "text-accent" },
            ].map((s) => (
              <div key={s.k} className="glass rounded-xl p-3">
                <div className={`text-lg font-semibold ${s.tone}`}>{s.v}</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{s.k}</div>
              </div>
            ))}
          </div>

          <div className="glass rounded-xl p-4 text-xs text-muted-foreground flex items-start gap-3">
            <Icons.ShieldCheck className="w-4 h-4 text-success shrink-0 mt-0.5" />
            <div>
              <div className="text-foreground font-medium">SOC2 · ISO27001 · HIPAA · GDPR</div>
              All sessions are encrypted end-to-end. Sign-ins are evaluated by behavioral AI in 38ms.
            </div>
          </div>
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
              {mode === "signin" ? "Use your enterprise credentials to enter the command center." : "Request access — your tenant admin will approve."}
            </p>
          </div>

          {/* SSO providers */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { n: "Google", i: Icons.Chrome },
              { n: "Microsoft", i: Icons.Square },
              { n: "Okta SSO", i: Icons.ShieldCheck },
              { n: "GitHub", i: Icons.Github },
            ].map((p) => (
              <button key={p.n} className="inline-flex items-center justify-center gap-2 h-10 rounded-md border border-border bg-card hover:bg-muted text-xs font-medium transition-colors">
                <p.i className="w-3.5 h-3.5" /> {p.n}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> or with email <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Full name</label>
                <div className="relative">
                  <Icons.User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input className="w-full h-10 pl-9 pr-3 rounded-md bg-card border border-border focus:border-primary outline-none text-sm" placeholder="Tony Stark" />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Work email</label>
              <div className="relative">
                <Icons.Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="w-full h-10 pl-9 pr-3 rounded-md bg-card border border-border focus:border-primary outline-none text-sm"
                  placeholder="you@company.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-muted-foreground">Password</label>
                {mode === "signin" && (
                  <button type="button" className="text-[11px] text-primary hover:underline">Forgot password?</button>
                )}
              </div>
              <div className="relative">
                <Icons.Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPw ? "text" : "password"}
                  className="w-full h-10 pl-9 pr-10 rounded-md bg-card border border-border focus:border-primary outline-none text-sm"
                  placeholder="••••••••••"
                />
                <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPw ? <Icons.EyeOff className="w-4 h-4" /> : <Icons.Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="inline-flex items-center gap-2 text-muted-foreground">
                <input type="checkbox" defaultChecked className="accent-[var(--color-primary)]" />
                Trust this device for 30 days
              </label>
              <span className="inline-flex items-center gap-1.5 text-success">
                <Icons.ShieldCheck className="w-3.5 h-3.5" /> MFA armed
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-md bg-gradient-to-r from-primary to-accent text-primary-foreground text-sm font-semibold shadow-lg shadow-primary/30 inline-flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <><Icons.Loader2 className="w-4 h-4 animate-spin" /> Authenticating…</>
              ) : (
                <>{mode === "signin" ? "Enter Command Center" : "Request access"} <Icons.ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="text-[11px] text-center text-muted-foreground">
            By continuing you agree to the <a className="underline">MSA</a> and <a className="underline">DPA</a>.
            Need help? <Link to="/" className="text-primary hover:underline">Skip to dashboards →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
