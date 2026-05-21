import { useEffect, useState, type ReactNode } from "react";
import * as Icons from "lucide-react";
import { createPortal } from "react-dom";

/* ============================================================
   UNIVERSAL ENTERPRISE COMPONENTS
   Single source of truth for layout chrome shared by every
   dashboard. Built on the design tokens in src/styles.css.
   ============================================================ */

export type Tone = "primary" | "accent" | "success" | "warning" | "destructive" | "info" | "muted";

const toneText: Record<Tone, string> = {
  primary: "text-primary", accent: "text-accent", success: "text-success",
  warning: "text-warning", destructive: "text-destructive", info: "text-info", muted: "text-muted-foreground",
};

const toneBg: Record<Tone, string> = {
  primary: "bg-primary", accent: "bg-accent", success: "bg-success",
  warning: "bg-warning", destructive: "bg-destructive", info: "bg-info", muted: "bg-muted-foreground",
};

/* ---------- ChartCard: titled glass panel with optional toolbar ---------- */
export function ChartCard({
  title, subtitle, toolbar, children, className = "", span,
}: {
  title?: ReactNode; subtitle?: ReactNode; toolbar?: ReactNode;
  children: ReactNode; className?: string; span?: number;
}) {
  const colSpan = span ? `col-span-12 lg:col-span-${span}` : "col-span-12";
  return (
    <section className={`glass rounded-xl p-4 card-hover animate-fade-up ${colSpan} ${className}`}>
      {(title || toolbar) && (
        <header className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            {title && <h2 className="text-sm font-semibold tracking-tight truncate">{title}</h2>}
            {subtitle && <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{subtitle}</p>}
          </div>
          {toolbar && <div className="flex items-center gap-1.5 shrink-0">{toolbar}</div>}
        </header>
      )}
      {children}
    </section>
  );
}

/* ---------- RangeSelector ---------- */
export type Range = "1h" | "24h" | "7d" | "30d" | "90d";
export function RangeSelector({
  value, onChange, options = ["1h", "24h", "7d", "30d"],
}: { value: Range; onChange: (r: Range) => void; options?: Range[] }) {
  return (
    <div role="tablist" aria-label="Time range" className="flex gap-0.5 p-0.5 rounded-md bg-muted border border-border text-[11px]">
      {options.map((s) => (
        <button
          key={s}
          role="tab"
          aria-selected={value === s}
          onClick={() => onChange(s)}
          className={`px-2 py-1 rounded transition-colors focus-ring ${
            value === s ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"
          }`}
        >{s}</button>
      ))}
    </div>
  );
}

/* ---------- LiveToggle ---------- */
export function LiveToggle({ live, onToggle }: { live: boolean; onToggle: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onToggle(!live)}
      aria-pressed={live}
      className={`px-2.5 py-1 rounded-md text-[11px] font-medium inline-flex items-center gap-1.5 border transition-colors focus-ring ${
        live ? "bg-success/15 text-success border-success/30" : "bg-muted text-muted-foreground border-border hover:text-foreground"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${live ? "bg-success animate-pulse" : "bg-muted-foreground"}`} />
      {live ? "Live" : "Paused"}
    </button>
  );
}

/* ---------- FilterBar: input + optional actions ---------- */
export function FilterBar({
  value, onChange, placeholder = "Filter…", actions,
}: { value: string; onChange: (v: string) => void; placeholder?: string; actions?: ReactNode }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="relative flex-1 min-w-[180px]">
        <Icons.Search className="absolute left-2 top-2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-muted text-xs rounded-md pl-7 pr-7 py-1.5 border border-border outline-none focus:border-primary focus-ring"
        />
        {value && (
          <button onClick={() => onChange("")} aria-label="Clear" className="absolute right-1.5 top-1.5 w-5 h-5 grid place-items-center rounded text-muted-foreground hover:text-foreground hover:bg-muted/60">
            <Icons.X className="w-3 h-3" />
          </button>
        )}
      </div>
      {actions}
    </div>
  );
}

/* ---------- QuickActions: pill row of buttons ---------- */
export function QuickActions({
  items,
}: { items: { label: string; icon?: keyof typeof Icons; tone?: Tone; onClick?: () => void }[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((it, i) => {
        const Icon = (it.icon ? (Icons as never as Record<string, Icons.LucideIcon>)[it.icon] : Icons.Zap) || Icons.Zap;
        const tone = it.tone || "primary";
        return (
          <button
            key={i}
            onClick={it.onClick}
            className={`px-3 py-1.5 rounded-md text-xs font-medium inline-flex items-center gap-1.5 border focus-ring transition-colors bg-${tone}/10 ${toneText[tone]} border-${tone}/30 hover:bg-${tone}/20`}
          >
            <Icon className="w-3.5 h-3.5" />
            {it.label}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- AIInsights ---------- */
export function AIInsights({
  items,
}: { items: { title: string; body: string; tone?: Tone; confidence?: number }[] }) {
  return (
    <ChartCard
      title={<span className="inline-flex items-center gap-2"><Icons.Sparkles className="w-4 h-4 text-accent" /> AI Insights</span>}
      subtitle="Generated from current signals"
    >
      <ul className="space-y-2.5">
        {items.map((it, i) => {
          const tone = it.tone || "info";
          return (
            <li key={i} className="rounded-md border border-border bg-card/50 p-3 hover:border-primary/40 transition-colors">
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${toneBg[tone]}`} />
                <span className="text-xs font-medium">{it.title}</span>
                {typeof it.confidence === "number" && (
                  <span className="ml-auto text-[10px] text-muted-foreground tabular-nums">
                    conf {it.confidence}%
                  </span>
                )}
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">{it.body}</p>
            </li>
          );
        })}
      </ul>
    </ChartCard>
  );
}

/* ---------- EmptyState ---------- */
export function EmptyState({
  icon = "Inbox", title, hint, action,
}: { icon?: keyof typeof Icons; title: string; hint?: string; action?: ReactNode }) {
  const Icon = (Icons as never as Record<string, Icons.LucideIcon>)[icon] || Icons.Inbox;
  return (
    <div className="text-center py-10 px-4">
      <Icon className="w-8 h-8 mx-auto text-muted-foreground/70 mb-3" />
      <div className="text-sm font-medium">{title}</div>
      {hint && <div className="text-xs text-muted-foreground mt-1">{hint}</div>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/* ---------- Modal: portal-based, escape + backdrop close ---------- */
export function Modal({
  open, onClose, title, children, footer, size = "md",
}: { open: boolean; onClose: () => void; title?: ReactNode; children: ReactNode; footer?: ReactNode; size?: "sm" | "md" | "lg" | "xl" }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  const widths = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" };

  return createPortal(
    <div className="fixed inset-0 z-50 grid place-items-center p-4 animate-fade-up">
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${widths[size]} glass rounded-xl shadow-2xl border border-border`}>
        <header className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-sm font-semibold">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="w-7 h-7 grid place-items-center rounded hover:bg-muted">
            <Icons.X className="w-4 h-4" />
          </button>
        </header>
        <div className="p-4 max-h-[70vh] overflow-y-auto">{children}</div>
        {footer && <footer className="p-3 border-t border-border flex items-center justify-end gap-2">{footer}</footer>}
      </div>
    </div>,
    document.body,
  );
}

/* ---------- DashboardToolbar: bundled range + live + actions ---------- */
export function DashboardToolbar({
  range, onRangeChange, live, onLiveToggle, extra,
}: {
  range: Range; onRangeChange: (r: Range) => void;
  live: boolean; onLiveToggle: (v: boolean) => void;
  extra?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <RangeSelector value={range} onChange={onRangeChange} />
      <LiveToggle live={live} onToggle={onLiveToggle} />
      {extra}
    </div>
  );
}

/* ---------- useToggle helper ---------- */
export function useDashboardState(defaultRange: Range = "24h") {
  const [range, setRange] = useState<Range>(defaultRange);
  const [filter, setFilter] = useState("");
  const [live, setLive] = useState(true);
  return { range, setRange, filter, setFilter, live, setLive };
}
