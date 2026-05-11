import * as Icons from "lucide-react";
import type { ReactNode } from "react";
import type { DashSpec } from "@/data/dashboards";

/* ============================================================
   PRIMITIVES — shared building blocks for all 75 dashboards
   ============================================================ */

export const rng = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

export function Card({ title, right, children, className = "", pad = true }: { title?: string; right?: ReactNode; children: ReactNode; className?: string; pad?: boolean }) {
  return (
    <div className={`glass rounded-xl ${pad ? "p-4" : ""} ${className}`}>
      {(title || right) && (
        <div className={`flex items-center justify-between ${pad ? "mb-3" : "p-4 pb-2"}`}>
          {title && <h3 className="text-sm font-semibold tracking-tight">{title}</h3>}
          {right}
        </div>
      )}
      {children}
    </div>
  );
}

export function Pill({ children, tone = "muted" }: { children: ReactNode; tone?: "muted" | "primary" | "success" | "warning" | "destructive" | "info" | "accent" | "neon" }) {
  const map: Record<string, string> = {
    muted: "bg-muted text-muted-foreground border-border",
    primary: "bg-primary/15 text-primary border-primary/30",
    success: "bg-success/15 text-success border-success/30",
    warning: "bg-warning/15 text-warning border-warning/30",
    destructive: "bg-destructive/15 text-destructive border-destructive/30",
    info: "bg-info/15 text-info border-info/30",
    accent: "bg-accent/15 text-accent border-accent/30",
    neon: "bg-accent/15 text-accent border-accent/30",
  };
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border ${map[tone]}`}>{children}</span>;
}

export function KpiRow({ d }: { d: DashSpec }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {d.metrics.map((m, i) => (
        <div key={i} className="glass rounded-xl p-4">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{m.label}</div>
          <div className="mt-1 text-2xl font-semibold tracking-tight">{m.value}</div>
          <div className="mt-2"><Spark seed={i + 7} /></div>
          {m.delta && (
            <div className={`mt-1 text-[11px] inline-flex items-center gap-1 ${m.trend === "down" ? "text-destructive" : "text-success"}`}>
              {m.trend === "down" ? <Icons.ArrowDownRight className="w-3 h-3" /> : <Icons.ArrowUpRight className="w-3 h-3" />}
              {m.delta}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function Spark({ seed = 1, color = "currentColor", height = 32, smooth = true }: { seed?: number; color?: string; height?: number; smooth?: boolean }) {
  const r = rng(seed);
  const n = 30;
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const y = height - (Math.sin(i / 3 + seed) * height * 0.3 + r() * height * 0.4 + height * 0.3);
    pts.push([i * (120 / n), y]);
  }
  const path = smooth
    ? pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(" ")
    : "";
  return (
    <svg viewBox={`0 0 120 ${height}`} className="w-full" style={{ height }}>
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" />
      <path d={`${path} L120,${height} L0,${height} Z`} fill={color} opacity="0.08" />
    </svg>
  );
}

export function Bars({ seed = 1, n = 24, color = "currentColor", height = 96 }: { seed?: number; n?: number; color?: string; height?: number }) {
  const r = rng(seed);
  return (
    <div className="flex items-end gap-1" style={{ height }}>
      {Array.from({ length: n }).map((_, i) => {
        const h = 20 + r() * 80;
        return <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, background: `linear-gradient(to top, ${color}55, ${color})` }} />;
      })}
    </div>
  );
}

export function Donut({ value, label, color = "var(--color-primary)", size = 110 }: { value: number; label?: string; color?: string; size?: number }) {
  const c = 2 * Math.PI * 32;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
        <circle cx="40" cy="40" r="32" stroke="var(--color-border)" strokeWidth="8" fill="none" />
        <circle cx="40" cy="40" r="32" stroke={color} strokeWidth="8" fill="none" strokeDasharray={`${(value / 100) * c} ${c}`} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="text-xl font-semibold">{value}%</div>
          {label && <div className="text-[10px] text-muted-foreground">{label}</div>}
        </div>
      </div>
    </div>
  );
}

export function Heatmap({ rows = 7, cols = 24, seed = 5, color = "var(--color-primary)" }: { rows?: number; cols?: number; seed?: number; color?: string }) {
  const r = rng(seed);
  return (
    <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {Array.from({ length: rows * cols }).map((_, i) => {
        const v = r();
        return <div key={i} className="aspect-square rounded-sm" style={{ background: color, opacity: 0.1 + v * 0.85 }} />;
      })}
    </div>
  );
}

export function WorldMap({ seed = 3, accent = "var(--color-accent)" }: { seed?: number; accent?: string }) {
  const r = rng(seed);
  const dots = Array.from({ length: 120 }, () => ({ x: r() * 100, y: 15 + r() * 55, hot: r() > 0.85 }));
  const arcs = Array.from({ length: 6 }, () => ({ x1: r() * 100, y1: 20 + r() * 50, x2: r() * 100, y2: 20 + r() * 50 }));
  return (
    <div className="relative w-full h-56 rounded-md grid-bg overflow-hidden border border-border">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 80" preserveAspectRatio="none">
        {arcs.map((a, i) => {
          const mx = (a.x1 + a.x2) / 2;
          const my = Math.min(a.y1, a.y2) - 15;
          return <path key={i} d={`M${a.x1},${a.y1} Q${mx},${my} ${a.x2},${a.y2}`} stroke={accent} strokeWidth="0.2" fill="none" opacity="0.6" />;
        })}
      </svg>
      {dots.map((d, i) => (
        <div key={i} className={`absolute rounded-full ${d.hot ? "animate-pulse" : ""}`}
          style={{ left: `${d.x}%`, top: `${d.y}%`, width: d.hot ? 7 : 3, height: d.hot ? 7 : 3, background: d.hot ? accent : "var(--color-primary)", boxShadow: d.hot ? `0 0 8px ${accent}` : undefined, opacity: d.hot ? 1 : 0.6 }} />
      ))}
    </div>
  );
}

export function DataTable({ columns, rows }: { columns: string[]; rows: (string | ReactNode)[][] }) {
  return (
    <div className="overflow-hidden rounded-md border border-border">
      <table className="w-full text-xs">
        <thead className="bg-muted/40">
          <tr>{columns.map((c) => <th key={c} className="text-left px-3 py-2 font-medium text-muted-foreground">{c}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-border hover:bg-muted/30">
              {r.map((cell, j) => <td key={j} className="px-3 py-2">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function StatusDot({ tone = "success" }: { tone?: "success" | "warning" | "destructive" | "info" | "muted" }) {
  const map: Record<string, string> = {
    success: "bg-success", warning: "bg-warning", destructive: "bg-destructive", info: "bg-info", muted: "bg-muted-foreground",
  };
  return <span className={`inline-block w-1.5 h-1.5 rounded-full ${map[tone]}`} />;
}

export function Kanban({ columns }: { columns: { title: string; tone?: "info" | "warning" | "success" | "destructive" | "muted"; items: { title: string; meta?: string; tag?: string }[] }[] }) {
  return (
    <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0,1fr))` }}>
      {columns.map((c) => (
        <div key={c.title} className="rounded-lg bg-muted/30 border border-border p-2">
          <div className="flex items-center justify-between px-1 pb-2">
            <div className="text-xs font-semibold flex items-center gap-1.5"><StatusDot tone={c.tone || "muted"} />{c.title}</div>
            <span className="text-[10px] text-muted-foreground">{c.items.length}</span>
          </div>
          <div className="space-y-2">
            {c.items.map((it, i) => (
              <div key={i} className="bg-card rounded-md p-2 border border-border hover:border-primary/40 transition-colors">
                <div className="text-xs font-medium leading-tight">{it.title}</div>
                <div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>{it.meta}</span>
                  {it.tag && <Pill>{it.tag}</Pill>}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function Timeline({ items }: { items: { time: string; title: string; tone?: "info" | "warning" | "success" | "destructive" | "muted"; meta?: string }[] }) {
  return (
    <ol className="relative pl-5 space-y-3">
      <span className="absolute left-1.5 top-1 bottom-1 w-px bg-border" />
      {items.map((it, i) => (
        <li key={i} className="relative">
          <span className="absolute -left-3.5 top-1.5"><StatusDot tone={it.tone} /></span>
          <div className="text-xs font-medium">{it.title}</div>
          <div className="text-[10px] text-muted-foreground">{it.time} {it.meta && `· ${it.meta}`}</div>
        </li>
      ))}
    </ol>
  );
}

export function PageHeader({ d, actions }: { d: DashSpec; actions?: ReactNode }) {
  const Icon = (Icons as never as Record<string, Icons.LucideIcon>)[d.icon] || Icons.LayoutDashboard;
  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 border border-border grid place-items-center">
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{d.category} · Clone of {d.clone}</div>
          <h1 className="text-2xl font-semibold tracking-tight">{d.title}</h1>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {d.tags.slice(0, 4).map((t) => <Pill key={t}>{t}</Pill>)}
        {actions}
        <button className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium inline-flex items-center gap-1.5">
          <Icons.Zap className="w-3.5 h-3.5" /> Live
        </button>
      </div>
    </header>
  );
}

export function Shell({ d, children }: { d: DashSpec; children: ReactNode }) {
  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <PageHeader d={d} />
      <KpiRow d={d} />
      {children}
    </div>
  );
}

export function ProgressBar({ value, color = "var(--color-primary)" }: { value: number; color?: string }) {
  return (
    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
      <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
    </div>
  );
}

export function LineSeries({ seed = 1, lines = 3, height = 180 }: { seed?: number; lines?: number; height?: number }) {
  const r = rng(seed);
  const colors = ["var(--color-primary)", "var(--color-accent)", "var(--color-success)", "var(--color-warning)"];
  const series = Array.from({ length: lines }, () =>
    Array.from({ length: 40 }, (_, i) => height - (Math.sin(i / 4 + r() * 6) * height * 0.25 + r() * height * 0.35 + height * 0.25))
  );
  return (
    <svg viewBox={`0 0 400 ${height}`} className="w-full" style={{ height }}>
      {[0.25, 0.5, 0.75].map((g) => <line key={g} x1="0" x2="400" y1={height * g} y2={height * g} stroke="var(--color-border)" strokeDasharray="2 4" />)}
      {series.map((s, i) => {
        const path = s.map((y, j) => (j === 0 ? `M${j * 10},${y}` : `L${j * 10},${y}`)).join(" ");
        return <path key={i} d={path} fill="none" stroke={colors[i % colors.length]} strokeWidth="1.6" />;
      })}
    </svg>
  );
}

export function Avatar({ name, color = "var(--color-primary)" }: { name: string; color?: string }) {
  const initials = name.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();
  return <div className="w-7 h-7 rounded-full grid place-items-center text-[10px] font-semibold text-primary-foreground" style={{ background: color }}>{initials}</div>;
}

export function Terminal({ lines }: { lines: { t: string; tone?: "muted" | "info" | "warning" | "destructive" | "success" }[] }) {
  const map: Record<string, string> = { muted: "text-muted-foreground", info: "text-info", warning: "text-warning", destructive: "text-destructive", success: "text-success" };
  return (
    <div className="rounded-md bg-black/60 border border-border p-3 font-mono text-[11px] leading-relaxed">
      {lines.map((l, i) => <div key={i} className={map[l.tone || "muted"]}><span className="text-muted-foreground mr-2">›</span>{l.t}</div>)}
    </div>
  );
}
