import { useState, useEffect, useMemo } from "react";
import * as Icons from "lucide-react";
import type { DashSpec } from "@/data/dashboards";
import { Spark, Bars, Donut, Heatmap, WorldMap, LineSeries, DataTable, ProgressBar, StatusDot, Terminal, Avatar } from "./_primitives";

/* ============================================================
   GLOBAL COMMAND CENTER — Datadog Enterprise clone
   12 role dashboards · 20 monitoring sections · 1 shell
   ============================================================ */

type SectionId =
  | "overview" | "infra" | "servers" | "api" | "db" | "ai"
  | "users" | "geo" | "incidents" | "alerts" | "logs" | "metrics"
  | "sla" | "errors" | "heatmap" | "worldmap" | "notifications"
  | "insights" | "timeline" | "reports";

type RoleId =
  | "command-user" | "operator" | "noc" | "infra-mgr" | "security"
  | "analytics" | "global" | "regional" | "country" | "enterprise"
  | "exec" | "admin";

const SECTIONS: { id: SectionId; label: string; icon: keyof typeof Icons; group: string }[] = [
  { id: "overview", label: "Global Overview", icon: "LayoutDashboard", group: "Dashboard" },
  { id: "infra", label: "Live Infrastructure", icon: "Server", group: "Monitoring" },
  { id: "servers", label: "Server Health", icon: "HardDrive", group: "Monitoring" },
  { id: "api", label: "API Monitoring", icon: "Webhook", group: "Monitoring" },
  { id: "db", label: "Database Monitoring", icon: "Database", group: "Monitoring" },
  { id: "ai", label: "AI Monitoring", icon: "BrainCircuit", group: "Monitoring" },
  { id: "users", label: "User Activity", icon: "Users", group: "Monitoring" },
  { id: "geo", label: "Geo Monitoring", icon: "MapPin", group: "Monitoring" },
  { id: "incidents", label: "Incidents", icon: "AlertOctagon", group: "Security" },
  { id: "alerts", label: "Alert Center", icon: "BellRing", group: "Security" },
  { id: "logs", label: "Logs Viewer", icon: "ScrollText", group: "Logs" },
  { id: "metrics", label: "Realtime Metrics", icon: "Activity", group: "Logs" },
  { id: "sla", label: "SLA Monitoring", icon: "Gauge", group: "Reports" },
  { id: "errors", label: "Error Tracking", icon: "Bug", group: "Reports" },
  { id: "heatmap", label: "Heatmaps", icon: "Grid3x3", group: "Reports" },
  { id: "worldmap", label: "World Map", icon: "Globe2", group: "Reports" },
  { id: "notifications", label: "Notifications", icon: "Bell", group: "AI Insights" },
  { id: "insights", label: "AI Insights", icon: "Sparkles", group: "AI Insights" },
  { id: "timeline", label: "Activity Timeline", icon: "GitCommitHorizontal", group: "AI Insights" },
  { id: "reports", label: "Executive Reports", icon: "FileBarChart", group: "Settings" },
];

const ROLES: { id: RoleId; label: string; scope: SectionId[] }[] = [
  { id: "command-user", label: "Command User", scope: ["overview","metrics","alerts","timeline"] },
  { id: "operator", label: "Monitoring Operator", scope: ["infra","servers","api","db","logs","metrics"] },
  { id: "noc", label: "NOC Engineer", scope: ["infra","servers","incidents","alerts","logs","worldmap"] },
  { id: "infra-mgr", label: "Infrastructure Mgr", scope: ["infra","servers","db","sla","reports"] },
  { id: "security", label: "Security Monitoring", scope: ["incidents","alerts","logs","errors","timeline"] },
  { id: "analytics", label: "Analytics Monitoring", scope: ["metrics","heatmap","insights","reports"] },
  { id: "global", label: "Global Monitoring", scope: ["overview","worldmap","geo","sla","reports"] },
  { id: "regional", label: "Regional Monitoring", scope: ["geo","worldmap","infra","sla"] },
  { id: "country", label: "Country Monitoring", scope: ["geo","worldmap","users","incidents"] },
  { id: "enterprise", label: "Enterprise Monitoring", scope: ["overview","sla","reports","insights"] },
  { id: "exec", label: "Executive War Room", scope: ["overview","reports","insights","worldmap"] },
  { id: "admin", label: "Command Center Admin", scope: SECTIONS.map(s=>s.id) },
];

const REGIONS = ["Global","NA-East","NA-West","EU-West","EU-Central","APAC-NE","APAC-SE","SA","ME","AF"];

/* --- atoms (no glass) --- */
function Panel({ title, right, children, className = "" }: { title?: string; right?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={`bg-card border border-border rounded-md ${className}`}>
      {(title || right) && (
        <header className="flex items-center justify-between px-3 h-9 border-b border-border">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
          {right}
        </header>
      )}
      <div className="p-3">{children}</div>
    </section>
  );
}

function Stat({ label, value, delta, tone = "info", spark = 1 }: { label: string; value: string; delta?: string; tone?: "info"|"success"|"warning"|"destructive"; spark?: number }) {
  const map = { info:"text-info", success:"text-success", warning:"text-warning", destructive:"text-destructive" };
  return (
    <div className="bg-card border border-border rounded-md px-3 py-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
        {delta && <span className={`text-[10px] ${map[tone]}`}>{delta}</span>}
      </div>
      <div className="mt-1 text-xl font-semibold tabular-nums tracking-tight">{value}</div>
      <div className={`mt-1 ${map[tone]}`}><Spark seed={spark} height={22} /></div>
    </div>
  );
}

function Tag({ children, tone = "muted" }: { children: React.ReactNode; tone?: "muted"|"success"|"warning"|"destructive"|"info"|"primary" }) {
  const m: Record<string,string> = {
    muted: "bg-muted/60 text-muted-foreground border-border",
    success: "bg-success/15 text-success border-success/30",
    warning: "bg-warning/15 text-warning border-warning/30",
    destructive: "bg-destructive/15 text-destructive border-destructive/30",
    info: "bg-info/15 text-info border-info/30",
    primary: "bg-primary/15 text-primary border-primary/30",
  };
  return <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] border ${m[tone]} font-medium`}>{children}</span>;
}

function LiveDot({ tone = "success" }: { tone?: "success"|"warning"|"destructive"|"info" }) {
  const m = { success:"bg-success", warning:"bg-warning", destructive:"bg-destructive", info:"bg-info" };
  return (
    <span className="relative inline-flex w-2 h-2">
      <span className={`absolute inset-0 rounded-full ${m[tone]} opacity-60 animate-ping`} />
      <span className={`relative inline-flex rounded-full w-2 h-2 ${m[tone]}`} />
    </span>
  );
}

/* live ticking number */
function useTicker(base: number, jitter = 0.02) {
  const [v, setV] = useState(base);
  useEffect(() => {
    const id = setInterval(() => setV(b => b + (Math.random() - 0.5) * b * jitter), 1500);
    return () => clearInterval(id);
  }, [jitter]);
  return v;
}

/* ============================================================
   SECTION VIEWS
   ============================================================ */

function GlobalOverview() {
  const rps = useTicker(284123, 0.015);
  const errors = useTicker(0.042, 0.08);
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-3">
        <Stat label="Requests/sec" value={Math.round(rps).toLocaleString()} delta="+2.4%" tone="success" spark={1} />
        <Stat label="Error rate" value={errors.toFixed(3)+"%"} delta="-0.8%" tone="success" spark={2} />
        <Stat label="p95 Latency" value="42ms" delta="+1.2ms" tone="warning" spark={3} />
        <Stat label="Apdex" value="0.987" delta="+0.002" tone="success" spark={4} />
        <Stat label="Hosts up" value="12,408" delta="+18" tone="info" spark={5} />
        <Stat label="Open incidents" value="3" delta="-2" tone="destructive" spark={6} />
      </div>
      <div className="grid grid-cols-12 gap-3">
        <Panel title="Service Map · Realtime Topology" className="col-span-12 xl:col-span-8">
          <WorldMap seed={11} />
        </Panel>
        <Panel title="Golden Signals" className="col-span-12 xl:col-span-4">
          <ul className="text-xs divide-y divide-border">
            {[
              ["Latency p50","18ms","success"],
              ["Latency p95","42ms","warning"],
              ["Latency p99","118ms","warning"],
              ["Errors 5xx","0.04%","success"],
              ["Saturation CPU","68%","warning"],
              ["Traffic","284k rps","info"],
              ["Synthetics OK","99.97%","success"],
            ].map(([k,v,t],i)=>(
              <li key={i} className="flex items-center justify-between py-2">
                <span className="text-muted-foreground">{k}</span>
                <Tag tone={t as never}>{v}</Tag>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Throughput · last 1h" className="col-span-12 lg:col-span-6">
          <LineSeries seed={21} lines={3} height={160} />
          <div className="mt-2 flex items-center gap-3 text-[10px] text-muted-foreground">
            <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-primary"/>checkout</span>
            <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-accent"/>auth</span>
            <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-success"/>search</span>
          </div>
        </Panel>
        <Panel title="Top services by error budget burn" className="col-span-12 lg:col-span-6">
          <ul className="space-y-2">
            {[["payments-api",78,"destructive"],["checkout-svc",54,"warning"],["ledger",31,"warning"],["cdn-edge",12,"success"],["search-rank",8,"success"]].map(([n,p,t],i)=>(
              <li key={i} className="text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono">{n as string}</span>
                  <span className="text-muted-foreground">{p}% burned</span>
                </div>
                <ProgressBar value={p as number} color={`var(--color-${t})`} />
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}

function LiveInfra() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Clusters" value="184" tone="info" spark={7} />
        <Stat label="Nodes" value="12,408" tone="success" spark={8} />
        <Stat label="Pods" value="84,210" tone="success" spark={9} />
        <Stat label="Containers" value="124,802" tone="info" spark={10} />
      </div>
      <Panel title="Live Infrastructure Map">
        <div className="grid grid-cols-12 md:grid-cols-24 gap-1">
          {Array.from({ length: 24*8 }).map((_, i) => {
            const r = Math.random();
            const tone = r > 0.94 ? "destructive" : r > 0.82 ? "warning" : "success";
            const m = { destructive:"bg-destructive", warning:"bg-warning", success:"bg-success" };
            return <div key={i} className={`h-6 rounded-sm ${m[tone as never]} opacity-${r>0.5?80:50} hover:opacity-100 transition-opacity`} title={`node-${i}`} />;
          })}
        </div>
      </Panel>
      <div className="grid grid-cols-12 gap-3">
        <Panel title="Kubernetes Workloads" className="col-span-12 lg:col-span-7">
          <DataTable
            columns={["Workload","Cluster","Replicas","CPU","Mem","Status"]}
            rows={[
              ["checkout-api","prod-eu-west-1","42 / 42","68%","71%",<Tag tone="success">Healthy</Tag>],
              ["payments-svc","prod-us-east-1","24 / 24","82%","78%",<Tag tone="warning">Degraded</Tag>],
              ["ledger","prod-us-east-1","12 / 12","41%","52%",<Tag tone="success">Healthy</Tag>],
              ["search-rank","prod-apac-ne1","18 / 20","91%","88%",<Tag tone="destructive">Saturated</Tag>],
              ["auth","prod-eu-central","16 / 16","48%","60%",<Tag tone="success">Healthy</Tag>],
              ["notifier","prod-us-west-2","8 / 8","22%","30%",<Tag tone="success">Healthy</Tag>],
            ]}
          />
        </Panel>
        <Panel title="Deployments · last 24h" className="col-span-12 lg:col-span-5">
          <Bars seed={31} n={24} color="var(--color-primary)" height={120} />
          <div className="mt-2 grid grid-cols-3 text-center text-[11px]">
            <div><div className="text-muted-foreground">Success</div><div className="text-success font-semibold">128</div></div>
            <div><div className="text-muted-foreground">Failed</div><div className="text-destructive font-semibold">4</div></div>
            <div><div className="text-muted-foreground">Rollbacks</div><div className="text-warning font-semibold">2</div></div>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function ServerHealth() {
  const rows = Array.from({ length: 12 }).map((_, i) => {
    const cpu = 20 + Math.round(Math.random()*70);
    const mem = 30 + Math.round(Math.random()*60);
    const tone = cpu > 80 ? "destructive" : cpu > 65 ? "warning" : "success";
    return [
      <span className="font-mono">ip-10-0-{i}-{14+i}</span>,
      ["us-east-1","eu-west-1","apac-ne1","sa-east-1"][i%4],
      <ProgressBar value={cpu} color={`var(--color-${tone})`} />,
      <ProgressBar value={mem} color="var(--color-info)" />,
      `${(Math.random()*200).toFixed(0)}MB/s`,
      <Tag tone={tone as never}>{cpu>80?"Critical":cpu>65?"Warn":"OK"}</Tag>,
    ];
  });
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Stat label="Hosts" value="12,408" tone="info" spark={1}/>
        <Stat label="CPU avg" value="61%" tone="warning" spark={2}/>
        <Stat label="Mem avg" value="68%" tone="warning" spark={3}/>
        <Stat label="Disk used" value="42%" tone="success" spark={4}/>
        <Stat label="Net throughput" value="184 Gbps" tone="info" spark={5}/>
      </div>
      <Panel title="Host Inventory">
        <DataTable columns={["Host","Region","CPU","Memory","Network","Status"]} rows={rows} />
      </Panel>
    </div>
  );
}

function ApiMonitoring() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Endpoints" value="1,284" tone="info" spark={1}/>
        <Stat label="RPM" value="17.2M" tone="success" spark={2}/>
        <Stat label="Error rate" value="0.04%" tone="success" spark={3}/>
        <Stat label="p99 latency" value="118ms" tone="warning" spark={4}/>
      </div>
      <div className="grid grid-cols-12 gap-3">
        <Panel title="Top endpoints" className="col-span-12 lg:col-span-7">
          <DataTable
            columns={["Method","Endpoint","RPM","p95","Errors","Apdex"]}
            rows={[
              [<Tag tone="info">GET</Tag>, "/v2/checkout/cart","482k","38ms","0.02%","0.99"],
              [<Tag tone="success">POST</Tag>, "/v2/payments/charge","128k","91ms","0.18%","0.94"],
              [<Tag tone="info">GET</Tag>, "/v2/users/me","984k","12ms","0.00%","1.00"],
              [<Tag tone="warning">PUT</Tag>, "/v2/orders/{id}","41k","142ms","0.42%","0.87"],
              [<Tag tone="info">GET</Tag>, "/v2/search","612k","58ms","0.05%","0.97"],
              [<Tag tone="destructive">DEL</Tag>, "/v2/sessions","8k","22ms","0.01%","0.99"],
            ]}
          />
        </Panel>
        <Panel title="Latency distribution" className="col-span-12 lg:col-span-5">
          <Bars seed={41} n={32} color="var(--color-accent)" height={160} />
        </Panel>
      </div>
    </div>
  );
}

function DbMonitoring() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Clusters" value="48" tone="info" spark={1}/>
        <Stat label="Queries/sec" value="84,210" tone="success" spark={2}/>
        <Stat label="Slow queries" value="184" tone="warning" spark={3}/>
        <Stat label="Replication lag" value="48ms" tone="success" spark={4}/>
      </div>
      <div className="grid grid-cols-12 gap-3">
        <Panel title="Top slow queries" className="col-span-12 lg:col-span-8">
          <DataTable
            columns={["Query","DB","Calls","Mean","Total","Action"]}
            rows={[
              [<code className="text-[11px]">SELECT * FROM orders WHERE …</code>,"orders-pg","12,481","482ms","1h 4m",<Tag tone="warning">Index hint</Tag>],
              [<code className="text-[11px]">UPDATE inventory SET qty …</code>,"stock-pg","8,210","612ms","58m",<Tag tone="destructive">Lock contention</Tag>],
              [<code className="text-[11px]">SELECT u.* FROM users u …</code>,"users-pg","48,210","91ms","52m",<Tag tone="success">OK</Tag>],
              [<code className="text-[11px]">INSERT INTO events …</code>,"events-ts","112,012","18ms","48m",<Tag tone="success">OK</Tag>],
            ]}
          />
        </Panel>
        <Panel title="Connection pool" className="col-span-12 lg:col-span-4">
          <div className="grid place-items-center"><Donut value={74} label="Pool used" /></div>
          <div className="mt-3 text-[11px] text-muted-foreground space-y-1">
            <div className="flex justify-between"><span>Active</span><span className="text-foreground">1,184</span></div>
            <div className="flex justify-between"><span>Idle</span><span className="text-foreground">412</span></div>
            <div className="flex justify-between"><span>Waiting</span><span className="text-warning">28</span></div>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function AiMonitoring() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Models" value="42" tone="info" spark={1}/>
        <Stat label="Inferences/sec" value="18,402" tone="success" spark={2}/>
        <Stat label="Drift detected" value="3" tone="warning" spark={3}/>
        <Stat label="GPU util" value="78%" tone="warning" spark={4}/>
      </div>
      <div className="grid grid-cols-12 gap-3">
        <Panel title="Model performance" className="col-span-12 lg:col-span-7">
          <DataTable
            columns={["Model","Version","p95","Accuracy","Drift","Status"]}
            rows={[
              ["fraud-detector","v3.1","48ms","0.984","0.02",<Tag tone="success">Stable</Tag>],
              ["recsys-rank","v7.0","62ms","0.918","0.11",<Tag tone="warning">Drift</Tag>],
              ["llm-router","v2.4","118ms","0.962","0.04",<Tag tone="success">Stable</Tag>],
              ["vision-ocr","v1.8","210ms","0.971","0.18",<Tag tone="destructive">Retrain</Tag>],
            ]}
          />
        </Panel>
        <Panel title="GPU utilization" className="col-span-12 lg:col-span-5">
          <Heatmap rows={6} cols={24} seed={51} color="var(--color-accent)" />
        </Panel>
      </div>
    </div>
  );
}

function UserActivity() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Active users" value="284,182" tone="success" spark={1}/>
        <Stat label="Sessions/min" value="42,108" tone="info" spark={2}/>
        <Stat label="New signups" value="1,284" tone="success" spark={3}/>
        <Stat label="Bounce" value="18%" tone="warning" spark={4}/>
      </div>
      <Panel title="Live session feed">
        <ul className="text-xs divide-y divide-border max-h-80 overflow-auto">
          {Array.from({length:14}).map((_,i)=>(
            <li key={i} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <Avatar name={["Aki Tanaka","Lia Roux","Sam Park","Eve Cole","Maya N","Rio O"][i%6]} />
                <div>
                  <div className="font-medium">{["checkout","login","search","upload","settings","cart"][i%6]}</div>
                  <div className="text-[10px] text-muted-foreground font-mono">sess_{(Math.random()*1e6|0).toString(16)}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Tag tone="info">{["Chrome","Safari","Edge","Firefox"][i%4]}</Tag>
                <Tag>{["Tokyo","Paris","NYC","Berlin","Singapore"][i%5]}</Tag>
                <span className="text-[10px] text-muted-foreground">{i*3+2}s ago</span>
              </div>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}

function GeoView() {
  return (
    <div className="space-y-3">
      <Panel title="Geo Monitoring · global edge"><WorldMap seed={71} /></Panel>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[["NA-East",98],["EU-West",96],["APAC-NE",92],["SA",88],["AF",81]].map(([r,p],i)=>(
          <Panel key={i} title={r as string}>
            <div className="grid place-items-center"><Donut value={p as number} label="Health" color="var(--color-success)" size={92}/></div>
            <div className="mt-2 text-[11px] text-muted-foreground text-center">SLA · 99.{p}%</div>
          </Panel>
        ))}
      </div>
    </div>
  );
}

function Incidents() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Stat label="Open" value="3" tone="destructive" spark={1}/>
        <Stat label="Acked" value="8" tone="warning" spark={2}/>
        <Stat label="Resolved 24h" value="42" tone="success" spark={3}/>
        <Stat label="MTTR" value="14m" tone="info" spark={4}/>
        <Stat label="MTBF" value="184h" tone="success" spark={5}/>
      </div>
      <Panel title="Incidents">
        <DataTable
          columns={["#","Severity","Title","Service","Region","Owner","Opened","Status"]}
          rows={[
            ["INC-4821",<Tag tone="destructive">P1</Tag>,"Checkout 5xx surge","checkout-api","eu-west-1","payments-oncall","2m ago",<Tag tone="destructive">Active</Tag>],
            ["INC-4820",<Tag tone="warning">P2</Tag>,"Cache miss > SLO","cdn-edge","apac-ne1","cdn-team","14m ago",<Tag tone="warning">Acked</Tag>],
            ["INC-4819",<Tag tone="warning">P2</Tag>,"DB replication lag","orders-pg","us-east-1","data-oncall","42m ago",<Tag tone="info">Mitigating</Tag>],
            ["INC-4818",<Tag tone="info">P3</Tag>,"Synthetic check failed","auth","tokyo","sre","1h ago",<Tag tone="success">Resolved</Tag>],
            ["INC-4817",<Tag tone="info">P3</Tag>,"Disk pressure node-118","kube-prod","eu-central","platform","2h ago",<Tag tone="success">Resolved</Tag>],
          ]}
        />
      </Panel>
    </div>
  );
}

function AlertCenter() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Triggered" value="12" tone="destructive" spark={1}/>
        <Stat label="Warning" value="38" tone="warning" spark={2}/>
        <Stat label="OK" value="2,148" tone="success" spark={3}/>
        <Stat label="Muted" value="14" tone="info" spark={4}/>
      </div>
      <Panel title="Active monitors">
        <DataTable
          columns={["Monitor","Service","Trigger","Channel","Last","State"]}
          rows={[
            ["checkout.error_rate > 1%","checkout","threshold","#oncall-payments","2m ago",<Tag tone="destructive">Triggered</Tag>],
            ["api.p99 > 200ms","api-gw","anomaly","pagerduty","9m ago",<Tag tone="warning">Warning</Tag>],
            ["k8s.pod_restart > 5","kube-prod","threshold","#sre","18m ago",<Tag tone="warning">Warning</Tag>],
            ["db.replication_lag","orders-pg","threshold","email","1h ago",<Tag tone="success">OK</Tag>],
            ["cdn.cache_miss","cdn","forecast","#cdn","3h ago",<Tag tone="success">OK</Tag>],
          ]}
        />
      </Panel>
    </div>
  );
}

function LogsViewer() {
  const [q, setQ] = useState("");
  const all = useMemo(() => Array.from({length:60}).map((_,i)=>{
    const lvl = ["INFO","WARN","ERROR","DEBUG"][Math.floor(Math.random()*4)];
    const svc = ["checkout","auth","ledger","search","cdn","ml-rank"][i%6];
    return { lvl, svc, t: `${i*2}s`, msg: `req=${Math.random().toString(16).slice(2,8)} status=${[200,200,200,500,429,200][i%6]} latency=${(Math.random()*200|0)}ms host=ip-10-0-${i%32}-${i%128}` };
  }), []);
  const filtered = all.filter(l => !q || (l.svc+l.msg+l.lvl).toLowerCase().includes(q.toLowerCase()));
  const toneOf = (lvl: string) => lvl==="ERROR"?"destructive":lvl==="WARN"?"warning":lvl==="DEBUG"?"info":"muted";
  return (
    <div className="space-y-3">
      <Panel title="Logs Explorer" right={
        <div className="flex items-center gap-2">
          <Tag tone="success">Live</Tag>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="service:checkout status:500"
            className="bg-muted/40 border border-border rounded px-2 py-1 text-xs font-mono w-72 outline-none focus:border-primary"/>
        </div>
      }>
        <div className="font-mono text-[11px] divide-y divide-border max-h-[520px] overflow-auto">
          {filtered.map((l,i)=>(
            <div key={i} className="flex gap-3 py-1.5 hover:bg-muted/30">
              <span className="text-muted-foreground w-12 shrink-0">{l.t}</span>
              <span className="w-14 shrink-0"><Tag tone={toneOf(l.lvl) as never}>{l.lvl}</Tag></span>
              <span className="text-info w-20 shrink-0">{l.svc}</span>
              <span className="text-foreground/90 truncate">{l.msg}</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function RealtimeMetrics() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-12 gap-3">
        <Panel title="Throughput" className="col-span-12 lg:col-span-6"><LineSeries seed={91} lines={2} height={180}/></Panel>
        <Panel title="Latency p50/p95/p99" className="col-span-12 lg:col-span-6"><LineSeries seed={92} lines={3} height={180}/></Panel>
        <Panel title="CPU per region" className="col-span-12 lg:col-span-6"><Bars seed={93} n={32} color="var(--color-primary)" height={140}/></Panel>
        <Panel title="Memory per region" className="col-span-12 lg:col-span-6"><Bars seed={94} n={32} color="var(--color-accent)" height={140}/></Panel>
      </div>
    </div>
  );
}

function SlaView() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="SLA target" value="99.95%" tone="info" spark={1}/>
        <Stat label="Achieved" value="99.972%" tone="success" spark={2}/>
        <Stat label="Error budget" value="38% left" tone="warning" spark={3}/>
        <Stat label="Time burned" value="14h 22m" tone="warning" spark={4}/>
      </div>
      <Panel title="SLO compliance per service">
        <DataTable
          columns={["Service","SLO","Achieved","Budget","Trend"]}
          rows={[
            ["checkout","99.95%","99.98%","48% left",<span className="text-success">▲</span>],
            ["payments","99.99%","99.91%","12% left",<span className="text-destructive">▼</span>],
            ["search","99.90%","99.94%","62% left",<span className="text-success">▲</span>],
            ["auth","99.95%","99.99%","88% left",<span className="text-success">▲</span>],
          ]}
        />
      </Panel>
    </div>
  );
}

function ErrorTracking() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Errors/min" value="184" tone="destructive" spark={1}/>
        <Stat label="Unique" value="42" tone="warning" spark={2}/>
        <Stat label="Resolved" value="118" tone="success" spark={3}/>
        <Stat label="Crash-free" value="99.84%" tone="success" spark={4}/>
      </div>
      <Panel title="Top error groups">
        <DataTable
          columns={["Type","Message","Service","Count","Users","Last seen"]}
          rows={[
            ["TypeError","Cannot read prop 'id' of null","web-app","2,148","412","12s ago"],
            ["TimeoutError","upstream es-3 timed out","search","1,082","284","42s ago"],
            ["DBError","deadlock detected","orders-pg","612","118","1m ago"],
            ["AuthError","invalid token signature","auth","318","42","2m ago"],
            ["NetworkError","ECONNRESET upstream","payments","148","18","4m ago"],
          ]}
        />
      </Panel>
    </div>
  );
}

function HeatmapView() {
  return (
    <div className="space-y-3">
      <Panel title="Latency heatmap · 24h × services">
        <Heatmap rows={12} cols={48} seed={101} color="var(--color-accent)"/>
      </Panel>
      <div className="grid grid-cols-12 gap-3">
        <Panel title="Errors heatmap" className="col-span-12 lg:col-span-6"><Heatmap rows={8} cols={32} seed={102} color="var(--color-destructive)"/></Panel>
        <Panel title="Saturation heatmap" className="col-span-12 lg:col-span-6"><Heatmap rows={8} cols={32} seed={103} color="var(--color-warning)"/></Panel>
      </div>
    </div>
  );
}

function WorldMapView() {
  return (
    <div className="space-y-3">
      <Panel title="Global edge map · live"><WorldMap seed={111} /></Panel>
      <Panel title="Region SLA">
        <DataTable
          columns={["Region","Edge POPs","RPS","p95","Errors","SLA"]}
          rows={REGIONS.slice(1).map((r,i)=>[
            r, `${12+i*2}`, `${(40-i*3)}k`, `${30+i*4}ms`, `${(0.01*i).toFixed(2)}%`,
            <Tag tone={i>6?"warning":"success"}>{(99.9-i*0.02).toFixed(2)}%</Tag>
          ])}
        />
      </Panel>
    </div>
  );
}

function NotificationCenter() {
  const items = [
    { tone:"destructive", t:"P1 Checkout 5xx surge", m:"Triggered · eu-west-1", time:"2m" },
    { tone:"warning", t:"DB replication lag", m:"orders-pg · us-east-1", time:"14m" },
    { tone:"info", t:"Deploy v2.84.1 success", m:"billing · canary 10%", time:"42m" },
    { tone:"success", t:"INC-4818 resolved", m:"by sre-oncall", time:"1h" },
    { tone:"warning", t:"Cert expires in 14d", m:"*.api.example.com", time:"2h" },
  ];
  return (
    <Panel title="Notification Center">
      <ul className="divide-y divide-border">
        {items.map((n,i)=>(
          <li key={i} className="flex items-start gap-3 py-2.5">
            <LiveDot tone={n.tone as never}/>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium">{n.t}</div>
              <div className="text-[11px] text-muted-foreground">{n.m}</div>
            </div>
            <span className="text-[10px] text-muted-foreground">{n.time} ago</span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

function AiInsights() {
  return (
    <div className="space-y-3">
      <Panel title="Watchdog · anomaly detection">
        <ul className="space-y-2 text-xs">
          {[
            ["Anomaly · checkout p95 +38% vs forecast","eu-west-1","destructive"],
            ["Forecast · disk full in 14d on node-184","platform","warning"],
            ["Correlation · payments errors ↔ ledger lag (r=0.92)","payments","info"],
            ["Outlier · 3 hosts with CPU > 95%","kube-prod","warning"],
          ].map(([t,svc,tone],i)=>(
            <li key={i} className="flex items-center justify-between bg-muted/30 border border-border rounded p-2">
              <div><div className="font-medium">{t}</div><div className="text-[10px] text-muted-foreground">{svc}</div></div>
              <Tag tone={tone as never}>AI</Tag>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}

function ActivityTimeline() {
  return (
    <Panel title="Activity timeline">
      <ol className="relative pl-5 space-y-3">
        <span className="absolute left-1.5 top-1 bottom-1 w-px bg-border" />
        {[
          ["08:42","Deploy v2.84.1 → billing canary","success"],
          ["08:38","INC-4821 opened · checkout 5xx","destructive"],
          ["08:24","Auto-scaler added 8 nodes (eu-west-1)","info"],
          ["08:12","Monitor muted · cdn.cache_miss (2h)","warning"],
          ["07:58","User dora@acme acked INC-4820","info"],
          ["07:42","Synthetic Tokyo recovered","success"],
        ].map(([t,msg,tone],i)=>(
          <li key={i} className="relative">
            <span className="absolute -left-3.5 top-1.5"><StatusDot tone={tone as never}/></span>
            <div className="text-xs"><span className="text-muted-foreground font-mono mr-2">{t}</span>{msg}</div>
          </li>
        ))}
      </ol>
    </Panel>
  );
}

function ExecReports() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Uptime · QTD" value="99.982%" tone="success" spark={1}/>
        <Stat label="Incidents · QTD" value="42" tone="warning" spark={2}/>
        <Stat label="Cost · MTD" value="$1.84M" tone="info" spark={3}/>
        <Stat label="Customer impact" value="0.04%" tone="success" spark={4}/>
      </div>
      <div className="grid grid-cols-12 gap-3">
        <Panel title="Reliability trend (90d)" className="col-span-12 lg:col-span-8"><LineSeries seed={121} lines={2} height={200}/></Panel>
        <Panel title="Top contributors" className="col-span-12 lg:col-span-4">
          <ul className="text-xs space-y-2">
            {[["payments-api",18],["checkout",14],["search",9],["ledger",6]].map(([n,p],i)=>(
              <li key={i}>
                <div className="flex justify-between"><span>{n as string}</span><span className="text-muted-foreground">{p} inc.</span></div>
                <ProgressBar value={(p as number)*4} />
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}

const VIEWS: Record<SectionId, () => React.ReactElement> = {
  overview: GlobalOverview, infra: LiveInfra, servers: ServerHealth, api: ApiMonitoring,
  db: DbMonitoring, ai: AiMonitoring, users: UserActivity, geo: GeoView,
  incidents: Incidents, alerts: AlertCenter, logs: LogsViewer, metrics: RealtimeMetrics,
  sla: SlaView, errors: ErrorTracking, heatmap: HeatmapView, worldmap: WorldMapView,
  notifications: NotificationCenter, insights: AiInsights, timeline: ActivityTimeline, reports: ExecReports,
};

/* ============================================================
   SHELL
   ============================================================ */

export function CommandCenter({ d: _d }: { d: DashSpec }) {
  const [section, setSection] = useState<SectionId>("overview");
  const [role, setRole] = useState<RoleId>("admin");
  const [region, setRegion] = useState("Global");
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const visibleSections = useMemo(() => {
    const allowed = new Set(ROLES.find(r => r.id === role)?.scope ?? []);
    return SECTIONS.filter(s => allowed.has(s.id));
  }, [role]);

  useEffect(() => {
    if (!visibleSections.find(s => s.id === section)) setSection(visibleSections[0]?.id ?? "overview");
  }, [role, visibleSections, section]);

  const grouped = useMemo(() => {
    const m = new Map<string, typeof visibleSections>();
    for (const s of visibleSections) {
      if (!m.has(s.group)) m.set(s.group, [] as never);
      (m.get(s.group) as typeof visibleSections).push(s);
    }
    return Array.from(m.entries());
  }, [visibleSections]);

  const View = VIEWS[section];
  const currentRole = ROLES.find(r => r.id === role)!;
  const currentSection = SECTIONS.find(s => s.id === section)!;

  return (
    <div className="flex h-screen min-h-0 bg-background text-foreground">
      {/* Inner sidebar */}
      <aside className="w-60 shrink-0 border-r border-border bg-sidebar/60 flex flex-col">
        <div className="px-3 h-12 flex items-center gap-2 border-b border-border">
          <div className="w-7 h-7 rounded bg-primary/20 border border-primary/40 grid place-items-center">
            <Icons.Radar className="w-3.5 h-3.5 text-primary"/>
          </div>
          <div>
            <div className="text-[11px] font-semibold tracking-wider uppercase">Command Center</div>
            <div className="text-[9px] text-muted-foreground">Datadog Enterprise</div>
          </div>
        </div>
        <div className="px-2 py-2 border-b border-border">
          <label className="text-[9px] uppercase tracking-wider text-muted-foreground px-1">Role</label>
          <select value={role} onChange={e=>setRole(e.target.value as RoleId)}
            className="mt-1 w-full bg-muted/40 border border-border rounded px-2 py-1.5 text-xs outline-none focus:border-primary">
            {ROLES.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
          </select>
        </div>
        <nav className="flex-1 overflow-y-auto py-2">
          {grouped.map(([g, items]) => (
            <div key={g} className="px-2 pb-2">
              <div className="text-[9px] uppercase tracking-wider text-muted-foreground px-2 py-1">{g}</div>
              {items.map(s => {
                const Icon = Icons[s.icon] as Icons.LucideIcon;
                const active = s.id === section;
                return (
                  <button key={s.id} onClick={()=>setSection(s.id)}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-[12px] transition-colors ${
                      active ? "bg-primary/15 text-primary border-l-2 border-primary" : "hover:bg-muted/40 text-foreground/80 border-l-2 border-transparent"
                    }`}>
                    <Icon className="w-3.5 h-3.5 shrink-0"/>
                    <span className="truncate">{s.label}</span>
                    {active && <LiveDot tone="success" />}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="border-t border-border p-2 text-[10px] text-muted-foreground space-y-1">
          <div className="flex items-center justify-between"><span>Mode</span><Tag tone="primary">RBAC</Tag></div>
          <div className="flex items-center justify-between"><span>Tenant</span><span className="font-mono text-foreground">acme-prod</span></div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="h-12 border-b border-border flex items-center gap-3 px-4 bg-card/40">
          <div className="flex items-center gap-2 min-w-0">
            <Icons.ChevronRight className="w-3 h-3 text-muted-foreground"/>
            <span className="text-[11px] text-muted-foreground">{currentRole.label}</span>
            <Icons.ChevronRight className="w-3 h-3 text-muted-foreground"/>
            <span className="text-xs font-medium truncate">{currentSection.label}</span>
          </div>
          <div className="flex-1 max-w-xl mx-auto">
            <div className="relative">
              <Icons.Search className="absolute left-2 top-2 w-3.5 h-3.5 text-muted-foreground"/>
              <input placeholder="Search hosts, services, traces, logs… (⌘K)"
                className="w-full bg-muted/40 border border-border rounded pl-7 pr-2 py-1.5 text-xs outline-none focus:border-primary"/>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select value={region} onChange={e=>setRegion(e.target.value)}
              className="bg-muted/40 border border-border rounded px-2 py-1 text-[11px] outline-none focus:border-primary">
              {REGIONS.map(r=> <option key={r}>{r}</option>)}
            </select>
            <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground border border-border rounded px-2 py-1">
              <LiveDot tone="success" /> Live
            </span>
            <span className="text-[11px] font-mono text-muted-foreground tabular-nums">
              {now.toISOString().slice(11,19)} UTC
            </span>
            <button className="relative p-1.5 rounded hover:bg-muted/40">
              <Icons.Bell className="w-4 h-4"/>
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 grid place-items-center rounded-full bg-destructive text-[8px] text-destructive-foreground font-bold">3</span>
            </button>
            <button className="p-1.5 rounded hover:bg-muted/40"><Icons.Settings className="w-4 h-4"/></button>
            <div className="flex items-center gap-2 pl-2 border-l border-border">
              <Avatar name="Op Lead" />
              <div className="text-[11px] leading-tight hidden md:block">
                <div className="font-medium">Op Lead</div>
                <div className="text-muted-foreground">sre@acme.io</div>
              </div>
            </div>
          </div>
        </header>

        {/* Status strip */}
        <div className="h-8 border-b border-border bg-muted/20 flex items-center px-4 gap-4 text-[11px] overflow-x-auto">
          {[
            ["us-east-1","success"],["us-west-2","success"],["eu-west-1","warning"],["eu-central-1","success"],
            ["ap-northeast-1","success"],["ap-southeast-1","success"],["sa-east-1","success"],["me-south-1","info"]
          ].map(([r,t],i)=>(
            <span key={i} className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <StatusDot tone={t as never}/><span className="text-muted-foreground">{r}</span>
            </span>
          ))}
          <span className="ml-auto text-muted-foreground">Edge POPs <span className="text-foreground font-mono">184</span></span>
          <span className="text-muted-foreground">Synthetics <span className="text-success font-mono">99.97%</span></span>
        </div>

        {/* Body */}
        <main className="flex-1 overflow-auto p-4">
          <View />
        </main>
      </div>
    </div>
  );
}
