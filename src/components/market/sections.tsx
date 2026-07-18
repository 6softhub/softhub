import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  ArrowRight, Play, Star, Download, Users, Sparkles, Crown, Handshake,
  ShoppingBag, Network, PenTool, ShieldCheck, Zap, TrendingUp, KeyRound,
  Heart, Stethoscope, ShoppingCart, Factory, HardHat, Hotel,
  Truck, Banknote, HeartHandshake, Home as HomeIcon, Scale, Landmark,
  Cpu, BrainCircuit, BarChart3, Workflow, Headset, Briefcase, Award, Globe2,
  Eye, Plus, Check, ChevronRight, ChevronLeft, ArrowUpRight, GraduationCap,
} from "lucide-react";
import { useCart } from "@/hooks/use-cart";

import { getMarketplace, type MarketProduct, type MarketIndustry, type MarketVendor } from "@/lib/marketplace.functions";
import { resolveIcon } from "@/lib/marketplace-icons";
import { PremiumThumbnail } from "./PremiumThumbnail";
import type { MotifKey } from "@/data/marketplace-catalog";
import heroErp from "@/assets/hero-erp.jpg";
import indEducation from "@/assets/ind-education.jpg";
import indHealthcare from "@/assets/ind-healthcare.jpg";
import indRetail from "@/assets/ind-retail.jpg";
import indManufacturing from "@/assets/ind-manufacturing.jpg";
import indConstruction from "@/assets/ind-construction.jpg";
import indHotel from "@/assets/ind-hotel.jpg";
import indTransport from "@/assets/ind-transport.jpg";
import indFinance from "@/assets/ind-finance.jpg";
import indNgo from "@/assets/ind-ngo.jpg";
import indRealestate from "@/assets/ind-realestate.jpg";
import indLegal from "@/assets/ind-legal.jpg";
import indGovernment from "@/assets/ind-government.jpg";
type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

const cyan = "var(--color-primary)";
const purple = "var(--color-magenta)";
const gold = "var(--color-gold)";

/* ============ HERO BANNER — auto-rotating ============ */

const banners = [
  { tag: "Enterprise ERP", title: "One ERP. Every workflow.", sub: "Run finance, inventory, manufacturing and HR from a single command surface — built for scale.", cta: "Explore VALA ERP", color: cyan },
  { tag: "Sales CRM", title: "Pipeline that closes itself.", sub: "AI-prioritized leads, multi-channel outreach, revenue intelligence — out of the box.", cta: "Try VALA CRM", color: purple },
  { tag: "HRMS Suite", title: "Hire, pay & grow your people.", sub: "Recruitment to payroll in one platform, 125 languages, compliant in 64 countries.", cta: "See HRMS", color: cyan },
  { tag: "School ERP", title: "From admissions to alumni.", sub: "End-to-end campus operations with parent app, fees and live attendance.", cta: "Tour School ERP", color: gold },
  { tag: "Hospital ERP", title: "Care that runs on time.", sub: "EMR, OPD, IPD, pharmacy, labs and insurance — clinically certified workflow engine.", cta: "View Hospital", color: purple },
  { tag: "Retail POS", title: "One screen, every counter.", sub: "Lightning-fast POS, omnichannel inventory, loyalty and analytics for any retail brand.", cta: "Open Retail POS", color: cyan },
  { tag: "AI Products", title: "AI that ships revenue.", sub: "Forecasting, automation, customer intelligence — production-ready models, day one.", cta: "Browse AI Zone", color: purple },
  { tag: "Marketplace", title: "1,284 products. One marketplace.", sub: "Discover, license and deploy enterprise software — vetted by Vala. Backed by SLA.", cta: "Open Marketplace", color: gold },
];

export function HeroBanner() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % banners.length), 5500);
    return () => clearInterval(t);
  }, []);
  const b = banners[i];
  const isGold = b.color === gold;
  const isPurple = b.color === purple;

  return (
    <section className="relative h-[480px] lg:h-[520px] rounded-[22px] overflow-hidden border border-border"
             style={{ backgroundImage: "var(--gradient-hero), var(--gradient-panel)" }}>
      {/* hero product render — full bleed on the right */}
      <div className="absolute inset-y-0 right-0 w-full lg:w-[58%] pointer-events-none">
        <img
          src={heroErp}
          alt=""
          className="h-full w-full object-cover object-center opacity-90"
          width={1280}
          height={896}
        />
        {/* fade left into panel */}
        <div className="absolute inset-0"
             style={{ background: "linear-gradient(90deg, var(--color-background) 0%, transparent 45%, transparent 70%, oklch(0.10 0.04 270 / 0.4) 100%)" }} />
        {/* color wash per slide */}
        <div key={`wash-${i}`} className="absolute inset-0 mix-blend-color opacity-50 animate-rise"
             style={{ background: isGold ? "var(--gradient-gold)" : isPurple ? "linear-gradient(135deg, var(--color-magenta), var(--color-primary))" : "var(--gradient-primary)" }} />
      </div>

      <div className="relative h-full grid lg:grid-cols-2 gap-6 p-8 lg:p-12">
        {/* left */}
        <div className="flex flex-col justify-center max-w-xl z-10">
          <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-primary mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-blink" />
            {b.tag} · Featured
          </span>
          <h1 key={i} className="animate-rise font-display text-4xl lg:text-7xl font-bold tracking-tight leading-[1.02]">
            {b.title.split(".").map((part, idx, arr) => (
              <span key={idx}>
                {idx === arr.length - 2 ? (
                  <span style={{ background: "var(--gradient-primary)", WebkitBackgroundClip: "text", color: "transparent" }}>{part}</span>
                ) : part}
                {idx < arr.length - 1 && "."}
              </span>
            ))}
          </h1>
          <p className="mt-4 text-[15px] lg:text-base text-muted-foreground max-w-md">{b.sub}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button className="h-12 px-5 rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground font-semibold text-sm flex items-center gap-2 glow-primary hover:opacity-90">
              {b.cta} <ArrowRight className="h-4 w-4" />
            </button>
            <button className="h-12 px-5 rounded-xl border border-border bg-panel/60 backdrop-blur hover:border-primary/60 text-sm font-medium flex items-center gap-2">
              <Play className="h-4 w-4 text-primary" /> Watch demo · 2:14
            </button>
          </div>
          <div className="mt-6 flex items-center gap-4 text-mono text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-success" /> SOC 2 · ISO 27001</span>
            <span className="hidden sm:flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-gold fill-gold" /> 4.9 · 12,840 reviews</span>
          </div>
        </div>

        {/* floating chips over the render */}
        <div className="relative hidden lg:block">
          <div className="absolute right-8 top-6 px-3 py-2 rounded-xl bg-panel-elevated/90 backdrop-blur border border-primary/40 text-xs flex items-center gap-2 glow-primary">
            <TrendingUp className="h-4 w-4 text-success" /> <span className="text-mono">+18.4%</span> revenue this week
          </div>
          <div className="absolute right-10 bottom-20 px-3 py-2 rounded-xl bg-panel-elevated/90 backdrop-blur border border-gold/40 text-xs flex items-center gap-2">
            <Star className="h-4 w-4 text-gold fill-gold" /> Top Rated · 4.9
          </div>
          <div className="absolute right-4 bottom-4 px-3 py-2 rounded-xl bg-panel-elevated/90 backdrop-blur border border-magenta/40 text-xs flex items-center gap-2">
            <Users className="h-4 w-4 text-magenta" /> <span className="text-mono">184k</span> active customers
          </div>
        </div>
      </div>

      {/* indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
        {banners.map((_, k) => (
          <button key={k} onClick={() => setI(k)}
                  className={`h-1 rounded-full transition-all ${k === i ? "w-8 bg-primary" : "w-2 bg-border hover:bg-muted-foreground"}`} />
        ))}
      </div>
    </section>
  );
}

/* ============ SECTION 02 — QUICK ACTION CARDS ============ */

const quick = [
  { title: "Become a Reseller", sub: "Earn up to 40% commission · global territories", icon: Handshake, tone: "primary" as const, cta: "Apply now" },
  { title: "Become a Vendor", sub: "List your software · reach 184k customers", icon: ShoppingBag, tone: "magenta" as const, cta: "Start selling" },
  { title: "Become a Franchise", sub: "Own a territory · co-branded operations", icon: Network, tone: "gold" as const, cta: "Get details" },
  { title: "Become an Author", sub: "Publish modules · earn lifetime royalties", icon: PenTool, tone: "primary" as const, cta: "Join" },
];

export function QuickActions() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {quick.map((q) => {
        const I = q.icon;
        const accent =
          q.tone === "gold" ? "from-gold/30 via-gold/10 border-gold/40 text-gold" :
          q.tone === "magenta" ? "from-magenta/30 via-magenta/10 border-magenta/40 text-magenta" :
          "from-primary/30 via-primary/10 border-primary/40 text-primary";
        return (
          <button key={q.title}
                  className={`group h-[160px] rounded-[18px] border ${accent.split(" ").pop()} bg-gradient-to-br ${accent.split(" ").slice(0, 3).join(" ")} to-transparent p-5 text-left relative overflow-hidden transition-all hover:-translate-y-2 hover:shadow-[var(--shadow-card-hover)]`}>
            <I className={`h-7 w-7 ${accent.split(" ").pop()}`} />
            <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-current opacity-10 blur-2xl" />
            <h3 className="mt-3 text-base font-bold text-foreground">{q.title}</h3>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{q.sub}</p>
            <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between text-xs font-semibold">
              <span className={accent.split(" ").pop()}>{q.cta}</span>
              <ArrowUpRight className={`h-4 w-4 ${accent.split(" ").pop()} group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform`} />
            </div>
          </button>
        );
      })}
    </section>
  );
}

/* ============ SECTION 03 — LIVE STATS ============ */

function useCounter(target: number, decimals = 0) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const dur = 1200;
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setV(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return v.toFixed(decimals);
}

function StatCard({ label, value, delta, icon: Icon, tone = "primary" }: any) {
  const accent =
    tone === "gold" ? "text-gold border-gold/30" :
    tone === "magenta" ? "text-magenta border-magenta/30" :
    tone === "success" ? "text-success border-success/30" :
    "text-primary border-primary/30";
  return (
    <div className={`panel p-5 border ${accent} relative overflow-hidden hover:-translate-y-1 transition-transform`}>
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-20 blur-2xl"
           style={{ background: "var(--gradient-primary)" }} />
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
        <Icon className={`h-4 w-4 ${accent.split(" ")[0]}`} />
      </div>
      <div className={`mt-2 text-mono text-2xl lg:text-3xl font-bold ${accent.split(" ")[0]}`}>{value}</div>
      {delta && <div className="mt-1 text-mono text-[11px] text-success">{delta}</div>}
    </div>
  );
}

export function LiveStats() {
  const products = useCounter(1284);
  const customers = useCounter(184902);
  const licenses = useCounter(92481);
  const renewals = useCounter(8421);
  const resellers = useCounter(1284);
  const vendors = useCounter(284);
  return (
    <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
      <StatCard label="Products" value={Number(products).toLocaleString()} delta="+12 today" icon={Sparkles} />
      <StatCard label="Customers" value={Number(customers).toLocaleString()} delta="+1,284 / 7d" icon={Users} tone="magenta" />
      <StatCard label="Licenses" value={Number(licenses).toLocaleString()} delta="+2,418 / 24h" icon={KeyRound} />
      <StatCard label="Renewals" value={Number(renewals).toLocaleString()} delta="+184 / 7d" icon={Zap} tone="success" />
      <StatCard label="Resellers" value={Number(resellers).toLocaleString()} delta="+18 / 7d" icon={Handshake} tone="gold" />
      <StatCard label="Vendors" value={Number(vendors).toLocaleString()} delta="+4 / 7d" icon={ShoppingBag} tone="magenta" />
    </section>
  );
}

/* ============ Card primitives ============ */

type Product = {
  name: string; industry: string; price: string; period?: string; slug?: string; iconName?: string;
  rating: number; downloads: string; tag?: "NEW" | "HOT" | "TOP" | "DEAL";
  icon: IconType;
};

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function productVisual(p: Product): { motif: MotifKey; palette: [string, string] } {
  const text = `${p.name} ${p.industry}`.toLowerCase();
  if (/school|education/.test(text)) return { motif: "school", palette: ["oklch(0.72 0.19 245)", "oklch(0.60 0.22 300)"] };
  if (/lms|learn|training|coaching|academy/.test(text)) return { motif: "lms", palette: ["oklch(0.68 0.23 305)", "oklch(0.55 0.22 340)"] };
  if (/hospital|health|clinic|medical|care/.test(text)) return { motif: "hospital", palette: ["oklch(0.78 0.16 170)", "oklch(0.65 0.18 200)"] };
  if (/pharma|pharmacy|lab|vet|optical/.test(text)) return { motif: "pharma", palette: ["oklch(0.75 0.18 30)", "oklch(0.65 0.20 350)"] };
  if (/retail|pos|store|sales|crm|support/.test(text)) return { motif: "retail", palette: ["oklch(0.82 0.17 85)", "oklch(0.68 0.22 45)"] };
  if (/restaurant|hotel|hospitality|food|concierge/.test(text)) return { motif: "restaurant", palette: ["oklch(0.80 0.14 55)", "oklch(0.70 0.17 30)"] };
  if (/finance|billing|bank|account|loan|wallet|trading/.test(text)) return { motif: "finance", palette: ["oklch(0.68 0.14 230)", "oklch(0.86 0.17 95)"] };
  if (/construction|build|site|civil/.test(text)) return { motif: "construction", palette: ["oklch(0.82 0.15 70)", "oklch(0.58 0.12 230)"] };
  if (/fleet|transport|logistics|track|travel/.test(text)) return { motif: "logistics", palette: ["oklch(0.72 0.17 220)", "oklch(0.78 0.16 80)"] };
  if (/realty|real estate|property/.test(text)) return { motif: "rental", palette: ["oklch(0.70 0.13 220)", "oklch(0.82 0.14 90)"] };
  if (/legal|matter|compliance/.test(text)) return { motif: "admin", palette: ["oklch(0.68 0.12 250)", "oklch(0.84 0.13 85)"] };
  if (/ngo|non-profit/.test(text)) return { motif: "agriculture", palette: ["oklch(0.76 0.15 145)", "oklch(0.84 0.13 85)"] };
  if (/gov|government/.test(text)) return { motif: "government", palette: ["oklch(0.74 0.13 220)", "oklch(0.80 0.14 85)"] };
  if (/iot|industry|inventory|manufacturing|erp|operations/.test(text)) return { motif: "manufacturing", palette: ["oklch(0.76 0.12 215)", "oklch(0.82 0.14 80)"] };
  if (/ai|forecast|copilot|automation|analytics|insights/.test(text)) return { motif: "ai", palette: ["oklch(0.76 0.17 250)", "oklch(0.70 0.22 305)"] };
  return { motif: "services", palette: ["oklch(0.76 0.13 220)", "oklch(0.70 0.18 300)"] };
}

/* ============ LIVE MARKETPLACE DATA HOOK ============ */
function useMarket() {
  const fn = useServerFn(getMarketplace);
  return useQuery({
    queryKey: ["marketplace"],
    queryFn: () => fn(),
    staleTime: 60_000,
  });
}
function toProduct(p: MarketProduct): Product {
  return {
    name: p.name,
    industry: p.industry_label ?? "",
    price: p.price_label,
    period: p.price_period ?? undefined,
    slug: p.slug,
    iconName: p.icon,
    rating: Number(p.rating),
    downloads: p.downloads_label ?? String(p.downloads),
    tag: (p.badge ?? undefined) as Product["tag"],
    icon: resolveIcon(p.icon) as IconType,
  };
}
function useLiveList(kind: "featured" | "trending" | "bestSellers" | "newReleases", fallback: Product[]) {
  const { data } = useMarket();
  return useMemo(() => {
    const live = data?.[kind];
    if (!live || live.length === 0) return fallback;
    return live.map(toProduct);
  }, [data, kind, fallback]);
}

const featured: Product[] = [
  { name: "VALA ERP Cloud", industry: "Manufacturing", price: "$249", period: "/mo", rating: 4.9, downloads: "48.2k", tag: "TOP", icon: Factory },
  { name: "VALA CRM Pro", industry: "Sales", price: "$89", period: "/mo", rating: 4.8, downloads: "92.4k", tag: "HOT", icon: BarChart3 },
  { name: "School ERP+", industry: "Education", price: "$1,299", period: "lifetime", rating: 4.9, downloads: "12.4k", tag: "DEAL", icon: GraduationCap },
  { name: "Hospital Suite", industry: "Healthcare", price: "$499", period: "/mo", rating: 4.7, downloads: "8.4k", icon: Stethoscope },
  { name: "Retail POS X", industry: "Retail", price: "$49", period: "/mo", rating: 4.8, downloads: "38.2k", tag: "HOT", icon: ShoppingCart },
  { name: "HRMS Enterprise", industry: "HR", price: "$129", period: "/mo", rating: 4.9, downloads: "24.8k", tag: "TOP", icon: Briefcase },
];

const trending: Product[] = [
  { name: "AI Forecast Lab", industry: "AI · Analytics", price: "$199", period: "/mo", rating: 4.9, downloads: "6.2k", tag: "NEW", icon: BrainCircuit },
  { name: "Inventory Sentinel", industry: "Operations", price: "$79", period: "/mo", rating: 4.7, downloads: "18.4k", tag: "HOT", icon: Workflow },
  { name: "BillingX Pro", industry: "Finance", price: "$59", period: "/mo", rating: 4.6, downloads: "22.1k", icon: Banknote },
  { name: "Construction OS", industry: "Construction", price: "$299", period: "/mo", rating: 4.8, downloads: "5.4k", tag: "NEW", icon: HardHat },
  { name: "FleetTrack Pro", industry: "Transport", price: "$149", period: "/mo", rating: 4.8, downloads: "9.8k", icon: Truck },
  { name: "Hotel Concierge", industry: "Hospitality", price: "$179", period: "/mo", rating: 4.7, downloads: "7.2k", icon: Hotel },
  { name: "Realty Vault", industry: "Real Estate", price: "$99", period: "/mo", rating: 4.6, downloads: "11.4k", icon: HomeIcon },
  { name: "Legal Matter", industry: "Legal", price: "$249", period: "/mo", rating: 4.8, downloads: "4.8k", tag: "NEW", icon: Scale },
];

const bestSelling: Product[] = [
  { name: "Vala CRM Pro", industry: "Sales", price: "$89", period: "/mo", rating: 4.8, downloads: "92.4k", tag: "TOP", icon: BarChart3 },
  { name: "Retail POS X", industry: "Retail", price: "$49", period: "/mo", rating: 4.8, downloads: "38.2k", icon: ShoppingCart },
  { name: "HRMS Enterprise", industry: "HR", price: "$129", period: "/mo", rating: 4.9, downloads: "24.8k", icon: Briefcase },
  { name: "Vala ERP Cloud", industry: "Manufacturing", price: "$249", period: "/mo", rating: 4.9, downloads: "48.2k", icon: Factory },
  { name: "Inventory Sentinel", industry: "Operations", price: "$79", period: "/mo", rating: 4.7, downloads: "18.4k", icon: Workflow },
  { name: "BillingX Pro", industry: "Finance", price: "$59", period: "/mo", rating: 4.6, downloads: "22.1k", icon: Banknote },
  { name: "AI Support Bot", industry: "Support", price: "$39", period: "/mo", rating: 4.7, downloads: "14.2k", icon: Headset },
  { name: "Realty Vault", industry: "Real Estate", price: "$99", period: "/mo", rating: 4.6, downloads: "11.4k", icon: HomeIcon },
];

const newReleases: Product[] = [
  { name: "Vala Copilot", industry: "AI · Productivity", price: "Free", rating: 4.9, downloads: "2.4k", tag: "NEW", icon: Sparkles },
  { name: "NGO Portal", industry: "Non-profit", price: "$29", period: "/mo", rating: 4.8, downloads: "1.2k", tag: "NEW", icon: HeartHandshake },
  { name: "Gov-Ops Suite", industry: "Government", price: "Contact", rating: 4.7, downloads: "0.4k", tag: "NEW", icon: Landmark },
  { name: "Edge IoT Hub", industry: "IoT · Industry", price: "$199", period: "/mo", rating: 4.8, downloads: "1.8k", tag: "NEW", icon: Cpu },
  { name: "Vendor Compliance", industry: "Compliance", price: "$89", period: "/mo", rating: 4.6, downloads: "0.9k", tag: "NEW", icon: ShieldCheck },
  { name: "Brand Insights AI", industry: "Marketing", price: "$149", period: "/mo", rating: 4.7, downloads: "1.4k", tag: "NEW", icon: TrendingUp },
];

function tagStyle(t?: Product["tag"]) {
  if (!t) return null;
  const map: Record<string, string> = {
    NEW: "bg-primary text-primary-foreground",
    HOT: "bg-magenta text-white",
    TOP: "bg-[image:var(--gradient-gold)] text-[#1a1200]",
    DEAL: "bg-success text-[#062014]",
  };
  return map[t];
}

function FeaturedCard({ p }: { p: Product; i: number }) {
  const { add, remove, has } = useCart();
  const id = `p:${p.name}`;
  const inCart = has(id);
  const toggle = () => (inCart ? remove(id) : add({ id, name: p.name, industry: p.industry, price: p.price, period: p.period }));
  const visual = productVisual(p);
  return (
    <article className="group shrink-0 w-[300px] sm:w-[320px] h-[260px] rounded-[18px] overflow-hidden border border-border bg-panel hover:-translate-y-2 hover:shadow-[var(--shadow-card-hover)] transition-all flex flex-col">
      <div className="relative h-[68%] overflow-hidden">
        <PremiumThumbnail
          name={p.name}
          description={p.industry}
          slug={p.slug ?? slugify(p.name)}
          palette={visual.palette}
          motif={visual.motif}
          categoryLabel={p.industry}
          iconName={p.iconName}
          className="absolute inset-0 h-full w-full"
        />
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          {p.tag && <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${tagStyle(p.tag)}`}>{p.tag}</span>}
          <span className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-md bg-black/40 backdrop-blur text-white flex items-center gap-1">
            <Star className="h-3 w-3 fill-gold text-gold" /> {p.rating}
          </span>
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors grid place-items-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <button className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1"><Play className="h-3 w-3" /> Demo</button>
            <button
              onClick={toggle}
              className={`h-8 px-3 rounded-md text-xs font-semibold flex items-center gap-1 ${inCart ? "bg-success text-[#062014]" : "bg-white/15 backdrop-blur border border-white/20 text-white"}`}
            >
              {inCart ? <><Check className="h-3 w-3" /> Added</> : <><Plus className="h-3 w-3" /> Buy</>}
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1 p-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold truncate">{p.name}</div>
          <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
            {p.industry} · <Download className="h-3 w-3" /> {p.downloads}
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-mono text-sm font-bold text-primary">{p.price}</div>
          {p.period && <div className="text-[10px] text-muted-foreground">{p.period}</div>}
        </div>
      </div>
    </article>
  );
}

function VerticalCard({ p }: { p: Product; i: number }) {
  const { add, remove, has } = useCart();
  const id = `p:${p.name}`;
  const inCart = has(id);
  const toggle = () => (inCart ? remove(id) : add({ id, name: p.name, industry: p.industry, price: p.price, period: p.period }));
  const visual = productVisual(p);
  return (
    <article className="group shrink-0 w-[260px] h-[360px] rounded-[18px] overflow-hidden border border-border bg-panel hover:-translate-y-2 hover:shadow-[var(--shadow-card-hover)] transition-all flex flex-col">
      <div className="relative h-[200px] overflow-hidden">
        <PremiumThumbnail
          name={p.name}
          description={p.industry}
          slug={p.slug ?? slugify(p.name)}
          palette={visual.palette}
          motif={visual.motif}
          categoryLabel={p.industry}
          iconName={p.iconName}
          className="absolute inset-0 h-full w-full"
        />
        {p.tag && <span className={`absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${tagStyle(p.tag)}`}>{p.tag}</span>}
      </div>
      <div className="flex-1 p-4 flex flex-col">
        <div className="text-sm font-semibold">{p.name}</div>
        <div className="text-[11px] text-muted-foreground">{p.industry}</div>
        <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-gold text-gold" /> {p.rating}</span>
          <span className="flex items-center gap-1"><Download className="h-3 w-3" /> {p.downloads}</span>
          <span className="flex items-center gap-1"><Users className="h-3 w-3" /> 184</span>
        </div>
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-border">
          <div>
            <div className="text-mono text-base font-bold text-primary">{p.price}</div>
            {p.period && <div className="text-[10px] text-muted-foreground">{p.period}</div>}
          </div>
          <button
            onClick={toggle}
            className={`h-9 px-3 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
              inCart ? "bg-success/15 border border-success/40 text-success" : "bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20"
            }`}
          >
            {inCart ? <><Check className="h-3 w-3" /> Added</> : <><Plus className="h-3 w-3" /> Buy</>}
          </button>
        </div>
      </div>
    </article>
  );
}


/* ============ Row wrapper with scroll arrows ============ */

function SectionHeader({ title, sub, action }: { title: string; sub?: string; action?: string }) {
  return (
    <div className="flex items-end justify-between mb-4">
      <div>
        <h2 className="font-display text-2xl lg:text-3xl font-bold tracking-tight">{title}</h2>
        {sub && <p className="text-sm text-muted-foreground mt-1">{sub}</p>}
      </div>
      {action && (
        <button className="hidden sm:flex items-center gap-1 text-sm text-primary hover:gap-2 transition-all">
          {action} <ArrowRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative -mx-1">
      <div className="overflow-x-auto pb-3 px-1 [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full">
        <div className="flex gap-4">{children}</div>
      </div>
    </div>
  );
}

/* ============ SECTION 04 — FEATURED ============ */
export function FeaturedRow() {
  const items = useLiveList("featured", featured);
  return (
    <section>
      <SectionHeader title="Featured software" sub="Hand-picked by Vala editors · updated daily" action="View all featured" />
      <Row>{items.map((p, i) => <FeaturedCard key={p.name} p={p} i={i} />)}</Row>
    </section>
  );
}

/* ============ SECTION 05 — INDUSTRY GRID ============ */

const industryImageMap: Record<string, string> = {
  "ind-education": indEducation,
  "ind-healthcare": indHealthcare,
  "ind-retail": indRetail,
  "ind-manufacturing": indManufacturing,
  "ind-construction": indConstruction,
  "ind-hotel": indHotel,
  "ind-transport": indTransport,
  "ind-finance": indFinance,
  "ind-ngo": indNgo,
  "ind-realestate": indRealestate,
  "ind-legal": indLegal,
  "ind-government": indGovernment,
};

const industries = [
  { name: "Education", count: 184, icon: GraduationCap, img: indEducation, tone: "primary" },
  { name: "Healthcare", count: 142, icon: Stethoscope, img: indHealthcare, tone: "success" },
  { name: "Retail", count: 218, icon: ShoppingCart, img: indRetail, tone: "magenta" },
  { name: "Manufacturing", count: 96, icon: Factory, img: indManufacturing, tone: "gold" },
  { name: "Construction", count: 64, icon: HardHat, img: indConstruction, tone: "warning" },
  { name: "Hotel", count: 48, icon: Hotel, img: indHotel, tone: "magenta" },
  { name: "Transport", count: 72, icon: Truck, img: indTransport, tone: "magenta" },
  { name: "Finance", count: 124, icon: Banknote, img: indFinance, tone: "gold" },
  { name: "NGO", count: 32, icon: HeartHandshake, img: indNgo, tone: "destructive" },
  { name: "Real Estate", count: 88, icon: HomeIcon, img: indRealestate, tone: "gold" },
  { name: "Legal", count: 42, icon: Scale, img: indLegal, tone: "primary" },
  { name: "Government", count: 28, icon: Landmark, img: indGovernment, tone: "magenta" },
];

export function IndustryGrid() {
  const { data } = useMarket();
  const list = useMemo(() => {
    const live = data?.industries;
    if (!live || live.length === 0) return industries;
    return live.map((ind) => ({
      name: ind.name,
      count: ind.product_count,
      icon: resolveIcon(ind.icon) as IconType,
      img: industryImageMap[ind.image_key ?? ""] ?? indEducation,
      tone: ind.tone,
    }));
  }, [data]);
  return (
    <section>
      <SectionHeader title="Shop by industry" sub="Pre-vetted enterprise solutions for every vertical" action="All 12 industries" />
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
        {list.map((ind) => {
          const I = ind.icon;
          const toneBorder =
            ind.tone === "gold" ? "hover:border-gold/60" :
            ind.tone === "magenta" ? "hover:border-magenta/60" :
            ind.tone === "warning" ? "hover:border-warning/60" :
            ind.tone === "success" ? "hover:border-success/60" :
            ind.tone === "destructive" ? "hover:border-destructive/60" :
            "hover:border-primary/60";
          return (
            <button key={ind.name}
                    className={`group relative h-[240px] rounded-[18px] overflow-hidden border border-border bg-panel ${toneBorder} hover:-translate-y-2 hover:shadow-[var(--shadow-card-hover)] transition-all text-left`}>
              <img src={ind.img} alt="" loading="lazy" width={768} height={512}
                   className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0"
                   style={{ background: "linear-gradient(180deg, transparent 0%, oklch(0.10 0.04 270 / 0.35) 45%, oklch(0.10 0.04 270 / 0.92) 100%)" }} />
              <div className="absolute top-3 left-3 h-9 w-9 rounded-lg bg-panel-elevated/80 backdrop-blur border border-border grid place-items-center">
                <I className="h-4.5 w-4.5 text-foreground" strokeWidth={1.8} />
              </div>
              <div className="absolute top-3 right-3 text-mono text-[10px] px-2 py-0.5 rounded-md border border-border bg-panel-elevated/80 backdrop-blur text-muted-foreground">
                {ind.count} products
              </div>
              <div className="absolute inset-x-0 bottom-0 p-4">
                <div className="text-lg font-bold tracking-tight">{ind.name}</div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">Browse marketplace</span>
                  <ChevronRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

/* ============ SECTIONS 06/07/08 — Sliders ============ */

export function TrendingRow() {
  const items = useLiveList("trending", trending);
  return (
    <section>
      <SectionHeader title="Trending now" sub="Most viewed across the marketplace this week" action="See all trending" />
      <Row>{items.map((p, i) => <VerticalCard key={p.name} p={p} i={i + 1} />)}</Row>
    </section>
  );
}
export function BestSellersRow() {
  const items = useLiveList("bestSellers", bestSelling);
  return (
    <section>
      <SectionHeader title="Top selling" sub="The products powering 184k businesses" action="See top sellers" />
      <Row>{items.map((p, i) => <VerticalCard key={p.name} p={p} i={i + 2} />)}</Row>
    </section>
  );
}
export function NewReleasesRow() {
  const items = useLiveList("newReleases", newReleases);
  return (
    <section>
      <SectionHeader title="New releases" sub="Just dropped — be the first to deploy" action="All releases" />
      <Row>{items.map((p, i) => <VerticalCard key={p.name} p={p} i={i + 3} />)}</Row>
    </section>
  );
}

/* ============ SECTION 09 — AI ZONE ============ */

const aiProducts = [
  { name: "AI CRM",        sub: "Auto-prioritized pipeline", icon: BarChart3 },
  { name: "AI ERP",        sub: "Predictive finance & ops", icon: Workflow },
  { name: "AI HRMS",       sub: "Hiring intent + retention", icon: Briefcase },
  { name: "AI Analytics",  sub: "Natural-language insights", icon: TrendingUp },
  { name: "AI Automation", sub: "No-code workflow agents",   icon: Cpu },
  { name: "AI Support",    sub: "Tier-1 deflection · 24/7",  icon: Headset },
];

export function AIZone() {
  return (
    <section className="relative rounded-[22px] overflow-hidden border border-magenta/40 p-6 lg:p-10"
             style={{ backgroundImage: "radial-gradient(120% 80% at 0% 0%, oklch(0.70 0.24 305 / 0.25), transparent 60%), radial-gradient(120% 80% at 100% 100%, oklch(0.85 0.16 220 / 0.25), transparent 60%), var(--gradient-panel)" }}>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-magenta">
            <BrainCircuit className="h-3.5 w-3.5" /> Vala AI Zone
          </span>
          <h2 className="mt-2 font-display text-2xl lg:text-4xl font-bold tracking-tight">
            <span style={{ background: "linear-gradient(135deg, var(--color-magenta), var(--color-primary))", WebkitBackgroundClip: "text", color: "transparent" }}>
              AI that ships revenue.
            </span>
          </h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-xl">Production-ready intelligence across every Vala module. Bring your data — keep your control.</p>
        </div>
        <button className="h-11 px-5 rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground text-sm font-semibold flex items-center gap-2 glow-primary hover:opacity-90">
          Enter AI Zone <ArrowRight className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {aiProducts.map((a) => {
          const I = a.icon;
          return (
            <button key={a.name}
                    className="group h-[140px] rounded-[18px] border border-border bg-panel/60 backdrop-blur hover:border-magenta/60 p-4 text-left hover:-translate-y-1 transition-all relative overflow-hidden">
              <I className="h-6 w-6 text-magenta" />
              <div className="mt-3 text-sm font-bold">{a.name}</div>
              <div className="text-[11px] text-muted-foreground">{a.sub}</div>
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-magenta via-primary to-magenta scale-x-0 group-hover:scale-x-100 origin-left transition-transform" />
            </button>
          );
        })}
      </div>
    </section>
  );
}

/* ============ SECTION 10 — RESELLER OPPORTUNITY + LEADERBOARD ============ */

export function ResellerOpportunity() {
  const [seats, setSeats] = useState(50);
  const monthly = (seats * 89 * 0.30).toFixed(0);
  const annual = (Number(monthly) * 12).toLocaleString();
  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 panel p-6 lg:p-8 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full opacity-30 blur-3xl" style={{ background: "var(--gradient-primary)" }} />
        <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-primary">
          <Handshake className="h-3.5 w-3.5" /> Reseller opportunity
        </span>
        <h2 className="mt-2 font-display text-2xl lg:text-3xl font-bold">Earn up to <span className="text-gold">40%</span> recurring commission.</h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-xl">Sell 1,284 enterprise products globally. We handle delivery, billing and support — you keep the relationship and the upside.</p>

        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-border bg-background/40 p-4">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Revenue calculator</div>
            <div className="mt-2 text-xs text-muted-foreground flex items-center justify-between">
              <span>Licenses sold / month</span><span className="text-mono text-primary">{seats}</span>
            </div>
            <input type="range" min={5} max={500} value={seats} onChange={(e) => setSeats(Number(e.target.value))}
                   className="w-full accent-[color:var(--color-primary)] mt-2" />
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-primary/30 bg-primary/10 p-3">
                <div className="text-[10px] uppercase text-primary tracking-wider">Monthly</div>
                <div className="text-mono text-lg font-bold text-primary">${Number(monthly).toLocaleString()}</div>
              </div>
              <div className="rounded-lg border border-gold/30 bg-gold/10 p-3">
                <div className="text-[10px] uppercase text-gold tracking-wider">Annual</div>
                <div className="text-mono text-lg font-bold text-gold">${annual}</div>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-background/40 p-4 space-y-2.5 text-sm">
            <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-success" /> White-label dashboard</div>
            <div className="flex items-center gap-2"><Globe2 className="h-4 w-4 text-primary" /> 142-country territory map</div>
            <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-magenta" /> Co-branded sales kits</div>
            <div className="flex items-center gap-2"><Crown className="h-4 w-4 text-gold" /> Tier rewards · trips · trophies</div>
            <button className="mt-2 w-full h-11 rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground text-sm font-semibold flex items-center justify-center gap-2 glow-primary">
              Apply to become a reseller <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="panel p-6 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-[0.22em] text-gold flex items-center gap-1.5"><Crown className="h-3.5 w-3.5" /> Champion wall</span>
          <span className="text-[10px] text-muted-foreground">This week</span>
        </div>
        <div className="mt-3 space-y-2.5">
          {[
            { rank: 1, name: "Helios Pvt Ltd",  region: "APAC", rev: "$48,910", trophy: "gold" },
            { rank: 2, name: "Verdant Sales",   region: "EU",   rev: "$38,420", trophy: "silver" },
            { rank: 3, name: "NorthStar Group", region: "NA",   rev: "$32,180", trophy: "bronze" },
            { rank: 4, name: "Aurora Partners", region: "EU",   rev: "$24,640", trophy: "" },
            { rank: 5, name: "Beacon Sales",    region: "LATAM",rev: "$18,920", trophy: "" },
          ].map((r) => {
            const tColor =
              r.trophy === "gold" ? "text-gold border-gold/40 bg-gold/10" :
              r.trophy === "silver" ? "text-foreground border-foreground/30 bg-foreground/5" :
              r.trophy === "bronze" ? "text-warning border-warning/30 bg-warning/5" :
              "text-muted-foreground border-border bg-background/30";
            return (
              <div key={r.rank} className={`flex items-center gap-3 p-2.5 rounded-lg border ${tColor}`}>
                <div className="h-8 w-8 rounded-md grid place-items-center text-mono font-bold">#{r.rank}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate text-foreground">{r.name}</div>
                  <div className="text-[10px] text-muted-foreground">{r.region}</div>
                </div>
                <div className="text-mono text-sm font-bold text-success">{r.rev}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============ SECTION 11 — VENDOR MARKET ============ */

const vendors = [
  { name: "BrightLabs", products: 24, revenue: "$4.2M", rating: 4.9, color: cyan },
  { name: "NovaCode",   products: 18, revenue: "$2.8M", rating: 4.8, color: purple },
  { name: "Helix Soft", products: 32, revenue: "$3.6M", rating: 4.7, color: gold },
  { name: "Vertex Labs",products: 14, revenue: "$1.9M", rating: 4.8, color: cyan },
];

export function VendorMarket() {
  const { data } = useMarket();
  const palette = [cyan, purple, gold];
  const list = useMemo(() => {
    const live = data?.vendors;
    if (!live || live.length === 0) return vendors;
    return live.slice(0, 4).map((v, i) => ({
      name: v.name,
      products: v.product_count,
      revenue: v.verified ? `${(v.product_count * 0.18).toFixed(1)}M` : "—",
      rating: Number(v.rating) || 4.8,
      color: palette[i % palette.length],
    }));
  }, [data]);
  return (
    <section>
      <SectionHeader title="Top vendors this quarter" sub="Trusted partners building on the Vala platform" action="Vendor directory" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {list.map((v) => (
          <div key={v.name} className="panel p-5 relative overflow-hidden hover:-translate-y-1 transition-transform">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-30 blur-2xl" style={{ background: v.color }} />
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl grid place-items-center text-white font-bold text-lg"
                   style={{ background: `linear-gradient(135deg, ${v.color}, var(--color-magenta))` }}>
                {v.name[0]}
              </div>
              <div>
                <div className="text-sm font-bold">{v.name}</div>
                <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Star className="h-2.5 w-2.5 fill-gold text-gold" /> {v.rating} · verified
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-mono text-xs">
              <div className="rounded border border-border bg-background/40 p-2">
                <div className="text-[10px] text-muted-foreground uppercase">Products</div>
                <div className="text-base font-bold">{v.products}</div>
              </div>
              <div className="rounded border border-success/30 bg-success/5 p-2">
                <div className="text-[10px] text-success uppercase">Revenue</div>
                <div className="text-base font-bold text-success">{v.revenue}</div>
              </div>
            </div>
            <button className="mt-3 w-full h-9 rounded-lg border border-primary/30 text-primary text-xs font-semibold hover:bg-primary/10">View profile</button>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============ PRODUCTS BY CATEGORY — grid grouped by industry ============ */

export function ProductsByCategory() {
  const { data } = useMarket();
  const groups = useMemo(() => {
    const fallbackAll: Product[] = [...featured, ...trending, ...bestSelling, ...newReleases];
    const live = data
      ? [...(data.featured ?? []), ...(data.trending ?? []), ...(data.bestSellers ?? []), ...(data.newReleases ?? []), ...(data.aiProducts ?? [])].map(toProduct)
      : fallbackAll;
    const map = new Map<string, Product[]>();
    for (const p of live) {
      const key = p.industry || "Other";
      if (!map.has(key)) map.set(key, []);
      const arr = map.get(key)!;
      if (!arr.find((x) => x.name === p.name)) arr.push(p);
    }
    return Array.from(map.entries())
      .filter(([, items]) => items.length > 0)
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 6);
  }, [data]);

  return (
    <section className="space-y-8">
      <SectionHeader title="Shop by category" sub="Browse the catalog grouped by what you do" action="See full catalog" />
      {groups.map(([cat, items]) => (
        <div key={cat}>
          <div className="flex items-end justify-between mb-3">
            <h3 className="font-display text-lg lg:text-xl font-bold tracking-tight flex items-center gap-2">
              <span className="text-primary">{cat}</span>
              <span className="text-mono text-[10px] px-1.5 py-0.5 rounded border border-border text-muted-foreground bg-background/40">
                {items.length}
              </span>
            </h3>
            <button className="hidden sm:flex items-center gap-1 text-xs text-primary hover:gap-2 transition-all">
              View {cat} <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {items.slice(0, 8).map((p, i) => <VerticalCard key={p.name} p={p} i={i} />)}
          </div>
        </div>
      ))}
    </section>
  );
}

