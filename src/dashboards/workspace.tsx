import * as Icons from "lucide-react";
import type { DashSpec } from "@/data/dashboards";
import { Shell, Card, Kanban, Pill, DataTable, Bars, LineSeries, Donut, Avatar, Spark, ProgressBar, Heatmap, Timeline, StatusDot, Terminal } from "./_primitives";

/* 11. Projects / Jira */
export function Projects({ d }: { d: DashSpec }) {
  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <Card title="Sprint 42 · Board" className="col-span-12">
          <Kanban columns={[
            { title:"Backlog", tone:"muted", items:[{title:"NEX-148 · OAuth refresh edge case",tag:"bug"},{title:"NEX-149 · Onboard wizard polish",tag:"task"},{title:"NEX-150 · Audit log export",tag:"task"}]},
            { title:"To Do", tone:"info", items:[{title:"NEX-141 · Multi-tenant role mapping",tag:"story"},{title:"NEX-142 · Slack DM bridge",tag:"story"}]},
            { title:"In Progress", tone:"warning", items:[{title:"NEX-138 · SSO bug · Okta tenant",meta:"akira",tag:"bug"},{title:"NEX-139 · KPI tile redesign",meta:"luna"}]},
            { title:"In Review", tone:"info", items:[{title:"NEX-134 · Zendesk webhook v2",meta:"diego"}]},
            { title:"Done", tone:"success", items:[{title:"NEX-128 · Donut chart prim",meta:"meera"},{title:"NEX-130 · Theme tokens",meta:"sven"}]},
          ]}/>
        </Card>
        <Card title="Velocity · 6 sprints" className="col-span-12 md:col-span-7"><Bars seed={5} n={6} color="var(--color-info)" height={140}/></Card>
        <Card title="Burndown" className="col-span-12 md:col-span-5"><LineSeries seed={6} lines={2}/></Card>
      </div>
    </Shell>
  );
}

/* 12. Workflows / Monday */
export function Workflows({ d }: { d: DashSpec }) {
  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <Card title="Boards" className="col-span-12 lg:col-span-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {["Q4 Roadmap","Marketing","Hiring","Bug Triage","Vendor","Procurement"].map((b,i)=>(
              <div key={b} className="p-3 rounded-md border border-border bg-muted/20">
                <div className="text-xs font-semibold">{b}</div>
                <div className="mt-1 text-[10px] text-muted-foreground">{(i+1)*42} items · {i+2} automations</div>
                <div className="mt-2 flex gap-1">
                  {["accent","primary","success","warning","info"].slice(0,3+i%2).map((t,j)=><div key={j} className="h-1 flex-1 rounded" style={{ background:`var(--color-${t})` }}/>)}
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Top Automations" className="col-span-12 lg:col-span-4">
          {["When status → Done · notify Slack","Every Mon 9am · create review","When item created → assign owner","When date arrives · move to next group"].map((a,i)=>(
            <div key={i} className="py-2 border-b border-border last:border-0 text-xs flex items-center gap-2">
              <Icons.Workflow className="w-3.5 h-3.5 text-accent shrink-0"/>{a}
            </div>
          ))}
        </Card>
      </div>
    </Shell>
  );
}

/* 13. Knowledge / Notion */
export function Knowledge({ d }: { d: DashSpec }) {
  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <Card title="Workspace · Sidebar" className="col-span-12 lg:col-span-3">
          {[["📚 Engineering Wiki",1],["🚀 Product Specs",1],["🎨 Brand Library",0],["📈 Metrics",1],["📋 Runbooks",0],["🧪 Experiments",1]].map(([n,a],i)=>(
            <div key={i} className={`flex items-center gap-2 py-1.5 px-2 rounded text-xs ${a?"bg-muted/40":""}`}><Icons.ChevronRight className="w-3 h-3 text-muted-foreground"/>{n}</div>
          ))}
        </Card>
        <Card title="Engineering Wiki" className="col-span-12 lg:col-span-9">
          <div className="prose prose-invert prose-sm max-w-none">
            <h2 className="text-base font-semibold">Onboarding Runbook v3.2</h2>
            <p className="text-xs text-muted-foreground">Last edited by Akira K. · 2h ago · 14 collaborators</p>
            <p className="text-sm">Welcome to the platform team. This page describes the day-1 setup, environments, and review process.</p>
            <ul className="text-sm list-disc pl-5 space-y-1">
              <li>Clone <code className="text-accent">monorepo/platform</code> and run <code className="text-accent">make bootstrap</code></li>
              <li>Request access via the <span className="text-info underline">@access-bot</span> in #onboarding</li>
              <li>Pair with your buddy on a starter ticket within 48h</li>
            </ul>
            <div className="mt-3 p-3 rounded-md bg-info/10 border border-info/30 text-xs">💡 <b>AI suggestion:</b> add a section on local secrets and Vault role mapping.</div>
          </div>
        </Card>
      </div>
    </Shell>
  );
}

/* 14. Files / Drive */
export function Files({ d }: { d: DashSpec }) {
  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <Card title="My Drive" className="col-span-12 lg:col-span-9">
          <DataTable columns={["Name","Owner","Modified","Size","Sharing"]} rows={[
            [<div key="1" className="flex items-center gap-2"><Icons.Folder className="w-4 h-4 text-info"/>Engineering</div>,"akira.k","2h ago","—",<Pill key="a" tone="info">Org</Pill>],
            [<div key="2" className="flex items-center gap-2"><Icons.Folder className="w-4 h-4 text-info"/>Q4 Planning</div>,"l.park","1d ago","—",<Pill key="b" tone="warning">Restricted</Pill>],
            [<div key="3" className="flex items-center gap-2"><Icons.FileText className="w-4 h-4 text-primary"/>Onboarding.docx</div>,"meera.s","3h ago","48 KB",<Pill key="c" tone="success">Anyone w/ link</Pill>],
            [<div key="4" className="flex items-center gap-2"><Icons.FileSpreadsheet className="w-4 h-4 text-success"/>Forecast-FY25.xlsx</div>,"d.ross","12m ago","412 KB",<Pill key="d" tone="muted">Private</Pill>],
            [<div key="5" className="flex items-center gap-2"><Icons.Image className="w-4 h-4 text-accent"/>Brand-Assets.zip</div>,"luna.t","2d ago","1.2 GB",<Pill key="e" tone="info">Org</Pill>],
          ]}/>
        </Card>
        <Card title="Storage" className="col-span-12 lg:col-span-3 grid place-items-center"><Donut value={68} label="of 2 PB" color="var(--color-info)"/></Card>
        <Card title="DLP Hits · 7d" className="col-span-12"><Bars seed={9} n={28} color="var(--color-destructive)"/></Card>
      </div>
    </Shell>
  );
}

/* 38. Search / Raycast */
export function SearchPalette({ d }: { d: DashSpec }) {
  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <Card title="Command Palette" className="col-span-12">
          <div className="rounded-lg border border-border bg-card p-2">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
              <Icons.Search className="w-4 h-4 text-muted-foreground"/>
              <input className="flex-1 bg-transparent outline-none text-sm" defaultValue="open dashboard"/>
              <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-muted">⌘K</kbd>
            </div>
            <div className="py-2">
              {[["📊","Open · Global Command Center","Dashboards"],["👤","Find · Akira Kapoor","People"],["🔧","Run · Restart svc-checkout","Action"],["📝","Snippet · standup template","Snippets"],["🤖","Ask AI · summarize Q4 OKRs","AI"]].map(([i,t,c],x)=>(
                <div key={x} className={`flex items-center gap-3 px-3 py-2 rounded-md ${x===0?"bg-primary/10":""}`}>
                  <div className="text-base">{i}</div><div className="flex-1 text-sm">{t}</div><Pill>{c}</Pill>
                </div>
              ))}
            </div>
          </div>
        </Card>
        <Card title="Top Extensions" className="col-span-12 md:col-span-6">
          <DataTable columns={["Extension","Author","Installs","Rating"]} rows={[["GitHub","raycast","412k","4.8"],["Linear","linear","248k","4.9"],["1Password","agilebits","148k","4.7"]]}/>
        </Card>
        <Card title="AI Hits · 7d" className="col-span-12 md:col-span-6"><Spark seed={4}/><LineSeries seed={5} lines={2}/></Card>
      </div>
    </Shell>
  );
}

/* 51. Browser / Arc */
export function BrowserWS({ d }: { d: DashSpec }) {
  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <Card title="Spaces" className="col-span-12 lg:col-span-3">
          {["🏠 Personal","💼 Work","📚 Research","🎨 Design","🔬 Lab"].map((s,i)=>(
            <div key={s} className={`px-3 py-2 rounded text-xs ${i===1?"bg-accent/15 text-accent":""}`}>{s}</div>
          ))}
        </Card>
        <Card title="Pinned Apps · Work" className="col-span-12 lg:col-span-9">
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
            {["Slack","Notion","Linear","Figma","GitHub","Drive","Calendar","Loom","Gmail","Tableau","Stripe","Zoom","Airtable","Sentry","1Pass","Datadog"].map((a,i)=>(
              <div key={a} className="aspect-square rounded-md border border-border bg-gradient-to-br from-accent/15 to-primary/15 grid place-items-center text-[10px] text-center p-1">{a}</div>
            ))}
          </div>
        </Card>
        <Card title="DLP Events · 24h" className="col-span-12"><Bars seed={2} n={24} color="var(--color-destructive)"/></Card>
      </div>
    </Shell>
  );
}

/* 52. Design System / Figma */
export function DesignSystem({ d }: { d: DashSpec }) {
  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <Card title="Color Tokens" className="col-span-12 lg:col-span-7">
          <div className="grid grid-cols-6 gap-2">
            {["primary","accent","success","warning","destructive","info","muted","background","foreground","border","ring","sidebar"].map(t=>(
              <div key={t} className="rounded-md overflow-hidden border border-border">
                <div className="h-12" style={{ background:`var(--color-${t})` }}/>
                <div className="p-2 text-[10px] font-mono">{t}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Adoption" className="col-span-12 lg:col-span-5 grid place-items-center"><Donut value={94} label="adopted" color="var(--color-accent)"/></Card>
        <Card title="Component Library" className="col-span-12">
          <DataTable columns={["Component","Variants","Used in","Updated","Status"]} rows={[
            ["Button","12","4,128 frames","2h ago",<Pill key="a" tone="success">Stable</Pill>],
            ["Card","6","2,401 frames","1d ago",<Pill key="b" tone="success">Stable</Pill>],
            ["DataTable","4","412 frames","3d ago",<Pill key="c" tone="warning">Beta</Pill>],
            ["Chart","9","812 frames","12h ago",<Pill key="d" tone="info">v2</Pill>],
          ]}/>
        </Card>
      </div>
    </Shell>
  );
}

/* 53. Broadcast / OBS */
export function Broadcast({ d }: { d: DashSpec }) {
  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <Card title="Program · Live · 1080p60 · 6.2 Mbps" className="col-span-12 lg:col-span-8">
          <div className="aspect-video rounded-md bg-gradient-to-br from-destructive/20 via-primary/20 to-accent/20 border border-border relative overflow-hidden">
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-destructive text-destructive-foreground text-[10px] font-semibold animate-pulse">● ON AIR</div>
            <div className="absolute bottom-2 right-2 text-[10px] text-muted-foreground">REC 01:24:08</div>
            <div className="absolute inset-0 grid place-items-center"><Icons.Camera className="w-16 h-16 text-foreground/20"/></div>
          </div>
        </Card>
        <Card title="Scenes" className="col-span-12 lg:col-span-4">
          {["Intro","Camera-Wide","Camera-Tight","Screen Share","Lower Third","BRB","Outro"].map((s,i)=>(
            <div key={s} className={`flex items-center gap-2 py-1.5 px-2 rounded text-xs ${i===2?"bg-destructive/10 text-destructive":""}`}>
              <div className="w-12 aspect-video rounded bg-muted"/>{s}
            </div>
          ))}
        </Card>
        <Card title="Audio Mixer" className="col-span-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {["Mic","Desktop","Music","Browser","Sting"].map((s,i)=>(
              <div key={s} className="p-3 rounded-md border border-border bg-muted/20">
                <div className="text-xs font-semibold">{s}</div>
                <div className="mt-2 h-2 rounded-full overflow-hidden bg-muted">
                  <div className="h-full" style={{ width:`${[68,42,18,82,4][i]}%`, background:`linear-gradient(90deg,var(--color-success),var(--color-warning),var(--color-destructive))` }}/>
                </div>
                <div className="mt-1 text-[10px] text-muted-foreground">-{[12,18,42,4,68][i]} dB</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Shell>
  );
}
