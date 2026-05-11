import * as Icons from "lucide-react";
import type { DashSpec } from "@/data/dashboards";

const accentClass = (a: string) => {
  switch (a) {
    case "primary": return "from-primary/30 to-primary/5 text-primary border-primary/30";
    case "accent": return "from-accent/30 to-accent/5 text-accent border-accent/30";
    case "success": return "from-success/30 to-success/5 text-success border-success/30";
    case "warning": return "from-warning/30 to-warning/5 text-warning border-warning/30";
    case "destructive": return "from-destructive/30 to-destructive/5 text-destructive border-destructive/30";
    case "info": return "from-info/30 to-info/5 text-info border-info/30";
    case "neon": return "from-neon/30 to-neon/5 text-neon border-neon/30";
    default: return "from-primary/30 to-primary/5 text-primary border-primary/30";
  }
};

function Sparkline({ color = "currentColor" }: { color?: string }) {
  const pts = Array.from({ length: 24 }, (_, i) => {
    const y = 30 - (Math.sin(i / 2) * 10 + Math.random() * 8);
    return `${i * 6},${y.toFixed(1)}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 144 40" className="w-full h-10">
      <polyline fill="none" stroke={color} strokeWidth="1.5" points={pts} opacity="0.9" />
    </svg>
  );
}

function Bars({ n = 12 }: { n?: number }) {
  return (
    <div className="flex items-end gap-1 h-24">
      {Array.from({ length: n }).map((_, i) => {
        const h = 20 + Math.round(Math.abs(Math.sin(i * 1.3)) * 70 + Math.random() * 20);
        return (
          <div
            key={i}
            className="flex-1 rounded-t bg-gradient-to-t from-primary/60 to-accent/80"
            style={{ height: `${h}%` }}
          />
        );
      })}
    </div>
  );
}

function Donut({ value = 76, label = "" }: { value?: number; label?: string }) {
  const c = 2 * Math.PI * 32;
  return (
    <div className="relative w-28 h-28">
      <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
        <circle cx="40" cy="40" r="32" stroke="var(--color-border)" strokeWidth="8" fill="none" />
        <circle
          cx="40" cy="40" r="32"
          stroke="var(--color-primary)" strokeWidth="8" fill="none"
          strokeDasharray={`${(value/100)*c} ${c}`} strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="text-xl font-semibold">{value}%</div>
          <div className="text-[10px] text-muted-foreground">{label}</div>
        </div>
      </div>
    </div>
  );
}

function WorldDots() {
  const dots = Array.from({ length: 80 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 50 + 10,
    s: Math.random() > 0.85,
  }));
  return (
    <div className="relative w-full h-48 rounded-md grid-bg overflow-hidden border border-border">
      {dots.map((d, i) => (
        <div
          key={i}
          className={`absolute rounded-full ${d.s ? "bg-accent shadow-[0_0_8px_var(--color-accent)] animate-pulse" : "bg-primary/60"}`}
          style={{ left: `${d.x}%`, top: `${d.y}%`, width: d.s ? 6 : 3, height: d.s ? 6 : 3 }}
        />
      ))}
    </div>
  );
}

function Activity({ accent }: { accent: string }) {
  const items = [
    "Pipeline run #4128 succeeded",
    "User akira.k granted role admin",
    "Anomaly detected: south-east edge POP",
    "SLA breach forecast in 24m",
    "Backup snapshot replicated to eu-west-2",
    "AI agent eval pass 96.2%",
    "New deal: Acme Corp · $284k · stage Negotiation",
    "Compliance check passed: SOC2 CC7.2",
  ];
  return (
    <ul className="space-y-2 text-xs">
      {items.map((t, i) => (
        <li key={i} className="flex items-start gap-2">
          <span className={`mt-1 w-1.5 h-1.5 rounded-full bg-${accent === "neon" ? "accent" : accent}`} />
          <span className="text-muted-foreground">
            <span className="text-foreground">{t}</span>
            <span className="ml-2 opacity-60">{i + 1}m ago</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

function Table({ section }: { section: string }) {
  const cols = ["ID", "Name", "Owner", "Status", "Updated"];
  const statuses = ["Active", "Pending", "Healthy", "Warn", "Closed"];
  return (
    <div className="overflow-hidden rounded-md border border-border">
      <table className="w-full text-xs">
        <thead className="bg-muted/40">
          <tr>{cols.map((c) => <th key={c} className="text-left px-3 py-2 font-medium text-muted-foreground">{c}</th>)}</tr>
        </thead>
        <tbody>
          {Array.from({ length: 8 }).map((_, i) => (
            <tr key={i} className="border-t border-border hover:bg-muted/30">
              <td className="px-3 py-2 font-mono text-[11px]">#{(4128 + i).toString(16).toUpperCase()}</td>
              <td className="px-3 py-2">{section} item {i + 1}</td>
              <td className="px-3 py-2 text-muted-foreground">user{i+1}@nexus.io</td>
              <td className="px-3 py-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-success" /> {statuses[i % statuses.length]}
                </span>
              </td>
              <td className="px-3 py-2 text-muted-foreground">{i + 1}h ago</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DashboardView({ d }: { d: DashSpec }) {
  const Icon = (Icons as never as Record<string, Icons.LucideIcon>)[d.icon] || Icons.LayoutDashboard;
  const accent = accentClass(d.accent);

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${accent} border grid place-items-center`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              {d.category} · Clone of {d.clone}
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">{d.title}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          {d.tags.map((t) => (
            <span key={t} className="px-2 py-1 rounded-md bg-muted border border-border">{t}</span>
          ))}
          <button className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 inline-flex items-center gap-1.5">
            <Icons.Zap className="w-3.5 h-3.5" /> Live
          </button>
        </div>
      </header>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {d.metrics.map((m, i) => (
          <div key={i} className="glass rounded-xl p-4 relative overflow-hidden">
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{m.label}</div>
            <div className="mt-2 text-2xl font-semibold tracking-tight">{m.value}</div>
            {m.delta && (
              <div className={`mt-1 text-xs inline-flex items-center gap-1 ${m.trend === "down" ? "text-destructive" : "text-success"}`}>
                {m.trend === "down" ? <Icons.ArrowDownRight className="w-3 h-3" /> : <Icons.ArrowUpRight className="w-3 h-3" />}
                {m.delta}
              </div>
            )}
            <div className={`mt-2 text-${d.accent === "neon" ? "accent" : d.accent}`}>
              <Sparkline />
            </div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-12 gap-4">
        <div className="glass rounded-xl p-4 col-span-12 lg:col-span-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">{d.sections[0]}</h2>
            <div className="flex gap-1 text-[11px]">
              {["1h","24h","7d","30d"].map((s,i)=>(
                <button key={s} className={`px-2 py-1 rounded ${i===1?"bg-muted":""} text-muted-foreground hover:text-foreground`}>{s}</button>
              ))}
            </div>
          </div>
          <Bars n={36} />
        </div>
        <div className="glass rounded-xl p-4 col-span-12 lg:col-span-4 flex flex-col items-center justify-center gap-3">
          <h2 className="text-sm font-semibold self-start">Health Score</h2>
          <Donut value={Math.floor(70 + Math.random() * 28)} label="overall" />
          <div className="grid grid-cols-3 gap-2 w-full text-center text-[10px] text-muted-foreground">
            <div><div className="text-foreground text-sm">98</div>Avail</div>
            <div><div className="text-foreground text-sm">82</div>Perf</div>
            <div><div className="text-foreground text-sm">94</div>Sec</div>
          </div>
        </div>

        <div className="glass rounded-xl p-4 col-span-12 lg:col-span-7">
          <h2 className="text-sm font-semibold mb-3">{d.sections[1] ?? "Live Map"}</h2>
          <WorldDots />
        </div>
        <div className="glass rounded-xl p-4 col-span-12 lg:col-span-5">
          <h2 className="text-sm font-semibold mb-3">Activity Stream</h2>
          <Activity accent={d.accent} />
        </div>

        <div className="glass rounded-xl p-4 col-span-12">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">{d.sections[2] ?? "Records"}</h2>
            <div className="flex items-center gap-2">
              <input placeholder="Filter…" className="bg-muted text-xs rounded px-2 py-1 border border-border outline-none" />
              <button className="text-xs px-2 py-1 rounded bg-muted border border-border inline-flex items-center gap-1">
                <Icons.Plus className="w-3 h-3" /> New
              </button>
            </div>
          </div>
          <Table section={d.sections[2] ?? "Item"} />
        </div>

        {d.sections[3] && (
          <div className="glass rounded-xl p-4 col-span-12 md:col-span-6">
            <h2 className="text-sm font-semibold mb-3">{d.sections[3]}</h2>
            <div className="space-y-2">
              {Array.from({length:5}).map((_,i)=>(
                <div key={i} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50">
                  <div className={`w-8 h-8 rounded-md bg-gradient-to-br ${accent} border grid place-items-center`}>
                    <Icons.Hexagon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-medium">{d.sections[3]} #{i+1}</div>
                    <div className="text-[10px] text-muted-foreground">last sync {i+2}m ago · throughput {(Math.random()*100).toFixed(1)}%</div>
                  </div>
                  <div className="text-[11px] text-muted-foreground">v2.{i+1}.0</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="glass rounded-xl p-4 col-span-12 md:col-span-6">
          <h2 className="text-sm font-semibold mb-3">Throughput · Last 24h</h2>
          <Bars n={24} />
        </div>
      </div>
    </div>
  );
}
