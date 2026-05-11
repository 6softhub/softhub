import * as Icons from "lucide-react";
import type { DashSpec } from "@/data/dashboards";
import { Shell, Card, Kanban, Pill, DataTable, Bars, LineSeries, Donut, Avatar, Spark, ProgressBar, Timeline } from "./_primitives";

/* 4. CRM / Salesforce */
export function CRM({ d }: { d: DashSpec }) {
  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <Card title="Pipeline by Stage" className="col-span-12">
          <Kanban columns={[
            { title:"Prospect", tone:"muted", items:[{title:"Acme Corp",meta:"$120k",tag:"new"},{title:"Globex",meta:"$84k",tag:"inbound"},{title:"Initech",meta:"$48k"}]},
            { title:"Qualified", tone:"info", items:[{title:"Umbrella",meta:"$240k",tag:"warm"},{title:"Soylent",meta:"$182k"}]},
            { title:"Proposal", tone:"warning", items:[{title:"Wayne Ent",meta:"$520k",tag:"strategic"},{title:"Stark Ind",meta:"$412k"}]},
            { title:"Negotiation", tone:"warning", items:[{title:"Hooli",meta:"$284k"},{title:"Cyberdyne",meta:"$148k"}]},
            { title:"Closed Won", tone:"success", items:[{title:"Pied Piper",meta:"$98k"},{title:"Vandelay",meta:"$42k"}]},
          ]}/>
        </Card>
        <Card title="Forecast vs Quota" className="col-span-12 lg:col-span-7"><LineSeries seed={2} lines={3}/></Card>
        <Card title="Top Reps" className="col-span-12 lg:col-span-5">
          {["Ada Chen","Marcus Riley","Priya Singh","Diego Vargas","Lina Park"].map((n,i)=>(
            <div key={n} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
              <Avatar name={n} color={["var(--color-primary)","var(--color-accent)","var(--color-success)","var(--color-info)","var(--color-warning)"][i]}/>
              <div className="flex-1"><div className="text-xs font-medium">{n}</div><div className="text-[10px] text-muted-foreground">{120-i*8}% to quota</div></div>
              <ProgressBar value={120-i*12} color="var(--color-success)"/>
            </div>
          ))}
        </Card>
      </div>
    </Shell>
  );
}

/* 5. HubSpot Sales */
export function SalesPipeline({ d }: { d: DashSpec }) {
  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <Card title="Deal Velocity Funnel" className="col-span-12 lg:col-span-7">
          {[["Visits",12482,100],["MQL",4128,42],["SQL",812,18],["Demos",312,9],["Won",148,4]].map(([n,v,w],i)=>(
            <div key={i} className="flex items-center gap-3 py-1.5">
              <div className="text-xs w-20">{n}</div>
              <div className="flex-1 h-6 rounded" style={{ width:`${w}%`, background:`linear-gradient(90deg,var(--color-success),var(--color-primary))` }}/>
              <div className="text-xs w-16 text-right text-muted-foreground">{v}</div>
            </div>
          ))}
        </Card>
        <Card title="Sequences Performance" className="col-span-12 lg:col-span-5">
          <DataTable columns={["Sequence","Sent","Reply","Booked"]} rows={[
            ["Outbound Q4","4,128","18%","42"],
            ["Re-engage","812","24%","18"],
            ["Nurture · Tier1","2,401","32%","68"],
          ]}/>
        </Card>
        <Card title="Activity by Rep · Calls/Emails/Meetings" className="col-span-12"><Bars seed={4} n={30}/></Card>
      </div>
    </Shell>
  );
}

/* 41. Billing / Stripe RI */
export function Billing({ d }: { d: DashSpec }) {
  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <Card title="MRR Composition · Last 12 mo" className="col-span-12 lg:col-span-8">
          <div className="flex items-end gap-1 h-48">
            {Array.from({length:12}).map((_,i)=>{
              const total = 60 + i*4;
              return <div key={i} className="flex-1 flex flex-col-reverse rounded overflow-hidden">
                <div style={{ height:`${total*0.5}%`, background:"var(--color-success)" }}/>
                <div style={{ height:`${total*0.2}%`, background:"var(--color-primary)" }}/>
                <div style={{ height:`${total*0.15}%`, background:"var(--color-accent)" }}/>
                <div style={{ height:`${total*0.1}%`, background:"var(--color-warning)" }}/>
                <div style={{ height:`${total*0.05}%`, background:"var(--color-destructive)" }}/>
              </div>;
            })}
          </div>
          <div className="mt-2 flex gap-2 text-[10px]"><Pill tone="success">New</Pill><Pill tone="primary">Expansion</Pill><Pill tone="accent">Reactivation</Pill><Pill tone="warning">Contraction</Pill><Pill tone="destructive">Churn</Pill></div>
        </Card>
        <Card title="Net Revenue Retention" className="col-span-12 lg:col-span-4 grid place-items-center"><Donut value={118} label="NRR" color="var(--color-success)"/></Card>
        <Card title="Recent Invoices" className="col-span-12">
          <DataTable columns={["Invoice","Customer","Amount","Status","Issued"]} rows={Array.from({length:6}).map((_,i)=>[
            `INV-${4128+i}`,`Acme-${i+1}`,`$${(i+1)*4128}`,
            i===2?<Pill key={i} tone="destructive">Past Due</Pill>:i===4?<Pill key={i} tone="warning">Open</Pill>:<Pill key={i} tone="success">Paid</Pill>,
            `${i+1}d ago`
          ])}/>
        </Card>
      </div>
    </Shell>
  );
}

/* 42. Payments / Stripe */
export function Payments({ d }: { d: DashSpec }) {
  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <Card title="Volume · Today" className="col-span-12 lg:col-span-8"><LineSeries seed={5} lines={2}/></Card>
        <Card title="Auth Rate" className="col-span-12 lg:col-span-4 grid place-items-center"><Donut value={96} label="approved" color="var(--color-info)"/></Card>
        <Card title="Payments" className="col-span-12">
          <DataTable columns={["ID","Method","Amount","Risk","Status"]} rows={Array.from({length:8}).map((_,i)=>[
            `ch_${(8412+i).toString(16)}`,
            ["Visa ··4242","Mastercard ··5151","Apple Pay","ACH","SEPA","Klarna","Visa ··0019","Amex ··0005"][i],
            `$${(i+1)*128}.${(i*7)%100}`,
            i===3?<Pill key={i} tone="warning">Elevated</Pill>:<Pill key={i} tone="success">Normal</Pill>,
            i===5?<Pill key={i} tone="destructive">Declined</Pill>:<Pill key={i} tone="success">Succeeded</Pill>,
          ])}/>
        </Card>
        <Card title="Disputes" className="col-span-12 md:col-span-6"><Bars seed={6} n={20} color="var(--color-destructive)"/></Card>
        <Card title="Payment Methods Mix" className="col-span-12 md:col-span-6">
          {[["Cards",62,"primary"],["Wallets",24,"accent"],["ACH/SEPA",10,"info"],["BNPL",4,"warning"]].map(([n,v,t],i)=>(
            <div key={i} className="py-1.5"><div className="flex justify-between text-xs"><span>{n}</span><span>{v}%</span></div><ProgressBar value={v as number} color={`var(--color-${t})`}/></div>
          ))}
        </Card>
      </div>
    </Shell>
  );
}

/* 43. Accounting / NetSuite */
export function Accounting({ d }: { d: DashSpec }) {
  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <Card title="P&L Snapshot · MTD" className="col-span-12 lg:col-span-7">
          <DataTable columns={["Account","Actual","Budget","Variance"]} rows={[
            ["Revenue","$12.4M","$11.8M",<span key="a" className="text-success">+5.1%</span>],
            ["COGS","$3.2M","$3.0M",<span key="b" className="text-destructive">-6.6%</span>],
            ["Gross Margin","$9.2M","$8.8M",<span key="c" className="text-success">+4.5%</span>],
            ["OpEx","$4.8M","$5.1M",<span key="d" className="text-success">+5.9%</span>],
            ["EBITDA","$4.4M","$3.7M",<span key="e" className="text-success">+18.9%</span>],
          ]}/>
        </Card>
        <Card title="Close Calendar" className="col-span-12 lg:col-span-5">
          <Timeline items={[
            { time:"D+1", title:"Subledger lock", tone:"success" },
            { time:"D+2", title:"Intercompany match", tone:"success" },
            { time:"D+3", title:"FX revaluation", tone:"warning" },
            { time:"D+4", title:"Eliminations", tone:"info" },
            { time:"D+5", title:"Consolidation review", tone:"info" },
          ]}/>
        </Card>
        <Card title="AR Aging" className="col-span-12 md:col-span-6"><Bars seed={7} n={6} color="var(--color-warning)"/></Card>
        <Card title="AP Aging" className="col-span-12 md:col-span-6"><Bars seed={8} n={6} color="var(--color-info)"/></Card>
      </div>
    </Shell>
  );
}

/* 44. Subscriptions / Chargebee */
export function Subscriptions({ d }: { d: DashSpec }) {
  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <Card title="Plans" className="col-span-12 lg:col-span-7">
          <DataTable columns={["Plan","Tier","Price","Active","ARPU"]} rows={[
            ["Starter","Tier 1","$29","48,201","$31"],
            ["Pro","Tier 2","$99","82,401","$112"],
            ["Business","Tier 3","$299","18,402","$284"],
            ["Enterprise","Custom","—","412","$2,840"],
          ]}/>
        </Card>
        <Card title="Trial → Paid CVR" className="col-span-12 lg:col-span-5 grid place-items-center"><Donut value={22} label="cvr" color="var(--color-accent)"/></Card>
        <Card title="Dunning Recovery · 30d" className="col-span-12"><LineSeries seed={9} lines={2}/></Card>
      </div>
    </Shell>
  );
}

/* 87. Bloomberg / Market Intel */
export function MarketIntel({ d }: { d: DashSpec }) {
  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <Card title="Watchlist" className="col-span-12 lg:col-span-7">
          <div className="rounded-md bg-black/40 border border-border overflow-hidden font-mono text-xs">
            <table className="w-full">
              <thead><tr className="bg-warning/10 text-warning">{["TICKER","LAST","CHG","%","BID","ASK","VOL"].map(h=><th key={h} className="text-left px-3 py-1.5">{h}</th>)}</tr></thead>
              <tbody>
                {[["AAPL","248.12","+1.84","+0.74","248.10","248.14","42.1M","success"],
                  ["MSFT","482.40","-3.18","-0.66","482.38","482.42","18.4M","destructive"],
                  ["NVDA","1248.20","+22.40","+1.83","1248.18","1248.22","82.4M","success"],
                  ["GOOGL","182.48","-0.42","-0.23","182.46","182.50","12.4M","destructive"],
                  ["BTC-USD","78240","+1240","+1.61","78238","78242","2.4B","success"]].map((r,i)=>(
                  <tr key={i} className="border-t border-border/50">
                    {r.slice(0,7).map((c,j)=><td key={j} className={`px-3 py-1.5 ${j>=2&&j<=3?(r[7]==="success"?"text-success":"text-destructive"):""}`}>{c}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <Card title="Order Book · BTC-USD" className="col-span-12 lg:col-span-5">
          <div className="font-mono text-[11px]">
            {Array.from({length:5}).map((_,i)=>(<div key={i} className="flex justify-between text-destructive/80"><span>78{260-i*2}.40</span><span>{(0.4+i*0.1).toFixed(2)}</span></div>))}
            <div className="my-1 py-1 text-warning border-y border-border flex justify-between"><span>78240.00</span><span>spread 2.0</span></div>
            {Array.from({length:5}).map((_,i)=>(<div key={i} className="flex justify-between text-success/80"><span>78{238-i*2}.00</span><span>{(0.5+i*0.1).toFixed(2)}</span></div>))}
          </div>
        </Card>
        <Card title="Headlines · BN" className="col-span-12">
          <ul className="space-y-1 text-xs font-mono">
            <li><span className="text-warning">14:42</span> Fed minutes signal pause through Q1 — BN</li>
            <li><span className="text-warning">14:38</span> Apple supplier cuts Q1 outlook — BN</li>
            <li><span className="text-warning">14:31</span> ECB's Lagarde: inflation glide-path on track</li>
            <li><span className="text-warning">14:18</span> Brent crude +2.4% on OPEC+ hint</li>
          </ul>
        </Card>
      </div>
    </Shell>
  );
}
