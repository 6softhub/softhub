import * as Icons from "lucide-react";
import type { DashSpec } from "@/data/dashboards";
import { Shell, Card, DataTable, Pill, Donut, Bars, LineSeries, ProgressBar, Avatar, Timeline, StatusDot, Heatmap } from "./_primitives";

/* 6. Support / Zendesk */
export function Support({ d }: { d: DashSpec }) {
  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <Card title="Queue · By Channel" className="col-span-12 lg:col-span-4">
          {[["Email",482,"info"],["Chat",148,"primary"],["Phone",42,"warning"],["Social",18,"accent"]].map(([n,v,t],i)=>(
            <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div className="flex items-center gap-2"><StatusDot tone={t as never}/><span className="text-xs">{n}</span></div>
              <span className="text-sm font-semibold">{v}</span>
            </div>
          ))}
        </Card>
        <Card title="SLA Heat · 7d × 24h" className="col-span-12 lg:col-span-8"><Heatmap rows={7} cols={24} seed={4} color="var(--color-warning)"/></Card>
        <Card title="Tickets" className="col-span-12">
          <DataTable columns={["#","Subject","Requester","Channel","Priority","SLA","Agent"]} rows={Array.from({length:8}).map((_,i)=>[
            `#${48201+i}`,`Issue with ${["login","invoice","export","upload","2FA","API","trial","seat"][i]}`,`user${i+1}@cust.io`,
            ["email","chat","email","phone","chat","email","social","email"][i],
            <Pill key={i} tone={["destructive","warning","info","muted","warning","info","muted","destructive"][i] as never}>{["Urgent","High","Normal","Low","High","Normal","Low","Urgent"][i]}</Pill>,
            i===0?<Pill key={i} tone="destructive">Breach 8m</Pill>:<Pill key={i} tone="success">OK</Pill>,
            ["meera","akira","diego","luna","sven","priya","tara","rao"][i]
          ])}/>
        </Card>
      </div>
    </Shell>
  );
}

/* 7. Slack */
export function Comms({ d }: { d: DashSpec }) {
  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <Card title="#incident-comms" className="col-span-12 lg:col-span-8">
          <div className="space-y-3">
            {[
              { u:"Akira K.", c:"primary", t:"Heads up — checkout p95 just spiked to 820ms in eu-west-1", time:"14:42" },
              { u:"Meera S.", c:"accent", t:"On it — looking at the recent deploy v2.84.1", time:"14:43" },
              { u:"PagerBot", c:"info", t:"INC-4128 created · severity P2 · responders paged", time:"14:43" },
              { u:"Diego R.", c:"success", t:"Rollback initiated — should normalize in <2m", time:"14:46" },
              { u:"Akira K.", c:"primary", t:"Confirmed back to baseline. 🎉", time:"14:48" },
            ].map((m,i)=>(
              <div key={i} className="flex gap-3"><Avatar name={m.u} color={`var(--color-${m.c})`}/>
                <div className="flex-1">
                  <div className="text-xs"><span className="font-semibold">{m.u}</span> <span className="text-muted-foreground">{m.time}</span></div>
                  <div className="text-sm">{m.t}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Channels" className="col-span-12 lg:col-span-4">
          {["#general","#engineering","#incidents","#sales","#design","#random"].map((c,i)=>(
            <div key={c} className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-muted/40">
              <div className="flex items-center gap-2"><Icons.Hash className="w-3.5 h-3.5 text-muted-foreground"/><span className="text-xs">{c.slice(1)}</span></div>
              {[12,3,42,0,1,8][i]>0 && <span className="text-[10px] bg-destructive text-destructive-foreground px-1.5 rounded-full">{[12,3,42,0,1,8][i]}</span>}
            </div>
          ))}
        </Card>
        <Card title="Huddles · Live" className="col-span-12 md:col-span-6">
          <div className="grid grid-cols-3 gap-2">
            {Array.from({length:6}).map((_,i)=>(
              <div key={i} className="aspect-square rounded-md bg-gradient-to-br from-primary/40 to-accent/40 grid place-items-center text-primary-foreground font-semibold">{["AK","MS","DR","LT","SP","PR"][i]}</div>
            ))}
          </div>
        </Card>
        <Card title="Workflow Runs · 24h" className="col-span-12 md:col-span-6"><Bars seed={11} n={24} color="var(--color-accent)"/></Card>
      </div>
    </Shell>
  );
}

/* 54. Voice AI */
export function VoiceAI({ d }: { d: DashSpec }) {
  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <Card title="Live Calls" className="col-span-12 lg:col-span-8">
          <DataTable columns={["Call","Customer","Agent","Sentiment","Intent","Duration"]} rows={Array.from({length:7}).map((_,i)=>[
            `C-${(48201+i).toString(36).toUpperCase()}`,`+1-415-${1000+i}`,
            ["AI Bot","akira","ai/handoff","meera","ai bot","luna","priya"][i],
            <Pill key={i} tone={["success","warning","info","destructive","success","success","info"][i] as never}>{["Positive","Neutral","Curious","Frustrated","Positive","Positive","Neutral"][i]}</Pill>,
            ["Billing","Cancel","Renew","Refund","Upgrade","Login","Address"][i],
            `${i+1}:${(i*13)%60}`
          ])}/>
        </Card>
        <Card title="AI Deflection" className="col-span-12 lg:col-span-4 grid place-items-center"><Donut value={42} label="auto-resolved" color="var(--color-primary)"/></Card>
        <Card title="IVR Flow" className="col-span-12">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {["Greeting","Auth","Intent Detect","Skill Route","Agent","Survey"].map((s,i)=>(
              <><div key={s} className="px-3 py-2 rounded-md border border-border bg-muted/30 text-xs whitespace-nowrap">{s}</div>
              {i<5&&<Icons.ChevronRight key={`a${i}`} className="w-4 h-4 text-muted-foreground shrink-0"/>}</>
            ))}
          </div>
        </Card>
      </div>
    </Shell>
  );
}

/* 55. Gamification */
export function Gamification({ d }: { d: DashSpec }) {
  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <Card title="Top Players · Season 12" className="col-span-12 lg:col-span-7">
          {Array.from({length:8}).map((_,i)=>(
            <div key={i} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
              <div className="text-lg font-mono w-6 text-accent">{i+1}</div>
              <Avatar name={["NovaPrime","ZenithX","PixelHawk","NeonRavn","StarLynx","CosmoQ","VoidByte","HexFury"][i]} color={`var(--color-${["accent","primary","success","info","warning","accent","destructive","neon"][i%8]})`}/>
              <div className="flex-1 text-sm font-semibold">{["NovaPrime","ZenithX","PixelHawk","NeonRavn","StarLynx","CosmoQ","VoidByte","HexFury"][i]}</div>
              <Pill tone="accent">{(48200-i*1240).toLocaleString()} XP</Pill>
            </div>
          ))}
        </Card>
        <Card title="Achievements Unlocked" className="col-span-12 lg:col-span-5">
          <div className="grid grid-cols-3 gap-2">
            {Array.from({length:9}).map((_,i)=>(
              <div key={i} className="aspect-square rounded-lg border border-border bg-gradient-to-br from-accent/20 to-primary/20 grid place-items-center">
                <Icons.Trophy className={`w-8 h-8 ${i<6?"text-accent":"text-muted-foreground/40"}`}/>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Engagement · 30d" className="col-span-12"><LineSeries seed={14} lines={3}/></Card>
      </div>
    </Shell>
  );
}

/* 56. Customer Success / Gainsight */
export function CustomerSuccess({ d }: { d: DashSpec }) {
  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <Card title="Account Health" className="col-span-12 lg:col-span-8">
          <DataTable columns={["Account","ARR","Health","Stage","CSM","Renewal"]} rows={Array.from({length:7}).map((_,i)=>[
            `Acme-${i+1}`,`$${(i+1)*84}k`,
            <div key={i} className="flex items-center gap-2"><ProgressBar value={[92,68,42,88,76,28,82][i]} color={[92,68,42,88,76,28,82][i]>70?"var(--color-success)":[92,68,42,88,76,28,82][i]>50?"var(--color-warning)":"var(--color-destructive)"}/><span className="text-[10px]">{[92,68,42,88,76,28,82][i]}</span></div>,
            ["Adopt","Adopt","Risk","Renew","Adopt","Risk","Expand"][i],
            ["Mira","Otis","Pia","Rao","Sven","Tara","Una"][i],
            `${42+i*12}d`
          ])}/>
        </Card>
        <Card title="NRR" className="col-span-12 lg:col-span-4 grid place-items-center"><Donut value={118} label="NRR" color="var(--color-success)"/></Card>
        <Card title="Open CTAs" className="col-span-12">
          <Timeline items={[
            { time:"now", title:"Risk · Acme-3 usage drop 42%", tone:"destructive" },
            { time:"1h", title:"Expansion · Globex requested seats +24", tone:"success" },
            { time:"3h", title:"QBR scheduled · Wayne Ent", tone:"info" },
            { time:"1d", title:"Renewal review · Initech (D-30)", tone:"warning" },
          ]}/>
        </Card>
      </div>
    </Shell>
  );
}

/* 57. Onboarding / Appcues */
export function Onboarding({ d }: { d: DashSpec }) {
  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <Card title="Activation Funnel" className="col-span-12 lg:col-span-7">
          {[["Signup",4128,100],["Verified",3812,92],["Workspace",2401,58],["First Action",1812,44],["Week-2 Active",1248,30],["Activated",812,20]].map(([n,v,w],i)=>(
            <div key={i} className="flex items-center gap-3 py-1.5">
              <div className="text-xs w-28">{n}</div>
              <div className="flex-1 h-5 rounded" style={{ width:`${w}%`, background:`linear-gradient(90deg,var(--color-info),var(--color-accent))` }}/>
              <div className="text-xs w-12 text-right text-muted-foreground">{v}</div>
            </div>
          ))}
        </Card>
        <Card title="Active Flows" className="col-span-12 lg:col-span-5">
          {["Welcome Tour · v3","Empty Dashboard","Invite Teammates","Connect Data","Trial Expiring"].map((f,i)=>(
            <div key={f} className="py-2 border-b border-border last:border-0">
              <div className="flex justify-between text-xs"><span>{f}</span><span className="text-success">{[68,42,84,38,22][i]}%</span></div>
              <ProgressBar value={[68,42,84,38,22][i]} />
            </div>
          ))}
        </Card>
        <Card title="Tooltip Engagement · Heat" className="col-span-12"><Heatmap rows={5} cols={28} seed={7} color="var(--color-info)"/></Card>
      </div>
    </Shell>
  );
}
