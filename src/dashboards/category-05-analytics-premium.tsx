import { useMemo, useState } from "react";
import * as Icons from "lucide-react";
import type { DashSpec } from "@/data/dashboards";
import {
  Pill, Donut, Bars, LineSeries, Heatmap, Spark, WorldMap,
  DataTable, ProgressBar, Kanban, Timeline, Terminal,
} from "./_primitives";
import {
  ChartCard, AIInsights, DashboardToolbar, Modal, TabBar, FilterBar,
  QuickActions, EmptyState, useDashboardState, useTabs,
} from "./_universal";

/* ============================================================
   CATEGORY 05 — Analytics + SEO + Marketing (premium)
   Analytics · Reporting · SEO · Marketing · Social
   ============================================================ */

const grid = "grid grid-cols-12 gap-4";

function Header({ d, right }: { d: DashSpec; right?: React.ReactNode }) {
  const Icon = (Icons as never as Record<string, Icons.LucideIcon>)[d.icon] || Icons.BarChart3;
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
   1. ANALYTICS & BUSINESS INTELLIGENCE
   ============================================================ */
type AnalyticsTab = "overview" | "audience" | "funnels" | "events";
export function Analytics({ d }: { d: DashSpec }) {
  const s = useDashboardState();
  const { tab, setTab } = useTabs<AnalyticsTab>("overview");
  const [open, setOpen] = useState(false);

  const kpis: Kpi[] = [
    { label: "Sessions 24h", value: "284,019", delta: "+12%", tone: "success" },
    { label: "Pageviews", value: "1.42M", delta: "+9%", tone: "success" },
    { label: "Unique Users", value: "182,440", delta: "+6%", tone: "success" },
    { label: "Conv. rate", value: "4.8%", delta: "+0.3pp", tone: "success" },
    { label: "Avg session", value: "2m 41s", delta: "-4s", tone: "warning" },
    { label: "Bounce", value: "38.2%", delta: "-1.1pp", tone: "success" },
  ];

  return (
    <PageShell d={d} toolbar={<DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive} extra={<button onClick={() => setOpen(true)} className="text-[11px] px-2.5 py-1 rounded-md bg-primary text-primary-foreground">Export</button>} />}>
      <Kpis items={kpis} />
      <TabBar<AnalyticsTab>
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "overview", label: "Overview", icon: "LayoutDashboard" },
          { id: "audience", label: "Audience", icon: "Users", badge: "1.2k live" },
          { id: "funnels", label: "Funnels", icon: "Filter" },
          { id: "events", label: "Events", icon: "Activity", badge: "284" },
        ]}
        right={<FilterBar value={s.filter} onChange={s.setFilter} placeholder="Filter properties…" />}
      />

      {tab === "overview" && (
        <div className={grid}>
          <ChartCard span={8} title="Sessions · Pageviews · Conversions" subtitle="Multi-series realtime stream" toolbar={<Pill tone="success">+18.2%</Pill>}>
            <LineSeries seed={11} lines={3} height={220} />
          </ChartCard>
          <ChartCard span={4} title="Top Sources">
            <div className="space-y-3">
              {[["Organic", 42, "primary"], ["Direct", 26, "accent"], ["Referral", 18, "info"], ["Paid", 9, "warning"], ["Email", 5, "success"]].map(([k, v, t]) => (
                <div key={k as string}>
                  <div className="flex justify-between text-xs mb-1"><span>{k}</span><span className="tabular-nums">{v}%</span></div>
                  <ProgressBar value={v as number} color={`var(--color-${t})`} />
                </div>
              ))}
            </div>
          </ChartCard>
          <ChartCard span={8} title="Top Pages">
            <DataTable
              columns={["Path", "Views", "Avg. time", "Bounce", "Conv."]}
              rows={[
                ["/", "84,210", "1m 42s", "38%", "4.8%"],
                ["/pricing", "31,022", "2m 18s", "29%", "9.1%"],
                ["/blog/ai-ops", "22,901", "3m 06s", "24%", "2.1%"],
                ["/docs/api", "18,447", "4m 51s", "18%", "1.2%"],
                ["/changelog", "12,083", "0m 58s", "44%", "0.6%"],
              ]}
            />
          </ChartCard>
          <AIInsights items={[
            { title: "Mobile drop on /pricing", body: "iOS Safari bounce +6pp vs 7d avg — likely CLS regression after deploy 4.18.", tone: "warning", confidence: 91 },
            { title: "Organic surge", body: "Brand queries +24% MoM. Suggest reallocating $12k from paid Search to retargeting.", tone: "success", confidence: 86 },
          ]} />
        </div>
      )}

      {tab === "audience" && (
        <div className={grid}>
          <ChartCard span={8} title="Realtime Visitors by Country" toolbar={<Pill tone="info">1,284 live</Pill>}>
            <WorldMap seed={42} />
          </ChartCard>
          <ChartCard span={4} title="Devices">
            <div className="grid grid-cols-3 gap-2 text-center">
              {[["Desktop", 58, "primary"], ["Mobile", 36, "accent"], ["Tablet", 6, "info"]].map(([k, v, t]) => (
                <div key={k as string}><Donut value={v as number} label={k as string} color={`var(--color-${t})`} size={80} /></div>
              ))}
            </div>
          </ChartCard>
          <ChartCard span={6} title="Segments">
            <DataTable columns={["Segment", "Users", "Sessions", "Conv."]} rows={[
              ["Enterprise · NA", "42,108", "98,201", "6.4%"],
              ["SMB · EU", "31,402", "71,008", "3.2%"],
              ["Free · APAC", "84,419", "118,041", "1.1%"],
              ["Trial · Global", "18,202", "44,210", "8.9%"],
            ]} />
          </ChartCard>
          <ChartCard span={6} title="Retention Cohorts"><Heatmap rows={8} cols={12} seed={17} color="var(--color-primary)" /></ChartCard>
        </div>
      )}

      {tab === "funnels" && (
        <div className={grid}>
          <ChartCard span={8} title="Acquisition → Activation → Revenue">
            <div className="space-y-2.5">
              {[["Visit", 100], ["Signup", 38], ["Activate", 22], ["Subscribe", 9], ["Expand", 4.2]].map(([k, v]) => (
                <div key={k as string}>
                  <div className="flex justify-between text-xs mb-1"><span>{k}</span><span className="tabular-nums">{v}%</span></div>
                  <ProgressBar value={v as number} color="var(--color-primary)" />
                </div>
              ))}
            </div>
          </ChartCard>
          <ChartCard span={4} title="Drop-off Hotspots">
            <ul className="space-y-2 text-xs">
              {[["Signup → Verify", "-42%", "destructive"], ["Onboarding step 3", "-28%", "warning"], ["Plan picker", "-18%", "warning"], ["Checkout", "-9%", "info"]].map(([k, v, t]) => (
                <li key={k as string} className="flex justify-between glass rounded-md px-3 py-2"><span>{k}</span><Pill tone={t as never}>{v}</Pill></li>
              ))}
            </ul>
          </ChartCard>
          <ChartCard span={12} title="Funnel Variants A/B"><Bars seed={9} n={32} height={120} /></ChartCard>
        </div>
      )}

      {tab === "events" && (
        <div className={grid}>
          <ChartCard span={12} title="Engagement Heatmap · Day × Hour"><Heatmap rows={7} cols={24} seed={9} color="var(--color-accent)" /></ChartCard>
          <ChartCard span={12} title="Event Stream">
            <DataTable columns={["Event", "Volume 24h", "Trend", "Owner", "Schema"]} rows={[
              ["page_view", "1.42M", "+9%", "growth", <Pill key="1" tone="success">OK</Pill>],
              ["signup_completed", "1,204", "+12%", "growth", <Pill key="2" tone="success">OK</Pill>],
              ["checkout_started", "812", "+4%", "revenue", <Pill key="3" tone="info">v2</Pill>],
              ["plan_upgraded", "284", "+22%", "revenue", <Pill key="4" tone="success">OK</Pill>],
              ["error_boundary", "42", "+88%", "platform", <Pill key="5" tone="destructive">spike</Pill>],
            ]} />
          </ChartCard>
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Export analytics dataset" size="md"
        footer={<><button className="text-xs px-3 py-1.5 rounded-md border border-border" onClick={() => setOpen(false)}>Cancel</button><button className="text-xs px-3 py-1.5 rounded-md bg-primary text-primary-foreground">Generate</button></>}>
        <p className="text-xs text-muted-foreground">Select range, segments and delivery target. CSV, Parquet, or warehouse sync.</p>
      </Modal>
    </PageShell>
  );
}

/* ============================================================
   2. REPORTING & EXECUTIVE INSIGHTS
   ============================================================ */
type ReportTab = "catalog" | "scheduled" | "subscribers" | "deliveries";
export function Reporting({ d }: { d: DashSpec }) {
  const s = useDashboardState();
  const { tab, setTab } = useTabs<ReportTab>("catalog");
  const [open, setOpen] = useState(false);

  const kpis: Kpi[] = [
    { label: "Reports", value: "412", delta: "+6", tone: "success" },
    { label: "Runs 24h", value: "12,408", delta: "+8%", tone: "success" },
    { label: "Avg render", value: "412ms", delta: "-18ms", tone: "success" },
    { label: "Scheduled", value: "168", delta: "+4" },
    { label: "Subscribers", value: "2,184", delta: "+88" },
    { label: "Failures", value: "3", delta: "-2", tone: "success" },
  ];

  return (
    <PageShell d={d} toolbar={<QuickActions items={[
      { label: "New Report", icon: "Plus", tone: "primary", onClick: () => setOpen(true) },
      { label: "Schedule", icon: "Clock", tone: "info" },
    ]} />}>
      <Kpis items={kpis} />
      <TabBar<ReportTab>
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "catalog", label: "Catalog", icon: "Folder", badge: 412 },
          { id: "scheduled", label: "Scheduled", icon: "Clock", badge: 168 },
          { id: "subscribers", label: "Subscribers", icon: "Users", badge: "2.1k" },
          { id: "deliveries", label: "Deliveries", icon: "Send" },
        ]}
        right={<FilterBar value={s.filter} onChange={s.setFilter} placeholder="Search reports, owners, tags…" />}
      />

      {tab === "catalog" && (
        <div className={grid}>
          <ChartCard span={8} title="Report Catalog">
            <DataTable columns={["Report", "Owner", "Last run", "Cadence", "Status"]} rows={[
              ["Weekly Revenue Recap", "Finance", "12m ago", "Weekly", <Pill key="1" tone="success">OK</Pill>],
              ["Cohort Retention", "Growth", "1h ago", "Daily", <Pill key="2" tone="success">OK</Pill>],
              ["Pipeline Velocity", "RevOps", "3h ago", "Daily", <Pill key="3" tone="warning">Slow</Pill>],
              ["SOC Audit Trail", "Security", "Today", "Daily", <Pill key="4" tone="success">OK</Pill>],
              ["Vendor Spend", "Finance", "Yesterday", "Monthly", <Pill key="5" tone="destructive">Failed</Pill>],
              ["Marketing Attribution", "Marketing", "6h ago", "Weekly", <Pill key="6" tone="success">OK</Pill>],
            ]} />
          </ChartCard>
          <ChartCard span={4} title="Avg Render"><Bars seed={6} n={24} height={120} /></ChartCard>
        </div>
      )}

      {tab === "scheduled" && (
        <div className={grid}>
          <ChartCard span={8} title="Scheduled Reports">
            <DataTable columns={["Report", "Next run", "Recipients", "Channel"]} rows={[
              ["Weekly Revenue Recap", "Mon 08:00", "12", "Email"],
              ["Pipeline Velocity", "Daily 09:00", "8", "Slack"],
              ["SOC Audit", "Daily 08:15", "4", "Email"],
              ["Board Pack", "1st of month", "9", "PDF"],
            ]} />
          </ChartCard>
          <ChartCard span={4} title="On-time"><Donut value={87} label="on-time" color="var(--color-success)" /></ChartCard>
        </div>
      )}

      {tab === "subscribers" && (
        <div className={grid}>
          <ChartCard span={12} title="Top Subscribers">
            <DataTable columns={["Person", "Reports", "Channels", "Last opened"]} rows={[
              ["L. Park (CEO)", "24", "Email · Slack", "2h ago"],
              ["M. Suri (CFO)", "18", "Email · PDF", "1d ago"],
              ["D. Reyes (CRO)", "12", "Slack", "5h ago"],
              ["A. Khan (CPO)", "9", "Email", "yesterday"],
            ]} />
          </ChartCard>
        </div>
      )}

      {tab === "deliveries" && (
        <div className={grid}>
          <ChartCard span={6} title="Delivery Timeline">
            <Timeline items={[
              { time: "08:00", title: "Weekly revenue → exec@", tone: "success" },
              { time: "08:15", title: "SOC audit → sec-team@", tone: "success" },
              { time: "09:00", title: "Pipeline velocity → revops@", tone: "warning" },
              { time: "10:30", title: "Vendor spend retry", tone: "destructive" },
              { time: "11:00", title: "Marketing attribution → mkt@", tone: "success" },
            ]} />
          </ChartCard>
          <ChartCard span={6} title="Delivery Failures">
            <DataTable columns={["Report", "When", "Reason"]} rows={[
              ["Vendor Spend", "10:30", "SMTP timeout"],
              ["Q1 Recap", "Yesterday", "Recipient unreachable"],
            ]} />
          </ChartCard>
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Create new report" size="md"
        footer={<><button className="text-xs px-3 py-1.5 rounded-md border border-border" onClick={() => setOpen(false)}>Cancel</button><button className="text-xs px-3 py-1.5 rounded-md bg-primary text-primary-foreground">Create</button></>}>
        <p className="text-xs text-muted-foreground">Choose a template or build from scratch. Reports can run on schedule and deliver to email, Slack, or webhook.</p>
      </Modal>
    </PageShell>
  );
}

/* ============================================================
   3. SEO & GROWTH INTELLIGENCE
   ============================================================ */
type SeoTab = "overview" | "keywords" | "backlinks" | "audit";
export function SEO({ d }: { d: DashSpec }) {
  const s = useDashboardState();
  const { tab, setTab } = useTabs<SeoTab>("overview");
  const [open, setOpen] = useState(false);

  const kpis: Kpi[] = [
    { label: "Organic clicks", value: "412k", delta: "+18%", tone: "success" },
    { label: "Impressions", value: "8.4M", delta: "+12%", tone: "success" },
    { label: "Keywords #1-10", value: "1,284", delta: "+88" },
    { label: "Avg position", value: "12.4", delta: "-1.8", tone: "success" },
    { label: "Backlinks", value: "28,901", delta: "+412" },
    { label: "DA", value: "68", delta: "+2", tone: "success" },
  ];

  return (
    <PageShell d={d} toolbar={<DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive} extra={<button onClick={() => setOpen(true)} className="text-[11px] px-2.5 py-1 rounded-md bg-primary text-primary-foreground">Run Audit</button>} />}>
      <Kpis items={kpis} />
      <TabBar<SeoTab>
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "overview", label: "Overview", icon: "Gauge" },
          { id: "keywords", label: "Keywords", icon: "Search", badge: "4.2k" },
          { id: "backlinks", label: "Backlinks", icon: "Link2", badge: "28.9k" },
          { id: "audit", label: "Audit", icon: "ShieldAlert", badge: 18 },
        ]}
        right={<FilterBar value={s.filter} onChange={s.setFilter} placeholder="Keywords, URLs, competitors…" />}
      />

      {tab === "overview" && (
        <div className={grid}>
          <ChartCard span={8} title="Organic Traffic · Impressions vs Clicks"><LineSeries seed={21} lines={2} height={220} /></ChartCard>
          <ChartCard span={4} title="Core Web Vitals">
            <div className="grid grid-cols-3 gap-3 text-center">
              {[["LCP", 82, "success"], ["INP", 71, "warning"], ["CLS", 94, "success"]].map(([k, v, t]) => (
                <div key={k as string}><Donut value={v as number} label={k as string} color={`var(--color-${t})`} size={86} /></div>
              ))}
            </div>
          </ChartCard>
          <ChartCard span={12} title="Crawl Issues · Weekly"><Heatmap rows={6} cols={24} seed={14} color="var(--color-warning)" /></ChartCard>
          <AIInsights items={[
            { title: "Cannibalization risk", body: "/platform and /product-platform target same intent — consolidate via 301.", tone: "warning", confidence: 88 },
            { title: "Quick win", body: "12 pages ranking #11-15 with high CTR potential. Refresh meta + FAQ schema.", tone: "success", confidence: 92 },
          ]} />
        </div>
      )}

      {tab === "keywords" && (
        <div className={grid}>
          <ChartCard span={12} title="Keyword Rankings">
            <DataTable columns={["Keyword", "Pos.", "Δ", "Volume", "Difficulty", "URL"]} rows={[
              ["ai ops platform", "3", <span key="1" className="text-success">+2</span>, "12.4k", "62", "/platform"],
              ["enterprise observability", "7", <span key="2" className="text-success">+4</span>, "8.1k", "58", "/observability"],
              ["data lake governance", "11", <span key="3" className="text-destructive">-3</span>, "4.9k", "47", "/governance"],
              ["devops dashboards", "5", <span key="4" className="text-success">+1</span>, "6.2k", "52", "/devops"],
              ["realtime analytics", "14", "—", "9.8k", "64", "/analytics"],
              ["incident response tool", "9", <span key="5" className="text-success">+5</span>, "5.1k", "49", "/incidents"],
              ["sso for enterprise", "21", <span key="6" className="text-destructive">-2</span>, "3.4k", "44", "/sso"],
            ]} />
          </ChartCard>
        </div>
      )}

      {tab === "backlinks" && (
        <div className={grid}>
          <ChartCard span={5} title="Backlink Profile">
            <div className="space-y-3">
              <div className="flex justify-between text-xs"><span>Referring domains</span><span className="tabular-nums">4,218</span></div>
              <ProgressBar value={72} color="var(--color-primary)" />
              <div className="flex justify-between text-xs"><span>DoFollow links</span><span className="tabular-nums">28,901</span></div>
              <ProgressBar value={61} color="var(--color-accent)" />
              <div className="flex justify-between text-xs"><span>Toxic score</span><span className="tabular-nums text-warning">12%</span></div>
              <ProgressBar value={12} color="var(--color-warning)" />
              <div className="flex justify-between text-xs"><span>Domain authority</span><span className="tabular-nums">68</span></div>
              <ProgressBar value={68} color="var(--color-success)" />
            </div>
          </ChartCard>
          <ChartCard span={7} title="Top Referring Domains">
            <DataTable columns={["Domain", "DA", "Links", "First seen"]} rows={[
              ["techcrunch.com", "94", "12", "Apr 2024"],
              ["theverge.com", "92", "8", "Jan 2024"],
              ["news.ycombinator.com", "90", "42", "2022"],
              ["producthunt.com", "89", "6", "Mar 2024"],
              ["github.com", "97", "184", "2021"],
            ]} />
          </ChartCard>
        </div>
      )}

      {tab === "audit" && (
        <div className={grid}>
          <ChartCard span={12} title="On-Page Audit Queue">
            <Kanban columns={[
              { title: "Detected", tone: "warning", items: [
                { title: "Missing meta description", meta: "12 URLs", tag: "SEO" },
                { title: "Duplicate H1", meta: "5 URLs", tag: "Content" },
                { title: "Slow LCP", meta: "8 URLs", tag: "Perf" },
              ] },
              { title: "In review", tone: "info", items: [
                { title: "Schema missing on /blog", meta: "Owner: SEO" },
                { title: "Broken internal links", meta: "3 URLs" },
              ] },
              { title: "Fixed", tone: "success", items: [
                { title: "Redirect chains cleared", meta: "+12 pages", tag: "Tech" },
                { title: "Image alt text added", meta: "84 imgs" },
              ] },
            ]} />
          </ChartCard>
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Run full site audit" size="lg"
        footer={<><button className="text-xs px-3 py-1.5 rounded-md border border-border" onClick={() => setOpen(false)}>Cancel</button><button className="text-xs px-3 py-1.5 rounded-md bg-primary text-primary-foreground">Start crawl</button></>}>
        <Terminal lines={[
          { t: "▸ seo-crawler v4.2 ready", tone: "info" },
          { t: "▸ target: https://vala.app · sitemap.xml detected (4,218 urls)", tone: "muted" },
          { t: "▸ concurrency=8 · respect-robots=true · render=js", tone: "muted" },
          { t: "▸ queueing initial frontier…", tone: "success" },
        ]} />
      </Modal>
    </PageShell>
  );
}

/* ============================================================
   4. MARKETING & CAMPAIGN CENTER
   ============================================================ */
type MktTab = "campaigns" | "channels" | "experiments" | "calendar";
export function Marketing({ d }: { d: DashSpec }) {
  const s = useDashboardState();
  const { tab, setTab } = useTabs<MktTab>("campaigns");
  const [open, setOpen] = useState(false);

  const kpis: Kpi[] = [
    { label: "MQLs 30d", value: "8,412", delta: "+18%", tone: "success" },
    { label: "SQLs 30d", value: "1,284", delta: "+12%", tone: "success" },
    { label: "CAC", value: "$142", delta: "-$8", tone: "success" },
    { label: "Spend MTD", value: "$184k", delta: "+6%" },
    { label: "ROAS", value: "4.2x", delta: "+0.3", tone: "success" },
    { label: "Active", value: "24", delta: "+3" },
  ];

  return (
    <PageShell d={d} toolbar={<QuickActions items={[
      { label: "New Campaign", icon: "Megaphone", tone: "primary", onClick: () => setOpen(true) },
      { label: "A/B Test", icon: "Split", tone: "accent" },
    ]} />}>
      <Kpis items={kpis} />
      <TabBar<MktTab>
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "campaigns", label: "Campaigns", icon: "Megaphone", badge: 24 },
          { id: "channels", label: "Channels", icon: "Radio" },
          { id: "experiments", label: "Experiments", icon: "FlaskConical", badge: 8 },
          { id: "calendar", label: "Calendar", icon: "CalendarDays" },
        ]}
        right={<FilterBar value={s.filter} onChange={s.setFilter} placeholder="Campaigns, segments, journeys…" />}
      />

      {tab === "campaigns" && (
        <div className={grid}>
          <ChartCard span={8} title="MQL · SQL · Closed Won"><LineSeries seed={51} lines={3} height={220} /></ChartCard>
          <ChartCard span={4} title="Funnel">
            <div className="space-y-2.5">
              {[["Reach", 100], ["Click", 32], ["MQL", 18], ["SQL", 6], ["Won", 1.4]].map(([k, v]) => (
                <div key={k as string}>
                  <div className="flex justify-between text-xs mb-1"><span>{k}</span><span className="tabular-nums">{v}%</span></div>
                  <ProgressBar value={v as number} color="var(--color-primary)" />
                </div>
              ))}
            </div>
          </ChartCard>
          <ChartCard span={12} title="Active Campaigns">
            <DataTable columns={["Campaign", "Channel", "Spend", "Conv.", "CAC", "Status"]} rows={[
              ["Q2 Brand Lift", "Multi", "$84k", "1,204", "$69", <Pill key="1" tone="success">Live</Pill>],
              ["Pricing Refresh", "Search", "$22k", "418", "$52", <Pill key="2" tone="success">Live</Pill>],
              ["Webinar Series", "Email", "$6k", "612", "$9.8", <Pill key="3" tone="info">Drip</Pill>],
              ["ABM · Top 50", "LinkedIn", "$31k", "89", "$348", <Pill key="4" tone="warning">Tuning</Pill>],
              ["Retargeting · EU", "Display", "$14k", "284", "$49", <Pill key="5" tone="success">Live</Pill>],
              ["Launch teaser", "Social", "$9k", "1,084", "$8.3", <Pill key="6" tone="info">Scheduled</Pill>],
            ]} />
          </ChartCard>
        </div>
      )}

      {tab === "channels" && (
        <div className={grid}>
          <ChartCard span={6} title="Channel ROAS">
            <div className="space-y-3">
              {[["Search", 4.2], ["Social", 3.1], ["Email", 6.8], ["Display", 1.7], ["Affiliate", 2.4], ["Podcast", 2.9]].map(([k, v]) => (
                <div key={k as string}>
                  <div className="flex justify-between text-xs mb-1"><span>{k}</span><span className="tabular-nums">{v}x</span></div>
                  <ProgressBar value={Math.min(100, (v as number) * 14)} color="var(--color-primary)" />
                </div>
              ))}
            </div>
          </ChartCard>
          <ChartCard span={6} title="Spend Mix"><Donut value={64} label="paid" /></ChartCard>
          <ChartCard span={12} title="Attribution by Channel"><Bars seed={31} n={32} height={120} /></ChartCard>
        </div>
      )}

      {tab === "experiments" && (
        <div className={grid}>
          <ChartCard span={12} title="A/B Experiments">
            <DataTable columns={["Test", "Hypothesis", "Lift", "Confidence", "Status"]} rows={[
              ["Pricing hero CTA", "Bold button > outline", <span key="1" className="text-success">+12.4%</span>, "98%", <Pill key="2" tone="success">Ship</Pill>],
              ["Onboarding step 2 copy", "Personalize > generic", <span key="3" className="text-success">+3.1%</span>, "92%", <Pill key="4" tone="success">Ship</Pill>],
              ["Email subject lines", "Question > statement", <span key="5" className="text-destructive">-1.2%</span>, "76%", <Pill key="6" tone="destructive">Kill</Pill>],
              ["Sticky nav variant", "Sticky improves engagement", <span key="7">0.0%</span>, "54%", <Pill key="8" tone="muted">Inconclusive</Pill>],
              ["Pricing card highlight", "Glow on recommended tier", <span key="9" className="text-success">+8.7%</span>, "94%", <Pill key="10" tone="info">Running</Pill>],
            ]} />
          </ChartCard>
          <AIInsights items={[
            { title: "Reallocate budget", body: "Email ROAS 6.8x vs Display 1.7x — shift $18k for projected +$74k pipeline.", tone: "success", confidence: 89 },
            { title: "Creative fatigue", body: "Q2 Brand Lift CTR down 22% week-over-week. Refresh top 3 ads.", tone: "warning", confidence: 81 },
          ]} />
        </div>
      )}

      {tab === "calendar" && (
        <div className={grid}>
          <ChartCard span={12} title="Campaign Calendar">
            <Kanban columns={[
              { title: "This week", tone: "warning", items: [
                { title: "Pricing Refresh launch", meta: "Tue", tag: "Search" },
                { title: "Webinar invite blast", meta: "Wed", tag: "Email" },
              ] },
              { title: "Next week", tone: "info", items: [
                { title: "Q2 Brand Lift wave 3", meta: "Mon", tag: "Multi" },
                { title: "ABM rollout phase 2", meta: "Thu", tag: "LinkedIn" },
              ] },
              { title: "This month", tone: "success", items: [
                { title: "Customer story · Acme", meta: "Late", tag: "Content" },
                { title: "Launch teaser drop", meta: "EOM", tag: "Social" },
              ] },
            ]} />
          </ChartCard>
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="New campaign" size="md"
        footer={<><button className="text-xs px-3 py-1.5 rounded-md border border-border" onClick={() => setOpen(false)}>Cancel</button><button className="text-xs px-3 py-1.5 rounded-md bg-primary text-primary-foreground">Create draft</button></>}>
        <p className="text-xs text-muted-foreground">Configure channel, budget, audience, and creative. Drafts route through marketing review before activation.</p>
      </Modal>
    </PageShell>
  );
}

/* ============================================================
   5. SOCIAL REPUTATION & LISTENING
   ============================================================ */
type SocTab = "feed" | "posts" | "calendar" | "sentiment";
export function Social({ d }: { d: DashSpec }) {
  const s = useDashboardState();
  const { tab, setTab } = useTabs<SocTab>("feed");
  const [open, setOpen] = useState(false);

  const mentions = useMemo(() => [
    { who: "@AcmeCorp", what: "Loving the new dashboard — finally an enterprise UI that doesn't feel like 2014.", channel: "X", t: "2m", tone: "success" as const },
    { who: "@dev_meera", what: "Anyone else seeing a render bug on /pricing in Safari?", channel: "X", t: "12m", tone: "warning" as const },
    { who: "Hacker News", what: "Show HN: enterprise OS dashboards — 75 modules", channel: "HN", t: "1h", tone: "info" as const },
    { who: "r/devops", what: "Vala AI's incident automation cut our MTTR by 40%.", channel: "Reddit", t: "3h", tone: "success" as const },
    { who: "@growth_priya", what: "Support reply was 14 min on a Sunday — kudos.", channel: "X", t: "5h", tone: "success" as const },
  ], []);

  const kpis: Kpi[] = [
    { label: "Reach 30d", value: "1.42M", delta: "+18%", tone: "success" },
    { label: "Engagement", value: "6.4%", delta: "+0.9pp", tone: "success" },
    { label: "Mentions", value: "4,218", delta: "+12%" },
    { label: "Sentiment", value: "+0.64", delta: "+0.08", tone: "success" },
    { label: "Followers", value: "184k", delta: "+1.2k" },
    { label: "Share of Voice", value: "22%", delta: "+3pp", tone: "success" },
  ];

  return (
    <PageShell d={d} toolbar={<DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive} extra={<button onClick={() => setOpen(true)} className="text-[11px] px-2.5 py-1 rounded-md bg-primary text-primary-foreground">New Post</button>} />}>
      <Kpis items={kpis} />
      <TabBar<SocTab>
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "feed", label: "Listening Feed", icon: "Rss", badge: mentions.length },
          { id: "posts", label: "Top Posts", icon: "Star" },
          { id: "calendar", label: "Calendar", icon: "CalendarDays" },
          { id: "sentiment", label: "Sentiment", icon: "Heart" },
        ]}
        right={<FilterBar value={s.filter} onChange={s.setFilter} placeholder="Posts, channels, hashtags…" />}
      />

      {tab === "feed" && (
        <div className={grid}>
          <ChartCard span={8} title="Realtime Mentions" toolbar={<Pill tone="info">live</Pill>}>
            <ul className="divide-y divide-border">
              {mentions.filter(m => !s.filter || m.what.toLowerCase().includes(s.filter.toLowerCase())).map((m, i) => (
                <li key={i} className="py-2 flex items-start gap-3">
                  <span className={`mt-1 w-1.5 h-1.5 rounded-full bg-${m.tone}`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-medium">{m.who}</span>
                      <span className="text-muted-foreground">· {m.channel} · {m.t}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{m.what}</p>
                  </div>
                  <Pill tone={m.tone}>{m.tone}</Pill>
                </li>
              ))}
              {!mentions.length && <EmptyState icon="Inbox" title="No mentions yet" hint="Realtime listening will populate here." />}
            </ul>
          </ChartCard>
          <ChartCard span={4} title="Channel Mix"><Donut value={64} label="positive" /></ChartCard>
        </div>
      )}

      {tab === "posts" && (
        <div className={grid}>
          <ChartCard span={12} title="Top Posts">
            <DataTable columns={["Post", "Channel", "Reach", "Eng.", "Sentiment"]} rows={[
              ["Launching v5 ✨", "LinkedIn", "412k", "8.2%", <Pill key="1" tone="success">+0.74</Pill>],
              ["Behind the scenes", "Instagram", "318k", "6.9%", <Pill key="2" tone="success">+0.61</Pill>],
              ["AMA recap", "X", "204k", "4.1%", <Pill key="3" tone="info">+0.32</Pill>],
              ["Hiring thread", "X", "89k", "3.4%", <Pill key="4" tone="warning">-0.12</Pill>],
              ["Customer story · Acme", "YouTube", "62k", "5.8%", <Pill key="5" tone="success">+0.58</Pill>],
            ]} />
          </ChartCard>
        </div>
      )}

      {tab === "calendar" && (
        <div className={grid}>
          <ChartCard span={12} title="Content Calendar">
            <Kanban columns={[
              { title: "Drafting", tone: "warning", items: [{ title: "Customer story · Acme", meta: "Fri", tag: "Case" }, { title: "Founder note", meta: "Sat", tag: "X" }] },
              { title: "Scheduled", tone: "info", items: [{ title: "Release notes thread", meta: "Mon 09:00", tag: "X" }, { title: "Launch teaser", meta: "Tue", tag: "IG" }] },
              { title: "Posted", tone: "success", items: [{ title: "Product walkthrough", meta: "Yesterday", tag: "YT" }, { title: "Behind the scenes", meta: "2d", tag: "IG" }] },
            ]} />
          </ChartCard>
        </div>
      )}

      {tab === "sentiment" && (
        <div className={grid}>
          <ChartCard span={12} title="Sentiment by Day · Hour"><Heatmap rows={7} cols={24} seed={22} color="var(--color-accent)" /></ChartCard>
          <ChartCard span={6} title="Sentiment Trend"><LineSeries seed={33} lines={2} height={180} /></ChartCard>
          <ChartCard span={6} title="Top Themes">
            <ul className="space-y-2 text-xs">
              {[["Product quality", "+0.71", "success"], ["Pricing", "+0.18", "info"], ["Support speed", "+0.42", "success"], ["Onboarding", "-0.08", "warning"]].map(([k, v, t]) => (
                <li key={k as string} className="flex justify-between glass rounded-md px-3 py-2"><span>{k}</span><Pill tone={t as never}>{v}</Pill></li>
              ))}
            </ul>
          </ChartCard>
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Compose post" size="md"
        footer={<><button className="text-xs px-3 py-1.5 rounded-md border border-border" onClick={() => setOpen(false)}>Cancel</button><button className="text-xs px-3 py-1.5 rounded-md bg-primary text-primary-foreground">Schedule</button></>}>
        <textarea className="w-full bg-muted text-xs rounded-md p-3 border border-border outline-none focus:border-primary min-h-[120px]" placeholder="What's new?" />
      </Modal>
    </PageShell>
  );
}
