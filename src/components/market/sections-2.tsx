import { useState } from "react";
import {
  ArrowRight, Play, Star, Trophy, Crown, Sparkles, Users, KeyRound,
  Award, Globe2, ChevronDown, Plus, ShoppingBag, Handshake, Network,
  PenTool, GraduationCap, Calendar, Headphones, MessageSquareText,
  Mail, ArrowUpRight, Twitter, Facebook, Linkedin, Youtube, Github,
} from "lucide-react";

/* ============ SECTION 12 — GLOBAL MAP ============ */

const mapNodes = [
  { x: 18, y: 38, label: "NYC", v: "$8.2M", s: 14, t: "primary" },
  { x: 47, y: 32, label: "LON", v: "$11.8M", s: 16, t: "gold" },
  { x: 51, y: 34, label: "PAR", v: "$3.2M", s: 11, t: "primary" },
  { x: 55, y: 30, label: "BER", v: "$2.6M", s: 10, t: "primary" },
  { x: 62, y: 42, label: "DXB", v: "$1.9M", s: 11, t: "magenta" },
  { x: 70, y: 47, label: "BLR", v: "$6.4M", s: 14, t: "gold" },
  { x: 72, y: 41, label: "DEL", v: "$3.1M", s: 11, t: "primary" },
  { x: 82, y: 39, label: "TYO", v: "$4.8M", s: 12, t: "primary" },
  { x: 84, y: 56, label: "SYD", v: "$2.2M", s: 10, t: "primary" },
  { x: 80, y: 47, label: "SGP", v: "$1.6M", s: 9, t: "magenta" },
  { x: 32, y: 64, label: "SAO", v: "$1.1M", s: 9, t: "primary" },
  { x: 24, y: 56, label: "MEX", v: "$0.8M", s: 8, t: "primary" },
  { x: 14, y: 64, label: "LIM", v: "$0.4M", s: 7, t: "primary" },
];

const mapFilters = ["Customers", "Revenue", "Licenses", "Resellers", "Vendors", "Franchises"];

export function GlobalMap() {
  const [active, setActive] = useState(1);
  return (
    <section className="relative rounded-[22px] overflow-hidden border border-border"
             style={{ backgroundImage: "var(--gradient-hero), var(--gradient-panel)" }}>
      <div className="p-6 lg:p-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-primary">
            <Globe2 className="h-3.5 w-3.5" /> Global ecosystem
          </span>
          <h2 className="mt-2 font-display text-2xl lg:text-4xl font-bold tracking-tight">142 countries. <span className="text-primary">One marketplace.</span></h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-xl">Live customer density, revenue and partner footprint across the planet — updating in real time.</p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-border bg-panel/60 p-1">
          {mapFilters.map((f, i) => (
            <button key={f} onClick={() => setActive(i)}
                    className={`px-3 h-8 rounded-lg text-xs transition-colors ${
                      i === active ? "bg-primary/15 text-primary border border-primary/40" : "text-muted-foreground hover:text-foreground"
                    }`}>{f}</button>
          ))}
        </div>
      </div>

      <div className="relative h-[420px] lg:h-[520px] mx-6 lg:mx-8 mb-6 lg:mb-8 rounded-2xl border border-border bg-background/40 overflow-hidden">
        {/* grid */}
        <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none" viewBox="0 0 100 100">
          {Array.from({ length: 11 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 10} x2="100" y2={i * 10} stroke="var(--color-grid)" strokeWidth="0.1" />
          ))}
          {Array.from({ length: 21 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 5} y1="0" x2={i * 5} y2="100" stroke="var(--color-grid)" strokeWidth="0.1" />
          ))}
          <g fill="oklch(0.20 0.05 270 / 0.7)" stroke="oklch(0.85 0.16 220 / 0.4)" strokeWidth="0.15">
            <path d="M10,30 Q15,22 25,24 T40,28 L42,42 Q38,52 28,54 T15,48 Z" />
            <path d="M44,26 Q52,20 60,24 T70,28 L72,40 Q66,46 56,46 T46,42 Z" />
            <path d="M62,40 Q72,38 80,42 T90,52 L86,62 Q78,66 70,60 T62,52 Z" />
            <path d="M78,52 Q86,52 90,58 L88,66 Q82,68 78,62 Z" />
            <path d="M20,52 Q28,52 34,60 L34,76 Q28,82 22,76 T16,64 Z" />
          </g>
        </svg>
        {/* arcs */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {[[18,38,47,32],[47,32,70,47],[70,47,82,39],[18,38,32,64],[47,32,62,42],[82,39,84,56],[70,47,80,47]].map(([x1,y1,x2,y2],i)=>(
            <path key={i}
              d={`M${x1},${y1} Q${(x1+x2)/2},${Math.min(y1,y2)-12} ${x2},${y2}`}
              stroke="oklch(0.85 0.16 220 / 0.5)" strokeWidth="0.18" fill="none" strokeDasharray="0.6 0.6" />
          ))}
        </svg>
        {mapNodes.map((n, i) => {
          const color =
            n.t === "gold" ? "bg-gold" :
            n.t === "magenta" ? "bg-magenta" : "bg-primary";
          return (
            <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer" style={{ left: `${n.x}%`, top: `${n.y}%` }}>
              <span className={`absolute inset-0 rounded-full ${color} animate-pulse-ring`} style={{ width: n.s, height: n.s }} />
              <span className={`block rounded-full ${color}`} style={{ width: n.s, height: n.s, boxShadow: "0 0 16px currentColor" }} />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-mono text-[10px] bg-popover border border-border rounded-md px-2 py-1.5 shadow-lg z-10">
                <div className="font-bold text-foreground">{n.label}</div>
                <div className="text-muted-foreground">{n.v} · 24h</div>
              </div>
            </div>
          );
        })}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-mono text-[10px]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-gold" /> Top region</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" /> Active</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-magenta" /> Growth</span>
          </div>
          <span className="text-muted-foreground hidden md:inline">Heatmap density · log scale · live · 1.4s</span>
        </div>
      </div>
    </section>
  );
}

/* ============ SECTION 13 — SUCCESS STORIES ============ */

const stories = [
  { who: "Acme Manufacturing",  role: "Customer",  quote: "Cut MRP cycle from 6 days to 4 hours.",    metric: "+38%", metricSub: "throughput", color: "primary" },
  { who: "Helios Pvt Ltd",      role: "Reseller",  quote: "Crossed $1M ARR in 9 months.",             metric: "$1M",  metricSub: "first-year ARR", color: "gold" },
  { who: "BrightLabs",          role: "Vendor",    quote: "Reached 184k customers without ads.",      metric: "184k", metricSub: "new customers", color: "magenta" },
  { who: "Mumbai Vala HQ",      role: "Franchise", quote: "Outsold 7 regions in our first quarter.",  metric: "#1",   metricSub: "regional rank", color: "primary" },
];

export function SuccessStories() {
  return (
    <section>
      <Header title="Success stories" sub="Real customers · real partners · real numbers" action="All case studies" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {stories.map((s) => {
          const c =
            s.color === "gold" ? "text-gold border-gold/40" :
            s.color === "magenta" ? "text-magenta border-magenta/40" : "text-primary border-primary/40";
          return (
            <article key={s.who} className={`relative rounded-[18px] overflow-hidden border ${c} bg-panel hover:-translate-y-2 hover:shadow-[var(--shadow-card-hover)] transition-all`}>
              <div className="relative h-40 overflow-hidden">
                <div className="absolute inset-0" style={{
                  background: s.color === "gold" ? "var(--gradient-gold)"
                            : s.color === "magenta" ? "linear-gradient(135deg, var(--color-magenta), var(--color-primary))"
                            : "var(--gradient-primary)"
                }} />
                <div className="absolute inset-0 bg-black/20" />
                <button className="absolute inset-0 grid place-items-center group">
                  <span className="h-14 w-14 rounded-full bg-background/80 backdrop-blur grid place-items-center border border-white/30 group-hover:scale-110 transition-transform">
                    <Play className="h-5 w-5 text-foreground ml-0.5" />
                  </span>
                </button>
                <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-black/40 backdrop-blur text-white">{s.role}</span>
              </div>
              <div className="p-4">
                <div className="text-sm font-semibold">{s.who}</div>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">"{s.quote}"</p>
                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <div className={`text-mono text-xl font-bold ${c.split(" ")[0]}`}>{s.metric}</div>
                    <div className="text-[10px] text-muted-foreground">{s.metricSub}</div>
                  </div>
                  <ArrowUpRight className={`h-4 w-4 ${c.split(" ")[0]}`} />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

/* ============ SECTION 14 — AWARDS WALL ============ */

const awards = [
  { title: "Best Product · 2026",   name: "VALA ERP Cloud",      icon: Trophy, t: "gold" },
  { title: "Best Vendor",           name: "BrightLabs Studio",   icon: Crown,  t: "magenta" },
  { title: "Best Reseller",         name: "Helios Pvt Ltd",      icon: Award,  t: "primary" },
  { title: "Best Territory",        name: "London · UK",         icon: Globe2, t: "gold" },
  { title: "Global Champion",       name: "Mumbai HQ",           icon: Star,   t: "primary" },
];

export function AwardsWall() {
  return (
    <section className="relative rounded-[22px] overflow-hidden border border-gold/30 p-6 lg:p-10"
             style={{ backgroundImage: "radial-gradient(70% 60% at 50% 0%, oklch(0.86 0.17 95 / 0.18), transparent 60%), var(--gradient-panel)" }}>
      <div className="text-center mb-6">
        <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-gold">
          <Trophy className="h-3.5 w-3.5" /> Awards & champions
        </span>
        <h2 className="mt-2 font-display text-2xl lg:text-4xl font-bold tracking-tight">
          The <span className="text-gold">Vala Champions</span> · 2026
        </h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {awards.map((a) => {
          const I = a.icon;
          const c =
            a.t === "gold" ? "text-gold border-gold/40 bg-gold/5" :
            a.t === "magenta" ? "text-magenta border-magenta/40 bg-magenta/5" :
            "text-primary border-primary/40 bg-primary/5";
          return (
            <div key={a.title} className={`relative rounded-[18px] border p-5 ${c} text-center overflow-hidden hover:-translate-y-1 transition-transform`}>
              <I className={`h-10 w-10 mx-auto ${c.split(" ")[0]}`} />
              <div className="mt-3 text-[10px] uppercase tracking-wider text-muted-foreground">{a.title}</div>
              <div className="mt-1 text-sm font-bold text-foreground">{a.name}</div>
              <Trophy className="absolute -right-3 -bottom-3 h-16 w-16 opacity-10" />
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ============ SECTION 15 — LIVE ACTIVITY FEED ============ */

const events = [
  { t: "now",   k: "License activated",   d: "Acme Corp · 250 seats · VALA ERP",   tone: "primary",   icon: KeyRound },
  { t: "1s",    k: "New customer",        d: "Maria Iwata · TYO · School ERP+",     tone: "magenta",   icon: Users },
  { t: "4s",    k: "Order completed",     d: "$8,420 · Helios Pvt · BLR",            tone: "success",   icon: ShoppingBag },
  { t: "9s",    k: "Renewal completed",   d: "$1,200 ARR · 24 months",               tone: "success",   icon: Sparkles },
  { t: "12s",   k: "Vendor approved",     d: "BrightLabs Studio · APAC",             tone: "primary",   icon: ShoppingBag },
  { t: "18s",   k: "Reseller approved",   d: "Verdant Sales · EU",                   tone: "gold",      icon: Handshake },
  { t: "22s",   k: "New product live",    d: "Vala Copilot 1.2 · AI Zone",           tone: "magenta",   icon: Plus },
  { t: "28s",   k: "License activated",   d: "Northwind · 80 seats · CRM Pro",        tone: "primary",   icon: KeyRound },
];

export function LiveFeed() {
  return (
    <section>
      <Header title="Live activity" sub="The marketplace, in real time" action="Open activity wall" />
      <div className="panel p-2 max-h-[420px] overflow-y-auto">
        <ul className="space-y-1.5">
          {events.map((e, i) => {
            const I = e.icon;
            const c =
              e.tone === "gold" ? "text-gold border-gold/30" :
              e.tone === "magenta" ? "text-magenta border-magenta/30" :
              e.tone === "success" ? "text-success border-success/30" :
              "text-primary border-primary/30";
            return (
              <li key={i} className={`flex items-center gap-3 rounded-lg border ${c} bg-background/30 px-3 py-2.5 hover:translate-x-1 transition-transform`}>
                <div className={`h-8 w-8 rounded-md grid place-items-center ${c.split(" ")[0]} bg-current/10`}>
                  <I className={`h-4 w-4 ${c.split(" ")[0]}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold">{e.k}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{e.d}</div>
                </div>
                <span className="text-mono text-[10px] text-muted-foreground">{e.t}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ============ SECTION 16 — VALA TV ============ */

const videos = [
  { title: "VALA ERP · 5 min tour",          length: "5:24", views: "184k", tag: "Tour",     color: "primary" },
  { title: "CRM Pro masterclass",            length: "28:10", views: "92k", tag: "Tutorial", color: "magenta" },
  { title: "Hospital ERP live demo",         length: "12:48", views: "48k", tag: "Demo",     color: "gold" },
  { title: "Vala Summit · Keynote 2026",     length: "1:04:22", views: "284k", tag: "Event", color: "magenta" },
];

export function ValaTV() {
  return (
    <section>
      <Header title="VALA TV" sub="Tutorials · live demos · summits · training" action="Open video library" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {videos.map((v, i) => (
          <article key={v.title} className="group rounded-[18px] overflow-hidden border border-border bg-panel hover:-translate-y-2 hover:shadow-[var(--shadow-card-hover)] transition-all">
            <div className="relative h-40 overflow-hidden">
              <div className="absolute inset-0" style={{
                background: v.color === "gold" ? "var(--gradient-gold)"
                          : v.color === "magenta" ? "linear-gradient(135deg, var(--color-magenta), var(--color-primary))"
                          : "var(--gradient-primary)"
              }} />
              <div className="absolute inset-0 bg-black/30 grid place-items-center">
                <span className="h-12 w-12 rounded-full bg-background/80 backdrop-blur grid place-items-center group-hover:scale-110 transition-transform">
                  <Play className="h-5 w-5 ml-0.5" />
                </span>
              </div>
              <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-black/40 backdrop-blur text-white">{v.tag}</span>
              <span className="absolute bottom-3 right-3 text-mono text-[10px] px-1.5 py-0.5 rounded bg-black/60 text-white">{v.length}</span>
            </div>
            <div className="p-4">
              <div className="text-sm font-semibold line-clamp-2">{v.title}</div>
              <div className="text-[11px] text-muted-foreground mt-1">{v.views} views</div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ============ SECTION 17 — ACADEMY ============ */

const courses = [
  { name: "Vala Certified Admin",      level: "Foundation", hours: "12h", students: "8,420",  color: "primary" },
  { name: "ERP Implementation Expert", level: "Advanced",   hours: "28h", students: "2,184",  color: "magenta" },
  { name: "CRM Sales Engineer",        level: "Intermediate", hours: "18h", students: "4,210", color: "gold" },
];

export function Academy() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-1 panel p-6 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full opacity-20 blur-3xl" style={{ background: "var(--gradient-primary)" }} />
        <GraduationCap className="h-8 w-8 text-primary" />
        <h3 className="mt-3 font-display text-xl font-bold">Vala Academy</h3>
        <p className="mt-1 text-sm text-muted-foreground">Certifications recognized by 1,284 hiring partners. Self-paced or live cohorts.</p>
        <div className="mt-4 grid grid-cols-3 gap-2 text-mono text-xs">
          <Mini label="Courses" value="48" />
          <Mini label="Certs" value="12" />
          <Mini label="Students" value="38k" />
        </div>
        <button className="mt-5 w-full h-11 rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground text-sm font-semibold flex items-center justify-center gap-2 glow-primary">
          Enter Academy <ArrowRight className="h-4 w-4" />
        </button>
      </div>
      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
        {courses.map((c) => (
          <article key={c.name} className="rounded-[18px] border border-border bg-panel p-5 relative overflow-hidden hover:-translate-y-1 transition-transform">
            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-20 blur-2xl" style={{ background: c.color === "gold" ? "var(--color-gold)" : c.color === "magenta" ? "var(--color-magenta)" : "var(--color-primary)" }} />
            <div className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded inline-block ${
              c.color === "gold" ? "bg-gold/15 text-gold" : c.color === "magenta" ? "bg-magenta/15 text-magenta" : "bg-primary/15 text-primary"
            }`}>{c.level}</div>
            <h4 className="mt-3 text-sm font-bold">{c.name}</h4>
            <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {c.hours}</span>
              <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {c.students}</span>
            </div>
            <button className="mt-4 w-full h-9 rounded-lg border border-primary/30 text-primary text-xs font-semibold hover:bg-primary/10">Enroll</button>
          </article>
        ))}
      </div>
    </section>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-border bg-background/40 p-2 text-center">
      <div className="text-base font-bold">{value}</div>
      <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

/* ============ SECTION 18 — PARTNER ECOSYSTEM (recap row) ============ */

const partners = [
  { k: "Reseller",  count: "1,284", icon: Handshake,  t: "primary" },
  { k: "Vendor",    count: "284",   icon: ShoppingBag, t: "magenta" },
  { k: "Franchise", count: "62",    icon: Network,    t: "gold" },
  { k: "Author",    count: "412",   icon: PenTool,    t: "primary" },
  { k: "Affiliate", count: "2,418", icon: Sparkles,   t: "magenta" },
];

export function PartnerEcosystem() {
  return (
    <section>
      <Header title="Partner ecosystem" sub="One platform · five ways to grow with Vala" />
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {partners.map((p) => {
          const I = p.icon;
          const c =
            p.t === "gold" ? "text-gold border-gold/40" :
            p.t === "magenta" ? "text-magenta border-magenta/40" :
            "text-primary border-primary/40";
          return (
            <div key={p.k} className={`panel border ${c} p-5 text-center hover:-translate-y-1 transition-transform`}>
              <I className={`h-7 w-7 mx-auto ${c.split(" ")[0]}`} />
              <div className={`mt-2 text-mono text-xl font-bold ${c.split(" ")[0]}`}>{p.count}</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{p.k}s</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ============ SECTION 19 — FAQ ============ */

const faqs = [
  { q: "Is Software Vala an Enterprise Marketplace or a SaaS company?",
    a: "Both. Vala publishes its own enterprise suite (ERP, CRM, HRMS, etc.) and operates a curated marketplace where vetted third-party vendors and authors list certified extensions." },
  { q: "How does licensing work — monthly, annual or lifetime?",
    a: "Every product supports monthly and annual subscriptions. Selected products offer lifetime deals. Licenses are floating, audited and instantly transferable." },
  { q: "What support comes with my purchase?",
    a: "All paid plans include priority support with an SLA of <60 min first response. Enterprise plans include a dedicated TAM and 24/7 incident bridge." },
  { q: "Can I become a Reseller / Vendor / Franchise?",
    a: "Yes. Apply from the Quick Action cards above. Approvals usually within 48h. Resellers earn up to 40%, vendors keep 70% of net revenue." },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-1">
        <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-primary">
          <MessageSquareText className="h-3.5 w-3.5" /> FAQ
        </span>
        <h2 className="mt-2 font-display text-2xl lg:text-3xl font-bold">Questions, answered.</h2>
        <p className="mt-2 text-sm text-muted-foreground">Enterprise · Marketplace · Licensing. Still unsure? Talk to a Vala specialist.</p>
        <button className="mt-4 h-10 px-4 rounded-xl border border-primary/40 text-primary text-xs font-semibold hover:bg-primary/10 flex items-center gap-2">
          <Headphones className="h-4 w-4" /> Talk to sales
        </button>
      </div>
      <div className="lg:col-span-2 space-y-2">
        {faqs.map((f, i) => (
          <div key={i} className="panel overflow-hidden">
            <button onClick={() => setOpen(open === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-primary/5">
              <span className="text-sm font-semibold pr-4">{f.q}</span>
              <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open === i ? "rotate-180 text-primary" : ""}`} />
            </button>
            {open === i && (
              <div className="px-4 pb-4 text-sm text-muted-foreground animate-rise border-t border-border/50 pt-3">
                {f.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============ SECTION 20 — FINAL CTA ============ */

export function FinalCTA() {
  return (
    <section className="relative rounded-[22px] overflow-hidden border border-primary/40 p-8 lg:p-14 text-center"
             style={{ backgroundImage: "radial-gradient(80% 100% at 50% 0%, oklch(0.85 0.16 220 / 0.25), transparent 60%), radial-gradient(80% 100% at 50% 100%, oklch(0.70 0.24 305 / 0.25), transparent 60%), var(--gradient-panel)" }}>
      <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-primary">
        <Sparkles className="h-3.5 w-3.5" /> Start with Vala
      </span>
      <h2 className="mt-3 font-display text-3xl lg:text-5xl font-bold tracking-tight max-w-3xl mx-auto">
        Run your entire business on{" "}
        <span style={{ background: "var(--gradient-primary)", WebkitBackgroundClip: "text", color: "transparent" }}>one premium marketplace</span>.
      </h2>
      <p className="mt-4 text-sm lg:text-base text-muted-foreground max-w-xl mx-auto">
        Explore products, book a demo, become a partner — or just talk to a specialist. We're here.
      </p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <button className="h-12 px-6 rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground font-semibold text-sm flex items-center gap-2 glow-primary hover:opacity-90">
          Explore marketplace <ArrowRight className="h-4 w-4" />
        </button>
        <button className="h-12 px-6 rounded-xl border border-border bg-panel/60 hover:border-primary/60 text-sm font-medium flex items-center gap-2">
          <Play className="h-4 w-4 text-primary" /> Book a demo
        </button>
        <button className="h-12 px-6 rounded-xl border border-gold/40 bg-gold/10 text-gold text-sm font-medium flex items-center gap-2 hover:bg-gold/20">
          <Crown className="h-4 w-4" /> Become a partner
        </button>
        <button className="h-12 px-6 rounded-xl border border-border bg-panel/60 hover:border-primary/60 text-sm font-medium flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" /> Contact team
        </button>
      </div>
    </section>
  );
}

/* ============ FOOTER ============ */

const footerCols = [
  { h: "Marketplace", links: ["All software", "Featured", "Trending", "Top rated", "Best sellers", "New releases", "Lifetime deals"] },
  { h: "Industries",  links: ["Education", "Healthcare", "Retail", "Manufacturing", "Hotel", "Transport", "Finance"] },
  { h: "Resources",   links: ["Downloads", "Events", "VALA TV", "Academy", "API docs", "Changelog", "Status"] },
  { h: "Company",     links: ["About", "Careers", "Press", "Brand", "Partners", "Investors", "Contact"] },
  { h: "Legal",       links: ["Terms", "Privacy", "Cookies", "DPA", "Licensing", "SLA", "Compliance"] },
];

export function Footer() {
  return (
    <footer className="rounded-[22px] border border-border bg-panel p-8 lg:p-10 mt-2">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
        <div className="col-span-2 md:col-span-3 lg:col-span-1">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-[image:var(--gradient-primary)] grid place-items-center">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-[0.24em] text-muted-foreground">Software</div>
              <div className="font-display text-base font-bold">VALA<span className="text-primary">.</span></div>
            </div>
          </div>
          <p className="mt-4 text-xs text-muted-foreground max-w-xs">The premium enterprise marketplace. 1,284 products. 142 countries. One platform.</p>
          <div className="mt-4 flex items-center gap-2">
            {[Twitter, Linkedin, Youtube, Facebook, Github].map((Icon, i) => (
              <a key={i} className="h-9 w-9 rounded-md border border-border bg-background/40 grid place-items-center hover:border-primary/40 hover:text-primary cursor-pointer">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        {footerCols.map((c) => (
          <div key={c.h}>
            <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-3">{c.h}</div>
            <ul className="space-y-2 text-sm">
              {c.links.map((l) => (
                <li key={l}><a className="text-foreground/80 hover:text-primary cursor-pointer">{l}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-8 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-3 text-mono text-[10px] text-muted-foreground">
        <span>© 2026 Software Vala. All rights reserved.</span>
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-blink" /> ALL SYSTEMS OPERATIONAL · status.vala.app
        </span>
      </div>
    </footer>
  );
}

function Header({ title, sub, action }: { title: string; sub?: string; action?: string }) {
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
