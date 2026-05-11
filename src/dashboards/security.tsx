import * as Icons from "lucide-react";
import type { DashSpec } from "@/data/dashboards";
import { Shell, Card, DataTable, Pill, Donut, Bars, Spark, ProgressBar, Heatmap, LineSeries, Timeline, StatusDot, WorldMap, Terminal } from "./_primitives";

/* 2. IAM / Okta */
export function IAM({ d }: { d: DashSpec }) {
  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <Card title="App Catalog · Single Sign-On" className="col-span-12 lg:col-span-8">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {["Slack","Salesforce","Workday","GitHub","Zoom","Jira","Notion","AWS","Azure","Snowflake","Figma","DocuSign"].map((a,i)=>(
              <div key={a} className="aspect-square rounded-md border border-border bg-muted/20 grid place-items-center text-center p-2">
                <div>
                  <div className="w-8 h-8 mx-auto rounded bg-gradient-to-br from-info to-primary mb-1"/>
                  <div className="text-[10px]">{a}</div>
                  <div className="text-[9px] text-muted-foreground">{(i+1)*412} users</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card title="MFA Coverage" className="col-span-12 lg:col-span-4 grid place-items-center"><Donut value={96} label="enrolled" color="var(--color-info)"/></Card>
        <Card title="Risky Sign-ins" className="col-span-12 lg:col-span-7">
          <DataTable columns={["User","Risk","Source IP","Geo","Action"]} rows={[
            ["a.kapoor@nx.io",<Pill key="1" tone="destructive">High</Pill>,"203.0.113.42","Lagos, NG",<Pill key="a" tone="warning">Step-up</Pill>],
            ["m.silva@nx.io",<Pill key="2" tone="warning">Med</Pill>,"198.51.100.7","Tor exit",<Pill key="b" tone="destructive">Block</Pill>],
            ["d.ross@nx.io",<Pill key="3" tone="info">Low</Pill>,"192.0.2.18","London, UK",<Pill key="c" tone="success">Allow</Pill>],
          ]}/>
        </Card>
        <Card title="Lifecycle Workflows" className="col-span-12 lg:col-span-5">
          <Timeline items={[
            { time:"now", title:"Joiner · 12 provisioned", tone:"success" },
            { time:"1h", title:"Mover · 4 dept changed → access reapplied", tone:"info" },
            { time:"3h", title:"Leaver · 2 deprovisioned (Workday HRIS)", tone:"warning" },
            { time:"1d", title:"Quarterly access certification opened", tone:"info" },
          ]}/>
        </Card>
      </div>
    </Shell>
  );
}

/* 3. User Roles / Auth0 */
export function UserRoles({ d }: { d: DashSpec }) {
  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <Card title="Tenants" className="col-span-12 lg:col-span-4">
          {["nexus-prod","nexus-eu","nexus-staging","acme-tenant","partner-x"].map((t,i)=>(
            <div key={t} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div className="text-xs font-mono">{t}</div>
              <Pill tone={i===0?"success":"muted"}>{i===0?"Prod":"Region"}</Pill>
            </div>
          ))}
        </Card>
        <Card title="Roles & Permissions" className="col-span-12 lg:col-span-8">
          <DataTable columns={["Role","Members","Permissions","Inherits"]} rows={[
            ["super-admin","3","*",""],
            ["org-admin","42","org:*","admin"],
            ["billing","18","billing:read,write","viewer"],
            ["support","148","tickets:*",""],
            ["viewer","2,401","read:*",""],
          ]}/>
        </Card>
        <Card title="Token Issuance · 24h" className="col-span-12 md:col-span-7"><LineSeries seed={11} lines={2}/></Card>
        <Card title="Connections" className="col-span-12 md:col-span-5">
          {["Database","Google","GitHub","SAML · Okta","OIDC · Custom"].map((c,i)=>(
            <div key={c} className="flex items-center justify-between py-1.5"><span className="text-xs">{c}</span><StatusDot tone={i===3?"warning":"success"}/></div>
          ))}
        </Card>
      </div>
    </Shell>
  );
}

/* 27. SOC / Splunk ES */
export function SOC({ d }: { d: DashSpec }) {
  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <Card title="MITRE ATT&CK Coverage" className="col-span-12 lg:col-span-8">
          <div className="grid grid-cols-12 gap-1">
            {Array.from({length:84}).map((_,i)=>{
              const v = Math.random();
              return <div key={i} className="aspect-square rounded-sm" style={{ background: v>0.7?"var(--color-success)":v>0.4?"var(--color-warning)":"var(--color-muted)" }}/>;
            })}
          </div>
          <div className="mt-3 flex gap-2 text-[10px] text-muted-foreground"><Pill tone="success">Detected</Pill><Pill tone="warning">Partial</Pill><Pill>Gap</Pill></div>
        </Card>
        <Card title="Notable Events · 24h" className="col-span-12 lg:col-span-4">
          <Timeline items={[
            { time:"2m", title:"Credential dump · srv-db-3", tone:"destructive" },
            { time:"14m", title:"PowerShell exec from doc", tone:"warning" },
            { time:"1h", title:"Tor traffic blocked", tone:"info" },
            { time:"3h", title:"Lateral SMB attempt", tone:"warning" },
          ]}/>
        </Card>
        <Card title="Active Investigations" className="col-span-12">
          <DataTable columns={["Case","Severity","Asset","Analyst","Stage","Age"]} rows={Array.from({length:6}).map((_,i)=>[
            `CASE-${4128+i}`,
            <Pill key={i} tone={["destructive","warning","info","warning","info","success"][i] as never}>{["P1","P2","P3","P2","P3","P4"][i]}</Pill>,
            ["srv-db-3","laptop-148","gw-eu-1","sso-app","s3-bucket","mfa-svc"][i],
            ["meera","akira","diego","luna","sven","priya"][i],
            ["Triage","Contain","Scope","Eradicate","Recover","Closed"][i],
            `${i+1}h`
          ])}/>
        </Card>
      </div>
    </Shell>
  );
}

/* 28. Fraud / Darktrace */
export function Fraud({ d }: { d: DashSpec }) {
  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <Card title="Anomaly Score · Live" className="col-span-12 lg:col-span-8"><LineSeries seed={13} lines={3} height={220}/></Card>
        <Card title="AI Models" className="col-span-12 lg:col-span-4">
          {["Behavioral · v4.2","Network · v2.1","Email · v3.0","Account Takeover","Synthetic ID"].map((m,i)=>(
            <div key={m} className="py-1.5 border-b border-border last:border-0">
              <div className="flex justify-between text-xs"><span>{m}</span><span className="text-success">{(95+i*0.6).toFixed(1)}%</span></div>
              <ProgressBar value={95+i*0.6} color="var(--color-destructive)"/>
            </div>
          ))}
        </Card>
        <Card title="Antigena Actions" className="col-span-12">
          <DataTable columns={["When","Action","Asset","Confidence","Effect"]} rows={[
            ["2m ago","Block outbound","laptop-AK-12","98%",<Pill key="a" tone="success">Contained</Pill>],
            ["14m ago","Quarantine email","inbox/marketing","92%",<Pill key="b" tone="success">Contained</Pill>],
            ["42m ago","Slow connection","srv-db-2","78%",<Pill key="c" tone="warning">Throttled</Pill>],
          ]}/>
        </Card>
      </div>
    </Shell>
  );
}

/* 29. Forensics */
export function Forensics({ d }: { d: DashSpec }) {
  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <Card title="Active Cases" className="col-span-12 lg:col-span-7">
          <DataTable columns={["Case","Subject","Devices","Evidence","Examiner","Stage"]} rows={Array.from({length:6}).map((_,i)=>[
            `IR-${2024100+i}`,`Subject-${i+1}`,`${i+1}`,`${(i+1)*4} GB`,["Mira","Otis","Pia","Rao","Sven","Tara"][i],
            <Pill key={i} tone={["info","warning","info","success","warning","info"][i] as never}>{["Acquire","Image","Analyze","Report","Hold","Triage"][i]}</Pill>
          ])}/>
        </Card>
        <Card title="Evidence Timeline" className="col-span-12 lg:col-span-5">
          <Timeline items={[
            { time:"08:14", title:"Logical extraction · iPhone 15", tone:"info" },
            { time:"09:22", title:"File system mounted", tone:"success" },
            { time:"10:48", title:"Keyword hits: 412", tone:"warning" },
            { time:"12:01", title:"Hash match: known malware", tone:"destructive" },
            { time:"14:12", title:"Report draft v0.3", tone:"info" },
          ]}/>
        </Card>
        <Card title="Hash Search" className="col-span-12"><Terminal lines={[
          { t:"sha256 9f86d...0815a · 4 hits across 3 cases", tone:"warning" },
          { t:"md5 d41d8...e9800 · empty file ignored", tone:"muted" },
          { t:"ssdeep 3:AXG... · partial match · CASE-148", tone:"info" },
        ]}/></Card>
      </div>
    </Shell>
  );
}

/* 66/79. Biometric */
export function Biometric({ d }: { d: DashSpec }) {
  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <Card title="Floor Map · HQ-3" className="col-span-12 lg:col-span-8">
          <div className="relative h-72 rounded-md border border-border grid-bg overflow-hidden">
            {Array.from({length:18}).map((_,i)=>{
              const x = 8 + (i%6)*15; const y = 12 + Math.floor(i/6)*30;
              const tone = [0,5,12].includes(i)?"destructive":i%4===0?"warning":"success";
              return <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2 px-2 py-1 rounded bg-card border border-border flex items-center gap-1 text-[10px]" style={{ left:`${x}%`, top:`${y}%` }}>
                <StatusDot tone={tone as never}/>D-{100+i}
              </div>;
            })}
          </div>
        </Card>
        <Card title="Today's Activity" className="col-span-12 lg:col-span-4">
          {["Granted","Denied","Tailgate","After-hours"].map((k,i)=>(
            <div key={k} className="flex justify-between py-2 border-b border-border last:border-0 text-xs">
              <span>{k}</span><span className={i===2?"text-destructive":""}>{[14820,42,3,18][i]}</span>
            </div>
          ))}
        </Card>
        <Card title="Door Events Stream" className="col-span-12"><Terminal lines={[
          { t:"D-103 GRANT user=akira.k method=face score=0.98", tone:"success" },
          { t:"D-112 DENY user=unknown method=card reason=expired", tone:"destructive" },
          { t:"D-100 TAILGATE 2 entrants 1 badge", tone:"warning" },
          { t:"D-118 GRANT user=meera.s method=mobile-id", tone:"success" },
        ]}/></Card>
      </div>
    </Shell>
  );
}
