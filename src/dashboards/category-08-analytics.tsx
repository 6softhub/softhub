import { useState } from "react";
import type { DashSpec } from "@/data/dashboards";
import { Shell, Card, Pill, Spark, Bars, Donut, Heatmap, WorldMap, DataTable, Kanban, Timeline, ProgressBar, LineSeries, Avatar, Terminal } from "./_primitives";
import { ChartCard, AIInsights, DashboardToolbar, FilterBar, QuickActions, Modal, useDashboardState, EmptyState } from "./_universal";

/* ============================================================
   GROUP 08 — ANALYTICS + SEO
   Premium dashboards: Analytics, Reporting, SEO, Social,
   Marketing, MarketIntel, DataLake, Governance.
   ============================================================ */

function useShellState() {
  return useDashboardState("24h");
}

/* ---------------- ANALYTICS ---------------- */
export function AnalyticsPremium({ d }: { d: DashSpec }) {
  const s = useShellState();
  const [open, setOpen] = useState(false);
  return (
    <Shell d={d}>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <FilterBar value={s.filter} onChange={s.setFilter} placeholder="Filter events, segments, properties…" />
        <DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive} />
      </div>

      <div className="grid grid-cols-12 gap-4">
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

        <ChartCard span={6} title="Realtime Visitors by Country" toolbar={<Pill tone="info">1,284 live</Pill>}>
          <WorldMap seed={42} />
        </ChartCard>
        <ChartCard span={6} title="Funnel · Acquisition → Activation → Revenue">
          <div className="space-y-2.5">
            {[["Visit", 100], ["Signup", 38], ["Activate", 22], ["Subscribe", 9], ["Expand", 4.2]].map(([k, v]) => (
              <div key={k as string}>
                <div className="flex justify-between text-xs mb-1"><span>{k}</span><span className="tabular-nums">{v}%</span></div>
                <ProgressBar value={v as number} color="var(--color-primary)" />
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard span={12} title="Engagement Heatmap · Day × Hour">
          <Heatmap rows={7} cols={24} seed={9} color="var(--color-accent)" />
        </ChartCard>

        <ChartCard span={8} title="Top Pages" toolbar={<button onClick={() => setOpen(true)} className="text-xs text-primary hover:underline">Export CSV</button>}>
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
          { title: "Mobile drop in /pricing", body: "Bounce on iOS Safari rose 6pp vs 7d avg — likely render shift after deploy 4.18.", tone: "warning", confidence: 91 },
          { title: "Organic surge", body: "Brand queries +24% MoM. Reallocate $12k from paid Search to retargeting.", tone: "success", confidence: 86 },
        ]} />
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Export analytics dataset" size="md"
        footer={<><button className="text-xs px-3 py-1.5 rounded-md border border-border" onClick={() => setOpen(false)}>Cancel</button><button className="text-xs px-3 py-1.5 rounded-md bg-primary text-primary-foreground">Generate</button></>}>
        <p className="text-xs text-muted-foreground">Select range, segments and delivery target.</p>
      </Modal>
    </Shell>
  );
}

/* ---------------- REPORTING ---------------- */
export function ReportingPremium({ d }: { d: DashSpec }) {
  const s = useShellState();
  return (
    <Shell d={d}>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <FilterBar value={s.filter} onChange={s.setFilter} placeholder="Search reports, owners, tags…" />
        <QuickActions items={[
          { label: "New Report", icon: "Plus", tone: "primary" },
          { label: "Schedule", icon: "Clock", tone: "info" },
          { label: "Subscribe", icon: "Bell", tone: "accent" },
        ]} />
      </div>

      <div className="grid grid-cols-12 gap-4">
        <ChartCard span={4} title="Reports Run · 24h"><Spark seed={4} height={56} /><div className="text-2xl font-semibold mt-2">12,408</div></ChartCard>
        <ChartCard span={4} title="Avg Render"><Bars seed={6} n={24} height={56} /><div className="text-2xl font-semibold mt-2">412ms</div></ChartCard>
        <ChartCard span={4} title="Scheduled Deliveries"><Donut value={87} label="on-time" /></ChartCard>

        <ChartCard span={8} title="Report Catalog">
          <DataTable
            columns={["Report", "Owner", "Last run", "Cadence", "Status"]}
            rows={[
              ["Weekly Revenue Recap", "Finance", "12m ago", "Weekly", <Pill tone="success">OK</Pill>],
              ["Cohort Retention", "Growth", "1h ago", "Daily", <Pill tone="success">OK</Pill>],
              ["Pipeline Velocity", "RevOps", "3h ago", "Daily", <Pill tone="warning">Slow</Pill>],
              ["SOC Audit Trail", "Security", "Today", "Daily", <Pill tone="success">OK</Pill>],
              ["Vendor Spend", "Finance", "Yesterday", "Monthly", <Pill tone="destructive">Failed</Pill>],
            ]}
          />
        </ChartCard>
        <ChartCard span={4} title="Delivery Timeline">
          <Timeline items={[
            { time: "08:00", title: "Weekly revenue → exec@", tone: "success" },
            { time: "08:15", title: "SOC audit → sec-team@", tone: "success" },
            { time: "09:00", title: "Pipeline velocity → revops@", tone: "warning" },
            { time: "10:30", title: "Vendor spend retry", tone: "destructive" },
          ]} />
        </ChartCard>
      </div>
    </Shell>
  );
}

/* ---------------- SEO ---------------- */
export function SEOPremium({ d }: { d: DashSpec }) {
  const s = useShellState();
  const [open, setOpen] = useState(false);
  return (
    <Shell d={d}>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <FilterBar value={s.filter} onChange={s.setFilter} placeholder="Keywords, URLs, competitors…" actions={
          <button onClick={() => setOpen(true)} className="text-[11px] px-2.5 py-1 rounded-md bg-primary text-primary-foreground">Run Audit</button>
        } />
        <DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive} />
      </div>

      <div className="grid grid-cols-12 gap-4">
        <ChartCard span={8} title="Organic Traffic · Impressions vs Clicks">
          <LineSeries seed={21} lines={2} height={200} />
        </ChartCard>
        <ChartCard span={4} title="Core Web Vitals">
          <div className="grid grid-cols-3 gap-3 text-center">
            {[["LCP", 82, "success"], ["INP", 71, "warning"], ["CLS", 94, "success"]].map(([k, v, t]) => (
              <div key={k as string}><Donut value={v as number} label={k as string} color={`var(--color-${t})`} size={86} /></div>
            ))}
          </div>
        </ChartCard>

        <ChartCard span={7} title="Keyword Rankings">
          <DataTable
            columns={["Keyword", "Pos.", "Δ", "Volume", "Difficulty", "URL"]}
            rows={[
              ["ai ops platform", "3", <span className="text-success">+2</span>, "12.4k", "62", "/platform"],
              ["enterprise observability", "7", <span className="text-success">+4</span>, "8.1k", "58", "/observability"],
              ["data lake governance", "11", <span className="text-destructive">-3</span>, "4.9k", "47", "/governance"],
              ["devops dashboards", "5", <span className="text-success">+1</span>, "6.2k", "52", "/devops"],
              ["realtime analytics", "14", "—", "9.8k", "64", "/analytics"],
            ]}
          />
        </ChartCard>
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

        <ChartCard span={12} title="Crawl Issues · Weekly"><Heatmap rows={6} cols={24} seed={14} color="var(--color-warning)" /></ChartCard>

        <ChartCard span={8} title="On-Page Audit Queue">
          <Kanban columns={[
            { title: "Detected", tone: "warning", items: [{ title: "Missing meta description", meta: "12 URLs", tag: "SEO" }, { title: "Duplicate H1", meta: "5 URLs", tag: "Content" }] },
            { title: "In review", tone: "info", items: [{ title: "Schema missing on /blog", meta: "Owner: SEO" }] },
            { title: "Fixed", tone: "success", items: [{ title: "Redirect chains cleared", meta: "+12 pages", tag: "Tech" }] },
          ]} />
        </ChartCard>
        <AIInsights items={[
          { title: "Cannibalization risk", body: "/platform and /product-platform target same intent — consolidate via 301.", tone: "warning", confidence: 88 },
          { title: "Quick win", body: "12 pages ranking #11-15 with high CTR potential. Refresh meta + FAQ schema.", tone: "success", confidence: 92 },
        ]} />
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Run full site audit" size="lg"
        footer={<><button className="text-xs px-3 py-1.5 rounded-md border border-border" onClick={() => setOpen(false)}>Cancel</button><button className="text-xs px-3 py-1.5 rounded-md bg-primary text-primary-foreground">Start crawl</button></>}>
        <Terminal lines={[
          { t: "▸ seo-crawler v4.2 ready", tone: "info" },
          { t: "▸ target: https://vala.app · sitemap.xml detected (4,218 urls)", tone: "muted" },
          { t: "▸ concurrency=8 · respect-robots=true · render=js", tone: "muted" },
          { t: "▸ queueing initial frontier…", tone: "success" },
        ]} />
      </Modal>
    </Shell>
  );
}

/* ---------------- SOCIAL ---------------- */
export function SocialPremium({ d }: { d: DashSpec }) {
  const s = useShellState();
  return (
    <Shell d={d}>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <FilterBar value={s.filter} onChange={s.setFilter} placeholder="Posts, channels, hashtags…" />
        <DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive} />
      </div>
      <div className="grid grid-cols-12 gap-4">
        <ChartCard span={8} title="Reach · Engagement · Shares"><LineSeries seed={33} lines={3} height={200} /></ChartCard>
        <ChartCard span={4} title="Channel Mix"><Donut value={64} label="positive" /></ChartCard>

        <ChartCard span={6} title="Top Posts">
          <DataTable
            columns={["Post", "Channel", "Reach", "Eng.", "Sentiment"]}
            rows={[
              ["Launching v5 ✨", "LinkedIn", "412k", "8.2%", <Pill tone="success">+0.74</Pill>],
              ["Behind the scenes", "Instagram", "318k", "6.9%", <Pill tone="success">+0.61</Pill>],
              ["AMA recap", "X", "204k", "4.1%", <Pill tone="info">+0.32</Pill>],
              ["Hiring thread", "X", "89k", "3.4%", <Pill tone="warning">-0.12</Pill>],
            ]}
          />
        </ChartCard>
        <ChartCard span={6} title="Content Calendar">
          <Kanban columns={[
            { title: "Drafting", tone: "warning", items: [{ title: "Customer story · Acme", meta: "Fri", tag: "Case" }] },
            { title: "Scheduled", tone: "info", items: [{ title: "Release notes thread", meta: "Mon 09:00", tag: "X" }, { title: "Launch teaser", meta: "Tue", tag: "IG" }] },
            { title: "Posted", tone: "success", items: [{ title: "Product walkthrough", meta: "Yesterday", tag: "YT" }] },
          ]} />
        </ChartCard>

        <ChartCard span={12} title="Posting Heatmap · Engagement"><Heatmap rows={7} cols={24} seed={22} color="var(--color-accent)" /></ChartCard>
      </div>
    </Shell>
  );
}

/* ---------------- MARKETING ---------------- */
export function MarketingPremium({ d }: { d: DashSpec }) {
  const s = useShellState();
  return (
    <Shell d={d}>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <FilterBar value={s.filter} onChange={s.setFilter} placeholder="Campaigns, segments, journeys…" />
        <QuickActions items={[
          { label: "New Campaign", icon: "Megaphone", tone: "primary" },
          { label: "A/B Test", icon: "Split", tone: "accent" },
        ]} />
      </div>
      <div className="grid grid-cols-12 gap-4">
        <ChartCard span={8} title="MQL · SQL · Closed Won"><LineSeries seed={51} lines={3} height={200} /></ChartCard>
        <ChartCard span={4} title="Channel ROAS">
          <div className="space-y-3">
            {[["Search", 4.2], ["Social", 3.1], ["Email", 6.8], ["Display", 1.7]].map(([k, v]) => (
              <div key={k as string}>
                <div className="flex justify-between text-xs mb-1"><span>{k}</span><span className="tabular-nums">{v}x</span></div>
                <ProgressBar value={Math.min(100, (v as number) * 14)} color="var(--color-primary)" />
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard span={7} title="Active Campaigns">
          <DataTable
            columns={["Campaign", "Channel", "Spend", "Conv.", "CAC", "Status"]}
            rows={[
              ["Q2 Brand Lift", "Multi", "$84k", "1,204", "$69", <Pill tone="success">Live</Pill>],
              ["Pricing Refresh", "Search", "$22k", "418", "$52", <Pill tone="success">Live</Pill>],
              ["Webinar Series", "Email", "$6k", "612", "$9.8", <Pill tone="info">Drip</Pill>],
              ["ABM · Top 50", "LinkedIn", "$31k", "89", "$348", <Pill tone="warning">Tuning</Pill>],
            ]}
          />
        </ChartCard>
        <ChartCard span={5} title="A/B Experiments">
          <ul className="space-y-2 text-xs">
            {[
              ["Pricing hero CTA", "+12.4%", "success"],
              ["Onboarding step 2 copy", "+3.1%", "success"],
              ["Email subject lines", "-1.2%", "destructive"],
              ["Sticky nav variant", "+0.0%", "muted"],
            ].map(([k, v, t]) => (
              <li key={k as string} className="flex justify-between glass rounded-md px-3 py-2">
                <span>{k}</span>
                <Pill tone={t as "success" | "destructive" | "muted"}>{v}</Pill>
              </li>
            ))}
          </ul>
        </ChartCard>

        <AIInsights items={[
          { title: "Reallocate budget", body: "Email ROAS 6.8x vs Display 1.7x — shift $18k for projected +$74k pipeline.", tone: "success", confidence: 89 },
          { title: "Creative fatigue", body: "Q2 Brand Lift CTR down 22% week-over-week. Refresh top 3 ads.", tone: "warning", confidence: 81 },
        ]} />
      </div>
    </Shell>
  );
}

/* ---------------- MARKET INTEL ---------------- */
export function MarketIntelPremium({ d }: { d: DashSpec }) {
  const s = useShellState();
  return (
    <Shell d={d}>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <FilterBar value={s.filter} onChange={s.setFilter} placeholder="Competitors, signals, segments…" />
        <DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive} />
      </div>
      <div className="grid grid-cols-12 gap-4">
        <ChartCard span={8} title="Share of Voice · 12 weeks"><LineSeries seed={61} lines={4} height={200} /></ChartCard>
        <ChartCard span={4} title="Win/Loss"><Donut value={58} label="win rate" color="var(--color-success)" /></ChartCard>

        <ChartCard span={6} title="Competitor Watch">
          <DataTable
            columns={["Vendor", "SoV", "Pricing", "Hiring", "Signal"]}
            rows={[
              ["Acme AI", "22%", "↑ 8%", "+24", <Pill tone="warning">Aggressive</Pill>],
              ["Nimbus", "17%", "—", "+6", <Pill tone="info">Steady</Pill>],
              ["Helix", "13%", "↓ 4%", "-9", <Pill tone="destructive">Stalling</Pill>],
              ["Forge", "9%", "↑ 2%", "+12", <Pill tone="info">Growing</Pill>],
            ]}
          />
        </ChartCard>
        <ChartCard span={6} title="Recent Signals">
          <Timeline items={[
            { time: "2h", title: "Acme launched usage-based pricing", tone: "warning" },
            { time: "1d", title: "Nimbus raised Series D ($120M)", tone: "info" },
            { time: "3d", title: "Helix laid off 12% of GTM", tone: "destructive" },
            { time: "1w", title: "Forge integrated with Snowflake", tone: "success" },
          ]} />
        </ChartCard>
      </div>
    </Shell>
  );
}

/* ---------------- DATA LAKE ---------------- */
export function DataLakePremium({ d }: { d: DashSpec }) {
  const s = useShellState();
  return (
    <Shell d={d}>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <FilterBar value={s.filter} onChange={s.setFilter} placeholder="Tables, lineage, owners…" />
        <DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive} />
      </div>
      <div className="grid grid-cols-12 gap-4">
        <ChartCard span={4} title="Storage"><Donut value={71} label="of 2.4 PB" /></ChartCard>
        <ChartCard span={4} title="Query Cost · 24h"><Spark seed={71} height={56} /><div className="text-2xl font-semibold mt-2">$4,128</div></ChartCard>
        <ChartCard span={4} title="Freshness SLA"><Donut value={96} label="on-time" color="var(--color-success)" /></ChartCard>

        <ChartCard span={8} title="Top Tables">
          <DataTable
            columns={["Table", "Rows", "Size", "Last sync", "Owner"]}
            rows={[
              ["events.web_clicks", "12.4B", "412 TB", "2m", "Growth"],
              ["billing.invoices", "84M", "22 TB", "5m", "Finance"],
              ["crm.contacts", "48M", "11 TB", "12m", "RevOps"],
              ["telemetry.logs", "211B", "1.1 PB", "live", "Platform"],
              ["product.usage", "9.8B", "248 TB", "1m", "Product"],
            ]}
          />
        </ChartCard>
        <ChartCard span={4} title="Pipeline Health">
          <Timeline items={[
            { time: "live", title: "Kafka → Iceberg lag 1.2s", tone: "success" },
            { time: "2m", title: "dbt build · 412 models", tone: "success" },
            { time: "9m", title: "Backfill events.web_clicks", tone: "info" },
            { time: "1h", title: "Schema drift · contacts.country", tone: "warning" },
          ]} />
        </ChartCard>

        <ChartCard span={12} title="Query Throughput · 7d"><Bars seed={88} n={48} height={120} color="var(--color-accent)" /></ChartCard>
      </div>
    </Shell>
  );
}

/* ---------------- GOVERNANCE ---------------- */
export function GovernancePremium({ d }: { d: DashSpec }) {
  const s = useShellState();
  return (
    <Shell d={d}>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <FilterBar value={s.filter} onChange={s.setFilter} placeholder="Policies, controls, evidence…" />
        <QuickActions items={[
          { label: "New Policy", icon: "ShieldCheck", tone: "primary" },
          { label: "Evidence", icon: "FileCheck", tone: "info" },
        ]} />
      </div>
      <div className="grid grid-cols-12 gap-4">
        <ChartCard span={4} title="SOC2 Controls"><Donut value={94} label="passing" color="var(--color-success)" /></ChartCard>
        <ChartCard span={4} title="GDPR DSARs · 30d"><Bars seed={91} n={30} height={56} /><div className="text-2xl font-semibold mt-2">38</div></ChartCard>
        <ChartCard span={4} title="PII Coverage"><Donut value={88} label="classified" /></ChartCard>

        <ChartCard span={8} title="Control Catalog">
          <DataTable
            columns={["Control", "Family", "Owner", "Last test", "Status"]}
            rows={[
              ["AC-2 Account Mgmt", "Access", "Security", "2d", <Pill tone="success">Pass</Pill>],
              ["CP-9 Backups", "Continuity", "Platform", "1w", <Pill tone="success">Pass</Pill>],
              ["AU-6 Audit Review", "Audit", "SOC", "3d", <Pill tone="warning">Drift</Pill>],
              ["SC-12 Key Mgmt", "Crypto", "Platform", "12h", <Pill tone="success">Pass</Pill>],
              ["IR-4 Incident Resp.", "Incident", "SecOps", "5d", <Pill tone="destructive">Fail</Pill>],
            ]}
          />
        </ChartCard>
        <ChartCard span={4} title="Open Findings">
          <Timeline items={[
            { time: "1h", title: "MFA bypass on legacy app", tone: "destructive", meta: "P1" },
            { time: "6h", title: "Vendor SOC2 expiring", tone: "warning", meta: "30d" },
            { time: "1d", title: "DLP rule update pending", tone: "info" },
          ]} />
        </ChartCard>

        <ChartCard span={12} title="Audit Activity · 30d"><Heatmap rows={6} cols={30} seed={5} color="var(--color-primary)" /></ChartCard>

        {false && <EmptyState title="No items" />}
      </div>
    </Shell>
  );
}

/* Re-export shortcuts so registry can swap previous slugs */
export const Analytics08 = AnalyticsPremium;
export const Reporting08 = ReportingPremium;
export const SEO08 = SEOPremium;
export const Social08 = SocialPremium;
export const Marketing08 = MarketingPremium;
export const MarketIntel08 = MarketIntelPremium;
export const DataLake08 = DataLakePremium;
export const Governance08 = GovernancePremium;

/* Silence unused imports if any */
void Card; void Avatar;
