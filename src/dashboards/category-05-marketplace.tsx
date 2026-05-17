import { useMemo, useState } from "react";
import * as Icons from "lucide-react";
import type { DashSpec } from "@/data/dashboards";
import {
  Shell, Card, DataTable, Pill, Donut, Bars, LineSeries, ProgressBar,
  Spark, StatusDot, Heatmap, Timeline, Avatar, Kanban,
} from "./_primitives";
import {
  ChartCard, DashboardToolbar, FilterBar, QuickActions, AIInsights,
  Modal, EmptyState, useDashboardState,
} from "./_universal";

/* ============================================================
   CATEGORY 05 — PRODUCT + MARKETPLACE
   Slugs: marketplace, product-manager, gallery, reviews,
          subscriptions-system, downloads, activation
   ============================================================ */

/* ---------------- Marketplace Manager ---------------- */
export function Marketplace({ d }: { d: DashSpec }) {
  const s = useDashboardState();
  const [open, setOpen] = useState<null | { name: string; gmv: number; rating: number }>(null);
  const sellers = useMemo(() => ([
    { name: "Nova Audio Labs",   sku: 1284, gmv: 2_412_000, take: 12, rating: 4.8, tier: "Platinum", status: "active" },
    { name: "Helix Furniture",   sku: 824,  gmv: 1_812_400, take: 14, rating: 4.6, tier: "Gold",     status: "active" },
    { name: "Bolt Robotics",     sku: 312,  gmv: 1_204_800, take: 10, rating: 4.9, tier: "Platinum", status: "active" },
    { name: "Arc Apparel",       sku: 4_128,gmv: 942_100,   take: 18, rating: 4.2, tier: "Silver",   status: "review" },
    { name: "Pixel Print Co.",   sku: 248,  gmv: 612_400,   take: 16, rating: 4.5, tier: "Gold",     status: "active" },
    { name: "Tundra Outdoors",   sku: 1_804,gmv: 482_900,   take: 15, rating: 4.4, tier: "Gold",     status: "active" },
    { name: "Mirage VR",         sku: 84,   gmv: 318_200,   take: 11, rating: 4.7, tier: "Silver",   status: "pending" },
  ]), []);
  const filtered = sellers.filter(x => x.name.toLowerCase().includes(s.filter.toLowerCase()));

  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <ChartCard title="GMV · 30d" span={8}
          toolbar={<DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive}/>}>
          <LineSeries seed={51} lines={2} height={200}/>
          <div className="grid grid-cols-4 mt-3 text-center text-[11px]">
            <div><div className="text-muted-foreground">GMV MTD</div><div className="font-semibold tabular-nums text-success">$48.2M</div></div>
            <div><div className="text-muted-foreground">Orders</div><div className="font-semibold tabular-nums">128,402</div></div>
            <div><div className="text-muted-foreground">AOV</div><div className="font-semibold tabular-nums">$376</div></div>
            <div><div className="text-muted-foreground">Take Rate</div><div className="font-semibold tabular-nums text-info">12.4%</div></div>
          </div>
        </ChartCard>

        <ChartCard title="Seller Quality" span={4} className="grid place-items-center">
          <Donut value={88} label="quality" color="var(--color-accent)"/>
        </ChartCard>

        <ChartCard title="Sellers" span={12}
          toolbar={<>
            <FilterBar value={s.filter} onChange={s.setFilter} placeholder="Search sellers…"/>
            <button className="text-[11px] px-2 py-1 rounded-md bg-primary text-primary-foreground hover:opacity-90">Invite seller</button>
          </>}>
          {filtered.length === 0 ? (
            <EmptyState icon="Store" title="No sellers match" hint="Try a different search term."/>
          ) : (
            <DataTable columns={["Seller","Tier","SKUs","GMV MTD","Take","Rating","Status",""]} rows={
              filtered.map((r,i)=>[
                <span key={i} className="flex items-center gap-2"><Avatar name={r.name}/><span className="font-medium">{r.name}</span></span>,
                <Pill key={i} tone={r.tier==="Platinum"?"accent":r.tier==="Gold"?"warning":"muted"}>{r.tier}</Pill>,
                <span key={i} className="tabular-nums">{r.sku.toLocaleString()}</span>,
                <span key={i} className="tabular-nums">${(r.gmv/1000).toFixed(0)}k</span>,
                <span key={i} className="tabular-nums">{r.take}%</span>,
                <span key={i} className="tabular-nums">★ {r.rating}</span>,
                <Pill key={i} tone={r.status==="active"?"success":r.status==="review"?"warning":"info"}>{r.status}</Pill>,
                <button key={i} onClick={()=>setOpen({name:r.name,gmv:r.gmv,rating:r.rating})} className="text-[11px] text-primary hover:underline">Open</button>,
              ])
            }/>
          )}
        </ChartCard>

        <ChartCard title="Order Pipeline" span={8}>
          <Kanban columns={[
            { title: "New",      tone: "info",    items: [{title:"#ORD-48201",meta:"Acme · $1,284",tag:"FBM"},{title:"#ORD-48202",meta:"Globex · $412",tag:"FBA"}] },
            { title: "Packed",   tone: "warning", items: [{title:"#ORD-48198",meta:"Wayne · $848",tag:"FBA"},{title:"#ORD-48199",meta:"Initech · $212",tag:"FBM"}] },
            { title: "Shipped",  tone: "success", items: [{title:"#ORD-48180",meta:"Stark · $3,420",tag:"Express"}] },
            { title: "Disputed", tone: "destructive", items: [{title:"#ORD-48121",meta:"Hooli · refund",tag:"INR"}] },
          ]}/>
        </ChartCard>

        <div className="col-span-12 lg:col-span-4 space-y-4">
          <ChartCard title="Quick Actions">
            <QuickActions items={[
              { label: "New listing",  icon: "Plus",        tone: "primary" },
              { label: "Payouts run",  icon: "Banknote",    tone: "success" },
              { label: "Open disputes",icon: "AlertOctagon",tone: "warning" },
              { label: "Export CSV",   icon: "Download",    tone: "info" },
            ]}/>
          </ChartCard>
          <AIInsights items={[
            { title: "Arc Apparel at risk", body: "Dispute rate 3.4% vs 0.8% category avg. Auto-throttle payouts recommended.", tone: "warning", confidence: 91 },
            { title: "Audio category surging", body: "GMV +42% WoW. Recommend feature placement on home for 14 days.", tone: "success", confidence: 86 },
          ]}/>
        </div>
      </div>

      <Modal open={!!open} onClose={()=>setOpen(null)} title={open?.name || ""} size="md">
        {open && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="glass rounded-md p-3"><div className="text-[10px] text-muted-foreground">GMV MTD</div><div className="text-lg font-semibold">${(open.gmv/1000).toFixed(0)}k</div></div>
              <div className="glass rounded-md p-3"><div className="text-[10px] text-muted-foreground">Rating</div><div className="text-lg font-semibold">★ {open.rating}</div></div>
              <div className="glass rounded-md p-3"><div className="text-[10px] text-muted-foreground">Disputes</div><div className="text-lg font-semibold text-warning">3</div></div>
            </div>
            <Spark seed={7} color="var(--color-primary)" height={80}/>
          </div>
        )}
      </Modal>
    </Shell>
  );
}

/* ---------------- Product Manager ---------------- */
export function ProductManager({ d }: { d: DashSpec }) {
  const s = useDashboardState();
  const products = useMemo(() => ([
    { sku: "VL-CORE-PRO", name: "Vala Core · Pro",       price: 149, stock: 1240, status: "live",    rev: 482_000 },
    { sku: "VL-FLASH-TM", name: "Vala Flash · Team",     price: 49,  stock: 9999, status: "live",    rev: 318_000 },
    { sku: "VL-VIS-ENT",  name: "Vala Vision · Ent",     price: 499, stock: 312,  status: "live",    rev: 612_000 },
    { sku: "VL-EDGE-DEV", name: "Vala Edge · Dev",       price: 19,  stock: 9999, status: "beta",    rev: 84_000 },
    { sku: "VL-VOICE-ST", name: "Vala Voice · Starter",  price: 29,  stock: 4218, status: "live",    rev: 142_000 },
    { sku: "VL-CODE-EE",  name: "Vala Code · Enterprise",price: 999, stock: 84,   status: "draft",   rev: 0 },
  ]), []);

  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <ChartCard title="Catalog Revenue · 30d" span={8}
          toolbar={<DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive}/>}>
          <LineSeries seed={61} lines={3} height={200}/>
        </ChartCard>
        <ChartCard title="Lifecycle Mix" span={4} className="grid place-items-center">
          <Donut value={72} label="live" color="var(--color-success)"/>
        </ChartCard>

        <ChartCard title="Catalog" span={12} toolbar={<FilterBar value={s.filter} onChange={s.setFilter} placeholder="Search SKUs…"/>}>
          <DataTable columns={["SKU","Name","Price","Stock","Status","Rev MTD",""]} rows={
            products.filter(p => (p.sku+p.name).toLowerCase().includes(s.filter.toLowerCase())).map((p,i)=>[
              <span key={i} className="font-mono text-[11px]">{p.sku}</span>,
              <span key={i} className="font-medium">{p.name}</span>,
              <span key={i} className="tabular-nums">${p.price}</span>,
              <div key={i} className="w-24"><ProgressBar value={Math.min(100, (p.stock/100))} color={p.stock<500?"var(--color-warning)":"var(--color-success)"}/></div>,
              <Pill key={i} tone={p.status==="live"?"success":p.status==="beta"?"info":"muted"}>{p.status}</Pill>,
              <span key={i} className="tabular-nums">${(p.rev/1000).toFixed(0)}k</span>,
              <button key={i} className="text-[11px] text-primary hover:underline">Edit</button>,
            ])
          }/>
        </ChartCard>

        <ChartCard title="Roadmap" span={8}>
          <Kanban columns={[
            { title: "Backlog",  tone: "muted",   items: [{title:"VL-VIS · Real-time SAM",meta:"PM: A. Lin",tag:"Q3"},{title:"VL-CODE · IDE plugin",meta:"PM: J. Park",tag:"Q3"}] },
            { title: "In dev",   tone: "info",    items: [{title:"VL-FLASH · Tools v2",meta:"PM: M. Patel",tag:"Q3"}] },
            { title: "Beta",     tone: "warning", items: [{title:"VL-EDGE · Mobile SDK",meta:"PM: R. Cole",tag:"Q3"}] },
            { title: "Launched", tone: "success", items: [{title:"VL-VOICE · ES + DE",meta:"PM: E. Sato",tag:"Q3"}] },
          ]}/>
        </ChartCard>

        <div className="col-span-12 lg:col-span-4 space-y-4">
          <ChartCard title="Pricing Experiments">
            {["+9% Pro","Trial 14→7d","Bundle Vision+Code","Edge $19→$24"].map((n,i)=>(
              <div key={n} className="py-2 border-b border-border last:border-0 flex items-center justify-between">
                <span className="text-xs">{n}</span>
                <Pill tone={["success","warning","info","muted"][i] as never}>{["+8.2% MRR","−3% CVR","+12% AOV","running"][i]}</Pill>
              </div>
            ))}
          </ChartCard>
          <AIInsights items={[
            { title: "VL-CODE-EE under-priced", body: "Win-rate 62% at $999 suggests headroom; A/B at $1,199 projected +$184k ARR.", tone: "info", confidence: 84 },
          ]}/>
        </div>
      </div>
    </Shell>
  );
}

/* ---------------- Gallery & Media Manager ---------------- */
export function Gallery({ d }: { d: DashSpec }) {
  const s = useDashboardState();
  const tiles = useMemo(() => Array.from({length:18}).map((_,i)=>({
    h: 96 + ((i*37)%84),
    hue: (i*53)%360,
    name: ["hero","banner","thumb","cover","promo","social"][i%6] + "-" + (i+1),
    size: ["1.2MB","842KB","312KB","2.4MB","148KB","984KB"][i%6],
  })), []);
  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <ChartCard title="Library" span={9}
          toolbar={<>
            <FilterBar value={s.filter} onChange={s.setFilter} placeholder="Search assets…"/>
            <button className="text-[11px] px-2 py-1 rounded-md bg-primary text-primary-foreground hover:opacity-90 inline-flex items-center gap-1"><Icons.Upload className="w-3 h-3"/>Upload</button>
          </>}>
          <div className="columns-2 md:columns-3 lg:columns-6 gap-2 [column-fill:_balance]">
            {tiles.filter(t=>t.name.includes(s.filter)).map((t,i)=>(
              <div key={i} className="mb-2 break-inside-avoid rounded-md overflow-hidden border border-border group relative">
                <div style={{height:t.h, background:`linear-gradient(135deg, hsl(${t.hue} 60% 28%), hsl(${(t.hue+40)%360} 50% 18%))`}}/>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 grid place-items-end p-2">
                  <div className="text-[10px] text-primary-foreground font-mono">{t.name}.webp · {t.size}</div>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        <div className="col-span-12 lg:col-span-3 space-y-4">
          <ChartCard title="Storage">
            <div className="text-center">
              <Donut value={64} label="148 TB" color="var(--color-info)"/>
            </div>
            <div className="mt-3 space-y-2 text-[11px]">
              {[["Images","82 TB","primary"],["Video","42 TB","accent"],["3D / GLB","18 TB","warning"],["Other","6 TB","muted"]].map(([k,v,t],i)=>(
                <div key={i} className="flex items-center justify-between"><span className="flex items-center gap-2"><StatusDot tone={t as never}/>{k}</span><span className="tabular-nums text-muted-foreground">{v}</span></div>
              ))}
            </div>
          </ChartCard>
          <ChartCard title="CDN Hit Rate"><Spark seed={9} color="var(--color-success)" height={48}/><div className="mt-1 text-xl font-semibold tabular-nums">98.4%</div></ChartCard>
          <AIInsights items={[{title:"AI tag backlog",body:"4,128 untagged assets. Auto-tagging will save ~12h/week of manual sorting.",tone:"info",confidence:90}]}/>
        </div>
      </div>
    </Shell>
  );
}

/* ---------------- Reviews & Ratings ---------------- */
export function Reviews({ d }: { d: DashSpec }) {
  const s = useDashboardState();
  const reviews = useMemo(() => ([
    { user: "M. Patel",   product:"Vala Core · Pro",     stars: 5, text:"Top-tier reasoning. Cut our ops triage time by half.", tone:"success" as const, replied:true },
    { user: "S. Okafor",  product:"Vala Vision · Ent",   stars: 2, text:"Multimodal slow on large PDFs; needs streaming.",      tone:"destructive" as const, replied:false },
    { user: "J. Park",    product:"Vala Flash · Team",   stars: 5, text:"Latency is unreal. Team velocity up 30%.",              tone:"success" as const, replied:true },
    { user: "R. Cole",    product:"Vala Code · Ent",     stars: 4, text:"Solid. Wish there were better IDE plugins.",            tone:"info" as const, replied:false },
    { user: "E. Sato",    product:"Vala Voice · Starter",stars: 3, text:"Good for English; accents need work.",                  tone:"warning" as const, replied:true },
  ]), []);

  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <ChartCard title="Rating Distribution" span={5}>
          {[5,4,3,2,1].map(n=>{
            const w = [62,22,8,5,3][5-n];
            return (
              <div key={n} className="flex items-center gap-3 py-1.5">
                <span className="text-xs w-8 tabular-nums">★ {n}</span>
                <div className="flex-1"><ProgressBar value={w} color={n>=4?"var(--color-success)":n===3?"var(--color-warning)":"var(--color-destructive)"}/></div>
                <span className="text-[11px] tabular-nums w-10 text-right text-muted-foreground">{w}%</span>
              </div>
            );
          })}
          <div className="mt-3 grid grid-cols-3 text-center text-[11px]">
            <div><div className="text-muted-foreground">Avg</div><div className="text-lg font-semibold">4.6</div></div>
            <div><div className="text-muted-foreground">Reviews</div><div className="text-lg font-semibold tabular-nums">482k</div></div>
            <div><div className="text-muted-foreground">Sentiment</div><div className="text-lg font-semibold text-success">+58</div></div>
          </div>
        </ChartCard>

        <ChartCard title="Sentiment · 30d" span={7}
          toolbar={<DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive}/>}>
          <LineSeries seed={71} lines={2} height={180}/>
        </ChartCard>

        <ChartCard title="Inbox" span={12} toolbar={<FilterBar value={s.filter} onChange={s.setFilter} placeholder="Search reviews…"/>}>
          <ul className="divide-y divide-border">
            {reviews.filter(r=>(r.user+r.product+r.text).toLowerCase().includes(s.filter.toLowerCase())).map((r,i)=>(
              <li key={i} className="py-3 flex items-start gap-3">
                <Avatar name={r.user}/>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-medium">{r.user}</span>
                    <span className="text-muted-foreground">on {r.product}</span>
                    <Pill tone={r.tone}>{"★".repeat(r.stars)}</Pill>
                    {r.replied ? <Pill tone="success">replied</Pill> : <Pill tone="warning">needs reply</Pill>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{r.text}</p>
                </div>
                <button className="text-[11px] text-primary hover:underline shrink-0">Reply</button>
              </li>
            ))}
          </ul>
        </ChartCard>

        <ChartCard title="Topics · Heat" span={8}>
          <Heatmap rows={5} cols={28} seed={14} color="var(--color-accent)"/>
        </ChartCard>
        <AIInsights items={[
          { title:"Vision PDF complaints rising", body:"12 negative reviews mention slow PDF parsing. Engineering ticket auto-filed.", tone:"warning", confidence:92 },
          { title:"Voice accent issues",          body:"Pattern across 28 reviews. Recommend new training set for ES/IN accents.",       tone:"info",    confidence:81 },
        ]}/>
      </div>
    </Shell>
  );
}

/* ---------------- Subscription System ---------------- */
export function SubscriptionsSystem({ d }: { d: DashSpec }) {
  const s = useDashboardState();
  const plans = useMemo(() => ([
    { name:"Starter",    price:19,  active: 48_201, mrr: 916_000,   churn: 4.2, trial: 22 },
    { name:"Team",       price:49,  active: 24_810, mrr: 1_215_000, churn: 2.8, trial: 28 },
    { name:"Business",   price:149, active: 8_412,  mrr: 1_253_000, churn: 1.4, trial: 18 },
    { name:"Enterprise", price:999, active: 312,    mrr: 311_000,   churn: 0.6, trial: 12 },
  ]), []);
  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <ChartCard title="MRR · 12mo" span={8}
          toolbar={<DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive}/>}>
          <LineSeries seed={81} lines={3} height={200}/>
          <div className="grid grid-cols-4 mt-3 text-center text-[11px]">
            <div><div className="text-muted-foreground">MRR</div><div className="font-semibold text-success">$2.41M</div></div>
            <div><div className="text-muted-foreground">ARR</div><div className="font-semibold">$28.9M</div></div>
            <div><div className="text-muted-foreground">NRR</div><div className="font-semibold text-info">118%</div></div>
            <div><div className="text-muted-foreground">Churn</div><div className="font-semibold text-warning">1.2%</div></div>
          </div>
        </ChartCard>

        <ChartCard title="Dunning Recovery" span={4} className="grid place-items-center">
          <Donut value={68} label="recovered" color="var(--color-success)"/>
        </ChartCard>

        <ChartCard title="Plans" span={12}>
          <DataTable columns={["Plan","Price","Active","MRR","Trial CVR","Churn",""]} rows={
            plans.map((p,i)=>[
              <span key={i} className="font-medium">{p.name}</span>,
              <span key={i} className="tabular-nums">${p.price}/mo</span>,
              <span key={i} className="tabular-nums">{p.active.toLocaleString()}</span>,
              <span key={i} className="tabular-nums">${(p.mrr/1000).toFixed(0)}k</span>,
              <div key={i} className="w-24"><ProgressBar value={p.trial*3} color="var(--color-info)"/></div>,
              <span key={i} className={`tabular-nums ${p.churn>3?"text-destructive":p.churn>2?"text-warning":"text-success"}`}>{p.churn}%</span>,
              <button key={i} className="text-[11px] text-primary hover:underline">Edit plan</button>,
            ])
          }/>
        </ChartCard>

        <ChartCard title="Lifecycle Funnel" span={6}>
          {[["Signup",100,"primary"],["Activated",68,"info"],["Trial→Paid",22,"accent"],["Expanded (Y1)",18,"success"],["Churned (Y1)",4,"destructive"]].map(([l,v,t],i)=>(
            <div key={i} className="py-1.5">
              <div className="flex items-center justify-between text-[11px]"><span>{l as string}</span><span className="tabular-nums">{v}%</span></div>
              <ProgressBar value={v as number} color={`var(--color-${t})`}/>
            </div>
          ))}
        </ChartCard>

        <ChartCard title="Cohort Retention · Heat" span={6}>
          <Heatmap rows={6} cols={12} seed={22} color="var(--color-success)"/>
        </ChartCard>

        <AIInsights items={[
          { title:"Team plan dunning win improving", body:"Recovery 72% vs 64% baseline after retry schedule tweak.", tone:"success", confidence:94 },
          { title:"Starter trial CVR softening",    body:"Trial→Paid down 3pp in last 2 weeks; recommend onboarding A/B.", tone:"warning", confidence:86 },
        ]}/>
      </div>
    </Shell>
  );
}

/* ---------------- Downloads & Delivery ---------------- */
export function Downloads({ d }: { d: DashSpec }) {
  const s = useDashboardState();
  const files = useMemo(() => ([
    { f:"vala-desktop-4.2.1.dmg",     plat:"macOS",   size:"248 MB", dls: 482_910, hit:96 },
    { f:"vala-desktop-4.2.1.exe",     plat:"Windows", size:"284 MB", dls: 612_400, hit:94 },
    { f:"vala-cli_4.2.1_linux.tar.gz",plat:"Linux",   size:" 42 MB", dls: 148_200, hit:98 },
    { f:"vala-mobile-4.2.apk",        plat:"Android", size:"112 MB", dls:  84_100, hit:91 },
    { f:"vala-sdk-4.2.zip",           plat:"All",     size:"812 MB", dls:  28_400, hit:88 },
  ]), []);
  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <ChartCard title="Downloads · 24h" span={8}
          toolbar={<DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive}/>}>
          <Bars seed={6} n={48} color="var(--color-primary)" height={180}/>
        </ChartCard>
        <ChartCard title="Edge Cache Hit" span={4} className="grid place-items-center">
          <Donut value={96} label="cache hit" color="var(--color-success)"/>
        </ChartCard>

        <ChartCard title="Files" span={12} toolbar={<FilterBar value={s.filter} onChange={s.setFilter} placeholder="Search files…"/>}>
          <DataTable columns={["File","Platform","Size","Downloads","Cache","Signed",""]} rows={
            files.filter(x=>x.f.includes(s.filter)).map((x,i)=>[
              <span key={i} className="font-mono text-[11px]">{x.f}</span>,
              <Pill key={i} tone={x.plat==="macOS"?"info":x.plat==="Windows"?"accent":x.plat==="Linux"?"success":"muted"}>{x.plat}</Pill>,
              <span key={i} className="tabular-nums text-muted-foreground">{x.size}</span>,
              <span key={i} className="tabular-nums">{x.dls.toLocaleString()}</span>,
              <div key={i} className="w-20"><ProgressBar value={x.hit} color="var(--color-success)"/></div>,
              <Pill key={i} tone="success">SHA-256</Pill>,
              <button key={i} className="text-[11px] text-primary hover:underline">Rotate token</button>,
            ])
          }/>
        </ChartCard>

        <ChartCard title="Edge POPs · Distribution" span={8}>
          <Heatmap rows={4} cols={32} seed={31} color="var(--color-info)"/>
        </ChartCard>
        <ChartCard title="Bandwidth · 24h" span={4}>
          <Spark seed={12} color="var(--color-accent)" height={48}/>
          <div className="mt-2 text-2xl font-semibold tabular-nums">812 TB</div>
          <div className="text-[11px] text-muted-foreground">peak 18.4 Gbps · 04:12 UTC</div>
        </ChartCard>
      </div>
    </Shell>
  );
}

/* ---------------- License Activation Center ---------------- */
export function Activation({ d }: { d: DashSpec }) {
  const s = useDashboardState();
  const [open, setOpen] = useState(false);
  const keys = useMemo(() => ([
    { key:"VL-CORE-XJ4K-29A1", product:"Vala Core · Pro",   seats:"5/5",  device:"3 devices",  status:"active",   exp:"2026-08-12" },
    { key:"VL-FLSH-QQ12-44B7", product:"Vala Flash · Team", seats:"24/50",device:"22 devices", status:"active",   exp:"2026-12-01" },
    { key:"VL-VIS-99XX-7012",  product:"Vala Vision · Ent", seats:"148/200", device:"148 devices", status:"active", exp:"2027-03-30" },
    { key:"VL-EDGE-TR01-2090", product:"Vala Edge · Dev",   seats:"1/1",  device:"1 device",   status:"trial",    exp:"2026-06-02" },
    { key:"VL-VOC-AAAA-0001",  product:"Vala Voice · Starter", seats:"2/3", device:"0 devices",status:"revoked", exp:"—" },
  ]), []);
  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <ChartCard title="Activations · 30d" span={8}
          toolbar={<DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive}/>}>
          <LineSeries seed={91} lines={2} height={180}/>
          <div className="grid grid-cols-4 mt-3 text-center text-[11px]">
            <div><div className="text-muted-foreground">Issued</div><div className="font-semibold tabular-nums">248k</div></div>
            <div><div className="text-muted-foreground">Activated</div><div className="font-semibold tabular-nums text-success">212k</div></div>
            <div><div className="text-muted-foreground">Devices</div><div className="font-semibold tabular-nums">482k</div></div>
            <div><div className="text-muted-foreground">Revoked</div><div className="font-semibold tabular-nums text-destructive">812</div></div>
          </div>
        </ChartCard>

        <ChartCard title="Compliance" span={4} className="grid place-items-center">
          <Donut value={98} label="compliant" color="var(--color-success)"/>
        </ChartCard>

        <ChartCard title="License Keys" span={12}
          toolbar={<>
            <FilterBar value={s.filter} onChange={s.setFilter} placeholder="Search keys…"/>
            <button onClick={()=>setOpen(true)} className="text-[11px] px-2 py-1 rounded-md bg-primary text-primary-foreground hover:opacity-90 inline-flex items-center gap-1"><Icons.Plus className="w-3 h-3"/>Issue key</button>
          </>}>
          <DataTable columns={["Key","Product","Seats","Devices","Status","Expires",""]} rows={
            keys.filter(k=>(k.key+k.product).toLowerCase().includes(s.filter.toLowerCase())).map((k,i)=>[
              <span key={i} className="font-mono text-[11px]">{k.key}</span>,
              <span key={i}>{k.product}</span>,
              <span key={i} className="tabular-nums">{k.seats}</span>,
              <span key={i} className="text-muted-foreground">{k.device}</span>,
              <Pill key={i} tone={k.status==="active"?"success":k.status==="trial"?"info":"destructive"}>{k.status}</Pill>,
              <span key={i} className="tabular-nums text-muted-foreground">{k.exp}</span>,
              <button key={i} className="text-[11px] text-destructive hover:underline">Revoke</button>,
            ])
          }/>
        </ChartCard>

        <ChartCard title="Activation Audit" span={8}>
          <Timeline items={[
            { time:"now",  title:"Key VL-VIS-99XX-7012 added 4 devices",    tone:"info" },
            { time:"12m",  title:"Trial VL-EDGE-TR01-2090 extended +7d",    tone:"success" },
            { time:"42m",  title:"Revoked VL-VOC-AAAA-0001 (refund)",       tone:"destructive" },
            { time:"2h",   title:"Floating pool resized 50 → 80 seats",     tone:"info" },
            { time:"6h",   title:"Compliance scan · 0 violations",          tone:"success" },
          ]}/>
        </ChartCard>

        <div className="col-span-12 lg:col-span-4 space-y-4">
          <ChartCard title="Quick Actions">
            <QuickActions items={[
              { label:"Bulk issue",  icon:"KeyRound",  tone:"primary", onClick:()=>setOpen(true) },
              { label:"Hardware ID", icon:"Cpu",       tone:"info" },
              { label:"Offline pkg", icon:"PackageCheck", tone:"accent" },
              { label:"Audit export",icon:"FileDown",  tone:"warning" },
            ]}/>
          </ChartCard>
          <AIInsights items={[
            { title:"3 keys near seat limit", body:"Auto-suggest upgrade-prompt email; historical +28% expansion conversion.", tone:"info", confidence:89 },
            { title:"Suspicious activation pattern", body:"Key VL-FLSH-QQ12-44B7 activated from 7 countries in 24h. Flag for review.", tone:"warning", confidence:93 },
          ]}/>
        </div>
      </div>

      <Modal open={open} onClose={()=>setOpen(false)} title="Issue License Key" size="md"
        footer={<>
          <button onClick={()=>setOpen(false)} className="px-3 py-1.5 text-xs rounded-md border border-border hover:bg-muted">Cancel</button>
          <button onClick={()=>setOpen(false)} className="px-3 py-1.5 text-xs rounded-md bg-primary text-primary-foreground hover:opacity-90">Issue</button>
        </>}>
        <div className="space-y-3">
          {["Customer","Product","Seats","Policy (floating/node-locked)","Expiration"].map(l=>(
            <div key={l}>
              <label className="text-[11px] text-muted-foreground">{l}</label>
              <input className="mt-1 w-full bg-muted text-xs rounded-md px-2 py-1.5 border border-border outline-none focus:border-primary"/>
            </div>
          ))}
        </div>
      </Modal>
    </Shell>
  );
}
