import { useMemo, useState } from "react";
import * as Icons from "lucide-react";
import type { DashSpec } from "@/data/dashboards";
import {
  Pill, Donut, Bars, LineSeries, Heatmap, Spark,
  DataTable, ProgressBar, Avatar, StatusDot,
} from "./_primitives";
import {
  ChartCard, AIInsights, DashboardToolbar, Modal, TabBar, FilterBar,
  QuickActions, EmptyState, useDashboardState, useTabs,
} from "./_universal";

/* ============================================================
   CATEGORY 04b — Communication + Collaboration (premium)
   Comms · Alerts · Knowledge · Files · Broadcast
   ============================================================ */

const grid = "grid grid-cols-12 gap-4";

function Header({ d, right }: { d: DashSpec; right?: React.ReactNode }) {
  const Icon = (Icons as never as Record<string, Icons.LucideIcon>)[d.icon] || Icons.MessagesSquare;
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
   1. COMMS HUB (Slack-style)
   ============================================================ */
type CommsTab = "channels" | "messages" | "people" | "huddles";
export function Comms({ d }: { d: DashSpec }) {
  const s = useDashboardState();
  const { tab, setTab } = useTabs<CommsTab>("channels");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("incident-comms");

  const channels = useMemo(() => ([
    { name: "general",      members: 482, unread: 12, tone: "muted" as const },
    { name: "engineering",  members: 184, unread: 3,  tone: "info" as const },
    { name: "incident-comms", members: 64, unread: 42, tone: "destructive" as const },
    { name: "sales",        members: 92,  unread: 0,  tone: "success" as const },
    { name: "design",       members: 38,  unread: 1,  tone: "accent" as const },
    { name: "random",       members: 412, unread: 8,  tone: "muted" as const },
  ]), []);

  const filtered = channels.filter(c => c.name.includes(s.filter.toLowerCase()));

  return (
    <PageShell d={d} toolbar={<DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive} />}>
      <Kpis items={[
        { label: "Messages/day", value: "48.2k", delta: "+12%", tone: "success" },
        { label: "Active users", value: "1,284", delta: "+84",  tone: "info" },
        { label: "Channels",     value: "312",   delta: "+6",   tone: "info" },
        { label: "Huddles live", value: "18",    delta: "+4",   tone: "success" },
        { label: "Threads open", value: "642",   delta: "−18",  tone: "success" },
        { label: "Files shared", value: "8.4k",  delta: "+9%",  tone: "info" },
      ]}/>

      <TabBar<CommsTab> value={tab} onChange={setTab}
        tabs={[
          { id: "channels", label: "Channels", icon: "Hash", badge: channels.length },
          { id: "messages", label: "Messages", icon: "MessageSquare" },
          { id: "people",   label: "People",   icon: "Users", badge: 1284 },
          { id: "huddles",  label: "Huddles",  icon: "Phone", badge: 18 },
        ]}
        right={<button onClick={()=>setOpen(true)} className="text-[11px] px-2 py-1 rounded-md bg-primary text-primary-foreground hover:opacity-90">New Channel</button>}
      />

      {tab === "channels" && (
        <div className={grid}>
          <ChartCard title="Channels" span={4} toolbar={<FilterBar value={s.filter} onChange={s.setFilter} placeholder="Search…"/>}>
            <ul className="space-y-1">
              {filtered.length === 0 && <EmptyState icon="Hash" title="No channels match" hint="Try a different query"/>}
              {filtered.map((c) => (
                <li key={c.name}>
                  <button
                    onClick={()=>setActive(c.name)}
                    className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-left transition-colors ${active===c.name ? "bg-primary/15 text-primary" : "hover:bg-muted/50"}`}>
                    <span className="flex items-center gap-2"><Icons.Hash className="w-3.5 h-3.5"/><span className="text-xs">{c.name}</span></span>
                    <span className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground">{c.members}</span>
                      {c.unread > 0 && <span className="text-[10px] bg-destructive text-destructive-foreground px-1.5 rounded-full">{c.unread}</span>}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </ChartCard>
          <ChartCard title={`#${active}`} subtitle="Live thread" span={8}
            toolbar={<Pill tone="success">● live</Pill>}>
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {[
                { u:"Akira K.", c:"primary", t:"Heads up — checkout p95 spiked to 820ms in eu-west-1", time:"14:42" },
                { u:"Meera S.", c:"accent",  t:"On it — looking at the recent deploy v2.84.1", time:"14:43" },
                { u:"PagerBot", c:"info",    t:"INC-4128 created · severity P2 · responders paged", time:"14:43" },
                { u:"Diego R.", c:"success", t:"Rollback initiated — should normalize in <2m", time:"14:46" },
                { u:"Akira K.", c:"primary", t:"Confirmed back to baseline. 🎉", time:"14:48" },
              ].map((m,i)=>(
                <div key={i} className="flex gap-3"><Avatar name={m.u} color={`var(--color-${m.c})`}/>
                  <div className="flex-1">
                    <div className="text-xs"><span className="font-semibold">{m.u}</span> <span className="text-muted-foreground ml-1">{m.time}</span></div>
                    <div className="text-sm">{m.t}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <input placeholder={`Message #${active}`} className="flex-1 bg-muted text-xs rounded-md px-2 py-1.5 border border-border outline-none focus:border-primary"/>
              <button className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs">Send</button>
            </div>
          </ChartCard>
        </div>
      )}

      {tab === "messages" && (
        <div className={grid}>
          <ChartCard title="Message Volume · 24h" span={8}><LineSeries seed={14} lines={3} height={200}/></ChartCard>
          <ChartCard title="Channels by Activity" span={4} className="grid place-items-center"><Donut value={72} label="DAU/MAU" color="var(--color-accent)"/></ChartCard>
          <ChartCard title="Engagement Heat · 7d × 24h" span={12}><Heatmap rows={7} cols={24} seed={6} color="var(--color-primary)"/></ChartCard>
        </div>
      )}

      {tab === "people" && (
        <ChartCard title="People" toolbar={<FilterBar value={s.filter} onChange={s.setFilter} placeholder="Search people…"/>}>
          <DataTable columns={["Name","Title","Team","Status","Messages 7d",""]} rows={
            [
              ["Akira K.","Staff SRE","Platform","success","482"],
              ["Meera S.","Eng Mgr","Checkout","success","312"],
              ["Diego R.","Senior SWE","Infra","warning","248"],
              ["Luna T.","Designer","Brand","muted","118"],
              ["Sven O.","SDR","GTM","success","84"],
              ["Priya V.","PM","Growth","success","148"],
            ].filter(r=>(r[0] as string).toLowerCase().includes(s.filter.toLowerCase())).map((r,i)=>[
              <span key={i} className="inline-flex items-center gap-2"><Avatar name={r[0] as string} color={`var(--color-${["primary","accent","info","success","warning","primary"][i%6]})`}/><span className="text-xs">{r[0]}</span></span>,
              r[1], r[2],
              <Pill key={i} tone={r[3] as never}>{r[3]==="success"?"online":r[3]==="warning"?"away":"offline"}</Pill>,
              r[4],
              <button key={i} className="text-[11px] text-primary hover:underline">DM</button>,
            ])
          }/>
        </ChartCard>
      )}

      {tab === "huddles" && (
        <div className={grid}>
          {[["#incident-comms","P2 INC-4128",4,"destructive"],["#engineering","Standup",6,"info"],["#design","Crit review",3,"accent"],["#sales","Pipeline sync",5,"success"]].map(([c,t,n,tone],i)=>(
            <div key={i} className="col-span-12 md:col-span-6 xl:col-span-3 glass rounded-xl p-4 card-hover">
              <div className="flex items-center justify-between"><Pill tone={tone as never}>● live</Pill><span className="text-[10px] text-muted-foreground">{n} on call</span></div>
              <div className="mt-2 text-xs font-mono text-muted-foreground">{c}</div>
              <div className="text-sm font-semibold mt-0.5">{t}</div>
              <div className="mt-3 flex -space-x-2">{Array.from({length:n as number}).map((_,j)=>(<Avatar key={j} name={`U${j}`} color={`var(--color-${["primary","accent","info","success"][j%4]})`}/>))}</div>
              <button className="mt-3 w-full px-2 py-1.5 rounded-md bg-success/15 text-success text-[11px] border border-success/30 hover:bg-success/25">Join Huddle</button>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} onClose={()=>setOpen(false)} title="New Channel" size="md"
        footer={<>
          <button onClick={()=>setOpen(false)} className="px-3 py-1.5 text-xs rounded-md border border-border hover:bg-muted">Cancel</button>
          <button onClick={()=>setOpen(false)} className="px-3 py-1.5 text-xs rounded-md bg-primary text-primary-foreground">Create</button>
        </>}>
        <div className="space-y-3">
          <div><label className="text-[11px] text-muted-foreground">Channel name</label><input placeholder="e.g. q4-launch" className="mt-1 w-full bg-muted text-xs rounded-md px-2 py-1.5 border border-border outline-none focus:border-primary"/></div>
          <div><label className="text-[11px] text-muted-foreground">Purpose</label><input className="mt-1 w-full bg-muted text-xs rounded-md px-2 py-1.5 border border-border outline-none focus:border-primary"/></div>
          <div className="flex items-center gap-2 text-[11px]"><input type="checkbox" id="priv"/><label htmlFor="priv">Make private</label></div>
        </div>
      </Modal>
    </PageShell>
  );
}

/* ============================================================
   2. ALERTS (PagerDuty-style)
   ============================================================ */
type AlertTab = "live" | "incidents" | "schedules" | "rules";
export function Alerts({ d }: { d: DashSpec }) {
  const s = useDashboardState();
  const { tab, setTab } = useTabs<AlertTab>("live");
  const [open, setOpen] = useState(false);

  const incidents = useMemo(() => ([
    { id:"INC-4128", title:"Checkout p95 spike — eu-west-1", sev:"P2", status:"acked",   svc:"checkout-api", assignee:"meera" },
    { id:"INC-4127", title:"Postgres replica lag > 30s",     sev:"P3", status:"open",    svc:"db-primary",   assignee:"diego" },
    { id:"INC-4126", title:"CDN 5xx in ap-south-1",          sev:"P1", status:"firing",  svc:"edge",         assignee:"akira" },
    { id:"INC-4125", title:"Stripe webhook backlog",          sev:"P3", status:"resolved",svc:"billing",      assignee:"sven" },
    { id:"INC-4124", title:"SSO token rotation failure",      sev:"P2", status:"acked",   svc:"iam",          assignee:"priya" },
    { id:"INC-4123", title:"Search cluster shard unbalanced", sev:"P4", status:"open",    svc:"search",       assignee:"luna" },
  ]), []);
  const sevTone = (s:string)=>s==="P1"?"destructive":s==="P2"?"warning":s==="P3"?"info":"muted";
  const stTone  = (s:string)=>s==="firing"?"destructive":s==="acked"?"warning":s==="open"?"info":"success";

  const filtered = incidents.filter(i => (i.title+i.id+i.svc).toLowerCase().includes(s.filter.toLowerCase()));

  return (
    <PageShell d={d} toolbar={<DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive} />}>
      <Kpis items={[
        { label: "Firing",       value: "3",     delta: "+1",   tone: "destructive" },
        { label: "Acked",        value: "8",     delta: "−2",   tone: "warning" },
        { label: "MTTA",         value: "1m 42s",delta: "−18s", tone: "success" },
        { label: "MTTR",         value: "12m",   delta: "−3m",  tone: "success" },
        { label: "Noise filtered", value: "84%", delta: "+6pp", tone: "success" },
        { label: "On-call",      value: "12",    delta: "",     tone: "info" },
      ]}/>

      <TabBar<AlertTab> value={tab} onChange={setTab}
        tabs={[
          { id: "live",      label: "Live", icon: "Siren", badge: 3 },
          { id: "incidents", label: "Incidents", icon: "AlertOctagon", badge: incidents.length },
          { id: "schedules", label: "Schedules", icon: "CalendarClock" },
          { id: "rules",     label: "Rules", icon: "Workflow" },
        ]}
        right={<button onClick={()=>setOpen(true)} className="text-[11px] px-2 py-1 rounded-md bg-destructive text-destructive-foreground hover:opacity-90">Trigger Test</button>}
      />

      {tab === "live" && (
        <div className={grid}>
          <ChartCard title="Active Incidents" span={8}>
            <ul className="space-y-2">
              {incidents.filter(i=>i.status!=="resolved").map(i=>(
                <li key={i.id} className="flex items-center gap-3 p-2 rounded-md border border-border hover:border-primary/40">
                  <Pill tone={sevTone(i.sev) as never}>{i.sev}</Pill>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate">{i.title}</div>
                    <div className="text-[10px] text-muted-foreground font-mono">{i.id} · {i.svc} · @{i.assignee}</div>
                  </div>
                  <Pill tone={stTone(i.status) as never}>{i.status}</Pill>
                </li>
              ))}
            </ul>
          </ChartCard>
          <div className="col-span-12 lg:col-span-4 space-y-4">
            <ChartCard title="Quick Actions">
              <QuickActions items={[
                { label: "Ack all",     icon: "Check",     tone: "warning" },
                { label: "Page Eng",    icon: "Phone",     tone: "destructive" },
                { label: "Snooze 30m",  icon: "BellOff",   tone: "muted" },
                { label: "Open Runbook",icon: "BookOpen",  tone: "info" },
              ]}/>
            </ChartCard>
            <AIInsights items={[
              { title: "Correlated incident cluster", body: "INC-4126 + INC-4128 share edge-router cause. Suggest grouping.", tone: "warning", confidence: 91 },
              { title: "Flapping rule detected", body: "rule_disk_85 fired 18× in 1h — auto-suppress recommended.", tone: "info", confidence: 87 },
            ]}/>
          </div>
          <ChartCard title="Alert Volume · 24h" span={12}><Bars seed={22} n={48} color="var(--color-warning)" height={140}/></ChartCard>
        </div>
      )}

      {tab === "incidents" && (
        <ChartCard title="All Incidents" toolbar={<FilterBar value={s.filter} onChange={s.setFilter} placeholder="Search…"/>}>
          <DataTable columns={["ID","Title","Severity","Service","Assignee","Status",""]} rows={
            filtered.map((i,k)=>[
              <span key={k} className="font-mono text-[10px]">{i.id}</span>,
              i.title,
              <Pill key={k} tone={sevTone(i.sev) as never}>{i.sev}</Pill>,
              <span key={k} className="font-mono text-[10px]">{i.svc}</span>,
              `@${i.assignee}`,
              <Pill key={k} tone={stTone(i.status) as never}>{i.status}</Pill>,
              <button key={k} className="text-[11px] text-primary hover:underline">Open</button>,
            ])
          }/>
        </ChartCard>
      )}

      {tab === "schedules" && (
        <div className={grid}>
          <ChartCard title="On-Call Rotation · This Week" span={12}>
            <div className="grid grid-cols-7 gap-2">
              {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((day,i)=>(
                <div key={day} className="rounded-md border border-border p-2">
                  <div className="text-[10px] text-muted-foreground">{day}</div>
                  <div className="mt-2 space-y-1">
                    {[["Akira","primary"],["Meera","accent"]].map(([n,c],j)=>(
                      <div key={j} className="flex items-center gap-1.5"><Avatar name={n as string} color={`var(--color-${c})`}/><span className="text-[10px]">{n}</span></div>
                    ))}
                  </div>
                  <div className="mt-2 text-[10px] text-muted-foreground">{["Primary","Backup"][i%2]}</div>
                </div>
              ))}
            </div>
          </ChartCard>
          <ChartCard title="Escalation Policies" span={12}>
            <DataTable columns={["Policy","Levels","Timeout","Last triggered"]} rows={[
              ["Platform P1",   "3", "5m",  "12m ago"],
              ["Payments P1-2", "4", "3m",  "1h ago"],
              ["Data Pipeline", "2", "10m", "yesterday"],
              ["Security",      "3", "1m",  "—"],
            ]}/>
          </ChartCard>
        </div>
      )}

      {tab === "rules" && (
        <ChartCard title="Alert Rules">
          <DataTable columns={["Rule","Condition","Threshold","Last fired","State"]} rows={[
            ["api_p95",        "checkout p95 > X",     "500ms",    "12m ago",  <Pill key="1" tone="warning">firing</Pill>],
            ["db_replica_lag", "lag > X seconds",      "30s",      "1h ago",   <Pill key="2" tone="info">healthy</Pill>],
            ["cdn_5xx_rate",   "5xx rate > X / min",   "120/min",  "32m ago",  <Pill key="3" tone="destructive">firing</Pill>],
            ["disk_usage",     "any node > X%",        "85%",      "today",    <Pill key="4" tone="success">silenced</Pill>],
            ["error_budget",   "burn rate > X",        "14×",      "—",        <Pill key="5" tone="info">healthy</Pill>],
          ]}/>
        </ChartCard>
      )}

      <Modal open={open} onClose={()=>setOpen(false)} title="Trigger Test Incident" size="md"
        footer={<>
          <button onClick={()=>setOpen(false)} className="px-3 py-1.5 text-xs rounded-md border border-border hover:bg-muted">Cancel</button>
          <button onClick={()=>setOpen(false)} className="px-3 py-1.5 text-xs rounded-md bg-destructive text-destructive-foreground">Trigger</button>
        </>}>
        <div className="space-y-3">
          <div><label className="text-[11px] text-muted-foreground">Service</label><input placeholder="checkout-api" className="mt-1 w-full bg-muted text-xs rounded-md px-2 py-1.5 border border-border outline-none focus:border-primary"/></div>
          <div><label className="text-[11px] text-muted-foreground">Severity</label><select className="mt-1 w-full bg-muted text-xs rounded-md px-2 py-1.5 border border-border"><option>P1</option><option>P2</option><option>P3</option><option>P4</option></select></div>
          <div><label className="text-[11px] text-muted-foreground">Summary</label><input className="mt-1 w-full bg-muted text-xs rounded-md px-2 py-1.5 border border-border outline-none focus:border-primary"/></div>
        </div>
      </Modal>
    </PageShell>
  );
}

/* ============================================================
   3. KNOWLEDGE (Notion/Confluence-style)
   ============================================================ */
type KnowTab = "spaces" | "pages" | "search" | "activity";
export function Knowledge({ d }: { d: DashSpec }) {
  const s = useDashboardState();
  const { tab, setTab } = useTabs<KnowTab>("spaces");
  const [open, setOpen] = useState(false);

  const spaces = [
    { name:"Engineering", pages:482, owner:"meera",   tone:"info" as const },
    { name:"Product",     pages:218, owner:"priya",   tone:"accent" as const },
    { name:"Design",      pages:148, owner:"luna",    tone:"accent" as const },
    { name:"GTM",         pages:312, owner:"sven",    tone:"success" as const },
    { name:"Security",    pages:84,  owner:"akira",   tone:"destructive" as const },
    { name:"People Ops",  pages:62,  owner:"rao",     tone:"muted" as const },
  ];

  const pages = [
    ["Incident Response Runbook",  "Engineering","akira", "2d"],
    ["Q4 Launch Plan",             "Product",    "priya", "1d"],
    ["Brand Style Guide v3",       "Design",     "luna",  "5h"],
    ["Onboarding Checklist",       "People Ops", "rao",   "1w"],
    ["Threat Model — Checkout",    "Security",   "akira", "3d"],
    ["Sales Playbook 2026",        "GTM",        "sven",  "4d"],
    ["RFC: Multi-region writes",   "Engineering","diego", "yesterday"],
    ["Pricing Page Copy",          "Design",     "luna",  "today"],
  ].filter(r => (r[0] as string).toLowerCase().includes(s.filter.toLowerCase()));

  return (
    <PageShell d={d} toolbar={<DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive} />}>
      <Kpis items={[
        { label: "Pages",       value: "1,306", delta: "+48",  tone: "info" },
        { label: "Spaces",      value: "32",    delta: "+2",   tone: "info" },
        { label: "Edits 7d",    value: "1,820", delta: "+12%", tone: "success" },
        { label: "Search Q/day",value: "8.4k",  delta: "+9%",  tone: "info" },
        { label: "Stale pages", value: "82",    delta: "−14",  tone: "success" },
        { label: "AI summaries",value: "412",   delta: "+88",  tone: "accent" as never },
      ]}/>

      <TabBar<KnowTab> value={tab} onChange={setTab}
        tabs={[
          { id: "spaces",   label: "Spaces", icon: "FolderTree", badge: spaces.length },
          { id: "pages",    label: "Pages",  icon: "FileText",   badge: 1306 },
          { id: "search",   label: "Search", icon: "Search" },
          { id: "activity", label: "Activity",icon: "Activity" },
        ]}
        right={<button onClick={()=>setOpen(true)} className="text-[11px] px-2 py-1 rounded-md bg-primary text-primary-foreground hover:opacity-90">New Page</button>}
      />

      {tab === "spaces" && (
        <div className={grid}>
          {spaces.map((sp,i)=>(
            <div key={i} className="col-span-12 md:col-span-6 xl:col-span-4 glass rounded-xl p-4 card-hover">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2"><StatusDot tone={sp.tone}/><span className="text-sm font-semibold">{sp.name}</span></div>
                <Pill tone="muted">{sp.pages} pages</Pill>
              </div>
              <div className="mt-3 text-[11px] text-muted-foreground">Owner: @{sp.owner}</div>
              <div className="mt-3"><ProgressBar value={Math.min(100, sp.pages/5)} color={`var(--color-${sp.tone === "muted" ? "primary" : sp.tone})`}/></div>
              <div className="mt-3 flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">Updated 2h ago</span>
                <button className="text-primary hover:underline">Open</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "pages" && (
        <ChartCard title="Pages" toolbar={<FilterBar value={s.filter} onChange={s.setFilter} placeholder="Search pages…"/>}>
          {pages.length === 0
            ? <EmptyState icon="FileSearch" title="No pages match" hint="Try a broader search"/>
            : <DataTable columns={["Title","Space","Author","Updated",""]} rows={pages.map((r,i)=>[
                <span key={i} className="font-medium">{r[0]}</span>,
                <Pill key={i} tone="muted">{r[1]}</Pill>,
                `@${r[2]}`,
                r[3],
                <button key={i} className="text-[11px] text-primary hover:underline">Open</button>,
              ])}/>
          }
        </ChartCard>
      )}

      {tab === "search" && (
        <div className={grid}>
          <ChartCard title="Search Volume · 30d" span={8}><LineSeries seed={9} lines={2} height={200}/></ChartCard>
          <ChartCard title="Top Queries" span={4}>
            <ul className="space-y-2 text-xs">
              {[["how to deploy",482],["okta sso",312],["pto policy",218],["incident template",148],["brand colors",84]].map(([q,n],i)=>(
                <li key={i} className="flex items-center justify-between border-b border-border last:border-0 pb-2">
                  <span className="font-mono text-[11px]">{q}</span><span className="tabular-nums text-muted-foreground">{n}</span>
                </li>
              ))}
            </ul>
          </ChartCard>
          <ChartCard title="Gaps — queries with zero results" span={12}>
            <DataTable columns={["Query","Searches","Last seen"]} rows={[
              ["data residency germany", "48", "today"],
              ["webhook retry policy",   "32", "1d ago"],
              ["mfa for vendors",        "28", "2d ago"],
              ["soc2 evidence portal",   "18", "3d ago"],
            ]}/>
          </ChartCard>
        </div>
      )}

      {tab === "activity" && (
        <ChartCard title="Recent Activity">
          <DataTable columns={["When","Who","Action","Target"]} rows={[
            ["2m ago",  "@luna",  "edited",   "Brand Style Guide v3"],
            ["12m ago", "@diego", "created",  "RFC: Multi-region writes"],
            ["1h ago",  "@priya", "commented","Q4 Launch Plan"],
            ["2h ago",  "@akira", "published","Threat Model — Checkout"],
            ["5h ago",  "@sven",  "moved",    "Sales Playbook 2026 → GTM"],
            ["1d ago",  "@rao",   "archived", "Old Onboarding v1"],
          ]}/>
        </ChartCard>
      )}

      <Modal open={open} onClose={()=>setOpen(false)} title="New Page" size="lg"
        footer={<>
          <button onClick={()=>setOpen(false)} className="px-3 py-1.5 text-xs rounded-md border border-border hover:bg-muted">Cancel</button>
          <button onClick={()=>setOpen(false)} className="px-3 py-1.5 text-xs rounded-md bg-primary text-primary-foreground">Create</button>
        </>}>
        <div className="space-y-3">
          <div><label className="text-[11px] text-muted-foreground">Title</label><input className="mt-1 w-full bg-muted text-xs rounded-md px-2 py-1.5 border border-border outline-none focus:border-primary"/></div>
          <div><label className="text-[11px] text-muted-foreground">Space</label><select className="mt-1 w-full bg-muted text-xs rounded-md px-2 py-1.5 border border-border">{spaces.map(sp=><option key={sp.name}>{sp.name}</option>)}</select></div>
          <div><label className="text-[11px] text-muted-foreground">Template</label><select className="mt-1 w-full bg-muted text-xs rounded-md px-2 py-1.5 border border-border"><option>Blank</option><option>Meeting Notes</option><option>Runbook</option><option>RFC</option></select></div>
        </div>
      </Modal>
    </PageShell>
  );
}

/* ============================================================
   4. FILES (Dropbox/Drive-style)
   ============================================================ */
type FileTab = "browser" | "shared" | "storage" | "trash";
export function Files({ d }: { d: DashSpec }) {
  const s = useDashboardState();
  const { tab, setTab } = useTabs<FileTab>("browser");
  const [open, setOpen] = useState(false);

  const files = [
    { name:"Q4-board-deck.pdf",     type:"pdf",   size:"4.2 MB",  owner:"priya",  mod:"2h",  shared:8 },
    { name:"brand-system-v3.fig",   type:"figma", size:"38 MB",   owner:"luna",   mod:"5h",  shared:12 },
    { name:"product-spec.docx",     type:"doc",   size:"812 KB",  owner:"meera",  mod:"1d",  shared:5 },
    { name:"customer-list.csv",     type:"csv",   size:"2.1 MB",  owner:"sven",   mod:"1d",  shared:3 },
    { name:"launch-promo.mp4",      type:"video", size:"184 MB",  owner:"luna",   mod:"3d",  shared:18 },
    { name:"infra-diagram.drawio",  type:"img",   size:"412 KB",  owner:"diego",  mod:"4d",  shared:2 },
    { name:"audit-2026.zip",        type:"zip",   size:"1.2 GB",  owner:"akira",  mod:"1w",  shared:1 },
    { name:"handbook.pages",        type:"doc",   size:"2.4 MB",  owner:"rao",    mod:"2w",  shared:42 },
  ].filter(f => f.name.toLowerCase().includes(s.filter.toLowerCase()));

  const iconFor = (t:string) => ({
    pdf:Icons.FileText, doc:Icons.FileText, csv:Icons.Sheet, figma:Icons.PenTool,
    video:Icons.Film, img:Icons.Image, zip:Icons.Archive,
  } as Record<string, Icons.LucideIcon>)[t] || Icons.File;

  return (
    <PageShell d={d} toolbar={<DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive} />}>
      <Kpis items={[
        { label: "Files",       value: "48,210", delta: "+1.2k", tone: "info" },
        { label: "Storage used",value: "1.84 TB",delta: "+62 GB",tone: "warning" },
        { label: "Shared links",value: "412",    delta: "+18",   tone: "info" },
        { label: "Sync clients",value: "1,184",  delta: "+44",   tone: "success" },
        { label: "Uploads 24h", value: "284",    delta: "+12%",  tone: "success" },
        { label: "Quota",       value: "62%",    delta: "+2pp",  tone: "warning" },
      ]}/>

      <TabBar<FileTab> value={tab} onChange={setTab}
        tabs={[
          { id: "browser", label: "Browser", icon: "Folder", badge: files.length },
          { id: "shared",  label: "Shared",  icon: "Share2", badge: 412 },
          { id: "storage", label: "Storage", icon: "HardDrive" },
          { id: "trash",   label: "Trash",   icon: "Trash2", badge: 18 },
        ]}
        right={<button onClick={()=>setOpen(true)} className="text-[11px] px-2 py-1 rounded-md bg-primary text-primary-foreground hover:opacity-90">Upload</button>}
      />

      {tab === "browser" && (
        <ChartCard title="All Files" toolbar={<FilterBar value={s.filter} onChange={s.setFilter} placeholder="Search files…"/>}>
          {files.length === 0
            ? <EmptyState icon="FolderOpen" title="No files match" hint="Try a different name"/>
            : <DataTable columns={["","Name","Size","Owner","Modified","Shared",""]} rows={files.map((f,i)=>{
                const I = iconFor(f.type);
                return [
                  <I key={i} className="w-4 h-4 text-muted-foreground"/>,
                  <span key={i} className="font-medium">{f.name}</span>,
                  <span key={i} className="tabular-nums text-muted-foreground">{f.size}</span>,
                  `@${f.owner}`,
                  `${f.mod} ago`,
                  <Pill key={i} tone={f.shared > 10 ? "warning" : "muted"}>{f.shared}</Pill>,
                  <button key={i} className="text-[11px] text-primary hover:underline">Open</button>,
                ];
              })}/>
          }
        </ChartCard>
      )}

      {tab === "shared" && (
        <div className={grid}>
          <ChartCard title="Shared Links" span={8}>
            <DataTable columns={["File","Audience","Permission","Expires","Views"]} rows={[
              ["Q4-board-deck.pdf",      "Anyone w/ link", "view",    "in 7d",  "412"],
              ["brand-system-v3.fig",    "company",        "edit",    "never",  "184"],
              ["launch-promo.mp4",       "Anyone w/ link", "view",    "in 30d", "1.2k"],
              ["handbook.pages",         "company",        "comment", "never",  "82"],
              ["customer-list.csv",      "3 people",       "view",    "in 24h", "12"],
            ]}/>
          </ChartCard>
          <ChartCard title="External Audiences" span={4} className="grid place-items-center"><Donut value={42} label="external" color="var(--color-warning)"/></ChartCard>
        </div>
      )}

      {tab === "storage" && (
        <div className={grid}>
          <ChartCard title="Storage Trend · 30d" span={8}><LineSeries seed={6} lines={2} height={200}/></ChartCard>
          <ChartCard title="By Type" span={4}>
            {[["Documents",42,"info"],["Media",28,"accent"],["Archives",16,"warning"],["Other",14,"muted"]].map(([n,v,t],i)=>(
              <div key={i} className="py-1.5">
                <div className="flex items-center justify-between text-[11px]"><span>{n}</span><span className="tabular-nums">{v}%</span></div>
                <ProgressBar value={v as number} color={`var(--color-${t})`}/>
              </div>
            ))}
          </ChartCard>
          <ChartCard title="Top Folders" span={12}>
            <DataTable columns={["Folder","Files","Size","Owner"]} rows={[
              ["/marketing/launch", "1,284", "412 GB", "@luna"],
              ["/engineering/builds","18,420","620 GB","@diego"],
              ["/sales/decks",     "482",    "32 GB",  "@sven"],
              ["/legal/contracts", "1,820",  "8.4 GB", "@rao"],
            ]}/>
          </ChartCard>
        </div>
      )}

      {tab === "trash" && (
        <ChartCard title="Trash" toolbar={<button className="text-[11px] px-2 py-1 rounded-md bg-destructive/15 text-destructive border border-destructive/30 hover:bg-destructive/25">Empty trash</button>}>
          <DataTable columns={["Name","Size","Deleted","By",""]} rows={[
            ["old-deck-v1.pdf",    "2.4 MB", "2d ago",  "@priya", <button key="1" className="text-[11px] text-primary hover:underline">Restore</button>],
            ["draft-blog.md",      "12 KB",  "5d ago",  "@luna",  <button key="2" className="text-[11px] text-primary hover:underline">Restore</button>],
            ["scratch-notes.txt",  "8 KB",   "1w ago",  "@meera", <button key="3" className="text-[11px] text-primary hover:underline">Restore</button>],
          ]}/>
        </ChartCard>
      )}

      <Modal open={open} onClose={()=>setOpen(false)} title="Upload Files" size="md"
        footer={<>
          <button onClick={()=>setOpen(false)} className="px-3 py-1.5 text-xs rounded-md border border-border hover:bg-muted">Cancel</button>
          <button onClick={()=>setOpen(false)} className="px-3 py-1.5 text-xs rounded-md bg-primary text-primary-foreground">Upload</button>
        </>}>
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center text-xs text-muted-foreground">
          <Icons.UploadCloud className="w-8 h-8 mx-auto mb-2 text-muted-foreground"/>
          Drop files here or <span className="text-primary">browse</span>
        </div>
        <div className="mt-3 text-[11px] text-muted-foreground">Max 5 GB per file · Encrypted at rest</div>
      </Modal>
    </PageShell>
  );
}

/* ============================================================
   5. BROADCAST (announcements / status page)
   ============================================================ */
type BcastTab = "live" | "scheduled" | "audiences" | "analytics";
export function Broadcast({ d }: { d: DashSpec }) {
  const s = useDashboardState();
  const { tab, setTab } = useTabs<BcastTab>("live");
  const [open, setOpen] = useState(false);

  return (
    <PageShell d={d} toolbar={<DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive} />}>
      <Kpis items={[
        { label: "Broadcasts 30d", value: "84",    delta: "+12",  tone: "info" },
        { label: "Reach",          value: "284k",  delta: "+18k", tone: "success" },
        { label: "Open rate",      value: "62%",   delta: "+4pp", tone: "success" },
        { label: "Click rate",     value: "18%",   delta: "+2pp", tone: "success" },
        { label: "Subscribers",    value: "48.2k", delta: "+412", tone: "info" },
        { label: "Status uptime",  value: "99.98%",delta: "",     tone: "success" },
      ]}/>

      <TabBar<BcastTab> value={tab} onChange={setTab}
        tabs={[
          { id: "live",      label: "Live", icon: "Radio", badge: 2 },
          { id: "scheduled", label: "Scheduled", icon: "Clock", badge: 6 },
          { id: "audiences", label: "Audiences", icon: "Users" },
          { id: "analytics", label: "Analytics",  icon: "BarChart3" },
        ]}
        right={<button onClick={()=>setOpen(true)} className="text-[11px] px-2 py-1 rounded-md bg-primary text-primary-foreground hover:opacity-90">New Broadcast</button>}
      />

      {tab === "live" && (
        <div className={grid}>
          <ChartCard title="Active Broadcasts" span={8}>
            <ul className="space-y-3">
              {[
                { title:"Scheduled maintenance — eu-west-1 db cluster", tone:"warning" as const, ch:"Status · Email · Slack", reach:"82k" },
                { title:"v2.85 release — new analytics workspace",      tone:"info" as const,    ch:"In-app · Email",          reach:"284k" },
              ].map((b,i)=>(
                <li key={i} className="p-3 rounded-md border border-border hover:border-primary/40">
                  <div className="flex items-center gap-2"><Pill tone={b.tone}>● broadcasting</Pill><span className="text-xs font-medium">{b.title}</span></div>
                  <div className="mt-2 text-[11px] text-muted-foreground flex items-center justify-between">
                    <span>{b.ch}</span><span>reach {b.reach}</span>
                  </div>
                  <div className="mt-2"><ProgressBar value={[68,42][i]} color={`var(--color-${b.tone})`}/></div>
                </li>
              ))}
            </ul>
          </ChartCard>
          <div className="col-span-12 lg:col-span-4 space-y-4">
            <ChartCard title="Status Page">
              {[["API","success"],["Web App","success"],["Webhooks","warning"],["Analytics","success"],["Search","info"]].map(([s,t],i)=>(
                <div key={i} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                  <div className="flex items-center gap-2"><StatusDot tone={t as never}/><span className="text-xs">{s}</span></div>
                  <span className="text-[10px] text-muted-foreground">{t==="success"?"operational":t==="warning"?"degraded":"investigating"}</span>
                </div>
              ))}
            </ChartCard>
            <AIInsights items={[
              { title: "Best send window: Tue 10:30 ET", body: "Past 12 broadcasts saw +18% open rate in this window.", tone: "success", confidence: 89 },
            ]}/>
          </div>
        </div>
      )}

      {tab === "scheduled" && (
        <ChartCard title="Scheduled Broadcasts">
          <DataTable columns={["Title","Channel","Audience","Send at","Status",""]} rows={[
            ["v2.85 release notes",        "Email + In-app","All users",        "Tue 10:30 ET", <Pill key="1" tone="info">queued</Pill>,    <button key="a" className="text-[11px] text-primary hover:underline">Edit</button>],
            ["Maintenance — db cluster",   "Status + Slack","EU customers",     "Sat 02:00 UTC",<Pill key="2" tone="warning">queued</Pill>, <button key="b" className="text-[11px] text-primary hover:underline">Edit</button>],
            ["Webinar — AI Workspace",     "Email",         "Trial accounts",   "Wed 14:00 ET", <Pill key="3" tone="info">queued</Pill>,    <button key="c" className="text-[11px] text-primary hover:underline">Edit</button>],
            ["Pricing update — Enterprise","Email",         "Enterprise admins","Mon 09:00 ET", <Pill key="4" tone="info">draft</Pill>,     <button key="d" className="text-[11px] text-primary hover:underline">Edit</button>],
            ["Security advisory",          "All channels",  "All users",        "ASAP",         <Pill key="5" tone="destructive">pending</Pill>,<button key="e" className="text-[11px] text-primary hover:underline">Edit</button>],
            ["Quarterly NPS survey",       "In-app",        "Active users",     "Fri 11:00 ET", <Pill key="6" tone="info">queued</Pill>,    <button key="f" className="text-[11px] text-primary hover:underline">Edit</button>],
          ]}/>
        </ChartCard>
      )}

      {tab === "audiences" && (
        <div className={grid}>
          <ChartCard title="Segments" span={8}>
            <DataTable columns={["Segment","Members","Growth 30d","Last sent"]} rows={[
              ["All users",         "48,210", "+412",  "2h ago"],
              ["Enterprise admins", "1,284",  "+24",   "yesterday"],
              ["EU customers",      "12,820", "+184",  "3d ago"],
              ["Trial accounts",    "3,184",  "+612",  "today"],
              ["Inactive 30d",      "8,420",  "−218",  "1w ago"],
            ]}/>
          </ChartCard>
          <ChartCard title="Channel Mix" span={4} className="grid place-items-center"><Donut value={62} label="email open" color="var(--color-primary)"/></ChartCard>
        </div>
      )}

      {tab === "analytics" && (
        <div className={grid}>
          <ChartCard title="Open & Click · 30d" span={8}><LineSeries seed={18} lines={2} height={200}/></ChartCard>
          <ChartCard title="By Channel" span={4}>
            {[["Email",62,"primary"],["In-app",48,"info"],["Slack",82,"accent"],["Status page",94,"success"]].map(([n,v,t],i)=>(
              <div key={i} className="py-1.5">
                <div className="flex items-center justify-between text-[11px]"><span>{n}</span><span className="tabular-nums">{v}%</span></div>
                <ProgressBar value={v as number} color={`var(--color-${t})`}/>
              </div>
            ))}
          </ChartCard>
          <ChartCard title="Send Heat · 7d × 24h" span={12}><Heatmap rows={7} cols={24} seed={8} color="var(--color-primary)"/></ChartCard>
        </div>
      )}

      <Modal open={open} onClose={()=>setOpen(false)} title="New Broadcast" size="lg"
        footer={<>
          <button onClick={()=>setOpen(false)} className="px-3 py-1.5 text-xs rounded-md border border-border hover:bg-muted">Cancel</button>
          <button onClick={()=>setOpen(false)} className="px-3 py-1.5 text-xs rounded-md bg-primary text-primary-foreground">Schedule</button>
        </>}>
        <div className="space-y-3">
          <div><label className="text-[11px] text-muted-foreground">Title</label><input className="mt-1 w-full bg-muted text-xs rounded-md px-2 py-1.5 border border-border outline-none focus:border-primary"/></div>
          <div><label className="text-[11px] text-muted-foreground">Channels</label>
            <div className="mt-1 flex flex-wrap gap-2 text-[11px]">
              {["Email","In-app","Slack","Status","SMS"].map(c=>(
                <label key={c} className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted border border-border"><input type="checkbox" defaultChecked={c!=="SMS"}/>{c}</label>
              ))}
            </div>
          </div>
          <div><label className="text-[11px] text-muted-foreground">Body</label><textarea rows={4} className="mt-1 w-full bg-muted text-xs rounded-md px-2 py-1.5 border border-border outline-none focus:border-primary"/></div>
          <div><label className="text-[11px] text-muted-foreground">Send at</label><input type="datetime-local" className="mt-1 w-full bg-muted text-xs rounded-md px-2 py-1.5 border border-border outline-none focus:border-primary"/></div>
        </div>
      </Modal>
    </PageShell>
  );
}
