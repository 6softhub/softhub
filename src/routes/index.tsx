import { createFileRoute, Link } from "@tanstack/react-router";
import * as Icons from "lucide-react";
import { DASHBOARDS } from "@/data/dashboards";

export const Route = createFileRoute("/")({ component: Index });

function Index() {
  const cats = Array.from(new Set(DASHBOARDS.map((d) => d.category)));
  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-8">
      <header className="rounded-2xl glass p-8 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative">
          <div className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Master Control · v75.0</div>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
            Nexus — 75 Enterprise Dashboards, One Brain
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Datadog, Okta, Salesforce, Stripe, Palantir, GitHub, Snowflake, Bloomberg and 67 more —
            unified into a single command surface. Pick any module.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-xs">
            <span className="px-3 py-1.5 rounded-full bg-primary/20 text-primary border border-primary/30 inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> 75/75 modules online
            </span>
            <span className="px-3 py-1.5 rounded-full bg-muted border border-border">Autonomy L4</span>
            <span className="px-3 py-1.5 rounded-full bg-muted border border-border">Latency 42ms p95</span>
            <span className="px-3 py-1.5 rounded-full bg-muted border border-border">12,482 hosts</span>
          </div>
        </div>
      </header>

      {cats.map((c) => (
        <section key={c}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm uppercase tracking-widest text-muted-foreground">{c}</h2>
            <div className="text-xs text-muted-foreground">{DASHBOARDS.filter(d=>d.category===c).length} modules</div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {DASHBOARDS.filter((d) => d.category === c).map((d) => {
              const Icon = (Icons as never as Record<string, Icons.LucideIcon>)[d.icon] || Icons.Square;
              return (
                <Link
                  key={d.slug}
                  to="/d/$slug"
                  params={{ slug: d.slug }}
                  className="glass rounded-xl p-4 hover:border-primary/50 transition-colors group relative overflow-hidden"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/30 to-accent/30 border border-border grid place-items-center group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold truncate">{d.title}</div>
                      <div className="text-[11px] text-muted-foreground truncate">Clone · {d.clone}</div>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {d.tags.slice(0, 3).map((t) => (
                      <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-muted">{t}</span>
                    ))}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
