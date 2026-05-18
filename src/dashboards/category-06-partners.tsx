import { useMemo, useState } from "react";
import * as Icons from "lucide-react";
import type { DashSpec } from "@/data/dashboards";
import {
  Shell, DataTable, Pill, Donut, Bars, LineSeries, ProgressBar,
  Spark, StatusDot, Heatmap, Timeline, Avatar, Kanban, WorldMap,
} from "./_primitives";
import {
  ChartCard, DashboardToolbar, FilterBar, QuickActions, AIInsights,
  Modal, EmptyState, useDashboardState,
} from "./_universal";

/* ============================================================
   CATEGORY 06 — RESELLER + FRANCHISE
   Slugs: reseller, franchise, affiliate, influencer
   ============================================================ */

/* ---------------- Reseller Manager ---------------- */
export function Reseller({ d }: { d: DashSpec }) {
  const s = useDashboardState();
  const [open, setOpen] = useState<null | { name: string }>(null);
  const partners = useMemo(() => ([
    { name: "Northwind Cloud",  tier: "Platinum", region: "EMEA",  deals: 184, gmv: 4_812_000, margin: 22, csat: 4.8, status: "active" },
    { name: "Helix Systems",    tier: "Gold",     region: "AMER",  deals: 142, gmv: 3_212_400, margin: 19, csat: 4.6, status: "active" },
    { name: "Bolt Integrators",  tier: "Platinum", region: "APAC",  deals: 128, gmv: 2_984_800, margin: 24, csat: 4.9, status: "active" },
    { name: "Arc Partners",     tier: "Silver",   region: "LATAM", deals: 84,  gmv: 1_442_100, margin: 17, csat: 4.2, status: "review" },
    { name: "Pixel Resell",     tier: "Gold",     region: "EMEA",  deals: 96,  gmv: 1_212_400, margin: 18, csat: 4.5, status: "active" },
    { name: "Tundra Channels",  tier: "Gold",     region: "AMER",  deals: 72,  gmv:   984_900, margin: 16, csat: 4.4, status: "active" },
    { name: "Mirage Group",     tier: "Silver",   region: "APAC",  deals: 42,  gmv:   612_200, margin: 15, csat: 4.1, status: "pending" },
  ]), []);
  const filtered = partners.filter(x => x.name.toLowerCase().includes(s.filter.toLowerCase()));

  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <ChartCard title="Channel GMV · 30d" span={8}
          toolbar={<DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive}/>}>
          <LineSeries seed={61} lines={3} height={200}/>
          <div className="grid grid-cols-4 mt-3 text-center text-[11px]">
            <div><div className="text-muted-foreground">GMV MTD</div><div className="font-semibold tabular-nums text-success">$24.8M</div></div>
            <div><div className="text-muted-foreground">Deal Reg</div><div className="font-semibold tabular-nums">812</div></div>
            <div><div className="text-muted-foreground">Win Rate</div><div className="font-semibold tabular-nums text-info">38.2%</div></div>
            <div><div className="text-muted-foreground">Avg Margin</div><div className="font-semibold tabular-nums">19.4%</div></div>
          </div>
        </ChartCard>

        <ChartCard title="Tier Distribution" span={4}>
          <div className="grid grid-cols-3 gap-3 place-items-center">
            <div className="text-center"><Donut value={28} label="Platinum" color="var(--color-accent)" size={88}/></div>
            <div className="text-center"><Donut value={46} label="Gold" color="var(--color-warning)" size={88}/></div>
            <div className="text-center"><Donut value={26} label="Silver" color="var(--color-info)" size={88}/></div>
          </div>
          <div className="mt-3 text-[11px] text-muted-foreground text-center">4,128 resellers across 64 countries</div>
        </ChartCard>

        <ChartCard title="Resellers" span={12}
          toolbar={<>
            <FilterBar value={s.filter} onChange={s.setFilter} placeholder="Search resellers…"/>
            <button className="text-[11px] px-2 py-1 rounded-md bg-primary text-primary-foreground hover:opacity-90">Invite partner</button>
          </>}>
          {filtered.length === 0 ? (
            <EmptyState icon="Handshake" title="No partners match" hint="Adjust your filter to see resellers."/>
          ) : (
            <DataTable columns={["Partner","Tier","Region","Deals","GMV MTD","Margin","CSAT","Status",""]} rows={
              filtered.map((r,i)=>[
                <span key={i} className="flex items-center gap-2"><Avatar name={r.name}/><span className="font-medium">{r.name}</span></span>,
                <Pill key={i} tone={r.tier==="Platinum"?"accent":r.tier==="Gold"?"warning":"muted"}>{r.tier}</Pill>,
                <span key={i} className="text-muted-foreground">{r.region}</span>,
                <span key={i} className="tabular-nums">{r.deals}</span>,
                <span key={i} className="tabular-nums">${(r.gmv/1000).toFixed(0)}k</span>,
                <span key={i} className="tabular-nums">{r.margin}%</span>,
                <span key={i} className="tabular-nums">★ {r.csat}</span>,
                <Pill key={i} tone={r.status==="active"?"success":r.status==="review"?"warning":"info"}>{r.status}</Pill>,
                <button key={i} onClick={()=>setOpen({name:r.name})} className="text-[11px] text-primary hover:underline">Open</button>,
              ])
            }/>
          )}
        </ChartCard>

        <ChartCard title="Deal Registration Pipeline" span={8}>
          <Kanban columns={[
            { title: "Registered", tone: "info",    items: [{title:"Acme Cloud Migration",meta:"Northwind · $284k",tag:"Platinum"},{title:"Globex Renewal",meta:"Helix · $128k",tag:"Gold"}] },
            { title: "Qualified",  tone: "warning", items: [{title:"Wayne Ent. Expansion",meta:"Bolt · $612k",tag:"Platinum"},{title:"Initech Upgrade",meta:"Arc · $84k",tag:"Silver"}] },
            { title: "Co-sell",    tone: "info",    items: [{title:"Stark Industries",meta:"Pixel · $1.2M",tag:"Co-sell"}] },
            { title: "Closed Won", tone: "success", items: [{title:"Hooli SaaS",meta:"Tundra · $412k",tag:"Won"}] },
          ]}/>
        </ChartCard>

        <ChartCard title="Commissions · MTD" span={4}>
          <Bars seed={62} n={20} color="var(--color-success)" height={120}/>
          <div className="mt-3 space-y-2 text-[11px]">
            {[["Northwind Cloud","$184,200"],["Helix Systems","$148,400"],["Bolt Integrators","$132,800"],["Pixel Resell","$84,200"]].map(([n,v])=>(
              <div key={n} className="flex justify-between"><span>{n}</span><span className="tabular-nums text-success">{v}</span></div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Onboarding Funnel" span={4}>
          <div className="space-y-3 text-[11px]">
            {[["Applied",100,"info"],["Vetted",78,"info"],["Trained",62,"warning"],["Certified",48,"accent"],["Producing",34,"success"]].map(([l,v,t])=>(
              <div key={String(l)}>
                <div className="flex justify-between"><span>{l}</span><span className="tabular-nums">{v}%</span></div>
                <ProgressBar value={v as number} color={`var(--color-${t})`}/>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Global Channel Footprint" span={8}>
          <WorldMap seed={63}/>
        </ChartCard>

        <div className="col-span-12 lg:col-span-4">
          <AIInsights items={[
            { title: "EMEA tier upgrades", body: "12 Gold partners trending toward Platinum based on 90-day GMV velocity — automate tier review.", tone: "accent", confidence: 91 },
            { title: "Margin compression", body: "LATAM channel margin dropped 3.2pp vs prior period — review discount stacks for Arc Partners.", tone: "warning", confidence: 84 },
            { title: "Stalled pipeline", body: "4 co-sell deals idle >21 days totaling $2.1M — re-engage with field SE.", tone: "destructive", confidence: 88 },
          ]}/>
        </div>
      </div>

      <Modal open={!!open} onClose={()=>setOpen(null)} title={open?.name} size="lg"
        footer={<>
          <button onClick={()=>setOpen(null)} className="px-3 py-1.5 rounded-md bg-muted text-xs">Close</button>
          <button className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs">Open PRM record</button>
        </>}>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="glass rounded-md p-3"><div className="text-muted-foreground text-[10px]">YTD GMV</div><div className="text-lg font-semibold tabular-nums">$18.4M</div></div>
          <div className="glass rounded-md p-3"><div className="text-muted-foreground text-[10px]">Active Deals</div><div className="text-lg font-semibold tabular-nums">42</div></div>
          <div className="glass rounded-md p-3"><div className="text-muted-foreground text-[10px]">Cert. Engineers</div><div className="text-lg font-semibold tabular-nums">28</div></div>
          <div className="glass rounded-md p-3"><div className="text-muted-foreground text-[10px]">MDF Used</div><div className="text-lg font-semibold tabular-nums">82%</div></div>
        </div>
        <div className="mt-4">
          <div className="text-xs font-medium mb-2">Activity</div>
          <Timeline items={[
            { time: "2h", title: "Deal #DR-48218 advanced to Co-sell", tone: "info" },
            { time: "1d", title: "Engineer cert renewed · 4 SEs", tone: "success" },
            { time: "3d", title: "MDF request approved · $48k", tone: "info" },
            { time: "1w", title: "QBR completed", tone: "muted" },
          ]}/>
        </div>
      </Modal>
    </Shell>
  );
}

/* ---------------- Franchise Manager ---------------- */
export function FranchiseMgr({ d }: { d: DashSpec }) {
  const s = useDashboardState();
  const locations = useMemo(() => ([
    { name: "Berlin · Mitte",   owner: "Klara Vogt",    rev: 184_200, comp: 96, royal: 22_104, audit: "pass" },
    { name: "Tokyo · Shibuya",  owner: "Ren Tanaka",    rev: 312_800, comp: 98, royal: 37_536, audit: "pass" },
    { name: "São Paulo · Sé",   owner: "Lia Moreira",   rev: 98_400,  comp: 88, royal: 11_808, audit: "review" },
    { name: "Toronto · King W", owner: "Marc Beaulieu", rev: 142_600, comp: 94, royal: 17_112, audit: "pass" },
    { name: "Dubai · Marina",   owner: "Yara Al-Saadi", rev: 248_100, comp: 91, royal: 29_772, audit: "pass" },
    { name: "Lagos · VI",       owner: "Tunde Adeyemi", rev: 64_900,  comp: 78, royal: 7_788,  audit: "fail" },
  ]), []);
  const filtered = locations.filter(x => x.name.toLowerCase().includes(s.filter.toLowerCase()));

  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <ChartCard title="Network Revenue · 30d" span={8}
          toolbar={<DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive}/>}>
          <LineSeries seed={71} lines={2} height={200}/>
        </ChartCard>

        <ChartCard title="Brand Compliance" span={4} className="grid place-items-center">
          <Donut value={92} label="compliance" color="var(--color-success)"/>
        </ChartCard>

        <ChartCard title="Locations Heatmap · Daily Sales" span={8}>
          <Heatmap rows={6} cols={24} seed={72} color="var(--color-accent)"/>
          <div className="flex justify-between text-[10px] text-muted-foreground mt-2"><span>00:00</span><span>12:00</span><span>23:59</span></div>
        </ChartCard>

        <ChartCard title="Royalties Collected" span={4}>
          <Bars seed={73} n={14} color="var(--color-warning)" height={140}/>
          <div className="mt-2 text-[11px] flex justify-between"><span className="text-muted-foreground">MTD</span><span className="font-semibold text-warning tabular-nums">$1.42M</span></div>
        </ChartCard>

        <ChartCard title="Franchise Locations" span={12}
          toolbar={<FilterBar value={s.filter} onChange={s.setFilter} placeholder="Search locations…"/>}>
          {filtered.length === 0 ? (
            <EmptyState icon="Building2" title="No locations match"/>
          ) : (
            <DataTable columns={["Location","Owner","Revenue MTD","Compliance","Royalty Due","Audit"]} rows={
              filtered.map((r,i)=>[
                <span key={i} className="font-medium">{r.name}</span>,
                <span key={i} className="flex items-center gap-2"><Avatar name={r.owner}/>{r.owner}</span>,
                <span key={i} className="tabular-nums">${r.rev.toLocaleString()}</span>,
                <span key={i} className="flex items-center gap-2"><ProgressBar value={r.comp} color={r.comp>=90?"var(--color-success)":"var(--color-warning)"}/><span className="tabular-nums">{r.comp}%</span></span>,
                <span key={i} className="tabular-nums">${r.royal.toLocaleString()}</span>,
                <Pill key={i} tone={r.audit==="pass"?"success":r.audit==="review"?"warning":"destructive"}>{r.audit}</Pill>,
              ])
            }/>
          )}
        </ChartCard>

        <ChartCard title="Openings Pipeline" span={8}>
          <Kanban columns={[
            { title: "Lead",        tone: "info",    items: [{title:"Mumbai · BKC",meta:"Investor · $480k",tag:"LOI"},{title:"Madrid · Salamanca",meta:"Group · $320k",tag:"Lead"}] },
            { title: "Site Survey", tone: "warning", items: [{title:"Austin · East 6th",meta:"Owner · $280k",tag:"Survey"}] },
            { title: "Build-out",   tone: "info",    items: [{title:"Singapore · Orchard",meta:"GC active",tag:"Wk 6/12"}] },
            { title: "Open",        tone: "success", items: [{title:"Mexico City · Roma",meta:"Soft open",tag:"Live"}] },
          ]}/>
        </ChartCard>

        <div className="col-span-12 lg:col-span-4">
          <AIInsights items={[
            { title: "Lagos audit failure", body: "Brand compliance dropped to 78% — schedule field visit and refresh staff training modules.", tone: "destructive", confidence: 94 },
            { title: "Tokyo over-performing", body: "Shibuya revenue is +28% vs cohort — replay playbook to new APAC openings.", tone: "success", confidence: 90 },
            { title: "Royalty leakage", body: "$84k variance detected between POS feeds and royalty ledger across 3 sites.", tone: "warning", confidence: 86 },
          ]}/>
        </div>
      </div>
    </Shell>
  );
}

/* ---------------- Affiliate Manager ---------------- */
export function Affiliate({ d }: { d: DashSpec }) {
  const s = useDashboardState();
  const top = useMemo(() => ([
    { name: "techreview.io",   chan: "Content",  clicks: 482_100, conv: 12_840, epc: 1.84, payout: 28_400, fraud: 0.4, status: "active" },
    { name: "DealDrop App",    chan: "Coupon",   clicks: 1_204_800,conv:38_120, epc: 0.62, payout: 18_900, fraud: 2.1, status: "active" },
    { name: "@FinanceFox",     chan: "Social",   clicks: 312_400, conv: 8_420,  epc: 1.42, payout: 14_800, fraud: 0.8, status: "active" },
    { name: "savings-hub.com", chan: "Cashback", clicks: 942_100, conv: 28_410, epc: 0.48, payout: 11_200, fraud: 3.4, status: "review" },
    { name: "PixelPlay YT",    chan: "Video",    clicks: 218_400, conv: 5_240,  epc: 2.18, payout: 9_840,  fraud: 0.2, status: "active" },
  ]), []);
  const filtered = top.filter(x => x.name.toLowerCase().includes(s.filter.toLowerCase()));

  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <ChartCard title="Clicks & Conversions · 24h" span={8}
          toolbar={<DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive}/>}>
          <LineSeries seed={81} lines={2} height={200}/>
          <div className="grid grid-cols-4 mt-3 text-center text-[11px]">
            <div><div className="text-muted-foreground">Clicks</div><div className="font-semibold tabular-nums">4.8M</div></div>
            <div><div className="text-muted-foreground">Conversions</div><div className="font-semibold tabular-nums text-success">148k</div></div>
            <div><div className="text-muted-foreground">CR</div><div className="font-semibold tabular-nums">3.08%</div></div>
            <div><div className="text-muted-foreground">EPC</div><div className="font-semibold tabular-nums text-info">$0.84</div></div>
          </div>
        </ChartCard>

        <ChartCard title="Fraud Score" span={4} className="grid place-items-center">
          <Donut value={94} label="clean traffic" color="var(--color-success)"/>
        </ChartCard>

        <ChartCard title="Top Affiliates" span={12}
          toolbar={<>
            <FilterBar value={s.filter} onChange={s.setFilter} placeholder="Search affiliates…"/>
            <button className="text-[11px] px-2 py-1 rounded-md bg-primary text-primary-foreground">New program</button>
          </>}>
          {filtered.length === 0 ? (
            <EmptyState icon="Link2" title="No affiliates match"/>
          ) : (
            <DataTable columns={["Affiliate","Channel","Clicks","Conv","EPC","Payout MTD","Fraud","Status"]} rows={
              filtered.map((r,i)=>[
                <span key={i} className="font-medium">{r.name}</span>,
                <Pill key={i}>{r.chan}</Pill>,
                <span key={i} className="tabular-nums">{r.clicks.toLocaleString()}</span>,
                <span key={i} className="tabular-nums">{r.conv.toLocaleString()}</span>,
                <span key={i} className="tabular-nums">${r.epc.toFixed(2)}</span>,
                <span key={i} className="tabular-nums text-success">${r.payout.toLocaleString()}</span>,
                <span key={i} className={`tabular-nums ${r.fraud>2?"text-destructive":r.fraud>1?"text-warning":"text-muted-foreground"}`}>{r.fraud}%</span>,
                <Pill key={i} tone={r.status==="active"?"success":"warning"}>{r.status}</Pill>,
              ])
            }/>
          )}
        </ChartCard>

        <ChartCard title="Programs" span={6}>
          <div className="space-y-2 text-xs">
            {[
              { n: "SaaS Referral · 25% rec.",  v: 82, color: "primary" },
              { n: "Hardware · CPA $48",        v: 64, color: "accent"  },
              { n: "Newsletter · CPC $0.18",    v: 48, color: "info"    },
              { n: "Coupon · Hybrid 8% + CPA",  v: 38, color: "warning" },
            ].map(p => (
              <div key={p.n}>
                <div className="flex justify-between"><span>{p.n}</span><span className="tabular-nums">{p.v}%</span></div>
                <ProgressBar value={p.v} color={`var(--color-${p.color})`}/>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Postback Health" span={3}>
          <Bars seed={82} n={14} color="var(--color-info)" height={120}/>
          <div className="mt-2 text-[11px] text-success">99.94% delivered</div>
        </ChartCard>

        <ChartCard title="Payouts Queue" span={3}>
          <div className="text-2xl font-semibold tabular-nums">$1.24M</div>
          <div className="text-[10px] text-muted-foreground">428 affiliates · NET-30</div>
          <div className="mt-3 space-y-1 text-[11px]">
            <div className="flex justify-between"><span>PayPal</span><span className="tabular-nums">$614k</span></div>
            <div className="flex justify-between"><span>Wire</span><span className="tabular-nums">$412k</span></div>
            <div className="flex justify-between"><span>Crypto</span><span className="tabular-nums">$214k</span></div>
          </div>
        </ChartCard>

        <ChartCard title="Fraud Events · 24h" span={8}>
          <Timeline items={[
            { time: "14:02", title: "Click flooding from savings-hub.com · 4,820 IPs", tone: "destructive", meta: "auto-paused" },
            { time: "12:48", title: "Cookie stuffing flagged · DealDrop App", tone: "warning", meta: "manual review" },
            { time: "11:12", title: "Bot signature blocked · postback 218", tone: "info", meta: "rule R-48" },
            { time: "09:40", title: "Self-referral attempt · @FinanceFox", tone: "warning", meta: "denied" },
            { time: "06:18", title: "Geo mismatch · 14 conversions reversed", tone: "info" },
          ]}/>
        </ChartCard>

        <div className="col-span-12 lg:col-span-4">
          <AIInsights items={[
            { title: "EPC anomaly", body: "techreview.io EPC jumped 38% — likely high-intent launch traffic, raise daily budget cap.", tone: "success", confidence: 92 },
            { title: "Fraud cluster", body: "Coupon channel exceeds 2% invalid clicks — apply stricter device fingerprint rule.", tone: "destructive", confidence: 88 },
            { title: "Payout optimization", body: "Move $214k crypto payouts to monthly batch to save $4.8k in network fees.", tone: "info", confidence: 81 },
          ]}/>
        </div>
      </div>
    </Shell>
  );
}

/* ---------------- Influencer Manager ---------------- */
export function Influencer({ d }: { d: DashSpec }) {
  const s = useDashboardState();
  const [open, setOpen] = useState<null | { name: string }>(null);
  const creators = useMemo(() => ([
    { name: "@nova.fit",     plat: "Instagram", followers: "2.4M",  er: 6.8, posts: 24, emv: 412_000, status: "live" },
    { name: "@codewithren",  plat: "YouTube",   followers: "1.8M",  er: 8.2, posts: 12, emv: 624_000, status: "live" },
    { name: "@luxbyjade",    plat: "TikTok",    followers: "4.2M",  er: 12.4,posts: 48, emv: 884_000, status: "live" },
    { name: "@chefmarcoo",   plat: "Reels",     followers: "812k",  er: 9.4, posts: 18, emv: 218_000, status: "review" },
    { name: "@quietgamer",   plat: "Twitch",    followers: "284k",  er: 14.8,posts: 6,  emv: 142_000, status: "draft" },
    { name: "@studio.hana",  plat: "Instagram", followers: "612k",  er: 7.2, posts: 14, emv: 184_000, status: "live" },
  ]), []);
  const filtered = creators.filter(x => x.name.toLowerCase().includes(s.filter.toLowerCase()));

  return (
    <Shell d={d}>
      <div className="grid grid-cols-12 gap-4">
        <ChartCard title="Campaign Reach · 30d" span={8}
          toolbar={<DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive}/>}>
          <LineSeries seed={91} lines={3} height={200}/>
          <div className="grid grid-cols-4 mt-3 text-center text-[11px]">
            <div><div className="text-muted-foreground">Reach</div><div className="font-semibold tabular-nums">148M</div></div>
            <div><div className="text-muted-foreground">Engagements</div><div className="font-semibold tabular-nums text-accent">12.8M</div></div>
            <div><div className="text-muted-foreground">EMV</div><div className="font-semibold tabular-nums text-success">$12.4M</div></div>
            <div><div className="text-muted-foreground">Avg ER</div><div className="font-semibold tabular-nums">8.4%</div></div>
          </div>
        </ChartCard>

        <ChartCard title="Sentiment Mix" span={4}>
          <div className="grid grid-cols-3 gap-2 place-items-center">
            <div className="text-center"><Donut value={72} label="positive" color="var(--color-success)" size={80}/></div>
            <div className="text-center"><Donut value={22} label="neutral" color="var(--color-muted-foreground)" size={80}/></div>
            <div className="text-center"><Donut value={6} label="negative" color="var(--color-destructive)" size={80}/></div>
          </div>
        </ChartCard>

        <ChartCard title="Creator Roster" span={12}
          toolbar={<>
            <FilterBar value={s.filter} onChange={s.setFilter} placeholder="Search creators…"/>
            <button className="text-[11px] px-2 py-1 rounded-md bg-primary text-primary-foreground">New brief</button>
          </>}>
          {filtered.length === 0 ? (
            <EmptyState icon="Megaphone" title="No creators match"/>
          ) : (
            <DataTable columns={["Creator","Platform","Followers","ER","Posts","EMV","Status",""]} rows={
              filtered.map((r,i)=>[
                <span key={i} className="flex items-center gap-2"><Avatar name={r.name.replace("@","")} color="var(--color-accent)"/><span className="font-medium">{r.name}</span></span>,
                <Pill key={i} tone="accent">{r.plat}</Pill>,
                <span key={i} className="tabular-nums">{r.followers}</span>,
                <span key={i} className="tabular-nums">{r.er}%</span>,
                <span key={i} className="tabular-nums">{r.posts}</span>,
                <span key={i} className="tabular-nums text-success">${(r.emv/1000).toFixed(0)}k</span>,
                <Pill key={i} tone={r.status==="live"?"success":r.status==="review"?"warning":"info"}>{r.status}</Pill>,
                <button key={i} onClick={()=>setOpen({name:r.name})} className="text-[11px] text-primary hover:underline">Brief</button>,
              ])
            }/>
          )}
        </ChartCard>

        <ChartCard title="Active Campaigns" span={8}>
          <Kanban columns={[
            { title: "Brief",     tone: "info",    items: [{title:"SS26 Launch · LuxByJade",meta:"TikTok · 4 posts",tag:"Draft"},{title:"Pro Tools v4",meta:"YouTube · 1 review",tag:"Brief"}] },
            { title: "Content",   tone: "warning", items: [{title:"Hydrate Campaign",meta:"@nova.fit · 6 reels",tag:"Editing"}] },
            { title: "Approved",  tone: "info",    items: [{title:"Game Night",meta:"@quietgamer · stream",tag:"Scheduled"}] },
            { title: "Published", tone: "success", items: [{title:"Studio Tour · @studio.hana",meta:"Reach 4.2M",tag:"Live"},{title:"Knife Skills · Chef Marco",meta:"EMV $84k",tag:"Live"}] },
          ]}/>
        </ChartCard>

        <ChartCard title="Posting Heatmap" span={4}>
          <Heatmap rows={7} cols={12} seed={92} color="var(--color-accent)"/>
          <div className="mt-2 text-[11px] text-muted-foreground">Mon–Sun · last 12 weeks</div>
        </ChartCard>

        <ChartCard title="Payments · Creator Payouts" span={8}>
          <Bars seed={93} n={20} color="var(--color-success)" height={120}/>
          <div className="mt-3 grid grid-cols-3 text-center text-[11px]">
            <div><div className="text-muted-foreground">Pending</div><div className="font-semibold tabular-nums text-warning">$284k</div></div>
            <div><div className="text-muted-foreground">Approved</div><div className="font-semibold tabular-nums">$612k</div></div>
            <div><div className="text-muted-foreground">Paid MTD</div><div className="font-semibold tabular-nums text-success">$1.04M</div></div>
          </div>
        </ChartCard>

        <div className="col-span-12 lg:col-span-4">
          <AIInsights items={[
            { title: "Whitelist opportunity", body: "@luxbyjade content outperforms paid ads CPM by 4.2x — request whitelisting for 14-day Spark Ads window.", tone: "accent", confidence: 93 },
            { title: "Compliance check", body: "2 posts missing #ad disclosure — auto-notice sent to creators for edits.", tone: "warning", confidence: 96 },
            { title: "Burnout signal", body: "@chefmarcoo posting cadence dropped 38% — pause cadence, re-brief with creative freedom.", tone: "info", confidence: 82 },
          ]}/>
        </div>
      </div>

      <Modal open={!!open} onClose={()=>setOpen(null)} title={`Creator brief · ${open?.name}`} size="lg"
        footer={<>
          <button onClick={()=>setOpen(null)} className="px-3 py-1.5 rounded-md bg-muted text-xs">Cancel</button>
          <button className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs inline-flex items-center gap-1.5"><Icons.Send className="w-3.5 h-3.5"/>Send brief</button>
        </>}>
        <div className="space-y-3 text-xs">
          <div>
            <label className="text-muted-foreground text-[10px] uppercase tracking-wider">Campaign</label>
            <input defaultValue="SS26 Capsule Launch" className="mt-1 w-full bg-muted rounded-md px-2 py-1.5 border border-border outline-none focus:border-primary"/>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-muted-foreground text-[10px] uppercase tracking-wider">Deliverables</label><input defaultValue="2 Reels + 4 Stories" className="mt-1 w-full bg-muted rounded-md px-2 py-1.5 border border-border outline-none"/></div>
            <div><label className="text-muted-foreground text-[10px] uppercase tracking-wider">Fee</label><input defaultValue="$24,000" className="mt-1 w-full bg-muted rounded-md px-2 py-1.5 border border-border outline-none"/></div>
          </div>
          <div>
            <label className="text-muted-foreground text-[10px] uppercase tracking-wider">Talking points</label>
            <textarea rows={4} defaultValue={"• Sustainable fabric story\n• 20% pre-order code NOVA20\n• Tag @brand and use #SS26Capsule\n• Required disclosure: #ad"} className="mt-1 w-full bg-muted rounded-md px-2 py-1.5 border border-border outline-none font-mono text-[11px]"/>
          </div>
        </div>
      </Modal>
    </Shell>
  );
}
