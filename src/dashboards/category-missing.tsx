import type { ReactNode } from "react";
import type { DashSpec } from "@/data/dashboards";
import { Shell, KpiRow, Pill, Bars, Donut, Heatmap, DataTable, Timeline, LineSeries, Terminal, Spark } from "./_primitives";
import {
  ChartCard, AIInsights, DashboardToolbar, FilterBar, QuickActions, TabBar,
  useDashboardState, useTabs, EmptyState,
} from "./_universal";

/* ============================================================
   CATEGORY-MISSING — 5 dashboards that previously fell back to
   the generic shell. Each is a premium multi-tab module.
   Slugs: leads, document-factory, disaster-recovery, compliance, revenue
   ============================================================ */

function Section({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-12 gap-4 animate-fade-up">{children}</div>;
}

/* ============================================================
   LEADS — Demand Engine
   ============================================================ */
export function Leads({ d }: { d: DashSpec }) {
  const s = useDashboardState("7d");
  const { tab, setTab } = useTabs<"inbox" | "sequences" | "enrichment" | "scoring" | "abm">("inbox");
  return (
    <Shell d={d}>
      <KpiRow d={d} />
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <FilterBar value={s.filter} onChange={s.setFilter} placeholder="Search leads, accounts, domains…" />
        <DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive}
          extra={<QuickActions items={[{label:"Import",icon:"Upload",tone:"info"},{label:"New Cadence",icon:"Send",tone:"primary"},{label:"Enrich",icon:"Sparkles",tone:"accent"}]} />} />
      </div>
      <TabBar value={tab} onChange={setTab} tabs={[
        { id: "inbox", label: "Inbox", icon: "Inbox", badge: 248 },
        { id: "sequences", label: "Sequences", icon: "Send", badge: 42 },
        { id: "enrichment", label: "Enrichment", icon: "Sparkles" },
        { id: "scoring", label: "Lead Scoring", icon: "Gauge" },
        { id: "abm", label: "ABM Targets", icon: "Target", badge: 128 },
      ]} />

      {tab === "inbox" && (
        <Section>
          <ChartCard span={8} title="New Leads · last 7 days" toolbar={<Pill tone="success">+24% WoW</Pill>}>
            <LineSeries seed={11} lines={3} height={220} />
          </ChartCard>
          <ChartCard span={4} title="Source Mix">
            <div className="grid grid-cols-2 gap-2">
              <Donut value={42} label="42%" color="var(--color-primary)" size={68} />
              <div className="text-[11px] space-y-1 self-center">
                <div><span className="inline-block w-2 h-2 rounded-full bg-primary mr-1.5" />Inbound 42%</div>
                <div><span className="inline-block w-2 h-2 rounded-full bg-accent mr-1.5" />Outbound 28%</div>
                <div><span className="inline-block w-2 h-2 rounded-full bg-info mr-1.5" />Referral 18%</div>
                <div><span className="inline-block w-2 h-2 rounded-full bg-warning mr-1.5" />Events 12%</div>
              </div>
            </div>
          </ChartCard>
          <ChartCard span={12} title="Hot Leads · auto-prioritized">
            <DataTable columns={["Lead","Company","Title","Score","Intent","Owner","Last Touch"]} rows={[
              ["Mira Chen","Northwind Aerospace","VP Engineering","92","Pricing page x4","S. Park","12m"],
              ["Tom Vega","Helio Robotics","CTO","88","Demo request","A. Voss","1h"],
              ["Priya Rao","Lumen Health","Director SecOps","86","Whitepaper","M. Reyes","2h"],
              ["Liam Park","Cobalt Logistics","Head of Data","79","Webinar attendee","J. Tan","3h"],
              ["Ana Voss","Atlas Fintech","CFO","74","Pricing inquiry","D. Kim","4h"],
            ]} />
          </ChartCard>
          <AIInsights items={[
            {title:"Surging account: Northwind Aerospace",body:"6 contacts active on pricing + security pages in 48h. Recommend ABM play.",tone:"success",confidence:91},
            {title:"Cadence fatigue detected",body:"Outbound Seq #14 reply rate dropped 38% — pause and A/B subject lines.",tone:"warning",confidence:84},
          ]} />
        </Section>
      )}

      {tab === "sequences" && (
        <Section>
          <ChartCard span={6} title="Sequence Performance">
            <DataTable columns={["Sequence","Stage","Sent","Reply%","Meetings","Status"]} rows={[
              ["Enterprise FY26 Q1","6 steps","12,402","8.4%","148","Active"],
              ["Security buyer · ABM","9 steps","2,801","14.2%","82","Active"],
              ["Webinar follow-up","4 steps","4,128","6.1%","42","Active"],
              ["Cold ICP · NA","12 steps","8,902","3.8%","28","Paused"],
            ]} />
          </ChartCard>
          <ChartCard span={6} title="Reply rate by step"><Bars seed={22} n={12} color="var(--color-accent)" height={160} /></ChartCard>
          <ChartCard span={12} title="Send schedule · next 24h">
            <Heatmap rows={5} cols={24} seed={4} color="var(--color-primary)" />
          </ChartCard>
        </Section>
      )}

      {tab === "enrichment" && (
        <Section>
          <ChartCard span={4} title="Enrichment Coverage">
            <Donut value={86} label="86%" color="var(--color-success)" />
          </ChartCard>
          <ChartCard span={8} title="Providers">
            <DataTable columns={["Provider","Coverage","Credits","Latency","Status"]} rows={[
              ["ZoomInfo","92%","48,201","312ms","OK"],
              ["Apollo","88%","124,802","248ms","OK"],
              ["Clearbit","74%","12,402","482ms","Throttled"],
              ["LinkedIn Sales Nav","68%","∞","612ms","OK"],
            ]} />
          </ChartCard>
          <ChartCard span={12} title="Recent enrichment runs">
            <Timeline items={[
              {time:"2m",title:"Enriched 4,820 leads · ZoomInfo",tone:"success"},
              {time:"14m",title:"Domain → firmographic match · 1,204 accounts",tone:"info"},
              {time:"42m",title:"Email verification batch · 12,402 valid / 412 bounce",tone:"info"},
              {time:"1h",title:"Clearbit throttle hit — backing off 4m",tone:"warning"},
            ]} />
          </ChartCard>
        </Section>
      )}

      {tab === "scoring" && (
        <Section>
          <ChartCard span={8} title="Score distribution"><Bars seed={31} n={20} color="var(--color-primary)" height={200} /></ChartCard>
          <ChartCard span={4} title="Model health">
            <div className="space-y-3">
              <div><div className="text-[10px] uppercase text-muted-foreground">AUC</div><div className="text-xl font-semibold">0.87</div><Spark seed={3} /></div>
              <div><div className="text-[10px] uppercase text-muted-foreground">MQL → SQL</div><div className="text-xl font-semibold">42%</div><Spark seed={5} color="var(--color-success)" /></div>
            </div>
          </ChartCard>
          <ChartCard span={12} title="Top features">
            <DataTable columns={["Feature","Weight","Direction","Stability"]} rows={[
              ["Pricing page visits (7d)","0.31","+","Stable"],
              ["Firmographic ICP fit","0.24","+","Stable"],
              ["Title match","0.18","+","Stable"],
              ["Email engagement","0.14","+","Drift detected"],
              ["Geo · NA/EU","0.08","+","Stable"],
            ]} />
          </ChartCard>
        </Section>
      )}

      {tab === "abm" && (
        <Section>
          <ChartCard span={12} title="Target Accounts">
            <DataTable columns={["Account","Tier","Intent","Buying Group","Stage","Owner"]} rows={[
              ["Northwind Aerospace","T1","98","8 / 8","Eval","S. Park"],
              ["Helio Robotics","T1","91","6 / 8","Discover","A. Voss"],
              ["Lumen Health","T2","84","4 / 6","Discover","M. Reyes"],
              ["Cobalt Logistics","T2","72","3 / 6","Awareness","J. Tan"],
            ]} />
          </ChartCard>
        </Section>
      )}
    </Shell>
  );
}

/* ============================================================
   DOCUMENT FACTORY — CLM
   ============================================================ */
export function DocumentFactory({ d }: { d: DashSpec }) {
  const s = useDashboardState("24h");
  const { tab, setTab } = useTabs<"templates" | "generate" | "sign" | "archive" | "workflows">("templates");
  return (
    <Shell d={d}>
      <KpiRow d={d} />
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <FilterBar value={s.filter} onChange={s.setFilter} placeholder="Search templates, envelopes, signers…" />
        <DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive}
          extra={<QuickActions items={[{label:"New Template",icon:"FilePlus",tone:"primary"},{label:"Send",icon:"Send",tone:"accent"}]} />} />
      </div>
      <TabBar value={tab} onChange={setTab} tabs={[
        {id:"templates",label:"Templates",icon:"FileText",badge:812},
        {id:"generate",label:"Generate",icon:"Wand2"},
        {id:"sign",label:"E-Sign",icon:"Signature",badge:"42 pending"},
        {id:"archive",label:"Archive",icon:"Archive"},
        {id:"workflows",label:"CLM Workflows",icon:"Workflow"},
      ]} />

      {tab === "templates" && (
        <Section>
          <ChartCard span={8} title="Most-used templates">
            <DataTable columns={["Template","Category","Uses (30d)","Owner","Last Edit"]} rows={[
              ["MSA · Enterprise FY26","Sales","2,481","Legal Ops","2d"],
              ["NDA · Mutual","Legal","4,128","Legal Ops","12d"],
              ["Order Form · USD","Sales","3,202","Rev Ops","4d"],
              ["DPA · GDPR Annex","Legal","812","Legal Ops","8d"],
              ["SOW · PS Standard","Services","482","PS Ops","1d"],
            ]} />
          </ChartCard>
          <ChartCard span={4} title="Category mix">
            <div className="grid grid-cols-2 gap-2">
              <Donut value={48} label="Sales" color="var(--color-primary)" size={68} />
              <Donut value={28} label="Legal" color="var(--color-info)" size={68} />
              <Donut value={14} label="HR" color="var(--color-warning)" size={68} />
              <Donut value={10} label="Other" color="var(--color-accent)" size={68} />
            </div>
          </ChartCard>
        </Section>
      )}

      {tab === "generate" && (
        <Section>
          <ChartCard span={6} title="Generations · last 24h"><LineSeries seed={42} lines={2} height={200} /></ChartCard>
          <ChartCard span={6} title="Failed merges">
            <DataTable columns={["Template","Reason","Owner","Time"]} rows={[
              ["Order Form · USD","Missing tax field","Rev Ops","12m"],
              ["MSA · EU","Locale mismatch","Legal","42m"],
              ["SOW · PS","Variable undefined","PS Ops","1h"],
            ]} />
          </ChartCard>
        </Section>
      )}

      {tab === "sign" && (
        <Section>
          <ChartCard span={8} title="Envelopes in flight">
            <DataTable columns={["Envelope","Customer","Stage","Signers","Sent","SLA"]} rows={[
              ["ENV-48201","Northwind Aerospace","Awaiting customer","2 / 3","2h","On-track"],
              ["ENV-48198","Helio Robotics","Awaiting countersign","3 / 3","6h","On-track"],
              ["ENV-48191","Lumen Health","Awaiting customer","1 / 4","18h","At risk"],
              ["ENV-48184","Atlas Fintech","Voided","—","2d","Closed"],
            ]} />
          </ChartCard>
          <ChartCard span={4} title="Completion time"><Donut value={92} label="2.1d avg" color="var(--color-success)" /></ChartCard>
        </Section>
      )}

      {tab === "archive" && (
        <Section>
          <ChartCard span={12} title="Vault activity">
            <Timeline items={[
              {time:"4m",title:"Archived ENV-48184 · retention 7y",tone:"info"},
              {time:"22m",title:"Legal hold applied · Case-2024-08",tone:"warning"},
              {time:"1h",title:"Bulk export · auditor access · 1,204 docs",tone:"success"},
              {time:"3h",title:"Retention sweep · 412 docs purged",tone:"muted"},
            ]} />
          </ChartCard>
        </Section>
      )}

      {tab === "workflows" && (
        <Section>
          <ChartCard span={12} title="CLM stages">
            <Heatmap rows={5} cols={20} seed={9} color="var(--color-info)" />
          </ChartCard>
          <AIInsights items={[
            {title:"Bottleneck: legal review",body:"Avg dwell 1.8d, +42% vs last quarter. 6 templates account for 80% of queue.",tone:"warning",confidence:89},
          ]} />
        </Section>
      )}
    </Shell>
  );
}

/* ============================================================
   DISASTER RECOVERY
   ============================================================ */
export function DisasterRecovery({ d }: { d: DashSpec }) {
  const s = useDashboardState("24h");
  const { tab, setTab } = useTabs<"sites" | "failovers" | "tests" | "runbooks" | "replication">("sites");
  return (
    <Shell d={d}>
      <KpiRow d={d} />
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <FilterBar value={s.filter} onChange={s.setFilter} placeholder="Filter sites, regions, workloads…" />
        <DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive}
          extra={<QuickActions items={[{label:"Initiate Failover",icon:"AlertTriangle",tone:"destructive"},{label:"Run DR Test",icon:"PlayCircle",tone:"primary"}]} />} />
      </div>
      <TabBar value={tab} onChange={setTab} tabs={[
        {id:"sites",label:"Sites",icon:"Globe",badge:24},
        {id:"failovers",label:"Failovers",icon:"GitBranch"},
        {id:"tests",label:"DR Tests",icon:"PlayCircle",badge:"42 / yr"},
        {id:"runbooks",label:"Runbooks",icon:"BookOpen"},
        {id:"replication",label:"Replication",icon:"Repeat"},
      ]} />

      {tab === "sites" && (
        <Section>
          <ChartCard span={8} title="Site health · global">
            <DataTable columns={["Site","Region","Role","RPO","RTO","Status"]} rows={[
              ["edge-east-01","us-east-1","Primary","—","—","Healthy"],
              ["edge-east-02","us-east-2","Standby","28s","3m 42s","Healthy"],
              ["edge-west-01","us-west-2","Standby","32s","4m 12s","Healthy"],
              ["edge-eu-01","eu-west-1","Primary","—","—","Healthy"],
              ["edge-eu-02","eu-central-1","Standby","41s","5m 02s","Degraded"],
              ["edge-ap-01","ap-southeast-1","Primary","—","—","Healthy"],
            ]} />
          </ChartCard>
          <ChartCard span={4} title="RPO / RTO compliance"><Donut value={96} label="96%" color="var(--color-success)" /></ChartCard>
        </Section>
      )}

      {tab === "failovers" && (
        <Section>
          <ChartCard span={12} title="Failover history">
            <Timeline items={[
              {time:"7d",title:"Planned failover · eu-west-1 → eu-central-1",meta:"Maintenance · RTO 2m 41s",tone:"success"},
              {time:"21d",title:"Unplanned failover · us-east-1 → us-east-2",meta:"AZ outage · RTO 3m 12s",tone:"warning"},
              {time:"42d",title:"Planned failback · us-east-2 → us-east-1",tone:"info"},
              {time:"68d",title:"DR drill · ap-southeast-1",tone:"muted"},
            ]} />
          </ChartCard>
        </Section>
      )}

      {tab === "tests" && (
        <Section>
          <ChartCard span={6} title="Test pass rate · last 12 months"><Bars seed={11} n={12} color="var(--color-success)" height={180} /></ChartCard>
          <ChartCard span={6} title="Next scheduled tests">
            <DataTable columns={["Workload","Site","Owner","Window"]} rows={[
              ["Order DB","eu-central-1","SRE","Tue 02:00 UTC"],
              ["Payments API","us-east-2","Platform","Thu 03:00 UTC"],
              ["Auth cluster","us-west-2","Identity","Fri 04:00 UTC"],
            ]} />
          </ChartCard>
        </Section>
      )}

      {tab === "runbooks" && (
        <Section>
          <ChartCard span={12} title="Runbook coverage">
            <DataTable columns={["Runbook","Owner","Version","Last Verified","Auto-Run"]} rows={[
              ["DB primary failover","SRE","v8.2","2d","Yes"],
              ["Auth cluster failover","Identity","v5.1","12d","Yes"],
              ["Payments region drain","Platform","v3.4","4d","Yes"],
              ["DNS cutover","Network","v2.8","18d","No"],
            ]} />
          </ChartCard>
        </Section>
      )}

      {tab === "replication" && (
        <Section>
          <ChartCard span={8} title="Replication lag · 24h"><LineSeries seed={88} lines={3} height={200} /></ChartCard>
          <ChartCard span={4} title="Bytes replicated/s"><Bars seed={5} n={20} color="var(--color-info)" height={160} /></ChartCard>
          <AIInsights items={[
            {title:"eu-central-1 lag drift",body:"Replication lag trending up 18% over 6h — likely network saturation.",tone:"warning",confidence:82},
          ]} />
        </Section>
      )}
    </Shell>
  );
}

/* ============================================================
   COMPLIANCE
   ============================================================ */
export function Compliance({ d }: { d: DashSpec }) {
  const s = useDashboardState("30d");
  const { tab, setTab } = useTabs<"frameworks" | "controls" | "evidence" | "audits" | "vendors">("frameworks");
  return (
    <Shell d={d}>
      <KpiRow d={d} />
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <FilterBar value={s.filter} onChange={s.setFilter} placeholder="Search controls, evidence, vendors…" />
        <DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive}
          extra={<QuickActions items={[{label:"Request Evidence",icon:"FileSearch",tone:"info"},{label:"Open Audit",icon:"Gavel",tone:"primary"}]} />} />
      </div>
      <TabBar value={tab} onChange={setTab} tabs={[
        {id:"frameworks",label:"Frameworks",icon:"ShieldCheck",badge:12},
        {id:"controls",label:"Controls",icon:"ListChecks",badge:812},
        {id:"evidence",label:"Evidence",icon:"FileText",badge:"4.2k"},
        {id:"audits",label:"Audits",icon:"Gavel"},
        {id:"vendors",label:"Vendor Risk",icon:"Building2"},
      ]} />

      {tab === "frameworks" && (
        <Section>
          <ChartCard span={12} title="Framework readiness">
            <DataTable columns={["Framework","Scope","Controls","Passing","Gaps","Auditor"]} rows={[
              ["SOC 2 Type II","Production","148","146","2","Prescient"],
              ["ISO 27001","Global","114","112","2","BSI"],
              ["HIPAA","Healthcare workloads","82","78","4","HITRUST"],
              ["GDPR","EU customers","64","64","0","Internal"],
              ["PCI DSS v4","Payments","248","241","7","Trustwave"],
              ["FedRAMP Mod","Gov tenant","325","298","27","3PAO"],
            ]} />
          </ChartCard>
        </Section>
      )}

      {tab === "controls" && (
        <Section>
          <ChartCard span={8} title="Control health"><Heatmap rows={8} cols={32} seed={6} color="var(--color-success)" /></ChartCard>
          <ChartCard span={4} title="Failing controls"><Donut value={4} label="32 / 812" color="var(--color-destructive)" /></ChartCard>
          <ChartCard span={12} title="Top failing controls">
            <DataTable columns={["Control","Framework","Owner","Status","Due"]} rows={[
              ["CC7.2 · Vuln mgmt","SOC 2","SecEng","Failing","3d"],
              ["A.12.4 · Logging","ISO 27001","Platform","At-risk","7d"],
              ["164.312(b) · Audit logs","HIPAA","Identity","Failing","2d"],
              ["6.4.3 · Script integrity","PCI v4","Web","At-risk","14d"],
            ]} />
          </ChartCard>
        </Section>
      )}

      {tab === "evidence" && (
        <Section>
          <ChartCard span={12} title="Evidence freshness">
            <DataTable columns={["Evidence","Linked Controls","Source","Last Collected","Status"]} rows={[
              ["Access review · Q1","CC6.3","Okta","12d","Fresh"],
              ["Backup verification","A.12.3","Veeam","2d","Fresh"],
              ["Pen test report","CC7.1","NCC Group","68d","Fresh"],
              ["Encryption inventory","A.10.1","KMS","182d","Stale"],
            ]} />
          </ChartCard>
        </Section>
      )}

      {tab === "audits" && (
        <Section>
          <ChartCard span={12} title="Audit calendar">
            <Timeline items={[
              {time:"Today",title:"SOC 2 walkthrough · Prescient",meta:"Auditor: M. Halloran",tone:"info"},
              {time:"+5d",title:"PCI scoping interview · Trustwave",tone:"warning"},
              {time:"+18d",title:"ISO surveillance audit · BSI",tone:"info"},
              {time:"+42d",title:"FedRAMP 3PAO kickoff",tone:"muted"},
            ]} />
          </ChartCard>
        </Section>
      )}

      {tab === "vendors" && (
        <Section>
          <ChartCard span={12} title="Vendor risk register">
            <DataTable columns={["Vendor","Data Class","Tier","SOC 2","Last Review","Score"]} rows={[
              ["AWS","Customer","Critical","Yes","42d","A"],
              ["Stripe","PCI","Critical","Yes","68d","A"],
              ["Datadog","Telemetry","High","Yes","91d","A-"],
              ["NewVendor LLC","Confidential","Medium","Pending","—","C"],
            ]} />
          </ChartCard>
          <AIInsights items={[
            {title:"Vendor risk concentration",body:"3 critical vendors host 92% of customer data — consider secondary providers.",tone:"warning",confidence:78},
          ]} />
        </Section>
      )}
    </Shell>
  );
}

/* ============================================================
   REVENUE
   ============================================================ */
export function Revenue({ d }: { d: DashSpec }) {
  const s = useDashboardState("30d");
  const { tab, setTab } = useTabs<"revenue" | "cohorts" | "forecast" | "recognition" | "expansion">("revenue");
  return (
    <Shell d={d}>
      <KpiRow d={d} />
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <FilterBar value={s.filter} onChange={s.setFilter} placeholder="Filter segment, plan, region…" />
        <DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive}
          extra={<QuickActions items={[{label:"Export",icon:"Download",tone:"muted"},{label:"New Forecast",icon:"TrendingUp",tone:"primary"}]} />} />
      </div>
      <TabBar value={tab} onChange={setTab} tabs={[
        {id:"revenue",label:"Revenue",icon:"DollarSign"},
        {id:"cohorts",label:"Cohorts",icon:"Users"},
        {id:"forecast",label:"Forecast",icon:"TrendingUp"},
        {id:"recognition",label:"Recognition",icon:"FileSpreadsheet"},
        {id:"expansion",label:"Expansion",icon:"ArrowUpRight"},
      ]} />

      {tab === "revenue" && (
        <Section>
          <ChartCard span={8} title="ARR · trailing 30 days" toolbar={<Pill tone="success">+12.4% MoM</Pill>}>
            <LineSeries seed={71} lines={3} height={240} />
          </ChartCard>
          <ChartCard span={4} title="Revenue mix">
            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between"><span>Subscription</span><span className="font-semibold tabular-nums">$24.1M</span></div>
              <div className="flex justify-between"><span>Usage</span><span className="font-semibold tabular-nums">$3.8M</span></div>
              <div className="flex justify-between"><span>Services</span><span className="font-semibold tabular-nums">$0.9M</span></div>
              <div className="flex justify-between text-muted-foreground"><span>One-time</span><span className="tabular-nums">$0.2M</span></div>
            </div>
            <div className="mt-3"><Bars seed={3} n={12} color="var(--color-success)" height={80} /></div>
          </ChartCard>
          <ChartCard span={6} title="New vs Expansion vs Churn"><Bars seed={17} n={20} color="var(--color-primary)" height={180} /></ChartCard>
          <ChartCard span={6} title="By region">
            <DataTable columns={["Region","ARR","NRR","Logos"]} rows={[
              ["NA","$18.2M","122%","1,402"],
              ["EU","$7.8M","118%","612"],
              ["APAC","$2.4M","114%","248"],
              ["LATAM","$0.5M","108%","82"],
            ]} />
          </ChartCard>
        </Section>
      )}

      {tab === "cohorts" && (
        <Section>
          <ChartCard span={12} title="Net revenue retention by cohort">
            <Heatmap rows={8} cols={12} seed={14} color="var(--color-success)" />
          </ChartCard>
        </Section>
      )}

      {tab === "forecast" && (
        <Section>
          <ChartCard span={8} title="Forecast · current + 4 quarters"><LineSeries seed={29} lines={4} height={240} /></ChartCard>
          <ChartCard span={4} title="Pipeline coverage">
            <Donut value={3.4} label="3.4x" color="var(--color-info)" />
          </ChartCard>
        </Section>
      )}

      {tab === "recognition" && (
        <Section>
          <ChartCard span={12} title="ASC 606 schedule">
            <DataTable columns={["Contract","Customer","TCV","Recognized","Deferred","End"]} rows={[
              ["MSA-2024-0481","Northwind Aerospace","$1.2M","$0.8M","$0.4M","2026-12"],
              ["MSA-2024-0399","Helio Robotics","$840k","$420k","$420k","2027-03"],
              ["MSA-2024-0312","Lumen Health","$612k","$306k","$306k","2026-08"],
              ["MSA-2024-0288","Atlas Fintech","$480k","$120k","$360k","2027-06"],
            ]} />
          </ChartCard>
          <ChartCard span={12} title="Recognition activity">
            <Terminal lines={[
              {t:"[02:14:08] schedule run · 1,204 contracts processed",tone:"success"},
              {t:"[02:14:09] $148,201 recognized · period 2026-05",tone:"info"},
              {t:"[02:14:10] 12 contracts pending CSM approval",tone:"warning"},
              {t:"[02:14:12] export · ledger.csv · 4.2 MB",tone:"muted"},
            ]} />
          </ChartCard>
        </Section>
      )}

      {tab === "expansion" && (
        <Section>
          <ChartCard span={8} title="Top expansion opportunities">
            <DataTable columns={["Account","Current ARR","Expansion ARR","Trigger","Owner"]} rows={[
              ["Northwind Aerospace","$420k","$210k","Seat overage 18%","S. Park"],
              ["Helio Robotics","$310k","$180k","New product fit","A. Voss"],
              ["Lumen Health","$248k","$120k","Compliance add-on","M. Reyes"],
              ["Atlas Fintech","$180k","$90k","Region expansion","J. Tan"],
            ]} />
          </ChartCard>
          <ChartCard span={4} title="Expansion mix"><Donut value={62} label="62% of net new" color="var(--color-accent)" /></ChartCard>
          <AIInsights items={[
            {title:"NRR at 118% — above target",body:"Expansion outpacing churn by 4.2x. Top driver: usage-based pricing on enterprise tier.",tone:"success",confidence:93},
            {title:"Churn risk: 6 mid-market accounts",body:"Combined $412k ARR · low product engagement + open support tickets >14d.",tone:"destructive",confidence:86},
          ]} />
        </Section>
      )}

      {!d && <EmptyState title="No revenue data" />}
    </Shell>
  );
}
