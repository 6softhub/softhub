import { useMemo, useState } from "react";
import * as Icons from "lucide-react";
import type { DashSpec } from "@/data/dashboards";
import {
  Shell, DataTable, Pill, Donut, Bars, LineSeries, ProgressBar,
  Spark, StatusDot, Heatmap, Timeline, Avatar, Kanban, Terminal, WorldMap,
} from "./_primitives";
import {
  ChartCard, DashboardToolbar, FilterBar, AIInsights,
  Modal, EmptyState, useDashboardState,
} from "./_universal";

/* ============================================================
   CATEGORY 07 — DEVELOPMENT + DEVOPS
   Slugs: devops, repos, git-mgmt, deployment, cicd,
          api-hub, infra, observability
   ============================================================ */

/* ---------------- Source Code Repository ---------------- */
export function ReposDev({ d }: { d: DashSpec }) {
  const s = useDashboardState();
  const [open, setOpen] = useState<null | { name: string }>(null);
  const repos = useMemo(() => ([
    { name: "nexus/platform", lang: "TypeScript", stars: "12.4k", prs: 42, issues: 148, ci: "pass", cov: 94 },
    { name: "nexus/web",      lang: "TypeScript", stars: "8.2k",  prs: 18, issues: 82,  ci: "pass", cov: 89 },
    { name: "nexus/ml",       lang: "Python",     stars: "4.1k",  prs: 12, issues: 42,  ci: "running", cov: 78 },
    { name: "nexus/edge",     lang: "Rust",       stars: "2.8k",  prs: 8,  issues: 18,  ci: "pass", cov: 92 },
    { name: "nexus/mobile",   lang: "Swift",      stars: "1.4k",  prs: 6,  issues: 24,  ci: "fail", cov: 71 },
    { name: "nexus/docs",     lang: "MDX",        stars: "812",   prs: 14, issues: 18,  ci: "pass", cov: 100 },
  ]), []);
  const filtered = repos.filter(x => x.name.toLowerCase().includes(s.filter.toLowerCase()));
  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <ChartCard title="Commit Activity · 30d" span={8}
          toolbar={<DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive}/>}>
          <LineSeries seed={101} lines={3} height={200}/>
        </ChartCard>
        <ChartCard title="Copilot Acceptance" span={4} className="grid place-items-center">
          <Donut value={82} label="accepted" color="var(--color-primary)"/>
        </ChartCard>
        <ChartCard title="Repositories" span={12}
          toolbar={<>
            <FilterBar value={s.filter} onChange={s.setFilter} placeholder="Search repos…"/>
            <button className="text-[11px] px-2 py-1 rounded-md bg-primary text-primary-foreground">New repo</button>
          </>}>
          {filtered.length === 0 ? <EmptyState icon="GitBranch" title="No repos match"/> : (
            <DataTable columns={["Repository","Language","Stars","Open PRs","Issues","Coverage","CI",""]} rows={
              filtered.map((r,i)=>[
                <span key={i} className="flex items-center gap-2"><Icons.GitBranch className="w-3.5 h-3.5 text-primary"/><span className="font-mono">{r.name}</span></span>,
                <Pill key={i}>{r.lang}</Pill>,
                <span key={i} className="tabular-nums">{r.stars}</span>,
                <span key={i} className="tabular-nums">{r.prs}</span>,
                <span key={i} className="tabular-nums">{r.issues}</span>,
                <span key={i} className="flex items-center gap-2 w-32"><ProgressBar value={r.cov} color={r.cov>=90?"var(--color-success)":"var(--color-warning)"}/><span className="tabular-nums">{r.cov}%</span></span>,
                <Pill key={i} tone={r.ci==="pass"?"success":r.ci==="fail"?"destructive":"warning"}>{r.ci}</Pill>,
                <button key={i} onClick={()=>setOpen({name:r.name})} className="text-[11px] text-primary hover:underline">Open</button>,
              ])
            }/>
          )}
        </ChartCard>
        <ChartCard title="Contribution Heatmap · last 52w" span={8}>
          <Heatmap rows={7} cols={52} seed={103} color="var(--color-success)"/>
        </ChartCard>
        <ChartCard title="Top Contributors" span={4}>
          <div className="space-y-2 text-xs">
            {[["Ava Chen","1,248"],["Mateo Ruiz","984"],["Sora Park","812"],["Jules Martin","642"],["Noor Said","412"]].map(([n,c])=>(
              <div key={n} className="flex items-center gap-2"><Avatar name={n}/><span className="flex-1">{n}</span><span className="tabular-nums text-muted-foreground">{c} commits</span></div>
            ))}
          </div>
        </ChartCard>
      </div>
      <Modal open={!!open} onClose={()=>setOpen(null)} title={open?.name} size="lg">
        <Terminal lines={[
          { t: `git clone git@nexus.dev:${open?.name}.git`, tone: "info" },
          { t: "Cloning into '" + (open?.name?.split("/")[1]||"repo") + "'...", tone: "muted" },
          { t: "remote: Enumerating objects: 48201, done.", tone: "muted" },
          { t: "remote: Counting objects: 100% (48201/48201), done.", tone: "muted" },
          { t: "Receiving objects: 100% (48201/48201), 142.8 MiB | 12.4 MiB/s, done.", tone: "success" },
        ]}/>
      </Modal>
    </Shell>
  );
}

/* ---------------- Git Management ---------------- */
export function GitMgmt({ d }: { d: DashSpec }) {
  const s = useDashboardState();
  const mrs = useMemo(() => ([
    { id: "MR-4821", title: "feat(auth): WebAuthn passkeys",     author: "Ava Chen",   branch: "feat/passkeys",   status: "review",  files: 24, ci: "pass" },
    { id: "MR-4820", title: "fix(api): rate-limit headers",      author: "Mateo Ruiz", branch: "fix/ratelimit",   status: "approved",files: 6,  ci: "pass" },
    { id: "MR-4819", title: "chore(deps): upgrade vite 7",       author: "Sora Park",  branch: "chore/vite7",     status: "draft",   files: 2,  ci: "running" },
    { id: "MR-4818", title: "feat(billing): proration engine",   author: "Jules Martin",branch: "feat/proration", status: "changes", files: 38, ci: "fail" },
    { id: "MR-4817", title: "perf(edge): cache hot keys",        author: "Noor Said",  branch: "perf/cache",      status: "review",  files: 12, ci: "pass" },
  ]), []);
  const filtered = mrs.filter(x => x.title.toLowerCase().includes(s.filter.toLowerCase()));
  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <ChartCard title="Branches Active · 24h" span={8}
          toolbar={<DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive}/>}>
          <LineSeries seed={111} lines={2} height={180}/>
          <div className="grid grid-cols-4 mt-3 text-center text-[11px]">
            <div><div className="text-muted-foreground">Branches</div><div className="font-semibold tabular-nums">42,128</div></div>
            <div><div className="text-muted-foreground">Protected</div><div className="font-semibold tabular-nums text-success">96%</div></div>
            <div><div className="text-muted-foreground">Stale &gt;30d</div><div className="font-semibold tabular-nums text-warning">2,418</div></div>
            <div><div className="text-muted-foreground">Signed</div><div className="font-semibold tabular-nums">84%</div></div>
          </div>
        </ChartCard>
        <ChartCard title="LFS Storage" span={4}>
          <div className="grid place-items-center"><Donut value={68} label="of 12 TB" color="var(--color-info)"/></div>
          <div className="mt-3 space-y-1 text-[11px]">
            <div className="flex justify-between"><span>Models</span><span className="tabular-nums">4.8 TB</span></div>
            <div className="flex justify-between"><span>Datasets</span><span className="tabular-nums">2.1 TB</span></div>
            <div className="flex justify-between"><span>Media</span><span className="tabular-nums">1.2 TB</span></div>
          </div>
        </ChartCard>
        <ChartCard title="Merge Requests" span={12}
          toolbar={<FilterBar value={s.filter} onChange={s.setFilter} placeholder="Filter MRs…"/>}>
          {filtered.length === 0 ? <EmptyState icon="GitMerge" title="No merge requests match"/> : (
            <DataTable columns={["ID","Title","Author","Branch","Files","CI","Status"]} rows={
              filtered.map((r,i)=>[
                <span key={i} className="font-mono text-[11px]">{r.id}</span>,
                <span key={i} className="font-medium">{r.title}</span>,
                <span key={i} className="flex items-center gap-2"><Avatar name={r.author}/>{r.author}</span>,
                <span key={i} className="font-mono text-[11px] text-info">{r.branch}</span>,
                <span key={i} className="tabular-nums">{r.files}</span>,
                <Pill key={i} tone={r.ci==="pass"?"success":r.ci==="fail"?"destructive":"warning"}>{r.ci}</Pill>,
                <Pill key={i} tone={r.status==="approved"?"success":r.status==="changes"?"destructive":r.status==="review"?"info":"muted"}>{r.status}</Pill>,
              ])
            }/>
          )}
        </ChartCard>
        <ChartCard title="Branch Policy · Protected" span={6}>
          <div className="space-y-2 text-xs">
            {[
              { n: "main",     rule: "2 reviews · signed · CI required", ok: true },
              { n: "release/*",rule: "CODEOWNERS · linear history",      ok: true },
              { n: "develop",  rule: "1 review · CI required",            ok: true },
              { n: "hotfix/*", rule: "Admin override allowed",            ok: false },
            ].map(p => (
              <div key={p.n} className="flex items-center justify-between p-2 rounded border border-border bg-card">
                <div><div className="font-mono text-[11px] text-primary">{p.n}</div><div className="text-[10px] text-muted-foreground">{p.rule}</div></div>
                <Pill tone={p.ok?"success":"warning"}>{p.ok?"locked":"loose"}</Pill>
              </div>
            ))}
          </div>
        </ChartCard>
        <ChartCard title="Webhooks · Last 24h" span={6}>
          <Timeline items={[
            { time: "12:48", title: "push → Jira sync", tone: "success", meta: "MR-4821" },
            { time: "12:42", title: "merge → Slack #releases", tone: "info" },
            { time: "11:18", title: "tag → Argo deploy prod", tone: "success", meta: "v4.18.0" },
            { time: "10:02", title: "push → SAST scan failed", tone: "destructive", meta: "nexus/ml" },
            { time: "09:14", title: "issue → Linear", tone: "muted" },
          ]}/>
        </ChartCard>
      </div>
    </Shell>
  );
}

/* ---------------- Deployment Center ---------------- */
export function Deployment({ d }: { d: DashSpec }) {
  const s = useDashboardState();
  const [open, setOpen] = useState<null | { env: string }>(null);
  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <ChartCard title="Deploys · 24h" span={8}
          toolbar={<DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive}
            extra={<button className="text-[11px] px-2 py-1 rounded-md bg-warning/15 text-warning border border-warning/30 inline-flex items-center gap-1"><Icons.Rocket className="w-3 h-3"/>Promote</button>}/>}>
          <LineSeries seed={121} lines={2} height={200}/>
          <div className="grid grid-cols-4 mt-3 text-center text-[11px]">
            <div><div className="text-muted-foreground">Deploys/d</div><div className="font-semibold tabular-nums">482</div></div>
            <div><div className="text-muted-foreground">Success</div><div className="font-semibold tabular-nums text-success">98.6%</div></div>
            <div><div className="text-muted-foreground">Lead Time</div><div className="font-semibold tabular-nums">42m</div></div>
            <div><div className="text-muted-foreground">Rollbacks</div><div className="font-semibold tabular-nums text-warning">3</div></div>
          </div>
        </ChartCard>
        <ChartCard title="Strategy Mix" span={4}>
          <div className="grid grid-cols-3 gap-2 place-items-center">
            <div className="text-center"><Donut value={48} label="rolling" color="var(--color-info)" size={80}/></div>
            <div className="text-center"><Donut value={32} label="canary" color="var(--color-warning)" size={80}/></div>
            <div className="text-center"><Donut value={20} label="blue/green" color="var(--color-accent)" size={80}/></div>
          </div>
        </ChartCard>

        <ChartCard title="Environments" span={12}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { env: "production",  ver: "v4.18.0", status: "healthy", tone: "success",   replicas: "48/48", traffic: 100 },
              { env: "canary",      ver: "v4.19.0-rc.2", status: "promoting", tone: "warning", replicas: "8/48", traffic: 12 },
              { env: "staging",     ver: "v4.19.0-rc.2", status: "healthy", tone: "success", replicas: "12/12", traffic: 100 },
              { env: "preview-481", ver: "feat/passkeys", status: "building", tone: "info", replicas: "0/4", traffic: 0 },
            ].map(e => (
              <button key={e.env} onClick={()=>setOpen({env:e.env})} className="text-left glass rounded-lg p-3 border border-border hover:border-primary/40 transition-colors">
                <div className="flex items-center justify-between"><div className="text-xs font-semibold">{e.env}</div><Pill tone={e.tone as never}>{e.status}</Pill></div>
                <div className="mt-2 font-mono text-[11px] text-info">{e.ver}</div>
                <div className="mt-2 text-[10px] text-muted-foreground flex justify-between"><span>Replicas {e.replicas}</span><span>{e.traffic}% traffic</span></div>
                <ProgressBar value={e.traffic} color="var(--color-primary)"/>
              </button>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Release Train" span={8}>
          <Kanban columns={[
            { title: "Queued",    tone: "info",    items: [{title:"v4.19.0-rc.3",meta:"feat/billing + 14",tag:"Helm"}] },
            { title: "Canary",    tone: "warning", items: [{title:"v4.19.0-rc.2",meta:"12% traffic · 8m",tag:"Argo"}] },
            { title: "Rollout",   tone: "info",    items: [{title:"v4.18.0",meta:"100% prod · stable",tag:"GitOps"}] },
            { title: "Rolled back",tone:"destructive",items:[{title:"v4.17.4",meta:"SLO breach · auto",tag:"Auto"}] },
          ]}/>
        </ChartCard>

        <div className="col-span-12 lg:col-span-4">
          <AIInsights items={[
            { title: "Canary regression risk", body: "p99 latency on /checkout up 18% on rc.2 — hold promotion above 25% traffic.", tone: "warning", confidence: 89 },
            { title: "Deploy window", body: "Friday APAC traffic dip in 2h — safer window for v4.19.0 promotion.", tone: "info", confidence: 82 },
            { title: "GitOps drift", body: "3 clusters drifted from manifest in last 24h — auto-reconciled.", tone: "success", confidence: 97 },
          ]}/>
        </div>
      </div>

      <Modal open={!!open} onClose={()=>setOpen(null)} title={`Environment · ${open?.env}`} size="lg"
        footer={<>
          <button className="px-3 py-1.5 rounded-md bg-muted text-xs">Rollback</button>
          <button className="px-3 py-1.5 rounded-md bg-warning text-warning-foreground text-xs">Promote 100%</button>
        </>}>
        <Terminal lines={[
          { t: `argo rollout status ${open?.env}`, tone: "info" },
          { t: "Name:            nexus-api", tone: "muted" },
          { t: "Status:          ◌ Progressing", tone: "warning" },
          { t: "Strategy:        Canary", tone: "muted" },
          { t: "  Step:          3/8", tone: "muted" },
          { t: "  SetWeight:     25", tone: "muted" },
          { t: "Replicas:        Desired: 48 / Current: 48 / Updated: 12 / Ready: 48", tone: "success" },
        ]}/>
      </Modal>
    </Shell>
  );
}

/* ---------------- CI/CD Pipelines ---------------- */
export function Cicd({ d }: { d: DashSpec }) {
  const s = useDashboardState();
  const pipes = useMemo(() => ([
    { id: "#48201", repo: "nexus/platform", branch: "main",          stage: "deploy",  status: "success", dur: "4m 12s" },
    { id: "#48200", repo: "nexus/web",      branch: "feat/passkeys", stage: "test",    status: "running", dur: "2m 04s" },
    { id: "#48199", repo: "nexus/ml",       branch: "main",          stage: "build",   status: "success", dur: "8m 48s" },
    { id: "#48198", repo: "nexus/edge",     branch: "perf/cache",    stage: "deploy",  status: "success", dur: "3m 22s" },
    { id: "#48197", repo: "nexus/platform", branch: "fix/cors",      stage: "build",   status: "failed",  dur: "1m 12s" },
    { id: "#48196", repo: "nexus/mobile",   branch: "release/4.18",  stage: "publish", status: "queued",  dur: "—" },
  ]), []);
  const filtered = pipes.filter(x => `${x.repo} ${x.branch}`.toLowerCase().includes(s.filter.toLowerCase()));
  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <ChartCard title="Pipeline Throughput · 24h" span={8}
          toolbar={<DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive}/>}>
          <LineSeries seed={131} lines={3} height={200}/>
          <div className="grid grid-cols-4 mt-3 text-center text-[11px]">
            <div><div className="text-muted-foreground">Pipelines/h</div><div className="font-semibold tabular-nums">4,812</div></div>
            <div><div className="text-muted-foreground">Avg Build</div><div className="font-semibold tabular-nums">4m 22s</div></div>
            <div><div className="text-muted-foreground">Pass Rate</div><div className="font-semibold tabular-nums text-success">98.4%</div></div>
            <div><div className="text-muted-foreground">Cache Hit</div><div className="font-semibold tabular-nums text-info">82%</div></div>
          </div>
        </ChartCard>
        <ChartCard title="Runner Utilization" span={4}>
          <Bars seed={132} n={24} color="var(--color-warning)" height={120}/>
          <div className="mt-3 space-y-1 text-[11px]">
            {[["linux-x64","248 / 320"],["linux-arm","48 / 64"],["macos","18 / 32"],["windows","8 / 16"]].map(([n,v])=>(
              <div key={n} className="flex justify-between"><span>{n}</span><span className="tabular-nums">{v}</span></div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Active Pipelines" span={12}
          toolbar={<FilterBar value={s.filter} onChange={s.setFilter} placeholder="Filter pipelines…"/>}>
          {filtered.length === 0 ? <EmptyState icon="Workflow" title="No pipelines match"/> : (
            <DataTable columns={["ID","Repository","Branch","Stage","Status","Duration",""]} rows={
              filtered.map((p,i)=>[
                <span key={i} className="font-mono text-[11px]">{p.id}</span>,
                <span key={i} className="font-mono">{p.repo}</span>,
                <span key={i} className="font-mono text-[11px] text-info">{p.branch}</span>,
                <Pill key={i}>{p.stage}</Pill>,
                <Pill key={i} tone={p.status==="success"?"success":p.status==="failed"?"destructive":p.status==="running"?"warning":"muted"}>{p.status}</Pill>,
                <span key={i} className="tabular-nums text-muted-foreground">{p.dur}</span>,
                <button key={i} className="text-[11px] text-primary hover:underline">Logs</button>,
              ])
            }/>
          )}
        </ChartCard>

        <ChartCard title="Workflow Stages · p95" span={6}>
          <div className="space-y-2 text-xs">
            {[["install",42,"info"],["build",148,"primary"],["unit",62,"info"],["e2e",212,"warning"],["docker",184,"warning"],["deploy",92,"success"]].map(([n,v,c])=>(
              <div key={String(n)}><div className="flex justify-between"><span>{n}</span><span className="tabular-nums">{v}s</span></div><ProgressBar value={Math.min(100,(v as number)/3)} color={`var(--color-${c})`}/></div>
            ))}
          </div>
        </ChartCard>
        <ChartCard title="Live Build Log · #48200" span={6}>
          <Terminal lines={[
            { t: "$ bun install --frozen-lockfile", tone: "info" },
            { t: "→ resolved 1,248 packages in 12.4s", tone: "success" },
            { t: "$ bun run typecheck", tone: "info" },
            { t: "→ tsc --noEmit (4.2s)", tone: "success" },
            { t: "$ bun test --coverage", tone: "info" },
            { t: "→ 482 passed · 0 failed · coverage 89.4%", tone: "success" },
            { t: "$ bun run build", tone: "info" },
            { t: "◌ vite build · transforming modules…", tone: "warning" },
          ]}/>
        </ChartCard>
      </div>
    </Shell>
  );
}

/* ---------------- API & Integration Hub ---------------- */
export function ApiHubPremium({ d }: { d: DashSpec }) {
  const s = useDashboardState();
  const apis = useMemo(() => ([
    { path: "/v2/orders",   ver: "v2.4", rps: 42_100, p95: 32,  err: 0.02, slo: 99.95, tier: "Gold" },
    { path: "/v2/payments", ver: "v2.1", rps: 28_400, p95: 48,  err: 0.18, slo: 99.90, tier: "Gold" },
    { path: "/v2/users",    ver: "v2.6", rps: 84_200, p95: 18,  err: 0.01, slo: 99.99, tier: "Plat" },
    { path: "/v1/catalog",  ver: "v1.8", rps: 142_000,p95: 24,  err: 0.04, slo: 99.95, tier: "Plat" },
    { path: "/v1/search",   ver: "v1.4", rps: 184_000,p95: 92,  err: 0.32, slo: 99.50, tier: "Silver" },
    { path: "/v2/webhooks", ver: "v2.0", rps: 12_400, p95: 142, err: 0.84, slo: 98.20, tier: "Silver" },
  ]), []);
  const filtered = apis.filter(x => x.path.toLowerCase().includes(s.filter.toLowerCase()));
  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <ChartCard title="Calls/s · Last hour" span={8}
          toolbar={<DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive}/>}>
          <LineSeries seed={141} lines={3} height={200}/>
          <div className="grid grid-cols-4 mt-3 text-center text-[11px]">
            <div><div className="text-muted-foreground">APIs</div><div className="font-semibold tabular-nums">1,284</div></div>
            <div><div className="text-muted-foreground">Calls/s</div><div className="font-semibold tabular-nums text-info">482k</div></div>
            <div><div className="text-muted-foreground">p95 Global</div><div className="font-semibold tabular-nums">42ms</div></div>
            <div><div className="text-muted-foreground">Errors</div><div className="font-semibold tabular-nums text-success">0.02%</div></div>
          </div>
        </ChartCard>
        <ChartCard title="Gateway Edge" span={4}>
          <WorldMap seed={142}/>
        </ChartCard>

        <ChartCard title="API Catalog" span={12}
          toolbar={<>
            <FilterBar value={s.filter} onChange={s.setFilter} placeholder="Search endpoints…"/>
            <button className="text-[11px] px-2 py-1 rounded-md bg-primary text-primary-foreground">Publish</button>
          </>}>
          {filtered.length === 0 ? <EmptyState icon="Plug" title="No endpoints match"/> : (
            <DataTable columns={["Endpoint","Version","Tier","RPS","p95","Errors","SLO"]} rows={
              filtered.map((a,i)=>[
                <span key={i} className="font-mono">{a.path}</span>,
                <Pill key={i}>{a.ver}</Pill>,
                <Pill key={i} tone={a.tier==="Plat"?"accent":a.tier==="Gold"?"warning":"muted"}>{a.tier}</Pill>,
                <span key={i} className="tabular-nums">{a.rps.toLocaleString()}</span>,
                <span key={i} className={`tabular-nums ${a.p95>100?"text-warning":""}`}>{a.p95}ms</span>,
                <span key={i} className={`tabular-nums ${a.err>0.5?"text-destructive":a.err>0.1?"text-warning":"text-success"}`}>{a.err}%</span>,
                <span key={i} className="flex items-center gap-2 w-24"><ProgressBar value={a.slo} color={a.slo>=99.9?"var(--color-success)":"var(--color-warning)"}/><span className="tabular-nums">{a.slo}%</span></span>,
              ])
            }/>
          )}
        </ChartCard>

        <ChartCard title="Connectors" span={6}>
          <div className="grid grid-cols-5 gap-2">
            {["SAP","SFDC","S3","Snow","Kafka","SOAP","HTTP","JDBC","SFTP","Stripe","Twilio","SES","Slack","Zoom","GH"].map(c=>(
              <div key={c} className="aspect-square grid place-items-center rounded border border-border bg-muted/20 text-[10px] hover:border-primary/40">{c}</div>
            ))}
          </div>
        </ChartCard>
        <ChartCard title="Policy Compliance" span={6}>
          <div className="space-y-2 text-xs">
            {[["OAuth 2.1",98,"success"],["Rate-limit applied",96,"success"],["WAF rules",92,"success"],["Schema validation",84,"warning"],["mTLS internal",100,"success"]].map(([n,v,c])=>(
              <div key={String(n)}><div className="flex justify-between"><span>{n}</span><span className="tabular-nums">{v}%</span></div><ProgressBar value={v as number} color={`var(--color-${c})`}/></div>
            ))}
          </div>
        </ChartCard>
      </div>
    </Shell>
  );
}

/* ---------------- DevOps Center (umbrella) ---------------- */
export function DevOpsPremium({ d }: { d: DashSpec }) {
  const s = useDashboardState();
  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <ChartCard title="DORA Metrics" span={6}
          toolbar={<DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive}/>}>
          <div className="grid grid-cols-2 gap-3">
            {[
              { k: "Lead Time", v: "42m",  trend: "↓ 18%", tone: "success" as const },
              { k: "Deploy Freq", v: "312/d", trend: "↑ 22%", tone: "success" as const },
              { k: "MTTR", v: "12m", trend: "↓ 4m", tone: "success" as const },
              { k: "Change Fail", v: "2.1%", trend: "↑ 0.4pp", tone: "warning" as const },
            ].map(m => (
              <div key={m.k} className="glass rounded-lg p-3 border border-border">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{m.k}</div>
                <div className="text-2xl font-semibold tabular-nums mt-1">{m.v}</div>
                <div className={`text-[11px] mt-1 ${m.tone==="success"?"text-success":"text-warning"}`}>{m.trend}</div>
                <div className="mt-2"><Spark seed={150 + m.k.length}/></div>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Pipeline Stream · Live" span={6}>
          <div className="space-y-2">
            {[
              ["#48201","main","build → test → deploy","success","just now"],
              ["#48200","feat/passkeys","build → test","warning","1m"],
              ["#48199","main","build → test → deploy","success","2m"],
              ["#48198","fix/cors","build (failed)","destructive","3m"],
              ["#48197","release/4.18","publish","muted","4m"],
            ].map((p,i)=>(
              <div key={i} className="flex items-center gap-3 p-2 border border-border rounded-md bg-card text-xs">
                <Pill tone={p[3] as never}>{p[3]==="success"?"✓":p[3]==="destructive"?"✗":"●"}</Pill>
                <div className="font-mono">{p[0]}</div>
                <div className="text-muted-foreground font-mono text-[11px]">{p[1]}</div>
                <div className="flex-1">{p[2]}</div>
                <div className="text-[10px] text-muted-foreground">{p[4]}</div>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Environments Health" span={8}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Array.from({length:24}).map((_,i)=>{
              const tone = i===7?"destructive":i===14?"warning":"success";
              return (
                <div key={i} className="p-2 rounded border border-border bg-card flex items-center gap-2 text-[11px]">
                  <StatusDot tone={tone as never}/>
                  <span className="font-mono">env-{(100+i).toString(16)}</span>
                </div>
              );
            })}
          </div>
        </ChartCard>

        <div className="col-span-12 lg:col-span-4">
          <AIInsights items={[
            { title: "Flaky tests trend", body: "3 e2e specs flagged flaky last 7d — quarantine and open issue thread.", tone: "warning", confidence: 86 },
            { title: "Cache savings", body: "Turbo cache saved 412 build-hours this week — ~$3.2k compute.", tone: "success", confidence: 99 },
            { title: "Security backlog", body: "12 SAST findings &gt;30d — auto-create PRs with safe upgrades.", tone: "info", confidence: 80 },
          ]}/>
        </div>
      </div>
    </Shell>
  );
}

/* ---------------- Infrastructure ---------------- */
export function InfraPremium({ d }: { d: DashSpec }) {
  const s = useDashboardState();
  const hosts = useMemo(() => ([
    { name: "esx-prod-01", cluster: "prod-a", cpu: 68, mem: 74, vms: 142, status: "ok" },
    { name: "esx-prod-02", cluster: "prod-a", cpu: 82, mem: 78, vms: 138, status: "ok" },
    { name: "esx-prod-03", cluster: "prod-b", cpu: 94, mem: 88, vms: 158, status: "warn" },
    { name: "esx-prod-04", cluster: "prod-b", cpu: 42, mem: 51, vms: 92,  status: "ok" },
    { name: "esx-edge-01", cluster: "edge",   cpu: 22, mem: 28, vms: 18,  status: "drain" },
  ]), []);
  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <ChartCard title="Cluster Load · 24h" span={8}
          toolbar={<DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive}/>}>
          <LineSeries seed={161} lines={4} height={200}/>
        </ChartCard>
        <ChartCard title="vSAN Capacity" span={4} className="grid place-items-center">
          <Donut value={76} label="of 12.4 PB" color="var(--color-info)"/>
        </ChartCard>

        <ChartCard title="Hosts" span={12}>
          <DataTable columns={["Host","Cluster","CPU","Memory","VMs","Status"]} rows={
            hosts.map((h,i)=>[
              <span key={i} className="font-mono">{h.name}</span>,
              <Pill key={i}>{h.cluster}</Pill>,
              <span key={i} className="flex items-center gap-2 w-32"><ProgressBar value={h.cpu} color={h.cpu>90?"var(--color-destructive)":h.cpu>75?"var(--color-warning)":"var(--color-success)"}/><span className="tabular-nums">{h.cpu}%</span></span>,
              <span key={i} className="flex items-center gap-2 w-32"><ProgressBar value={h.mem} color={h.mem>90?"var(--color-destructive)":h.mem>75?"var(--color-warning)":"var(--color-success)"}/><span className="tabular-nums">{h.mem}%</span></span>,
              <span key={i} className="tabular-nums">{h.vms}</span>,
              <Pill key={i} tone={h.status==="ok"?"success":h.status==="warn"?"warning":"info"}>{h.status}</Pill>,
            ])
          }/>
        </ChartCard>

        <ChartCard title="Networking · Throughput" span={6}>
          <Bars seed={162} n={24} color="var(--color-accent)" height={140}/>
          <div className="mt-2 grid grid-cols-3 text-center text-[11px]">
            <div><div className="text-muted-foreground">North-South</div><div className="font-semibold tabular-nums">142 Gb/s</div></div>
            <div><div className="text-muted-foreground">East-West</div><div className="font-semibold tabular-nums">684 Gb/s</div></div>
            <div><div className="text-muted-foreground">Drops</div><div className="font-semibold tabular-nums text-warning">0.02%</div></div>
          </div>
        </ChartCard>
        <ChartCard title="Datacenter Map" span={6}>
          <WorldMap seed={163}/>
        </ChartCard>
      </div>
    </Shell>
  );
}

/* ---------------- Monitoring & Observability ---------------- */
export function ObservabilityPremium({ d }: { d: DashSpec }) {
  const s = useDashboardState();
  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <ChartCard title="Golden Signals · 1h" span={8}
          toolbar={<DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive}/>}>
          <LineSeries seed={171} lines={4} height={220}/>
          <div className="grid grid-cols-4 mt-3 text-center text-[11px]">
            <div><div className="text-muted-foreground">Latency p95</div><div className="font-semibold tabular-nums">142ms</div></div>
            <div><div className="text-muted-foreground">Traffic</div><div className="font-semibold tabular-nums text-info">482k rps</div></div>
            <div><div className="text-muted-foreground">Errors</div><div className="font-semibold tabular-nums text-warning">0.18%</div></div>
            <div><div className="text-muted-foreground">Saturation</div><div className="font-semibold tabular-nums">68%</div></div>
          </div>
        </ChartCard>
        <ChartCard title="Service Health" span={4}>
          <div className="grid grid-cols-4 gap-1.5">
            {Array.from({length:64}).map((_,i)=>{
              const tone = i===17||i===42?"destructive":i===8||i===36||i===55?"warning":"success";
              const bg = tone==="destructive"?"bg-destructive":tone==="warning"?"bg-warning":"bg-success";
              return <div key={i} className={`aspect-square rounded ${bg}`} style={{opacity:0.3+Math.random()*0.7}} title={`svc-${i}`}/>;
            })}
          </div>
          <div className="mt-3 text-[11px] flex justify-between"><span className="text-muted-foreground">64 services</span><span className="text-success">61 healthy</span></div>
        </ChartCard>

        <ChartCard title="APM · Slowest Endpoints" span={6}>
          <DataTable columns={["Service","Endpoint","p95","Throughput","Apdex"]} rows={[
            ["checkout-api","/v2/checkout/confirm",<span key="a" className="text-warning tabular-nums">412ms</span>,"4.2k","0.78"],
            ["search-svc","/v1/search/query",<span key="b" className="text-warning tabular-nums">218ms</span>,"82k","0.86"],
            ["billing-svc","/v2/invoices",<span key="c" className="tabular-nums">142ms</span>,"1.8k","0.94"],
            ["auth-svc","/v2/login/passkey",<span key="d" className="tabular-nums">68ms</span>,"12.4k","0.98"],
          ]}/>
        </ChartCard>
        <ChartCard title="Logs Stream · ERROR" span={6}>
          <Terminal lines={[
            { t: "[14:02:18] checkout-api ERR stripe webhook timeout (idempotency_key=cs_4821)", tone: "destructive" },
            { t: "[14:02:14] search-svc  WARN circuit-breaker half-open · downstream:elastic", tone: "warning" },
            { t: "[14:02:11] auth-svc    INFO passkey assertion verified · user=42118", tone: "info" },
            { t: "[14:02:08] billing-svc ERR proration rounding · invoice=INV-48218", tone: "destructive" },
            { t: "[14:02:01] edge-fn     INFO cache miss /v1/catalog/2418", tone: "muted" },
          ]}/>
        </ChartCard>

        <ChartCard title="Active Alerts" span={8}>
          <Timeline items={[
            { time: "now",  title: "Stripe webhook latency > 2s · P1", tone: "destructive", meta: "PagerDuty engaged" },
            { time: "4m",   title: "Search QPS spike · 184k → 248k",   tone: "warning",     meta: "Auto-scaled" },
            { time: "12m",  title: "Edge cache evictions abnormal",     tone: "info",        meta: "Monitoring" },
            { time: "28m",  title: "DB connection pool 92%",             tone: "warning",     meta: "Pool resized" },
            { time: "1h",   title: "Synthetic checkout flow recovered",  tone: "success" },
          ]}/>
        </ChartCard>

        <div className="col-span-12 lg:col-span-4">
          <AIInsights items={[
            { title: "Anomaly · checkout p95", body: "+38% above 7d baseline correlated with Stripe webhook lag. Suggest enabling local retry queue.", tone: "destructive", confidence: 93 },
            { title: "Log volume forecast", body: "Logs/s trending to exceed 6M by 18:00 — pre-scale ingester nodes by 20%.", tone: "warning", confidence: 88 },
            { title: "Noise reduction", body: "12 alerts can be deduplicated under 'edge-cache-evict' — group rule suggested.", tone: "info", confidence: 90 },
          ]}/>
        </div>
      </div>
    </Shell>
  );
}
