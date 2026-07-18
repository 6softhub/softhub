import { useRef, useState } from "react";
import {
  Play, Star, Heart, Scale, Eye, ShoppingBag, Sparkles,
  TrendingUp, Wifi, WifiOff, Cloud, Award, Zap, Package,
} from "lucide-react";
import { PremiumThumbnail } from "./PremiumThumbnail";
import { ProductPreviewModal } from "./ProductPreviewModal";
import type { CatalogBadge, CatalogCategory, CatalogProduct } from "@/data/marketplace-catalog";
import { useCart } from "@/hooks/use-cart";


function ratingFrom(slug: string) {
  let h = 5381;
  for (let i = 0; i < slug.length; i++) h = ((h << 5) + h + slug.charCodeAt(i)) >>> 0;
  return 4.3 + (h % 70) / 100;
}
function downloadsFrom(slug: string) {
  let h = 2166136261;
  for (let i = 0; i < slug.length; i++) { h ^= slug.charCodeAt(i); h = Math.imul(h, 16777619); }
  const n = (h % 480) + 4;
  return n >= 100 ? `${(n / 10).toFixed(1)}k` : `${n * 10}`;
}

function BadgePill({ b }: { b: CatalogBadge }) {
  const map: Record<CatalogBadge, { cls: string; icon?: React.ComponentType<React.SVGProps<SVGSVGElement>> }> = {
    "NEW":         { cls: "bg-primary text-primary-foreground",                       icon: Sparkles },
    "TRENDING":    { cls: "bg-magenta text-white",                                    icon: TrendingUp },
    "BEST SELLER": { cls: "bg-[image:var(--gradient-gold)] text-[#1a1200]",           icon: Award },
    "AI READY":    { cls: "bg-[oklch(0.65_0.22_305)] text-white",                     icon: Zap },
    "OFFLINE":     { cls: "bg-panel-elevated text-foreground border border-border",   icon: WifiOff },
    "SAAS":        { cls: "bg-panel-elevated text-primary border border-primary/40",  icon: Cloud },
    "TOP RATED":   { cls: "bg-gold/20 text-gold border border-gold/40",               icon: Star },
    "DEAL":        { cls: "bg-success text-[#062014]",                                icon: Zap },
    "PRO":         { cls: "bg-[oklch(0.30_0.05_270)] text-foreground border border-border", icon: Package },
  };
  const cfg = map[b];
  const I = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${cfg.cls}`}>
      {I && <I className="h-2.5 w-2.5" />} {b}
    </span>
  );
}

type Props = { p: CatalogProduct; cat: CatalogCategory };

export function PremiumProductCard({ p, cat }: Props) {
  const { add, remove, has } = useCart();
  const id = `p:${cat.slug}:${p.slug}`;
  const inCart = has(id);
  const toggle = () =>
    inCart ? remove(id)
           : add({ id, name: p.name, industry: cat.title, price: p.price, period: p.period });

  const [liked, setLiked] = useState(false);
  const [compared, setCompared] = useState(false);
  const [preview, setPreview] = useState(false);
  const heartRef = useRef<HTMLButtonElement>(null);
  const [burstKey, setBurstKey] = useState(0);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked((v) => !v);
    if (!liked) setBurstKey((k) => k + 1);
  };

  const rating = ratingFrom(p.slug);
  const downloads = downloadsFrom(p.slug);

  const particles = Array.from({ length: 8 }).map((_, i) => {
    const angle = (i / 8) * Math.PI * 2;
    const dist = 22 + (i % 3) * 4;
    return {
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      color: i % 3 === 0 ? "oklch(0.72 0.24 15)" : i % 3 === 1 ? "oklch(0.82 0.16 200)" : "oklch(0.85 0.18 90)",
      delay: i * 0.015,
    };
  });

  return (
    <>
    <article className="group relative shrink-0 w-[300px] rounded-[20px] overflow-hidden border border-primary/25 bg-panel-elevated shadow-[0_0_0_1px_oklch(1_0_0_/_0.05)_inset,0_1px_0_oklch(1_0_0_/_0.10)_inset,0_14px_36px_oklch(0_0_0_/_0.42)] hover:-translate-y-2 hover:border-primary/60 hover:shadow-[0_0_0_1px_oklch(1_0_0_/_0.08)_inset,0_1px_0_oklch(1_0_0_/_0.14)_inset,var(--shadow-card-hover)] transition-all flex flex-col">
      <div
        role="button"
        tabIndex={0}
        onClick={() => setPreview(true)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setPreview(true); } }}
        aria-label={`Preview ${p.name}`}
        className="relative aspect-[5/3] overflow-hidden text-left cursor-pointer"
      >
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
        <div className="absolute top-2 left-2 right-2 flex items-start justify-between gap-2 pointer-events-none">
          <div className="flex flex-wrap gap-1 max-w-[70%]">
            {p.badges.slice(0, 2).map((b) => <BadgePill key={b} b={b} />)}
          </div>
          <div className="flex gap-1 pointer-events-auto">
            <button
              ref={heartRef}
              onClick={handleLike}
              aria-label="Wishlist"
              className={`relative h-7 w-7 grid place-items-center rounded-md backdrop-blur border transition-all btn-3d ${liked ? "bg-magenta text-white border-magenta" : "bg-black/40 text-white/90 border-white/15"}`}
            >
              <Heart key={burstKey} className={`h-3.5 w-3.5 ${liked ? "fill-white animate-heart-pop" : ""}`} />
              {liked && (
                <span key={`burst-${burstKey}`} className="absolute inset-0 pointer-events-none" aria-hidden>
                  {particles.map((pt, i) => (
                    <span
                      key={i}
                      className="particle"
                      style={{
                        background: pt.color,
                        ["--px" as string]: `${pt.x}px`,
                        ["--py" as string]: `${pt.y}px`,
                        animationDelay: `${pt.delay}s`,
                      } as React.CSSProperties}
                    />
                  ))}
                </span>
              )}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setCompared((v) => !v); }}
              aria-label="Compare"
              className={`h-7 w-7 grid place-items-center rounded-md backdrop-blur border btn-3d ${compared ? "bg-primary text-primary-foreground border-primary" : "bg-black/40 text-white/90 border-white/15"}`}
            >
              <Scale className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-md bg-black/50 backdrop-blur px-2 py-0.5 text-[10px] font-semibold text-white pointer-events-none">
          <Star className="h-3 w-3 fill-gold text-gold" /> {rating.toFixed(1)}
          <span className="text-white/50">·</span>
          <span className="text-white/80">{downloads}</span>
        </div>
        <div className="absolute inset-0 grid place-items-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1">
            <Eye className="h-3 w-3" /> Quick View
          </span>
        </div>
      </div>

      <div className="p-3.5 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2 min-w-0">
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold truncate">{p.name}</h3>
            <div className="text-[10px] uppercase tracking-[0.14em] text-primary/80 truncate">
              {cat.title}
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-mono text-sm font-bold text-primary">{p.price}</div>
            {p.period && <div className="text-[10px] text-muted-foreground">{p.period}</div>}
          </div>
        </div>

        <p className="text-[11.5px] text-muted-foreground line-clamp-2 leading-snug">
          {p.description}
        </p>

        <div className="mt-0.5 flex items-center justify-between text-[10px] text-muted-foreground font-mono">
          <span className="inline-flex items-center gap-1">
            <Wifi className="h-3 w-3 text-primary/60" /> {p.version}
          </span>
          <span>Updated {p.updated}</span>
        </div>

        {p.badges.length > 2 && (
          <div className="flex flex-wrap gap-1">
            {p.badges.slice(2).map((b) => <BadgePill key={b} b={b} />)}
          </div>
        )}

        <div className="mt-1 grid grid-cols-3 gap-1.5">
          <button onClick={() => setPreview(true)} className="btn-3d h-9 rounded-lg border border-border bg-panel-elevated text-[11px] font-semibold flex items-center justify-center gap-1">
            <Play className="h-3 w-3 text-primary" /> Demo
          </button>
          <button onClick={() => setPreview(true)} className="btn-3d h-9 rounded-lg border border-border bg-panel-elevated text-[11px] font-semibold flex items-center justify-center gap-1">
            <Eye className="h-3 w-3" /> Details
          </button>
          <button
            onClick={toggle}
            className={`btn-3d h-9 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 ${inCart ? "bg-success text-[#062014]" : "bg-[image:var(--gradient-primary)] text-primary-foreground"}`}
          >
            <ShoppingBag className="h-3 w-3" /> {inCart ? "Added" : "Buy"}
          </button>
        </div>
      </div>
    </article>
    <ProductPreviewModal open={preview} onClose={() => setPreview(false)} p={p} cat={cat} />
    </>
  );
}