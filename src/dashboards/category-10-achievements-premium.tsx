import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import * as Icons from "lucide-react";
import type { DashSpec } from "@/data/dashboards";
import {
  Pill, Bars, LineSeries, Heatmap, Spark,
  DataTable, ProgressBar, Avatar, StatusDot, WorldMap, Timeline,
} from "./_primitives";
import {
  ChartCard, AIInsights, DashboardToolbar, Modal, TabBar, FilterBar,
  QuickActions, EmptyState, useDashboardState, useTabs,
} from "./_universal";

/* ============================================================
   CATEGORY 10 — Achievement Management System (AMS)
   Single premium "Universal Gamification Center" dashboard
   covering all 25 sections from the SVN AMS spec.
   ============================================================ */

const grid = "grid grid-cols-12 gap-4";

function Header({ d, right }: { d: DashSpec; right?: React.ReactNode }) {
  const Icon = (Icons as never as Record<string, Icons.LucideIcon>)[d.icon] || Icons.Trophy;
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 animate-fade-up">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/40 via-primary/20 to-warning/20 border border-border grid place-items-center text-accent shadow-[0_0_24px_-8px_var(--color-accent)]">
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            SVN · Achievement Management System
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Universal Gamification Center</h1>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs flex-wrap">
        {["XP", "Badges", "Trophies", "Ranks", "Leaderboards"].map((t) => (
          <span key={t} className="px-2 py-1 rounded-md bg-muted border border-border">{t}</span>
        ))}
        {right}
      </div>
    </header>
  );
}

type Kpi = { label: string; value: string; delta?: string; tone?: "success" | "warning" | "destructive" | "info" };
function Kpis({ items }: { items: Kpi[] }) {
  const map = { success: "text-success", warning: "text-warning", destructive: "text-destructive", info: "text-info" };
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-3">
      {items.map((m, i) => (
        <div key={i} className="glass rounded-xl p-3 card-hover animate-fade-up">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{m.label}</span>
            {m.delta && <span className={`text-[10px] ${map[m.tone || "info"]}`}>{m.delta}</span>}
          </div>
          <div className="mt-1 text-xl font-semibold tabular-nums tracking-tight">{m.value}</div>
          <div className={`mt-1 ${map[m.tone || "info"]}`}><Spark seed={i + 11} height={22} /></div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Master flow strip ---------- */
function MasterFlow() {
  const steps = [
    { k: "Activity", i: "Activity" },
    { k: "XP", i: "Zap" },
    { k: "Achievement", i: "Target" },
    { k: "Badge", i: "BadgeCheck" },
    { k: "Level", i: "ChevronsUp" },
    { k: "Rank", i: "Crown" },
    { k: "Reward", i: "Gift" },
    { k: "Trophy", i: "Trophy" },
    { k: "Leaderboard", i: "BarChart3" },
  ];
  return (
    <ChartCard title="Master Flow" subtitle="Activity → XP → Achievement → Reward → Trophy → Leaderboard">
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {steps.map((s, i) => {
          const Icon = (Icons as never as Record<string, Icons.LucideIcon>)[s.i] || Icons.Circle;
          return (
            <div key={s.k} className="flex items-center gap-1 shrink-0">
              <div className="px-2.5 py-1.5 rounded-md bg-gradient-to-br from-accent/15 to-primary/10 border border-accent/30 text-[11px] inline-flex items-center gap-1.5">
                <Icon className="w-3.5 h-3.5 text-accent" />{s.k}
              </div>
              {i < steps.length - 1 && <Icons.ChevronRight className="w-3 h-3 text-muted-foreground" />}
            </div>
          );
        })}
      </div>
    </ChartCard>
  );
}

/* ---------- Reusable: Rank pill ---------- */
const RANKS = [
  { k: "Starter", c: "text-muted-foreground", b: "bg-muted" },
  { k: "Bronze", c: "text-amber-700", b: "bg-amber-700/15" },
  { k: "Silver", c: "text-slate-300", b: "bg-slate-300/15" },
  { k: "Gold", c: "text-warning", b: "bg-warning/15" },
  { k: "Platinum", c: "text-info", b: "bg-info/15" },
  { k: "Diamond", c: "text-accent", b: "bg-accent/15" },
  { k: "Titan", c: "text-primary", b: "bg-primary/15" },
  { k: "Legend", c: "text-destructive", b: "bg-destructive/15" },
  { k: "Champion", c: "text-success", b: "bg-success/15" },
  { k: "Global Champion", c: "text-accent", b: "bg-accent/25" },
];

/* ====================================================================
   TABS
   ==================================================================== */
type Tab =
  | "source-map"
  | "command"
  | "library"
  | "xp-levels"
  | "ranks-trophies"
  | "badges-rewards"
  | "certificates"
  | "leaderboards"
  | "hall-of-fame"
  | "challenges-missions"
  | "engine";

const SPEC_ROLES = [
  "Boss", "CEO", "Admin", "Developer", "Author", "Vendor", "Vendor Manager", "Reseller",
  "Reseller Manager", "Franchise", "Franchise Manager", "Affiliate", "Support", "Marketing", "Finance", "Customer",
];

const SPEC_TABLES = [
  "achievements", "achievement_categories", "achievement_rules", "achievement_logs", "xp_transactions", "levels",
  "ranks", "badges", "trophies", "reward_store", "reward_transactions", "leaderboards", "missions",
  "challenges", "certificates", "celebrations", "achievement_audit_logs",
];

const SPEC_MODULES = [
  { no: "01", title: "Achievement Command Center", tab: "Command", icon: "Activity", status: "UI connected", items: ["Total Achievements", "Unlocked Today", "Pending Rewards", "Top Achievers", "Leaderboard Status", "Global Ranking"] },
  { no: "02", title: "Achievement Library", tab: "Library", icon: "Library", status: "UI connected", items: ["Create", "Edit", "Delete", "Clone", "Archive"] },
  { no: "03", title: "XP Management", tab: "XP & Levels", icon: "Zap", status: "UI connected", items: ["Revenue XP", "Sales XP", "Support XP", "Development XP", "Training XP", "Customer XP", "Renewal XP", "Marketplace XP"] },
  { no: "04", title: "Level Management", tab: "XP & Levels", icon: "ChevronsUp", status: "UI connected", items: ["Level 1", "Level 1000+", "Custom XP Rules", "Level Rewards", "Level Benefits"] },
  { no: "05", title: "Rank Management", tab: "Ranks & Trophies", icon: "Crown", status: "UI connected", items: ["Starter", "Bronze", "Silver", "Gold", "Platinum", "Diamond", "Titan", "Legend", "Champion", "Global Champion", "Role Specific Ranks"] },
  { no: "06", title: "Trophy Management", tab: "Ranks & Trophies", icon: "Trophy", status: "UI connected", items: ["First Login", "First Customer", "First Sale", "First Revenue", "First Renewal", "Top Seller", "Top Developer", "Top Vendor", "Top Reseller", "Top Franchise", "Global Champion"] },
  { no: "07", title: "Badge Management", tab: "Badges & Rewards", icon: "BadgeCheck", status: "UI connected", items: ["Achievement", "Revenue", "Support", "Developer", "Customer", "Training", "Leadership"] },
  { no: "08", title: "Reward Management", tab: "Badges & Rewards", icon: "Gift", status: "UI connected", items: ["Points", "Wallet Credit", "Commission Bonus", "Discount Coupons", "Premium Access", "Feature Unlocks", "Priority Leads", "Special Permissions"] },
  { no: "09", title: "Certificate Management", tab: "Certificates", icon: "Award", status: "UI connected", items: ["Training", "Developer", "Vendor", "Reseller", "Franchise", "Champion"] },
  { no: "10", title: "Leaderboard Center", tab: "Leaderboards", icon: "BarChart3", status: "UI connected", items: ["Global", "Country", "State", "City", "Territory", "Department", "Role Based"] },
  { no: "11", title: "Hall of Fame", tab: "Hall of Fame", icon: "Trophy", status: "UI connected", items: ["Top Developers", "Top Vendors", "Top Resellers", "Top Franchises", "Top Customers", "Top Territories", "Top Revenue"] },
  { no: "12", title: "Challenge Center", tab: "Challenges & Missions", icon: "Target", status: "UI connected", items: ["Daily", "Weekly", "Monthly", "Quarterly", "Yearly"] },
  { no: "13", title: "Mission Center", tab: "Challenges & Missions", icon: "Rocket", status: "UI connected", items: ["Sales", "Revenue", "Training", "Support", "Development", "Growth"] },
  { no: "14", title: "Reward Store", tab: "Badges & Rewards", icon: "ShoppingBag", status: "UI connected", items: ["Redeem XP", "Redeem Points", "Unlock Features", "Unlock Themes", "Unlock Frames", "Unlock Effects"] },
  { no: "15", title: "Profile Customization", tab: "Badges & Rewards", icon: "Frame", status: "UI connected", items: ["Champion Frame", "Diamond Frame", "Legend Frame", "Titan Frame", "Country Frame", "Territory Frame"] },
  { no: "16", title: "Celebration Engine", tab: "Command", icon: "PartyPopper", status: "UI connected", items: ["Achievement Unlock", "Level Up", "Rank Up", "Revenue Milestone", "Champion Status", "Global Champion"] },
  { no: "17", title: "Animation Management", tab: "Engine & AI", icon: "Clapperboard", status: "UI connected", items: ["Trophy", "Badge", "Rank", "XP", "Reward", "Celebration"] },
  { no: "18", title: "Sound Management", tab: "Engine & AI", icon: "Volume2", status: "UI connected", items: ["Off by default", "Achievement", "Trophy", "Rank Up", "Champion", "Reward"] },
  { no: "19", title: "Role Reward Rules", tab: "Engine & AI", icon: "UserCog", status: "UI connected", items: ["Developer", "Reseller", "Vendor", "Franchise", "Customer"] },
  { no: "20", title: "AI Achievement Engine", tab: "Engine & AI", icon: "Brain", status: "UI connected", items: ["Suggest Achievements", "Detect Milestones", "Predict Champions", "Recommend Rewards", "Generate Challenges"] },
  { no: "21", title: "Trophy Room", tab: "Ranks & Trophies", icon: "Sparkles", status: "UI connected", items: ["3D Gallery", "Glass Showcase", "Animated Rotation", "Achievement Timeline"] },
  { no: "22", title: "Achievement Timeline", tab: "Command", icon: "Clock3", status: "UI connected", items: ["Achievement Earned", "Reward Earned", "Level Increased", "Rank Increased", "Certificate Earned"] },
  { no: "23", title: "Global Leaderboard Map", tab: "Leaderboards", icon: "Map", status: "UI connected", items: ["Top Countries", "Top States", "Top Cities", "Top Territories", "Top Users"] },
  { no: "24", title: "Recognition Center", tab: "Hall of Fame", icon: "Medal", status: "UI connected", items: ["Employee Of Month", "Developer Of Month", "Reseller Of Month", "Vendor Of Month", "Franchise Of Month", "Customer Of Month"] },
  { no: "25", title: "Audit Center", tab: "Library", icon: "ShieldCheck", status: "UI connected", items: ["Who Earned", "When Earned", "Why Earned", "Reward Issued", "Reward Redeemed"] },
];

const TAB_LOOKUP: Record<string, Tab> = {
  Command: "command",
  Library: "library",
  "XP & Levels": "xp-levels",
  "Ranks & Trophies": "ranks-trophies",
  "Badges & Rewards": "badges-rewards",
  Certificates: "certificates",
  Leaderboards: "leaderboards",
  "Hall of Fame": "hall-of-fame",
  "Challenges & Missions": "challenges-missions",
  "Engine & AI": "engine",
};

const TAB_ICONS: Record<string, Icons.LucideIcon> = {
  Command: Icons.Activity,
  Library: Icons.Library,
  "XP & Levels": Icons.Zap,
  "Ranks & Trophies": Icons.Crown,
  "Badges & Rewards": Icons.BadgeCheck,
  Certificates: Icons.Award,
  Leaderboards: Icons.BarChart3,
  "Hall of Fame": Icons.Trophy,
  "Challenges & Missions": Icons.Target,
  "Engine & AI": Icons.Cpu,
};

function TabSourceMap({ filter, onOpenTab }: { filter: string; onOpenTab: (tab: Tab) => void }) {
  const tabLookup = TAB_LOOKUP;
  const [lastJump, setLastJump] = useState<string | null>(null);

  const jump = (tabLabel: string) => {
    const target = tabLookup[tabLabel];
    if (!target) return;
    setLastJump(tabLabel);
    onOpenTab(target);
    requestAnimationFrame(() => {
      const el = document.getElementById("ams-tab-content");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const modules = SPEC_MODULES.filter((m) =>
    [m.no, m.title, m.tab, m.status, ...m.items].join(" ").toLowerCase().includes(filter.toLowerCase()),
  );

  const coverage = Math.round((SPEC_MODULES.filter((m) => m.status === "UI connected").length / SPEC_MODULES.length) * 100);

  const moduleCountByTab: Record<string, number> = SPEC_MODULES.reduce((acc, m) => {
    acc[m.tab] = (acc[m.tab] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className={grid}>
      <ChartCard title="Source Code → AMS UI Connection" subtitle="Real mapping from your Figma copy-code/spec" className="col-span-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            ["Spec modules", "25/25", "Screen mapped"],
            ["Supported roles", SPEC_ROLES.length.toString(), "Role chips connected"],
            ["Source tables", SPEC_TABLES.length.toString(), "Schema list only"],
            ["UI coverage", `${coverage}%`, "Buttons wired below"],
          ].map(([label, value, note]) => (
            <div key={label} className="rounded-lg border border-border bg-card/40 p-3">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
              <div className="mt-1 text-2xl font-semibold tabular-nums">{value}</div>
              <div className="mt-1 text-[11px] text-muted-foreground">{note}</div>
            </div>
          ))}
        </div>
        {lastJump && (
          <div className="mt-4 rounded-lg border border-success/30 bg-success/10 px-3 py-2 text-xs text-success inline-flex items-center gap-2">
            <Icons.CheckCircle2 className="w-3.5 h-3.5" />
            Opened <span className="font-semibold">{lastJump}</span>. Use the tab bar above to return to Source Map.
          </div>
        )}
      </ChartCard>

      <ChartCard title="Quick Jump · 10 Module Groups" subtitle="One click opens the matching UI tab and scrolls into view" className="col-span-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {Object.keys(tabLookup).map((label) => {
            const Icon = TAB_ICONS[label] || Icons.Box;
            const active = lastJump === label;
            return (
              <button
                key={label}
                onClick={() => jump(label)}
                className={`group rounded-lg border p-3 text-left transition-colors ${active ? "border-primary/60 bg-primary/10" : "border-border bg-card/40 hover:bg-primary/10 hover:border-primary/40"}`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-md border border-accent/30 bg-accent/10 grid place-items-center shrink-0">
                    <Icon className="w-4 h-4 text-accent" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold truncate">{label}</div>
                    <div className="text-[10px] text-muted-foreground">{moduleCountByTab[label] ?? 0} modules</div>
                  </div>
                  <Icons.ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary" />
                </div>
              </button>
            );
          })}
        </div>
      </ChartCard>

      <ChartCard title="Universal Rule" subtitle="Any module · any role · any activity can trigger the gamification chain" className="col-span-12 lg:col-span-7">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {["Any Module", "Any Role", "Any Activity", "Achievement", "XP", "Level", "Rank", "Reward", "Badge", "Trophy"].map((r, i) => {
            const Icon = [Icons.LayoutGrid, Icons.Users, Icons.Activity, Icons.Target, Icons.Zap, Icons.ChevronsUp, Icons.Crown, Icons.Gift, Icons.BadgeCheck, Icons.Trophy][i] || Icons.Circle;
            return (
              <div key={r} className="rounded-md border border-border bg-card/40 p-2.5 flex items-center gap-2">
                <Icon className="w-4 h-4 text-accent" />
                <span className="text-xs font-medium">{r}</span>
              </div>
            );
          })}
        </div>
      </ChartCard>

      <ChartCard title="Supported Roles" subtitle="Complete role list from the source spec" className="col-span-12 lg:col-span-5">
        <div className="flex flex-wrap gap-1.5">
          {SPEC_ROLES.map((role) => (
            <span key={role} className="px-2 py-1 rounded-md border border-border bg-muted/50 text-[11px]">{role}</span>
          ))}
        </div>
      </ChartCard>

      <ChartCard title="25 Module Coverage Map" subtitle="Click Open to jump to the connected UI tab" className="col-span-12 lg:col-span-8">
        {modules.length === 0 ? (
          <EmptyState icon="SearchX" title="No source modules match this filter" hint="Clear the filter to see all 25 AMS modules." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {modules.map((m) => {
              const Icon = (Icons as never as Record<string, Icons.LucideIcon>)[m.icon] || Icons.Box;
              return (
                <div key={m.no} className="rounded-lg border border-border bg-card/40 p-3">
                  <div className="flex items-start gap-2">
                    <div className="w-9 h-9 rounded-md border border-accent/30 bg-accent/10 grid place-items-center shrink-0">
                      <Icon className="w-4 h-4 text-accent" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-muted-foreground">{m.no}</span>
                        <h3 className="text-xs font-semibold truncate">{m.title}</h3>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {m.items.slice(0, 5).map((it) => (
                          <span key={it} className="px-1.5 py-0.5 rounded bg-muted text-[10px] text-muted-foreground">{it}</span>
                        ))}
                        {m.items.length > 5 && <span className="px-1.5 py-0.5 rounded bg-muted text-[10px] text-muted-foreground">+{m.items.length - 5}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-success inline-flex items-center gap-1"><Icons.CheckCircle2 className="w-3 h-3" /> {m.status}</span>
                    <button onClick={() => jump(m.tab)} className="px-2 py-1 rounded-md bg-primary/15 text-primary border border-primary/30 text-[11px] hover:bg-primary/25 inline-flex items-center gap-1">
                      <Icons.ArrowRight className="w-3 h-3" />

                      Open {m.tab}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ChartCard>

      <ChartCard title="Database Tables From Source" subtitle="Listed from spec; backend connection is still pending" className="col-span-12 lg:col-span-4">
        <div className="space-y-1.5 max-h-[520px] overflow-y-auto pr-1">
          {SPEC_TABLES.map((table) => (
            <div key={table} className="flex items-center gap-2 rounded-md border border-border bg-card/40 p-2">
              <Icons.Database className="w-3.5 h-3.5 text-info" />
              <code className="text-[11px] text-info flex-1">{table}</code>
              <span className="text-[10px] text-warning">pending</span>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  );
}

/* ---------- Tab: Hall of Fame (11, 24) ---------- */
const HOF_CATS = [
  "Top Developers", "Top Vendors", "Top Resellers", "Top Franchises",
  "Top Customers", "Top Territories", "Top Revenue",
] as const;
type HofCat = typeof HOF_CATS[number];

const HOF_RANKS = ["All Ranks", "Champion", "Diamond", "Platinum", "Gold", "Silver"] as const;
type HofRank = typeof HOF_RANKS[number];

const HOF_DATA: Record<HofCat, { n: string; meta: string; v: string; rank: HofRank; delta: string; icon: string; region: string }[]> = {
  "Top Developers": [
    { n: "Sofia Garcia", meta: "Core Platform · Madrid", v: "1.24M XP", rank: "Champion", delta: "+12.4%", icon: "Code2", region: "EU" },
    { n: "Mateo Rossi", meta: "AI Infra · Milan", v: "984k XP", rank: "Diamond", delta: "+8.1%", icon: "Code2", region: "EU" },
    { n: "Yuki Sato", meta: "Payments · Tokyo", v: "812k XP", rank: "Diamond", delta: "+5.6%", icon: "Code2", region: "APAC" },
    { n: "Noah Becker", meta: "Security · Berlin", v: "742k XP", rank: "Platinum", delta: "+4.2%", icon: "Code2", region: "EU" },
    { n: "Linh Pham", meta: "Mobile · Saigon", v: "648k XP", rank: "Platinum", delta: "+9.3%", icon: "Code2", region: "APAC" },
    { n: "Ravi Kumar", meta: "Data · Bengaluru", v: "612k XP", rank: "Gold", delta: "+3.1%", icon: "Code2", region: "APAC" },
  ],
  "Top Vendors": [
    { n: "Kenji Tanaka", meta: "Vala Studio · Osaka", v: "$48.2M GMV", rank: "Champion", delta: "+22.8%", icon: "Store", region: "APAC" },
    { n: "Amara Okafor", meta: "Aurora Goods · Lagos", v: "$31.4M GMV", rank: "Diamond", delta: "+18.2%", icon: "Store", region: "AFR" },
    { n: "Lucia Romano", meta: "Tessera · Rome", v: "$24.8M GMV", rank: "Diamond", delta: "+12.0%", icon: "Store", region: "EU" },
    { n: "Jin Park", meta: "Hanok Mart · Seoul", v: "$19.2M GMV", rank: "Platinum", delta: "+9.8%", icon: "Store", region: "APAC" },
    { n: "Diego Alvarez", meta: "Andes Co. · Lima", v: "$14.6M GMV", rank: "Gold", delta: "+6.4%", icon: "Store", region: "LATAM" },
  ],
  "Top Resellers": [
    { n: "Aarav Mehta", meta: "Mehta Partners · Mumbai", v: "$28.4M rev", rank: "Champion", delta: "+34.1%", icon: "Briefcase", region: "APAC" },
    { n: "Olivia Brown", meta: "Northwind · London", v: "$22.1M rev", rank: "Diamond", delta: "+19.4%", icon: "Briefcase", region: "EU" },
    { n: "Chen Wei", meta: "Pacific Link · Shanghai", v: "$18.9M rev", rank: "Diamond", delta: "+15.0%", icon: "Briefcase", region: "APAC" },
    { n: "Hannah Klein", meta: "Vossberg · Munich", v: "$12.6M rev", rank: "Platinum", delta: "+8.2%", icon: "Briefcase", region: "EU" },
    { n: "Marco Silva", meta: "Atlantica · Lisbon", v: "$9.4M rev", rank: "Gold", delta: "+5.7%", icon: "Briefcase", region: "EU" },
  ],
  "Top Franchises": [
    { n: "Lagos Hub", meta: "West Africa Region", v: "+218% growth", rank: "Champion", delta: "+218%", icon: "Building2", region: "AFR" },
    { n: "Mumbai Central", meta: "South Asia Region", v: "+184% growth", rank: "Diamond", delta: "+184%", icon: "Building2", region: "APAC" },
    { n: "São Paulo Sur", meta: "LATAM Region", v: "+142% growth", rank: "Diamond", delta: "+142%", icon: "Building2", region: "LATAM" },
    { n: "Berlin Mitte", meta: "EU Region", v: "+108% growth", rank: "Platinum", delta: "+108%", icon: "Building2", region: "EU" },
    { n: "Dubai Marina", meta: "MENA Region", v: "+96% growth", rank: "Gold", delta: "+96%", icon: "Building2", region: "MENA" },
  ],
  "Top Customers": [
    { n: "Priya Shah", meta: "Vala+ · Member since 2021", v: "412 referrals", rank: "Champion", delta: "+62", icon: "User", region: "APAC" },
    { n: "Daniel Müller", meta: "Vala+ · Berlin", v: "318 referrals", rank: "Diamond", delta: "+44", icon: "User", region: "EU" },
    { n: "Aisha Karim", meta: "Vala · Dubai", v: "264 referrals", rank: "Diamond", delta: "+38", icon: "User", region: "MENA" },
    { n: "Camille Dubois", meta: "Vala · Paris", v: "198 referrals", rank: "Platinum", delta: "+22", icon: "User", region: "EU" },
    { n: "Tom Wilson", meta: "Vala · Sydney", v: "146 referrals", rank: "Gold", delta: "+18", icon: "User", region: "APAC" },
  ],
  "Top Territories": [
    { n: "Bangalore Tech Corridor", meta: "IN · APAC", v: "$84.2M rev", rank: "Champion", delta: "+28%", icon: "MapPin", region: "APAC" },
    { n: "Greater Tokyo", meta: "JP · APAC", v: "$72.8M rev", rank: "Diamond", delta: "+18%", icon: "MapPin", region: "APAC" },
    { n: "Rhine-Ruhr", meta: "DE · EU", v: "$58.4M rev", rank: "Diamond", delta: "+14%", icon: "MapPin", region: "EU" },
    { n: "Bay Area", meta: "US · NA", v: "$52.1M rev", rank: "Platinum", delta: "+11%", icon: "MapPin", region: "NA" },
    { n: "Greater São Paulo", meta: "BR · LATAM", v: "$38.6M rev", rank: "Gold", delta: "+9%", icon: "MapPin", region: "LATAM" },
  ],
  "Top Revenue": [
    { n: "Aarav Mehta", meta: "Reseller · Mumbai", v: "$28.4M", rank: "Champion", delta: "+34%", icon: "TrendingUp", region: "APAC" },
    { n: "Kenji Tanaka", meta: "Vendor · Osaka", v: "$48.2M", rank: "Champion", delta: "+22%", icon: "TrendingUp", region: "APAC" },
    { n: "Lagos Hub", meta: "Franchise · NG", v: "$36.8M", rank: "Diamond", delta: "+218%", icon: "TrendingUp", region: "AFR" },
    { n: "Amara Okafor", meta: "Vendor · Lagos", v: "$31.4M", rank: "Diamond", delta: "+18%", icon: "TrendingUp", region: "AFR" },
    { n: "Olivia Brown", meta: "Reseller · London", v: "$22.1M", rank: "Diamond", delta: "+19%", icon: "TrendingUp", region: "EU" },
  ],
};

type HofRow = typeof HOF_DATA[HofCat][number] & { cat: HofCat };

/* ---------- Inductee Detail Drawer ---------- */
function InducteeDrawer({
  inductee, open, onClose, followed, onToggleFollow, compareList, onToggleCompare,
}: {
  inductee: HofRow | null;
  open: boolean;
  onClose: () => void;
  followed: Set<string>;
  onToggleFollow: (name: string) => void;
  compareList: string[];
  onToggleCompare: (name: string) => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open, onClose]);

  if (!open || !inductee || typeof document === "undefined") return null;
  const Icon = (Icons as never as Record<string, Icons.LucideIcon>)[inductee.icon] || Icons.Trophy;
  const isFollowed = followed.has(inductee.n);
  const isCompared = compareList.includes(inductee.n);

  // Synthesized profile / contribution data from row signals
  const seed = inductee.n.length;
  const xpBreakdown = [
    { l: "Quests & Missions", pct: 38 + (seed % 6), c: "var(--color-primary)" },
    { l: "Achievements", pct: 24 + (seed % 5), c: "var(--color-accent)" },
    { l: "Referrals", pct: 16 + (seed % 4), c: "var(--color-success)" },
    { l: "Community", pct: 12 + (seed % 3), c: "var(--color-info)" },
    { l: "Bonus / Events", pct: 8 + (seed % 3), c: "var(--color-warning)" },
  ];
  const awards = [
    { y: "2026 Q2", t: `${inductee.cat.replace("Top ", "")} of the Quarter`, k: inductee.rank },
    { y: "2026 Q1", t: "Champion Tier Promotion", k: "Diamond → Champion" },
    { y: "2025 Q4", t: "Top 10 Global Inductee", k: inductee.region },
    { y: "2025 Q3", t: "100k XP Milestone", k: "Level Up" },
    { y: "2025 Q2", t: "First Induction", k: "Gold tier" },
  ];
  const badges = [
    { n: "Centurion", i: "Shield", tone: "text-accent" },
    { n: "Trailblazer", i: "Flame", tone: "text-warning" },
    { n: "Mentor", i: "GraduationCap", tone: "text-primary" },
    { n: "Streak 30", i: "Zap", tone: "text-success" },
    { n: "Global", i: "Globe2", tone: "text-info" },
    { n: "Verified", i: "BadgeCheck", tone: "text-accent" },
  ];

  return createPortal(
    <div className="fixed inset-0 z-50 flex animate-fade-up">
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={onClose} />
      <aside
        role="dialog"
        aria-label={`${inductee.n} — Inductee profile`}
        className="relative ml-auto h-full w-full sm:max-w-md md:max-w-lg glass border-l border-border shadow-2xl flex flex-col"
      >
        {/* Header */}
        <header className="p-5 border-b border-border">
          <div className="flex items-start gap-3">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent/40 via-primary/20 to-warning/20 border border-border grid place-items-center shrink-0">
              <Icon className="w-7 h-7 text-accent" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{inductee.cat}</div>
              <h3 className="text-base font-semibold truncate">{inductee.n}</h3>
              <div className="text-[11px] text-muted-foreground truncate">{inductee.meta}</div>
              <div className="mt-2 flex flex-wrap gap-1.5 text-[10px]">
                <span className="px-2 py-0.5 rounded-full bg-warning/15 text-warning border border-warning/30 inline-flex items-center gap-1">
                  <Icons.Crown className="w-3 h-3" /> {inductee.rank}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30">{inductee.region}</span>
                <span className="px-2 py-0.5 rounded-full bg-success/15 text-success border border-success/30 inline-flex items-center gap-1">
                  <Icons.TrendingUp className="w-3 h-3" /> {inductee.delta}
                </span>
              </div>
            </div>
            <button onClick={onClose} aria-label="Close" className="w-8 h-8 grid place-items-center rounded hover:bg-muted">
              <Icons.X className="w-4 h-4" />
            </button>
          </div>

          {/* Headline metric */}
          <div className="mt-4 rounded-lg border border-border bg-card/40 p-3 flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Score</div>
              <div className="text-xl font-bold tabular-nums">{inductee.v}</div>
            </div>
            <Spark seed={seed + 3} height={32} />
          </div>
        </header>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Profile facts */}
          <section>
            <h4 className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Profile</h4>
            <dl className="grid grid-cols-2 gap-2 text-[11px]">
              {[
                ["Member since", "Mar 2021"],
                ["Total XP", inductee.v.includes("XP") ? inductee.v : "1.04M XP"],
                ["Level", `${42 + (seed % 18)}`],
                ["Streak", `${21 + (seed % 60)} days`],
                ["Tier history", "Gold → Plat → Diamond → Champion"],
                ["Next milestone", "Legendary (+248k XP)"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-md border border-border bg-card/40 p-2">
                  <dt className="text-muted-foreground text-[10px]">{k}</dt>
                  <dd className="font-medium truncate">{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* XP Contribution */}
          <section>
            <h4 className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">XP Contribution</h4>
            <div className="space-y-2">
              {xpBreakdown.map((x) => (
                <div key={x.l} className="text-[11px]">
                  <div className="flex justify-between mb-1">
                    <span className="text-muted-foreground">{x.l}</span>
                    <span className="tabular-nums">{x.pct}%</span>
                  </div>
                  <ProgressBar value={x.pct} color={x.c} />
                </div>
              ))}
            </div>
          </section>

          {/* Badges */}
          <section>
            <h4 className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Badges</h4>
            <div className="grid grid-cols-3 gap-2">
              {badges.map((b) => {
                const BI = (Icons as never as Record<string, Icons.LucideIcon>)[b.i] || Icons.Award;
                return (
                  <div key={b.n} className="rounded-lg border border-border bg-card/40 p-2.5 text-center">
                    <BI className={`w-5 h-5 mx-auto mb-1 ${b.tone}`} />
                    <div className="text-[10px] font-medium truncate">{b.n}</div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Awards History */}
          <section>
            <h4 className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Awards History</h4>
            <ul className="space-y-1.5">
              {awards.map((a, i) => (
                <li key={i} className="flex items-start gap-2 rounded-md border border-border bg-card/40 p-2 text-[11px]">
                  <Icons.Trophy className="w-3.5 h-3.5 mt-0.5 text-warning shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">{a.t}</div>
                    <div className="text-[10px] text-muted-foreground">{a.k}</div>
                  </div>
                  <span className="text-[10px] text-muted-foreground tabular-nums shrink-0">{a.y}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Footer actions */}
        <footer className="p-4 border-t border-border flex items-center gap-2">
          <button
            onClick={() => onToggleFollow(inductee.n)}
            aria-pressed={isFollowed}
            className={`flex-1 px-3 py-2 rounded-md text-xs font-medium inline-flex items-center justify-center gap-1.5 border transition-colors focus-ring ${
              isFollowed
                ? "bg-success/15 text-success border-success/40 hover:bg-success/25"
                : "bg-primary/10 text-primary border-primary/30 hover:bg-primary/20"
            }`}
          >
            {isFollowed ? <Icons.Check className="w-3.5 h-3.5" /> : <Icons.UserPlus className="w-3.5 h-3.5" />}
            {isFollowed ? "Following" : "Follow"}
          </button>
          <button
            onClick={() => onToggleCompare(inductee.n)}
            aria-pressed={isCompared}
            className={`flex-1 px-3 py-2 rounded-md text-xs font-medium inline-flex items-center justify-center gap-1.5 border transition-colors focus-ring ${
              isCompared
                ? "bg-accent/15 text-accent border-accent/40 hover:bg-accent/25"
                : "bg-muted text-foreground border-border hover:bg-muted/70"
            }`}
          >
            <Icons.GitCompare className="w-3.5 h-3.5" />
            {isCompared ? "In Compare" : "Compare"}
          </button>
          <button
            onClick={onClose}
            className="px-3 py-2 rounded-md text-xs font-medium border border-border bg-card hover:bg-muted"
          >
            Close
          </button>
        </footer>
      </aside>
    </div>,
    document.body,
  );
}

/* ---------- Compare Drawer ---------- */
function findInductee(name: string): HofRow | undefined {
  for (const cat of HOF_CATS) {
    const row = HOF_DATA[cat].find((r) => r.n === name);
    if (row) return { ...row, cat };
  }
  return undefined;
}

function CompareDrawer({
  left, right, open, onClose, followed, onToggleFollow, compareList, onToggleCompare,
}: {
  left: HofRow; right: HofRow; open: boolean; onClose: () => void;
  followed: Set<string>; onToggleFollow: (name: string) => void;
  compareList: string[]; onToggleCompare: (name: string) => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  const cols = [left, right] as const;

  const getProfile = (inductee: HofRow) => {
    const seed = inductee.n.length;
    return {
      xpBreakdown: [
        { l: "Quests & Missions", pct: 38 + (seed % 6), c: "var(--color-primary)" },
        { l: "Achievements", pct: 24 + (seed % 5), c: "var(--color-accent)" },
        { l: "Referrals", pct: 16 + (seed % 4), c: "var(--color-success)" },
        { l: "Community", pct: 12 + (seed % 3), c: "var(--color-info)" },
        { l: "Bonus / Events", pct: 8 + (seed % 3), c: "var(--color-warning)" },
      ],
      awards: [
        { y: "2026 Q2", t: `${inductee.cat.replace("Top ", "")} of the Quarter`, k: inductee.rank },
        { y: "2026 Q1", t: "Champion Tier Promotion", k: "Diamond → Champion" },
        { y: "2025 Q4", t: "Top 10 Global Inductee", k: inductee.region },
        { y: "2025 Q3", t: "100k XP Milestone", k: "Level Up" },
        { y: "2025 Q2", t: "First Induction", k: "Gold tier" },
      ],
      badges: [
        { n: "Centurion", i: "Shield", tone: "text-accent" },
        { n: "Trailblazer", i: "Flame", tone: "text-warning" },
        { n: "Mentor", i: "GraduationCap", tone: "text-primary" },
        { n: "Streak 30", i: "Zap", tone: "text-success" },
        { n: "Global", i: "Globe2", tone: "text-info" },
        { n: "Verified", i: "BadgeCheck", tone: "text-accent" },
      ],
    };
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex animate-fade-up">
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={onClose} />
      <aside
        role="dialog"
        aria-label="Compare inductees"
        className="relative mx-auto my-6 h-[calc(100vh-3rem)] w-full max-w-5xl glass border border-border shadow-2xl flex flex-col rounded-xl overflow-hidden"
      >
        {/* Header */}
        <header className="px-5 py-4 border-b border-border flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Icons.GitCompare className="w-5 h-5 text-accent" />
            <h3 className="text-sm font-semibold tracking-tight">Compare Inductees</h3>
          </div>
          <button onClick={onClose} aria-label="Close" className="w-8 h-8 grid place-items-center rounded hover:bg-muted">
            <Icons.X className="w-4 h-4" />
          </button>
        </header>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {cols.map((inductee) => {
              const Icon = (Icons as never as Record<string, Icons.LucideIcon>)[inductee.icon] || Icons.Trophy;
              const seed = inductee.n.length;
              const profile = getProfile(inductee);
              const isFollowed = followed.has(inductee.n);
              const isCompared = compareList.includes(inductee.n);
              return (
                <div key={inductee.n} className="space-y-5">
                  {/* Profile card */}
                  <div className="rounded-xl border border-border bg-card/40 p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/40 via-primary/20 to-warning/20 border border-border grid place-items-center shrink-0">
                        <Icon className="w-6 h-6 text-accent" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{inductee.cat}</div>
                        <h4 className="text-sm font-semibold truncate">{inductee.n}</h4>
                        <div className="text-[11px] text-muted-foreground truncate">{inductee.meta}</div>
                        <div className="mt-2 flex flex-wrap gap-1.5 text-[10px]">
                          <span className="px-2 py-0.5 rounded-full bg-warning/15 text-warning border border-warning/30 inline-flex items-center gap-1">
                            <Icons.Crown className="w-3 h-3" /> {inductee.rank}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30">{inductee.region}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between rounded-lg border border-border bg-card/60 p-2.5">
                      <div>
                        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Score</div>
                        <div className="text-lg font-bold tabular-nums">{inductee.v}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Delta</div>
                        <div className="text-sm font-medium text-success">{inductee.delta}</div>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                      {[
                        ["Member since", "Mar 2021"],
                        ["Total XP", inductee.v.includes("XP") ? inductee.v : "1.04M XP"],
                        ["Level", `${42 + (seed % 18)}`],
                        ["Streak", `${21 + (seed % 60)} days`],
                      ].map(([k, v]) => (
                        <div key={k} className="rounded-md border border-border bg-card/40 p-2">
                          <dt className="text-muted-foreground text-[10px]">{k}</dt>
                          <dd className="font-medium truncate">{v}</dd>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={() => onToggleFollow(inductee.n)}
                        className={`flex-1 px-2.5 py-1.5 rounded-md text-[11px] font-medium inline-flex items-center justify-center gap-1 border transition-colors ${
                          isFollowed
                            ? "bg-success/15 text-success border-success/40 hover:bg-success/25"
                            : "bg-primary/10 text-primary border-primary/30 hover:bg-primary/20"
                        }`}
                      >
                        {isFollowed ? <Icons.Check className="w-3 h-3" /> : <Icons.UserPlus className="w-3 h-3" />}
                        {isFollowed ? "Following" : "Follow"}
                      </button>
                      <button
                        onClick={() => onToggleCompare(inductee.n)}
                        className={`flex-1 px-2.5 py-1.5 rounded-md text-[11px] font-medium inline-flex items-center justify-center gap-1 border transition-colors ${
                          isCompared
                            ? "bg-accent/15 text-accent border-accent/40 hover:bg-accent/25"
                            : "bg-muted text-foreground border-border hover:bg-muted/70"
                        }`}
                      >
                        <Icons.GitCompare className="w-3 h-3" />
                        {isCompared ? "In Compare" : "Compare"}
                      </button>
                    </div>
                  </div>

                  {/* XP Contribution */}
                  <div className="rounded-xl border border-border bg-card/40 p-4">
                    <h5 className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">XP Contribution</h5>
                    <div className="space-y-2">
                      {profile.xpBreakdown.map((x) => (
                        <div key={x.l} className="text-[11px]">
                          <div className="flex justify-between mb-1">
                            <span className="text-muted-foreground">{x.l}</span>
                            <span className="tabular-nums">{x.pct}%</span>
                          </div>
                          <ProgressBar value={x.pct} color={x.c} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="rounded-xl border border-border bg-card/40 p-4">
                    <h5 className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Badges</h5>
                    <div className="grid grid-cols-3 gap-2">
                      {profile.badges.map((b) => {
                        const BI = (Icons as never as Record<string, Icons.LucideIcon>)[b.i] || Icons.Award;
                        return (
                          <div key={b.n} className="rounded-lg border border-border bg-card/40 p-2 text-center">
                            <BI className={`w-4 h-4 mx-auto mb-1 ${b.tone}`} />
                            <div className="text-[10px] font-medium truncate">{b.n}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Awards */}
                  <div className="rounded-xl border border-border bg-card/40 p-4">
                    <h5 className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Awards History</h5>
                    <ul className="space-y-1.5">
                      {profile.awards.map((a, i) => (
                        <li key={i} className="flex items-start gap-2 rounded-md border border-border bg-card/40 p-2 text-[11px]">
                          <Icons.Trophy className="w-3.5 h-3.5 mt-0.5 text-warning shrink-0" />
                          <div className="min-w-0 flex-1">
                            <div className="font-medium truncate">{a.t}</div>
                            <div className="text-[10px] text-muted-foreground">{a.k}</div>
                          </div>
                          <span className="text-[10px] text-muted-foreground tabular-nums shrink-0">{a.y}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </aside>
    </div>,
    document.body,
  );
}

function TabHallOfFame({ filter }: { filter: string }) {
  const [cat, setCat] = useState<HofCat>("Top Developers");
  const [rank, setRank] = useState<HofRank>("All Ranks");
  const [region, setRegion] = useState<string>("All Regions");
  const [selected, setSelected] = useState<HofRow | null>(null);
  const [followed, setFollowed] = useState<Set<string>>(new Set());
  const [compareList, setCompareList] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);

  const openInductee = (r: typeof HOF_DATA[HofCat][number]) =>
    setSelected({ ...r, cat });
  const toggleFollow = (name: string) =>
    setFollowed((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name); else next.add(name);
      return next;
    });
  const toggleCompare = (name: string) =>
    setCompareList((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : prev.length >= 4 ? [...prev.slice(1), name] : [...prev, name]
    );
  const comparePair = useMemo(() => {
    if (compareList.length < 2) return null;
    const a = findInductee(compareList[0]);
    const b = findInductee(compareList[1]);
    return a && b ? { left: a, right: b } : null;
  }, [compareList]);

  const regions = ["All Regions", "APAC", "EU", "NA", "LATAM", "AFR", "MENA"];
  const all = HOF_DATA[cat];
  const f = filter.trim().toLowerCase();
  const rows = all.filter((r) =>
    (rank === "All Ranks" || r.rank === rank) &&
    (region === "All Regions" || r.region === region) &&
    (!f || r.n.toLowerCase().includes(f) || r.meta.toLowerCase().includes(f))
  );

  const podiumColors = ["from-warning/40 to-warning/5 border-warning/40", "from-muted to-transparent border-border", "from-accent/30 to-transparent border-accent/30"];
  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="space-y-4">
      {/* Category strip */}
      <div className="glass rounded-xl p-3 flex flex-wrap items-center gap-2">
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground mr-1">Category</span>
        {HOF_CATS.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`px-3 py-1.5 rounded-md text-[11px] border transition-colors ${cat === c ? "bg-primary/15 text-primary border-primary/40" : "bg-muted border-border text-muted-foreground hover:text-foreground"}`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="glass rounded-xl p-3 flex flex-wrap items-center gap-3 text-[11px]">
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Filters</span>
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground">Rank</span>
          <select value={rank} onChange={(e) => setRank(e.target.value as HofRank)} className="bg-muted border border-border rounded-md px-2 py-1">
            {HOF_RANKS.map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground">Region</span>
          <select value={region} onChange={(e) => setRegion(e.target.value)} className="bg-muted border border-border rounded-md px-2 py-1">
            {regions.map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>
        <span className="ml-auto text-muted-foreground">{rows.length} of {all.length} legends shown</span>
        {(followed.size > 0 || compareList.length > 0) && (
          <span className="inline-flex items-center gap-2">
            {followed.size > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-success/15 text-success border border-success/30 inline-flex items-center gap-1">
                <Icons.UserCheck className="w-3 h-3" /> {followed.size} following
              </span>
            )}
            {compareList.length > 0 && (
              <button
                onClick={() => compareList.length >= 2 && setCompareOpen(true)}
                className={`px-2 py-0.5 rounded-full border inline-flex items-center gap-1 text-[11px] transition-colors ${
                  compareList.length >= 2
                    ? "bg-accent/15 text-accent border-accent/30 hover:bg-accent/25"
                    : "bg-muted text-muted-foreground border-border cursor-not-allowed"
                }`}
                disabled={compareList.length < 2}
                title={compareList.length < 2 ? "Add at least 2 inductees to compare" : "Open compare view"}
              >
                <Icons.GitCompare className="w-3 h-3" /> {compareList.length} to compare
              </button>
            )}
          </span>
        )}
      </div>

      {/* KPI strip for selected category */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { l: "Inductees", v: String(all.length), t: "info" },
          { l: "Champions", v: String(all.filter((r) => r.rank === "Champion").length), t: "success" },
          { l: "This Quarter", v: "+12", t: "success" },
          { l: "Avg Δ", v: "+18.4%", t: "success" },
        ].map((k, i) => (
          <div key={i} className="glass rounded-xl p-3">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{k.l}</div>
            <div className="mt-1 text-xl font-semibold tabular-nums">{k.v}</div>
            <Spark seed={i + 41} height={20} />
          </div>
        ))}
      </div>

      {/* Podium */}
      {rows.length >= 3 && (
        <div className={grid}>
          {[1, 0, 2].map((podiumIdx, pos) => {
            const r = rows[podiumIdx];
            const Icon = (Icons as never as Record<string, Icons.LucideIcon>)[r.icon] || Icons.Trophy;
            const isFirst = podiumIdx === 0;
            return (
              <div key={pos} className={`col-span-12 md:col-span-4 ${isFirst ? "md:order-2" : pos === 0 ? "md:order-1" : "md:order-3"}`}>
                <button
                  onClick={() => openInductee(r)}
                  className={`w-full text-left rounded-xl border bg-gradient-to-b ${podiumColors[podiumIdx]} p-5 text-center relative overflow-hidden transition-transform hover:-translate-y-0.5 hover:shadow-xl focus-ring ${isFirst ? "shadow-[0_0_32px_-12px_var(--color-warning)]" : ""}`}
                >
                  <div className="text-3xl mb-2">{medals[podiumIdx]}</div>
                  <div className="mx-auto w-14 h-14 rounded-full bg-card border border-border grid place-items-center mb-2">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <div className="text-sm font-semibold truncate">{r.n}</div>
                  <div className="text-[10px] text-muted-foreground truncate">{r.meta}</div>
                  <div className="mt-2 text-lg font-bold tabular-nums">{r.v}</div>
                  <div className="mt-1 inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-card/60 border border-border">
                    <Icons.Crown className="w-3 h-3 text-warning" /> {r.rank}
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className={grid}>
        <ChartCard
          title={`Hall of Fame · ${cat}`}
          subtitle={`Rank: ${rank} · Region: ${region}`}
          className="col-span-12 lg:col-span-8"
        >
          {rows.length === 0 ? (
            <EmptyState icon="Trophy" title="No legends match" hint="Adjust rank or region filters" />
          ) : (
            <DataTable
              columns={["#", "Inductee", "Meta", "Score", "Rank", "Δ", ""]}
              rows={rows.map((r, i) => [
                String(i + 1),
                r.n,
                r.meta,
                r.v,
                r.rank,
                r.delta,
                <button
                  key={r.n}
                  onClick={() => openInductee(r)}
                  className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 inline-flex items-center gap-1"
                >
                  <Icons.Eye className="w-3 h-3" /> View
                </button>,
              ])}
            />
          )}
        </ChartCard>

        <ChartCard title="Rank Distribution" subtitle="across category" className="col-span-12 lg:col-span-4">
          <div className="space-y-2">
            {HOF_RANKS.slice(1).map((rk, i) => {
              const count = all.filter((r) => r.rank === rk).length;
              const pct = Math.round((count / Math.max(all.length, 1)) * 100);
              const colors = ["var(--color-warning)", "var(--color-accent)", "var(--color-primary)", "var(--color-info)", "var(--color-success)"];
              return (
                <div key={rk} className="text-[11px]">
                  <div className="flex justify-between mb-1">
                    <span className="text-muted-foreground">{rk}</span>
                    <span className="tabular-nums">{count} · {pct}%</span>
                  </div>
                  <ProgressBar value={pct} color={colors[i]} />
                </div>
              );
            })}
          </div>
        </ChartCard>

        <ChartCard title="Recognition · Of The Month" subtitle="across categories" className="col-span-12 lg:col-span-6">
          <ul className="space-y-2 text-xs">
            {[
              { r: "Developer", n: "Sofia Garcia", i: "Code2" },
              { r: "Vendor", n: "Kenji Tanaka", i: "Store" },
              { r: "Reseller", n: "Aarav Mehta", i: "Briefcase" },
              { r: "Franchise", n: "Lagos Hub", i: "Building2" },
              { r: "Customer", n: "Priya Shah", i: "User" },
              { r: "Territory", n: "Bangalore Tech Corridor", i: "MapPin" },
            ].map((x, i) => {
              const Icon = (Icons as never as Record<string, Icons.LucideIcon>)[x.i] || Icons.Star;
              return (
                <li key={i} className="flex items-center gap-2 rounded-md border border-border bg-card/40 p-2">
                  <Icon className="w-4 h-4 text-accent" />
                  <span className="flex-1 font-medium">{x.n}</span>
                  <span className="text-[10px] text-muted-foreground">{x.r} of Month</span>
                  <Icons.Medal className="w-4 h-4 text-warning" />
                </li>
              );
            })}
          </ul>
        </ChartCard>

        <ChartCard title="Induction Timeline" subtitle="recent legends" className="col-span-12 lg:col-span-6">
          <Timeline
            items={[
              { time: "2h ago", title: `${rows[0]?.n ?? "—"} inducted`, meta: `${cat} · ${rows[0]?.rank ?? ""}`, tone: "success" },
              { time: "Yesterday", title: "Lagos Hub crowned Champion Franchise", meta: "+218% YoY growth", tone: "success" },
              { time: "2d ago", title: "Sofia Garcia reaches 1.24M XP", meta: "Top Developer · Champion", tone: "info" },
              { time: "5d ago", title: "Bangalore Tech Corridor #1 Territory", meta: "$84.2M revenue", tone: "info" },
              { time: "1w ago", title: "Priya Shah · 412 referrals", meta: "Top Customer · Champion", tone: "muted" },
            ]}
          />
        </ChartCard>

      </div>

      <InducteeDrawer
        inductee={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
        followed={followed}
        onToggleFollow={toggleFollow}
        compareList={compareList}
        onToggleCompare={toggleCompare}
      />

      {comparePair && (
        <CompareDrawer
          left={comparePair.left}
          right={comparePair.right}
          open={compareOpen}
          onClose={() => setCompareOpen(false)}
          followed={followed}
          onToggleFollow={toggleFollow}
          compareList={compareList}
          onToggleCompare={toggleCompare}
        />
      )}
    </div>
  );
}


/* ---------- Tab: Command (01, 16, 22) ---------- */
function TabCommand() {
  const achievers = [
    { n: "Aarav Mehta", r: "Champion", xp: 124800, role: "Reseller" },
    { n: "Sofia Garcia", r: "Diamond", xp: 98420, role: "Developer" },
    { n: "Kenji Tanaka", r: "Diamond", xp: 92210, role: "Vendor" },
    { n: "Amara Okafor", r: "Platinum", xp: 81200, role: "Franchise" },
    { n: "Liam O'Connor", r: "Platinum", xp: 76040, role: "Support" },
    { n: "Priya Shah", r: "Gold", xp: 64800, role: "Customer" },
  ];
  return (
    <div className={grid}>
      <ChartCard title="Unlocks (24h)" subtitle="Live achievement stream" className="col-span-12 lg:col-span-8">
        <LineSeries seed={7} lines={3} height={200} />
        <div className="mt-3 grid grid-cols-3 gap-3 text-[11px]">
          <div className="rounded-md bg-muted/40 border border-border p-2">
            <div className="text-muted-foreground">Peak hour</div>
            <div className="text-base font-semibold tabular-nums">14:00 UTC</div>
          </div>
          <div className="rounded-md bg-muted/40 border border-border p-2">
            <div className="text-muted-foreground">Avg / min</div>
            <div className="text-base font-semibold tabular-nums">128</div>
          </div>
          <div className="rounded-md bg-muted/40 border border-border p-2">
            <div className="text-muted-foreground">XP issued</div>
            <div className="text-base font-semibold tabular-nums">4.82M</div>
          </div>
        </div>
      </ChartCard>

      <ChartCard title="Top Achievers" subtitle="Global ranking — today" className="col-span-12 lg:col-span-4">
        <ol className="space-y-2">
          {achievers.map((a, i) => (
            <li key={a.n} className="flex items-center gap-2 rounded-md border border-border bg-card/40 p-2">
              <span className="w-5 text-center text-[11px] font-semibold tabular-nums text-muted-foreground">{i + 1}</span>
              <Avatar name={a.n} />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-medium truncate">{a.n}</div>
                <div className="text-[10px] text-muted-foreground">{a.role}</div>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/30">{a.r}</span>
              <span className="text-[11px] tabular-nums font-semibold">{a.xp.toLocaleString()} XP</span>
            </li>
          ))}
        </ol>
      </ChartCard>

      <ChartCard title="Celebration Engine" subtitle="Live milestones firing now" className="col-span-12 lg:col-span-7">
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            { t: "Aarav Mehta hit Champion", k: "Rank Up", i: "Crown", tone: "text-accent" },
            { t: "Sofia Garcia — 100k XP", k: "Level Up", i: "ChevronsUp", tone: "text-primary" },
            { t: "Tokyo Hub — $1M revenue", k: "Milestone", i: "PartyPopper", tone: "text-success" },
            { t: "Kenji Tanaka — First Sale", k: "Trophy", i: "Trophy", tone: "text-warning" },
            { t: "EMEA — Global Champion", k: "Champion", i: "Star", tone: "text-accent" },
            { t: "Amara — 10 referrals", k: "Achievement", i: "Target", tone: "text-info" },
          ].map((e, i) => {
            const Icon = (Icons as never as Record<string, Icons.LucideIcon>)[e.i] || Icons.Sparkles;
            return (
              <li key={i} className="flex items-center gap-2 rounded-md border border-border bg-gradient-to-r from-card/70 to-card/30 p-2">
                <Icon className={`w-4 h-4 ${e.tone}`} />
                <span className="text-xs flex-1 truncate">{e.t}</span>
                <span className="text-[10px] text-muted-foreground">{e.k}</span>
              </li>
            );
          })}
        </ul>
      </ChartCard>

      <ChartCard title="Achievement Timeline" subtitle="Selected user · Aarav Mehta" className="col-span-12 lg:col-span-5">
        <Timeline
          items={[
            { time: "09:14", title: "Earned: Top Seller — Q3", tone: "success" },
            { time: "08:42", title: "Reward Granted: 5,000 Wallet Credit", tone: "info" },
            { time: "07:30", title: "Level Up → 412", tone: "info" },
            { time: "Yesterday", title: "Rank Up → Champion", tone: "warning" },
            { time: "Mon", title: "Certificate Earned: Reseller Pro", tone: "muted" },
          ]}
        />
      </ChartCard>
    </div>
  );
}

/* ---------- Tab: Library (02 + 25 Audit) ---------- */
function TabLibrary({ filter }: { filter: string }) {
  const rows = useMemo(() => {
    const data = [
      ["ACH-1024", "First Sale", "Revenue", "Customer", "+250 XP", "Active"],
      ["ACH-1037", "Top Seller Q3", "Revenue", "Reseller", "+5,000 XP", "Active"],
      ["ACH-1102", "Bug Hunter", "Engineering", "Developer", "+750 XP", "Active"],
      ["ACH-1188", "100 Tickets Closed", "Support", "Support", "+1,200 XP", "Active"],
      ["ACH-1233", "Network Growth x10", "Growth", "Franchise", "+2,500 XP", "Draft"],
      ["ACH-1304", "Premium Renewal Streak", "Renewal", "Customer", "+800 XP", "Active"],
      ["ACH-1408", "Marketplace Hero", "Marketplace", "Vendor", "+3,000 XP", "Archived"],
    ].filter((r) => r.join(" ").toLowerCase().includes(filter.toLowerCase()));
    return data.map((r) => [
      <span key="0" className="font-mono text-[11px]">{r[0]}</span>,
      <span key="1" className="font-medium">{r[1]}</span>,
      <Pill key="2" tone="info">{r[2]}</Pill>,
      r[3],
      <span key="4" className="text-accent font-semibold">{r[4]}</span>,
      <span key="5" className={r[5] === "Active" ? "text-success" : r[5] === "Draft" ? "text-warning" : "text-muted-foreground"}>{r[5]}</span>,
    ]);
  }, [filter]);

  return (
    <div className={grid}>
      <ChartCard
        title="Achievement Library"
        subtitle="Create · Edit · Clone · Archive"
        className="col-span-12 lg:col-span-8"
        toolbar={
          <QuickActions
            items={[
              { label: "Create", icon: "Plus", tone: "primary" },
              { label: "Clone", icon: "Copy", tone: "accent" },
              { label: "Archive", icon: "Archive", tone: "muted" },
            ]}
          />
        }
      >
        <DataTable columns={["ID", "Name", "Category", "Role", "Reward", "Status"]} rows={rows} />
      </ChartCard>

      <ChartCard title="Audit Center" subtitle="Who · When · Why · Reward" className="col-span-12 lg:col-span-4">
        <ul className="space-y-2 text-xs">
          {[
            { who: "Aarav Mehta", what: "Top Seller Q3", when: "09:14", rw: "+5,000 XP" },
            { who: "Sofia Garcia", what: "Bug Hunter", when: "08:55", rw: "+750 XP" },
            { who: "Kenji Tanaka", what: "First Sale", when: "08:42", rw: "+250 XP" },
            { who: "Amara Okafor", what: "Network Growth x10", when: "Yest.", rw: "+2,500 XP" },
            { who: "Priya Shah", what: "Premium Renewal", when: "Yest.", rw: "+800 XP" },
          ].map((a, i) => (
            <li key={i} className="rounded-md border border-border bg-card/40 p-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{a.who}</span>
                <span className="text-[10px] text-muted-foreground">{a.when}</span>
              </div>
              <div className="text-[11px] text-muted-foreground">{a.what} · <span className="text-accent">{a.rw}</span></div>
            </li>
          ))}
        </ul>
      </ChartCard>

      <ChartCard title="Categories" className="col-span-12 lg:col-span-6">
        <div className="grid grid-cols-2 gap-2">
          {[
            { k: "Revenue", n: 412, i: "DollarSign" },
            { k: "Engineering", n: 248, i: "Code2" },
            { k: "Support", n: 184, i: "LifeBuoy" },
            { k: "Marketplace", n: 312, i: "Store" },
            { k: "Training", n: 96, i: "GraduationCap" },
            { k: "Growth", n: 158, i: "TrendingUp" },
          ].map((c) => {
            const Icon = (Icons as never as Record<string, Icons.LucideIcon>)[c.i] || Icons.Folder;
            return (
              <div key={c.k} className="rounded-md border border-border bg-card/40 p-3 flex items-center gap-2">
                <Icon className="w-4 h-4 text-primary" />
                <div className="flex-1 text-xs">{c.k}</div>
                <span className="text-xs font-semibold tabular-nums">{c.n}</span>
              </div>
            );
          })}
        </div>
      </ChartCard>

      <ChartCard title="Rules Engine" subtitle="Triggers wired into modules" className="col-span-12 lg:col-span-6">
        <ul className="space-y-2 text-xs">
          {[
            { e: "order.completed", a: "+250 XP · First Sale Trophy" },
            { e: "renewal.success", a: "+800 XP · Renewal Badge" },
            { e: "ticket.csat≥4.5", a: "+120 XP · Support Star" },
            { e: "pr.merged", a: "+90 XP · Dev Streak" },
            { e: "territory.growth≥10%", a: "+2,500 XP · Franchise Champion" },
          ].map((r, i) => (
            <li key={i} className="flex items-center gap-2 rounded-md border border-border bg-card/40 p-2">
              <Icons.Zap className="w-3.5 h-3.5 text-warning" />
              <code className="text-[11px] text-info">{r.e}</code>
              <Icons.ArrowRight className="w-3 h-3 text-muted-foreground" />
              <span className="flex-1">{r.a}</span>
            </li>
          ))}
        </ul>
      </ChartCard>
    </div>
  );
}

/* ---------- Tab: XP & Levels (03, 04) ---------- */
function TabXpLevels() {
  const sources = [
    { k: "Revenue", v: 38, c: "var(--color-success)" },
    { k: "Sales", v: 22, c: "var(--color-primary)" },
    { k: "Support", v: 12, c: "var(--color-info)" },
    { k: "Development", v: 10, c: "var(--color-accent)" },
    { k: "Training", v: 7, c: "var(--color-warning)" },
    { k: "Customer", v: 6, c: "var(--color-destructive)" },
    { k: "Renewal", v: 3, c: "var(--color-info)" },
    { k: "Marketplace", v: 2, c: "var(--color-accent)" },
  ];
  return (
    <div className={grid}>
      <ChartCard title="XP Sources" subtitle="Share of XP issued last 30d" className="col-span-12 lg:col-span-5">
        <div className="space-y-2">
          {sources.map((s) => (
            <div key={s.k}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span>{s.k}</span>
                <span className="tabular-nums text-muted-foreground">{s.v}%</span>
              </div>
              <ProgressBar value={s.v} color={s.c} />
            </div>
          ))}
        </div>
      </ChartCard>

      <ChartCard title="XP Issuance" subtitle="Hourly, last 24h" className="col-span-12 lg:col-span-7">
        <Bars seed={9} n={48} height={160} color="var(--color-accent)" />
      </ChartCard>

      <ChartCard title="Level Ladder" subtitle="Level 1 → Level 1000+" className="col-span-12 lg:col-span-8">
        <div className="grid grid-cols-5 md:grid-cols-10 gap-1.5">
          {Array.from({ length: 50 }).map((_, i) => {
            const lv = (i + 1) * 20;
            const reached = i < 32;
            return (
              <div
                key={i}
                className={`aspect-square rounded-md grid place-items-center text-[10px] font-semibold tabular-nums border ${
                  reached
                    ? "bg-gradient-to-br from-primary/25 to-accent/20 border-primary/40 text-foreground"
                    : "bg-muted/40 border-border text-muted-foreground"
                }`}
                title={`Level ${lv}`}
              >
                {lv}
              </div>
            );
          })}
        </div>
        <div className="mt-3 text-[11px] text-muted-foreground">
          Custom XP curve: <span className="text-foreground font-medium">xp(n) = 100·n^1.45</span> · benefits unlock every 50 levels.
        </div>
      </ChartCard>

      <ChartCard title="Level Rewards" subtitle="Tiered benefits" className="col-span-12 lg:col-span-4">
        <ul className="space-y-2 text-xs">
          {[
            { lv: 50, r: "Wallet +$25 · Profile frame", tone: "info" },
            { lv: 100, r: "Priority leads · Theme unlock", tone: "info" },
            { lv: 250, r: "Commission +1% · Trophy", tone: "warning" },
            { lv: 500, r: "Champion frame · Free seat", tone: "warning" },
            { lv: 1000, r: "Legend status · Global mention", tone: "destructive" },
          ].map((r, i) => (
            <li key={i} className="flex items-center gap-2 rounded-md border border-border bg-card/40 p-2">
              <span className="w-12 text-center text-[11px] font-semibold tabular-nums">{r.lv}</span>
              <span className="flex-1">{r.r}</span>
              <Icons.Gift className="w-3.5 h-3.5 text-accent" />
            </li>
          ))}
        </ul>
      </ChartCard>
    </div>
  );
}

/* ---------- Tab: Ranks & Trophies (05, 06, 21) ---------- */
function TabRanksTrophies() {
  const trophies = [
    { k: "First Login", i: "LogIn", t: "muted" },
    { k: "First Customer", i: "User", t: "info" },
    { k: "First Sale", i: "ShoppingBag", t: "success" },
    { k: "First Revenue", i: "DollarSign", t: "success" },
    { k: "First Renewal", i: "RefreshCcw", t: "info" },
    { k: "Top Seller", i: "TrendingUp", t: "warning" },
    { k: "Top Developer", i: "Code2", t: "primary" },
    { k: "Top Vendor", i: "Store", t: "accent" },
    { k: "Top Reseller", i: "Briefcase", t: "warning" },
    { k: "Top Franchise", i: "Building2", t: "info" },
    { k: "Global Champion", i: "Crown", t: "destructive" },
    { k: "Legend", i: "Star", t: "accent" },
  ];
  const toneBg: Record<string, string> = {
    muted: "from-muted/40 to-card", info: "from-info/30 to-card",
    success: "from-success/30 to-card", warning: "from-warning/30 to-card",
    primary: "from-primary/30 to-card", accent: "from-accent/30 to-card",
    destructive: "from-destructive/30 to-card",
  };
  return (
    <div className={grid}>
      <ChartCard title="Rank Distribution" subtitle="Starter → Global Champion" className="col-span-12 lg:col-span-7">
        <div className="space-y-1.5">
          {RANKS.map((r, i) => {
            const pct = Math.max(2, 48 - i * 4 - (i > 6 ? 4 : 0));
            return (
              <div key={r.k} className="flex items-center gap-2">
                <span className={`w-32 text-xs font-medium ${r.c}`}>{r.k}</span>
                <div className="flex-1">
                  <ProgressBar value={pct} color="var(--color-accent)" />
                </div>
                <span className="w-12 text-right text-[11px] tabular-nums text-muted-foreground">{pct}%</span>
              </div>
            );
          })}
        </div>
        <div className="mt-3 text-[11px] text-muted-foreground">Role-specific rank tracks defined for Developer, Reseller, Vendor, Franchise, Customer.</div>
      </ChartCard>

      <ChartCard title="Trophy Room" subtitle="3D glass showcase" className="col-span-12 lg:col-span-5">
        <div className="grid grid-cols-3 gap-2">
          {trophies.map((t) => {
            const Icon = (Icons as never as Record<string, Icons.LucideIcon>)[t.i] || Icons.Trophy;
            return (
              <div
                key={t.k}
                className={`aspect-square rounded-lg border border-border bg-gradient-to-br ${toneBg[t.t]} grid place-items-center text-center p-2 card-hover hover:border-accent/50 transition-all`}
              >
                <div>
                  <Icon className="w-7 h-7 mx-auto text-foreground/80" />
                  <div className="mt-1 text-[10px] font-medium leading-tight">{t.k}</div>
                </div>
              </div>
            );
          })}
        </div>
      </ChartCard>

      <ChartCard title="Recent Rank-Ups" className="col-span-12 lg:col-span-6">
        <ul className="space-y-2 text-xs">
          {[
            { u: "Aarav Mehta", from: "Diamond", to: "Champion" },
            { u: "Sofia Garcia", from: "Platinum", to: "Diamond" },
            { u: "Kenji Tanaka", from: "Platinum", to: "Diamond" },
            { u: "Amara Okafor", from: "Gold", to: "Platinum" },
            { u: "Priya Shah", from: "Silver", to: "Gold" },
          ].map((r, i) => (
            <li key={i} className="flex items-center gap-2 rounded-md border border-border bg-card/40 p-2">
              <Avatar name={r.u} />
              <span className="flex-1 font-medium">{r.u}</span>
              <span className="text-muted-foreground">{r.from}</span>
              <Icons.ArrowRight className="w-3 h-3 text-accent" />
              <span className="text-accent font-semibold">{r.to}</span>
            </li>
          ))}
        </ul>
      </ChartCard>

      <ChartCard title="Trophy Cabinet — Aarav Mehta" subtitle="Animated rotation · achievement timeline" className="col-span-12 lg:col-span-6">
        <div className="rounded-lg border border-accent/30 bg-gradient-to-br from-accent/15 via-primary/10 to-background p-4 grid grid-cols-4 gap-3">
          {trophies.slice(0, 8).map((t) => {
            const Icon = (Icons as never as Record<string, Icons.LucideIcon>)[t.i] || Icons.Trophy;
            return (
              <div key={t.k} className="aspect-square rounded-md bg-background/40 border border-border grid place-items-center shadow-inner">
                <Icon className="w-6 h-6 text-accent drop-shadow-[0_0_8px_var(--color-accent)]" />
              </div>
            );
          })}
        </div>
      </ChartCard>
    </div>
  );
}

/* ---------- Tab: Badges & Rewards (07, 08, 14, 15) ---------- */
function TabBadgesRewards() {
  const badges = [
    "Achievement", "Revenue", "Support", "Developer", "Customer", "Training", "Leadership",
  ];
  return (
    <div className={grid}>
      <ChartCard title="Badge Collections" subtitle="By category" className="col-span-12 lg:col-span-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {badges.map((b, i) => (
            <div key={b} className="rounded-lg border border-border bg-card/40 p-3 text-center card-hover">
              <div className="mx-auto w-12 h-12 rounded-full grid place-items-center bg-gradient-to-br from-primary/30 to-accent/20 border border-primary/40">
                <Icons.BadgeCheck className="w-6 h-6 text-primary" />
              </div>
              <div className="mt-2 text-xs font-medium">{b}</div>
              <div className="text-[10px] text-muted-foreground tabular-nums">{(i + 1) * 12} badges</div>
            </div>
          ))}
        </div>
      </ChartCard>

      <ChartCard title="Reward Catalog" subtitle="Granted & redeemable" className="col-span-12 lg:col-span-6">
        <DataTable
          columns={["Reward", "Type", "Cost", "Granted (30d)", "Redeem"]}
          rows={[
            ["Wallet Credit $25", <Pill key="t" tone="success">Cash</Pill>, "2,500 pts", "1,284", <Pill key="r" tone="primary">Active</Pill>],
            ["Commission Bonus 1%", <Pill key="t" tone="warning">Bonus</Pill>, "8,000 pts", "412", <Pill key="r" tone="primary">Active</Pill>],
            ["Discount Coupon 20%", <Pill key="t" tone="info">Coupon</Pill>, "1,200 pts", "3,201", <Pill key="r" tone="primary">Active</Pill>],
            ["Premium Access 30d", <Pill key="t" tone="accent">Access</Pill>, "5,000 pts", "248", <Pill key="r" tone="primary">Active</Pill>],
            ["Feature Unlock — AI Pro", <Pill key="t" tone="accent">Feature</Pill>, "12,000 pts", "84", <Pill key="r" tone="primary">Active</Pill>],
            ["Priority Leads Queue", <Pill key="t" tone="warning">Sales</Pill>, "10,000 pts", "62", <Pill key="r" tone="primary">Active</Pill>],
          ]}
        />
      </ChartCard>

      <ChartCard title="Reward Store" subtitle="Redeem XP & Points" className="col-span-12 lg:col-span-7">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {[
            { k: "Champion Frame", c: 5000, i: "Frame", tone: "accent" },
            { k: "Diamond Frame", c: 8000, i: "Diamond", tone: "info" },
            { k: "Legend Frame", c: 12000, i: "Star", tone: "destructive" },
            { k: "Holo Theme", c: 3000, i: "Palette", tone: "primary" },
            { k: "Sparks Effect", c: 1500, i: "Sparkles", tone: "warning" },
            { k: "Aurora Background", c: 4000, i: "Sunrise", tone: "accent" },
          ].map((p) => {
            const Icon = (Icons as never as Record<string, Icons.LucideIcon>)[p.i] || Icons.Gift;
            return (
              <div key={p.k} className="rounded-lg border border-border bg-card/40 p-3 hover:border-accent/40 transition-colors">
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5 text-accent" />
                  <div className="text-xs font-medium flex-1">{p.k}</div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground tabular-nums">{p.c.toLocaleString()} pts</span>
                  <button className="px-2 py-0.5 rounded text-[11px] bg-primary/15 text-primary border border-primary/30 hover:bg-primary/25">Redeem</button>
                </div>
              </div>
            );
          })}
        </div>
      </ChartCard>

      <ChartCard title="Profile Customization" subtitle="Champion · Diamond · Legend · Titan · Country" className="col-span-12 lg:col-span-5">
        <div className="grid grid-cols-3 gap-3">
          {["Champion", "Diamond", "Legend", "Titan", "Country", "Territory"].map((f, i) => (
            <div key={f} className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full p-[3px] bg-gradient-to-br from-accent via-primary to-warning">
                <div className="w-full h-full rounded-full bg-background grid place-items-center">
                  <Icons.User className="w-6 h-6 text-foreground/70" />
                </div>
              </div>
              <div className="mt-1 text-[11px] font-medium">{f}</div>
              <div className="text-[10px] text-muted-foreground">Frame</div>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  );
}

/* ---------- Tab: Certificates (09) ---------- */
function TabCertificates() {
  const certs = [
    { k: "Training Certificate", c: 4128, i: "GraduationCap" },
    { k: "Developer Certificate", c: 812, i: "Code2" },
    { k: "Vendor Certificate", c: 248, i: "Store" },
    { k: "Reseller Certificate", c: 1284, i: "Briefcase" },
    { k: "Franchise Certificate", c: 96, i: "Building2" },
    { k: "Champion Certificate", c: 42, i: "Crown" },
  ];
  return (
    <div className={grid}>
      <ChartCard title="Certificates Issued" subtitle="By program" className="col-span-12 lg:col-span-7">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {certs.map((c) => {
            const Icon = (Icons as never as Record<string, Icons.LucideIcon>)[c.i] || Icons.Award;
            return (
              <div key={c.k} className="rounded-lg border border-border bg-gradient-to-br from-card to-card/40 p-4 card-hover">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-md bg-warning/15 border border-warning/30 grid place-items-center">
                    <Icon className="w-5 h-5 text-warning" />
                  </div>
                  <Icons.Stamp className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="mt-3 text-sm font-medium">{c.k}</div>
                <div className="mt-1 text-2xl font-semibold tabular-nums">{c.c.toLocaleString()}</div>
                <div className="text-[10px] text-muted-foreground">issued lifetime</div>
              </div>
            );
          })}
        </div>
      </ChartCard>

      <ChartCard title="Issuance Trend" subtitle="Last 30 days" className="col-span-12 lg:col-span-5">
        <LineSeries seed={4} lines={2} height={180} />
        <ul className="mt-3 space-y-1.5 text-xs">
          {[
            { k: "Training", v: "+128 this week", t: "success" },
            { k: "Developer", v: "+42 this week", t: "info" },
            { k: "Champion", v: "+3 this week", t: "warning" },
          ].map((r, i) => (
            <li key={i} className="flex items-center justify-between rounded-md border border-border bg-card/40 px-2 py-1.5">
              <span className="font-medium">{r.k}</span>
              <span className={r.t === "success" ? "text-success" : r.t === "info" ? "text-info" : "text-warning"}>{r.v}</span>
            </li>
          ))}
        </ul>
      </ChartCard>

      <ChartCard title="Recently Issued" className="col-span-12">
        <DataTable
          columns={["Cert ID", "Recipient", "Program", "Issued", "Verifier", "Status"]}
          rows={[
            ["CERT-44102", "Aarav Mehta", "Reseller Pro", "Today 09:14", "SVN Academy", <Pill key="s" tone="success">Verified</Pill>],
            ["CERT-44101", "Sofia Garcia", "Developer Pro", "Today 08:55", "SVN Academy", <Pill key="s" tone="success">Verified</Pill>],
            ["CERT-44100", "Kenji Tanaka", "Vendor Master", "Today 08:42", "SVN Academy", <Pill key="s" tone="success">Verified</Pill>],
            ["CERT-44099", "Amara Okafor", "Franchise Leader", "Yest.", "SVN Academy", <Pill key="s" tone="info">Pending Audit</Pill>],
            ["CERT-44098", "Priya Shah", "Champion", "Yest.", "Global Council", <Pill key="s" tone="success">Verified</Pill>],
          ]}
        />
      </ChartCard>
    </div>
  );
}

/* ---------- Tab: Leaderboards (10, 11, 23, 24) ---------- */
function TabLeaderboards() {
  const scopes = ["Global", "Country", "State", "City", "Territory", "Department", "Role"];
  return (
    <div className={grid}>
      <ChartCard title="Global Leaderboard Map" subtitle="Interactive · top countries · territories · users" className="col-span-12 lg:col-span-8">
        <WorldMap seed={11} />
        <div className="mt-3 flex flex-wrap gap-1.5">
          {scopes.map((s, i) => (
            <button key={s} className={`px-2.5 py-1 rounded-md text-[11px] border transition-colors ${i === 0 ? "bg-primary/15 text-primary border-primary/30" : "bg-muted border-border text-muted-foreground hover:text-foreground"}`}>
              {s}
            </button>
          ))}
        </div>
      </ChartCard>

      <ChartCard title="Hall of Fame" subtitle="All-time leaders" className="col-span-12 lg:col-span-4">
        <ul className="space-y-2">
          {[
            { c: "Top Developer", n: "Sofia Garcia", v: "1.24M XP", i: "Code2" },
            { c: "Top Vendor", n: "Kenji Tanaka", v: "$48M GMV", i: "Store" },
            { c: "Top Reseller", n: "Aarav Mehta", v: "$28M revenue", i: "Briefcase" },
            { c: "Top Franchise", n: "Lagos Hub", v: "+218% growth", i: "Building2" },
            { c: "Top Customer", n: "Priya Shah", v: "412 referrals", i: "User" },
          ].map((h, i) => {
            const Icon = (Icons as never as Record<string, Icons.LucideIcon>)[h.i] || Icons.Star;
            return (
              <li key={i} className="flex items-center gap-2 rounded-md border border-accent/30 bg-gradient-to-r from-accent/10 to-transparent p-2">
                <Icon className="w-4 h-4 text-accent" />
                <div className="flex-1">
                  <div className="text-xs font-medium">{h.n}</div>
                  <div className="text-[10px] text-muted-foreground">{h.c}</div>
                </div>
                <span className="text-[11px] font-semibold tabular-nums">{h.v}</span>
              </li>
            );
          })}
        </ul>
      </ChartCard>

      <ChartCard title="Top Countries" className="col-span-12 lg:col-span-4">
        <DataTable
          columns={["#", "Country", "XP", "Champions"]}
          rows={[
            ["1", "🇺🇸 USA", "184.2M", "412"],
            ["2", "🇮🇳 India", "142.8M", "388"],
            ["3", "🇯🇵 Japan", "98.4M", "248"],
            ["4", "🇩🇪 Germany", "84.1M", "188"],
            ["5", "🇧🇷 Brazil", "62.0M", "142"],
          ]}
        />
      </ChartCard>

      <ChartCard title="Role Leaderboard — Developers" className="col-span-12 lg:col-span-4">
        <DataTable
          columns={["#", "User", "XP", "Rank"]}
          rows={[
            ["1", "Sofia Garcia", "1.24M", "Diamond"],
            ["2", "Mateo Rossi", "984k", "Diamond"],
            ["3", "Yuki Sato", "812k", "Platinum"],
            ["4", "Noah Becker", "742k", "Platinum"],
            ["5", "Linh Pham", "648k", "Gold"],
          ]}
        />
      </ChartCard>

      <ChartCard title="Recognition — Of The Month" className="col-span-12 lg:col-span-4">
        <ul className="space-y-2 text-xs">
          {[
            { r: "Employee", n: "Aarav Mehta" },
            { r: "Developer", n: "Sofia Garcia" },
            { r: "Reseller", n: "Kenji Tanaka" },
            { r: "Vendor", n: "Amara Okafor" },
            { r: "Franchise", n: "Lagos Hub" },
            { r: "Customer", n: "Priya Shah" },
          ].map((r, i) => (
            <li key={i} className="flex items-center gap-2 rounded-md border border-border bg-card/40 p-2">
              <Icons.Medal className="w-4 h-4 text-warning" />
              <span className="flex-1 font-medium">{r.n}</span>
              <span className="text-[10px] text-muted-foreground">{r.r} of Month</span>
            </li>
          ))}
        </ul>
      </ChartCard>
    </div>
  );
}

/* ---------- Tab: Challenges & Missions (12, 13) ---------- */
function TabChallengesMissions() {
  const challenges = [
    { p: "Daily", k: "Close 3 tickets", r: "+120 XP", pct: 66, tone: "info" },
    { p: "Weekly", k: "Ship 5 PRs", r: "+800 XP", pct: 40, tone: "primary" },
    { p: "Weekly", k: "$10k revenue", r: "+1,200 XP", pct: 78, tone: "success" },
    { p: "Monthly", k: "20 renewals", r: "+5,000 XP", pct: 52, tone: "warning" },
    { p: "Quarterly", k: "Top 10 region", r: "Trophy + $2k", pct: 24, tone: "accent" },
    { p: "Yearly", k: "Global Champion", r: "Legend status", pct: 11, tone: "destructive" },
  ];
  return (
    <div className={grid}>
      <ChartCard title="Challenge Center" subtitle="Daily · Weekly · Monthly · Quarterly · Yearly" className="col-span-12 lg:col-span-7">
        <ul className="space-y-2.5">
          {challenges.map((c, i) => (
            <li key={i} className="rounded-md border border-border bg-card/40 p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <Pill tone={c.tone as never}>{c.p}</Pill>
                <span className="text-sm font-medium">{c.k}</span>
                <span className="ml-auto text-[11px] text-accent font-semibold">{c.r}</span>
              </div>
              <ProgressBar value={c.pct} color="var(--color-accent)" />
              <div className="mt-1 text-[10px] text-muted-foreground tabular-nums">{c.pct}% complete</div>
            </li>
          ))}
        </ul>
      </ChartCard>

      <ChartCard title="Mission Center" subtitle="Long-form objectives by domain" className="col-span-12 lg:col-span-5">
        <div className="grid grid-cols-2 gap-2">
          {[
            { k: "Sales Mission", i: "TrendingUp", t: "primary" },
            { k: "Revenue Mission", i: "DollarSign", t: "success" },
            { k: "Training Mission", i: "GraduationCap", t: "info" },
            { k: "Support Mission", i: "LifeBuoy", t: "warning" },
            { k: "Development Mission", i: "Code2", t: "accent" },
            { k: "Growth Mission", i: "Rocket", t: "destructive" },
          ].map((m) => {
            const Icon = (Icons as never as Record<string, Icons.LucideIcon>)[m.i] || Icons.Target;
            return (
              <div key={m.k} className="rounded-lg border border-border bg-gradient-to-br from-card to-card/30 p-3 card-hover">
                <Icon className={`w-5 h-5 text-${m.t}`} />
                <div className="mt-2 text-xs font-medium">{m.k}</div>
                <div className="mt-1 text-[10px] text-muted-foreground">3 active · 12 in queue</div>
              </div>
            );
          })}
        </div>
      </ChartCard>

      <ChartCard title="Mission Heatmap" subtitle="Completion intensity · last 12 weeks" className="col-span-12">
        <Heatmap rows={6} cols={28} seed={13} color="var(--color-accent)" />
      </ChartCard>
    </div>
  );
}

/* ---------- Tab: Engine (17, 18, 19, 20) ---------- */
function TabEngine() {
  const [sound, setSound] = useState(false); // OFF BY DEFAULT
  const animKinds = ["Trophy", "Badge", "Rank", "XP", "Reward", "Celebration"];
  const soundKinds = ["Achievement", "Trophy", "Rank Up", "Champion", "Reward"];

  return (
    <div className={grid}>
      <ChartCard title="Animation Management" subtitle="Per-event animation profiles" className="col-span-12 lg:col-span-6">
        <DataTable
          columns={["Event", "Animation", "Duration", "Status"]}
          rows={animKinds.map((k, i) => [
            <span key="k" className="font-medium">{k}</span>,
            <span key="a" className="font-mono text-[11px] text-accent">{["spring.bounce", "scale.pop", "float.glow", "burst.spark", "wave.flow", "confetti.cascade"][i]}</span>,
            <span key="d" className="tabular-nums">{900 + i * 100}ms</span>,
            <Pill key="s" tone="success">Enabled</Pill>,
          ])}
        />
      </ChartCard>

      <ChartCard
        title="Sound Management"
        subtitle="Off by default — opt-in per channel"
        className="col-span-12 lg:col-span-6"
        toolbar={
          <button
            onClick={() => setSound((v) => !v)}
            aria-pressed={sound}
            className={`px-2.5 py-1 rounded-md text-[11px] border ${sound ? "bg-success/15 text-success border-success/30" : "bg-muted text-muted-foreground border-border"}`}
          >
            Master: {sound ? "ON" : "OFF"}
          </button>
        }
      >
        <ul className="space-y-2">
          {soundKinds.map((k, i) => (
            <li key={k} className="flex items-center gap-2 rounded-md border border-border bg-card/40 p-2">
              <Icons.Volume2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs flex-1">{k} Sound</span>
              <span className="text-[10px] text-muted-foreground font-mono">/sfx/{k.toLowerCase().replace(" ", "_")}.ogg</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${sound && i < 3 ? "bg-success/15 text-success border-success/30" : "bg-muted text-muted-foreground border-border"}`}>
                {sound && i < 3 ? "ON" : "OFF"}
              </span>
            </li>
          ))}
        </ul>
      </ChartCard>

      <ChartCard title="Role Reward Rules" subtitle="Per-role scoring weights" className="col-span-12 lg:col-span-7">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { r: "Developer", rules: ["Code Quality", "Features Delivered", "Bugs Fixed"], weights: [1.82, 1.54, 1.36], i: "Code2" },
            { r: "Reseller", rules: ["Revenue", "Sales", "Renewals"], weights: [1.95, 1.62, 1.48], i: "Briefcase" },
            { r: "Vendor", rules: ["Products", "Revenue", "Ratings"], weights: [1.42, 1.86, 1.34], i: "Store" },
            { r: "Franchise", rules: ["Territory Growth", "Revenue", "Network Growth"], weights: [1.74, 1.66, 1.58], i: "Building2" },
            { r: "Customer", rules: ["Purchases", "Referrals", "Reviews"], weights: [1.28, 1.72, 1.22], i: "User" },
            { r: "Support", rules: ["FRT", "CSAT", "Resolved"], weights: [1.18, 1.46, 1.38], i: "LifeBuoy" },
          ].map((g) => {
            const Icon = (Icons as never as Record<string, Icons.LucideIcon>)[g.i] || Icons.UserCog;
            return (
              <div key={g.r} className="rounded-lg border border-border bg-card/40 p-3">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-primary" />
                  <div className="text-xs font-semibold">{g.r}</div>
                </div>
                <ul className="mt-2 space-y-1">
                  {g.rules.map((r, i) => (
                    <li key={r} className="flex items-center justify-between text-[11px]">
                      <span>{r}</span>
                      <span className="text-muted-foreground tabular-nums">×{g.weights[i].toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </ChartCard>

      <AIInsights
        items={[
          { title: "Predict 7 Champions this quarter", body: "Aarav, Sofia and 5 others are tracking >90% to Champion status.", tone: "accent", confidence: 92 },
          { title: "Suggest 12 new achievements", body: "Renewal streak gaps & marketplace milestones lack coverage.", tone: "info", confidence: 87 },
          { title: "Detect cooling cohorts", body: "APAC Resellers XP velocity dropped 14% week-over-week — recommend a sprint challenge.", tone: "warning", confidence: 81 },
          { title: "Auto-balance rewards", body: "Wallet payouts up 22%; recommend tightening high-tier reward economics.", tone: "destructive", confidence: 78 },
        ]}
      />
    </div>
  );
}

/* ====================================================================
   MAIN COMPONENT
   ==================================================================== */
export function Achievements({ d }: { d: DashSpec }) {
  const s = useDashboardState();
  const { tab, setTab } = useTabs<Tab>("source-map");
  const [createOpen, setCreateOpen] = useState(false);

  const kpis: Kpi[] = [
    { label: "Total Achievements", value: "4,812", delta: "+128 / wk", tone: "success" },
    { label: "Unlocked Today", value: "18,402", delta: "+12.4%", tone: "success" },
    { label: "Pending Rewards", value: "1,284", delta: "−42", tone: "warning" },
    { label: "Active Champions", value: "412", delta: "+8", tone: "info" },
    { label: "XP Issued (24h)", value: "4.82M", delta: "+6.1%", tone: "success" },
    { label: "Global Rank #1", value: "Aarav M.", delta: "Champion", tone: "info" },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1600px] mx-auto">
      <Header
        d={d}
        right={
          <DashboardToolbar
            range={s.range}
            onRangeChange={s.setRange}
            live={s.live}
            onLiveToggle={s.setLive}
            extra={
              <button
                onClick={() => setCreateOpen(true)}
                className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium inline-flex items-center gap-1.5 hover:opacity-90"
              >
                <Icons.Plus className="w-3.5 h-3.5" /> New Achievement
              </button>
            }
          />
        }
      />

      <Kpis items={kpis} />
      <MasterFlow />

      <TabBar<Tab>
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "source-map", label: "Source Map", icon: "ClipboardList", badge: 25 },
          { id: "command", label: "Command", icon: "Activity", badge: 6 },
          { id: "library", label: "Library", icon: "Library", badge: "4.8k" },
          { id: "xp-levels", label: "XP & Levels", icon: "Zap" },
          { id: "ranks-trophies", label: "Ranks & Trophies", icon: "Crown" },
          { id: "badges-rewards", label: "Badges & Rewards", icon: "BadgeCheck" },
          { id: "certificates", label: "Certificates", icon: "Award", badge: 412 },
          { id: "leaderboards", label: "Leaderboards", icon: "BarChart3" },
          { id: "hall-of-fame", label: "Hall of Fame", icon: "Trophy", badge: 7 },
          { id: "challenges-missions", label: "Challenges & Missions", icon: "Target", badge: 18 },
          { id: "engine", label: "Engine & AI", icon: "Cpu" },
        ]}
        right={<FilterBar value={s.filter} onChange={s.setFilter} placeholder="Filter achievements, users, rewards…" />}
      />

      <div id="ams-tab-content" className="pt-2 scroll-mt-24">
        {tab === "source-map" && <TabSourceMap filter={s.filter} onOpenTab={setTab} />}
        {tab === "command" && <TabCommand />}
        {tab === "library" && <TabLibrary filter={s.filter} />}
        {tab === "xp-levels" && <TabXpLevels />}
        {tab === "ranks-trophies" && <TabRanksTrophies />}
        {tab === "badges-rewards" && <TabBadgesRewards />}
        {tab === "certificates" && <TabCertificates />}
        {tab === "leaderboards" && <TabLeaderboards />}
        {tab === "hall-of-fame" && <TabHallOfFame filter={s.filter} />}
        {tab === "challenges-missions" && <TabChallengesMissions />}
        {tab === "engine" && <TabEngine />}
      </div>


      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create Achievement"
        size="lg"
        footer={
          <>
            <button onClick={() => setCreateOpen(false)} className="px-3 py-1.5 rounded-md text-xs bg-muted border border-border">Cancel</button>
            <button onClick={() => setCreateOpen(false)} className="px-3 py-1.5 rounded-md text-xs bg-primary text-primary-foreground">Publish</button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-3 text-xs">
          {[
            ["Name", "Top Seller Q4"],
            ["Category", "Revenue"],
            ["Role", "Reseller"],
            ["Trigger", "order.completed.sum ≥ $50,000"],
            ["XP Reward", "5000"],
            ["Badge", "Top Seller Trophy"],
          ].map(([l, v]) => (
            <label key={l} className="space-y-1">
              <span className="text-muted-foreground">{l}</span>
              <input defaultValue={v} className="w-full bg-muted border border-border rounded-md px-2 py-1.5" />
            </label>
          ))}
          <label className="col-span-2 space-y-1">
            <span className="text-muted-foreground">Description</span>
            <textarea
              rows={3}
              defaultValue="Awarded to the top reseller by revenue in Q4. Triggers Champion ceremony, wallet credit, and global recognition."
              className="w-full bg-muted border border-border rounded-md px-2 py-1.5"
            />
          </label>
        </div>
      </Modal>
    </div>
  );
}
