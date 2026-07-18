import { useEffect, useState } from "react";
import {
  Handshake, Network, Truck, Sparkles, Megaphone, PenTool, Code2,
  Wrench, TrendingUp, Cpu, GraduationCap, Briefcase, ArrowRight, Check,
  X, ChevronRight, ChevronLeft, Upload, Crown,
} from "lucide-react";

type FieldType = "text" | "email" | "tel" | "url" | "textarea" | "select" | "file" | "number";
type Field = { name: string; label: string; type?: FieldType; options?: string[]; optional?: boolean; full?: boolean };
type Step = { title: string; fields: Field[] };
type PartnerDef = {
  key: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: "primary" | "magenta" | "gold";
  desc: string;
  benefits: string[];
  requirements: string[];
  steps: Step[];
};

const COUNTRY = { name: "country", label: "Country", type: "text" as const };
const CITY = { name: "city", label: "City", type: "text" as const };
const EMAIL = { name: "email", label: "Email", type: "email" as const };
const PHONE = { name: "phone", label: "Phone", type: "tel" as const };
const MSG: Field = { name: "message", label: "Message", type: "textarea", optional: true, full: true };

const PARTNERS: PartnerDef[] = [
  {
    key: "reseller", title: "Reseller", icon: Handshake, tone: "primary",
    desc: "Sell 1,284+ vetted enterprise products with margins up to 40%.",
    benefits: ["Up to 40% margin", "Co-branded assets", "Dedicated partner manager", "Priority leads"],
    requirements: ["Active business", "Sales team", "1+ year experience"],
    steps: [
      { title: "Business", fields: [
        { name: "businessName", label: "Business Name" }, { name: "ownerName", label: "Owner Name" },
        COUNTRY, { name: "state", label: "State" }, CITY, { name: "website", label: "Website", type: "url", optional: true },
      ]},
      { title: "Operations", fields: [
        { name: "experience", label: "Business Experience (years)", type: "number" },
        { name: "industry", label: "Primary Industry" },
        { name: "customerBase", label: "Current Customer Base" },
        { name: "monthlySales", label: "Monthly Sales" },
        { name: "targetMarket", label: "Target Market" },
        { name: "languages", label: "Languages Spoken" },
      ]},
      { title: "Contact", fields: [
        EMAIL, PHONE, { name: "whatsapp", label: "WhatsApp", type: "tel", optional: true },
        { name: "gst", label: "GST / VAT", optional: true },
        { name: "registration", label: "Business Registration", optional: true },
        MSG,
      ]},
    ],
  },
  {
    key: "franchise", title: "Franchise Partner", icon: Network, tone: "gold",
    desc: "Own an exclusive Software Vala franchise in your region.",
    benefits: ["Exclusive territory", "Full playbook", "Marketing fund", "White-label products"],
    requirements: ["Office space", "Initial investment", "Local team"],
    steps: [
      { title: "Profile", fields: [
        { name: "businessProfile", label: "Business Profile", type: "textarea", full: true },
        { name: "investment", label: "Investment Capacity" },
        { name: "office", label: "Office Available", type: "select", options: ["Yes", "No", "Planning"] },
        { name: "team", label: "Existing Team Size", type: "number" },
      ]},
      { title: "Region", fields: [COUNTRY, { name: "state", label: "State" }, CITY,
        { name: "targetRegion", label: "Target Region" },
        { name: "experience", label: "Business Experience (years)", type: "number" },
        { name: "marketing", label: "Marketing Capability" }]},
      { title: "Contact", fields: [
        { name: "website", label: "Website", type: "url", optional: true }, EMAIL, PHONE, MSG,
      ]},
    ],
  },
  {
    key: "distributor", title: "Distributor", icon: Truck, tone: "primary",
    desc: "Distribute enterprise software across countries and channels.",
    benefits: ["Country exclusivity", "Volume pricing", "Marketing support", "Certified training"],
    requirements: ["Distribution network", "Sales team", "Warehouse (optional)"],
    steps: [
      { title: "Network", fields: [
        { name: "businessName", label: "Business Name" },
        { name: "network", label: "Distribution Network", type: "textarea", full: true },
        { name: "countries", label: "Countries Covered" },
        { name: "products", label: "Existing Products" },
      ]},
      { title: "Operations", fields: [
        { name: "salesTeam", label: "Sales Team Size", type: "number" },
        { name: "warehouse", label: "Warehouse Available", type: "select", options: ["Yes", "No"] },
        { name: "experience", label: "Business Experience (years)", type: "number" },
        { name: "website", label: "Website", type: "url", optional: true },
      ]},
      { title: "Contact", fields: [EMAIL, PHONE, MSG] },
    ],
  },
  {
    key: "affiliate", title: "Affiliate", icon: Sparkles, tone: "magenta",
    desc: "Earn commission on every referred customer — no cap.",
    benefits: ["Recurring commissions", "Real-time dashboard", "Ready-made creatives", "90-day cookie"],
    requirements: ["Active audience", "Content platform", "Traffic sources"],
    steps: [
      { title: "Identity", fields: [
        { name: "fullName", label: "Full Name" },
        { name: "website", label: "Website", type: "url", optional: true },
        { name: "blog", label: "Blog", type: "url", optional: true },
        { name: "youtube", label: "YouTube", type: "url", optional: true },
      ]},
      { title: "Channels", fields: [
        { name: "instagram", label: "Instagram", type: "url", optional: true },
        { name: "facebook", label: "Facebook", type: "url", optional: true },
        { name: "linkedin", label: "LinkedIn", type: "url", optional: true },
        { name: "audience", label: "Audience Size" },
        { name: "method", label: "Promotion Method" },
      ]},
      { title: "Contact", fields: [COUNTRY, EMAIL, PHONE, MSG] },
    ],
  },
  {
    key: "influencer", title: "Influencer", icon: Megaphone, tone: "magenta",
    desc: "Partner with Vala on premium software campaigns.",
    benefits: ["Paid campaigns", "Free licenses", "Product previews", "Featured spotlight"],
    requirements: ["Verified audience", "Original content", "Engagement metrics"],
    steps: [
      { title: "Identity", fields: [
        { name: "name", label: "Full Name" },
        { name: "socialLinks", label: "Social Links", type: "textarea", full: true },
      ]},
      { title: "Reach", fields: [
        { name: "followers", label: "Total Followers" },
        { name: "category", label: "Content Category" },
        { name: "reach", label: "Average Reach" },
        COUNTRY,
      ]},
      { title: "Contact", fields: [EMAIL, PHONE, MSG] },
    ],
  },
  {
    key: "author", title: "Software Author", icon: PenTool, tone: "gold",
    desc: "Publish your software on Vala and keep 70% of net revenue.",
    benefits: ["70% revenue share", "Global reach", "Payment processing", "Support & hosting"],
    requirements: ["Working product", "Documentation", "Demo URL"],
    steps: [
      { title: "Author", fields: [
        { name: "devName", label: "Developer Name" },
        { name: "company", label: "Company", optional: true },
        { name: "software", label: "Software Name" },
        { name: "category", label: "Category" },
      ]},
      { title: "Product", fields: [
        { name: "stack", label: "Technology Stack" },
        { name: "demo", label: "Demo URL", type: "url" },
        { name: "repo", label: "Git Repository", type: "url", optional: true },
        { name: "docs", label: "Documentation URL", type: "url" },
        { name: "license", label: "License Type" },
        { name: "version", label: "Version" },
      ]},
      { title: "Contact", fields: [COUNTRY, EMAIL, PHONE, MSG] },
    ],
  },
  {
    key: "developer", title: "Developer", icon: Code2, tone: "primary",
    desc: "Join the Vala engineering pool and ship products for enterprise clients.",
    benefits: ["Steady project pipeline", "Premium rates", "Async remote", "Enterprise clients"],
    requirements: ["3+ years experience", "Portfolio", "Communication skills"],
    steps: [
      { title: "Profile", fields: [
        { name: "fullName", label: "Full Name" },
        { name: "company", label: "Company", optional: true },
        { name: "experience", label: "Experience (years)", type: "number" },
        { name: "skills", label: "Primary Skills" },
      ]},
      { title: "Stack", fields: [
        { name: "languages", label: "Programming Languages" },
        { name: "frameworks", label: "Frameworks" },
        { name: "github", label: "GitHub", type: "url", optional: true },
        { name: "portfolio", label: "Portfolio", type: "url", optional: true },
        { name: "linkedin", label: "LinkedIn", type: "url", optional: true },
      ]},
      { title: "Contact", fields: [
        COUNTRY, CITY, EMAIL, PHONE,
        { name: "availability", label: "Availability", type: "select", options: ["Full-time", "Part-time", "Contract", "Weekends"] },
        { name: "partnership", label: "Expected Partnership" },
        MSG,
        { name: "resume", label: "Resume Upload", type: "file", optional: true },
        { name: "portfolioFile", label: "Portfolio Upload", type: "file", optional: true },
      ]},
    ],
  },
  {
    key: "implementation", title: "Implementation Partner", icon: Wrench, tone: "primary",
    desc: "Deploy and configure Vala software for enterprise customers.",
    benefits: ["Certified badge", "Project referrals", "Deep training", "Revenue share"],
    requirements: ["Technical team", "Deployment history", "Enterprise references"],
    steps: [
      { title: "Company", fields: [
        { name: "company", label: "Company Name" }, { name: "teamSize", label: "Team Size", type: "number" },
        { name: "specialties", label: "Specialties" }, { name: "clients", label: "Notable Clients", optional: true },
      ]},
      { title: "Region", fields: [COUNTRY, CITY, { name: "coverage", label: "Service Coverage" },
        { name: "website", label: "Website", type: "url", optional: true }]},
      { title: "Contact", fields: [EMAIL, PHONE, MSG] },
    ],
  },
  {
    key: "sales", title: "Sales Partner", icon: TrendingUp, tone: "gold",
    desc: "Bring qualified leads and close deals with full backing from Vala.",
    benefits: ["Commission per close", "Sales collateral", "Deal registration", "SDR support"],
    requirements: ["B2B sales background", "Network", "Track record"],
    steps: [
      { title: "Profile", fields: [
        { name: "fullName", label: "Full Name" }, { name: "company", label: "Company", optional: true },
        { name: "experience", label: "Sales Experience (years)", type: "number" },
        { name: "focus", label: "Vertical Focus" },
      ]},
      { title: "Region", fields: [COUNTRY, CITY, { name: "territory", label: "Territory" },
        { name: "linkedin", label: "LinkedIn", type: "url", optional: true }]},
      { title: "Contact", fields: [EMAIL, PHONE, MSG] },
    ],
  },
  {
    key: "technology", title: "Technology Partner", icon: Cpu, tone: "primary",
    desc: "Integrate your platform with Vala's ecosystem and reach 1,284+ customers.",
    benefits: ["Marketplace listing", "Co-marketing", "API partnership", "Joint roadmap"],
    requirements: ["Public API", "Production platform", "Technical documentation"],
    steps: [
      { title: "Platform", fields: [
        { name: "company", label: "Company Name" }, { name: "product", label: "Product Name" },
        { name: "category", label: "Category" }, { name: "website", label: "Website", type: "url" },
      ]},
      { title: "Integration", fields: [
        { name: "apiDocs", label: "API Documentation URL", type: "url" },
        { name: "useCases", label: "Integration Use Cases", type: "textarea", full: true },
      ]},
      { title: "Contact", fields: [COUNTRY, EMAIL, PHONE, MSG] },
    ],
  },
  {
    key: "training", title: "Training Partner", icon: GraduationCap, tone: "magenta",
    desc: "Deliver official Vala training and certifications in your region.",
    benefits: ["Official curriculum", "Trainer badge", "Revenue share", "Marketing support"],
    requirements: ["Training facility or online", "Certified trainers", "Track record"],
    steps: [
      { title: "Institute", fields: [
        { name: "instituteName", label: "Institute / Company Name" },
        { name: "trainers", label: "Number of Trainers", type: "number" },
        { name: "modes", label: "Training Modes", type: "select", options: ["Online", "In-person", "Hybrid"] },
        { name: "capacity", label: "Monthly Capacity" },
      ]},
      { title: "Region", fields: [COUNTRY, CITY,
        { name: "languages", label: "Languages" },
        { name: "website", label: "Website", type: "url", optional: true }]},
      { title: "Contact", fields: [EMAIL, PHONE, MSG] },
    ],
  },
  {
    key: "consultant", title: "Business Consultant", icon: Briefcase, tone: "gold",
    desc: "Advise clients on Vala software adoption and digital transformation.",
    benefits: ["Referral commission", "Advisor badge", "Deep discounts", "Direct expert access"],
    requirements: ["Consulting practice", "Business network", "Verifiable references"],
    steps: [
      { title: "Practice", fields: [
        { name: "fullName", label: "Full Name" }, { name: "firm", label: "Firm / Practice", optional: true },
        { name: "specialties", label: "Specialties" }, { name: "experience", label: "Experience (years)", type: "number" },
      ]},
      { title: "Reach", fields: [COUNTRY, CITY, { name: "clients", label: "Client Base" },
        { name: "linkedin", label: "LinkedIn", type: "url", optional: true }]},
      { title: "Contact", fields: [EMAIL, PHONE, MSG] },
    ],
  },
];

const TONE = {
  primary: { text: "text-primary", border: "border-primary/40", bg: "bg-primary/10", glow: "shadow-[0_0_40px_-10px_var(--color-primary)]" },
  magenta: { text: "text-magenta", border: "border-magenta/40", bg: "bg-magenta/10", glow: "shadow-[0_0_40px_-10px_var(--color-magenta)]" },
  gold:    { text: "text-gold",    border: "border-gold/40",    bg: "bg-gold/10",    glow: "shadow-[0_0_40px_-10px_var(--color-gold)]" },
};

export function BecomePartner() {
  const [active, setActive] = useState<PartnerDef | null>(null);

  return (
    <section className="relative">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-primary">
            <Crown className="h-3.5 w-3.5" /> Become a partner
          </span>
          <h2 className="mt-2 font-display text-2xl lg:text-3xl font-bold">Grow with Software Vala.</h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
            Twelve ways to build a business on the Vala ecosystem — from reselling to authoring, franchising to consulting. Every partner track ships with tooling, training and a dedicated partner manager.
          </p>
        </div>
        <div className="hidden md:flex text-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          <span className="px-3 py-1 rounded-full border border-border">12 partner tracks · 84 countries</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {PARTNERS.map((p) => <PartnerCard key={p.key} p={p} onApply={() => setActive(p)} />)}
      </div>

      {active && <ApplicationModal partner={active} onClose={() => setActive(null)} />}
    </section>
  );
}

function PartnerCard({ p, onApply }: { p: PartnerDef; onApply: () => void }) {
  const Icon = p.icon;
  const t = TONE[p.tone];
  return (
    <div className={`panel group relative overflow-hidden p-5 hover:-translate-y-1 transition-all duration-300 hover:${t.glow} border ${t.border}`}>
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-30" style={{ color: "currentColor" }} />
      <div className="flex items-center gap-3">
        <div className={`h-11 w-11 rounded-xl grid place-items-center ${t.bg} ${t.border} border ${t.text}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className={`text-[10px] uppercase tracking-[0.22em] ${t.text}`}>Partner track</div>
          <div className="font-display text-lg font-bold truncate">{p.title}</div>
        </div>
      </div>

      <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{p.desc}</p>

      <div className="mt-4 space-y-1.5">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground/80">Benefits</div>
        <ul className="space-y-1">
          {p.benefits.slice(0, 3).map((b) => (
            <li key={b} className="flex items-center gap-2 text-xs">
              <Check className={`h-3 w-3 ${t.text} shrink-0`} /> <span className="truncate">{b}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-3 space-y-1.5">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground/80">Requirements</div>
        <ul className="flex flex-wrap gap-1">
          {p.requirements.map((r) => (
            <li key={r} className="text-[10px] px-2 py-0.5 rounded-full border border-border text-muted-foreground">{r}</li>
          ))}
        </ul>
      </div>

      <button
        onClick={onApply}
        className={`mt-5 h-10 w-full rounded-xl ${t.bg} ${t.border} border ${t.text} text-xs font-semibold hover:bg-opacity-100 transition-all flex items-center justify-center gap-1.5 group-hover:gap-3`}
      >
        Apply as {p.title} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </button>
    </div>
  );
}

/* ============ Multi-step form modal ============ */

function ApplicationModal({ partner, onClose }: { partner: PartnerDef; onClose: () => void }) {
  const draftKey = `sv-partner-draft-${partner.key}`;
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(draftKey) || "null");
      if (saved) setData(saved);
    } catch { /* noop */ }
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [draftKey, onClose]);

  const t = TONE[partner.tone];
  const steps = partner.steps;
  const cur = steps[step];
  const pct = ((step + 1) / (steps.length + 1)) * 100;

  function saveDraft(next: Record<string, string>) {
    try { localStorage.setItem(draftKey, JSON.stringify(next)); } catch { /* noop */ }
  }

  function setValue(name: string, val: string) {
    const next = { ...data, [name]: val };
    setData(next); saveDraft(next);
    if (errors[name]) setErrors((e) => { const c = { ...e }; delete c[name]; return c; });
  }

  function validateStep(): boolean {
    const e: Record<string, string> = {};
    for (const f of cur.fields) {
      if (f.optional || f.type === "file") continue;
      const v = (data[f.name] || "").trim();
      if (!v) { e[f.name] = "Required"; continue; }
      if (f.type === "email" && !/^\S+@\S+\.\S+$/.test(v)) e[f.name] = "Invalid email";
      if (f.type === "url" && !/^https?:\/\//i.test(v)) e[f.name] = "Include https://";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (!validateStep()) return;
    if (step < steps.length - 1) setStep(step + 1);
    else { setSubmitted(true); try { localStorage.removeItem(draftKey); } catch { /* noop */ } }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-rise" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[90vh] rounded-2xl border border-border bg-panel shadow-[var(--shadow-card-hover)] overflow-hidden flex flex-col">
        {/* Header */}
        <div className={`relative p-5 border-b border-border ${t.bg}`}>
          <button onClick={onClose} className="absolute right-4 top-4 h-8 w-8 rounded-lg hover:bg-background/40 grid place-items-center" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-3">
            <div className={`h-11 w-11 rounded-xl grid place-items-center bg-background/40 ${t.border} border ${t.text}`}>
              <partner.icon className="h-5 w-5" />
            </div>
            <div>
              <div className={`text-[10px] uppercase tracking-[0.22em] ${t.text}`}>Apply as</div>
              <div className="font-display text-xl font-bold">{partner.title}</div>
            </div>
          </div>
          {/* Progress */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">
              <span>Step {submitted ? steps.length + 1 : step + 1} of {steps.length + 1}</span>
              <span>{submitted ? "Complete" : cur.title}</span>
            </div>
            <div className="h-1 rounded-full bg-background/40 overflow-hidden">
              <div className={`h-full ${partner.tone === "gold" ? "bg-gold" : partner.tone === "magenta" ? "bg-magenta" : "bg-primary"} transition-all`} style={{ width: `${submitted ? 100 : pct}%` }} />
            </div>
            <div className="mt-3 flex gap-2">
              {steps.map((s, i) => (
                <button
                  key={s.title}
                  onClick={() => !submitted && i <= step && setStep(i)}
                  disabled={submitted || i > step}
                  className={`flex-1 text-[10px] uppercase tracking-widest py-1 rounded-md transition-colors ${
                    i === step && !submitted ? `${t.bg} ${t.text}` : i < step || submitted ? "text-muted-foreground" : "text-muted-foreground/40"
                  }`}
                >
                  {i < step || submitted ? "✓ " : ""}{s.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {submitted ? (
            <SuccessScreen partner={partner} onClose={onClose} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {cur.fields.map((f) => (
                <FieldInput
                  key={f.name}
                  field={f}
                  value={data[f.name] || ""}
                  error={errors[f.name]}
                  tone={partner.tone}
                  onChange={(v) => setValue(f.name, v)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {!submitted && (
          <div className="border-t border-border p-4 flex items-center justify-between gap-3 bg-background/40">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Draft saved automatically
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => step > 0 ? setStep(step - 1) : onClose()}
                className="h-10 px-4 rounded-xl border border-border hover:bg-panel-elevated text-xs font-semibold flex items-center gap-1.5"
              >
                <ChevronLeft className="h-3.5 w-3.5" /> {step > 0 ? "Back" : "Cancel"}
              </button>
              <button
                onClick={next}
                className={`h-10 px-5 rounded-xl ${partner.tone === "gold" ? "bg-gold text-background" : partner.tone === "magenta" ? "bg-magenta text-background" : "bg-primary text-primary-foreground"} text-xs font-semibold flex items-center gap-1.5 hover:opacity-90 glow-primary`}
              >
                {step < steps.length - 1 ? "Continue" : "Submit application"} <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FieldInput({
  field, value, error, tone, onChange,
}: {
  field: Field; value: string; error?: string; tone: "primary" | "magenta" | "gold";
  onChange: (v: string) => void;
}) {
  const t = TONE[tone];
  const [focused, setFocused] = useState(false);
  const floating = focused || value.length > 0;
  const wrapperCls = `relative rounded-xl border ${error ? "border-destructive" : focused ? t.border : "border-border"} bg-background/60 transition-colors ${field.full ? "md:col-span-2" : ""}`;

  if (field.type === "file") {
    return (
      <label className={`${wrapperCls} h-[52px] flex items-center gap-3 px-3.5 cursor-pointer hover:bg-background/80`}>
        <Upload className={`h-4 w-4 ${t.text}`} />
        <div className="flex-1 min-w-0">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{field.label}{field.optional && " (optional)"}</div>
          <div className="text-xs truncate">{value || "Click to upload…"}</div>
        </div>
        <input type="file" className="hidden" onChange={(e) => onChange(e.target.files?.[0]?.name || "")} />
      </label>
    );
  }

  const commonProps = {
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => onChange(e.target.value),
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    className: "w-full bg-transparent text-sm focus:outline-none",
  };

  return (
    <div className={wrapperCls}>
      <label
        className={`absolute left-3.5 pointer-events-none transition-all ${
          floating ? `top-1.5 text-[10px] uppercase tracking-widest ${error ? "text-destructive" : t.text}` : "top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
        }`}
      >
        {field.label}{field.optional && !floating && " (optional)"}
      </label>
      {field.type === "textarea" ? (
        <textarea {...commonProps} rows={3} className="w-full bg-transparent text-sm focus:outline-none pt-6 pb-2 px-3.5 resize-none" />
      ) : field.type === "select" ? (
        <select {...commonProps} className="w-full bg-transparent text-sm focus:outline-none pt-6 pb-2 px-3.5 appearance-none">
          <option value="" />
          {field.options?.map((o) => <option key={o} value={o} className="bg-panel">{o}</option>)}
        </select>
      ) : (
        <input {...commonProps} type={field.type || "text"} className="w-full bg-transparent text-sm focus:outline-none pt-6 pb-2 px-3.5" />
      )}
      {error && <div className="absolute -bottom-4 left-1 text-[10px] text-destructive">{error}</div>}
    </div>
  );
}

function SuccessScreen({ partner, onClose }: { partner: PartnerDef; onClose: () => void }) {
  const t = TONE[partner.tone];
  return (
    <div className="py-6 text-center">
      <div className={`mx-auto h-16 w-16 rounded-full ${t.bg} ${t.border} border grid place-items-center ${t.text} mb-4`}>
        <Check className="h-7 w-7" />
      </div>
      <h3 className="font-display text-2xl font-bold">Application received</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
        Thanks for applying to the <span className={t.text}>{partner.title}</span> track. Our partner team reviews applications within 48 hours and will reach out with the next steps.
      </p>
      <div className="mt-6 grid grid-cols-3 gap-2 max-w-md mx-auto text-left">
        {["Review", "Interview", "Onboarding"].map((s, i) => (
          <div key={s} className={`panel p-3 border ${i === 0 ? t.border : "border-border"}`}>
            <div className={`text-[10px] uppercase tracking-widest ${i === 0 ? t.text : "text-muted-foreground"}`}>Step {i + 1}</div>
            <div className="text-xs font-semibold mt-0.5">{s}</div>
          </div>
        ))}
      </div>
      <button onClick={onClose} className="mt-6 h-10 px-5 rounded-xl border border-border hover:bg-panel-elevated text-xs font-semibold">
        Close
      </button>
    </div>
  );
}