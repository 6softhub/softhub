import { useEffect, useMemo, useRef, useState } from "react";
import * as Icons from "lucide-react";
import type { DashSpec } from "@/data/dashboards";
import {
  Pill, Donut, Bars, LineSeries, Heatmap, Timeline, Spark,
  DataTable, ProgressBar, Avatar, StatusDot,
} from "./_primitives";
import {
  ChartCard, AIInsights, DashboardToolbar, Modal, TabBar, FilterBar,
  QuickActions, EmptyState, useDashboardState, useTabs,
} from "./_universal";

/* ============================================================
   CATEGORY 04 — AI Systems (premium multi-tab)
   Vala AI · AI API · AI Recovery · AI Intelligence
   ============================================================ */

const grid = "grid grid-cols-12 gap-4";

function Header({ d, right }: { d: DashSpec; right?: React.ReactNode }) {
  const Icon = (Icons as never as Record<string, Icons.LucideIcon>)[d.icon] || Icons.Sparkles;
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
   1. VALA AI
   ============================================================ */
type ValaTab = "overview" | "models" | "agents" | "prompts";
export function ValaAI({ d }: { d: DashSpec }) {
  const s = useDashboardState();
  const { tab, setTab } = useTabs<ValaTab>("overview");
  const [open, setOpen] = useState(false);

  const models = useMemo(() => ([
    { name: "vala-core-v4",   family: "Reasoning",  ctx: "1M",   rps: 4820,  p95: 412, status: "healthy" },
    { name: "vala-flash",     family: "Fast",       ctx: "256k", rps: 12480, p95: 142, status: "healthy" },
    { name: "vala-vision",    family: "Multimodal", ctx: "512k", rps: 2140,  p95: 612, status: "degraded" },
    { name: "vala-code-v3",   family: "Code",       ctx: "1M",   rps: 1840,  p95: 384, status: "healthy" },
    { name: "vala-voice",     family: "Audio",      ctx: "—",    rps: 482,   p95: 218, status: "healthy" },
    { name: "vala-embed-3",   family: "Embedding",  ctx: "32k",  rps: 18420, p95: 38,  status: "healthy" },
  ]), []);

  return (
    <PageShell d={d} toolbar={<DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive} />}>
      <Kpis items={[
        { label: "Input tok/s",  value: "184k",  delta: "+12%", tone: "success" },
        { label: "Output tok/s", value: "102k",  delta: "+8%",  tone: "success" },
        { label: "TTFT p50",     value: "82ms",  delta: "−6ms", tone: "success" },
        { label: "Cache hit",    value: "64%",   delta: "+9pp", tone: "info" },
        { label: "Eval pass",    value: "96%",   delta: "+2pp", tone: "success" },
        { label: "Active agents",value: "1,284", delta: "+184", tone: "info" },
      ]}/>

      <TabBar<ValaTab>
        value={tab} onChange={setTab}
        tabs={[
          { id: "overview", label: "Overview", icon: "Activity" },
          { id: "models",   label: "Model Registry", icon: "Box", badge: models.length },
          { id: "agents",   label: "Agents", icon: "Bot", badge: 5 },
          { id: "prompts",  label: "Prompt Studio", icon: "Wand2" },
        ]}
        right={<button onClick={()=>setOpen(true)} className="text-[11px] px-2 py-1 rounded-md bg-primary text-primary-foreground hover:opacity-90">Deploy</button>}
      />

      {tab === "overview" && (
        <div className={grid}>
          <ChartCard title="Token Throughput · Cluster" subtitle="Live tokens/s across all serving pods" span={8}>
            <LineSeries seed={31} lines={3} height={200}/>
          </ChartCard>
          <ChartCard title="Eval Pass Rate" span={4} className="grid place-items-center">
            <Donut value={96} label="evals" color="var(--color-success)"/>
          </ChartCard>
          <ChartCard title="Tool Invocations · Heat" span={8}>
            <Heatmap rows={6} cols={28} seed={11} color="var(--color-accent)"/>
          </ChartCard>
          <div className="col-span-12 lg:col-span-4 space-y-4">
            <ChartCard title="Quick Actions">
              <QuickActions items={[
                { label: "New Agent",  icon: "Bot",        tone: "primary", onClick: () => setOpen(true) },
                { label: "Fine-tune",  icon: "Sliders",    tone: "accent" },
                { label: "Run Eval",   icon: "BadgeCheck", tone: "info" },
                { label: "Open Logs",  icon: "ScrollText", tone: "warning" },
              ]}/>
            </ChartCard>
            <AIInsights items={[
              { title: "vala-vision p95 trending up", body: "p95 +38% over 1h on multimodal pod-3. Scale replicas 4→6.", tone: "warning", confidence: 88 },
              { title: "Prompt cache hit jumped to 64%", body: "RAG rewrite paying off. Token spend −22% WoW.", tone: "success", confidence: 93 },
            ]}/>
          </div>
        </div>
      )}

      {tab === "models" && (
        <ChartCard title="Model Registry" toolbar={<FilterBar value={s.filter} onChange={s.setFilter} placeholder="Search models…"/>}>
          <DataTable columns={["Model","Family","Context","RPS","p95","Health",""]} rows={
            models.filter(m => m.name.includes(s.filter.toLowerCase())).map((m,i) => [
              <span key={i} className="font-mono text-[11px]">{m.name}</span>,
              <Pill key={i} tone={m.family === "Code" ? "info" : m.family === "Multimodal" ? "accent" : "muted"}>{m.family}</Pill>,
              <span key={i} className="tabular-nums">{m.ctx}</span>,
              <span key={i} className="tabular-nums">{m.rps.toLocaleString()}</span>,
              <span key={i} className={`tabular-nums ${m.p95 > 500 ? "text-warning" : "text-success"}`}>{m.p95}ms</span>,
              <Pill key={i} tone={m.status === "healthy" ? "success" : "warning"}>{m.status}</Pill>,
              <button key={i} className="text-[11px] text-primary hover:underline">Inspect</button>,
            ])
          }/>
        </ChartCard>
      )}

      {tab === "agents" && (
        <div className={grid}>
          <ChartCard title="Active Agents" span={7}>
            {[
              ["Triage Agent", 482, "primary"],
              ["RAG Researcher", 312, "info"],
              ["Code Reviewer", 248, "accent"],
              ["Sales SDR", 148, "success"],
              ["Compliance Bot", 84, "warning"],
            ].map(([n,v,t],i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-2"><StatusDot tone={t as never}/><span className="text-xs">{n}</span></div>
                <div className="flex items-center gap-3">
                  <Spark seed={i+4} color={`var(--color-${t})`} height={20}/>
                  <span className="text-sm font-semibold tabular-nums w-12 text-right">{v}/m</span>
                </div>
              </div>
            ))}
          </ChartCard>
          <ChartCard title="Agent Activity · 24h" span={5}>
            <Bars seed={9} n={48} color="var(--color-primary)" height={180}/>
          </ChartCard>
        </div>
      )}

      {tab === "prompts" && (
        <ChartCard title="Prompt Studio · Recent Runs">
          <DataTable columns={["#","Prompt","Model","Tokens","Latency","Score"]} rows={Array.from({length:8}).map((_,i)=>[
            <span key={i} className="font-mono text-[11px]">r_{(82014+i).toString(36)}</span>,
            <span key={i} className="truncate max-w-[260px] inline-block align-middle text-muted-foreground">
              {["Summarize Q3 board deck…","Classify 12k support tickets…","Rewrite landing copy for ICP …","Extract entities from PDF batch…","Audit codebase for SQLi…","Generate 24 ad variants…","Vectorize legal corpus…","Translate handbook to 18 langs"][i]}
            </span>,
            <span key={i} className="font-mono text-[10px]">{["vala-core-v4","vala-flash","vala-flash","vala-vision","vala-code-v3","vala-core-v4","vala-embed-3","vala-flash"][i]}</span>,
            <span key={i} className="tabular-nums">{[12482,4128,2480,18420,8420,3120,9840,2210][i].toLocaleString()}</span>,
            <span key={i} className="tabular-nums">{[412,142,98,612,384,288,148,118][i]}ms</span>,
            <Pill key={i} tone={(["success","success","success","warning","success","success","success","success"][i]) as never}>{[98,96,94,82,97,95,99,96][i]}</Pill>,
          ])}/>
        </ChartCard>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Deploy Model" size="md"
        footer={<>
          <button onClick={() => setOpen(false)} className="px-3 py-1.5 text-xs rounded-md border border-border hover:bg-muted">Cancel</button>
          <button onClick={() => setOpen(false)} className="px-3 py-1.5 text-xs rounded-md bg-primary text-primary-foreground hover:opacity-90">Deploy</button>
        </>}>
        <div className="space-y-3">
          {["Model name","Base checkpoint","Replicas","GPU SKU"].map(l => (
            <div key={l}>
              <label className="text-[11px] text-muted-foreground">{l}</label>
              <input className="mt-1 w-full bg-muted text-xs rounded-md px-2 py-1.5 border border-border outline-none focus:border-primary"/>
            </div>
          ))}
        </div>
      </Modal>
    </PageShell>
  );
}

/* ============================================================
   2. AI API MANAGER
   ============================================================ */
type ApiTab = "traffic" | "routes" | "keys" | "limits";
export function AIApi({ d }: { d: DashSpec }) {
  const s = useDashboardState();
  const { tab, setTab } = useTabs<ApiTab>("traffic");

  const routes = useMemo(() => Array.from({length:8}).map((_,i)=>({
    path: ["/v1/chat","/v1/embed","/v1/rerank","/v1/vision","/v1/voice","/v1/code","/v1/agent","/v1/eval"][i],
    upstream: ["vala-flash","vala-embed-3","vala-flash","vala-vision","vala-voice","vala-code-v3","vala-core-v4","vala-core-v4"][i],
    rps: [12480,18420,2140,2140,482,1840,820,148][i],
    p95: [142,38,98,612,218,384,512,1024][i],
    err: [0.02,0.01,0.04,0.18,0.08,0.06,0.12,0.04][i],
  })), []);

  return (
    <PageShell d={d} toolbar={<DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive}/>}>
      <Kpis items={[
        { label: "RPS",          value: "38.4k", delta: "+6%",  tone: "success" },
        { label: "p95",          value: "212ms", delta: "−18ms",tone: "success" },
        { label: "Errors",       value: "0.07%", delta: "+0.02",tone: "warning" },
        { label: "Cache hit",    value: "72%",   delta: "+8pp", tone: "info" },
        { label: "Active keys",  value: "1,284", delta: "+24",  tone: "info" },
        { label: "Egress saved", value: "$2.4k", delta: "/day", tone: "success" },
      ]}/>

      <TabBar<ApiTab>
        value={tab} onChange={setTab}
        tabs={[
          { id: "traffic", label: "Traffic",   icon: "Activity" },
          { id: "routes",  label: "Routes",    icon: "Route", badge: routes.length },
          { id: "keys",    label: "API Keys",  icon: "Key" },
          { id: "limits",  label: "Rate Limits", icon: "GaugeCircle" },
        ]}
      />

      {tab === "traffic" && (
        <div className={grid}>
          <ChartCard title="Edge Throughput · 24h" span={8}><LineSeries seed={42} lines={2} height={200}/></ChartCard>
          <ChartCard title="Error Budget" span={4} className="grid place-items-center">
            <Donut value={86} label="budget" color="var(--color-info)"/>
          </ChartCard>
          <AIInsights items={[
            { title: "Spike on /v1/vision", body: "RPS +212% over 15m from key ak_wayne_r&d_3. Tighten per-key quota.", tone: "warning", confidence: 91 },
            { title: "Cache hit climbing", body: "/v1/embed cache hit 82% vs 64% baseline. Egress −$2.4k/d.", tone: "success", confidence: 96 },
          ]}/>
        </div>
      )}

      {tab === "routes" && (
        <ChartCard title="Routes" toolbar={<FilterBar value={s.filter} onChange={s.setFilter} placeholder="Search routes…"/>}>
          <DataTable columns={["Path","Upstream","RPS","p95","Errors","Cache","Policy"]} rows={
            routes.filter(r => r.path.includes(s.filter)).map((r,i)=>[
              <span key={i} className="font-mono text-[11px]">{r.path}</span>,
              <span key={i} className="font-mono text-[10px] text-muted-foreground">{r.upstream}</span>,
              <span key={i} className="tabular-nums">{r.rps.toLocaleString()}</span>,
              <span key={i} className={`tabular-nums ${r.p95>500?"text-warning":"text-success"}`}>{r.p95}ms</span>,
              <span key={i} className={`tabular-nums ${r.err>0.1?"text-destructive":"text-muted-foreground"}`}>{r.err.toFixed(2)}%</span>,
              <div key={i} className="w-20"><ProgressBar value={[68,82,42,12,38,54,28,8][i]} color="var(--color-info)"/></div>,
              <Pill key={i} tone="info">jwt+rl</Pill>,
            ])
          }/>
        </ChartCard>
      )}

      {tab === "keys" && (
        <ChartCard title="API Keys · By Workspace">
          {["Acme Prod","Globex Dev","Initech CI","Wayne R&D","Pied Piper","Hooli Stage","Massive Dynamic"].map((n,i)=>(
            <div key={n} className="py-2 border-b border-border last:border-0 flex items-center justify-between">
              <div className="flex items-center gap-2"><Avatar name={n}/><span className="text-xs">{n}</span></div>
              <div className="text-right">
                <div className="text-[10px] text-muted-foreground">quota</div>
                <div className="w-40"><ProgressBar value={[68,42,84,28,92,38,72][i]} color={[68,42,84,28,92,38,72][i]>80?"var(--color-warning)":"var(--color-success)"}/></div>
              </div>
            </div>
          ))}
        </ChartCard>
      )}

      {tab === "limits" && (
        <ChartCard title="Rate-limit Hits · Heat">
          <Heatmap rows={6} cols={28} seed={9} color="var(--color-warning)"/>
        </ChartCard>
      )}
    </PageShell>
  );
}

/* ============================================================
   3. AI RECOVERY
   ============================================================ */
type RecTab = "overview" | "failover" | "runbooks" | "timeline";
export function AIRecovery({ d }: { d: DashSpec }) {
  const s = useDashboardState();
  const { tab, setTab } = useTabs<RecTab>("overview");

  return (
    <PageShell d={d} toolbar={<DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive}/>}>
      <Kpis items={[
        { label: "Auto-heals", value: "1,284", delta: "24h",  tone: "success" },
        { label: "MTTR",       value: "38s",   delta: "−12s", tone: "success" },
        { label: "Pages",      value: "4",     delta: "open", tone: "warning" },
        { label: "Failbacks",  value: "12",    delta: "OK",   tone: "info" },
        { label: "Drift score",value: "0.18",  delta: "−0.04",tone: "success" },
        { label: "Uptime",     value: "99.98%",delta: "30d",  tone: "success" },
      ]}/>

      <TabBar<RecTab>
        value={tab} onChange={setTab}
        tabs={[
          { id: "overview", label: "Overview",  icon: "Activity" },
          { id: "failover", label: "Failover Topology", icon: "GitMerge" },
          { id: "runbooks", label: "Runbooks",  icon: "BookOpen", badge: 4 },
          { id: "timeline", label: "Timeline",  icon: "Clock" },
        ]}
      />

      {tab === "overview" && (
        <div className={grid}>
          <ChartCard title="Self-heal Events · 24h" span={8}>
            <Bars seed={5} n={48} color="var(--color-success)" height={200}/>
          </ChartCard>
          <ChartCard title="Model Drift Score" span={4} className="grid place-items-center">
            <Donut value={18} label="drift" color="var(--color-warning)"/>
          </ChartCard>
        </div>
      )}

      {tab === "failover" && (
        <ChartCard title="Failover Topology">
          {[
            ["us-east-1 → us-west-2", "warm", "12ms", "success"],
            ["eu-west-1 → eu-central-1","warm","8ms","success"],
            ["ap-south-1 → ap-east-1", "active","42ms","warning"],
            ["us-east-1 → eu-west-1",  "cold", "—",   "muted"],
            ["sa-east-1 → us-east-1",  "warm", "62ms","success"],
          ].map(([from,state,lag,tone],i)=>(
            <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div className="flex items-center gap-2"><Icons.GitMerge className="w-3.5 h-3.5 text-muted-foreground"/><span className="text-xs font-mono">{from}</span></div>
              <div className="flex items-center gap-3">
                <Pill tone={tone as never}>{state as string}</Pill>
                <span className="text-xs tabular-nums w-12 text-right">{lag as string}</span>
              </div>
            </div>
          ))}
        </ChartCard>
      )}

      {tab === "runbooks" && (
        <ChartCard title="Active Runbooks">
          <DataTable columns={["Runbook","Trigger","Last Run","Status"]} rows={[
            ["scale-vision-pod","p95 > 500ms","2m ago","ok"],
            ["fallback-flash","upstream 5xx > 1%","12m ago","ok"],
            ["reseed-embeddings","drift > 0.4","1h ago","warn"],
            ["evict-bad-tokens","auth fail surge","6h ago","ok"],
          ].map(([n,t,l,st],i)=>[
            <span key={i} className="font-mono text-[11px]">{n}</span>,
            <span key={i} className="text-muted-foreground">{t}</span>,
            <span key={i}>{l}</span>,
            <Pill key={i} tone={st==="ok"?"success":"warning"}>{st as string}</Pill>,
          ])}/>
        </ChartCard>
      )}

      {tab === "timeline" && (
        <ChartCard title="Recovery Timeline">
          <Timeline items={[
            { time: "now", title: "vala-vision pod-3 restarted (OOM)", tone: "warning" },
            { time: "4m",  title: "Auto-scaled flash replicas 8→12",  tone: "success" },
            { time: "18m", title: "Drift alert · embed-3 (cosine 0.41)", tone: "warning" },
            { time: "42m", title: "Failback us-west-2 → us-east-1 OK",  tone: "success" },
            { time: "2h",  title: "Canary rollback · vala-core-v4-rc2", tone: "destructive" },
            { time: "6h",  title: "Quota auto-raise on /v1/embed",      tone: "info" },
          ]}/>
        </ChartCard>
      )}
    </PageShell>
  );
}

/* ============================================================
   4. AI INTELLIGENCE
   ============================================================ */
type IntelTab = "signals" | "forecast" | "anomalies" | "insights";
export function AIIntelligence({ d }: { d: DashSpec }) {
  const s = useDashboardState();
  const { tab, setTab } = useTabs<IntelTab>("signals");
  const [tick, setTick] = useState(0);
  const ref = useRef<number | null>(null);
  useEffect(() => {
    if (!s.live) return;
    ref.current = window.setInterval(() => setTick(t => t + 1), 1500);
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [s.live]);

  const signals = useMemo(() => ([
    { src: "billing",   msg: "ARR forecast revised +$412k for Q3",  tone: "success",     conf: 92 },
    { src: "soc",       msg: "Brute-force pattern · 12 IPs in EU",  tone: "destructive", conf: 88 },
    { src: "crm",       msg: "Pied Piper deal velocity ↑ 2.4×",     tone: "info",        conf: 84 },
    { src: "obs",       msg: "p95 regression · checkout-api",       tone: "warning",     conf: 91 },
    { src: "marketing", msg: "CAC down 18% on TikTok cohort",       tone: "success",     conf: 78 },
    { src: "fraud",     msg: "New ring detected · 42 accounts",     tone: "destructive", conf: 96 },
  ]), []);

  return (
    <PageShell d={d} toolbar={<DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive}/>}>
      <Kpis items={[
        { label: "Signals/min",  value: "184",  delta: "+12%", tone: "info" },
        { label: "Avg confidence", value: "92%", delta: "+3pp", tone: "success" },
        { label: "Open alerts",  value: "7",    delta: "2 P1", tone: "warning" },
        { label: "Forecast rev", value: "+12%", delta: "Q3",   tone: "success" },
        { label: "Risk",         value: "+3.2%",delta: "wk",   tone: "warning" },
        { label: "Churn",        value: "−0.8%",delta: "wk",   tone: "success" },
      ]}/>

      <TabBar<IntelTab>
        value={tab} onChange={setTab}
        tabs={[
          { id: "signals",   label: "Signal Stream", icon: "Radio", badge: signals.length },
          { id: "forecast",  label: "Forecast",      icon: "TrendingUp" },
          { id: "anomalies", label: "Anomalies",     icon: "AlertTriangle" },
          { id: "insights",  label: "AI Insights",   icon: "Sparkles" },
        ]}
      />

      {tab === "signals" && (
        <ChartCard title="Cross-system Signal Stream">
          {signals.length === 0 ? (
            <EmptyState icon="Inbox" title="No signals" hint="Connect a source to start receiving insights."/>
          ) : (
            <ul className="space-y-2">
              {signals.map((sig,i)=>(
                <li key={i} className="flex items-start gap-3 p-2 rounded-md border border-border bg-muted/30 hover:bg-muted/50 transition-colors animate-fade-up" style={{ animationDelay: `${i*60}ms` }}>
                  <StatusDot tone={sig.tone as never}/>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs flex items-center gap-2">
                      <Pill tone="muted">{sig.src}</Pill>
                      <span className="truncate">{sig.msg}</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">confidence {sig.conf}% · just now {s.live && tick > 0 ? `· refresh ${tick}` : ""}</div>
                  </div>
                  <button className="text-[10px] text-primary hover:underline shrink-0">Open</button>
                </li>
              ))}
            </ul>
          )}
        </ChartCard>
      )}

      {tab === "forecast" && (
        <div className={grid}>
          <ChartCard title="Forecast · Revenue × Risk × Churn" span={8}>
            <LineSeries seed={17} lines={3} height={220}/>
          </ChartCard>
          <ChartCard title="Predictive Confidence" span={4} className="grid place-items-center">
            <Donut value={92} label="avg conf" color="var(--color-accent)"/>
          </ChartCard>
        </div>
      )}

      {tab === "anomalies" && (
        <ChartCard title="Anomaly Heat · Systems × Hour">
          <Heatmap rows={10} cols={24} seed={21} color="var(--color-destructive)"/>
        </ChartCard>
      )}

      {tab === "insights" && (
        <AIInsights items={[
          { title: "Correlation: SOC bursts ↔ checkout p95", body: "92% temporal correlation in last 7d. Investigate WAF tuning impact.", tone: "warning", confidence: 89 },
          { title: "Causal: marketing spend → activation",   body: "+$10k TikTok lifts activation +1.8pp at lag 4d. Suggest doubling cohort.", tone: "success", confidence: 84 },
          { title: "Anomaly: GMV in DE",                     body: "−18% vs forecast band. Possible regional outage upstream.", tone: "destructive", confidence: 93 },
          { title: "Capacity: vala-flash trending hot",      body: "Projected to breach 90% util in 3.4 days at current growth.", tone: "warning", confidence: 87 },
        ]}/>
      )}
    </PageShell>
  );
}
