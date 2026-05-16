import { useEffect, useMemo, useRef, useState } from "react";
import * as Icons from "lucide-react";
import type { DashSpec } from "@/data/dashboards";
import {
  Shell, Card, DataTable, Pill, Donut, Bars, LineSeries, ProgressBar,
  Spark, StatusDot, Heatmap, Timeline, Avatar,
} from "./_primitives";
import {
  ChartCard, DashboardToolbar, FilterBar, QuickActions, AIInsights,
  Modal, EmptyState, useDashboardState,
} from "./_universal";

/* ============================================================
   CATEGORY 04 — AI SYSTEMS
   Slugs: vala-ai, ai-api, ai-recovery, ai-intelligence
   (ai-copilot already has its own premium dashboard)
   ============================================================ */

/* ---------------- Vala AI System ---------------- */
export function ValaAI({ d }: { d: DashSpec }) {
  const s = useDashboardState();
  const [open, setOpen] = useState(false);
  const models = useMemo(() => ([
    { name: "vala-core-v4",     family: "Reasoning",   ctx: "1M",  rps: 4820, p95: 412, status: "healthy" },
    { name: "vala-flash",       family: "Fast",        ctx: "256k", rps: 12480, p95: 142, status: "healthy" },
    { name: "vala-vision",      family: "Multimodal",  ctx: "512k", rps: 2140, p95: 612, status: "degraded" },
    { name: "vala-code-v3",     family: "Code",        ctx: "1M",  rps: 1840, p95: 384, status: "healthy" },
    { name: "vala-voice",       family: "Audio",       ctx: "—",   rps: 482,  p95: 218, status: "healthy" },
    { name: "vala-embed-3",     family: "Embedding",   ctx: "32k", rps: 18420, p95: 38,  status: "healthy" },
  ]), []);

  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <ChartCard
          title="Token Throughput · Cluster"
          subtitle="Live tokens/s across all serving pods"
          toolbar={<DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive} />}
          span={8}
        >
          <LineSeries seed={31} lines={3} height={200} />
          <div className="grid grid-cols-4 mt-3 text-center text-[11px]">
            <div><div className="text-muted-foreground">Input tok/s</div><div className="font-semibold tabular-nums">184k</div></div>
            <div><div className="text-muted-foreground">Output tok/s</div><div className="font-semibold tabular-nums">102k</div></div>
            <div><div className="text-muted-foreground">TTFT p50</div><div className="font-semibold tabular-nums text-success">82ms</div></div>
            <div><div className="text-muted-foreground">Cache hit</div><div className="font-semibold tabular-nums text-info">64%</div></div>
          </div>
        </ChartCard>

        <ChartCard title="Eval Pass Rate" span={4} className="grid place-items-center">
          <Donut value={96} label="evals" color="var(--color-success)" />
        </ChartCard>

        <ChartCard title="Model Registry" span={12}
          toolbar={<>
            <FilterBar value={s.filter} onChange={s.setFilter} placeholder="Search models…" />
            <button onClick={() => setOpen(true)} className="text-[11px] px-2 py-1 rounded-md bg-primary text-primary-foreground hover:opacity-90">Deploy</button>
          </>}>
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

        <ChartCard title="Active Agents" span={5}>
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

        <ChartCard title="Prompt Studio · Recent Runs" span={7}>
          <DataTable columns={["#","Prompt","Model","Tokens","Latency","Score"]} rows={Array.from({length:6}).map((_,i)=>[
            <span key={i} className="font-mono text-[11px]">r_{(82014+i).toString(36)}</span>,
            <span key={i} className="truncate max-w-[260px] inline-block align-middle text-muted-foreground">
              {["Summarize Q3 board deck…","Classify 12k support tickets…","Rewrite landing copy for ICP …","Extract entities from PDF batch…","Audit codebase for SQLi…","Generate 24 ad variants…"][i]}
            </span>,
            <span key={i} className="font-mono text-[10px]">{["vala-core-v4","vala-flash","vala-flash","vala-vision","vala-code-v3","vala-core-v4"][i]}</span>,
            <span key={i} className="tabular-nums">{[12482,4128,2480,18420,8420,3120][i].toLocaleString()}</span>,
            <span key={i} className="tabular-nums">{[412,142,98,612,384,288][i]}ms</span>,
            <Pill key={i} tone={(["success","success","success","warning","success","success"][i]) as never}>{[98,96,94,82,97,95][i]}</Pill>,
          ])}/>
        </ChartCard>

        <ChartCard title="Tool Invocations · Heat" span={8}>
          <Heatmap rows={6} cols={28} seed={11} color="var(--color-accent)"/>
        </ChartCard>
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <ChartCard title="Quick Actions">
            <QuickActions items={[
              { label: "New Agent",  icon: "Bot",         tone: "primary", onClick: () => setOpen(true) },
              { label: "Fine-tune",  icon: "Sliders",     tone: "accent" },
              { label: "Run Eval",   icon: "BadgeCheck",  tone: "info" },
              { label: "Open Logs",  icon: "ScrollText",  tone: "warning" },
            ]} />
          </ChartCard>
          <AIInsights items={[
            { title: "vala-vision p95 trending up",  body: "p95 latency +38% over 1h on multimodal pod-3. Recommend scaling replicas 4→6.", tone: "warning", confidence: 88 },
            { title: "Prompt cache hit jumped to 64%", body: "RAG retriever rewrite is paying off. Token spend −22% week-over-week.",       tone: "success",  confidence: 93 },
          ]} />
        </div>
      </div>

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
    </Shell>
  );
}

/* ---------------- AI API Manager ---------------- */
export function AIApi({ d }: { d: DashSpec }) {
  const s = useDashboardState();
  const routes = useMemo(() => Array.from({length:8}).map((_,i)=>({
    path: ["/v1/chat","/v1/embed","/v1/rerank","/v1/vision","/v1/voice","/v1/code","/v1/agent","/v1/eval"][i],
    upstream: ["vala-flash","vala-embed-3","vala-flash","vala-vision","vala-voice","vala-code-v3","vala-core-v4","vala-core-v4"][i],
    rps: [12480,18420,2140,2140,482,1840,820,148][i],
    p95: [142,38,98,612,218,384,512,1024][i],
    err: [0.02,0.01,0.04,0.18,0.08,0.06,0.12,0.04][i],
  })), []);

  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <ChartCard title="Edge Throughput · 24h" span={8}
          toolbar={<DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive}/>}>
          <LineSeries seed={42} lines={2} height={180}/>
        </ChartCard>
        <ChartCard title="Error Budget" span={4} className="grid place-items-center">
          <Donut value={86} label="budget" color="var(--color-info)"/>
        </ChartCard>

        <ChartCard title="Routes" span={12} toolbar={<FilterBar value={s.filter} onChange={s.setFilter} placeholder="Search routes…"/>}>
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

        <ChartCard title="API Keys · By Workspace" span={5}>
          {["Acme Prod","Globex Dev","Initech CI","Wayne R&D","Pied Piper"].map((n,i)=>(
            <div key={n} className="py-2 border-b border-border last:border-0 flex items-center justify-between">
              <div className="flex items-center gap-2"><Avatar name={n}/><span className="text-xs">{n}</span></div>
              <div className="text-right">
                <div className="text-[10px] text-muted-foreground">quota</div>
                <div className="w-32"><ProgressBar value={[68,42,84,28,92][i]} color={[68,42,84,28,92][i]>80?"var(--color-warning)":"var(--color-success)"}/></div>
              </div>
            </div>
          ))}
        </ChartCard>

        <ChartCard title="Rate-limit Hits · Heat" span={7}>
          <Heatmap rows={5} cols={28} seed={9} color="var(--color-warning)"/>
        </ChartCard>

        <AIInsights items={[
          { title: "Spike on /v1/vision", body: "RPS +212% over 15m from key ak_wayne_r&d_3. Recommend tighten per-key quota or auto-throttle.", tone: "warning", confidence: 91 },
          { title: "Cache hit climbing", body: "/v1/embed cache hit 82% vs 64% baseline. Egress cost −$2.4k/d.", tone: "success", confidence: 96 },
        ]}/>
      </div>
    </Shell>
  );
}

/* ---------------- AI Recovery & Failover ---------------- */
export function AIRecovery({ d }: { d: DashSpec }) {
  const s = useDashboardState();
  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <ChartCard title="Self-heal Events · 24h" span={8}
          toolbar={<DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive}/>}>
          <Bars seed={5} n={48} color="var(--color-success)" height={160}/>
          <div className="grid grid-cols-4 mt-3 text-center text-[11px]">
            <div><div className="text-muted-foreground">Auto-heals</div><div className="font-semibold tabular-nums text-success">1,284</div></div>
            <div><div className="text-muted-foreground">MTTR</div><div className="font-semibold tabular-nums">38s</div></div>
            <div><div className="text-muted-foreground">Pages</div><div className="font-semibold tabular-nums text-warning">4</div></div>
            <div><div className="text-muted-foreground">Failbacks</div><div className="font-semibold tabular-nums">12</div></div>
          </div>
        </ChartCard>

        <ChartCard title="Model Drift Score" span={4} className="grid place-items-center">
          <Donut value={18} label="drift" color="var(--color-warning)"/>
        </ChartCard>

        <ChartCard title="Failover Topology" span={6}>
          {[
            ["us-east-1 → us-west-2", "warm", "12ms", "success"],
            ["eu-west-1 → eu-central-1","warm","8ms","success"],
            ["ap-south-1 → ap-east-1", "active","42ms","warning"],
            ["us-east-1 → eu-west-1",  "cold", "—",   "muted"],
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

        <ChartCard title="Active Runbooks" span={6}>
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

        <ChartCard title="Recovery Timeline" span={12}>
          <Timeline items={[
            { time: "now", title: "vala-vision pod-3 restarted (OOM)", tone: "warning" },
            { time: "4m", title: "Auto-scaled flash replicas 8→12",   tone: "success" },
            { time: "18m",title: "Drift alert · embed-3 (cosine 0.41)", tone: "warning" },
            { time: "42m",title: "Failback us-west-2 → us-east-1 OK",  tone: "success" },
            { time: "2h", title: "Canary rollback · vala-core-v4-rc2", tone: "destructive" },
          ]}/>
        </ChartCard>
      </div>
    </Shell>
  );
}

/* ---------------- AI Intelligence Hub ---------------- */
export function AIIntelligence({ d }: { d: DashSpec }) {
  const s = useDashboardState();
  // Live ticker
  const [tick, setTick] = useState(0);
  const ref = useRef<number | null>(null);
  useEffect(() => {
    if (!s.live) return;
    ref.current = window.setInterval(() => setTick(t => t + 1), 1500);
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [s.live]);

  const signals = useMemo(() => ([
    { src: "billing",   msg: "ARR forecast revised +$412k for Q3",  tone: "success",     conf: 92 },
    { src: "soc",       msg: "Brute-force pattern · 12 IPs in EU",   tone: "destructive", conf: 88 },
    { src: "crm",       msg: "Pied Piper deal velocity ↑ 2.4×",      tone: "info",        conf: 84 },
    { src: "obs",       msg: "p95 regression · checkout-api",        tone: "warning",     conf: 91 },
    { src: "marketing", msg: "CAC down 18% on TikTok cohort",        tone: "success",     conf: 78 },
    { src: "fraud",     msg: "New ring detected · 42 accounts",      tone: "destructive", conf: 96 },
  ]), []);

  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <ChartCard title="Cross-system Signal Stream" span={8}
          toolbar={<DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive}/>}>
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

        <ChartCard title="Predictive Confidence" span={4} className="grid place-items-center">
          <Donut value={92} label="avg conf" color="var(--color-accent)"/>
        </ChartCard>

        <ChartCard title="Forecast · Revenue × Risk × Churn" span={8}>
          <LineSeries seed={17} lines={3} height={180}/>
          <div className="grid grid-cols-3 mt-3 text-center text-[11px]">
            <div><div className="text-muted-foreground">Revenue</div><div className="font-semibold text-success">+12.4%</div></div>
            <div><div className="text-muted-foreground">Risk</div><div className="font-semibold text-warning">+3.2%</div></div>
            <div><div className="text-muted-foreground">Churn</div><div className="font-semibold text-destructive">−0.8%</div></div>
          </div>
        </ChartCard>

        <ChartCard title="Anomaly Heat · Systems × Hour" span={4}>
          <Heatmap rows={8} cols={12} seed={21} color="var(--color-destructive)"/>
        </ChartCard>

        <AIInsights items={[
          { title: "Correlation: SOC bursts ↔ checkout p95", body: "92% temporal correlation in last 7d. Investigate WAF tuning impact.", tone: "warning", confidence: 89 },
          { title: "Causal: marketing spend → activation", body: "+$10k TikTok lifts activation +1.8pp at lag 4d. Suggest doubling cohort.", tone: "success", confidence: 84 },
          { title: "Anomaly: GMV in DE",                   body: "−18% vs forecast band. Possible regional outage upstream.",                tone: "destructive", confidence: 93 },
        ]}/>
      </div>
    </Shell>
  );
}
