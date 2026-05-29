import { useMemo, useState } from "react";
import * as Icons from "lucide-react";
import type { DashSpec } from "@/data/dashboards";
import {
  Pill, Donut, Bars, LineSeries, Heatmap, Timeline, WorldMap, Spark,
  DataTable, ProgressBar, Avatar, StatusDot, Kanban,
} from "./_primitives";
import {
  ChartCard, AIInsights, DashboardToolbar, Modal, TabBar, FilterBar,
  QuickActions, EmptyState, useDashboardState, useTabs,
} from "./_universal";

/* ============================================================
   CATEGORY 03 — CRM + Sales + Customer Success (multi-tab)
   CRM · Sales Pipeline · Billing · Support · Customer Success · Onboarding
   ============================================================ */

const grid = "grid grid-cols-12 gap-4";

function Header({ d, right }: { d: DashSpec; right?: React.ReactNode }) {
  const Icon = (Icons as never as Record<string, Icons.LucideIcon>)[d.icon] || Icons.Briefcase;
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
        {d.tags.slice(0, 3).map((t) => (
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
          <div className={`mt-1 ${map[m.tone || "info"]}`}><Spark seed={i + 3} height={22} /></div>
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

/* ============================================================
   1. CRM
   ============================================================ */
type CRMTab = "pipeline" | "inbox" | "accounts" | "activity";
export function CRM({ d }: { d: DashSpec }) {
  const s = useDashboardState();
  const { tab, setTab } = useTabs<CRMTab>("pipeline");
  const [open, setOpen] = useState(false);

  const leads = useMemo(() => Array.from({ length: 9 }).map((_, i) => ({
    name: ["Acme Corp", "Globex", "Initech", "Umbrella", "Stark Ind", "Wayne Ent", "Tyrell", "Hooli", "Pied Piper"][i],
    contact: ["meera", "rao", "sven", "luna", "akira", "diego", "priya", "tara", "otis"][i] + "@" + ["acme","globex","initech","umb","stark","wayne","tyrell","hooli","pp"][i] + ".io",
    score: [92, 78, 64, 88, 71, 55, 84, 42, 96][i],
    stage: ["Qualify","Discover","Propose","Negotiate","Closed-Won","Discover","Propose","Disqualified","Qualify"][i],
    value: [82,148,32,212,98,18,124,0,402][i],
  })), []);
  const filtered = leads.filter(l => l.name.toLowerCase().includes(s.filter.toLowerCase()));

  return (
    <PageShell d={d} toolbar={<DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive} />}>
      <Kpis items={[
        { label: "Open pipeline", value: "$4.82M", delta: "+12.4%", tone: "success" },
        { label: "Active leads", value: "1,284", delta: "+82", tone: "info" },
        { label: "Win rate", value: "34%", delta: "+2.1pp", tone: "success" },
        { label: "Avg cycle", value: "42d", delta: "-3d", tone: "success" },
        { label: "Stalled", value: "61", tone: "warning" },
        { label: "Forecast Q2", value: "$2.1M", tone: "info" },
      ]} />
      <FilterBar value={s.filter} onChange={s.setFilter} placeholder="Search accounts, contacts, deals…" />
      <TabBar<CRMTab>
        value={tab} onChange={setTab}
        tabs={[
          { id: "pipeline", label: "Pipeline", icon: "TrendingUp" },
          { id: "inbox", label: "Lead Inbox", icon: "Inbox", badge: filtered.length },
          { id: "accounts", label: "Accounts", icon: "Building2" },
          { id: "activity", label: "Activity", icon: "Activity" },
        ]}
        right={<button onClick={() => setOpen(true)} className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium inline-flex items-center gap-1.5"><Icons.Plus className="w-3.5 h-3.5"/>New Lead</button>}
      />

      {tab === "pipeline" && (
        <div className={grid}>
          <ChartCard span={8} title="Pipeline Velocity" subtitle="Lead → Won conversion by stage">
            <LineSeries seed={17} lines={3} height={200} />
          </ChartCard>
          <ChartCard span={4} title="Win Rate" className="grid place-items-center">
            <Donut value={34} label="win rate" color="var(--color-success)" />
          </ChartCard>
          <ChartCard span={12} title="Stage Health">
            <Bars seed={9} n={32} color="var(--color-primary)" height={120} />
          </ChartCard>
        </div>
      )}

      {tab === "inbox" && (
        <div className={grid}>
          <ChartCard span={8} title="Lead Inbox">
            {filtered.length === 0 ? (
              <EmptyState icon="Search" title="No matching leads" hint="Adjust your filter or clear it." />
            ) : (
              <DataTable
                columns={["Account", "Contact", "Score", "Stage", "Value", ""]}
                rows={filtered.map((l, i) => [
                  l.name,
                  <span key={i} className="text-muted-foreground">{l.contact}</span>,
                  <div key={i} className="flex items-center gap-2 w-24">
                    <ProgressBar value={l.score} color={l.score > 75 ? "var(--color-success)" : l.score > 50 ? "var(--color-warning)" : "var(--color-destructive)"} />
                    <span className="text-[10px] tabular-nums">{l.score}</span>
                  </div>,
                  <Pill key={i} tone={l.stage === "Closed-Won" ? "success" : l.stage === "Disqualified" ? "muted" : "info"}>{l.stage}</Pill>,
                  <span key={i} className="tabular-nums">${l.value}k</span>,
                  <button key={i} onClick={() => setOpen(true)} className="text-[11px] text-primary hover:underline">Open</button>,
                ])}
              />
            )}
          </ChartCard>
          <div className="col-span-12 lg:col-span-4 space-y-4">
            <ChartCard title="Quick Actions">
              <QuickActions items={[
                { label: "New Lead", icon: "UserPlus", tone: "primary", onClick: () => setOpen(true) },
                { label: "Import CSV", icon: "Upload", tone: "info" },
                { label: "Sync Outlook", icon: "RefreshCw", tone: "accent" },
                { label: "Run Cadence", icon: "Send", tone: "success" },
              ]} />
            </ChartCard>
            <AIInsights items={[
              { title: "Pied Piper trending hot", body: "Score jumped +18 after pricing-page revisit. Recommend outreach within 24h.", tone: "success", confidence: 91 },
              { title: "Stale: Hooli", body: "No activity in 21 days. Consider nurturing sequence or disqualify.", tone: "warning", confidence: 76 },
            ]} />
          </div>
        </div>
      )}

      {tab === "accounts" && (
        <div className={grid}>
          <ChartCard span={12} title="Top Accounts by ARR">
            <DataTable columns={["Account","Owner","ARR","Health","Tier","Renewal"]} rows={Array.from({length:8}).map((_,i)=>{
              const h = [92,68,42,88,76,28,82,58][i];
              return [
                ["Acme","Globex","Initech","Umbrella","Stark","Wayne","Tyrell","Hooli"][i],
                ["Mira","Otis","Pia","Rao","Sven","Tara","Una","Vik"][i],
                <span key={i} className="tabular-nums">${(i+1)*128}k</span>,
                <div key={i} className="flex items-center gap-2 w-32"><ProgressBar value={h} color={h>70?"var(--color-success)":h>50?"var(--color-warning)":"var(--color-destructive)"}/><span className="text-[10px] tabular-nums">{h}</span></div>,
                <Pill key={i} tone={i<2?"accent":"muted"}>{i<2?"Strategic":"Growth"}</Pill>,
                `${22+i*9}d`,
              ];
            })}/>
          </ChartCard>
        </div>
      )}

      {tab === "activity" && (
        <div className={grid}>
          <ChartCard span={7} title="Activity Timeline">
            <Timeline items={[
              { time: "now", title: "Pied Piper · Demo scheduled w/ CTO", tone: "success" },
              { time: "12m", title: "Acme · Proposal v3 sent ($82k ARR)", tone: "info" },
              { time: "1h", title: "Stark · Procurement loop opened", tone: "warning" },
              { time: "3h", title: "Hooli · Marked unresponsive", tone: "muted" },
              { time: "6h", title: "Wayne · Closed-Won 🎉 ($98k ARR)", tone: "success" },
            ]} />
          </ChartCard>
          <ChartCard span={5} title="Touchpoints · 30d">
            <Heatmap rows={6} cols={28} seed={9} color="var(--color-info)" />
          </ChartCard>
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Create Lead" size="md"
        footer={<>
          <button onClick={() => setOpen(false)} className="px-3 py-1.5 text-xs rounded-md border border-border hover:bg-muted">Cancel</button>
          <button onClick={() => setOpen(false)} className="px-3 py-1.5 text-xs rounded-md bg-primary text-primary-foreground hover:opacity-90">Create</button>
        </>}>
        <div className="space-y-3">
          {["Account name", "Primary contact", "Email", "Estimated ARR"].map(l => (
            <div key={l}>
              <label className="text-[11px] text-muted-foreground">{l}</label>
              <input className="mt-1 w-full bg-muted text-xs rounded-md px-2 py-1.5 border border-border outline-none focus:border-primary" />
            </div>
          ))}
        </div>
      </Modal>
    </PageShell>
  );
}

/* ============================================================
   2. Sales Pipeline
   ============================================================ */
type SPTab = "board" | "forecast" | "reps" | "activity";
export function SalesPipeline({ d }: { d: DashSpec }) {
  const s = useDashboardState();
  const { tab, setTab } = useTabs<SPTab>("board");
  return (
    <PageShell d={d} toolbar={<DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive} />}>
      <Kpis items={[
        { label: "Commit", value: "$2.1M", delta: "+8%", tone: "success" },
        { label: "Best case", value: "$2.6M", tone: "info" },
        { label: "Plan", value: "$2.4M", tone: "info" },
        { label: "Open deals", value: "184", delta: "+12", tone: "success" },
        { label: "Avg deal", value: "$48k", tone: "info" },
        { label: "Slipping", value: "9", tone: "warning" },
      ]} />
      <TabBar<SPTab>
        value={tab} onChange={setTab}
        tabs={[
          { id: "board", label: "Deal Board", icon: "Columns3" },
          { id: "forecast", label: "Forecast", icon: "TrendingUp" },
          { id: "reps", label: "Reps", icon: "Users" },
          { id: "activity", label: "Activity", icon: "Activity" },
        ]}
      />

      {tab === "board" && (
        <div className={grid}>
          <ChartCard span={12} title="Pipeline by Stage">
            <Kanban columns={[
              { title: "Discover", tone: "info", items: [
                { title: "Acme · Renewal", meta: "$82k", tag: "Q2" },
                { title: "Globex · New", meta: "$148k", tag: "Q2" },
                { title: "Tyrell · Expand", meta: "$48k", tag: "Q3" },
              ]},
              { title: "Qualify", tone: "warning", items: [
                { title: "Pied Piper", meta: "$402k", tag: "Strategic" },
                { title: "Stark Ind", meta: "$212k", tag: "Q2" },
              ]},
              { title: "Propose", tone: "info", items: [
                { title: "Initech · Tier", meta: "$32k" },
                { title: "Wayne Ent", meta: "$98k", tag: "Hot" },
              ]},
              { title: "Negotiate", tone: "warning", items: [
                { title: "Umbrella", meta: "$212k", tag: "Legal" },
              ]},
              { title: "Closed-Won", tone: "success", items: [
                { title: "Soylent", meta: "$148k" },
                { title: "Massive Dyn.", meta: "$84k" },
              ]},
            ]}/>
          </ChartCard>
        </div>
      )}

      {tab === "forecast" && (
        <div className={grid}>
          <ChartCard span={8} title="Forecast vs Plan">
            <LineSeries seed={9} lines={2} height={220}/>
          </ChartCard>
          <ChartCard span={4} title="Quota Attainment" className="grid place-items-center">
            <Donut value={87} label="of plan" color="var(--color-primary)"/>
          </ChartCard>
          <AIInsights items={[
            { title: "Forecast risk", body: "Q2 commit -$420k vs plan if Stark doesn't close by month-end.", tone: "destructive", confidence: 84 },
            { title: "Upside in Wayne Ent", body: "Buying signals +220% this week; consider pulling forward into commit.", tone: "success", confidence: 78 },
          ]}/>
        </div>
      )}

      {tab === "reps" && (
        <div className={grid}>
          <ChartCard span={7} title="Quota Attainment · Reps">
            {[
              ["Akira K.", 142], ["Meera S.", 118], ["Diego R.", 96], ["Luna T.", 88], ["Sven P.", 64], ["Priya R.", 42],
            ].map(([n, v], i) => (
              <div key={i} className="py-1.5">
                <div className="flex justify-between text-xs">
                  <span className="flex items-center gap-2"><Avatar name={n as string}/> {n}</span>
                  <span className={`tabular-nums ${(v as number) >= 100 ? "text-success" : "text-warning"}`}>{v as number}%</span>
                </div>
                <ProgressBar value={Math.min(v as number, 150) / 1.5} color={(v as number) >= 100 ? "var(--color-success)" : "var(--color-warning)"} />
              </div>
            ))}
          </ChartCard>
          <ChartCard span={5} title="Leaderboard · Closed-Won">
            <DataTable columns={["Rep","Deals","ARR","Win%"]} rows={[
              ["Akira K.","18","$842k","48%"],["Meera S.","14","$612k","41%"],["Diego R.","9","$398k","32%"],
              ["Luna T.","7","$284k","28%"],["Sven P.","4","$148k","21%"],
            ]}/>
          </ChartCard>
        </div>
      )}

      {tab === "activity" && (
        <div className={grid}>
          <ChartCard span={12} title="Activity Heat · Calls × Days">
            <Heatmap rows={6} cols={28} seed={3} color="var(--color-success)" />
          </ChartCard>
        </div>
      )}
    </PageShell>
  );
}

/* ============================================================
   3. Billing
   ============================================================ */
type BillTab = "overview" | "payments" | "payouts" | "disputes";
export function Billing({ d }: { d: DashSpec }) {
  const s = useDashboardState();
  const { tab, setTab } = useTabs<BillTab>("overview");
  return (
    <PageShell d={d} toolbar={<DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive} />}>
      <Kpis items={[
        { label: "Gross volume", value: "$1.42M", delta: "+12%", tone: "success" },
        { label: "Auth rate", value: "94.2%", delta: "+0.4pp", tone: "success" },
        { label: "Refunds", value: "$18.4k", tone: "warning" },
        { label: "MRR", value: "$284k", delta: "+$12k", tone: "success" },
        { label: "Disputes", value: "12", tone: "destructive" },
        { label: "Fees", value: "$42k", tone: "info" },
      ]} />
      <TabBar<BillTab>
        value={tab} onChange={setTab}
        tabs={[
          { id: "overview", label: "Overview", icon: "LineChart" },
          { id: "payments", label: "Payments", icon: "CreditCard" },
          { id: "payouts", label: "Payouts", icon: "Wallet" },
          { id: "disputes", label: "Disputes", icon: "AlertTriangle", badge: 12 },
        ]}
      />

      {tab === "overview" && (
        <div className={grid}>
          <ChartCard span={8} title="Gross Volume · 30d"><LineSeries seed={5} lines={2} height={220}/></ChartCard>
          <ChartCard span={4} title="Authorization Rate" className="grid place-items-center">
            <Donut value={94} label="auth ok" color="var(--color-info)" />
          </ChartCard>
          <ChartCard span={12} title="Geo Volume">
            <WorldMap seed={4}/>
          </ChartCard>
        </div>
      )}

      {tab === "payments" && (
        <div className={grid}>
          <ChartCard span={12} title="Recent Payments">
            <DataTable columns={["Charge", "Customer", "Method", "Amount", "Status"]} rows={Array.from({length:10}).map((_,i)=>[
              <span key={i} className="font-mono text-[11px]">ch_{(48201+i).toString(36)}</span>,
              ["acme","globex","init","umb","stark","wayne","tyrell","hooli","pp","soy"][i] + "@io",
              ["Visa •4242","Amex •0005","Mc •3333","Visa •1881","ACH","SEPA","Visa •0341","Mc •8210","Visa •9921","ACH"][i],
              <span key={i} className="tabular-nums">${(i+1)*128}.{(i*7)%100}</span>,
              <Pill key={i} tone={["success","success","warning","success","success","destructive","success","success","success","warning"][i] as never}>
                {["Succeeded","Succeeded","Pending","Succeeded","Succeeded","Failed","Succeeded","Succeeded","Succeeded","Pending"][i]}
              </Pill>,
            ])}/>
          </ChartCard>
        </div>
      )}

      {tab === "payouts" && (
        <div className={grid}>
          <ChartCard span={5} title="Payout Schedule">
            {["Today","Tomorrow","Wed","Thu","Fri"].map((d2,i)=>(
              <div key={d2} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-2"><Icons.CalendarDays className="w-3.5 h-3.5 text-muted-foreground"/><span className="text-xs">{d2}</span></div>
                <span className="text-sm font-semibold tabular-nums">${[48,32,84,18,42][i]}.2k</span>
              </div>
            ))}
          </ChartCard>
          <ChartCard span={7} title="Payout History"><Bars seed={11} n={28} color="var(--color-primary)" height={160}/></ChartCard>
        </div>
      )}

      {tab === "disputes" && (
        <div className={grid}>
          <ChartCard span={6} title="Disputes & Risk">
            <div className="grid grid-cols-3 gap-3 mb-3">
              {[["Open","12","destructive"],["Won","48","success"],["Lost","6","warning"]].map(([l,v,t],i)=>(
                <div key={i} className="rounded-md border border-border p-3 text-center">
                  <div className="text-[10px] text-muted-foreground uppercase">{l}</div>
                  <div className={`text-xl font-bold text-${t}`}>{v}</div>
                </div>
              ))}
            </div>
            <Bars seed={6} n={20} color="var(--color-destructive)" height={100}/>
          </ChartCard>
          <ChartCard span={6} title="Recent Disputes">
            <DataTable columns={["Charge","Reason","Amount","Due"]} rows={Array.from({length:6}).map((_,i)=>[
              <span key={i} className="font-mono text-[11px]">dp_{(91024+i).toString(36)}</span>,
              ["Fraudulent","Product not received","Duplicate","Subscription canceled","Fraudulent","General"][i],
              <span key={i} className="tabular-nums">${(i+2)*148}</span>,
              <Pill key={i} tone={i<2?"destructive":"warning"}>{`${2+i}d`}</Pill>,
            ])}/>
          </ChartCard>
        </div>
      )}
    </PageShell>
  );
}

/* ============================================================
   4. Support
   ============================================================ */
type SupTab = "queue" | "tickets" | "sla" | "csat";
export function Support({ d }: { d: DashSpec }) {
  const s = useDashboardState();
  const { tab, setTab } = useTabs<SupTab>("queue");
  const [picked, setPicked] = useState<string | null>(null);
  return (
    <PageShell d={d} toolbar={<DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive} />}>
      <Kpis items={[
        { label: "Open tickets", value: "690", delta: "+42", tone: "warning" },
        { label: "First reply", value: "4m 12s", delta: "-22s", tone: "success" },
        { label: "Resolution", value: "1h 48m", tone: "info" },
        { label: "SLA breach", value: "8", tone: "destructive" },
        { label: "CSAT 30d", value: "94%", delta: "+1.2pp", tone: "success" },
        { label: "Agents online", value: "18", tone: "info" },
      ]} />
      <FilterBar value={s.filter} onChange={s.setFilter} placeholder="Search tickets, requesters…"/>
      <TabBar<SupTab>
        value={tab} onChange={setTab}
        tabs={[
          { id: "queue", label: "Queue", icon: "Inbox" },
          { id: "tickets", label: "Tickets", icon: "Ticket", badge: 690 },
          { id: "sla", label: "SLA Heat", icon: "Timer" },
          { id: "csat", label: "CSAT", icon: "Star" },
        ]}
      />

      {tab === "queue" && (
        <div className={grid}>
          <ChartCard span={5} title="Queue · By Channel">
            {[["Email",482,"info"],["Chat",148,"primary"],["Phone",42,"warning"],["Social",18,"accent"]].map(([n,v,t],i)=>(
              <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-2"><StatusDot tone={t as never}/><span className="text-xs">{n}</span></div>
                <div className="flex items-center gap-3">
                  <Spark seed={i+2} color={`var(--color-${t})`} height={20}/>
                  <span className="text-sm font-semibold tabular-nums w-10 text-right">{v}</span>
                </div>
              </div>
            ))}
          </ChartCard>
          <ChartCard span={7} title="Inbound Volume · 24h"><LineSeries seed={3} lines={2} height={180}/></ChartCard>
          <AIInsights items={[
            { title: "Surge: 2FA tickets +312%", body: "Likely caused by SSO rollout. Recommend pinning macro #218 and paging on-call.", tone: "warning", confidence: 88 },
            { title: "Macro coverage low", body: "32% of inbound match no macro. Run AI macro-mining on last 7 days.", tone: "info", confidence: 71 },
          ]}/>
        </div>
      )}

      {tab === "tickets" && (
        <div className={grid}>
          <ChartCard span={12} title="Tickets">
            <DataTable columns={["#","Subject","Requester","Channel","Priority","SLA","Agent",""]} rows={Array.from({length:10}).map((_,i)=>{
              const id = `#${48201+i}`;
              return [
                <span key={i} className="font-mono text-[11px]">{id}</span>,
                `Issue with ${["login","invoice","export","upload","2FA","API","trial","seat","webhook","domain"][i]}`,
                `user${i+1}@cust.io`,
                ["email","chat","email","phone","chat","email","social","email","email","chat"][i],
                <Pill key={i} tone={["destructive","warning","info","muted","warning","info","muted","destructive","warning","info"][i] as never}>{["Urgent","High","Normal","Low","High","Normal","Low","Urgent","High","Normal"][i]}</Pill>,
                i===0?<Pill key={i} tone="destructive">Breach 8m</Pill>:<Pill key={i} tone="success">OK</Pill>,
                ["meera","akira","diego","luna","sven","priya","tara","rao","mira","otis"][i],
                <button key={i} onClick={()=>setPicked(id)} className="text-[11px] text-primary hover:underline">Open</button>,
              ];
            })}/>
          </ChartCard>
        </div>
      )}

      {tab === "sla" && (
        <div className={grid}>
          <ChartCard span={12} title="SLA Heat · 7d × 24h">
            <Heatmap rows={7} cols={24} seed={4} color="var(--color-warning)"/>
          </ChartCard>
        </div>
      )}

      {tab === "csat" && (
        <div className={grid}>
          <ChartCard span={4} title="CSAT · 30d" className="grid place-items-center">
            <Donut value={94} label="CSAT" color="var(--color-success)"/>
          </ChartCard>
          <ChartCard span={8} title="Score Trend"><LineSeries seed={14} lines={1} height={200}/></ChartCard>
        </div>
      )}

      <Modal open={!!picked} onClose={()=>setPicked(null)} title={`Ticket ${picked}`} size="lg">
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3"><Avatar name="user@cust.io"/><div><div className="font-medium">user@cust.io</div><div className="text-[11px] text-muted-foreground">Reported 12m ago · Priority Urgent</div></div></div>
          <div className="rounded-md border border-border p-3 bg-muted/30 text-xs">Hi team — login broken after 2FA reset. URGENT, blocking my entire org.</div>
          <textarea placeholder="Reply…" className="w-full bg-muted text-xs rounded-md p-2 border border-border outline-none focus:border-primary min-h-24"/>
        </div>
      </Modal>
    </PageShell>
  );
}

/* ============================================================
   5. Customer Success
   ============================================================ */
type CSTab = "health" | "ctas" | "retention" | "playbooks";
export function CustomerSuccess({ d }: { d: DashSpec }) {
  const s = useDashboardState();
  const { tab, setTab } = useTabs<CSTab>("health");
  return (
    <PageShell d={d} toolbar={<DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive} />}>
      <Kpis items={[
        { label: "NRR", value: "118%", delta: "+4pp", tone: "success" },
        { label: "GRR", value: "94%", tone: "info" },
        { label: "At-risk ARR", value: "$842k", tone: "destructive" },
        { label: "Expansion", value: "$412k", delta: "+18%", tone: "success" },
        { label: "QBRs (Q)", value: "48 / 62", tone: "info" },
        { label: "Onboarding", value: "12", tone: "warning" },
      ]} />
      <TabBar<CSTab>
        value={tab} onChange={setTab}
        tabs={[
          { id: "health", label: "Account Health", icon: "HeartPulse" },
          { id: "ctas", label: "Open CTAs", icon: "ListChecks", badge: 14 },
          { id: "retention", label: "Retention", icon: "TrendingUp" },
          { id: "playbooks", label: "Playbooks", icon: "BookOpen" },
        ]}
      />

      {tab === "health" && (
        <div className={grid}>
          <ChartCard span={8} title="Account Health">
            <DataTable columns={["Account","ARR","Health","Stage","CSM","Renewal"]} rows={Array.from({length:8}).map((_,i)=>{
              const h = [92,68,42,88,76,28,82,58][i];
              return [
                `Acme-${i+1}`,
                <span key={i} className="tabular-nums">${(i+1)*84}k</span>,
                <div key={i} className="flex items-center gap-2 w-32">
                  <ProgressBar value={h} color={h>70?"var(--color-success)":h>50?"var(--color-warning)":"var(--color-destructive)"}/>
                  <span className="text-[10px] tabular-nums">{h}</span>
                </div>,
                <Pill key={i} tone={["success","info","destructive","success","info","destructive","success","warning"][i] as never}>
                  {["Adopt","Adopt","Risk","Renew","Adopt","Risk","Expand","Onboard"][i]}
                </Pill>,
                ["Mira","Otis","Pia","Rao","Sven","Tara","Una","Vik"][i],
                `${42+i*12}d`,
              ];
            })}/>
          </ChartCard>
          <div className="col-span-12 lg:col-span-4 space-y-4">
            <ChartCard title="Net Revenue Retention" className="grid place-items-center">
              <Donut value={118} label="NRR" color="var(--color-success)"/>
            </ChartCard>
            <ChartCard title="Churn Risk · 30d">
              <Bars seed={11} n={20} color="var(--color-destructive)" height={80}/>
            </ChartCard>
          </div>
        </div>
      )}

      {tab === "ctas" && (
        <div className={grid}>
          <ChartCard span={7} title="Open CTAs">
            <Timeline items={[
              { time:"now", title:"Risk · Acme-3 usage drop 42%", tone:"destructive" },
              { time:"1h", title:"Expansion · Globex requested seats +24", tone:"success" },
              { time:"3h", title:"QBR scheduled · Wayne Ent", tone:"info" },
              { time:"1d", title:"Renewal review · Initech (D-30)", tone:"warning" },
              { time:"2d", title:"Adoption milestone · Tyrell hit 80% MAU", tone:"success" },
            ]}/>
          </ChartCard>
          <ChartCard span={5} title="Quick Actions">
            <QuickActions items={[
              { label:"Schedule QBR", icon:"CalendarPlus", tone:"info" },
              { label:"Send NPS", icon:"Star", tone:"accent" },
              { label:"Open Playbook", icon:"BookOpen", tone:"primary" },
              { label:"Escalate Risk", icon:"AlertTriangle", tone:"destructive" },
            ]}/>
            <div className="mt-4">
              <AIInsights items={[
                { title:"Acme-3 churn likelihood 78%", body:"3 power users left, weekly logins down 60%. Recommend exec sponsor outreach.", tone:"destructive", confidence: 82 },
              ]}/>
            </div>
          </ChartCard>
        </div>
      )}

      {tab === "retention" && (
        <div className={grid}>
          <ChartCard span={8} title="Cohort Retention"><LineSeries seed={22} lines={3} height={220}/></ChartCard>
          <ChartCard span={4} title="GRR" className="grid place-items-center">
            <Donut value={94} label="GRR" color="var(--color-info)"/>
          </ChartCard>
        </div>
      )}

      {tab === "playbooks" && (
        <div className={grid}>
          <ChartCard span={12} title="Active Playbooks">
            <DataTable columns={["Playbook","Trigger","Accounts","Stage","Owner"]} rows={[
              ["Risk · Usage Drop","MAU -30% / 14d","12","Active","Tara"],
              ["Expansion · Power User","DAU > 80% / 30d","28","Active","Rao"],
              ["Renewal · D-90","Renewal in 90d","42","Scheduled","Mira"],
              ["Onboarding · Week-1","Signup + 1d","18","Active","Otis"],
              ["NPS · Detractor","NPS ≤ 6","9","Active","Una"],
            ]}/>
          </ChartCard>
        </div>
      )}
    </PageShell>
  );
}

/* ============================================================
   6. Onboarding
   ============================================================ */
type OnbTab = "funnel" | "flows" | "engagement" | "experiments";
export function Onboarding({ d }: { d: DashSpec }) {
  const s = useDashboardState();
  const { tab, setTab } = useTabs<OnbTab>("funnel");
  const funnel = [["Signup",4128,100],["Verified",3812,92],["Workspace",2401,58],["First Action",1812,44],["Week-2 Active",1248,30],["Activated",812,20]] as const;
  return (
    <PageShell d={d} toolbar={<DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive} />}>
      <Kpis items={[
        { label: "Signups · 30d", value: "4,128", delta: "+12%", tone: "success" },
        { label: "Activation", value: "20%", delta: "+1.4pp", tone: "success" },
        { label: "TTV (median)", value: "3.2d", tone: "info" },
        { label: "Drop-off step", value: "Workspace", tone: "warning" },
        { label: "Active flows", value: "12", tone: "info" },
        { label: "Experiments", value: "4", tone: "accent" as never },
      ]} />
      <TabBar<OnbTab>
        value={tab} onChange={setTab}
        tabs={[
          { id: "funnel", label: "Funnel", icon: "Filter" },
          { id: "flows", label: "Flows", icon: "GitBranch", badge: 12 },
          { id: "engagement", label: "Engagement", icon: "MousePointer2" },
          { id: "experiments", label: "Experiments", icon: "FlaskConical", badge: 4 },
        ]}
      />

      {tab === "funnel" && (
        <div className={grid}>
          <ChartCard span={7} title="Activation Funnel">
            {funnel.map(([n,v,w],i)=>(
              <div key={i} className="flex items-center gap-3 py-1.5">
                <div className="text-xs w-28 shrink-0">{n}</div>
                <div className="flex-1 bg-muted/40 rounded h-6 overflow-hidden relative">
                  <div className="h-full rounded transition-[width] duration-700" style={{ width:`${w}%`, background:`linear-gradient(90deg,var(--color-info),var(--color-accent))` }}/>
                  <span className="absolute inset-0 grid place-items-center text-[10px] font-medium text-foreground/90">{w}%</span>
                </div>
                <div className="text-xs w-14 text-right text-muted-foreground shrink-0 tabular-nums">{v.toLocaleString()}</div>
              </div>
            ))}
          </ChartCard>
          <ChartCard span={5} title="Activation Rate" className="grid place-items-center">
            <Donut value={20} label="activated" color="var(--color-accent)"/>
          </ChartCard>
          <AIInsights items={[
            { title:"Drop-off at Workspace step", body:"34% abandon between Verified and Workspace. Suggest reducing required fields from 6→3.", tone:"warning", confidence: 89 },
            { title:"Tour completion correlates with retention", body:"Users who finish Welcome Tour v3 have 2.4× day-30 retention.", tone:"success", confidence: 93 },
          ]}/>
        </div>
      )}

      {tab === "flows" && (
        <div className={grid}>
          <ChartCard span={12} title="Active Flows">
            {["Welcome Tour · v3","Empty Dashboard","Invite Teammates","Connect Data","Trial Expiring"].map((f,i)=>(
              <div key={f} className="py-2 border-b border-border last:border-0">
                <div className="flex justify-between text-xs"><span>{f}</span><span className="text-success tabular-nums">{[68,42,84,38,22][i]}%</span></div>
                <ProgressBar value={[68,42,84,38,22][i]}/>
              </div>
            ))}
          </ChartCard>
        </div>
      )}

      {tab === "engagement" && (
        <div className={grid}>
          <ChartCard span={12} title="Tooltip Engagement · Heat">
            <Heatmap rows={5} cols={28} seed={7} color="var(--color-info)"/>
          </ChartCard>
        </div>
      )}

      {tab === "experiments" && (
        <div className={grid}>
          <ChartCard span={12} title="Live A/B Experiments">
            <DataTable columns={["Experiment","Variant","Users","Lift","Status"]} rows={[
              ["Workspace fields 6→3","B","2,184","+12.4%",<Pill key="1" tone="success">Winning</Pill>],
              ["Welcome video","B","1,842","+4.1%",<Pill key="2" tone="info">Running</Pill>],
              ["Empty-state CTA copy","C","1,418","-1.2%",<Pill key="3" tone="warning">Inconclusive</Pill>],
              ["Day-3 nudge email","B","2,012","+8.8%",<Pill key="4" tone="success">Winning</Pill>],
            ]}/>
          </ChartCard>
        </div>
      )}
    </PageShell>
  );
}
