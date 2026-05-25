import { useEffect, useMemo, useState } from "react";
import * as Icons from "lucide-react";
import type { DashSpec } from "@/data/dashboards";
import {
  Pill, Donut, Bars, LineSeries, ProgressBar, Heatmap, Timeline,
  StatusDot, WorldMap, Terminal, Spark, DataTable, rng,
} from "./_primitives";
import {
  ChartCard, AIInsights, DashboardToolbar, EmptyState, Modal, TabBar,
  useDashboardState, useTabs,
} from "./_universal";

/* ============================================================
   CATEGORY 01 — CORE COMMAND + AI SYSTEMS (multi-tab)
   ============================================================ */

const grid = "grid grid-cols-12 gap-4";

function Header({ d, right }: { d: DashSpec; right?: React.ReactNode }) {
  const Icon = (Icons as never as Record<string, Icons.LucideIcon>)[d.icon] || Icons.LayoutDashboard;
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 animate-fade-up">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${d.accent === "neon" ? "accent" : d.accent}/30 to-${d.accent === "neon" ? "accent" : d.accent}/5 border border-border grid place-items-center text-${d.accent === "neon" ? "accent" : d.accent}`}>
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

function Kpis({ items }: { items: { label: string; value: string; delta?: string; tone?: "success" | "warning" | "destructive" | "info" }[] }) {
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

function useTicker(base: number, jitter = 0.02, intervalMs = 1500) {
  const [v, setV] = useState(base);
  useEffect(() => {
    const id = setInterval(() => setV((b) => b + (Math.random() - 0.5) * b * jitter), intervalMs);
    return () => clearInterval(id);
  }, [jitter, intervalMs]);
  return v;
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
   1. EXECUTIVE WAR ROOM
   ============================================================ */
type WarTab = "theater" | "briefings" | "decisions" | "intel";

export function WarRoom({ d }: { d: DashSpec }) {
  const { range, setRange, live, setLive } = useDashboardState();
  const { tab, setTab } = useTabs<WarTab>("theater");
  const tracked = useTicker(24801, 0.005);

  const briefings = [
    { id: "BRF-7821", title: "APAC region Tier-1 incident escalation", priority: "P1", region: "APAC-NE", time: "12m ago", tone: "destructive" as const },
    { id: "BRF-7819", title: "Quarterly board prep — Revenue narrative", priority: "P2", region: "Global", time: "42m ago", tone: "warning" as const },
    { id: "BRF-7815", title: "Q3 hiring freeze — risk impact summary", priority: "P3", region: "NA-East", time: "2h ago", tone: "info" as const },
    { id: "BRF-7812", title: "Competitor product launch — defensive plan", priority: "P2", region: "EU-West", time: "4h ago", tone: "warning" as const },
    { id: "BRF-7808", title: "Supply route disruption · Suez", priority: "P2", region: "ME", time: "6h ago", tone: "warning" as const },
    { id: "BRF-7803", title: "M&A target dossier — Helios Labs", priority: "P3", region: "NA-West", time: "1d ago", tone: "info" as const },
  ];
  const decisions = [
    { time: "09:42", title: "Approved infrastructure scale-up · APAC", tone: "success" as const, meta: "CTO + CFO" },
    { time: "10:18", title: "Halted EU-West rollout pending audit", tone: "destructive" as const, meta: "CSO" },
    { time: "11:02", title: "Launched competitor pricing response", tone: "info" as const, meta: "CRO" },
    { time: "12:30", title: "Partner contract — counter-offer signed", tone: "success" as const, meta: "CEO" },
    { time: "14:05", title: "Authorized red-team simulation · finance", tone: "warning" as const, meta: "CISO" },
  ];

  return (
    <PageShell d={d} toolbar={<DashboardToolbar range={range} onRangeChange={setRange} live={live} onLiveToggle={setLive} />}>
      <Kpis items={[
        { label: "Live operations", value: "12", tone: "warning" },
        { label: "Assets tracked", value: tracked.toLocaleString("en", { maximumFractionDigits: 0 }), tone: "info" },
        { label: "Briefings open", value: "42", delta: "+4", tone: "warning" },
        { label: "Decisions / day", value: "148", delta: "+12", tone: "success" },
        { label: "Sentiment", value: "+0.62", tone: "success" },
        { label: "Threat level", value: "ELEVATED", tone: "destructive" },
      ]} />

      <TabBar<WarTab>
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "theater", label: "Theater", icon: "Globe2" },
          { id: "briefings", label: "Briefings", icon: "FileText", badge: briefings.length },
          { id: "decisions", label: "Decisions", icon: "GitCommitHorizontal", badge: decisions.length },
          { id: "intel", label: "Intel", icon: "Radar" },
        ]}
      />

      {tab === "theater" && (
        <div className={grid}>
          <ChartCard title="Live Ops · Global Theater" subtitle="Realtime asset positions and active corridors" span={8}>
            <WorldMap seed={88} />
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              {[
                { k: "Air assets", v: "184", t: "info" as const },
                { k: "Ground", v: "1,284", t: "success" as const },
                { k: "Maritime", v: "42", t: "warning" as const },
                { k: "Cyber", v: "812 nodes", t: "destructive" as const },
              ].map((s) => (
                <div key={s.k} className="rounded-md border border-border bg-muted/30 px-2 py-1.5">
                  <div className="text-muted-foreground">{s.k}</div>
                  <div className={`font-semibold text-${s.t}`}>{s.v}</div>
                </div>
              ))}
            </div>
          </ChartCard>
          <ChartCard title="Asset Roster" span={4}>
            <DataTable
              columns={["Asset", "Type", "Status"]}
              rows={[
                ["NX-Echo-01", "ISR · UAV", <Pill tone="success">Active</Pill>],
                ["Cygnus-44", "Sentinel", <Pill tone="warning">Degraded</Pill>],
                ["Iron-Dawn", "Convoy", <Pill tone="success">Active</Pill>],
                ["Nimbus-7", "Patrol", <Pill tone="info">Standby</Pill>],
                ["Specter-3", "Recon", <Pill tone="success">Active</Pill>],
              ]}
            />
          </ChartCard>
          <ChartCard title="Theater Tempo · last 24h" span={12}>
            <LineSeries seed={51} lines={4} height={180} />
            <div className="mt-2 flex flex-wrap items-center gap-3 text-[10px] text-muted-foreground">
              <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-primary" /> SIGINT</span>
              <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-accent" /> GEOINT</span>
              <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-success" /> OSINT</span>
              <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-warning" /> HUMINT</span>
            </div>
          </ChartCard>
        </div>
      )}

      {tab === "briefings" && (
        <div className={grid}>
          <ChartCard title="Active Briefings · all priorities" span={8}>
            <DataTable
              columns={["ID", "Priority", "Title", "Region", "Updated"]}
              rows={briefings.map((b) => [
                <span className="font-mono">{b.id}</span>,
                <Pill tone={b.tone}>{b.priority}</Pill>,
                b.title, b.region, b.time,
              ])}
            />
          </ChartCard>
          <ChartCard title="Priority Mix" span={4}>
            <div className="grid place-items-center"><Donut value={68} label="P1+P2 share" color="var(--color-destructive)" /></div>
            <ul className="mt-3 space-y-1.5 text-xs">
              {[["P1", 8, "destructive"], ["P2", 21, "warning"], ["P3", 13, "info"]].map(([k, v, t]) => (
                <li key={k as string} className="flex items-center justify-between border-b border-border pb-1">
                  <span className="inline-flex items-center gap-2"><StatusDot tone={t as never} /> {k}</span>
                  <span className="tabular-nums">{v}</span>
                </li>
              ))}
            </ul>
          </ChartCard>
        </div>
      )}

      {tab === "decisions" && (
        <div className={grid}>
          <ChartCard title="Decision Log" span={6}>
            <Timeline items={decisions} />
          </ChartCard>
          <ChartCard title="Decisions by Executive · 30d" span={6}>
            <Bars seed={71} n={20} color="var(--color-primary)" height={180} />
            <div className="mt-3 grid grid-cols-3 text-center text-[11px]">
              {[["CEO", 42], ["CTO", 38], ["CRO", 29]].map(([k, v]) => (
                <div key={k as string}><div className="text-muted-foreground">{k}</div><div className="font-semibold tabular-nums">{v}</div></div>
              ))}
            </div>
          </ChartCard>
        </div>
      )}

      {tab === "intel" && (
        <div className={grid}>
          <ChartCard title="Signal Intelligence · 24h" span={8}>
            <LineSeries seed={51} lines={4} height={180} />
          </ChartCard>
          <ChartCard title="Source Mix" span={4}>
            <ul className="space-y-2 text-xs">
              {[["SIGINT", 38], ["GEOINT", 24], ["OSINT", 22], ["HUMINT", 16]].map(([k, v]) => (
                <li key={k as string}>
                  <div className="flex justify-between mb-1"><span>{k}</span><span className="text-muted-foreground">{v}%</span></div>
                  <ProgressBar value={v as number} />
                </li>
              ))}
            </ul>
          </ChartCard>
          <div className="col-span-12">
            <AIInsights items={[
              { title: "APAC spike correlated to maintenance window", body: "75% probability the alert cluster is benign. Recommend deferring escalation 30 minutes.", tone: "info", confidence: 88 },
              { title: "EU-West rollout risk elevated", body: "Pre-launch metrics underperform v0.42 baseline by 18% — consider a phased gate.", tone: "warning", confidence: 81 },
              { title: "Competitor pricing pressure imminent", body: "Filing data and ad spend point to a launch within 14 days. Prepare counter-narrative.", tone: "destructive", confidence: 73 },
            ]} />
          </div>
        </div>
      )}
    </PageShell>
  );
}

/* ============================================================
   2. UNIVERSAL MASTER CONTROL CORE
   ============================================================ */
type MCTab = "core" | "subsystems" | "failsafes" | "telemetry";

export function MasterControl({ d }: { d: DashSpec }) {
  const { range, setRange, live, setLive } = useDashboardState("1h");
  const { tab, setTab } = useTabs<MCTab>("core");
  const [override, setOverride] = useState(false);
  const subs = useMemo(() => {
    const r = rng(7);
    return Array.from({ length: 75 }).map((_, i) => {
      const v = r();
      const tone = v > 0.95 ? "destructive" : v > 0.85 ? "warning" : "success";
      return { id: i + 1, name: `SYS-${(100 + i).toString(16).toUpperCase()}`, tone, load: 20 + Math.round(v * 70) };
    });
  }, []);

  return (
    <PageShell d={d} toolbar={
      <div className="flex items-center gap-2">
        <DashboardToolbar range={range} onRangeChange={setRange} live={live} onLiveToggle={setLive} />
        <button onClick={() => setOverride(true)} className="px-3 py-1.5 rounded-md text-xs font-medium border border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/20 inline-flex items-center gap-1.5">
          <Icons.AlertOctagon className="w-3.5 h-3.5" /> Manual Override
        </button>
      </div>
    }>
      <Kpis items={[
        { label: "Subsystems", value: "75", tone: "info" },
        { label: "Health", value: "99.99%", delta: "+0.01", tone: "success" },
        { label: "AI tasks/s", value: "4,812", tone: "success" },
        { label: "Autonomy level", value: "L4", tone: "info" },
        { label: "Failsafes armed", value: "12 / 12", tone: "success" },
        { label: "Intervention queue", value: "3", tone: "warning" },
      ]} />

      <TabBar<MCTab>
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "core", label: "Core", icon: "Cpu" },
          { id: "subsystems", label: "Subsystems", icon: "Grid3x3", badge: subs.length },
          { id: "failsafes", label: "Failsafes", icon: "ShieldCheck", badge: 12 },
          { id: "telemetry", label: "Telemetry", icon: "Activity" },
        ]}
      />

      {tab === "core" && (
        <div className={grid}>
          <ChartCard title="Core Reactor" span={4}>
            <div className="grid place-items-center"><Donut value={99} label="autonomy" color="var(--color-accent)" /></div>
            <div className="mt-3 space-y-2 text-[11px]">
              {[
                { k: "Power draw", v: "4.2 kW", t: "success" },
                { k: "Coolant temp", v: "42°C", t: "success" },
                { k: "Quantum coherence", v: "0.98", t: "success" },
                { k: "Plasma flux", v: "stable", t: "info" },
              ].map((r) => (
                <div key={r.k} className="flex items-center justify-between border-b border-border pb-1">
                  <span className="text-muted-foreground">{r.k}</span>
                  <span className={`text-${r.t}`}>{r.v}</span>
                </div>
              ))}
            </div>
          </ChartCard>
          <ChartCard title="AI Brain · neural load" span={8}>
            <LineSeries seed={101} lines={3} height={200} />
          </ChartCard>
          <div className="col-span-12">
            <AIInsights items={[
              { title: "Anomaly: subsystem SYS-3F drifting", body: "Predictive model expects a degradation event in ~22 minutes. Pre-warm SYS-40 standby.", tone: "warning", confidence: 91 },
              { title: "Optimization opportunity in coolant loop", body: "Switching to schedule-B cuts power draw 8% with no SLA risk.", tone: "info", confidence: 84 },
              { title: "All failsafes armed and verified", body: "Last full-system drill passed at T-04:12. Next required by T+72:00.", tone: "success", confidence: 99 },
            ]} />
          </div>
        </div>
      )}

      {tab === "subsystems" && (
        <div className={grid}>
          <ChartCard title="Subsystem Grid · all 75 modules" span={8}>
            <div className="grid gap-1.5" style={{ gridTemplateColumns: "repeat(15, minmax(0, 1fr))" }}>
              {subs.map((s) => (
                <button key={s.id} title={`${s.name} · ${s.load}%`}
                  className={`aspect-square rounded-sm transition-transform hover:scale-110 hover:z-10 ${
                    s.tone === "destructive" ? "bg-destructive" : s.tone === "warning" ? "bg-warning" : "bg-success/80"
                  }`}
                />
              ))}
            </div>
            <div className="mt-3 flex items-center gap-3 text-[10px] text-muted-foreground">
              <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-success" /> Nominal</span>
              <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-warning" /> Degraded</span>
              <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-destructive" /> Critical</span>
            </div>
          </ChartCard>
          <ChartCard title="Top loaded" span={4}>
            <DataTable
              columns={["Sys", "Load", "State"]}
              rows={subs.slice().sort((a, b) => b.load - a.load).slice(0, 8).map((s) => [
                <span className="font-mono">{s.name}</span>,
                `${s.load}%`,
                <Pill tone={s.tone as never}>{s.tone === "destructive" ? "Crit" : s.tone === "warning" ? "Warn" : "OK"}</Pill>,
              ])}
            />
          </ChartCard>
        </div>
      )}

      {tab === "failsafes" && (
        <div className={grid}>
          <ChartCard title="Failsafe Matrix" span={7}>
            <ul className="space-y-2 text-xs">
              {["Power isolation", "Network kill-switch", "Data quarantine", "Geo failover", "Backup restore", "Manual lockout", "Crypto rotation", "Plasma vent"].map((f, i) => (
                <li key={f} className="flex items-center justify-between border-b border-border pb-2">
                  <span className="inline-flex items-center gap-2"><StatusDot tone="success" /> {f}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground">drill {i + 1}h ago</span>
                    <Pill tone={i === 5 ? "warning" : "success"}>{i === 5 ? "Standby" : "Armed"}</Pill>
                  </div>
                </li>
              ))}
            </ul>
          </ChartCard>
          <ChartCard title="Drill Calendar" span={5}>
            <Heatmap rows={6} cols={20} seed={14} color="var(--color-success)" />
            <div className="mt-3 text-[11px] text-muted-foreground">Next mandatory drill in 72h.</div>
          </ChartCard>
        </div>
      )}

      {tab === "telemetry" && (
        <div className={grid}>
          <ChartCard title="Telemetry Stream" span={12}>
            <LineSeries seed={211} lines={4} height={220} />
          </ChartCard>
          <ChartCard title="Pulse · 24h" span={12}>
            <Heatmap rows={8} cols={24} seed={91} color="var(--color-info)" />
          </ChartCard>
        </div>
      )}

      <Modal open={override} onClose={() => setOverride(false)} title="Manual Override · authentication required"
        footer={<>
          <button onClick={() => setOverride(false)} className="px-3 py-1.5 text-xs rounded-md border border-border hover:bg-muted">Cancel</button>
          <button onClick={() => setOverride(false)} className="px-3 py-1.5 text-xs rounded-md bg-destructive text-destructive-foreground">Confirm override</button>
        </>}
      >
        <p className="text-sm text-muted-foreground">Manual override transfers all 75 subsystems to operator control. Autonomous safeties remain armed.</p>
        <input className="mt-4 w-full bg-muted text-sm rounded-md px-3 py-2 border border-border outline-none focus:border-primary" placeholder="Operator key" />
      </Modal>
    </PageShell>
  );
}

/* ============================================================
   3. AI COPILOT & ENTERPRISE BRAIN
   ============================================================ */
type AITab = "studio" | "agents" | "tools" | "evals";

export function AICopilot({ d }: { d: DashSpec }) {
  const { range, setRange, live, setLive } = useDashboardState();
  const { tab, setTab } = useTabs<AITab>("studio");
  const [prompt, setPrompt] = useState("");

  return (
    <PageShell d={d} toolbar={<DashboardToolbar range={range} onRangeChange={setRange} live={live} onLiveToggle={setLive} />}>
      <Kpis items={[
        { label: "Active agents", value: "248", tone: "info" },
        { label: "Tokens / day", value: "1.2B", tone: "success" },
        { label: "Tools registered", value: "412", tone: "info" },
        { label: "Eval pass rate", value: "96.2%", delta: "+0.4", tone: "success" },
        { label: "Guardrail blocks", value: "184", tone: "warning" },
        { label: "Avg latency", value: "812ms", delta: "-42ms", tone: "success" },
      ]} />

      <TabBar<AITab>
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "studio", label: "Studio", icon: "Sparkles" },
          { id: "agents", label: "Agents", icon: "Bot", badge: 248 },
          { id: "tools", label: "Tools", icon: "Wrench", badge: 412 },
          { id: "evals", label: "Evals", icon: "CheckCircle2" },
        ]}
      />

      {tab === "studio" && (
        <div className={grid}>
          <ChartCard title="Studio · live agent stream" span={12}>
            <div className="flex items-center gap-2 mb-3">
              <input
                value={prompt} onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask the brain anything…"
                className="flex-1 bg-muted text-sm rounded-md px-3 py-2 border border-border outline-none focus:border-primary"
              />
              <button className="px-3 py-2 rounded-md bg-primary text-primary-foreground text-xs inline-flex items-center gap-1.5">
                <Icons.Send className="w-3.5 h-3.5" /> Run
              </button>
            </div>
            <Terminal lines={[
              { t: "agent=triage step=plan tools=[search,jira,sql] ms=412", tone: "info" },
              { t: "agent=triage step=tool tool=jira.search query=\"sev1 last 7d\" results=12", tone: "muted" },
              { t: "agent=triage step=tool tool=sql.run rows=148 ms=212", tone: "muted" },
              { t: "guardrail=pii action=redact field=email count=3", tone: "warning" },
              { t: "agent=summarize tokens_in=4128 tokens_out=812 model=brain-v4", tone: "info" },
              { t: "eval=helpful score=0.94 grounded=0.92 pass=true", tone: "success" },
              { t: "agent=triage step=respond status=200 ms=1284", tone: "success" },
            ]} />
          </ChartCard>
        </div>
      )}

      {tab === "agents" && (
        <div className={grid}>
          <ChartCard title="Agent roster" span={8}>
            <DataTable
              columns={["Agent", "Model", "Calls/d", "Pass", "Owner"]}
              rows={[
                ["triage", "brain-v4", "48,128", "96%", "platform"],
                ["summarize", "brain-v4-mini", "112,402", "98%", "docs"],
                ["sql-copilot", "brain-coder", "12,201", "92%", "data"],
                ["rev-research", "brain-v4", "8,184", "89%", "rev"],
                ["legal-review", "brain-v4", "1,128", "94%", "legal"],
                ["onboarding-bot", "brain-v4-mini", "21,402", "97%", "cx"],
              ]}
            />
          </ChartCard>
          <ChartCard title="Agent activity" span={4}>
            <Bars seed={71} n={20} color="var(--color-accent)" height={180} />
          </ChartCard>
        </div>
      )}

      {tab === "tools" && (
        <div className={grid}>
          <ChartCard title="Tool registry" span={8}>
            <DataTable
              columns={["Tool", "Calls/d", "p95", "Owner", "Status"]}
              rows={[
                ["jira.search", "48,128", "82ms", "platform", <Pill tone="success">healthy</Pill>],
                ["snowflake.query", "12,402", "412ms", "data", <Pill tone="warning">slow</Pill>],
                ["github.pr", "8,201", "118ms", "eng", <Pill tone="success">healthy</Pill>],
                ["slack.post", "42,184", "42ms", "platform", <Pill tone="success">healthy</Pill>],
                ["salesforce.lead", "4,128", "284ms", "rev", <Pill tone="info">stable</Pill>],
                ["pdf.extract", "812", "1.2s", "docs", <Pill tone="warning">slow</Pill>],
              ]}
            />
          </ChartCard>
          <ChartCard title="Token spend · 7d" span={4}>
            <Bars seed={42} n={28} color="var(--color-accent)" height={180} />
            <div className="mt-2 grid grid-cols-3 text-center text-[11px]">
              <div><div className="text-muted-foreground">Input</div><div className="text-foreground font-semibold">812M</div></div>
              <div><div className="text-muted-foreground">Output</div><div className="text-foreground font-semibold">412M</div></div>
              <div><div className="text-muted-foreground">Cost</div><div className="text-success font-semibold">$1,284</div></div>
            </div>
          </ChartCard>
        </div>
      )}

      {tab === "evals" && (
        <div className={grid}>
          <ChartCard title="Eval Scoreboard" span={4}>
            <div className="grid place-items-center"><Donut value={96} label="passing" color="var(--color-accent)" /></div>
            <div className="mt-3 space-y-2 text-[11px]">
              {[
                { k: "Helpfulness", v: 94 }, { k: "Groundedness", v: 92 },
                { k: "Safety", v: 99 }, { k: "Latency SLO", v: 88 },
              ].map((r) => (
                <div key={r.k}>
                  <div className="flex justify-between"><span className="text-muted-foreground">{r.k}</span><span>{r.v}%</span></div>
                  <ProgressBar value={r.v} color={r.v > 90 ? "var(--color-success)" : "var(--color-warning)"} />
                </div>
              ))}
            </div>
          </ChartCard>
          <ChartCard title="Ontology coverage" span={8}>
            <Heatmap rows={6} cols={24} seed={9} color="var(--color-accent)" />
          </ChartCard>
          <div className="col-span-12">
            <AIInsights items={[
              { title: "Agent `triage` accuracy regressed 3.1%", body: "Suspect change: tool `jira.search` truncating results. Roll back tool v2.4 → v2.3.", tone: "warning", confidence: 86 },
              { title: "RAG retrieval gap detected", body: "12% of queries return zero docs. Re-index `policies` corpus.", tone: "info", confidence: 79 },
              { title: "Guardrail efficiency improved", body: "PII redaction false-positive rate down to 0.3% after the v4 update.", tone: "success", confidence: 95 },
            ]} />
          </div>
        </div>
      )}
    </PageShell>
  );
}

/* ============================================================
   4. ENTERPRISE OS CONTROL CENTER
   ============================================================ */
type OSTab = "overview" | "services" | "processes" | "kernel";

export function OSControl({ d }: { d: DashSpec }) {
  const { range, setRange, live, setLive } = useDashboardState("1h");
  const { tab, setTab } = useTabs<OSTab>("overview");
  const cpu = useTicker(68, 0.04);
  const mem = useTicker(72, 0.02);

  return (
    <PageShell d={d} toolbar={<DashboardToolbar range={range} onRangeChange={setRange} live={live} onLiveToggle={setLive} />}>
      <Kpis items={[
        { label: "Processes", value: "12,482", tone: "info" },
        { label: "CPU avg", value: cpu.toFixed(1) + "%", tone: cpu > 80 ? "destructive" : "warning" },
        { label: "Memory", value: mem.toFixed(1) + "%", tone: "warning" },
        { label: "Disk I/O", value: "2.4 GB/s", tone: "success" },
        { label: "Net throughput", value: "184 Gbps", tone: "info" },
        { label: "Open sockets", value: "48,201", tone: "info" },
      ]} />

      <TabBar<OSTab>
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "overview", label: "Overview", icon: "Gauge" },
          { id: "services", label: "Services", icon: "Server" },
          { id: "processes", label: "Processes", icon: "Cpu" },
          { id: "kernel", label: "Kernel", icon: "TerminalSquare" },
        ]}
      />

      {tab === "overview" && (
        <div className={grid}>
          <ChartCard title="Resource gauges" span={6}>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid place-items-center"><Donut value={Math.round(cpu)} label="CPU" /></div>
              <div className="grid place-items-center"><Donut value={Math.round(mem)} label="MEM" color="var(--color-warning)" /></div>
              <div className="grid place-items-center"><Donut value={42} label="DISK" color="var(--color-success)" /></div>
              <div className="grid place-items-center"><Donut value={68} label="NET" color="var(--color-info)" /></div>
            </div>
          </ChartCard>
          <ChartCard title="Service grid · 24h status" span={6}>
            <Heatmap rows={8} cols={24} seed={4} color="var(--color-success)" />
          </ChartCard>
        </div>
      )}

      {tab === "services" && (
        <div className={grid}>
          <ChartCard title="Service tree" span={12}>
            <ul className="text-xs font-mono space-y-1">
              {[
                { d: 0, n: "init", s: "running", t: "success" as const },
                { d: 1, n: "systemd", s: "running", t: "success" as const },
                { d: 2, n: "nexus.api", s: "running · 248 conns", t: "success" as const },
                { d: 2, n: "nexus.worker", s: "running · 12 jobs", t: "success" as const },
                { d: 2, n: "nexus.cron", s: "idle · next 2m", t: "info" as const },
                { d: 1, n: "kubelet", s: "running", t: "success" as const },
                { d: 2, n: "containerd", s: "running · 412 ctrs", t: "success" as const },
                { d: 1, n: "auditd", s: "degraded · queue 84", t: "warning" as const },
                { d: 1, n: "telemetry-agent", s: "running", t: "success" as const },
              ].map((p, i) => (
                <li key={i} className="flex items-center gap-2" style={{ paddingLeft: `${p.d * 14}px` }}>
                  <Icons.ChevronRight className="w-3 h-3 opacity-50" />
                  <span className="text-foreground">{p.n}</span>
                  <span className="ml-auto text-muted-foreground text-[10px]">{p.s}</span>
                  <StatusDot tone={p.t} />
                </li>
              ))}
            </ul>
          </ChartCard>
        </div>
      )}

      {tab === "processes" && (
        <div className={grid}>
          <ChartCard title="Top processes by CPU" span={12}>
            <DataTable
              columns={["PID", "Command", "User", "CPU%", "MEM%", "State"]}
              rows={["nexus.api", "kubelet", "postgres", "redis", "envoy", "promtail", "vector", "node", "java"].map((p, i) => [
                <span className="font-mono">{4128 + i}</span>,
                <span className="font-mono">{p}</span>,
                i % 3 === 0 ? "root" : "app",
                `${(20 - i * 2).toFixed(1)}%`,
                `${(28 - i * 2).toFixed(1)}%`,
                <Pill tone={i === 8 ? "warning" : "success"}>{i === 8 ? "D" : "R"}</Pill>,
              ])}
            />
          </ChartCard>
        </div>
      )}

      {tab === "kernel" && (
        <div className={grid}>
          <ChartCard title="Kernel events" span={8}>
            <Terminal lines={[
              { t: "kernel: TCP retransmit on eth0 (rate: 0.04%)", tone: "muted" },
              { t: "audit: setrlimit user=app pid=4128", tone: "info" },
              { t: "oom-killer: invoked, score=812 victim=java/2841", tone: "destructive" },
              { t: "systemd[1]: nexus.worker.service: started", tone: "success" },
              { t: "iptables: dropped 248 pkts from 10.4.2.18", tone: "warning" },
              { t: "kernel: cgroup memory limit reached: 4Gi", tone: "warning" },
            ]} />
          </ChartCard>
          <ChartCard title="Syscall rate" span={4}>
            <LineSeries seed={181} lines={2} height={200} />
          </ChartCard>
          <div className="col-span-12">
            <AIInsights items={[
              { title: "Memory pressure trending up", body: "Linear extrapolation hits 90% in 38 minutes. Consider scaling worker pool.", tone: "warning", confidence: 82 },
              { title: "auditd queue backlog", body: "Forwarder appears stuck — restart of telemetry-agent typically clears.", tone: "info", confidence: 76 },
              { title: "OOM killer event captured", body: "JVM heap exceeded cgroup limit. Bump container memory request to 4Gi.", tone: "destructive", confidence: 94 },
            ]} />
          </div>
        </div>
      )}
    </PageShell>
  );
}

/* ============================================================
   5. UNIVERSAL SEARCH & COMMAND PALETTE
   ============================================================ */
type SPTab = "palette" | "extensions" | "hotkeys" | "analytics";

export function SearchPalette({ d }: { d: DashSpec }) {
  const { range, setRange, live, setLive, filter, setFilter } = useDashboardState();
  const { tab, setTab } = useTabs<SPTab>("palette");
  const commands = useMemo(() => [
    { i: "Search", n: "Search files…", k: "⌘ F" },
    { i: "Send", n: "Send Slack message", k: "⌘ S" },
    { i: "PlusCircle", n: "Create Jira ticket", k: "⌘ J" },
    { i: "GitBranch", n: "Open recent PR", k: "⌘ P" },
    { i: "Database", n: "Run SQL snippet", k: "⌘ Q" },
    { i: "Calendar", n: "Schedule meeting", k: "⌘ K" },
    { i: "Sparkles", n: "Ask AI…", k: "⌘ A" },
    { i: "Settings", n: "Open settings", k: "⌘ ," },
  ], []);
  const filtered = commands.filter((c) => !filter || c.n.toLowerCase().includes(filter.toLowerCase()));

  return (
    <PageShell d={d} toolbar={<DashboardToolbar range={range} onRangeChange={setRange} live={live} onLiveToggle={setLive} />}>
      <Kpis items={[
        { label: "Queries / day", value: "482k", tone: "success" },
        { label: "Extensions", value: "812", tone: "info" },
        { label: "AI hits", value: "148k", tone: "info" },
        { label: "Quicklinks", value: "4,128", tone: "info" },
        { label: "Avg latency", value: "42ms", tone: "success" },
        { label: "Hit rate", value: "94%", tone: "success" },
      ]} />

      <TabBar<SPTab>
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "palette", label: "Palette", icon: "Search" },
          { id: "extensions", label: "Extensions", icon: "Puzzle", badge: 812 },
          { id: "hotkeys", label: "Hotkeys", icon: "Keyboard" },
          { id: "analytics", label: "Analytics", icon: "BarChart3" },
        ]}
      />

      {tab === "palette" && (
        <div className={grid}>
          <ChartCard title="Command palette · live" span={12}>
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <div className="flex items-center gap-2 px-3 h-12 border-b border-border">
                <Icons.Search className="w-4 h-4 text-muted-foreground" />
                <input
                  value={filter} onChange={(e) => setFilter(e.target.value)}
                  placeholder="Type a command, search files, or ask AI…"
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                <kbd className="text-[10px] px-1.5 py-0.5 rounded border border-border text-muted-foreground">esc</kbd>
              </div>
              <ul className="max-h-80 overflow-y-auto">
                {filtered.length === 0 ? (
                  <EmptyState icon="SearchX" title={`No commands match “${filter}”`} hint="Try “open”, “send”, or “create”." />
                ) : filtered.map((c, i) => {
                  const Icon = (Icons as never as Record<string, Icons.LucideIcon>)[c.i] || Icons.Square;
                  return (
                    <li key={c.n} className={`flex items-center gap-3 px-3 py-2.5 text-sm cursor-pointer ${i === 0 ? "bg-primary/15" : "hover:bg-muted/40"}`}>
                      <div className="w-7 h-7 rounded-md bg-muted grid place-items-center"><Icon className="w-3.5 h-3.5" /></div>
                      <span className="flex-1">{c.n}</span>
                      <kbd className="text-[10px] px-1.5 py-0.5 rounded border border-border text-muted-foreground">{c.k}</kbd>
                    </li>
                  );
                })}
              </ul>
            </div>
          </ChartCard>
        </div>
      )}

      {tab === "extensions" && (
        <div className={grid}>
          <ChartCard title="Top extensions" span={12}>
            <DataTable
              columns={["Extension", "Author", "Installs", "Rating", "Updated"]}
              rows={[
                ["Snippets+", "raycast", "184k", "★ 4.9", "2d ago"],
                ["GitHub Pulse", "octo", "148k", "★ 4.8", "5d ago"],
                ["Linear Quick", "linear", "112k", "★ 4.8", "1w ago"],
                ["Notion Search", "notion", "98k", "★ 4.7", "3d ago"],
                ["Brew Manager", "homebrew", "82k", "★ 4.6", "2w ago"],
                ["1Password Vault", "1password", "74k", "★ 4.9", "1d ago"],
              ]}
            />
          </ChartCard>
        </div>
      )}

      {tab === "hotkeys" && (
        <div className={grid}>
          <ChartCard title="Hotkeys leaderboard" span={6}>
            <ul className="space-y-1.5 text-xs">
              {["⌘ K", "⌘ F", "⌘ J", "⌘ P", "⌘ A", "⌘ S", "⌘ ,", "⌘ Q"].map((k, i) => (
                <li key={k} className="flex items-center justify-between border-b border-border pb-1.5">
                  <kbd className="font-mono px-1.5 py-0.5 rounded border border-border bg-muted">{k}</kbd>
                  <span className="text-muted-foreground">{(48 - i * 5).toLocaleString()}k uses</span>
                </li>
              ))}
            </ul>
          </ChartCard>
          <ChartCard title="Adoption · 30d" span={6}>
            <Bars seed={88} n={30} color="var(--color-primary)" height={200} />
          </ChartCard>
        </div>
      )}

      {tab === "analytics" && (
        <div className={grid}>
          <ChartCard title="Query volume · 24h" span={12}>
            <LineSeries seed={61} lines={3} height={200} />
          </ChartCard>
          <div className="col-span-12">
            <AIInsights items={[
              { title: "Most-searched untyped command: `release notes`", body: "Consider promoting it as a built-in command — saves ~12k clicks/week.", tone: "info", confidence: 88 },
              { title: "Latency outlier on AI hits", body: "p99 jumped to 1.4s last hour — likely cold model containers.", tone: "warning", confidence: 79 },
            ]} />
          </div>
        </div>
      )}
    </PageShell>
  );
}

/* ============================================================
   6. DIGITAL TWIN & SYSTEM MAPPING
   ============================================================ */
type DTTab = "graph" | "simulations" | "pipelines" | "drift";

export function DigitalTwin({ d }: { d: DashSpec }) {
  const { range, setRange, live, setLive } = useDashboardState();
  const { tab, setTab } = useTabs<DTTab>("graph");
  const r = rng(31);
  const nodes = useMemo(() => Array.from({ length: 28 }).map((_, i) => ({
    id: i, x: 8 + r() * 84, y: 10 + r() * 70, t: r() > 0.7 ? "accent" : r() > 0.4 ? "primary" : "info",
  })), []);
  const edges = useMemo(() => Array.from({ length: 32 }).map(() => ({
    a: Math.floor(r() * 28), b: Math.floor(r() * 28),
  })), []);

  return (
    <PageShell d={d} toolbar={<DashboardToolbar range={range} onRangeChange={setRange} live={live} onLiveToggle={setLive} />}>
      <Kpis items={[
        { label: "Objects", value: "4.2M", tone: "info" },
        { label: "Links", value: "148M", tone: "info" },
        { label: "Pipelines", value: "812", tone: "success" },
        { label: "Simulations / day", value: "248", tone: "success" },
        { label: "Workshops", value: "42", tone: "info" },
        { label: "Drift signals", value: "7", tone: "warning" },
      ]} />

      <TabBar<DTTab>
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "graph", label: "Graph", icon: "Network" },
          { id: "simulations", label: "Simulations", icon: "FlaskConical", badge: 5 },
          { id: "pipelines", label: "Pipelines", icon: "Workflow", badge: 812 },
          { id: "drift", label: "Drift", icon: "AlertTriangle", badge: 7 },
        ]}
      />

      {tab === "graph" && (
        <div className={grid}>
          <ChartCard title="Ontology graph" subtitle="Live entities and relationships" span={8}>
            <div className="relative w-full h-72 rounded-md grid-bg border border-border overflow-hidden">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 80" preserveAspectRatio="none">
                {edges.map((e, i) => {
                  const a = nodes[e.a], b = nodes[e.b];
                  if (!a || !b) return null;
                  return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="var(--color-border)" strokeWidth="0.15" />;
                })}
              </svg>
              {nodes.map((n) => (
                <div key={n.id}
                  className={`absolute rounded-full bg-${n.t} shadow-[0_0_10px_var(--color-accent)] hover:scale-150 transition-transform cursor-pointer`}
                  style={{ left: `${n.x}%`, top: `${n.y}%`, width: 10, height: 10, transform: "translate(-50%,-50%)" }}
                  title={`Object #${n.id}`}
                />
              ))}
            </div>
          </ChartCard>
          <ChartCard title="Object class distribution" span={4}>
            <Bars seed={9} n={14} color="var(--color-accent)" height={200} />
          </ChartCard>
        </div>
      )}

      {tab === "simulations" && (
        <div className={grid}>
          <ChartCard title="Active simulations" span={12}>
            <ul className="space-y-2.5 text-xs">
              {[
                { n: "Supply chain · monsoon", p: 78, t: "warning" as const },
                { n: "Energy grid · peak Q3", p: 92, t: "success" as const },
                { n: "Fleet rerouting · LA→SFO", p: 41, t: "info" as const },
                { n: "Workforce · holiday surge", p: 64, t: "info" as const },
                { n: "Cyber red-team replay", p: 18, t: "destructive" as const },
              ].map((s) => (
                <li key={s.n}>
                  <div className="flex justify-between mb-1">
                    <span>{s.n}</span>
                    <span className="text-muted-foreground">{s.p}%</span>
                  </div>
                  <ProgressBar value={s.p} color={`var(--color-${s.t === "destructive" ? "destructive" : s.t === "warning" ? "warning" : s.t === "success" ? "success" : "info"})`} />
                </li>
              ))}
            </ul>
          </ChartCard>
        </div>
      )}

      {tab === "pipelines" && (
        <div className={grid}>
          <ChartCard title="Pipeline runs" span={12}>
            <DataTable
              columns={["Pipeline", "Trigger", "Duration", "Records", "Status"]}
              rows={[
                ["ontology.refresh", "schedule · 5m", "42s", "148k", <Pill tone="success">ok</Pill>],
                ["twin.sync.assets", "stream", "12s", "4.2M", <Pill tone="success">ok</Pill>],
                ["sim.energy.daily", "manual", "4m 12s", "812", <Pill tone="warning">slow</Pill>],
                ["foundry.export", "schedule · 1h", "1m 8s", "48k", <Pill tone="success">ok</Pill>],
                ["aip.embeddings", "stream", "—", "drift", <Pill tone="destructive">failed</Pill>],
              ]}
            />
          </ChartCard>
        </div>
      )}

      {tab === "drift" && (
        <div className={grid}>
          <ChartCard title="Drift heatmap · classes × time" span={8}>
            <Heatmap rows={6} cols={24} seed={37} color="var(--color-warning)" />
          </ChartCard>
          <ChartCard title="Top drifting fields" span={4}>
            <DataTable
              columns={["Field", "δ"]}
              rows={[
                ["Asset.location", "23.4"],
                ["Order.total", "12.1"],
                ["User.tier", "8.7"],
                ["Product.sku", "5.2"],
              ]}
            />
          </ChartCard>
          <div className="col-span-12">
            <AIInsights items={[
              { title: "Twin drift detected on `Asset` class", body: "23 fields out of sync with system of record. Trigger reconciliation pipeline.", tone: "warning", confidence: 87 },
              { title: "Sim outcome variance increasing", body: "Energy grid sim shows 14% wider error bars vs last week — model retrain advised.", tone: "info", confidence: 81 },
            ]} />
          </div>
        </div>
      )}
    </PageShell>
  );
}

/* ============================================================
   7. ENTERPRISE KNOWLEDGE GRAPH
   ============================================================ */
type KGTab = "console" | "schema" | "algorithms" | "performance";

export function KnowledgeGraph({ d }: { d: DashSpec }) {
  const { range, setRange, live, setLive } = useDashboardState();
  const { tab, setTab } = useTabs<KGTab>("console");
  const [cypher, setCypher] = useState("MATCH (u:User)-[:OWNS]->(p:Project) RETURN u, p LIMIT 25");

  return (
    <PageShell d={d} toolbar={<DashboardToolbar range={range} onRangeChange={setRange} live={live} onLiveToggle={setLive} />}>
      <Kpis items={[
        { label: "Nodes", value: "148M", tone: "info" },
        { label: "Edges", value: "1.2B", tone: "info" },
        { label: "Queries / s", value: "42k", tone: "success" },
        { label: "Models", value: "148", tone: "info" },
        { label: "Indexes", value: "412", tone: "success" },
        { label: "p95 latency", value: "82ms", delta: "-4ms", tone: "success" },
      ]} />

      <TabBar<KGTab>
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "console", label: "Console", icon: "TerminalSquare" },
          { id: "schema", label: "Schema", icon: "Network" },
          { id: "algorithms", label: "Algorithms", icon: "Sigma", badge: 5 },
          { id: "performance", label: "Performance", icon: "Gauge" },
        ]}
      />

      {tab === "console" && (
        <div className={grid}>
          <ChartCard title="Cypher console" span={7}>
            <textarea
              value={cypher} onChange={(e) => setCypher(e.target.value)} spellCheck={false}
              className="w-full h-28 bg-black/50 border border-border rounded-md p-3 font-mono text-xs outline-none focus:border-primary text-accent"
            />
            <div className="mt-2 flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs inline-flex items-center gap-1.5">
                <Icons.Play className="w-3 h-3" /> Run
              </button>
              <button className="px-3 py-1.5 rounded-md border border-border text-xs inline-flex items-center gap-1.5">
                <Icons.Save className="w-3 h-3" /> Save
              </button>
              <span className="ml-auto text-[11px] text-muted-foreground">execution plan: index-scan · 25 rows · 38ms</span>
            </div>
          </ChartCard>
          <ChartCard title="Bloom view · result set" span={5}>
            <div className="relative w-full h-48 rounded-md grid-bg border border-border overflow-hidden">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 80">
                {Array.from({ length: 24 }).map((_, i) => {
                  const a = (i * 137.5) * (Math.PI / 180);
                  const rd = 8 + (i % 6) * 5;
                  const x = 50 + Math.cos(a) * rd;
                  const y = 40 + Math.sin(a) * rd * 0.8;
                  return <line key={i} x1="50" y1="40" x2={x} y2={y} stroke="var(--color-border)" strokeWidth="0.2" />;
                })}
                <circle cx="50" cy="40" r="3" fill="var(--color-accent)" />
                {Array.from({ length: 24 }).map((_, i) => {
                  const a = (i * 137.5) * (Math.PI / 180);
                  const rd = 8 + (i % 6) * 5;
                  const x = 50 + Math.cos(a) * rd;
                  const y = 40 + Math.sin(a) * rd * 0.8;
                  const c = i % 3 === 0 ? "var(--color-primary)" : i % 3 === 1 ? "var(--color-info)" : "var(--color-success)";
                  return <circle key={`n${i}`} cx={x} cy={y} r="1.6" fill={c} />;
                })}
              </svg>
            </div>
          </ChartCard>
        </div>
      )}

      {tab === "schema" && (
        <div className={grid}>
          <ChartCard title="Node types" span={6}>
            <ul className="space-y-2 text-xs">
              {[
                { n: ":User", c: 4128_000, color: "var(--color-primary)" },
                { n: ":Project", c: 812_000, color: "var(--color-accent)" },
                { n: ":Document", c: 2_400_000, color: "var(--color-info)" },
                { n: ":Event", c: 18_201_000, color: "var(--color-success)" },
                { n: ":Asset", c: 248_000, color: "var(--color-warning)" },
              ].map((t) => (
                <li key={t.n} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: t.color }} />
                  <span className="font-mono">{t.n}</span>
                  <span className="ml-auto text-muted-foreground tabular-nums">{t.c.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </ChartCard>
          <ChartCard title="Relationship types" span={6}>
            <DataTable
              columns={["Type", "Count", "Avg degree"]}
              rows={[
                [":OWNS", "812k", "1.4"],
                [":REPORTS_TO", "148k", "1.0"],
                [":TAGGED", "12.4M", "8.2"],
                [":VIEWED", "421M", "42.1"],
              ]}
            />
          </ChartCard>
        </div>
      )}

      {tab === "algorithms" && (
        <div className={grid}>
          <ChartCard title="GDS algorithms" span={12}>
            <ul className="space-y-1.5 text-xs">
              {[
                ["pageRank", "running", "success"],
                ["louvain", "queued", "info"],
                ["betweennessCentrality", "running", "success"],
                ["nodeSimilarity", "failed", "destructive"],
                ["fastRP", "running", "success"],
              ].map(([n, s, t], i) => (
                <li key={i} className="flex items-center justify-between border-b border-border pb-1.5">
                  <span className="font-mono">{n}</span>
                  <Pill tone={t as never}>{s}</Pill>
                </li>
              ))}
            </ul>
          </ChartCard>
        </div>
      )}

      {tab === "performance" && (
        <div className={grid}>
          <ChartCard title="Query latency · 24h" span={8}>
            <LineSeries seed={303} lines={3} height={200} />
          </ChartCard>
          <ChartCard title="Cache hit" span={4}>
            <div className="grid place-items-center"><Donut value={92} label="hit rate" color="var(--color-success)" /></div>
          </ChartCard>
          <div className="col-span-12">
            <AIInsights items={[
              { title: "High-degree node detected", body: "User `u-481` has 12k outbound edges — likely a service account, recommend exclude from similarity ranking.", tone: "warning", confidence: 89 },
              { title: "Index recommendation", body: "Query patterns suggest a composite index on (:Document {tenant, updated_at}) would cut p95 by ~40%.", tone: "info", confidence: 84 },
              { title: "Algorithm `nodeSimilarity` failed", body: "Memory budget exceeded — re-run with `concurrency: 4` or stream sampling.", tone: "destructive", confidence: 92 },
            ]} />
          </div>
        </div>
      )}
    </PageShell>
  );
}
