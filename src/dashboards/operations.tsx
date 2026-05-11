import * as Icons from "lucide-react";
import type { DashSpec } from "@/data/dashboards";
import { Shell, Card, WorldMap, Bars, Spark, Donut, DataTable, StatusDot, Pill, Heatmap, Timeline, ProgressBar, LineSeries, Terminal } from "./_primitives";

/* ---------- 1. Global Command Center / Datadog ---------- */
export function CommandCenter({ d }: { d: DashSpec }) {
  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <Card title="Service Map · APAC ↔ NA ↔ EU" className="col-span-12 lg:col-span-8">
          <WorldMap seed={1} />
        </Card>
        <Card title="Golden Signals" className="col-span-12 lg:col-span-4">
          {[["Latency p95","42ms","success"],["Errors","0.04%","success"],["Saturation","68%","warning"],["Traffic","284k req/s","info"]].map(([k,v,t],i)=>(
            <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div className="text-xs text-muted-foreground">{k}</div>
              <div className="flex items-center gap-2"><Pill tone={t as never}>{v}</Pill></div>
            </div>
          ))}
        </Card>
        <Card title="Live Logs Stream" className="col-span-12 lg:col-span-7">
          <Terminal lines={[
            { t: "[INFO] svc=checkout req=8af3 latency=18ms 200", tone: "muted" },
            { t: "[WARN] svc=auth retries=3 host=ip-10-0-2-14", tone: "warning" },
            { t: "[INFO] svc=ledger txn=ok amount=$248.10", tone: "muted" },
            { t: "[ERROR] svc=search timeout=2500ms upstream=es-3", tone: "destructive" },
            { t: "[INFO] svc=cdn purge keys=412 region=eu-west-2", tone: "info" },
            { t: "[INFO] svc=ml-rank scored=4128 cache=hit", tone: "muted" },
            { t: "[OK] deploy=v2.84.1 svc=billing canary=10%", tone: "success" },
          ]} />
        </Card>
        <Card title="Active Incidents" className="col-span-12 lg:col-span-5">
          <Timeline items={[
            { time:"2m", title:"P2 · Checkout latency spike (eu-west-1)", tone:"warning" },
            { time:"14m", title:"P3 · Cache miss ratio above SLO", tone:"warning" },
            { time:"42m", title:"P1 · Payment auth degraded RESOLVED", tone:"success" },
            { time:"1h", title:"P4 · Synthetic check failed Tokyo", tone:"info" },
          ]} />
        </Card>
        <Card title="Resource Pools" className="col-span-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {["CPU","Memory","Disk I/O","Network"].map((k,i)=>(
              <div key={k} className="p-3 rounded-md bg-muted/30 border border-border">
                <div className="flex items-center justify-between text-xs"><span>{k}</span><span className="text-muted-foreground">{[68,74,42,86][i]}%</span></div>
                <div className="mt-2"><ProgressBar value={[68,74,42,86][i]} color={["var(--color-primary)","var(--color-accent)","var(--color-success)","var(--color-warning)"][i]} /></div>
                <div className="mt-2 text-primary"><Spark seed={i+2}/></div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Shell>
  );
}

/* ---------- 8. Notification & Alert Center / PagerDuty ---------- */
export function Alerts({ d }: { d: DashSpec }) {
  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <Card title="Live Incident Wall" className="col-span-12 lg:col-span-8">
          <div className="space-y-2">
            {[
              { id:"INC-4128", t:"Checkout API · 5xx surge", sev:"P1", who:"akira.k", age:"3m", tone:"destructive" },
              { id:"INC-4127", t:"Auth latency over SLO", sev:"P2", who:"meera.s", age:"12m", tone:"warning" },
              { id:"INC-4126", t:"Stripe webhook backlog", sev:"P2", who:"diego.r", age:"22m", tone:"warning" },
              { id:"INC-4125", t:"Synthetic check failed (Tokyo)", sev:"P3", who:"on-call", age:"42m", tone:"info" },
            ].map((i)=>(
              <div key={i.id} className="flex items-center gap-3 p-3 rounded-md border border-border bg-card">
                <Pill tone={i.tone as never}>{i.sev}</Pill>
                <div className="flex-1">
                  <div className="text-sm font-medium">{i.t}</div>
                  <div className="text-[10px] text-muted-foreground">{i.id} · acked by {i.who} · {i.age} ago</div>
                </div>
                <button className="text-xs px-2 py-1 rounded bg-muted">Acknowledge</button>
                <button className="text-xs px-2 py-1 rounded bg-primary text-primary-foreground">Resolve</button>
              </div>
            ))}
          </div>
        </Card>
        <Card title="On-Call Rotation" className="col-span-12 lg:col-span-4">
          <div className="space-y-2 text-xs">
            {["Platform · akira.k","Payments · meera.s","Data · diego.r","Mobile · luna.t"].map((t,i)=>(
              <div key={i} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                <div className="flex items-center gap-2"><StatusDot tone={i===0?"destructive":"success"}/>{t}</div>
                <span className="text-muted-foreground">until {18+i}:00</span>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Escalation Policies" className="col-span-12 md:col-span-6">
          <DataTable columns={["Policy","Tier","Targets","SLA"]} rows={[
            ["Tier-1 Production","Critical","SRE → Director → CTO","5m"],
            ["Tier-2 Internal","High","Service Owner","15m"],
            ["Customer Facing","Critical","Eng + Support Lead","5m"],
            ["Data Pipeline","Medium","Data On-call","30m"],
          ]} />
        </Card>
        <Card title="MTTA/MTTR Trend · 30d" className="col-span-12 md:col-span-6">
          <LineSeries seed={3} lines={2} />
        </Card>
      </div>
    </Shell>
  );
}

/* ---------- 24. Monitoring & Observability / Datadog ---------- */
export function Observability({ d }: { d: DashSpec }) {
  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <Card title="Metrics · 4 services overlaid" className="col-span-12 lg:col-span-8"><LineSeries seed={5} lines={4} height={220}/></Card>
        <Card title="APM Top Endpoints" className="col-span-12 lg:col-span-4">
          {["GET /v1/orders","POST /v1/checkout","GET /v1/search","POST /v1/auth/login","GET /v1/feed"].map((e,i)=>(
            <div key={e} className="py-1.5 border-b border-border last:border-0">
              <div className="flex items-center justify-between text-xs"><span className="font-mono">{e}</span><span className="text-muted-foreground">{[14,42,28,8,18][i]}ms</span></div>
              <ProgressBar value={[40,86,58,18,32][i]} />
            </div>
          ))}
        </Card>
        <Card title="Log Volume Heatmap · 7d × 24h" className="col-span-12 lg:col-span-7"><Heatmap seed={9} /></Card>
        <Card title="Trace Flame · /checkout" className="col-span-12 lg:col-span-5">
          <div className="space-y-1.5">
            {[["api-gateway",100],["auth.verify",18],["cart.fetch",24],["pricing.calc",12],["payment.charge",42],["receipt.send",8]].map(([n,w],i)=>(
              <div key={i} className="flex items-center gap-2"><div className="text-[10px] w-28 text-muted-foreground font-mono">{n}</div><div className="flex-1 h-3 rounded" style={{ width:`${w}%`, background:`linear-gradient(90deg,var(--color-primary),var(--color-accent))` }}/><div className="text-[10px] text-muted-foreground w-10 text-right">{w}ms</div></div>
            ))}
          </div>
        </Card>
        <Card title="Monitors" className="col-span-12">
          <DataTable columns={["Name","Type","Status","Triggered","Owner"]} rows={[
            ["High 5xx rate","Metric",<Pill key="a" tone="destructive">Alert</Pill>,"3m ago","sre"],
            ["DB connections > 80%","Metric",<Pill key="b" tone="warning">Warn</Pill>,"22m ago","dba"],
            ["Synthetic checkout","Synth",<Pill key="c" tone="success">OK</Pill>,"—","qa"],
            ["Cert expiry < 30d","Custom",<Pill key="d" tone="info">Info</Pill>,"2d ago","sec"],
          ]} />
        </Card>
      </div>
    </Shell>
  );
}

/* ---------- 25. Geo Monitoring ---------- */
export function GeoMonitoring({ d }: { d: DashSpec }) {
  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <Card title="Global Edge Topology" className="col-span-12"><WorldMap seed={4} /></Card>
        <Card title="Regions" className="col-span-12 md:col-span-6">
          <DataTable columns={["Region","POPs","p95","Status"]} rows={[
            ["us-east-1","48","38ms",<Pill key="1" tone="success">Healthy</Pill>],
            ["eu-west-1","42","42ms",<Pill key="2" tone="success">Healthy</Pill>],
            ["ap-south-1","28","58ms",<Pill key="3" tone="warning">Degraded</Pill>],
            ["sa-east-1","18","82ms",<Pill key="4" tone="info">OK</Pill>],
          ]} />
        </Card>
        <Card title="Anycast BGP Health" className="col-span-12 md:col-span-6">
          <Bars seed={11} n={28} color="var(--color-info)" />
        </Card>
      </div>
    </Shell>
  );
}

/* ---------- 26. NOC / Cisco ---------- */
export function NOC({ d }: { d: DashSpec }) {
  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <Card title="Network Topology" className="col-span-12 lg:col-span-8">
          <div className="relative h-72 rounded-md border border-border grid-bg overflow-hidden">
            <svg className="absolute inset-0 w-full h-full">
              {[[20,50,50,30],[50,30,80,50],[50,30,50,70],[20,50,50,70],[80,50,50,70],[50,70,30,90],[50,70,70,90]].map((c,i)=>(
                <line key={i} x1={`${c[0]}%`} y1={`${c[1]}%`} x2={`${c[2]}%`} y2={`${c[3]}%`} stroke="var(--color-primary)" strokeWidth="1" opacity="0.5"/>
              ))}
            </svg>
            {[["Core",50,30],["DC-W",20,50],["DC-E",80,50],["Edge-1",50,70],["LAN-N",30,90],["LAN-S",70,90]].map(([n,x,y],i)=>(
              <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2 px-2 py-1 rounded-md bg-card border border-primary/40 text-[10px] font-mono" style={{ left:`${x}%`, top:`${y}%` }}>{n}</div>
            ))}
          </div>
        </Card>
        <Card title="Link Utilization" className="col-span-12 lg:col-span-4">
          {["Backbone-A","Backbone-B","ISP-1","ISP-2","Peer-AMS"].map((l,i)=>(
            <div key={l} className="py-1.5">
              <div className="flex justify-between text-xs"><span className="font-mono">{l}</span><span>{[68,42,86,12,58][i]}%</span></div>
              <ProgressBar value={[68,42,86,12,58][i]} color={i===2?"var(--color-warning)":"var(--color-info)"} />
            </div>
          ))}
        </Card>
        <Card title="SNMP Trap Stream" className="col-span-12">
          <Terminal lines={[
            { t:"linkDown ifIndex=42 host=core-rtr-1", tone:"warning" },
            { t:"bgpEstablished neighbor=10.0.0.5 as=64512", tone:"success" },
            { t:"cpu high host=edge-sw-3 value=82%", tone:"warning" },
            { t:"linkUp ifIndex=42 host=core-rtr-1", tone:"success" },
            { t:"authFailure host=mgmt-sw-1 user=admin", tone:"destructive" },
          ]}/>
        </Card>
      </div>
    </Shell>
  );
}

/* ---------- 30. Backup & DR / Veeam ---------- */
export function Backup({ d }: { d: DashSpec }) {
  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <Card title="Job Calendar · 7d" className="col-span-12 lg:col-span-8"><Heatmap rows={7} cols={24} seed={6} color="var(--color-success)"/></Card>
        <Card title="RPO / RTO" className="col-span-12 lg:col-span-4 grid grid-cols-2 gap-3 place-items-center">
          <Donut value={94} label="RPO met" color="var(--color-success)"/>
          <Donut value={88} label="RTO met" color="var(--color-info)"/>
        </Card>
        <Card title="Repositories" className="col-span-12 md:col-span-6">
          {[["Primary · S3","78%"],["Immutable Vault","42%"],["Tape Out","12%"],["Air-gap","6%"]].map(([n,v],i)=>(
            <div key={i} className="py-1.5"><div className="flex justify-between text-xs"><span>{n}</span><span>{v}</span></div><ProgressBar value={parseInt(v)} color="var(--color-success)"/></div>
          ))}
        </Card>
        <Card title="Recent Jobs" className="col-span-12 md:col-span-6">
          <DataTable columns={["Job","VMs","Size","Status"]} rows={[
            ["Daily-Prod","148","2.4 TB",<Pill key="a" tone="success">OK</Pill>],
            ["Hourly-DB","12","412 GB",<Pill key="b" tone="success">OK</Pill>],
            ["Weekly-Arch","48","8.1 TB",<Pill key="c" tone="warning">Retry</Pill>],
            ["DR-Replica","82","1.8 TB",<Pill key="d" tone="success">OK</Pill>],
          ]}/>
        </Card>
      </div>
    </Shell>
  );
}

/* ---------- 31. Licenses ---------- */
export function Licenses({ d }: { d: DashSpec }) {
  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <Card title="Activation Trend" className="col-span-12 lg:col-span-8"><LineSeries seed={2} lines={2}/></Card>
        <Card title="Compliance" className="col-span-12 lg:col-span-4 grid place-items-center"><Donut value={98} label="entitled" color="var(--color-success)"/></Card>
        <Card title="Expiring Soon (90d)" className="col-span-12">
          <DataTable columns={["Customer","Product","Seats","Expires","Action"]} rows={Array.from({length:6}).map((_,i)=>[
            `Acme-${i+1}`,["Pro","Studio","Enterprise","Edge","Lite","Studio"][i],`${(i+1)*100}`,`${22+i}d`,<Pill key={i} tone="warning">Renew</Pill>
          ])}/>
        </Card>
      </div>
    </Shell>
  );
}

/* ---------- 32. MDM / Intune ---------- */
export function MDM({ d }: { d: DashSpec }) {
  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <Card title="Device Mix" className="col-span-12 lg:col-span-4">
          {[["Windows",42,"primary"],["macOS",24,"info"],["iOS",22,"accent"],["Android",12,"success"]].map(([n,v,t],i)=>(
            <div key={i} className="py-1.5"><div className="flex justify-between text-xs"><span>{n}</span><span>{v}%</span></div><ProgressBar value={v as number} color={`var(--color-${t})`}/></div>
          ))}
        </Card>
        <Card title="Compliance Posture · 30d" className="col-span-12 lg:col-span-8"><LineSeries seed={7} lines={3}/></Card>
        <Card title="Devices" className="col-span-12">
          <DataTable columns={["Device","User","OS","Last Sync","Compliance"]} rows={Array.from({length:7}).map((_,i)=>[
            `WIN-${1000+i}`,`user${i+1}@nexus.io`,["Win11","macOS 14","iOS 17","Android 14"][i%4],`${i+1}m ago`,
            i===2?<Pill key={i} tone="destructive">Non-compliant</Pill>:<Pill key={i} tone="success">Compliant</Pill>
          ])}/>
        </Card>
      </div>
    </Shell>
  );
}

/* ---------- 33. Remote Access ---------- */
export function RemoteAccess({ d }: { d: DashSpec }) {
  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <Card title="Live Sessions" className="col-span-12 lg:col-span-8">
          <DataTable columns={["Session","Tech","Customer","Region","Latency","Duration"]} rows={Array.from({length:7}).map((_,i)=>[
            `S-${48201+i}`,`tech${i+1}`,`cust-${100+i}`,["EU","NA","APAC","LATAM"][i%4],`${28+i*4}ms`,`${i+1}m`
          ])}/>
        </Card>
        <Card title="Endpoints by OS" className="col-span-12 lg:col-span-4 grid place-items-center">
          <Donut value={82} label="online" color="var(--color-primary)"/>
        </Card>
        <Card title="Session Recordings" className="col-span-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Array.from({length:4}).map((_,i)=>(
              <div key={i} className="rounded-md border border-border bg-muted/30 aspect-video grid place-items-center relative overflow-hidden">
                <Icons.Play className="w-8 h-8 text-primary"/>
                <div className="absolute bottom-1 left-2 text-[10px]">SES-{4128+i}</div>
                <div className="absolute bottom-1 right-2 text-[10px] text-muted-foreground">{4+i}:12</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Shell>
  );
}

/* ---------- 34. Infra / vCenter ---------- */
export function Infra({ d }: { d: DashSpec }) {
  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <Card title="Clusters" className="col-span-12 lg:col-span-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Array.from({length:8}).map((_,i)=>(
              <div key={i} className="p-3 rounded-md border border-border bg-muted/20">
                <div className="text-[10px] text-muted-foreground">CLUSTER-{i+1}</div>
                <div className="text-lg font-semibold">{12+i*2} hosts</div>
                <div className="text-[10px] text-muted-foreground">{(i+1)*148} VMs</div>
                <div className="mt-2 text-info"><Spark seed={i+3}/></div>
              </div>
            ))}
          </div>
        </Card>
        <Card title="DRS Score" className="col-span-12 lg:col-span-4 grid place-items-center"><Donut value={96} label="balanced" color="var(--color-info)"/></Card>
        <Card title="vSAN Capacity" className="col-span-12">
          <div className="flex h-8 rounded overflow-hidden border border-border">
            <div style={{ width:"42%", background:"var(--color-primary)" }} className="grid place-items-center text-[10px] text-primary-foreground">Used 5.2 PB</div>
            <div style={{ width:"18%", background:"var(--color-warning)" }} className="grid place-items-center text-[10px]">Reserved</div>
            <div style={{ width:"40%", background:"var(--color-muted)" }} className="grid place-items-center text-[10px] text-muted-foreground">Free 4.9 PB</div>
          </div>
        </Card>
      </div>
    </Shell>
  );
}

/* ---------- 35. Cloud / Control Tower ---------- */
export function CloudOps({ d }: { d: DashSpec }) {
  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <Card title="Landing Zone Map" className="col-span-12"><WorldMap seed={8} accent="var(--color-warning)"/></Card>
        <Card title="Accounts by OU" className="col-span-12 md:col-span-6">
          <DataTable columns={["OU","Accounts","Guardrails","Drift"]} rows={[
            ["Production","248","412",<Pill key="a" tone="success">0</Pill>],
            ["Sandbox","412","148",<Pill key="b" tone="warning">2</Pill>],
            ["Security","12","412",<Pill key="c" tone="success">0</Pill>],
            ["Workloads","148","312",<Pill key="d" tone="warning">1</Pill>],
          ]}/>
        </Card>
        <Card title="Cost by Region · MTD" className="col-span-12 md:col-span-6"><Bars seed={4} n={24} color="var(--color-warning)"/></Card>
      </div>
    </Shell>
  );
}

/* ---------- 50. Printing ---------- */
export function Printing({ d }: { d: DashSpec }) {
  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <Card title="Printer Fleet" className="col-span-12 lg:col-span-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Array.from({length:8}).map((_,i)=>(
              <div key={i} className="p-3 rounded-md border border-border bg-muted/20">
                <div className="flex items-center justify-between"><Icons.Printer className="w-4 h-4 text-warning"/><StatusDot tone={i===3?"destructive":"success"}/></div>
                <div className="mt-1 text-xs font-semibold">HP-LJ-{4000+i}</div>
                <div className="text-[10px] text-muted-foreground">Floor {i+1} · {i===3?"Out of toner":"Ready"}</div>
                <div className="mt-2"><ProgressBar value={i===3?12:60+i*3} color={i===3?"var(--color-destructive)":"var(--color-warning)"}/></div>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Eco Savings" className="col-span-12 lg:col-span-4 grid place-items-center"><Donut value={24} label="paper saved" color="var(--color-success)"/></Card>
        <Card title="Pages by Department · 30d" className="col-span-12"><Bars seed={9} n={30} color="var(--color-warning)"/></Card>
      </div>
    </Shell>
  );
}

/* ---------- 88. OS Control / Windows Admin Center ---------- */
export function OSControl({ d }: { d: DashSpec }) {
  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <Card title="Server Inventory" className="col-span-12 lg:col-span-8">
          <DataTable columns={["Hostname","Role","OS","CPU","Mem","Patches","Status"]} rows={Array.from({length:8}).map((_,i)=>[
            `WIN-SRV-${1000+i}`,["Hyper-V","File","DC","SQL","IIS","Cluster"][i%6],"WS 2022",`${22+i*3}%`,`${42+i*2}%`,`${i}`,
            i===4?<Pill key={i} tone="warning">Reboot</Pill>:<Pill key={i} tone="success">OK</Pill>
          ])}/>
        </Card>
        <Card title="Update Compliance" className="col-span-12 lg:col-span-4 grid place-items-center"><Donut value={99} label="patched" color="var(--color-info)"/></Card>
        <Card title="Hyper-V Hosts · CPU 1h" className="col-span-12"><LineSeries seed={6} lines={4}/></Card>
      </div>
    </Shell>
  );
}
