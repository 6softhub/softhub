import { useMemo, useState } from "react";
import * as Icons from "lucide-react";
import type { DashSpec } from "@/data/dashboards";
import {
  Pill, Donut, Bars, LineSeries, Heatmap, Spark,
  DataTable, ProgressBar, Avatar,
} from "./_primitives";
import {
  ChartCard, AIInsights, DashboardToolbar, Modal, TabBar, FilterBar,
  QuickActions, EmptyState, useDashboardState, useTabs,
} from "./_universal";

/* ============================================================
   CATEGORY 06b — INFLUENCER MANAGER (premium, multi-tab)
   Merges the uploaded "boss-panel-insights" 34-route influencer
   ecosystem into ONE Boss-Panel-native command surface.
   Tabs: Overview · Creators · Campaigns · Applications ·
         Collaborations · Content · Wallet · Rewards ·
         Analytics · Verification · Reports · Comms · Settings
   ============================================================ */

const grid = "grid grid-cols-12 gap-4";

function Header({ d, right }: { d: DashSpec; right?: React.ReactNode }) {
  const Icon = (Icons as never as Record<string, Icons.LucideIcon>)[d.icon] || Icons.Megaphone;
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 animate-fade-up">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-accent/10 border border-border grid place-items-center text-primary">
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            {d.category} · Clone of {d.clone}
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">{d.title}</h1>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs flex-wrap">
        {d.tags.slice(0, 4).map((t) => (
          <span key={t} className="px-2 py-1 rounded-md bg-muted border border-border">{t}</span>
        ))}
        {right}
      </div>
    </header>
  );
}

type KpiItem = { label: string; value: string; delta?: string; tone?: "success" | "warning" | "destructive" | "info" };
function Kpis({ items }: { items: KpiItem[] }) {
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
          <div className={`mt-1 ${map[m.tone || "info"]}`}><Spark seed={i + 7} height={22} /></div>
        </div>
      ))}
    </div>
  );
}

function PageShell({ d, toolbar, children }: { d: DashSpec; toolbar: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1600px] mx-auto">
      <Header d={d} right={toolbar} />
      {children}
    </div>
  );
}

/* ---------- shared data ---------- */
const CREATORS = [
  { name: "@nova.fit",     plat: "Instagram", followers: "2.4M", er: 6.8,  posts: 24, emv: 412_000, status: "live",    tier: "Gold",    kyc: "verified" },
  { name: "@codewithren",  plat: "YouTube",   followers: "1.8M", er: 8.2,  posts: 12, emv: 624_000, status: "live",    tier: "Diamond", kyc: "verified" },
  { name: "@luxbyjade",    plat: "TikTok",    followers: "4.2M", er: 12.4, posts: 48, emv: 884_000, status: "live",    tier: "Diamond", kyc: "verified" },
  { name: "@chefmarcoo",   plat: "Reels",     followers: "812k", er: 9.4,  posts: 18, emv: 218_000, status: "review",  tier: "Silver",  kyc: "pending"  },
  { name: "@quietgamer",   plat: "Twitch",    followers: "284k", er: 14.8, posts: 6,  emv: 142_000, status: "draft",   tier: "Bronze",  kyc: "pending"  },
  { name: "@studio.hana",  plat: "Instagram", followers: "612k", er: 7.2,  posts: 14, emv: 184_000, status: "live",    tier: "Gold",    kyc: "verified" },
  { name: "@travelmaven",  plat: "YouTube",   followers: "1.1M", er: 5.4,  posts: 9,  emv: 296_000, status: "live",    tier: "Gold",    kyc: "verified" },
  { name: "@beatslabx",    plat: "TikTok",    followers: "3.1M", er: 11.2, posts: 32, emv: 512_000, status: "review",  tier: "Diamond", kyc: "flagged"  },
];

const CAMPAIGNS = [
  { id: "CMP-401", name: "SS26 Capsule Launch",  brand: "LUXO",       budget: 240_000, spent: 168_000, creators: 12, stage: "Content",   ends: "Aug 12" },
  { id: "CMP-402", name: "Pro Tools v4 Reveal",  brand: "RenderKit",  budget: 120_000, spent:  42_000, creators:  6, stage: "Brief",     ends: "Aug 21" },
  { id: "CMP-403", name: "Hydrate Summer",       brand: "Aqualux",    budget:  84_000, spent:  74_000, creators:  8, stage: "Published", ends: "Aug 04" },
  { id: "CMP-404", name: "Game Night Series",    brand: "PlayForge",  budget:  60_000, spent:  22_000, creators:  4, stage: "Approved",  ends: "Sep 01" },
  { id: "CMP-405", name: "Studio Tour",          brand: "Formhaus",   budget:  38_000, spent:  38_000, creators:  2, stage: "Closed",    ends: "Jul 28" },
];

/* ============================================================
   INFLUENCER MANAGER (premium)
   ============================================================ */
type Tab =
  | "overview" | "creators" | "campaigns" | "applications"
  | "collaborations" | "content" | "wallet" | "rewards"
  | "analytics" | "verification" | "reports" | "comms" | "settings";

export function InfluencerPremium({ d }: { d: DashSpec }) {
  const s = useDashboardState();
  const { tab, setTab } = useTabs<Tab>("overview");
  const [creatorOpen, setCreatorOpen] = useState<typeof CREATORS[number] | null>(null);
  const [briefOpen, setBriefOpen] = useState<typeof CAMPAIGNS[number] | null>(null);
  const [newCampaign, setNewCampaign] = useState(false);

  const creators = useMemo(
    () => CREATORS.filter(x => x.name.toLowerCase().includes(s.filter.toLowerCase())),
    [s.filter],
  );
  const campaigns = useMemo(
    () => CAMPAIGNS.filter(c => `${c.name} ${c.brand}`.toLowerCase().includes(s.filter.toLowerCase())),
    [s.filter],
  );

  return (
    <PageShell d={d} toolbar={<DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive} />}>
      <Kpis items={[
        { label: "Creators",     value: "4,128",  delta: "+184", tone: "success" },
        { label: "Campaigns",    value: "248",    delta: "+12",  tone: "info" },
        { label: "Reach",        value: "148M",   delta: "+9%",  tone: "success" },
        { label: "EMV",          value: "$12.4M", delta: "+18%", tone: "success" },
        { label: "Payouts pend", value: "$284k",  delta: "−6%",  tone: "warning" },
        { label: "Compliance",   value: "98.4%",  delta: "+0.6", tone: "success" },
      ]}/>

      <TabBar<Tab> value={tab} onChange={setTab} tabs={[
        { id: "overview",       label: "Overview",       icon: "LayoutDashboard" },
        { id: "creators",       label: "Creators",       icon: "Users",     badge: CREATORS.length },
        { id: "campaigns",      label: "Campaigns",      icon: "Megaphone", badge: CAMPAIGNS.length },
        { id: "applications",   label: "Applications",   icon: "Inbox",     badge: 42 },
        { id: "collaborations", label: "Collabs",        icon: "Handshake", badge: 18 },
        { id: "content",        label: "Content",        icon: "Film",      badge: 312 },
        { id: "wallet",         label: "Wallet",         icon: "Wallet" },
        { id: "rewards",        label: "Rewards",        icon: "Trophy" },
        { id: "analytics",      label: "Analytics",      icon: "LineChart" },
        { id: "verification",   label: "Verification",   icon: "ShieldCheck", badge: 6 },
        { id: "reports",        label: "Reports",        icon: "FileText" },
        { id: "comms",          label: "Comms",          icon: "MessageSquare" },
        { id: "settings",       label: "Settings",       icon: "Settings" },
      ]} right={
        <button onClick={()=>setNewCampaign(true)} className="text-[11px] px-2 py-1 rounded-md bg-primary text-primary-foreground hover:opacity-90 inline-flex items-center gap-1">
          <Icons.Plus className="w-3 h-3"/>New Campaign
        </button>
      }/>

      {/* ==================== OVERVIEW ==================== */}
      {tab === "overview" && (
        <div className={grid}>
          <ChartCard title="Campaign Reach · 30d" span={8}>
            <LineSeries seed={11} lines={3} height={200}/>
            <div className="grid grid-cols-4 mt-3 text-center text-[11px]">
              <div><div className="text-muted-foreground">Reach</div><div className="font-semibold tabular-nums">148M</div></div>
              <div><div className="text-muted-foreground">Engagements</div><div className="font-semibold tabular-nums text-accent">12.8M</div></div>
              <div><div className="text-muted-foreground">EMV</div><div className="font-semibold tabular-nums text-success">$12.4M</div></div>
              <div><div className="text-muted-foreground">Avg ER</div><div className="font-semibold tabular-nums">8.4%</div></div>
            </div>
          </ChartCard>
          <ChartCard title="Sentiment Mix" span={4}>
            <div className="grid grid-cols-3 gap-2 place-items-center">
              <div className="text-center"><Donut value={72} label="positive" color="var(--color-success)" size={80}/></div>
              <div className="text-center"><Donut value={22} label="neutral" color="var(--color-muted-foreground)" size={80}/></div>
              <div className="text-center"><Donut value={6}  label="negative" color="var(--color-destructive)" size={80}/></div>
            </div>
          </ChartCard>
          <ChartCard title="Top Creators (EMV)" span={6}>
            <ul className="space-y-2 text-xs">
              {[...CREATORS].sort((a,b)=>b.emv-a.emv).slice(0,5).map(c => (
                <li key={c.name} className="flex items-center gap-3">
                  <Avatar name={c.name.replace("@","")} color="var(--color-accent)"/>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium truncate">{c.name}</span>
                      <span className="tabular-nums text-success">${(c.emv/1000).toFixed(0)}k</span>
                    </div>
                    <ProgressBar value={Math.min(100, c.emv/10000)} tone="success"/>
                  </div>
                </li>
              ))}
            </ul>
          </ChartCard>
          <ChartCard title="Posting Heatmap · 12 weeks" span={6}>
            <Heatmap rows={7} cols={12} seed={92} color="var(--color-accent)"/>
            <div className="mt-2 text-[11px] text-muted-foreground">Mon–Sun · engagement density</div>
          </ChartCard>
          <div className="col-span-12 lg:col-span-8">
            <AIInsights items={[
              { title: "Whitelist opportunity", body: "@luxbyjade content outperforms paid ads CPM by 4.2x — request whitelisting for a 14-day Spark Ads window.", tone: "accent", confidence: 93 },
              { title: "Compliance nudge",      body: "2 posts missing #ad disclosure — auto-notice queued for creator inbox.", tone: "warning",  confidence: 96 },
              { title: "Burnout signal",        body: "@chefmarcoo posting cadence dropped 38% — pause cadence, re-brief with creative freedom.", tone: "info", confidence: 82 },
            ]}/>
          </div>
          <ChartCard title="Quick actions" span={4}>
            <QuickActions items={[
              { label: "New brief",    icon: "FileText", tone: "primary",  onClick: ()=>setBriefOpen(CAMPAIGNS[0]) },
              { label: "Invite creator", icon: "UserPlus", tone: "accent" },
              { label: "Run payout",   icon: "Wallet",   tone: "success" },
              { label: "Approve KYC",  icon: "ShieldCheck", tone: "info", onClick: ()=>setTab("verification") },
              { label: "Export report",icon: "Download", tone: "info",     onClick: ()=>setTab("reports") },
            ]}/>
          </ChartCard>
        </div>
      )}

      {/* ==================== CREATORS ==================== */}
      {tab === "creators" && (
        <ChartCard title="Creator Roster" toolbar={
          <FilterBar value={s.filter} onChange={s.setFilter} placeholder="Search creators…"/>
        }>
          {creators.length === 0 ? (
            <EmptyState icon="Users" title="No creators match" hint="Try a different query"/>
          ) : (
            <DataTable columns={["Creator","Platform","Followers","ER","Tier","EMV","KYC","Status",""]} rows={
              creators.map((r,i)=>[
                <button key={i} onClick={()=>setCreatorOpen(r)} className="flex items-center gap-2 text-left hover:text-primary">
                  <Avatar name={r.name.replace("@","")} color="var(--color-accent)"/><span className="font-medium">{r.name}</span>
                </button>,
                <Pill key={i} tone="accent">{r.plat}</Pill>,
                <span key={i} className="tabular-nums">{r.followers}</span>,
                <span key={i} className="tabular-nums">{r.er}%</span>,
                <Pill key={i} tone={r.tier==="Diamond"?"info":r.tier==="Gold"?"warning":r.tier==="Silver"?"muted":"muted"}>{r.tier}</Pill>,
                <span key={i} className="tabular-nums text-success">${(r.emv/1000).toFixed(0)}k</span>,
                <Pill key={i} tone={r.kyc==="verified"?"success":r.kyc==="pending"?"warning":"destructive"}>{r.kyc}</Pill>,
                <Pill key={i} tone={r.status==="live"?"success":r.status==="review"?"warning":"info"}>{r.status}</Pill>,
                <button key={i} onClick={()=>setCreatorOpen(r)} className="text-[11px] text-primary hover:underline">Open</button>,
              ])
            }/>
          )}
        </ChartCard>
      )}

      {/* ==================== CAMPAIGNS ==================== */}
      {tab === "campaigns" && (
        <div className={grid}>
          <ChartCard title="Campaign Board" span={12} toolbar={
            <FilterBar value={s.filter} onChange={s.setFilter} placeholder="Filter by campaign or brand…" actions={
              <button onClick={()=>setNewCampaign(true)} className="text-[11px] px-2 py-1 rounded-md bg-primary text-primary-foreground">New</button>
            }/>
          }>
            {campaigns.length === 0 ? <EmptyState icon="Megaphone" title="No campaigns"/> : (
              <DataTable columns={["ID","Campaign","Brand","Budget","Spent","Creators","Stage","Ends",""]} rows={
                campaigns.map((c,i)=>[
                  <span key={i} className="text-[11px] text-muted-foreground tabular-nums">{c.id}</span>,
                  <span key={i} className="font-medium">{c.name}</span>,
                  <Pill key={i} tone="info">{c.brand}</Pill>,
                  <span key={i} className="tabular-nums">${(c.budget/1000).toFixed(0)}k</span>,
                  <span key={i} className="tabular-nums">${(c.spent/1000).toFixed(0)}k</span>,
                  <span key={i} className="tabular-nums">{c.creators}</span>,
                  <Pill key={i} tone={c.stage==="Published"?"success":c.stage==="Content"?"warning":c.stage==="Closed"?"muted":"info"}>{c.stage}</Pill>,
                  <span key={i} className="text-xs text-muted-foreground">{c.ends}</span>,
                  <button key={i} onClick={()=>setBriefOpen(c)} className="text-[11px] text-primary hover:underline">Brief</button>,
                ])
              }/>
            )}
          </ChartCard>
          <ChartCard title="Payouts by campaign" span={8}>
            <Bars seed={31} n={CAMPAIGNS.length*3} color="var(--color-success)" height={140}/>
          </ChartCard>
          <ChartCard title="Stage funnel" span={4}>
            <ul className="space-y-2 text-xs">
              {["Brief","Content","Approved","Published","Closed"].map((s2,i)=>(
                <li key={s2}><div className="flex justify-between text-[11px] mb-1"><span>{s2}</span><span className="tabular-nums text-muted-foreground">{[42,28,18,54,88][i]}</span></div>
                  <ProgressBar value={[35,55,68,82,96][i]} tone={i===3?"success":i===2?"info":"warning"}/>
                </li>
              ))}
            </ul>
          </ChartCard>
        </div>
      )}

      {/* ==================== APPLICATIONS ==================== */}
      {tab === "applications" && (
        <ChartCard title="Creator Applications" toolbar={<FilterBar value={s.filter} onChange={s.setFilter} placeholder="Search applications…"/>}>
          <DataTable columns={["Creator","Campaign","Platform","Rate","Fit","Submitted",""]} rows={[
            ["@nova.fit","SS26 Capsule","Instagram","$18k",92,"2d ago"],
            ["@luxbyjade","SS26 Capsule","TikTok","$24k",88,"1d ago"],
            ["@chefmarcoo","Hydrate Summer","Reels","$6k",74,"4h ago"],
            ["@quietgamer","Game Night","Twitch","$8k",81,"1h ago"],
            ["@travelmaven","Pro Tools v4","YouTube","$14k",68,"3d ago"],
          ].filter(r=>String(r[0]).toLowerCase().includes(s.filter.toLowerCase())).map((r,i)=>[
            <span key={i} className="font-medium">{r[0]}</span>,
            <span key={i}>{r[1]}</span>,
            <Pill key={i} tone="accent">{r[2]}</Pill>,
            <span key={i} className="tabular-nums">{r[3]}</span>,
            <span key={i} className="tabular-nums text-success">{r[4]}%</span>,
            <span key={i} className="text-muted-foreground">{r[5]}</span>,
            <span key={i} className="flex gap-1.5"><button className="text-[10px] px-1.5 py-0.5 rounded bg-success/15 text-success">Approve</button><button className="text-[10px] px-1.5 py-0.5 rounded bg-destructive/15 text-destructive">Reject</button></span>,
          ])}/>
        </ChartCard>
      )}

      {/* ==================== COLLABORATIONS ==================== */}
      {tab === "collaborations" && (
        <div className={grid}>
          <ChartCard title="Active collaborations" span={8}>
            <DataTable columns={["Brand","Creator","Deliverables","Milestone","Due"]} rows={[
              ["LUXO","@luxbyjade","2 Reels + 4 Stories","Content Review","Aug 12"],
              ["Aqualux","@nova.fit","6 Reels","Editing","Aug 08"],
              ["PlayForge","@quietgamer","2h Live Stream","Scheduled","Aug 22"],
              ["Formhaus","@studio.hana","Studio Tour Reel","Published","—"],
              ["RenderKit","@codewithren","30-min tutorial","Brief accepted","Aug 21"],
            ].map((r,i)=>[
              <Pill key={i} tone="info">{r[0]}</Pill>,
              <span key={i} className="font-medium">{r[1]}</span>,
              <span key={i} className="text-xs">{r[2]}</span>,
              <Pill key={i} tone={r[3]==="Published"?"success":"warning"}>{r[3]}</Pill>,
              <span key={i} className="text-xs text-muted-foreground">{r[4]}</span>,
            ])}/>
          </ChartCard>
          <ChartCard title="Contract health" span={4}>
            <div className="grid grid-cols-2 gap-3 place-items-center">
              <Donut value={84} label="signed" color="var(--color-success)" size={80}/>
              <Donut value={12} label="pending" color="var(--color-warning)" size={80}/>
              <Donut value={3}  label="expired" color="var(--color-destructive)" size={80}/>
              <Donut value={1}  label="disputed" color="var(--color-info)" size={80}/>
            </div>
          </ChartCard>
        </div>
      )}

      {/* ==================== CONTENT ==================== */}
      {tab === "content" && (
        <div className={grid}>
          <ChartCard title="Content Calendar · 30d" span={12}>
            <Heatmap rows={5} cols={30} seed={44} color="var(--color-primary)"/>
            <div className="mt-2 text-[11px] text-muted-foreground">Week × day cadence · click any cell in the library to open the asset</div>
          </ChartCard>
          <ChartCard title="Content Library" span={12} toolbar={
            <FilterBar value={s.filter} onChange={s.setFilter} placeholder="Search assets…"/>
          }>
            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-3">
              {Array.from({length:12}).map((_,i)=>(
                <div key={i} className="rounded-lg border border-border overflow-hidden bg-muted/40">
                  <div className="aspect-square grid place-items-center bg-gradient-to-br from-primary/20 to-accent/10 text-muted-foreground">
                    <Icons.Film className="w-6 h-6"/>
                  </div>
                  <div className="p-2">
                    <div className="text-[11px] font-medium truncate">Reel_{100+i}.mp4</div>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-[10px] text-muted-foreground">{["nova.fit","luxbyjade","chefmarcoo","studio.hana"][i%4]}</span>
                      <Pill tone={i%3===0?"success":i%3===1?"warning":"info"}>{i%3===0?"live":i%3===1?"review":"draft"}</Pill>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      )}

      {/* ==================== WALLET ==================== */}
      {tab === "wallet" && (
        <div className={grid}>
          <ChartCard title="Payouts · trailing 90d" span={8}>
            <Bars seed={51} n={30} color="var(--color-success)" height={140}/>
            <div className="mt-3 grid grid-cols-3 text-center text-[11px]">
              <div><div className="text-muted-foreground">Pending</div><div className="font-semibold tabular-nums text-warning">$284k</div></div>
              <div><div className="text-muted-foreground">Approved</div><div className="font-semibold tabular-nums">$612k</div></div>
              <div><div className="text-muted-foreground">Paid MTD</div><div className="font-semibold tabular-nums text-success">$1.04M</div></div>
            </div>
          </ChartCard>
          <ChartCard title="Wallet balances" span={4}>
            <ul className="space-y-3 text-xs">
              {[
                { label: "Escrow",       value: "$284,000", tone: "warning" as const },
                { label: "Available",    value: "$612,000", tone: "success" as const },
                { label: "In-flight",    value: "$142,000", tone: "info"    as const },
                { label: "Reserved tax", value: "$ 42,000", tone: "muted"   as const },
              ].map(b=>(
                <li key={b.label} className="flex justify-between">
                  <span className="text-muted-foreground">{b.label}</span>
                  <span className="tabular-nums font-semibold"><Pill tone={b.tone}>{b.value}</Pill></span>
                </li>
              ))}
            </ul>
          </ChartCard>
          <ChartCard title="Recent ledger" span={12}>
            <DataTable columns={["Date","Creator","Campaign","Type","Amount","Status"]} rows={[
              ["Jul 20","@luxbyjade","SS26 Capsule","Milestone","$8,000","Paid"],
              ["Jul 19","@nova.fit","Hydrate","Bonus","$1,200","Paid"],
              ["Jul 18","@codewithren","Pro Tools v4","Milestone","$14,000","Approved"],
              ["Jul 17","@chefmarcoo","Hydrate","Milestone","$3,000","Pending"],
              ["Jul 15","@quietgamer","Game Night","Retainer","$4,000","Escrow"],
            ].map((r,i)=>[
              <span key={i} className="text-xs text-muted-foreground">{r[0]}</span>,
              <span key={i} className="font-medium">{r[1]}</span>,
              <span key={i}>{r[2]}</span>,
              <Pill key={i} tone="info">{r[3]}</Pill>,
              <span key={i} className="tabular-nums">{r[4]}</span>,
              <Pill key={i} tone={r[5]==="Paid"?"success":r[5]==="Pending"?"warning":r[5]==="Escrow"?"info":"info"}>{r[5]}</Pill>,
            ])}/>
          </ChartCard>
        </div>
      )}

      {/* ==================== REWARDS ==================== */}
      {tab === "rewards" && (
        <div className={grid}>
          <ChartCard title="Leaderboard · this month" span={8}>
            <DataTable columns={["Rank","Creator","Tier","XP","Streak","Badges"]} rows={
              [...CREATORS].sort((a,b)=>b.emv-a.emv).map((c,i)=>[
                <span key={i} className="tabular-nums font-semibold">#{i+1}</span>,
                <span key={i} className="font-medium">{c.name}</span>,
                <Pill key={i} tone={c.tier==="Diamond"?"info":c.tier==="Gold"?"warning":"muted"}>{c.tier}</Pill>,
                <span key={i} className="tabular-nums">{(c.emv/100).toFixed(0)}</span>,
                <span key={i} className="tabular-nums">{(3+i)}w</span>,
                <span key={i} className="flex gap-1">{["🏆","⭐","🚀","🎯","🔥"].slice(0,(i%4)+1).map((b,j)=><span key={j}>{b}</span>)}</span>,
              ])
            }/>
          </ChartCard>
          <ChartCard title="Achievements" span={4}>
            <ul className="space-y-2 text-xs">
              {[
                { label: "1M reach", pct: 100, tone: "success" as const },
                { label: "10 campaigns", pct: 80,  tone: "info" as const },
                { label: "Diamond tier", pct: 62,  tone: "warning" as const },
                { label: "0 disclosure misses", pct: 94, tone: "success" as const },
              ].map(a=>(
                <li key={a.label}>
                  <div className="flex justify-between text-[11px]"><span>{a.label}</span><span className="tabular-nums text-muted-foreground">{a.pct}%</span></div>
                  <ProgressBar value={a.pct} tone={a.tone}/>
                </li>
              ))}
            </ul>
          </ChartCard>
        </div>
      )}

      {/* ==================== ANALYTICS ==================== */}
      {tab === "analytics" && (
        <div className={grid}>
          <ChartCard title="Engagement · 30d" span={8}><LineSeries seed={22} lines={4} height={220}/></ChartCard>
          <ChartCard title="Platform split" span={4}>
            <div className="grid grid-cols-2 gap-2 place-items-center">
              <Donut value={38} label="Instagram" color="var(--color-primary)" size={80}/>
              <Donut value={28} label="TikTok"    color="var(--color-accent)" size={80}/>
              <Donut value={22} label="YouTube"   color="var(--color-info)" size={80}/>
              <Donut value={12} label="Other"     color="var(--color-muted-foreground)" size={80}/>
            </div>
          </ChartCard>
          <ChartCard title="Reach vs EMV" span={6}><Bars seed={71} n={16} color="var(--color-accent)" height={140}/></ChartCard>
          <ChartCard title="Cadence heatmap" span={6}><Heatmap rows={7} cols={24} seed={81} color="var(--color-primary)"/></ChartCard>
        </div>
      )}

      {/* ==================== VERIFICATION ==================== */}
      {tab === "verification" && (
        <ChartCard title="KYC & Verification queue" toolbar={<FilterBar value={s.filter} onChange={s.setFilter} placeholder="Search creators…"/>}>
          <DataTable columns={["Creator","Country","Doc type","Submitted","Risk","Status",""]} rows={
            creators.map((c,i)=>[
              <span key={i} className="font-medium">{c.name}</span>,
              <span key={i}>{["IN","US","UK","BR","DE","JP","FR","SG"][i%8]}</span>,
              <Pill key={i} tone="info">{i%2===0?"Passport":"ID Card"}</Pill>,
              <span key={i} className="text-xs text-muted-foreground">{i+1}d ago</span>,
              <span key={i} className={`tabular-nums ${c.kyc==="flagged"?"text-destructive":c.kyc==="pending"?"text-warning":"text-success"}`}>{c.kyc==="flagged"?"HIGH":c.kyc==="pending"?"MED":"LOW"}</span>,
              <Pill key={i} tone={c.kyc==="verified"?"success":c.kyc==="pending"?"warning":"destructive"}>{c.kyc}</Pill>,
              <span key={i} className="flex gap-1.5">
                <button className="text-[10px] px-1.5 py-0.5 rounded bg-success/15 text-success">Approve</button>
                <button className="text-[10px] px-1.5 py-0.5 rounded bg-destructive/15 text-destructive">Reject</button>
              </span>,
            ])
          }/>
        </ChartCard>
      )}

      {/* ==================== REPORTS ==================== */}
      {tab === "reports" && (
        <div className={grid}>
          <ChartCard title="Saved reports" span={8}>
            <DataTable columns={["Name","Type","Owner","Updated","Schedule",""]} rows={[
              ["Q3 Creator EMV","Analytics","Meera S.","2d ago","Weekly"],
              ["Campaign ROI · SS26","Campaign","Diego R.","1d ago","On demand"],
              ["Payout ledger · Jul","Finance","Priya V.","3h ago","Monthly"],
              ["Compliance audit","Compliance","Akira K.","5d ago","Monthly"],
              ["Top creators · APAC","Discovery","Sven O.","1w ago","On demand"],
            ].map((r,i)=>[
              <span key={i} className="font-medium">{r[0]}</span>,
              <Pill key={i} tone="info">{r[1]}</Pill>,
              <span key={i} className="text-xs">{r[2]}</span>,
              <span key={i} className="text-xs text-muted-foreground">{r[3]}</span>,
              <span key={i} className="text-xs">{r[4]}</span>,
              <span key={i} className="flex gap-1.5">
                <button className="text-[10px] px-1.5 py-0.5 rounded bg-primary/15 text-primary">Run</button>
                <button className="text-[10px] px-1.5 py-0.5 rounded bg-muted">Export</button>
              </span>,
            ])}/>
          </ChartCard>
          <ChartCard title="Export queue" span={4}>
            <ul className="space-y-2 text-xs">
              {["EMV Q3.pdf","Ledger Jul.csv","Compliance.xlsx"].map((f,i)=>(
                <li key={f} className="flex items-center justify-between rounded border border-border bg-card/50 p-2">
                  <span className="inline-flex items-center gap-2"><Icons.FileDown className="w-3.5 h-3.5 text-muted-foreground"/>{f}</span>
                  <Pill tone={i===0?"success":i===1?"warning":"info"}>{i===0?"ready":i===1?"queued":"building"}</Pill>
                </li>
              ))}
            </ul>
          </ChartCard>
        </div>
      )}

      {/* ==================== COMMS ==================== */}
      {tab === "comms" && (
        <div className={grid}>
          <ChartCard title="Creator inbox" span={5}>
            <ul className="space-y-1">
              {["@luxbyjade","@nova.fit","@codewithren","@chefmarcoo","@quietgamer"].map((n,i)=>(
                <li key={n}><button className="w-full flex items-center justify-between px-2 py-1.5 rounded text-left hover:bg-muted/50">
                  <span className="inline-flex items-center gap-2"><Avatar name={n.replace("@","")} color="var(--color-accent)"/><span className="text-xs font-medium">{n}</span></span>
                  {i<2 && <span className="text-[10px] bg-destructive text-destructive-foreground px-1.5 rounded-full">{i+1}</span>}
                </button></li>
              ))}
            </ul>
          </ChartCard>
          <ChartCard title="Thread · @luxbyjade" span={7}>
            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {[
                { u:"@luxbyjade", c:"accent",  t:"Uploaded edit v2 with new hook — needs review", time:"14:22" },
                { u:"Meera S.",   c:"primary", t:"Watching now. CTA feels strong.", time:"14:24" },
                { u:"@luxbyjade", c:"accent",  t:"Also — can we move the drop date to Aug 14?", time:"14:26" },
                { u:"Meera S.",   c:"primary", t:"Approving. Contract addendum going out today.", time:"14:30" },
              ].map((m,i)=>(
                <div key={i} className="flex gap-3"><Avatar name={m.u.replace("@","")} color={`var(--color-${m.c})`}/>
                  <div className="flex-1">
                    <div className="text-xs"><span className="font-semibold">{m.u}</span><span className="text-muted-foreground ml-1">{m.time}</span></div>
                    <div className="text-sm">{m.t}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <input placeholder="Reply to @luxbyjade" className="flex-1 bg-muted text-xs rounded-md px-2 py-1.5 border border-border outline-none focus:border-primary"/>
              <button className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs">Send</button>
            </div>
          </ChartCard>
        </div>
      )}

      {/* ==================== SETTINGS ==================== */}
      {tab === "settings" && (
        <div className={grid}>
          <ChartCard title="Program settings" span={6}>
            <ul className="text-xs space-y-2">
              <li className="flex justify-between"><span>Auto-approve trusted creators</span><Pill tone="success">on</Pill></li>
              <li className="flex justify-between"><span>Require #ad disclosure</span><Pill tone="success">on</Pill></li>
              <li className="flex justify-between"><span>Escrow release · 7 days after publish</span><Pill tone="info">policy</Pill></li>
              <li className="flex justify-between"><span>2FA for payouts &gt; $10k</span><Pill tone="success">on</Pill></li>
              <li className="flex justify-between"><span>AI brief suggestions</span><Pill tone="info">beta</Pill></li>
            </ul>
          </ChartCard>
          <ChartCard title="Ecosystem connections" span={6}>
            <ul className="text-xs space-y-2">
              {[
                { m: "Wallet", to: "/d/payments" },
                { m: "Analytics", to: "/d/analytics" },
                { m: "Marketing", to: "/d/marketing" },
                { m: "Achievements", to: "/d/achievements" },
                { m: "Notifications", to: "/d/broadcast" },
                { m: "Creator app dashboard", to: "/dashboard/influencer" },
              ].map(c=>(
                <li key={c.m} className="flex items-center justify-between">
                  <span>{c.m}</span>
                  <a href={c.to} className="text-primary hover:underline text-[11px]">Open →</a>
                </li>
              ))}
            </ul>
          </ChartCard>
        </div>
      )}

      {/* ==================== MODALS ==================== */}
      <Modal open={!!creatorOpen} onClose={()=>setCreatorOpen(null)} title={`Creator · ${creatorOpen?.name ?? ""}`} size="lg"
        footer={<>
          <button onClick={()=>setCreatorOpen(null)} className="px-3 py-1.5 rounded-md bg-muted text-xs">Close</button>
          <button className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs inline-flex items-center gap-1.5"><Icons.Send className="w-3.5 h-3.5"/>Send brief</button>
        </>}>
        {creatorOpen && (
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="col-span-2 flex items-center gap-3">
              <Avatar name={creatorOpen.name.replace("@","")} color="var(--color-accent)" size={40}/>
              <div>
                <div className="text-sm font-semibold">{creatorOpen.name}</div>
                <div className="text-muted-foreground">{creatorOpen.plat} · {creatorOpen.followers} followers · ER {creatorOpen.er}%</div>
              </div>
              <div className="ml-auto flex gap-1.5">
                <Pill tone={creatorOpen.tier==="Diamond"?"info":"warning"}>{creatorOpen.tier}</Pill>
                <Pill tone={creatorOpen.kyc==="verified"?"success":"warning"}>KYC {creatorOpen.kyc}</Pill>
              </div>
            </div>
            <div><div className="text-muted-foreground text-[10px] uppercase tracking-wider">EMV</div><div className="mt-0.5 text-sm text-success tabular-nums">${(creatorOpen.emv/1000).toFixed(0)}k</div></div>
            <div><div className="text-muted-foreground text-[10px] uppercase tracking-wider">Posts</div><div className="mt-0.5 text-sm tabular-nums">{creatorOpen.posts}</div></div>
            <div className="col-span-2"><div className="text-muted-foreground text-[10px] uppercase tracking-wider mb-1">Engagement · 30d</div><Spark seed={9} height={40}/></div>
          </div>
        )}
      </Modal>

      <Modal open={!!briefOpen} onClose={()=>setBriefOpen(null)} title={`Brief · ${briefOpen?.name ?? ""}`} size="lg"
        footer={<>
          <button onClick={()=>setBriefOpen(null)} className="px-3 py-1.5 rounded-md bg-muted text-xs">Cancel</button>
          <button className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs inline-flex items-center gap-1.5"><Icons.Send className="w-3.5 h-3.5"/>Send brief</button>
        </>}>
        {briefOpen && (
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-muted-foreground text-[10px] uppercase tracking-wider">Brand</label><input defaultValue={briefOpen.brand} className="mt-1 w-full bg-muted rounded-md px-2 py-1.5 border border-border outline-none"/></div>
              <div><label className="text-muted-foreground text-[10px] uppercase tracking-wider">Budget</label><input defaultValue={`$${(briefOpen.budget/1000).toFixed(0)}k`} className="mt-1 w-full bg-muted rounded-md px-2 py-1.5 border border-border outline-none"/></div>
            </div>
            <div><label className="text-muted-foreground text-[10px] uppercase tracking-wider">Deliverables</label><textarea rows={3} defaultValue="2 Reels + 4 Stories · #ad required" className="mt-1 w-full bg-muted rounded-md px-2 py-1.5 border border-border outline-none"/></div>
          </div>
        )}
      </Modal>

      <Modal open={newCampaign} onClose={()=>setNewCampaign(false)} title="New Campaign" size="md"
        footer={<>
          <button onClick={()=>setNewCampaign(false)} className="px-3 py-1.5 rounded-md bg-muted text-xs">Cancel</button>
          <button onClick={()=>setNewCampaign(false)} className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs">Create</button>
        </>}>
        <div className="space-y-3 text-xs">
          <div><label className="text-muted-foreground text-[10px] uppercase tracking-wider">Name</label><input placeholder="Campaign name" className="mt-1 w-full bg-muted rounded-md px-2 py-1.5 border border-border outline-none"/></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-muted-foreground text-[10px] uppercase tracking-wider">Brand</label><input placeholder="Brand" className="mt-1 w-full bg-muted rounded-md px-2 py-1.5 border border-border outline-none"/></div>
            <div><label className="text-muted-foreground text-[10px] uppercase tracking-wider">Budget</label><input placeholder="$" className="mt-1 w-full bg-muted rounded-md px-2 py-1.5 border border-border outline-none"/></div>
          </div>
        </div>
      </Modal>
    </PageShell>
  );
}
