import { useEffect } from "react";
import {
  X, Play, Eye, ShoppingBag, Star, Download, Cpu, Wifi, Code2,
  BookOpen, MessageSquare, CheckCircle2, FileText, Award,
} from "lucide-react";
import { PremiumThumbnail } from "./PremiumThumbnail";
import type { CatalogCategory, CatalogProduct } from "@/data/marketplace-catalog";
import { useCart } from "@/hooks/use-cart";

type Props = {
  open: boolean;
  onClose: () => void;
  p: CatalogProduct;
  cat: CatalogCategory;
};

function hashN(s: string, mod: number) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0) % mod;
}

const FEATURES = [
  "Role-based multi-user access",
  "Real-time dashboard & analytics",
  "Automated invoicing & GST/VAT",
  "Cloud sync + offline mode",
  "REST API & webhooks",
  "SMS / WhatsApp / Email alerts",
  "Custom reports & data export",
  "Regular free updates",
];

const REQUIREMENTS = [
  "Modern browser (Chrome, Edge, Safari, Firefox)",
  "Windows 10+, macOS 12+, Linux, Android 8+, iOS 14+",
  "2 GB RAM · 500 MB storage",
  "Stable internet for cloud sync (offline supported)",
];

const CHANGELOG = [
  { v: "v", tag: "Latest", note: "Performance upgrade, refreshed dashboard, bug fixes." },
  { v: "v", tag: "Prior",  note: "New reports module, GST 2.0 support, security patches." },
  { v: "v", tag: "Earlier", note: "Mobile app parity, offline sync improvements." },
];

export function ProductPreviewModal({ open, onClose, p, cat }: Props) {
  const { add, remove, has } = useCart();
  const id = `p:${cat.slug}:${p.slug}`;
  const inCart = has(id);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const rating = 4.3 + hashN(p.slug, 70) / 100;
  const reviews = 120 + hashN(p.slug + "r", 3400);
  const downloads = 400 + hashN(p.slug + "d", 48000);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm p-4 lg:p-8 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative mx-auto max-w-6xl rounded-2xl border border-primary/25 bg-panel shadow-[0_20px_80px_oklch(0_0_0_/_0.6)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 h-9 w-9 grid place-items-center rounded-lg bg-black/50 hover:bg-black/70 border border-white/15 text-white"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Hero row: gallery + summary */}
        <div className="grid lg:grid-cols-[1.35fr_1fr] gap-0">
          <div className="relative aspect-[16/10] bg-black">
            <PremiumThumbnail
              name={p.name}
              description={p.description}
              slug={p.slug}
              palette={cat.palette}
              motif={cat.motif}
              categoryLabel={cat.title}
              iconName={cat.icon}
              className="absolute inset-0 h-full w-full"
            />
            <div className="absolute bottom-3 left-3 right-3 grid grid-cols-4 gap-2">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="aspect-video rounded-md border border-white/20 bg-white/8 backdrop-blur-sm hover:border-primary/60 cursor-pointer"
                  style={{ background: `linear-gradient(${120 + i * 40}deg, ${cat.palette[0]}, ${cat.palette[1]})`, opacity: 0.7 }}
                />
              ))}
            </div>
          </div>

          <div className="p-6 lg:p-7 flex flex-col gap-4 border-l border-border">
            <div>
              <div className="text-[10px] uppercase tracking-[0.24em] text-primary/80 font-bold">
                {cat.title}
              </div>
              <h2 className="mt-1 font-display text-2xl lg:text-[28px] font-bold tracking-tight">
                {p.name}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {p.description}
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-1 font-semibold">
                <Star className="h-3.5 w-3.5 fill-gold text-gold" /> {rating.toFixed(1)}
                <span className="text-muted-foreground font-normal">({reviews.toLocaleString()} reviews)</span>
              </span>
              <span className="inline-flex items-center gap-1 text-muted-foreground">
                <Download className="h-3.5 w-3.5" /> {downloads.toLocaleString()} downloads
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="rounded-lg border border-border bg-panel-elevated p-2.5">
                <div className="text-muted-foreground uppercase tracking-wider text-[9px]">Version</div>
                <div className="mt-0.5 font-mono font-semibold flex items-center gap-1">
                  <Wifi className="h-3 w-3 text-primary" /> {p.version}
                </div>
              </div>
              <div className="rounded-lg border border-border bg-panel-elevated p-2.5">
                <div className="text-muted-foreground uppercase tracking-wider text-[9px]">Updated</div>
                <div className="mt-0.5 font-mono font-semibold">{p.updated}</div>
              </div>
            </div>

            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-primary font-mono">{p.price}</span>
              {p.period && <span className="text-xs text-muted-foreground">{p.period}</span>}
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button className="h-10 rounded-lg border border-border bg-panel-elevated text-xs font-semibold flex items-center justify-center gap-1 hover:border-primary/60">
                <Play className="h-3.5 w-3.5 text-primary" /> Demo
              </button>
              <button className="h-10 rounded-lg border border-border bg-panel-elevated text-xs font-semibold flex items-center justify-center gap-1 hover:border-primary/60">
                <Eye className="h-3.5 w-3.5" /> Preview
              </button>
              <button
                onClick={() => (inCart ? remove(id) : add({ id, name: p.name, industry: cat.title, price: p.price, period: p.period }))}
                className={`h-10 rounded-lg text-xs font-bold flex items-center justify-center gap-1 ${inCart ? "bg-success text-[#062014]" : "bg-[image:var(--gradient-primary)] text-primary-foreground hover:opacity-90"}`}
              >
                <ShoppingBag className="h-3.5 w-3.5" /> {inCart ? "Added" : "Buy Now"}
              </button>
            </div>
          </div>
        </div>

        {/* Details grid */}
        <div className="grid lg:grid-cols-3 gap-0 border-t border-border">
          <Section icon={CheckCircle2} title="Features">
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" /> {f}
                </li>
              ))}
            </ul>
          </Section>

          <Section icon={Cpu} title="System requirements">
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              {REQUIREMENTS.map((r) => (
                <li key={r} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 rounded-full bg-primary shrink-0" /> {r}
                </li>
              ))}
            </ul>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {["React", "Node.js", "PostgreSQL", "Cloud", "REST API"].map((t) => (
                <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded-md border border-border bg-panel-elevated text-muted-foreground">
                  <Code2 className="inline h-3 w-3 mr-1 text-primary/70" />{t}
                </span>
              ))}
            </div>
          </Section>

          <Section icon={FileText} title="Changelog">
            <ul className="space-y-2 text-xs">
              {CHANGELOG.map((c, i) => (
                <li key={i} className="rounded-md border border-border bg-panel-elevated p-2">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-wider">
                    <span className="text-primary font-bold">{c.v}{p.version}{i === 0 ? "" : `-${i}`}</span>
                    <span className="text-muted-foreground">{c.tag}</span>
                  </div>
                  <div className="mt-1 text-muted-foreground">{c.note}</div>
                </li>
              ))}
            </ul>
          </Section>

          <Section icon={BookOpen} title="Documentation">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Full onboarding guides, API reference, and video tutorials are included.
              White-glove setup available for Enterprise plans.
            </p>
            <button className="mt-3 h-8 px-3 rounded-md border border-border bg-panel-elevated text-[11px] font-semibold hover:border-primary/60">
              Open docs
            </button>
          </Section>

          <Section icon={MessageSquare} title="Reviews & Rating">
            <div className="flex items-center gap-3">
              <div className="text-3xl font-bold text-primary font-mono">{rating.toFixed(1)}</div>
              <div className="text-[11px] text-muted-foreground">
                Based on {reviews.toLocaleString()} verified reviews.
              </div>
            </div>
            <div className="mt-3 space-y-1">
              {[5, 4, 3, 2, 1].map((n) => (
                <div key={n} className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <span className="w-3">{n}</span>
                  <Star className="h-2.5 w-2.5 fill-gold text-gold" />
                  <div className="h-1.5 flex-1 rounded-full bg-panel-elevated overflow-hidden">
                    <div className="h-full bg-primary/70" style={{ width: `${[70, 20, 6, 3, 1][5 - n]}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section icon={Award} title="FAQ">
            <div className="space-y-2 text-xs">
              {[
                ["Is a free trial available?", "Yes — 14 days, no card required."],
                ["Do you offer support?", "24×7 support with dedicated account manager on Pro."],
                ["Can I cancel anytime?", "Yes, cancel or downgrade from the billing dashboard."],
              ].map(([q, a]) => (
                <details key={q} className="rounded-md border border-border bg-panel-elevated p-2 group">
                  <summary className="cursor-pointer text-xs font-semibold list-none flex items-center justify-between">
                    {q} <span className="text-primary group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="mt-1 text-muted-foreground text-[11px]">{a}</p>
                </details>
              ))}
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({
  icon: Icon, title, children,
}: { icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; title: string; children: React.ReactNode }) {
  return (
    <div className="p-5 lg:p-6 border-b border-border lg:border-b lg:[&:nth-child(3n)]:border-r-0 lg:border-r">
      <div className="mb-3 flex items-center gap-2">
        <div className="h-7 w-7 grid place-items-center rounded-md bg-primary/15 border border-primary/25">
          <Icon className="h-3.5 w-3.5 text-primary" />
        </div>
        <h4 className="text-sm font-bold tracking-tight">{title}</h4>
      </div>
      {children}
    </div>
  );
}
