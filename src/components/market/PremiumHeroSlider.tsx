import { useEffect, useRef, useState } from "react";
import {
  ArrowRight, Play, ShieldCheck, Check,
  Sparkles, Rocket, Crown, Infinity as InfinityIcon, LayoutGrid, Eye,
  Cpu, Zap, Handshake, Palette, Headset, FileText, Store, Globe2,
  Bot, Layers, Trophy, Clock, Award, Star, Building2, TrendingUp,
  Users, Package, PlayCircle,
} from "lucide-react";

/* =====================================================================
   SOFTWARE VALA — PREMIUM HERO SLIDER (20 SLIDES)
   UI ONLY. Every slide has:
   - Unique enterprise color palette (no repeat)
   - Unique right-side scene composition
   - Badge, headline, sub, bullets, dual CTA, trust badges, optional stats
   ===================================================================== */

type Palette = {
  a: string;     // background gradient start
  b: string;     // background gradient end
  c: string;     // accent color for chips / highlights
  ink: string;   // primary text on hero bg
  sub: string;   // secondary text on hero bg
  soft: string;  // soft translucent surface for cards
  line: string;  // hairline borders
  chipBg: string;
  chipInk: string;
  primaryBg: string;
  primaryInk: string;
};

type Slide = {
  badge: string;
  eyebrow?: string;
  title: string;
  highlight?: string;
  sub: string;
  bullets: string[];
  primaryCta: string;
  secondaryCta: string;
  trust: string[];
  stats?: { value: string; label: string }[];
  scene: number;             // 0..19
  palette: Palette;
  patternId: number;         // background pattern variant
};

/* ---------- Palettes (20, all distinct, luxury enterprise) ---------- */
const P = (o: Partial<Palette> & Pick<Palette, "a" | "b" | "c" | "ink">): Palette => ({
  sub: o.ink === "#0B1225" ? "rgba(11,18,37,0.72)" : "rgba(255,255,255,0.78)",
  soft: o.ink === "#0B1225" ? "rgba(11,18,37,0.06)" : "rgba(255,255,255,0.08)",
  line: o.ink === "#0B1225" ? "rgba(11,18,37,0.12)" : "rgba(255,255,255,0.16)",
  chipBg: o.ink === "#0B1225" ? "rgba(11,18,37,0.08)" : "rgba(255,255,255,0.12)",
  chipInk: o.ink,
  primaryBg: o.c,
  primaryInk: o.ink === "#0B1225" ? "#ffffff" : "#0B1225",
  ...o,
});

const palettes: Palette[] = [
  P({ a: "#0B2A6B", b: "#1E4FCB", c: "#F5F8FF", ink: "#FFFFFF" }),         // 01 Royal Blue + White
  P({ a: "#052E2B", b: "#0D6E5F", c: "#8CE8C8", ink: "#FFFFFF" }),         // 02 Emerald + Navy
  P({ a: "#1A0F3D", b: "#4C2AA8", c: "#C6B2FF", ink: "#FFFFFF" }),         // 03 Purple + Dark Blue
  P({ a: "#0A0A0A", b: "#2A1608", c: "#F59E0B", ink: "#FFFFFF" }),         // 04 Orange + Black
  P({ a: "#E9F5F4", b: "#B8DEDA", c: "#0E7C7B", ink: "#0B1225" }),         // 05 Teal + White
  P({ a: "#0A1633", b: "#3A0A1A", c: "#DC2626", ink: "#FFFFFF" }),         // 06 Red + Navy
  P({ a: "#0A0A0A", b: "#1A1508", c: "#D4AF37", ink: "#FFFFFF" }),         // 07 Gold + Black
  P({ a: "#1E1B4B", b: "#0E7490", c: "#67E8F9", ink: "#FFFFFF" }),         // 08 Indigo + Cyan
  P({ a: "#1A1D1B", b: "#0F3A2B", c: "#22C55E", ink: "#FFFFFF" }),         // 09 Green + Graphite
  P({ a: "#EEF2F7", b: "#CBD5E1", c: "#1D4ED8", ink: "#0B1225" }),         // 10 Blue + Silver
  P({ a: "#0F172A", b: "#1E293B", c: "#F1F5F9", ink: "#FFFFFF" }),         // 11 Slate Enterprise
  P({ a: "#2A0E2A", b: "#701A75", c: "#F0ABFC", ink: "#FFFFFF" }),         // 12 Magenta + Plum
  P({ a: "#3F1D0F", b: "#7C2D12", c: "#FDBA74", ink: "#FFFFFF" }),         // 13 Sienna + Copper
  P({ a: "#F7F5EF", b: "#E7E2D2", c: "#78350F", ink: "#0B1225" }),         // 14 Cream + Espresso
  P({ a: "#0B2E1E", b: "#134E4A", c: "#5EEAD4", ink: "#FFFFFF" }),         // 15 Deep Teal + Mint
  P({ a: "#082F49", b: "#0369A1", c: "#BAE6FD", ink: "#FFFFFF" }),         // 16 Ocean + Sky
  P({ a: "#111827", b: "#312E81", c: "#A5B4FC", ink: "#FFFFFF" }),         // 17 Midnight + Indigo
  P({ a: "#1B1B1F", b: "#4C1D95", c: "#DDD6FE", ink: "#FFFFFF" }),         // 18 Onyx + Violet
  P({ a: "#0A0F1F", b: "#0E4429", c: "#F97316", ink: "#FFFFFF" }),         // 19 Ink + Forest w/ Amber accent
  P({ a: "#0B1225", b: "#1E3A8A", c: "#FCD34D", ink: "#FFFFFF" }),         // 20 Signature Vala
];

/* ---------- Slide content ---------- */
const slides: Slide[] = [
  {
    badge: "Marketplace · 12,000+ Software",
    title: "12,000+ Ready-to-Move Software",
    highlight: "80+ Business Categories",
    sub: "Discover one of the world's largest business software marketplaces — professional solutions built for startups, SMEs, and growing enterprises.",
    bullets: ["Ready-to-move products", "Lifetime licensing options", "Live demos & documentation", "Global business coverage", "Vetted enterprise catalog", "Dedicated technical support"],
    primaryCta: "Explore Software",
    secondaryCta: "View Demo",
    trust: ["Trusted Brand", "Global Presence", "Secure Platform"],
    stats: [{ value: "12,000+", label: "Software" }, { value: "80+", label: "Categories" }, { value: "60+", label: "Countries" }],
    scene: 0, palette: palettes[0], patternId: 0,
  },
  {
    badge: "Ready-to-Launch",
    title: "Why Build From Scratch…",
    highlight: "When You Can Launch Today?",
    sub: "Skip years of development, hiring, testing and maintenance. Start with professionally built business solutions — ready when you are.",
    bullets: ["Zero development wait", "Pre-tested & production-ready", "Instant deployment", "Predictable pricing", "Enterprise architecture", "Continuous updates"],
    primaryCta: "Launch Today",
    secondaryCta: "See How",
    trust: ["Trademark™ Holder", "Professional Support"],
    scene: 1, palette: palettes[1], patternId: 1,
  },
  {
    badge: "For Founders & Operators",
    title: "Build Your Brand.",
    highlight: "We'll Power The Technology.",
    sub: "Spend less time managing technology and more time serving customers, closing deals and growing your business.",
    bullets: ["White-label ready*", "Managed infrastructure", "Brand-first delivery", "Sales enablement", "Focus on growth", "Reduced overhead"],
    primaryCta: "Become Partner",
    secondaryCta: "Contact Sales",
    trust: ["Trusted Brand", "Trademark™ Holder", "Professional Support"],
    scene: 2, palette: palettes[2], patternId: 2,
  },
  {
    badge: "Licensing",
    title: "Lifetime License.",
    highlight: "Long-Term Value.",
    sub: "Transparent lifetime licensing on eligible products with predictable pricing and professional business support.",
    bullets: ["One-time payment*", "No hidden fees", "Perpetual rights", "Priority updates", "Business-grade support", "Ownership clarity"],
    primaryCta: "Buy Now",
    secondaryCta: "See Pricing",
    trust: ["Secure Platform", "Professional Support"],
    stats: [{ value: "0", label: "Recurring Fees*" }, { value: "24×7", label: "Support" }, { value: "100%", label: "Transparent" }],
    scene: 3, palette: palettes[3], patternId: 3,
  },
  {
    badge: "Every Business, One Marketplace",
    title: "One Marketplace.",
    highlight: "Every Business Solution.",
    sub: "ERP · POS · CRM · HRMS · Hospital · School · Retail · Manufacturing · Finance · Logistics · Hospitality — and much more.",
    bullets: ["80+ verticals covered", "Cross-industry catalog", "Mix & match modules", "Vendor-vetted quality", "Unified checkout", "One partner network"],
    primaryCta: "Explore Software",
    secondaryCta: "Browse Categories",
    trust: ["Trusted Brand", "Global Presence"],
    scene: 4, palette: palettes[4], patternId: 4,
  },
  {
    badge: "Evaluate Before You Buy",
    title: "Try Before You Decide.",
    highlight: "Explore Everything.",
    sub: "Live demos, screenshots, videos, documentation and full feature lists — evaluate every product with complete confidence.",
    bullets: ["Real product demos", "Screen-by-screen previews", "Feature deep dives", "Video walkthroughs", "Complete documentation", "Transparent pricing"],
    primaryCta: "View Demo",
    secondaryCta: "Read Docs",
    trust: ["Secure Platform", "Professional Support"],
    scene: 5, palette: palettes[5], patternId: 5,
  },
  {
    badge: "Enterprise Ready",
    title: "Professional Software.",
    highlight: "Enterprise Ready.",
    sub: "Reliable, scalable and business-ready software — engineered to improve productivity, automate operations and accelerate growth.",
    bullets: ["Scalable architecture", "High availability", "Role-based security", "API-first design", "Audit & compliance", "Enterprise SLAs"],
    primaryCta: "Explore Enterprise",
    secondaryCta: "Contact Sales",
    trust: ["Trademark™ Holder", "Secure Platform"],
    scene: 6, palette: palettes[6], patternId: 6,
  },
  {
    badge: "AI Zone",
    title: "AI-Powered",
    highlight: "Business Solutions",
    sub: "Modern software enhanced with intelligent automation — helping businesses work smarter, faster and more efficiently.",
    bullets: ["Predictive analytics", "Workflow automation", "Smart assistants", "Document intelligence", "Vision & OCR", "Voice & chat AI"],
    primaryCta: "Browse AI Zone",
    secondaryCta: "View Demo",
    trust: ["Trusted Brand", "Secure Platform"],
    scene: 7, palette: palettes[7], patternId: 7,
  },
  {
    badge: "Growth",
    title: "Launch Faster.",
    highlight: "Grow Smarter.",
    sub: "Reduce operational complexity, accelerate deployment and focus on building your business — instead of building software.",
    bullets: ["Faster time-to-value", "Lower TCO", "Simpler operations", "Ready integrations", "Growth playbooks", "Scalable pricing"],
    primaryCta: "Get Started",
    secondaryCta: "Talk to Sales",
    trust: ["Global Presence", "Professional Support"],
    scene: 8, palette: palettes[8], patternId: 8,
  },
  {
    badge: "Software Vala™ Ecosystem",
    title: "Trusted Software",
    highlight: "Ecosystem™",
    sub: "12,000+ ready-to-move software · 80+ categories · global presence · Trademark™ holder · professional licensing · dedicated support.",
    bullets: ["Trademark™ protected", "Global business coverage", "Professional licensing", "Managed ecosystem", "Dedicated technical support", "Regular product upgrades"],
    primaryCta: "Explore Ecosystem",
    secondaryCta: "Become Partner",
    trust: ["Trusted Brand", "Trademark™ Holder", "Global Presence"],
    scene: 9, palette: palettes[9], patternId: 9,
  },
  {
    badge: "Partner Programs",
    eyebrow: "Reseller · Franchise · Distributor · Affiliate · Author",
    title: "Become a Partner.",
    highlight: "Build Without Building.",
    sub: "Build a software business without building a software company. Ready ecosystem · 12,000+ products · 80+ categories · faster launch.",
    bullets: ["No developer hiring", "No infrastructure cost", "White-label opportunities*", "Ready demo environment", "Partner dashboard", "Global opportunities"],
    primaryCta: "Become Partner",
    secondaryCta: "Program Details",
    trust: ["Trademark™ Holder", "Professional Support"],
    stats: [{ value: "5", label: "Partner Tracks" }, { value: "12k+", label: "Ready Products" }, { value: "80+", label: "Categories" }],
    scene: 10, palette: palettes[10], patternId: 10,
  },
  {
    badge: "White Label",
    title: "White Label",
    highlight: "Opportunities",
    sub: "Expand under your own brand with eligible white-label software solutions — backed by a professional technology ecosystem.",
    bullets: ["Your brand, our engine*", "Custom domain & theming", "Managed updates", "Branded documentation", "Reseller pricing", "Territory options"],
    primaryCta: "Apply for White Label",
    secondaryCta: "Contact Sales",
    trust: ["Trademark™ Holder", "Secure Platform"],
    scene: 11, palette: palettes[11], patternId: 11,
  },
  {
    badge: "Support",
    title: "Professional",
    highlight: "Technical Support.",
    sub: "From onboarding to deployment, our experienced technical team is committed to supporting your business journey.",
    bullets: ["Priority ticketing", "Onboarding assistance", "Deployment guidance", "Product training", "Named account contacts", "24×7 availability*"],
    primaryCta: "Contact Support",
    secondaryCta: "See Plans",
    trust: ["Professional Support", "Trusted Brand"],
    scene: 12, palette: palettes[12], patternId: 12,
  },
  {
    badge: "One Platform",
    title: "Everything",
    highlight: "In One Place.",
    sub: "Marketplace · demos · documentation · screenshots · videos · licensing · downloads · updates · support — under one platform.",
    bullets: ["Unified marketplace", "Complete product info", "Licensing & downloads", "Update notifications", "Integrated support", "One dashboard"],
    primaryCta: "Explore Platform",
    secondaryCta: "View Demo",
    trust: ["Trusted Brand", "Secure Platform"],
    scene: 13, palette: palettes[13], patternId: 13,
  },
  {
    badge: "Industries",
    title: "Solutions For",
    highlight: "Every Industry.",
    sub: "Healthcare · Education · Retail · Finance · Manufacturing · Construction · Hospitality · Agriculture · Logistics · Government · Services.",
    bullets: ["12+ major verticals", "Industry-specific workflows", "Compliance-ready", "Localized options", "Domain expertise", "Category leaders"],
    primaryCta: "Browse Industries",
    secondaryCta: "Find Your Fit",
    trust: ["Global Presence", "Trusted Brand"],
    scene: 14, palette: palettes[14], patternId: 14,
  },
  {
    badge: "Real Demo",
    title: "Real Demo.",
    highlight: "Real Experience.",
    sub: "Watch demonstrations, explore real screenshots, review documentation and understand every feature — before purchasing.",
    bullets: ["HD product demos", "Full screen walkthroughs", "Feature explainers", "Setup previews", "Recorded webinars", "Interactive tours"],
    primaryCta: "Watch Demo",
    secondaryCta: "Explore Product",
    trust: ["Secure Platform", "Professional Support"],
    scene: 15, palette: palettes[15], patternId: 15,
  },
  {
    badge: "Software Business",
    title: "One Platform.",
    highlight: "Unlimited Opportunities.",
    sub: "Buy software · sell software · grow your brand · expand globally · build long-term business value — under one trusted ecosystem.",
    bullets: ["Buy & deploy", "Sell & distribute", "Publish & earn", "Expand globally", "Grow your brand", "Long-term value"],
    primaryCta: "Explore Opportunities",
    secondaryCta: "Become Partner",
    trust: ["Trusted Brand", "Global Presence"],
    scene: 16, palette: palettes[16], patternId: 16,
  },
  {
    badge: "Global",
    title: "Global Business",
    highlight: "Ready.",
    sub: "Multi-language · multi-currency · professional licensing · enterprise ready · worldwide business opportunities. Built to grow beyond borders.",
    bullets: ["Multi-language UI", "Multi-currency billing", "Regional compliance", "Global partner network", "24×7 reachability", "Worldwide catalog"],
    primaryCta: "Explore Globally",
    secondaryCta: "Regional Partners",
    trust: ["Global Presence", "Trademark™ Holder", "Trusted Brand"],
    scene: 17, palette: palettes[17], patternId: 17,
  },
  {
    badge: "Rapid Delivery",
    title: "Delivered Within",
    highlight: "2 Hours*",
    sub: "For eligible ready-to-move software, rapid delivery means your business can begin without unnecessary waiting.",
    bullets: ["Instant licensing", "Automated provisioning", "Priority queue", "Verified checkout", "Onboarding kickoff", "Zero waiting time*"],
    primaryCta: "Buy Now",
    secondaryCta: "How It Works",
    trust: ["Secure Platform", "Professional Support"],
    stats: [{ value: "2h*", label: "Delivery" }, { value: "24×7", label: "Fulfillment" }, { value: "100%", label: "Automated" }],
    scene: 18, palette: palettes[18], patternId: 18,
  },
  {
    badge: "Software Vala™",
    title: "Software Vala™",
    highlight: "The Name of Trust.",
    sub: "Powering businesses with professional software solutions. Build Better. Launch Faster. Grow Smarter. www.softwarewala.net",
    bullets: ["12,000+ ready software", "80+ business categories", "Global business ecosystem", "Trademark™ protected", "Professional support", "The name of trust"],
    primaryCta: "Explore Software Vala",
    secondaryCta: "Become Partner",
    trust: ["Trusted Brand", "Trademark™ Holder", "Global Presence", "Secure Platform"],
    scene: 19, palette: palettes[19], patternId: 19,
  },
];

/* ============ BACKGROUND PATTERNS (per slide) ============ */
function Pattern({ id, ink }: { id: number; ink: string }) {
  const stroke = ink === "#0B1225" ? "rgba(11,18,37,0.10)" : "rgba(255,255,255,0.10)";
  const soft = ink === "#0B1225" ? "rgba(11,18,37,0.05)" : "rgba(255,255,255,0.06)";
  return (
    <svg className="absolute inset-0 h-full w-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 1600 720">
      {id === 0 && (
        <>
          <defs><pattern id="p0" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M48 0H0V48" fill="none" stroke={stroke} /></pattern></defs>
          <rect width="1600" height="720" fill="url(#p0)" />
          <circle cx="1200" cy="120" r="260" fill={soft} />
        </>
      )}
      {id === 1 && <>{Array.from({ length: 8 }).map((_, i) => <path key={i} d={`M0 ${80 + i * 80} Q 800 ${20 + i * 80} 1600 ${80 + i * 80}`} stroke={stroke} fill="none" />)}</>}
      {id === 2 && Array.from({ length: 40 }).map((_, i) => <circle key={i} cx={(i * 97) % 1600} cy={(i * 53) % 720} r={1.5} fill={stroke} />)}
      {id === 3 && <>{Array.from({ length: 6 }).map((_, i) => <polygon key={i} points={`${200 + i * 240},60 ${340 + i * 240},280 ${200 + i * 240},500 ${60 + i * 240},280`} fill="none" stroke={stroke} />)}</>}
      {id === 4 && <>{Array.from({ length: 6 }).map((_, i) => <rect key={i} x={100 + i * 240} y={100 + (i % 2) * 120} width="200" height="360" rx="24" fill="none" stroke={stroke} />)}</>}
      {id === 5 && <path d="M0 500 C 400 200 800 600 1200 300 S 1600 500 1600 500" stroke={stroke} strokeWidth="2" fill="none" />}
      {id === 6 && <>{Array.from({ length: 10 }).map((_, i) => <line key={i} x1={i * 160} y1="0" x2={i * 160 + 400} y2="720" stroke={stroke} />)}</>}
      {id === 7 && <>{Array.from({ length: 30 }).map((_, i) => { const x = (i * 137) % 1600; const y = (i * 89) % 720; return <g key={i}><circle cx={x} cy={y} r="3" fill={stroke} /><line x1={x} y1={y} x2={(x + 200) % 1600} y2={(y + 120) % 720} stroke={stroke} /></g>; })}</>}
      {id === 8 && <>{Array.from({ length: 5 }).map((_, i) => <path key={i} d={`M${i * 320} 720 L${i * 320 + 200} 200 L${i * 320 + 400} 500 L${i * 320 + 600} 100`} stroke={stroke} fill="none" />)}</>}
      {id === 9 && <>{[0.3, 0.6, 0.9].map((r, i) => <circle key={i} cx="800" cy="360" r={r * 400} fill="none" stroke={stroke} />)}</>}
      {id === 10 && Array.from({ length: 40 }).map((_, i) => <rect key={i} x={(i * 43) % 1600} y={(i * 91) % 720} width="60" height="6" rx="3" fill={stroke} />)}
      {id === 11 && <>{Array.from({ length: 12 }).map((_, i) => <path key={i} d={`M${i * 140} 0 L${i * 140 + 300} 720`} stroke={stroke} />)}</>}
      {id === 12 && <>{Array.from({ length: 20 }).map((_, i) => <circle key={i} cx={(i * 111) % 1600} cy={((i * 71) % 620) + 40} r={20 + (i % 4) * 10} fill="none" stroke={stroke} />)}</>}
      {id === 13 && <>{Array.from({ length: 6 }).map((_, i) => <rect key={i} x={80 + i * 240} y={120} width="180" height="480" rx="20" fill={soft} />)}</>}
      {id === 14 && <>{Array.from({ length: 6 }).map((_, i) => <path key={i} d={`M${i * 280} 720 Q ${i * 280 + 140} ${100 + i * 40} ${i * 280 + 280} 720`} stroke={stroke} fill="none" />)}</>}
      {id === 15 && <><rect x="500" y="180" width="600" height="360" rx="24" fill="none" stroke={stroke} /><polygon points="760,300 860,360 760,420" fill={stroke} /></>}
      {id === 16 && <>{Array.from({ length: 6 }).map((_, i) => <ellipse key={i} cx="800" cy="360" rx={200 + i * 90} ry={100 + i * 30} fill="none" stroke={stroke} />)}</>}
      {id === 17 && <>{Array.from({ length: 20 }).map((_, i) => <path key={i} d={`M${i * 80} 0 Q ${i * 80 + 40} 360 ${i * 80} 720`} stroke={stroke} fill="none" />)}</>}
      {id === 18 && <>{Array.from({ length: 6 }).map((_, i) => <path key={i} d={`M0 ${100 + i * 100} L1600 ${100 + i * 100}`} stroke={stroke} strokeDasharray="6 12" />)}</>}
      {id === 19 && <>{Array.from({ length: 8 }).map((_, i) => <polygon key={i} points={`${200 + i * 180},80 ${260 + i * 180},200 ${140 + i * 180},200`} fill="none" stroke={stroke} />)}</>}
    </svg>
  );
}

/* ============ SCENES — one per slide, all distinct ============ */

function Frame({ children, pal, tilt = 0 }: { children: React.ReactNode; pal: Palette; tilt?: number }) {
  return (
    <div
      className="absolute inset-0 rounded-2xl border shadow-2xl overflow-hidden"
      style={{ borderColor: pal.line, background: pal.soft, transform: `rotate(${tilt}deg)` }}
    >
      {children}
    </div>
  );
}

function Scene({ i, pal }: { i: number; pal: Palette }) {
  const cardBg = pal.ink === "#0B1225" ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.08)";
  const cardInk = pal.ink;
  const chipInk = pal.c;

  // 00 — Laptop mockup w/ software windows + floating chips (Marketplace)
  if (i === 0) return (
    <div className="relative h-full w-full">
      <div className="absolute left-[6%] right-[6%] top-[14%] rounded-t-[14px] border p-3" style={{ background: cardBg, borderColor: pal.line }}>
        <div className="flex gap-1.5 mb-2"><span className="h-2 w-2 rounded-full bg-red-400" /><span className="h-2 w-2 rounded-full bg-amber-400" /><span className="h-2 w-2 rounded-full bg-emerald-400" /></div>
        <div className="grid grid-cols-6 gap-2">
          {Array.from({ length: 18 }).map((_, k) => (
            <div key={k} className="aspect-square rounded-md" style={{ background: pal.ink === "#0B1225" ? `rgba(11,18,37,${0.05 + (k % 5) * 0.05})` : `rgba(255,255,255,${0.06 + (k % 5) * 0.06})` }}>
              <div className="m-1 h-2 rounded" style={{ background: k % 3 === 0 ? pal.c : "transparent" }} />
            </div>
          ))}
        </div>
      </div>
      <div className="absolute left-[3%] right-[3%] bottom-[10%] h-3 rounded-b-2xl" style={{ background: pal.line }} />
      <div className="absolute right-[8%] top-[8%] px-3 py-2 rounded-xl text-[11px] font-semibold shadow-lg flex items-center gap-1.5" style={{ background: pal.c, color: pal.primaryInk }}>
        <Sparkles className="h-3 w-3" /> 12,000+ Products
      </div>
      <div className="absolute left-[6%] bottom-[22%] px-3 py-2 rounded-xl text-[11px] font-semibold shadow-lg flex items-center gap-1.5" style={{ background: cardBg, color: cardInk, borderColor: pal.line }}>
        <LayoutGrid className="h-3 w-3" /> 80+ Categories
      </div>
    </div>
  );

  // 01 — Rocket launch + progress bars
  if (i === 1) return (
    <div className="relative h-full w-full">
      <div className="absolute inset-x-[10%] top-[10%] bottom-[10%] rounded-2xl border p-6 flex flex-col justify-between" style={{ background: cardBg, borderColor: pal.line, color: cardInk }}>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl grid place-items-center" style={{ background: pal.c, color: pal.primaryInk }}><Rocket className="h-6 w-6" /></div>
          <div>
            <div className="text-sm font-bold">Launch Sequence</div>
            <div className="text-[11px] opacity-70">Ready in minutes, not months</div>
          </div>
        </div>
        {["Provision", "Configure", "Deploy", "Onboard"].map((s, k) => (
          <div key={s}>
            <div className="flex justify-between text-[11px] mb-1"><span className="opacity-80">{s}</span><span className="font-mono">{100 - k * 6}%</span></div>
            <div className="h-2 rounded-full" style={{ background: pal.line }}>
              <div className="h-2 rounded-full" style={{ width: `${100 - k * 6}%`, background: pal.c }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // 02 — Brand builder + tech powerhouse
  if (i === 2) return (
    <div className="relative h-full w-full">
      <div className="absolute left-[8%] top-[12%] w-[52%] rounded-2xl border p-5" style={{ background: cardBg, borderColor: pal.line, color: cardInk }}>
        <div className="text-[10px] uppercase tracking-widest opacity-70">Your Brand</div>
        <div className="mt-2 text-2xl font-extrabold">Acme Cloud™</div>
        <div className="mt-4 flex items-center gap-2 text-[11px]"><Palette className="h-3 w-3" style={{ color: pal.c }} /> Custom theme active</div>
        <div className="mt-1 flex items-center gap-2 text-[11px]"><Globe2 className="h-3 w-3" style={{ color: pal.c }} /> yourbrand.example</div>
      </div>
      <div className="absolute right-[8%] bottom-[12%] w-[52%] rounded-2xl border p-5" style={{ background: pal.c, color: pal.primaryInk }}>
        <div className="text-[10px] uppercase tracking-widest opacity-80">Powered by Software Vala™</div>
        <div className="mt-2 flex items-center gap-2 text-lg font-bold"><Cpu className="h-5 w-5" /> Technology Engine</div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-[10px]">
          {["ERP", "CRM", "HRMS", "POS", "AI", "Cloud"].map((t) => <div key={t} className="rounded px-2 py-1 text-center" style={{ background: "rgba(0,0,0,0.15)" }}>{t}</div>)}
        </div>
      </div>
    </div>
  );

  // 03 — Lifetime license certificate + seal
  if (i === 3) return (
    <div className="relative h-full w-full grid place-items-center">
      <div className="w-[70%] aspect-[1.4/1] rounded-2xl border-2 p-6 relative" style={{ borderColor: pal.c, background: cardBg, color: cardInk }}>
        <div className="flex items-center justify-between">
          <div className="text-[10px] uppercase tracking-[0.3em] opacity-70">License Certificate</div>
          <Crown className="h-5 w-5" style={{ color: pal.c }} />
        </div>
        <div className="mt-4 text-3xl font-extrabold">LIFETIME</div>
        <div className="text-xs opacity-70 mt-1">Perpetual · Transferable* · Enterprise</div>
        <div className="mt-6 grid grid-cols-3 gap-3 text-[10px]">
          <div><div className="opacity-60">Product</div><div className="font-semibold">VALA ERP</div></div>
          <div><div className="opacity-60">Seats</div><div className="font-semibold">Unlimited</div></div>
          <div><div className="opacity-60">Support</div><div className="font-semibold">24×7</div></div>
        </div>
        <div className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full grid place-items-center rotate-[-12deg] text-[10px] font-black" style={{ background: pal.c, color: pal.primaryInk, boxShadow: `0 0 0 4px ${cardBg}` }}>
          <div className="text-center leading-tight">LIFETIME<br />VALUE</div>
        </div>
      </div>
    </div>
  );

  // 04 — Industry / module bento grid
  if (i === 4) return (
    <div className="relative h-full w-full p-[8%]">
      <div className="h-full w-full grid grid-cols-4 grid-rows-3 gap-2">
        {["ERP", "CRM", "HRMS", "POS", "Hospital", "School", "Retail", "Manufacturing", "Finance", "Logistics", "Hotel", "AI"].map((m, k) => (
          <div key={m} className={`rounded-xl border grid place-items-center text-[11px] font-bold ${k === 0 ? "col-span-2 row-span-2 text-lg" : ""}`}
               style={{ background: k === 0 ? pal.c : cardBg, color: k === 0 ? pal.primaryInk : cardInk, borderColor: pal.line }}>
            {m}
          </div>
        ))}
      </div>
    </div>
  );

  // 05 — Video player + preview stack
  if (i === 5) return (
    <div className="relative h-full w-full">
      <div className="absolute left-[10%] top-[14%] w-[64%] aspect-video rounded-2xl border overflow-hidden" style={{ background: cardBg, borderColor: pal.line }}>
        <div className="absolute inset-0 grid place-items-center"><div className="h-14 w-14 rounded-full grid place-items-center" style={{ background: pal.c, color: pal.primaryInk }}><Play className="h-6 w-6 ml-0.5" /></div></div>
        <div className="absolute bottom-0 left-0 right-0 h-1.5" style={{ background: pal.line }}><div className="h-1.5" style={{ width: "38%", background: pal.c }} /></div>
      </div>
      <div className="absolute right-[6%] bottom-[10%] w-[38%] rounded-2xl border p-3" style={{ background: cardBg, borderColor: pal.line, color: cardInk }}>
        <div className="text-[10px] uppercase tracking-widest opacity-70">Screenshots</div>
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          {Array.from({ length: 6 }).map((_, k) => <div key={k} className="aspect-video rounded" style={{ background: k % 2 ? pal.c : pal.line, opacity: k % 2 ? 0.9 : 1 }} />)}
        </div>
      </div>
    </div>
  );

  // 06 — Enterprise dashboard w/ KPIs and chart
  if (i === 6) return (
    <div className="relative h-full w-full p-[6%]">
      <div className="h-full w-full rounded-2xl border p-4 grid grid-cols-3 gap-3" style={{ background: cardBg, borderColor: pal.line, color: cardInk }}>
        <div className="col-span-3 flex items-center justify-between text-[11px] opacity-80"><span className="font-bold">Enterprise Console</span><span className="font-mono">v12.4</span></div>
        {[{ v: "$4.2M", l: "ARR" }, { v: "184k", l: "Users" }, { v: "99.98%", l: "Uptime" }].map((k) => (
          <div key={k.l} className="rounded-xl p-3" style={{ background: pal.line }}>
            <div className="text-lg font-extrabold" style={{ color: pal.c }}>{k.v}</div>
            <div className="text-[10px] opacity-70">{k.l}</div>
          </div>
        ))}
        <div className="col-span-3 h-32 rounded-xl relative overflow-hidden" style={{ background: pal.line }}>
          <svg viewBox="0 0 400 120" className="absolute inset-0 h-full w-full">
            <path d="M0 100 L 40 80 L 80 90 L 120 60 L 160 70 L 200 40 L 240 55 L 280 30 L 320 45 L 360 20 L 400 30" fill="none" stroke={pal.c} strokeWidth="3" />
          </svg>
        </div>
      </div>
    </div>
  );

  // 07 — AI brain + neural nodes
  if (i === 7) return (
    <div className="relative h-full w-full grid place-items-center">
      <div className="relative h-[70%] aspect-square">
        <div className="absolute inset-[22%] rounded-full grid place-items-center" style={{ background: pal.c, color: pal.primaryInk, boxShadow: `0 0 60px ${pal.c}` }}>
          <Bot className="h-14 w-14" />
        </div>
        {Array.from({ length: 10 }).map((_, k) => {
          const a = (k / 10) * Math.PI * 2;
          const x = 50 + Math.cos(a) * 42;
          const y = 50 + Math.sin(a) * 42;
          return (
            <div key={k} className="absolute h-3 w-3 rounded-full" style={{ left: `${x}%`, top: `${y}%`, background: pal.ink, transform: "translate(-50%,-50%)", opacity: 0.9 }} />
          );
        })}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
          {Array.from({ length: 10 }).map((_, k) => {
            const a = (k / 10) * Math.PI * 2;
            const x = 50 + Math.cos(a) * 42;
            const y = 50 + Math.sin(a) * 42;
            return <line key={k} x1="50" y1="50" x2={x} y2={y} stroke={pal.ink} strokeOpacity="0.35" strokeWidth="0.5" />;
          })}
        </svg>
      </div>
    </div>
  );

  // 08 — Growth chart + upward arrow
  if (i === 8) return (
    <div className="relative h-full w-full p-[8%]">
      <div className="h-full w-full rounded-2xl border p-5 relative overflow-hidden" style={{ background: cardBg, borderColor: pal.line, color: cardInk }}>
        <div className="flex items-center justify-between"><div className="text-sm font-bold">Growth Trajectory</div><TrendingUp className="h-5 w-5" style={{ color: pal.c }} /></div>
        <svg viewBox="0 0 400 200" className="mt-4 h-[70%] w-full">
          {Array.from({ length: 8 }).map((_, k) => <rect key={k} x={k * 48 + 10} y={180 - (k + 1) * 18} width="30" height={(k + 1) * 18} rx="4" fill={pal.c} opacity={0.4 + k * 0.075} />)}
          <path d="M20 160 L 68 130 L 116 120 L 164 90 L 212 80 L 260 55 L 308 40 L 356 20" stroke={pal.c} strokeWidth="3" fill="none" />
        </svg>
        <div className="absolute right-4 top-4 text-mono text-[10px] px-2 py-1 rounded" style={{ background: pal.c, color: pal.primaryInk }}>+142%</div>
      </div>
    </div>
  );

  // 09 — Trust seal / ecosystem hub
  if (i === 9) return (
    <div className="relative h-full w-full grid place-items-center">
      <div className="relative h-[74%] aspect-square rounded-full border-2 grid place-items-center" style={{ borderColor: pal.c, background: cardBg }}>
        <div className="text-center" style={{ color: cardInk }}>
          <Award className="h-10 w-10 mx-auto" style={{ color: pal.c }} />
          <div className="mt-2 text-xl font-black">SOFTWARE VALA™</div>
          <div className="text-[10px] uppercase tracking-[0.3em] opacity-70">Trusted Ecosystem</div>
        </div>
        {["12k+ Products", "80+ Categories", "60+ Countries", "24×7 Support"].map((t, k) => {
          const angle = (k / 4) * 360;
          return (
            <div key={t} className="absolute px-3 py-1.5 rounded-full text-[10px] font-semibold shadow-lg"
                 style={{ transform: `rotate(${angle}deg) translate(0,-140%) rotate(-${angle}deg)`, background: pal.c, color: pal.primaryInk }}>
              {t}
            </div>
          );
        })}
      </div>
    </div>
  );

  // 10 — Partner comparison (❌ vs ✅)
  if (i === 10) return (
    <div className="relative h-full w-full p-[6%] grid grid-cols-2 gap-3">
      <div className="rounded-2xl border p-4" style={{ background: cardBg, borderColor: pal.line, color: cardInk, opacity: 0.85 }}>
        <div className="text-[10px] uppercase tracking-widest opacity-70">Traditional</div>
        <div className="mt-3 space-y-2 text-[11px]">
          {["Developer hiring", "Infra investment", "Long dev cycles", "High overhead", "Support ops", "Marketing spend"].map((t) => (
            <div key={t} className="flex items-center gap-2"><span className="h-4 w-4 rounded-full grid place-items-center text-[10px]" style={{ background: pal.line }}>✕</span>{t}</div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl p-4" style={{ background: pal.c, color: pal.primaryInk }}>
        <div className="text-[10px] uppercase tracking-widest opacity-80">With Software Vala</div>
        <div className="mt-3 space-y-2 text-[11px]">
          {["Ready ecosystem", "12,000+ software", "Faster launch", "White label*", "Dedicated support", "Global reach"].map((t) => (
            <div key={t} className="flex items-center gap-2"><Check className="h-3.5 w-3.5" />{t}</div>
          ))}
        </div>
      </div>
    </div>
  );

  // 11 — White label / brand cloner
  if (i === 11) return (
    <div className="relative h-full w-full p-[8%]">
      <div className="h-full w-full rounded-2xl border p-5 flex flex-col justify-between" style={{ background: cardBg, borderColor: pal.line, color: cardInk }}>
        <div className="flex items-center gap-3"><Layers className="h-6 w-6" style={{ color: pal.c }} /><span className="text-sm font-bold">White-label Studio</span></div>
        <div className="grid grid-cols-3 gap-2">
          {["Your Logo", "Your Colors", "Your Domain"].map((t, k) => (
            <div key={t} className="rounded-xl p-3 text-[10px] font-semibold" style={{ background: k === 1 ? pal.c : pal.line, color: k === 1 ? pal.primaryInk : cardInk }}>
              {t}
              <div className="mt-2 h-8 rounded" style={{ background: k === 1 ? "rgba(0,0,0,0.2)" : cardBg }} />
            </div>
          ))}
        </div>
        <div className="text-[10px] opacity-70">*Available for eligible products and partnership programs</div>
      </div>
    </div>
  );

  // 12 — Support headset + chat bubbles
  if (i === 12) return (
    <div className="relative h-full w-full">
      <div className="absolute left-[14%] top-[16%] h-28 w-28 rounded-full grid place-items-center shadow-2xl" style={{ background: pal.c, color: pal.primaryInk }}><Headset className="h-14 w-14" /></div>
      {[{ x: 40, y: 24, t: "Hi! How can we help?" }, { x: 60, y: 46, t: "Onboarding scheduled ✓" }, { x: 44, y: 66, t: "Ticket #48192 resolved" }].map((c, k) => (
        <div key={k} className="absolute rounded-2xl border px-3 py-2 text-[11px] shadow-lg" style={{ left: `${c.x}%`, top: `${c.y}%`, background: cardBg, color: cardInk, borderColor: pal.line }}>{c.t}</div>
      ))}
    </div>
  );

  // 13 — Devices trio (desktop + tablet + mobile)
  if (i === 13) return (
    <div className="relative h-full w-full">
      <div className="absolute left-[14%] top-[18%] w-[52%] aspect-[16/10] rounded-xl border p-2" style={{ background: cardBg, borderColor: pal.line }}>
        <div className="h-full w-full rounded" style={{ background: `linear-gradient(135deg, ${pal.c}, ${pal.a})` }} />
      </div>
      <div className="absolute right-[18%] top-[10%] w-[26%] aspect-[3/4] rounded-xl border p-1.5" style={{ background: cardBg, borderColor: pal.line }}>
        <div className="h-full w-full rounded" style={{ background: pal.line }}>
          <div className="h-6 rounded-t" style={{ background: pal.c }} />
        </div>
      </div>
      <div className="absolute right-[10%] bottom-[10%] w-[16%] aspect-[9/18] rounded-2xl border p-1" style={{ background: cardBg, borderColor: pal.line }}>
        <div className="h-full w-full rounded-xl" style={{ background: `linear-gradient(180deg, ${pal.a}, ${pal.c})` }} />
      </div>
    </div>
  );

  // 14 — Industry hex map
  if (i === 14) return (
    <div className="relative h-full w-full p-[6%] grid grid-cols-4 gap-2">
      {["Health", "Edu", "Retail", "Finance", "Mfg", "Const", "Hotel", "Agri", "Logistics", "Gov", "Services", "More"].map((n, k) => (
        <div key={n} className="rounded-2xl border grid place-items-center text-[11px] font-bold text-center" style={{ background: k % 3 === 1 ? pal.c : cardBg, color: k % 3 === 1 ? pal.primaryInk : cardInk, borderColor: pal.line, aspectRatio: "1/1" }}>
          <div><Building2 className="h-4 w-4 mx-auto mb-1" />{n}</div>
        </div>
      ))}
    </div>
  );

  // 15 — Big video player
  if (i === 15) return (
    <div className="relative h-full w-full grid place-items-center">
      <div className="w-[78%] aspect-video rounded-2xl border relative overflow-hidden shadow-2xl" style={{ background: `linear-gradient(135deg, ${pal.a}, ${pal.b})`, borderColor: pal.line }}>
        <div className="absolute inset-0 grid place-items-center">
          <div className="h-20 w-20 rounded-full grid place-items-center shadow-2xl" style={{ background: pal.c, color: pal.primaryInk }}><PlayCircle className="h-12 w-12" /></div>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 text-[11px]" style={{ color: pal.ink }}>
          <span className="font-mono">02:14</span>
          <div className="flex-1 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }}><div className="h-1 rounded-full" style={{ width: "42%", background: pal.c }} /></div>
          <Eye className="h-3.5 w-3.5" /> <span className="font-mono">184k</span>
        </div>
      </div>
    </div>
  );

  // 16 — Opportunity funnel / marketplace + storefront
  if (i === 16) return (
    <div className="relative h-full w-full p-[6%]">
      <div className="grid grid-cols-2 gap-3 h-full">
        <div className="rounded-2xl border p-4 flex flex-col justify-between" style={{ background: cardBg, borderColor: pal.line, color: cardInk }}>
          <div className="flex items-center gap-2 text-sm font-bold"><Store className="h-5 w-5" style={{ color: pal.c }} /> Buy</div>
          <div className="grid grid-cols-3 gap-1.5">
            {Array.from({ length: 9 }).map((_, k) => <div key={k} className="aspect-square rounded-md" style={{ background: k % 3 === 0 ? pal.c : pal.line }} />)}
          </div>
        </div>
        <div className="rounded-2xl p-4 flex flex-col justify-between" style={{ background: pal.c, color: pal.primaryInk }}>
          <div className="flex items-center gap-2 text-sm font-bold"><TrendingUp className="h-5 w-5" /> Sell & Grow</div>
          <div className="space-y-1.5 text-[11px]">
            {["Publish product", "Global buyers", "Recurring revenue", "Brand expansion"].map((t) => <div key={t} className="flex items-center gap-2"><Check className="h-3 w-3" />{t}</div>)}
          </div>
        </div>
      </div>
    </div>
  );

  // 17 — World map dots
  if (i === 17) return (
    <div className="relative h-full w-full grid place-items-center">
      <svg viewBox="0 0 400 200" className="w-[86%]">
        <ellipse cx="200" cy="100" rx="180" ry="80" fill="none" stroke={pal.line} />
        {Array.from({ length: 80 }).map((_, k) => {
          const cx = 30 + (k * 37) % 340;
          const cy = 30 + (k * 53) % 140;
          const on = k % 3 === 0;
          return <circle key={k} cx={cx} cy={cy} r={on ? 2.5 : 1.5} fill={on ? pal.c : pal.ink} opacity={on ? 1 : 0.35} />;
        })}
        {[[80, 70], [200, 60], [300, 90], [250, 130], [120, 130]].map(([x, y], k) => (
          <g key={k}><circle cx={x} cy={y} r="5" fill={pal.c} /><circle cx={x} cy={y} r="10" fill="none" stroke={pal.c} opacity="0.5" /></g>
        ))}
      </svg>
      <div className="absolute right-[6%] top-[10%] px-3 py-2 rounded-xl text-[11px] font-semibold" style={{ background: pal.c, color: pal.primaryInk }}>60+ Countries · 24×7</div>
    </div>
  );

  // 18 — Delivery clock / countdown
  if (i === 18) return (
    <div className="relative h-full w-full grid place-items-center">
      <div className="relative h-[70%] aspect-square rounded-full border-8 grid place-items-center" style={{ borderColor: pal.c, background: cardBg }}>
        <div className="text-center" style={{ color: cardInk }}>
          <Clock className="h-10 w-10 mx-auto" style={{ color: pal.c }} />
          <div className="mt-2 text-5xl font-black">2h*</div>
          <div className="text-[10px] uppercase tracking-[0.3em] opacity-70">Rapid Delivery</div>
        </div>
      </div>
      <div className="absolute left-[8%] top-[14%] px-3 py-2 rounded-xl text-[11px] font-semibold shadow-lg" style={{ background: cardBg, color: cardInk, border: `1px solid ${pal.line}` }}>Order verified ✓</div>
      <div className="absolute right-[8%] bottom-[14%] px-3 py-2 rounded-xl text-[11px] font-semibold shadow-lg" style={{ background: pal.c, color: pal.primaryInk }}>License issued ✓</div>
    </div>
  );

  // 19 — Vala signature brand mark + composite
  if (i === 19) return (
    <div className="relative h-full w-full grid place-items-center">
      <div className="relative w-[74%] rounded-3xl border p-8" style={{ background: cardBg, borderColor: pal.c, color: cardInk }}>
        <div className="flex items-center gap-3">
          <div className="h-14 w-14 rounded-2xl grid place-items-center" style={{ background: pal.c, color: pal.primaryInk }}><Trophy className="h-8 w-8" /></div>
          <div>
            <div className="text-2xl font-black">Software Vala™</div>
            <div className="text-[11px] opacity-70">The Name of Trust</div>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2 text-[11px]">
          {[{ i: Package, t: "12,000+ Software" }, { i: LayoutGrid, t: "80+ Categories" }, { i: Globe2, t: "Global Ready" }, { i: ShieldCheck, t: "Trademark™" }, { i: Users, t: "Partners" }, { i: Award, t: "Trusted" }].map(({ i: I, t }) => (
            <div key={t} className="rounded-xl border px-3 py-2 flex items-center gap-2" style={{ borderColor: pal.line }}><I className="h-3.5 w-3.5" style={{ color: pal.c }} />{t}</div>
          ))}
        </div>
        <div className="mt-4 text-[10px] font-mono opacity-70">www.softwarewala.net</div>
      </div>
    </div>
  );

  return null;
}

/* ============ MAIN SLIDER ============ */

export function PremiumHeroSlider() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStart = useRef<number | null>(null);
  const N = slides.length;

  const go = (n: number) => setI(((n % N) + N) % N);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((v) => (v + 1) % N), 20000);
    return () => clearInterval(t);
  }, [paused, N]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(i + 1);
      else if (e.key === "ArrowLeft") go(i - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [i]);

  const s = slides[i];
  const pal = s.palette;

  return (
    <section
      className="relative rounded-[24px] overflow-hidden border shadow-2xl select-none"
      style={{
        borderColor: pal.line,
        background: `linear-gradient(135deg, ${pal.a} 0%, ${pal.b} 100%)`,
        color: pal.ink,
        minHeight: 510,
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => (touchStart.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchStart.current == null) return;
        const dx = e.changedTouches[0].clientX - touchStart.current;
        if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1));
        touchStart.current = null;
      }}
      aria-roledescription="carousel"
    >
      {/* Background pattern per slide */}
      <div key={`bg-${i}`} className="absolute inset-0 animate-rise">
        <Pattern id={s.patternId} ink={pal.ink} />
        <div
          className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full blur-3xl opacity-30"
          style={{ background: pal.c }}
        />
        <div
          className="absolute -right-40 -bottom-40 h-[520px] w-[520px] rounded-full blur-3xl opacity-20"
          style={{ background: pal.ink === "#0B1225" ? pal.b : pal.c }}
        />
      </div>

      <div className="relative grid lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-6 lg:gap-10 p-6 lg:p-8 min-h-[400px]">
        {/* LEFT — content */}
        <div key={`text-${i}`} className="flex flex-col justify-center animate-rise">
          <div
            className="inline-flex self-start items-center gap-2 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.24em] font-semibold border"
            style={{ background: pal.chipBg, color: pal.chipInk, borderColor: pal.line }}
          >
            <span className="h-1.5 w-1.5 rounded-full animate-blink" style={{ background: pal.c }} />
            {s.badge}
          </div>

          {s.eyebrow && (
            <div className="mt-3 text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: pal.c }}>
              {s.eyebrow}
            </div>
          )}

          <h1 className="mt-4 font-display text-[clamp(2rem,4.6vw,3.8rem)] leading-[1.02] font-extrabold tracking-tight" style={{ color: pal.ink }}>
            {s.title}
            {s.highlight && (
              <>
                <br />
                <span
                  className="inline-block"
                  style={{
                    background: `linear-gradient(90deg, ${pal.c}, ${pal.ink === "#0B1225" ? pal.b : "#ffffff"})`,
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  {s.highlight}
                </span>
              </>
            )}
          </h1>

          <p className="mt-4 text-[14px] lg:text-[15px] max-w-[540px] leading-relaxed" style={{ color: pal.sub }}>
            {s.sub}
          </p>

          <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 max-w-[560px]">
            {s.bullets.slice(0, 6).map((b) => (
              <li key={b} className="flex items-start gap-2 text-[12.5px]" style={{ color: pal.ink }}>
                <span className="mt-[3px] h-4 w-4 rounded-full grid place-items-center shrink-0" style={{ background: pal.c, color: pal.primaryInk }}>
                  <Check className="h-2.5 w-2.5" />
                </span>
                <span style={{ color: pal.sub }}>{b}</span>
              </li>
            ))}
          </ul>

          {s.stats && (
            <div className="mt-5 flex flex-wrap gap-6">
              {s.stats.map((k) => (
                <div key={k.label}>
                  <div className="text-2xl font-extrabold text-mono" style={{ color: pal.c }}>{k.value}</div>
                  <div className="text-[10px] uppercase tracking-widest" style={{ color: pal.sub }}>{k.label}</div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              className="h-12 px-6 rounded-xl font-semibold text-sm flex items-center gap-2 transition-transform hover:-translate-y-0.5 shadow-lg"
              style={{ background: pal.c, color: pal.primaryInk }}
            >
              {s.primaryCta} <ArrowRight className="h-4 w-4" />
            </button>
            <button
              className="h-12 px-6 rounded-xl font-semibold text-sm flex items-center gap-2 border backdrop-blur transition-colors"
              style={{ borderColor: pal.line, background: pal.chipBg, color: pal.ink }}
            >
              <Play className="h-4 w-4" style={{ color: pal.c }} /> {s.secondaryCta}
            </button>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px]" style={{ color: pal.sub }}>
            {s.trust.map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" style={{ color: pal.c }} /> {t}
              </span>
            ))}
          </div>
        </div>

        {/* RIGHT — scene */}
        <div className="relative hidden lg:block">
          <div key={`scene-${i}`} className="absolute inset-0 animate-rise">
            <Scene i={s.scene} pal={pal} />
          </div>
        </div>
      </div>

      {/* Arrow controls removed — auto-slide only */}


      {/* Dots + slide counter */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, k) => (
          <button
            key={k}
            onClick={() => go(k)}
            aria-label={`Go to slide ${k + 1}`}
            className="h-1.5 rounded-full transition-all"
            style={{
              width: k === i ? 32 : 10,
              background: k === i ? pal.c : pal.line,
            }}
          />
        ))}
      </div>
      <div className="absolute bottom-5 right-6 z-20 text-mono text-[11px] font-semibold px-2.5 py-1 rounded-full border" style={{ borderColor: pal.line, background: pal.chipBg, color: pal.ink }}>
        {String(i + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
      </div>
    </section>
  );
}

export default PremiumHeroSlider;