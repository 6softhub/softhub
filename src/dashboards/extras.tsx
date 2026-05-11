import * as Icons from "lucide-react";
import type { DashSpec } from "@/data/dashboards";
import { Shell, Card, DataTable, Pill, Donut, Bars, LineSeries, ProgressBar, Heatmap, Timeline, StatusDot, WorldMap, Terminal, Spark, Avatar } from "./_primitives";

const grid = "grid grid-cols-12 gap-4";

/* 15. Analytics / Tableau */
export function Analytics({ d }: { d: DashSpec }) {
  return <Shell d={d}><div className={grid}>
    <Card title="Workbook · Revenue Pulse" className="col-span-12 lg:col-span-8"><LineSeries seed={1} lines={4} height={220}/></Card>
    <Card title="Refresh Schedules" className="col-span-12 lg:col-span-4">{["Daily 03:00","Hourly","Weekly Mon","Stream"].map((s,i)=>(<div key={s} className="flex justify-between py-2 border-b border-border last:border-0 text-xs"><span>{s}</span><Pill tone={i===2?"warning":"success"}>{i===2?"Late":"OK"}</Pill></div>))}</Card>
    <Card title="Workbooks" className="col-span-12"><DataTable columns={["Name","Owner","Datasource","Views","Updated"]} rows={Array.from({length:6}).map((_,i)=>[`WB-${i+1}`,`u${i+1}`,["Snowflake","BigQuery","Postgres","Sheets","CSV","S3"][i],`${(i+1)*412}`,`${i+1}h`])}/></Card>
  </div></Shell>;
}

/* 16. Reporting / Power BI */
export function Reporting({ d }: { d: DashSpec }) {
  return <Shell d={d}><div className={grid}>
    <Card title="Executive Goals" className="col-span-12 lg:col-span-8">{["Revenue $30M","Margin 38%","NRR 120%","CSAT 95"].map((g,i)=>(<div key={g} className="py-2 border-b border-border last:border-0"><div className="flex justify-between text-xs"><span>{g}</span><span>{[78,92,98,86][i]}%</span></div><ProgressBar value={[78,92,98,86][i]} color="var(--color-warning)"/></div>))}</Card>
    <Card title="Capacity P3" className="col-span-12 lg:col-span-4 grid place-items-center"><Donut value={68} label="utilized" color="var(--color-warning)"/></Card>
    <Card title="Reports" className="col-span-12"><Bars seed={4} n={28} color="var(--color-warning)"/></Card>
  </div></Shell>;
}

/* 17. AI Copilot / Palantir AIP */
export function AICopilot({ d }: { d: DashSpec }) {
  return <Shell d={d}><div className={grid}>
    <Card title="Agent Studio · Live Runs" className="col-span-12 lg:col-span-8"><Terminal lines={[
      { t:"agent=triage step=plan tools=[search,jira] ms=412", tone:"info" },
      { t:"agent=triage step=tool tool=jira.search results=12", tone:"muted" },
      { t:"agent=summarize tokens_in=4128 tokens_out=812", tone:"info" },
      { t:"eval=helpful score=0.94 pass=true", tone:"success" },
      { t:"guardrail=pii action=redact field=email count=3", tone:"warning" },
    ]}/></Card>
    <Card title="Eval Pass Rate" className="col-span-12 lg:col-span-4 grid place-items-center"><Donut value={96} label="passing" color="var(--color-accent)"/></Card>
    <Card title="Tool Registry" className="col-span-12"><DataTable columns={["Tool","Calls/d","p95","Owner"]} rows={[["jira.search","48k","82ms","platform"],["snowflake.query","12k","412ms","data"],["github.pr","8k","118ms","eng"],["slack.post","42k","42ms","platform"]]}/></Card>
  </div></Shell>;
}

/* 36. Digital Twin / Foundry */
export function DigitalTwin({ d }: { d: DashSpec }) {
  return <Shell d={d}><div className={grid}>
    <Card title="Ontology Graph" className="col-span-12 lg:col-span-8"><div className="relative h-72 grid-bg rounded border border-border overflow-hidden"><svg className="absolute inset-0 w-full h-full">{Array.from({length:18}).map((_,i)=>{const x1=10+Math.random()*80,y1=10+Math.random()*80,x2=10+Math.random()*80,y2=10+Math.random()*80;return<line key={i} x1={`${x1}%`} y1={`${y1}%`} x2={`${x2}%`} y2={`${y2}%`} stroke="var(--color-accent)" strokeWidth="0.5" opacity="0.5"/>;})}</svg>{Array.from({length:14}).map((_,i)=>(<div key={i} className="absolute w-3 h-3 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)] -translate-x-1/2 -translate-y-1/2" style={{left:`${10+Math.random()*80}%`,top:`${10+Math.random()*80}%`}}/>))}</div></Card>
    <Card title="Pipelines" className="col-span-12 lg:col-span-4">{["Refine · Customer","Build · Inventory","Materialize · Forecast","Stream · Telemetry"].map((p,i)=>(<div key={p} className="py-1.5 text-xs"><div className="flex justify-between"><span>{p}</span><Pill tone={i===2?"warning":"success"}>{i===2?"Building":"Healthy"}</Pill></div></div>))}</Card>
  </div></Shell>;
}

/* 39. War Room / Gotham */
export function WarRoom({ d }: { d: DashSpec }) {
  return <Shell d={d}><div className={grid}>
    <Card title="Live Operations Map" className="col-span-12 lg:col-span-8"><WorldMap seed={6} accent="var(--color-destructive)"/></Card>
    <Card title="Active Briefings" className="col-span-12 lg:col-span-4"><Timeline items={[{time:"15m",title:"OP-NEPTUNE · phase 2 active",tone:"destructive"},{time:"1h",title:"OP-AURORA · standby",tone:"warning"},{time:"3h",title:"OP-VANTAGE · concluded",tone:"success"}]}/></Card>
    <Card title="Asset Tracker" className="col-span-12"><DataTable columns={["Asset","Type","Region","Status","Comms"]} rows={Array.from({length:6}).map((_,i)=>[`AST-${4128+i}`,["Drone","Vehicle","Team","Sensor","Comms","Drone"][i],["EU","NA","APAC","ME","LATAM","EU"][i],<Pill key={i} tone={i===2?"warning":"success"}>{i===2?"Degraded":"Active"}</Pill>,<StatusDot key={i} tone="success"/>])}/></Card>
  </div></Shell>;
}

/* 40. Master Control / Jarvis */
export function MasterControl({ d }: { d: DashSpec }) {
  return <Shell d={d}><div className={grid}>
    <Card title="75 Subsystems · Health Matrix" className="col-span-12"><div className="grid grid-cols-15 md:grid-cols-25 gap-1" style={{gridTemplateColumns:"repeat(25,1fr)"}}>{Array.from({length:75}).map((_,i)=><div key={i} className="aspect-square rounded-sm" style={{background:i===17||i===42?"var(--color-warning)":"var(--color-success)",opacity:0.3+Math.random()*0.7}} title={`#${i+1}`}/>)}</div></Card>
    <Card title="Core Telemetry" className="col-span-12 lg:col-span-8"><LineSeries seed={9} lines={4} height={200}/></Card>
    <Card title="Autonomy Level" className="col-span-12 lg:col-span-4 grid place-items-center"><Donut value={99} label="L4" color="var(--color-accent)"/></Card>
    <Card title="Override Console" className="col-span-12"><Terminal lines={[{t:"jarvis> sys status — 75/75 nominal",tone:"success"},{t:"jarvis> ai.brain.load 84%",tone:"info"},{t:"jarvis> failsafe armed · ack required",tone:"warning"},{t:"jarvis> awaiting command…",tone:"muted"}]}/></Card>
  </div></Shell>;
}

/* 18. DevOps / GitLab */
export function DevOps({ d }: { d: DashSpec }) {
  return <Shell d={d}><div className={grid}>
    <Card title="Pipelines · Live" className="col-span-12 lg:col-span-8"><div className="space-y-2">{[["#48201","main","build → test → deploy","success"],["#48200","feat/auth","build → test","warning"],["#48199","main","build → test → deploy","success"],["#48198","fix/cors","build (failed)","destructive"]].map((p,i)=>(<div key={i} className="flex items-center gap-3 p-3 border border-border rounded-md bg-card"><Pill tone={p[3] as never}>{p[3]==="success"?"✓":p[3]==="destructive"?"✗":"●"}</Pill><div className="font-mono text-xs">{p[0]}</div><div className="text-xs text-muted-foreground">{p[1]}</div><div className="flex-1 text-xs">{p[2]}</div><div className="text-[10px] text-muted-foreground">{i+1}m ago</div></div>))}</div></Card>
    <Card title="DORA" className="col-span-12 lg:col-span-4">{[["Lead Time","42m"],["Deploy Freq","312/d"],["MTTR","12m"],["Change Fail","2%"]].map(([k,v],i)=>(<div key={i} className="flex justify-between py-2 border-b border-border last:border-0 text-xs"><span>{k}</span><span className="font-semibold">{v}</span></div>))}</Card>
    <Card title="Runners" className="col-span-12"><Bars seed={2} n={24} color="var(--color-warning)"/></Card>
  </div></Shell>;
}

/* 19. Repos / GitHub */
export function Repos({ d }: { d: DashSpec }) {
  return <Shell d={d}><div className={grid}>
    <Card title="Repositories" className="col-span-12 lg:col-span-8"><DataTable columns={["Repo","Lang","Stars","PRs","Issues","CI"]} rows={[["nexus/platform","TS","12.4k","42","148",<Pill key="a" tone="success">✓</Pill>],["nexus/web","TS","8.2k","18","82",<Pill key="b" tone="success">✓</Pill>],["nexus/ml","Py","4.1k","12","42",<Pill key="c" tone="warning">●</Pill>],["nexus/edge","Rust","2.8k","8","18",<Pill key="d" tone="success">✓</Pill>]]}/></Card>
    <Card title="Copilot Use" className="col-span-12 lg:col-span-4 grid place-items-center"><Donut value={82} label="acceptance" color="var(--color-primary)"/></Card>
    <Card title="Contribution Heat" className="col-span-12"><Heatmap rows={7} cols={52} seed={3} color="var(--color-success)"/></Card>
  </div></Shell>;
}

/* 20. API Hub / MuleSoft */
export function APIHub({ d }: { d: DashSpec }) {
  return <Shell d={d}><div className={grid}>
    <Card title="API Catalog" className="col-span-12 lg:col-span-8"><DataTable columns={["API","Version","Calls/s","p95","Errors"]} rows={Array.from({length:6}).map((_,i)=>[`/v${i%2+1}/${["orders","users","catalog","payments","auth","search"][i]}`,`v${i%2+1}.${i}`,`${(i+1)*42}k`,`${28+i*8}ms`,i===3?<Pill key={i} tone="warning">0.3%</Pill>:<Pill key={i} tone="success">0.02%</Pill>])}/></Card>
    <Card title="Connectors" className="col-span-12 lg:col-span-4"><div className="grid grid-cols-3 gap-2">{["SAP","SFDC","S3","Snow","Kafka","SOAP","HTTP","JDBC","SFTP"].map(c=>(<div key={c} className="aspect-square grid place-items-center rounded border border-border bg-muted/20 text-[10px]">{c}</div>))}</div></Card>
  </div></Shell>;
}

/* 21. App Builder / Retool */
export function AppBuilder({ d }: { d: DashSpec }) {
  return <Shell d={d}><div className={grid}>
    <Card title="Canvas" className="col-span-12 lg:col-span-8"><div className="grid-bg h-72 rounded border border-border p-3 grid grid-cols-3 gap-3">{["Table","Chart","Form","Map","Stat","Stat"].map((c,i)=>(<div key={i} className="rounded bg-card border border-primary/30 grid place-items-center text-xs text-muted-foreground">{c}</div>))}</div></Card>
    <Card title="Resources" className="col-span-12 lg:col-span-4">{["Postgres · prod","REST · billing","GraphQL · ai","Snowflake · dw"].map((r,i)=>(<div key={r} className="py-2 border-b border-border last:border-0 text-xs flex items-center gap-2"><Icons.Database className="w-3.5 h-3.5 text-info"/>{r}</div>))}</Card>
  </div></Shell>;
}

/* 22. Data Lake / Snowflake */
export function DataLake({ d }: { d: DashSpec }) {
  return <Shell d={d}><div className={grid}>
    <Card title="Warehouses · Credit Burn" className="col-span-12 lg:col-span-8"><LineSeries seed={4} lines={4} height={200}/></Card>
    <Card title="Top Queries" className="col-span-12 lg:col-span-4"><Terminal lines={[{t:"SELECT * FROM orders WHERE … 4.2s",tone:"warning"},{t:"MERGE customers … 1.8s",tone:"info"},{t:"COPY INTO events … 12s",tone:"muted"}]}/></Card>
    <Card title="Databases" className="col-span-12"><DataTable columns={["DB","Schemas","Tables","Size","Last DDL"]} rows={[["RAW","42","4,128","412 TB","2h"],["STAGE","18","1,248","148 TB","1d"],["PROD","12","412","82 TB","12h"],["MART","8","148","42 TB","3h"]]}/></Card>
  </div></Shell>;
}

/* 23. Governance / Collibra */
export function Governance({ d }: { d: DashSpec }) {
  return <Shell d={d}><div className={grid}>
    <Card title="Data Quality Score" className="col-span-12 lg:col-span-4 grid place-items-center"><Donut value={94} label="DQ" color="var(--color-success)"/></Card>
    <Card title="Lineage · order_facts" className="col-span-12 lg:col-span-8"><div className="flex items-center gap-2 overflow-x-auto">{["Stripe","raw.payments","stage.payments","mart.order_facts","Tableau"].map((n,i)=>(<><div key={n} className="px-3 py-2 rounded border border-border bg-muted/30 text-xs whitespace-nowrap">{n}</div>{i<4&&<Icons.ArrowRight key={`a${i}`} className="w-4 h-4 text-muted-foreground shrink-0"/>}</>))}</div></Card>
    <Card title="Policies" className="col-span-12"><DataTable columns={["Policy","Domain","Steward","Status"]} rows={[["PII Mask","Customer","p.singh",<Pill key="a" tone="success">Active</Pill>],["GDPR Retention","All","a.kapoor",<Pill key="b" tone="success">Active</Pill>],["HIPAA","Health","m.silva",<Pill key="c" tone="warning">Review</Pill>]]}/></Card>
  </div></Shell>;
}

/* 50. Knowledge Graph / Neo4j */
export function KnowledgeGraph({ d }: { d: DashSpec }) {
  return <Shell d={d}><div className={grid}>
    <Card title="Graph Browser" className="col-span-12 lg:col-span-8"><div className="relative h-80 rounded border border-border grid-bg overflow-hidden"><svg className="absolute inset-0 w-full h-full">{Array.from({length:30}).map((_,i)=>{const x1=Math.random()*100,y1=Math.random()*100,x2=Math.random()*100,y2=Math.random()*100;return<line key={i} x1={`${x1}%`} y1={`${y1}%`} x2={`${x2}%`} y2={`${y2}%`} stroke="var(--color-accent)" strokeWidth="0.4" opacity="0.4"/>;})}</svg>{Array.from({length:24}).map((_,i)=>(<div key={i} className="absolute rounded-full -translate-x-1/2 -translate-y-1/2" style={{left:`${Math.random()*100}%`,top:`${Math.random()*100}%`,width:6+Math.random()*12,height:6+Math.random()*12,background:`var(--color-${["primary","accent","info","success"][i%4]})`,boxShadow:"0 0 8px currentColor"}}/>))}</div></Card>
    <Card title="Cypher" className="col-span-12 lg:col-span-4"><Terminal lines={[{t:"MATCH (u:User)-[:OWNS]->(o:Order)",tone:"info"},{t:"WHERE o.amount > 1000",tone:"info"},{t:"RETURN u, o LIMIT 25",tone:"info"},{t:"→ 24 nodes · 42 rels · 38ms",tone:"success"}]}/></Card>
  </div></Shell>;
}

/* 45. Marketplace */
export function Marketplace({ d }: { d: DashSpec }) {
  return <Shell d={d}><div className={grid}>
    <Card title="Top Sellers" className="col-span-12 lg:col-span-8"><DataTable columns={["Seller","SKUs","GMV","Rating","Payout"]} rows={Array.from({length:6}).map((_,i)=>[`Seller-${i+1}`,`${(i+1)*412}`,`$${(48-i*4)}k`,`${(4.9-i*0.1).toFixed(1)}★`,`$${(40-i*3)}k`])}/></Card>
    <Card title="Take Rate" className="col-span-12 lg:col-span-4 grid place-items-center"><Donut value={12} label="take" color="var(--color-primary)"/></Card>
  </div></Shell>;
}

/* 46. Franchise */
export function Franchise({ d }: { d: DashSpec }) {
  return <Shell d={d}><div className={grid}>
    <Card title="Partner Tiers" className="col-span-12 lg:col-span-8"><DataTable columns={["Partner","Tier","Deals","ARR","MDF"]} rows={[["Acme","Platinum","148","$4.2M","82%"],["Globex","Gold","82","$2.1M","68%"],["Initech","Silver","42","$840k","42%"],["Stark","Platinum","248","$8.4M","94%"]]}/></Card>
    <Card title="Co-sell Pipeline" className="col-span-12 lg:col-span-4"><Bars seed={5} n={12} color="var(--color-info)"/></Card>
  </div></Shell>;
}

/* 47. Inventory */
export function Inventory({ d }: { d: DashSpec }) {
  return <Shell d={d}><div className={grid}>
    <Card title="Warehouses" className="col-span-12 lg:col-span-8"><DataTable columns={["Location","SKUs","Capacity","Inbound","Outbound"]} rows={[["Newark NJ","48k","82%","412","248"],["LA","42k","68%","312","412"],["Berlin","38k","58%","248","148"],["Mumbai","28k","42%","148","82"]]}/></Card>
    <Card title="DOH" className="col-span-12 lg:col-span-4 grid place-items-center"><Donut value={42} label="days" color="var(--color-warning)"/></Card>
    <Card title="Cycle Counts · 30d" className="col-span-12"><Bars seed={6} n={30} color="var(--color-warning)"/></Card>
  </div></Shell>;
}

/* 48. Supply Chain */
export function SupplyChain({ d }: { d: DashSpec }) {
  return <Shell d={d}><div className={grid}>
    <Card title="Control Tower" className="col-span-12"><WorldMap seed={11} accent="var(--color-info)"/></Card>
    <Card title="OTIF" className="col-span-12 md:col-span-4 grid place-items-center"><Donut value={96} label="OTIF" color="var(--color-success)"/></Card>
    <Card title="Lanes · Top 5" className="col-span-12 md:col-span-8"><DataTable columns={["Lane","Carrier","Volume","Cost","Service"]} rows={[["SHA→LA","Maersk","412","$$","12d"],["RTM→NJ","MSC","312","$$","8d"],["MUM→DXB","CMA","248","$","4d"],["SIN→SYD","ONE","148","$$","6d"],["GDL→MIA","Hapag","82","$$","9d"]]}/></Card>
  </div></Shell>;
}

/* 49. Procurement */
export function Procurement({ d }: { d: DashSpec }) {
  return <Shell d={d}><div className={grid}>
    <Card title="Spend by Category" className="col-span-12 lg:col-span-8"><Bars seed={7} n={12} color="var(--color-success)" height={140}/></Card>
    <Card title="Active RFx" className="col-span-12 lg:col-span-4">{["RFP-2024-148 · Cloud","RFI-082 · Logistics","RFQ-412 · Hardware","RFP-018 · Legal"].map((r,i)=>(<div key={r} className="py-2 border-b border-border last:border-0 text-xs flex justify-between"><span>{r}</span><Pill tone={i===0?"warning":"info"}>{i===0?"D-3":"Open"}</Pill></div>))}</Card>
    <Card title="Suppliers" className="col-span-12"><DataTable columns={["Supplier","Tier","Spend YTD","Risk","Cert"]} rows={[["AWS","Strategic","$24.2M",<Pill key="a" tone="success">Low</Pill>,"SOC2"],["Salesforce","Strategic","$8.4M",<Pill key="b" tone="success">Low</Pill>,"ISO"],["GlobalCo","Pref","$2.1M",<Pill key="c" tone="warning">Med</Pill>,"—"],["LocalCo","Tail","$148k",<Pill key="d" tone="destructive">High</Pill>,"—"]]}/></Card>
  </div></Shell>;
}

/* 58. Social Listening */
export function Social({ d }: { d: DashSpec }) {
  return <Shell d={d}><div className={grid}>
    <Card title="Mention Volume · 30d" className="col-span-12 lg:col-span-8"><LineSeries seed={8} lines={3}/></Card>
    <Card title="Sentiment" className="col-span-12 lg:col-span-4 grid place-items-center"><Donut value={62} label="positive" color="var(--color-success)"/></Card>
    <Card title="Top Influencers" className="col-span-12"><DataTable columns={["Handle","Reach","Mentions","Sentiment"]} rows={[["@techreview","2.4M","42","+8"],["@productdaily","1.8M","28","+5"],["@founder.io","842k","18","+12"],["@critic.eth","512k","12","-4"]]}/></Card>
  </div></Shell>;
}

/* 59. Marketing */
export function Marketing({ d }: { d: DashSpec }) {
  return <Shell d={d}><div className={grid}>
    <Card title="Campaigns" className="col-span-12 lg:col-span-8"><DataTable columns={["Campaign","Channel","Sent","Open","CTR","MQLs"]} rows={[["Q4 Launch","Email","148k","42%","6.4%","842"],["Webinar","Social","42k","—","2.1%","148"],["Nurture · Mid","Email","82k","38%","5.1%","412"],["Retarget","Ads","412k","—","1.2%","248"]]}/></Card>
    <Card title="Open Rate" className="col-span-12 lg:col-span-4 grid place-items-center"><Donut value={38} label="open" color="var(--color-warning)"/></Card>
  </div></Shell>;
}

/* 60. SEO */
export function SEO({ d }: { d: DashSpec }) {
  return <Shell d={d}><div className={grid}>
    <Card title="Top Keywords" className="col-span-12 lg:col-span-8"><DataTable columns={["Keyword","Pos","Vol","KD","CTR"]} rows={[["enterprise dashboard","2","82k","68","12%"],["ai operations","4","42k","52","8%"],["devops platform","8","148k","82","4%"],["zero trust","6","68k","58","6%"]]}/></Card>
    <Card title="Domain Rating" className="col-span-12 lg:col-span-4 grid place-items-center"><Donut value={82} label="DR" color="var(--color-success)"/></Card>
    <Card title="Backlinks · 90d" className="col-span-12"><LineSeries seed={9} lines={2}/></Card>
  </div></Shell>;
}

/* 61. IoT/Drones */
export function IoTDrones({ d }: { d: DashSpec }) {
  return <Shell d={d}><div className={grid}>
    <Card title="Live Mission Map" className="col-span-12 lg:col-span-8"><WorldMap seed={12} accent="var(--color-info)"/></Card>
    <Card title="Fleet" className="col-span-12 lg:col-span-4">{Array.from({length:6}).map((_,i)=>(<div key={i} className="flex items-center gap-2 py-1.5 border-b border-border last:border-0 text-xs"><Icons.Plane className="w-3.5 h-3.5 text-info"/><span className="font-mono">DJI-M3-{1000+i}</span><div className="flex-1"/><span className="text-muted-foreground">{[82,42,68,12,94,58][i]}%</span></div>))}</Card>
    <Card title="Telemetry" className="col-span-12"><LineSeries seed={10} lines={3}/></Card>
  </div></Shell>;
}

/* 62. Smart City */
export function SmartCity({ d }: { d: DashSpec }) {
  return <Shell d={d}><div className={grid}>
    <Card title="City Map · Live" className="col-span-12 lg:col-span-8"><WorldMap seed={13} accent="var(--color-primary)"/></Card>
    <Card title="Air Quality" className="col-span-12 lg:col-span-4 grid place-items-center"><Donut value={68} label="AQI" color="var(--color-warning)"/></Card>
    <Card title="Sensor Heat · 7d" className="col-span-12"><Heatmap rows={6} cols={28} seed={11} color="var(--color-primary)"/></Card>
  </div></Shell>;
}

/* 63. Energy */
export function Energy({ d }: { d: DashSpec }) {
  return <Shell d={d}><div className={grid}>
    <Card title="Generation Mix" className="col-span-12 lg:col-span-8">{[["Solar",24,"warning"],["Wind",18,"info"],["Hydro",12,"info"],["Nuclear",22,"accent"],["Gas",18,"destructive"],["Storage",6,"success"]].map(([n,v,t],i)=>(<div key={i} className="py-1.5"><div className="flex justify-between text-xs"><span>{n}</span><span>{v}%</span></div><ProgressBar value={(v as number)*4} color={`var(--color-${t})`}/></div>))}</Card>
    <Card title="Frequency" className="col-span-12 lg:col-span-4 grid place-items-center"><Donut value={100} label="50.0Hz" color="var(--color-success)"/></Card>
    <Card title="Load · 24h" className="col-span-12"><LineSeries seed={12} lines={2}/></Card>
  </div></Shell>;
}

/* 64. Satellite */
export function Satellite({ d }: { d: DashSpec }) {
  return <Shell d={d}><div className={grid}>
    <Card title="Constellation Tracks" className="col-span-12"><WorldMap seed={14} accent="var(--color-accent)"/></Card>
    <Card title="Upcoming Passes" className="col-span-12 md:col-span-7"><DataTable columns={["Sat","AOS","Max El","LOS","Band"]} rows={[["NOAA-20","14:42","68°","14:54","X"],["ISS","15:12","42°","15:21","S"],["Sentinel-2","15:48","82°","16:01","Ka"]]}/></Card>
    <Card title="Imagery TB · 30d" className="col-span-12 md:col-span-5"><Bars seed={13} n={30} color="var(--color-accent)"/></Card>
  </div></Shell>;
}

/* 65. Robotics */
export function Robotics({ d }: { d: DashSpec }) {
  return <Shell d={d}><div className={grid}>
    <Card title="Fleet Telemetry" className="col-span-12 lg:col-span-8"><LineSeries seed={15} lines={4} height={200}/></Card>
    <Card title="Online" className="col-span-12 lg:col-span-4 grid place-items-center"><Donut value={96} label="online" color="var(--color-primary)"/></Card>
    <Card title="Triage Queue" className="col-span-12"><DataTable columns={["Unit","Type","Issue","Severity","ETA"]} rows={Array.from({length:5}).map((_,i)=>[`R-${4128+i}`,["Pick","Move","Sort","Charge","Pick"][i],["Sensor drift","Path block","Calibration","Battery","Vision"][i],<Pill key={i} tone={i===0?"destructive":"warning"}>{i===0?"P1":"P2"}</Pill>,`${i+1}h`])}/></Card>
  </div></Shell>;
}

/* 67. Healthcare */
export function Healthcare({ d }: { d: DashSpec }) {
  return <Shell d={d}><div className={grid}>
    <Card title="ED Board" className="col-span-12 lg:col-span-8"><DataTable columns={["Pt","Bed","Acuity","Dx","Wait","MD"]} rows={Array.from({length:7}).map((_,i)=>[`P-${48201+i}`,`B-${100+i}`,<Pill key={i} tone={["destructive","warning","info","muted","warning","info","success"][i] as never}>{["1","2","3","4","2","3","5"][i]}</Pill>,["Chest","Abd","Trauma","URI","CHF","Sepsis","Lac"][i],`${i*4}m`,["Lin","Patel","Ng","Chen","Park","Kim","Lin"][i]])}/></Card>
    <Card title="Bed Occupancy" className="col-span-12 lg:col-span-4 grid place-items-center"><Donut value={82} label="beds" color="var(--color-success)"/></Card>
    <Card title="Vitals · ICU-3" className="col-span-12"><LineSeries seed={16} lines={3}/></Card>
  </div></Shell>;
}

/* 68. Education */
export function Education({ d }: { d: DashSpec }) {
  return <Shell d={d}><div className={grid}>
    <Card title="Programs" className="col-span-12 lg:col-span-8"><DataTable columns={["Program","Cohorts","Learners","Completion","Cert"]} rows={[["Security Fundamentals","12","4,128","82%","Yes"],["Cloud Architect","8","2,401","68%","Yes"],["Data Engineering","6","1,812","74%","Yes"],["Leadership","4","412","92%","No"]]}/></Card>
    <Card title="Completion" className="col-span-12 lg:col-span-4 grid place-items-center"><Donut value={82} label="complete" color="var(--color-info)"/></Card>
  </div></Shell>;
}

/* 69. Legal */
export function Legal({ d }: { d: DashSpec }) {
  return <Shell d={d}><div className={grid}>
    <Card title="Active Matters" className="col-span-12 lg:col-span-8"><DataTable columns={["Matter","Type","Counsel","Spend","Risk"]} rows={[["M-2024-148","Litigation","Wilson Sonsini","$2.4M",<Pill key="a" tone="destructive">High</Pill>],["M-2024-082","M&A","Cravath","$1.8M",<Pill key="b" tone="warning">Med</Pill>],["M-2024-042","IP","Fenwick","$420k",<Pill key="c" tone="info">Low</Pill>],["M-2024-018","Employment","Littler","$148k",<Pill key="d" tone="info">Low</Pill>]]}/></Card>
    <Card title="Spend YTD" className="col-span-12 lg:col-span-4"><Bars seed={17} n={12} color="var(--color-warning)" height={140}/></Card>
  </div></Shell>;
}

/* 70. Quantum */
export function Quantum({ d }: { d: DashSpec }) {
  return <Shell d={d}><div className={grid}>
    <Card title="Backends" className="col-span-12 lg:col-span-8"><DataTable columns={["Backend","Qubits","Fidelity","Queue","Status"]} rows={[["ibm_heron","156","99.6%","12 jobs",<Pill key="a" tone="success">Online</Pill>],["ibm_eagle","127","99.4%","42 jobs",<Pill key="b" tone="warning">Busy</Pill>],["ibm_osprey","433","99.1%","8 jobs",<Pill key="c" tone="success">Online</Pill>],["ibm_condor","1121","98.8%","2 jobs",<Pill key="d" tone="info">Calibrating</Pill>]]}/></Card>
    <Card title="Fidelity" className="col-span-12 lg:col-span-4 grid place-items-center"><Donut value={99} label="2Q gate" color="var(--color-accent)"/></Card>
    <Card title="Circuit Preview" className="col-span-12"><div className="font-mono text-[11px] bg-black/40 rounded p-3 border border-border">{["q[0]: ──H──●──────M──","q[1]: ─────X──H───M──","q[2]: ──H────────●─M──","q[3]: ─────────X──M──"].map((l,i)=><div key={i} className="text-accent">{l}</div>)}</div></Card>
  </div></Shell>;
}

/* 71. Sandbox */
export function Sandbox({ d }: { d: DashSpec }) {
  return <Shell d={d}><div className={grid}>
    <Card title="Active Environments" className="col-span-12 lg:col-span-8"><DataTable columns={["Env","Template","Owner","TTL","Spend"]} rows={Array.from({length:6}).map((_,i)=>[`sbx-${4128+i}`,["3-tier-web","data-lake","kafka","k8s","game-svr","ml-train"][i],`u${i+1}`,`${4-i%4}h`,`$${(i+1)*8}`])}/></Card>
    <Card title="Spend · 7d" className="col-span-12 lg:col-span-4"><Bars seed={18} n={7} color="var(--color-accent)"/></Card>
  </div></Shell>;
}

/* 72. Metaverse */
export function Metaverse({ d }: { d: DashSpec }) {
  return <Shell d={d}><div className={grid}>
    <Card title="World Viewport · NEXUS-City" className="col-span-12 lg:col-span-8"><div className="aspect-video rounded border border-border bg-gradient-to-br from-accent/30 via-primary/20 to-destructive/20 grid place-items-center relative overflow-hidden"><Icons.Box className="w-20 h-20 text-foreground/30"/><div className="absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded bg-accent text-accent-foreground">FPS 118 · 4K · Lumen ON</div></div></Card>
    <Card title="Live Avatars" className="col-span-12 lg:col-span-4">{Array.from({length:6}).map((_,i)=>(<div key={i} className="flex items-center gap-2 py-1.5 text-xs"><Avatar name={["NovaP","ZenX","Pixel","Neon","Star","Cosmo"][i]} color={`var(--color-${["accent","primary","success","info","warning","accent"][i]})`}/><span>{["NovaPrime","ZenithX","PixelHawk","NeonRavn","StarLynx","CosmoQ"][i]}</span><span className="ml-auto text-muted-foreground">L{42-i*3}</span></div>))}</Card>
  </div></Shell>;
}

/* 73. Blockchain */
export function Blockchain({ d }: { d: DashSpec }) {
  return <Shell d={d}><div className={grid}>
    <Card title="Chains" className="col-span-12 lg:col-span-8"><DataTable columns={["Chain","RPC/s","Block","Gas","Status"]} rows={[["Ethereum","148k","21,482,148","18 gwei",<Pill key="a" tone="success">Online</Pill>],["Polygon","82k","68,412,802","42 gwei",<Pill key="b" tone="success">Online</Pill>],["Solana","412k","312,148,412","0.001 SOL",<Pill key="c" tone="success">Online</Pill>],["Arbitrum","42k","412,148,082","0.1 gwei",<Pill key="d" tone="warning">Reorg</Pill>]]}/></Card>
    <Card title="Mempool" className="col-span-12 lg:col-span-4"><Bars seed={19} n={20} color="var(--color-primary)"/></Card>
    <Card title="Webhook Stream" className="col-span-12"><Terminal lines={[{t:"address.activity tx=0x9f86…815a value=2.4 ETH",tone:"success"},{t:"nft.transfer collection=BAYC #4128",tone:"info"},{t:"mined block=21482148 txs=312",tone:"muted"}]}/></Card>
  </div></Shell>;
}
