import * as Icons from "lucide-react";
import type { DashSpec } from "@/data/dashboards";
import { Shell, Card, DataTable, Pill, Donut, Bars, LineSeries, ProgressBar, Avatar, Heatmap, Spark, Timeline } from "./_primitives";

/* 9. HR / Workday */
export function HR({ d }: { d: DashSpec }) {
  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <Card title="Org Chart" className="col-span-12 lg:col-span-7">
          <div className="space-y-2">
            <div className="mx-auto w-fit px-4 py-2 rounded-md border border-primary/40 bg-primary/10 text-sm font-semibold text-center">CEO · L. Park</div>
            <div className="grid grid-cols-4 gap-2">
              {["CTO","CFO","CRO","CPO"].map((r,i)=>(
                <div key={r} className="text-center">
                  <div className="px-2 py-1.5 rounded-md border border-border bg-muted/40 text-xs">{r}</div>
                  <div className="mt-1 text-[10px] text-muted-foreground">{[148,42,312,82][i]} reports</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-8 gap-1 mt-2">
              {Array.from({length:24}).map((_,i)=><div key={i} className="aspect-square rounded bg-gradient-to-br from-info/30 to-primary/30 border border-border"/>)}
            </div>
          </div>
        </Card>
        <Card title="Headcount Breakdown" className="col-span-12 lg:col-span-5">
          {[["Engineering",4128,"primary"],["Sales",2401,"success"],["Support",1812,"warning"],["Ops",1248,"info"],["G&A",812,"accent"]].map(([n,v,t],i)=>(
            <div key={i} className="py-1.5"><div className="flex justify-between text-xs"><span>{n}</span><span>{v}</span></div><ProgressBar value={(v as number)/50} color={`var(--color-${t})`}/></div>
          ))}
        </Card>
        <Card title="Open Reqs" className="col-span-12 md:col-span-7">
          <DataTable columns={["Req","Title","Dept","Stage","Days Open"]} rows={Array.from({length:5}).map((_,i)=>[
            `R-${4128+i}`,["Sr SWE","Designer","PM","CSM","Recruiter"][i],["Eng","Design","Product","Success","People"][i],
            <Pill key={i} tone={["info","warning","info","success","muted"][i] as never}>{["Sourced","Phone","Onsite","Offer","Open"][i]}</Pill>,
            `${[4,12,18,3,28][i]}d`
          ])}/>
        </Card>
        <Card title="eNPS Trend" className="col-span-12 md:col-span-5"><LineSeries seed={3} lines={1}/></Card>
      </div>
    </Shell>
  );
}

/* 10. Payroll / ADP */
export function Payroll({ d }: { d: DashSpec }) {
  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <Card title="Pay Runs" className="col-span-12 lg:col-span-8">
          <DataTable columns={["Run","Period","Employees","Gross","Tax","Net","Status"]} rows={Array.from({length:6}).map((_,i)=>[
            `PR-${2024+i}`,`Nov ${1+i*7}-${7+i*7}`,`12,4${i}2`,`$${(48-i*2)}M`,`$${(12-i*0.5).toFixed(1)}M`,`$${(36-i*1.5).toFixed(1)}M`,
            i<2?<Pill key={i} tone="success">Posted</Pill>:i===2?<Pill key={i} tone="warning">Review</Pill>:<Pill key={i} tone="muted">Draft</Pill>
          ])}/>
        </Card>
        <Card title="Attendance" className="col-span-12 lg:col-span-4 grid place-items-center"><Donut value={98} label="present" color="var(--color-success)"/></Card>
        <Card title="Tax Filings" className="col-span-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {["Federal 941","State","Local","FUTA","SUTA","W-2","1099-NEC","ACA"].map((t,i)=>(
              <div key={t} className="p-3 rounded-md border border-border bg-muted/20 text-center">
                <div className="text-xs font-semibold">{t}</div>
                <div className="mt-1"><Pill tone={i<6?"success":"warning"}>{i<6?"Filed":"Due 30d"}</Pill></div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Shell>
  );
}
