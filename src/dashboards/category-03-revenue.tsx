import { useMemo, useState } from "react";
import * as Icons from "lucide-react";
import type { DashSpec } from "@/data/dashboards";
import {
  Shell, Card, DataTable, Pill, Donut, Bars, LineSeries, ProgressBar,
  Avatar, Timeline, StatusDot, Heatmap, Kanban, Spark,
} from "./_primitives";
import {
  ChartCard, DashboardToolbar, FilterBar, QuickActions, AIInsights,
  Modal, EmptyState, useDashboardState,
} from "./_universal";

/* ============================================================
   CATEGORY 03 — CRM + Sales + Customer Success
   Slugs: crm, sales-pipeline, billing, support, customer-success, onboarding
   ============================================================ */

/* ---------------- 17. CRM & Lead Management ---------------- */
export function CRM({ d }: { d: DashSpec }) {
  const s = useDashboardState();
  const [open, setOpen] = useState(false);
  const leads = useMemo(() => Array.from({ length: 9 }).map((_, i) => ({
    name: ["Acme Corp", "Globex", "Initech", "Umbrella", "Stark Ind", "Wayne Ent", "Tyrell", "Hooli", "Pied Piper"][i],
    contact: ["meera@", "rao@", "sven@", "luna@", "akira@", "diego@", "priya@", "tara@", "otis@"][i] + ["acme","globex","initech","umb","stark","wayne","tyrell","hooli","pp"][i] + ".io",
    score: [92, 78, 64, 88, 71, 55, 84, 42, 96][i],
    stage: ["Qualify","Discover","Propose","Negotiate","Closed-Won","Discover","Propose","Disqualified","Qualify"][i],
    value: [82,148,32,212,98,18,124,0,402][i],
  })), []);
  const filtered = leads.filter(l => l.name.toLowerCase().includes(s.filter.toLowerCase()));

  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <ChartCard
          title="Pipeline Velocity"
          subtitle="Lead → Won conversion across stages"
          toolbar={<DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive} />}
          span={8}
        >
          <LineSeries seed={17} lines={3} height={180} />
        </ChartCard>

        <ChartCard title="Win Rate" span={4} className="grid place-items-center">
          <Donut value={34} label="win rate" color="var(--color-success)" />
        </ChartCard>

        <ChartCard
          title="Lead Inbox"
          toolbar={<FilterBar value={s.filter} onChange={s.setFilter} placeholder="Search accounts…" />}
          span={8}
        >
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
            { title: "Forecast risk", body: "Q2 commit -$420k vs plan if Stark doesn't close by month-end.", tone: "destructive", confidence: 84 },
          ]} />
        </div>

        <ChartCard title="Activity Timeline" span={12}>
          <Timeline items={[
            { time: "now", title: "Pied Piper · Demo scheduled w/ CTO", tone: "success" },
            { time: "12m", title: "Acme · Proposal v3 sent ($82k ARR)", tone: "info" },
            { time: "1h", title: "Stark · Procurement loop opened", tone: "warning" },
            { time: "3h", title: "Hooli · Marked unresponsive", tone: "muted" },
            { time: "6h", title: "Wayne · Closed-Won 🎉 ($98k ARR)", tone: "success" },
          ]} />
        </ChartCard>
      </div>

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
    </Shell>
  );
}

/* ---------------- 18. Sales & Pipeline (Kanban) ---------------- */
export function SalesPipeline({ d }: { d: DashSpec }) {
  const s = useDashboardState();
  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <ChartCard
          title="Deal Board"
          toolbar={<DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive} />}
          span={12}
        >
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

        <ChartCard title="Quota Attainment · Reps" span={7}>
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

        <ChartCard title="Forecast vs Plan" span={5}>
          <LineSeries seed={9} lines={2} height={180}/>
          <div className="grid grid-cols-3 mt-3 text-center text-[11px]">
            <div><div className="text-muted-foreground">Commit</div><div className="font-semibold">$2.1M</div></div>
            <div><div className="text-muted-foreground">Best</div><div className="font-semibold text-success">$2.6M</div></div>
            <div><div className="text-muted-foreground">Plan</div><div className="font-semibold">$2.4M</div></div>
          </div>
        </ChartCard>

        <ChartCard title="Activity Heat · Calls × Days" span={12}>
          <Heatmap rows={6} cols={28} seed={3} color="var(--color-success)" />
        </ChartCard>
      </div>
    </Shell>
  );
}

/* ---------------- 19. Billing / Stripe ---------------- */
export function Billing({ d }: { d: DashSpec }) {
  const s = useDashboardState();
  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <ChartCard title="Gross Volume · 30d" span={8}
          toolbar={<DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive} />}>
          <LineSeries seed={5} lines={2} />
        </ChartCard>
        <ChartCard title="Authorization Rate" span={4} className="grid place-items-center">
          <Donut value={94} label="auth ok" color="var(--color-info)" />
        </ChartCard>

        <ChartCard title="Recent Payments" span={8}>
          <DataTable columns={["Charge", "Customer", "Method", "Amount", "Status"]} rows={Array.from({length:8}).map((_,i)=>[
            <span key={i} className="font-mono text-[11px]">ch_{(48201+i).toString(36)}</span>,
            ["acme@","globex@","init@","umb@","stark@","wayne@","tyrell@","hooli@"][i] + "io",
            ["Visa •4242","Amex •0005","Mc •3333","Visa •1881","ACH","SEPA","Visa •0341","Mc •8210"][i],
            <span key={i} className="tabular-nums">${(i+1)*128}.{(i*7)%100}</span>,
            <Pill key={i} tone={["success","success","warning","success","success","destructive","success","success"][i] as never}>
              {["Succeeded","Succeeded","Pending","Succeeded","Succeeded","Failed","Succeeded","Succeeded"][i]}
            </Pill>,
          ])}/>
        </ChartCard>

        <ChartCard title="Payout Schedule" span={4}>
          {["Today","Tomorrow","Wed","Thu","Fri"].map((d2,i)=>(
            <div key={d2} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div className="flex items-center gap-2"><Icons.CalendarDays className="w-3.5 h-3.5 text-muted-foreground"/><span className="text-xs">{d2}</span></div>
              <span className="text-sm font-semibold tabular-nums">${[48,32,84,18,42][i]}.2k</span>
            </div>
          ))}
        </ChartCard>

        <ChartCard title="Disputes & Risk" span={6}>
          <div className="grid grid-cols-3 gap-3 mb-3">
            {[["Open","12","destructive"],["Won","48","success"],["Lost","6","warning"]].map(([l,v,t],i)=>(
              <div key={i} className="rounded-md border border-border p-3 text-center">
                <div className="text-[10px] text-muted-foreground uppercase">{l}</div>
                <div className={`text-xl font-bold text-${t}`}>{v}</div>
              </div>
            ))}
          </div>
          <Bars seed={6} n={20} color="var(--color-destructive)" height={80}/>
        </ChartCard>

        <ChartCard title="Geo Volume" span={6}>
          <WorldMapAlt />
        </ChartCard>
      </div>
    </Shell>
  );
}

function WorldMapAlt() {
  return <div className="relative aspect-[16/9] rounded-md bg-muted/30 overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,var(--color-primary)/0.25,transparent_40%),radial-gradient(circle_at_70%_60%,var(--color-accent)/0.2,transparent_40%)]"/>
    <div className="absolute bottom-2 left-2 text-[10px] text-muted-foreground">Live · 42 regions</div>
  </div>;
}

/* ---------------- 21. Support / Zendesk ---------------- */
export function Support({ d }: { d: DashSpec }) {
  const s = useDashboardState();
  const [picked, setPicked] = useState<string | null>(null);
  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <ChartCard title="Queue · By Channel" span={4}>
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

        <ChartCard title="SLA Heat · 7d × 24h" span={5}>
          <Heatmap rows={7} cols={24} seed={4} color="var(--color-warning)"/>
        </ChartCard>

        <ChartCard title="CSAT · 30d" span={3} className="grid place-items-center">
          <Donut value={94} label="CSAT" color="var(--color-success)"/>
        </ChartCard>

        <ChartCard title="Tickets" span={12}
          toolbar={<FilterBar value={s.filter} onChange={s.setFilter} placeholder="Search tickets…"/>}>
          <DataTable columns={["#","Subject","Requester","Channel","Priority","SLA","Agent",""]} rows={Array.from({length:8}).map((_,i)=>{
            const id = `#${48201+i}`;
            return [
              <span key={i} className="font-mono text-[11px]">{id}</span>,
              `Issue with ${["login","invoice","export","upload","2FA","API","trial","seat"][i]}`,
              `user${i+1}@cust.io`,
              ["email","chat","email","phone","chat","email","social","email"][i],
              <Pill key={i} tone={["destructive","warning","info","muted","warning","info","muted","destructive"][i] as never}>{["Urgent","High","Normal","Low","High","Normal","Low","Urgent"][i]}</Pill>,
              i===0?<Pill key={i} tone="destructive">Breach 8m</Pill>:<Pill key={i} tone="success">OK</Pill>,
              ["meera","akira","diego","luna","sven","priya","tara","rao"][i],
              <button key={i} onClick={()=>setPicked(id)} className="text-[11px] text-primary hover:underline">Open</button>,
            ];
          })}/>
        </ChartCard>

        <AIInsights items={[
          { title: "Surge: 2FA tickets +312%", body: "Likely caused by SSO rollout. Recommend pinning macro #218 and paging on-call.", tone: "warning", confidence: 88 },
          { title: "Macro coverage low", body: "32% of inbound match no macro. Run AI macro-mining on last 7 days.", tone: "info", confidence: 71 },
        ]}/>
      </div>

      <Modal open={!!picked} onClose={()=>setPicked(null)} title={`Ticket ${picked}`} size="lg">
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3"><Avatar name="user@cust.io"/><div><div className="font-medium">user@cust.io</div><div className="text-[11px] text-muted-foreground">Reported 12m ago · Priority Urgent</div></div></div>
          <div className="rounded-md border border-border p-3 bg-muted/30 text-xs">Hi team — login broken after 2FA reset. URGENT, blocking my entire org.</div>
          <textarea placeholder="Reply…" className="w-full bg-muted text-xs rounded-md p-2 border border-border outline-none focus:border-primary min-h-24"/>
        </div>
      </Modal>
    </Shell>
  );
}

/* ---------------- 56. Customer Success ---------------- */
export function CustomerSuccess({ d }: { d: DashSpec }) {
  const s = useDashboardState();
  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <ChartCard title="Account Health" span={8}
          toolbar={<DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive}/>}>
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

        <ChartCard title="Open CTAs" span={7}>
          <Timeline items={[
            { time:"now", title:"Risk · Acme-3 usage drop 42%", tone:"destructive" },
            { time:"1h", title:"Expansion · Globex requested seats +24", tone:"success" },
            { time:"3h", title:"QBR scheduled · Wayne Ent", tone:"info" },
            { time:"1d", title:"Renewal review · Initech (D-30)", tone:"warning" },
            { time:"2d", title:"Adoption milestone · Tyrell hit 80% MAU", tone:"success" },
          ]}/>
        </ChartCard>

        <ChartCard title="Quick Actions" span={5}>
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
    </Shell>
  );
}

/* ---------------- 57. Onboarding / Appcues ---------------- */
export function Onboarding({ d }: { d: DashSpec }) {
  const s = useDashboardState();
  const funnel = [["Signup",4128,100],["Verified",3812,92],["Workspace",2401,58],["First Action",1812,44],["Week-2 Active",1248,30],["Activated",812,20]] as const;
  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <ChartCard title="Activation Funnel" span={7}
          toolbar={<DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive}/>}>
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

        <ChartCard title="Active Flows" span={5}>
          {["Welcome Tour · v3","Empty Dashboard","Invite Teammates","Connect Data","Trial Expiring"].map((f,i)=>(
            <div key={f} className="py-2 border-b border-border last:border-0">
              <div className="flex justify-between text-xs"><span>{f}</span><span className="text-success tabular-nums">{[68,42,84,38,22][i]}%</span></div>
              <ProgressBar value={[68,42,84,38,22][i]}/>
            </div>
          ))}
        </ChartCard>

        <ChartCard title="Tooltip Engagement · Heat" span={8}>
          <Heatmap rows={5} cols={28} seed={7} color="var(--color-info)"/>
        </ChartCard>

        <ChartCard title="Activation Rate" span={4} className="grid place-items-center">
          <Donut value={20} label="activated" color="var(--color-accent)"/>
        </ChartCard>

        <AIInsights items={[
          { title:"Drop-off at Workspace step", body:"34% abandon between Verified and Workspace. Suggest reducing required fields from 6→3.", tone:"warning", confidence: 89 },
          { title:"Tour completion correlates with retention", body:"Users who finish Welcome Tour v3 have 2.4× day-30 retention.", tone:"success", confidence: 93 },
        ]}/>
      </div>
    </Shell>
  );
}
