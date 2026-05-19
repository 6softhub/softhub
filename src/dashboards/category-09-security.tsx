import { useState } from "react";
import type { DashSpec } from "@/data/dashboards";
import { Shell, Pill, Bars, Donut, Heatmap, WorldMap, DataTable, Timeline, LineSeries, Terminal } from "./_primitives";
import { ChartCard, AIInsights, DashboardToolbar, FilterBar, QuickActions, Modal, useDashboardState } from "./_universal";

/* ============================================================
   GROUP 09 — SECURITY + RISK
   SOC, Fraud, Forensics, IAM, UserRoles, Biometric, MDM, RemoteAccess
   ============================================================ */

const useS = () => useDashboardState("24h");

function DonutRow({ items }: { items: { label: string; value: number; color: string }[] }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map((it, i) => (
        <div key={i} className="flex items-center gap-2">
          <Donut value={it.value} label={`${it.value}%`} color={it.color} size={68} />
          <div className="text-[11px] text-muted-foreground truncate">{it.label}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- SOC ---------------- */
export function SOCPremium({ d }: { d: DashSpec }) {
  const s = useS();
  const [open, setOpen] = useState(false);
  return (
    <Shell d={d}>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <FilterBar value={s.filter} onChange={s.setFilter} placeholder="Search notables, hosts, users, IOCs…" />
        <DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive} extra={<QuickActions items={[{label:"Open Case",icon:"Plus",tone:"primary",onClick:()=>setOpen(true)},{label:"Run Playbook",icon:"Play",tone:"accent"}]} />} />
      </div>
      <div className="grid grid-cols-12 gap-4">
        <ChartCard span={8} title="Notable Events · Severity Stream" toolbar={<Pill tone="destructive">12 Critical</Pill>}>
          <LineSeries seed={91} lines={4} height={220} />
        </ChartCard>
        <ChartCard span={4} title="MITRE ATT&CK Coverage">
          <DonutRow items={[{label:"Covered",value:74,color:"var(--color-success)"},{label:"Partial",value:18,color:"var(--color-warning)"},{label:"Gap",value:8,color:"var(--color-destructive)"},{label:"TTPs Tuned",value:62,color:"var(--color-info)"}]} />
        </ChartCard>
        <ChartCard span={6} title="Threat Origin · Live" toolbar={<Pill tone="info">248 sources</Pill>}>
          <WorldMap seed={13} />
        </ChartCard>
        <ChartCard span={6} title="Detection Surface · Day × Hour">
          <Heatmap rows={7} cols={24} seed={7} color="var(--color-destructive)" />
        </ChartCard>
        <ChartCard span={8} title="Open Investigations">
          <DataTable columns={["Case","Severity","Asset","Analyst","SLA"]} rows={[
            ["INC-4821","Critical","srv-edge-04","M. Reyes","02:14"],
            ["INC-4820","High","laptop-128","A. Voss","04:48"],
            ["INC-4818","High","cluster-prd","J. Tan","06:12"],
            ["INC-4815","Medium","mailbox-12","S. Park","18:30"],
            ["INC-4810","Low","kiosk-09","D. Kim","22:00"],
          ]} />
        </ChartCard>
        <AIInsights items={[
          {title:"Lateral movement pattern",body:"Kerberoasting + SMB enum from laptop-128 — quarantine recommended.",tone:"destructive",confidence:94},
          {title:"Phishing wave",body:"24 mailboxes received OAuth consent lure in last 30m. Auto-revoke applied.",tone:"warning",confidence:88},
        ]} />
      </div>
      <Modal open={open} onClose={()=>setOpen(false)} title="New investigation" footer={<><button className="text-xs px-3 py-1.5 rounded-md border border-border" onClick={()=>setOpen(false)}>Cancel</button><button className="text-xs px-3 py-1.5 rounded-md bg-primary text-primary-foreground">Create case</button></>}>
        <p className="text-xs text-muted-foreground">Assign analyst, link IOCs and trigger SOAR playbook.</p>
      </Modal>
    </Shell>
  );
}

/* ---------------- FRAUD ---------------- */
export function FraudPremium({ d }: { d: DashSpec }) {
  const s = useS();
  return (
    <Shell d={d}>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <FilterBar value={s.filter} onChange={s.setFilter} placeholder="Filter txn, device, model…" />
        <DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive} />
      </div>
      <div className="grid grid-cols-12 gap-4">
        <ChartCard span={8} title="Anomaly Stream · 60s window"><LineSeries seed={31} lines={3} height={220} /></ChartCard>
        <ChartCard span={4} title="Decisions">
          <DonutRow items={[{label:"Approve",value:88,color:"var(--color-success)"},{label:"Review",value:9,color:"var(--color-warning)"},{label:"Block",value:3,color:"var(--color-destructive)"},{label:"Step-up",value:14,color:"var(--color-info)"}]} />
        </ChartCard>
        <ChartCard span={6} title="Model Performance" toolbar={<Pill tone="success">AUC 0.97</Pill>}>
          <Bars seed={17} color="var(--color-accent)" />
        </ChartCard>
        <ChartCard span={6} title="Risk Surface · Heatmap"><Heatmap rows={6} cols={24} seed={4} color="var(--color-warning)" /></ChartCard>
        <ChartCard span={8} title="High-risk Transactions">
          <DataTable columns={["Txn","Amount","Score","Device","Action"]} rows={[
            ["TX-90412","$12,400","0.97","iOS · NY","Blocked"],
            ["TX-90411","$3,180","0.91","Android · LA","Review"],
            ["TX-90409","$842","0.74","Web · DE","Allowed"],
            ["TX-90408","$24,900","0.99","Web · RU","Blocked"],
          ]} />
        </ChartCard>
        <AIInsights items={[
          {title:"Velocity attack",body:"Ring of 18 devices testing BINs from ASN-12345 — auto-block ruleset deployed.",tone:"destructive",confidence:96},
          {title:"FP reduction",body:"Lowering threshold on Model v7 from 0.62→0.58 reduces false positives 14%.",tone:"info",confidence:80},
        ]} />
      </div>
    </Shell>
  );
}

/* ---------------- FORENSICS ---------------- */
export function ForensicsPremium({ d }: { d: DashSpec }) {
  const s = useS();
  return (
    <Shell d={d}>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <FilterBar value={s.filter} onChange={s.setFilter} placeholder="Search cases, evidence, custodians…" />
        <DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive} />
      </div>
      <div className="grid grid-cols-12 gap-4">
        <ChartCard span={4} title="Case Status">
          <DonutRow items={[{label:"Active",value:42,color:"var(--color-warning)"},{label:"Review",value:28,color:"var(--color-info)"},{label:"Closed",value:30,color:"var(--color-success)"},{label:"On Hold",value:8,color:"var(--color-muted-foreground)"}]} />
        </ChartCard>
        <ChartCard span={8} title="Evidence Acquired (GB / week)"><Bars seed={23} color="var(--color-primary)" /></ChartCard>
        <ChartCard span={7} title="Active Cases">
          <DataTable columns={["Case","Custodian","Devices","Evidence","Examiner"]} rows={[
            ["FC-2048","J. Carter","4 devices","124 GB","M. Lin"],
            ["FC-2047","R. Patel","2 devices","48 GB","S. Okafor"],
            ["FC-2045","K. Yamada","8 devices","312 GB","A. Voss"],
          ]} />
        </ChartCard>
        <ChartCard span={5} title="Chain-of-custody Timeline">
          <Timeline items={[
            {time:"09:14",title:"FC-2048 · Hash verified on UFED export",tone:"success"},
            {time:"08:42",title:"FC-2047 · Cloud acquisition started",tone:"info"},
            {time:"07:30",title:"FC-2045 · Pathfinder timeline rebuilt",tone:"warning"},
          ]} />
        </ChartCard>
        <AIInsights items={[
          {title:"Timeline correlation",body:"FC-2048 device shows 3 USB mass-storage events within 2m of exfil signal.",tone:"warning",confidence:89},
        ]} />
      </div>
    </Shell>
  );
}

/* ---------------- IAM ---------------- */
export function IAMPremium({ d }: { d: DashSpec }) {
  const s = useS();
  return (
    <Shell d={d}>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <FilterBar value={s.filter} onChange={s.setFilter} placeholder="Search users, apps, policies…" />
        <DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive} />
      </div>
      <div className="grid grid-cols-12 gap-4">
        <ChartCard span={8} title="Sign-in Activity · Success vs Risk"><LineSeries seed={22} lines={2} height={220} /></ChartCard>
        <ChartCard span={4} title="MFA Coverage">
          <DonutRow items={[{label:"WebAuthn",value:46,color:"var(--color-success)"},{label:"TOTP",value:36,color:"var(--color-info)"},{label:"SMS",value:14,color:"var(--color-warning)"},{label:"None",value:4,color:"var(--color-destructive)"}]} />
        </ChartCard>
        <ChartCard span={6} title="Sign-ins by Region"><WorldMap seed={61} /></ChartCard>
        <ChartCard span={6} title="App Access Heatmap"><Heatmap rows={8} cols={24} seed={2} color="var(--color-info)" /></ChartCard>
        <ChartCard span={12} title="Risky Sign-ins">
          <DataTable columns={["User","App","Risk","Location","Action"]} rows={[
            ["alex@acme.io","Salesforce","High","Lagos · NG","Step-up"],
            ["mira@acme.io","GitHub","Medium","Berlin · DE","Allow"],
            ["sven@acme.io","Snowflake","High","Moscow · RU","Block"],
            ["luca@acme.io","Okta Admin","Critical","TOR exit","Block"],
          ]} />
        </ChartCard>
        <AIInsights items={[
          {title:"Dormant admin",body:"3 admin accounts inactive 90+ days — revoke privileges via lifecycle workflow.",tone:"warning",confidence:92},
        ]} />
      </div>
    </Shell>
  );
}

/* ---------------- USER ROLES ---------------- */
export function UserRolesPremium({ d }: { d: DashSpec }) {
  const s = useS();
  return (
    <Shell d={d}>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <FilterBar value={s.filter} onChange={s.setFilter} placeholder="Search role, tenant, permission…" />
        <DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive} />
      </div>
      <div className="grid grid-cols-12 gap-4">
        <ChartCard span={4} title="Roles Distribution">
          <DonutRow items={[{label:"Member",value:62,color:"var(--color-primary)"},{label:"Editor",value:22,color:"var(--color-accent)"},{label:"Admin",value:11,color:"var(--color-warning)"},{label:"Owner",value:5,color:"var(--color-destructive)"}]} />
        </ChartCard>
        <ChartCard span={8} title="Permission Drift (per tenant)"><Bars seed={48} color="var(--color-warning)" /></ChartCard>
        <ChartCard span={8} title="Roles & Permissions">
          <DataTable columns={["Tenant","Role","Members","Perms","Updated"]} rows={[
            ["acme","admin","18","248","2h ago"],
            ["initech","editor","412","82","1d ago"],
            ["umbrella","viewer","1,204","12","3d ago"],
            ["stark","owner","6","∞","12m ago"],
          ]} />
        </ChartCard>
        <ChartCard span={4} title="Recent Role Changes">
          <Timeline items={[
            {time:"now",title:"acme · Granted billing.read to finance",tone:"info"},
            {time:"22m",title:"stark · Revoked owner from j.doe",tone:"warning"},
            {time:"1h",title:"initech · New custom role 'auditor'",tone:"success"},
          ]} />
        </ChartCard>
        <AIInsights items={[
          {title:"Over-privileged role",body:"'editor' grants 14 unused permissions across 412 users — split into 2 roles.",tone:"warning",confidence:84},
        ]} />
      </div>
    </Shell>
  );
}

/* ---------------- BIOMETRIC ---------------- */
export function BiometricPremium({ d }: { d: DashSpec }) {
  const s = useS();
  return (
    <Shell d={d}>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <FilterBar value={s.filter} onChange={s.setFilter} placeholder="Filter door, badge, event…" />
        <DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive} />
      </div>
      <div className="grid grid-cols-12 gap-4">
        <ChartCard span={8} title="Access Events · Live"><LineSeries seed={55} lines={2} height={220} /></ChartCard>
        <ChartCard span={4} title="Auth Methods">
          <DonutRow items={[{label:"Face",value:48,color:"var(--color-primary)"},{label:"Fingerprint",value:28,color:"var(--color-accent)"},{label:"Mobile ID",value:18,color:"var(--color-info)"},{label:"NFC",value:6,color:"var(--color-warning)"}]} />
        </ChartCard>
        <ChartCard span={12} title="Door Activity · Day × Hour"><Heatmap rows={7} cols={24} seed={3} color="var(--color-primary)" /></ChartCard>
        <ChartCard span={8} title="Doors">
          <DataTable columns={["Door","Building","Mode","Today","Status"]} rows={[
            ["D-101","HQ · L1","Face+PIN","2,418","Online"],
            ["D-204","R&D · L2","Face","1,902","Online"],
            ["D-309","DC-East","Multi-factor","614","Locked"],
            ["D-410","Cafeteria","NFC","3,201","Online"],
          ]} />
        </ChartCard>
        <ChartCard span={4} title="Security Events">
          <Timeline items={[
            {time:"now",title:"D-309 · Tailgate attempt detected",tone:"destructive"},
            {time:"14m",title:"D-101 · Badge cloning alert resolved",tone:"warning"},
            {time:"1h",title:"D-204 · After-hours access granted",tone:"info"},
          ]} />
        </ChartCard>
        <AIInsights items={[
          {title:"Tailgate cluster",body:"D-309 shows 3 tailgate events this week — recommend turnstile retrofit.",tone:"destructive",confidence:90},
        ]} />
      </div>
    </Shell>
  );
}

/* ---------------- MDM ---------------- */
export function MDMPremium({ d }: { d: DashSpec }) {
  const s = useS();
  return (
    <Shell d={d}>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <FilterBar value={s.filter} onChange={s.setFilter} placeholder="Search device, app, profile…" />
        <DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive} />
      </div>
      <div className="grid grid-cols-12 gap-4">
        <ChartCard span={4} title="Platforms">
          <DonutRow items={[{label:"Windows",value:38,color:"var(--color-info)"},{label:"macOS",value:22,color:"var(--color-primary)"},{label:"iOS",value:24,color:"var(--color-accent)"},{label:"Android",value:16,color:"var(--color-success)"}]} />
        </ChartCard>
        <ChartCard span={8} title="Compliance Trend · 30d"><LineSeries seed={77} lines={2} height={220} /></ChartCard>
        <ChartCard span={6} title="Patch Adoption (per app)"><Bars seed={64} color="var(--color-success)" /></ChartCard>
        <ChartCard span={6} title="Enrollments · Day × Hour"><Heatmap rows={7} cols={24} seed={6} color="var(--color-info)" /></ChartCard>
        <ChartCard span={12} title="Non-compliant Devices">
          <DataTable columns={["Device","User","Platform","Issue","Last seen"]} rows={[
            ["MAC-2841","j.lin","macOS 13.4","OS outdated","12m"],
            ["WIN-9120","r.ortiz","Win 11","Disk unencrypted","2h"],
            ["IOS-4412","k.silva","iOS 16.1","Jailbroken","1d"],
            ["AND-7720","m.gupta","Android 12","No screen lock","3h"],
          ]} />
        </ChartCard>
        <AIInsights items={[
          {title:"OS fleet drift",body:"38 macOS devices lag 2+ minor versions — schedule auto-update window Sat 02:00.",tone:"warning",confidence:87},
        ]} />
      </div>
    </Shell>
  );
}

/* ---------------- REMOTE ACCESS ---------------- */
export function RemoteAccessPremium({ d }: { d: DashSpec }) {
  const s = useS();
  const [term, setTerm] = useState(false);
  return (
    <Shell d={d}>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <FilterBar value={s.filter} onChange={s.setFilter} placeholder="Search session, endpoint, technician…" />
        <DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive} extra={<QuickActions items={[{label:"Open Console",icon:"Terminal",tone:"primary",onClick:()=>setTerm(true)}]} />} />
      </div>
      <div className="grid grid-cols-12 gap-4">
        <ChartCard span={8} title="Active Sessions · Latency"><LineSeries seed={8} lines={3} height={220} /></ChartCard>
        <ChartCard span={4} title="Session Types">
          <DonutRow items={[{label:"Attended",value:54,color:"var(--color-primary)"},{label:"Unattended",value:32,color:"var(--color-accent)"},{label:"M2M",value:14,color:"var(--color-info)"},{label:"Recorded",value:78,color:"var(--color-success)"}]} />
        </ChartCard>
        <ChartCard span={6} title="Endpoints Online by Region"><WorldMap seed={29} /></ChartCard>
        <ChartCard span={6} title="Session Heatmap"><Heatmap rows={7} cols={24} seed={5} color="var(--color-primary)" /></ChartCard>
        <ChartCard span={12} title="Live Sessions">
          <DataTable columns={["Session","Endpoint","Technician","Duration","Latency"]} rows={[
            ["RA-7184","srv-prd-04","M. Reyes","00:14:22","38ms"],
            ["RA-7183","laptop-128","A. Voss","00:42:10","52ms"],
            ["RA-7181","kiosk-09","J. Tan","01:08:48","64ms"],
            ["RA-7179","router-edge-2","S. Park","00:03:42","22ms"],
          ]} />
        </ChartCard>
        <AIInsights items={[
          {title:"Conditional access drift",body:"7 endpoints accept unmanaged BYOD sessions — tighten policy 'Tier1-Production'.",tone:"warning",confidence:91},
        ]} />
      </div>
      <Modal open={term} onClose={()=>setTerm(false)} title="Remote console · srv-prd-04" size="lg">
        <Terminal lines={[
          {t:"$ ssh ops@srv-prd-04"},
          {t:"Welcome to Ubuntu 22.04.4 LTS",tone:"muted"},
          {t:"ops@srv-prd-04:~$ systemctl status nginx"},
          {t:"● nginx.service — active (running)",tone:"success"},
          {t:"ops@srv-prd-04:~$ tail -f /var/log/nginx/access.log"},
          {t:"10.0.4.18 - - [19/May/2026:11:42:08] \"GET / HTTP/2\" 200 1842",tone:"info"},
        ]} />
      </Modal>
    </Shell>
  );
}
