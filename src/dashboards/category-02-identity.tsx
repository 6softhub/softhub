import { useMemo, useState } from "react";
import * as Icons from "lucide-react";
import type { DashSpec } from "@/data/dashboards";
import {
  Pill, Donut, Bars, LineSeries, ProgressBar, Heatmap, Timeline,
  StatusDot, WorldMap, Terminal, Spark, DataTable, rng,
} from "./_primitives";
import {
  ChartCard, FilterBar, AIInsights, QuickActions, DashboardToolbar,
  EmptyState, Modal, useDashboardState,
} from "./_universal";

/* ============================================================
   CATEGORY 02 — IDENTITY + USER + ACCESS
   IAM · User & Roles · Biometric · Device/Endpoint · Remote Access
   ============================================================ */

const grid = "grid grid-cols-12 gap-4";

function Header({ d, right }: { d: DashSpec; right?: React.ReactNode }) {
  const Icon = (Icons as never as Record<string, Icons.LucideIcon>)[d.icon] || Icons.ShieldCheck;
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 animate-fade-up">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-accent/20 border border-border grid place-items-center text-primary">
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            {d.category} · Clone of {d.clone}
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">{d.title}</h1>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs flex-wrap">
        {d.tags.map((t) => (
          <span key={t} className="px-2 py-1 rounded-md bg-muted border border-border">{t}</span>
        ))}
        {right}
      </div>
    </header>
  );
}

function Kpis({ items }: { items: { label: string; value: string; delta?: string; tone?: "success" | "warning" | "destructive" | "info" }[] }) {
  const map = { success: "text-success", warning: "text-warning", destructive: "text-destructive", info: "text-info" };
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-3">
      {items.map((m, i) => (
        <div key={i} className="glass rounded-xl p-3 card-hover animate-fade-up">
          <div className="flex items-center justify-between">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{m.label}</div>
            {m.delta && <span className={`text-[10px] ${m.tone ? map[m.tone] : "text-success"}`}>{m.delta}</span>}
          </div>
          <div className="mt-1 text-xl font-semibold tracking-tight">{m.value}</div>
          <div className="mt-1.5"><Spark seed={i + 13} /></div>
        </div>
      ))}
    </div>
  );
}

function Tabs({ tabs, value, onChange }: { tabs: string[]; value: string; onChange: (s: string) => void }) {
  return (
    <div role="tablist" className="flex flex-wrap gap-1 p-1 rounded-md bg-muted border border-border text-[11px] w-fit">
      {tabs.map((t) => (
        <button key={t} role="tab" aria-selected={value === t} onClick={() => onChange(t)}
          className={`px-3 py-1.5 rounded transition-colors focus-ring ${value === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
          {t}
        </button>
      ))}
    </div>
  );
}

/* ============================================================
   1. Identity & Access Management
   ============================================================ */
export function IAM({ d }: { d: DashSpec }) {
  const s = useDashboardState();
  const [tab, setTab] = useState("Overview");
  const [reviewOpen, setReviewOpen] = useState(false);

  const kpis = [
    { label: "Active Identities", value: "84,219", delta: "+312", tone: "success" as const },
    { label: "MFA Coverage", value: "97.4%", delta: "+0.8%", tone: "success" as const },
    { label: "Privileged", value: "1,204", delta: "-18", tone: "info" as const },
    { label: "Risky Sessions", value: "37", delta: "+9", tone: "destructive" as const },
    { label: "SSO Apps", value: "412", delta: "+6", tone: "info" as const },
    { label: "Avg Auth", value: "84 ms", delta: "-12 ms", tone: "success" as const },
  ];

  const providers = [
    { name: "Okta", users: 41200, status: "healthy" },
    { name: "Azure AD", users: 28100, status: "healthy" },
    { name: "Google Workspace", users: 9800, status: "degraded" },
    { name: "OneLogin", users: 3400, status: "healthy" },
    { name: "PingFederate", users: 1719, status: "healthy" },
  ];

  return (
    <div className="space-y-5">
      <Header d={d} right={<button onClick={() => setReviewOpen(true)} className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium inline-flex items-center gap-1.5"><Icons.UserCheck className="w-3.5 h-3.5" /> Access Review</button>} />
      <DashboardToolbar
        range={s.range} onRangeChange={s.setRange}
        live={s.live} onLiveChange={s.setLive}
        right={<Tabs tabs={["Overview", "Identities", "Policies", "Audit"]} value={tab} onChange={setTab} />}
      />
      <Kpis items={kpis} />

      {tab === "Overview" && (
        <div className={grid}>
          <ChartCard title="Authentication Volume" subtitle="Successful vs failed across all IDPs" span={8}>
            <LineSeries seed={11} lines={3} height={220} />
            <div className="mt-2 flex items-center gap-4 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary" /> Success</span>
              <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-accent" /> MFA</span>
              <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-destructive" /> Failed</span>
            </div>
          </ChartCard>
          <ChartCard title="MFA Coverage" subtitle="Org-wide enrollment" span={4}>
            <div className="grid place-items-center py-2"><Donut value={97} label="Enrolled" /></div>
            <div className="mt-3 space-y-2 text-xs">
              {[["TOTP", 62], ["WebAuthn", 24], ["Push", 11], ["SMS", 3]].map(([k, v]) => (
                <div key={k as string}>
                  <div className="flex justify-between mb-1"><span>{k}</span><span className="text-muted-foreground">{v}%</span></div>
                  <ProgressBar value={v as number} />
                </div>
              ))}
            </div>
          </ChartCard>

          <ChartCard title="Identity Providers" span={6}>
            <DataTable
              columns={["Provider", "Users", "Status"]}
              rows={providers.map((p) => [
                <span className="font-medium">{p.name}</span>,
                p.users.toLocaleString(),
                <span className="inline-flex items-center gap-1.5"><StatusDot tone={p.status === "healthy" ? "success" : "warning"} />{p.status}</span>,
              ])}
            />
          </ChartCard>
          <ChartCard title="Global Sign-in Map" span={6}>
            <WorldMap seed={d.id} />
          </ChartCard>

          <ChartCard title="Risk Signals" span={4}>
            <Heatmap rows={6} cols={20} seed={d.id + 4} />
            <div className="mt-2 text-[11px] text-muted-foreground">Impossible travel · TOR exits · velocity</div>
          </ChartCard>
          <ChartCard title="Recent Auth Events" span={8}>
            <Timeline items={[
              { time: "12:42", title: "MFA challenge passed — kara@acme", tone: "success" },
              { time: "12:38", title: "Risk score elevated — VPN anomaly", tone: "warning" },
              { time: "12:31", title: "Privileged role granted: db-admin", tone: "info" },
              { time: "12:18", title: "5 failed attempts blocked from 185.220.101.5", tone: "destructive" },
              { time: "11:52", title: "Access review completed — Engineering OU", tone: "success" },
            ]} />
          </ChartCard>
        </div>
      )}

      {tab === "Identities" && (
        <ChartCard title="Identity Directory">
          <FilterBar filters={["All", "Employees", "Contractors", "Service Accounts", "Privileged"]} active={s.filter} onChange={s.setFilter} />
          <div className="mt-3">
            <DataTable
              columns={["User", "Role", "MFA", "Last Login", "Risk"]}
              rows={Array.from({ length: 8 }).map((_, i) => {
                const r = rng(i + d.id)();
                const risk = r > 0.8 ? "high" : r > 0.5 ? "med" : "low";
                return [
                  <span className="font-medium">user{i + 1}@acme.io</span>,
                  ["Engineer", "Admin", "Analyst", "PM", "SRE"][i % 5],
                  <Pill tone={i % 3 === 0 ? "warning" : "success"}>{i % 3 === 0 ? "TOTP" : "WebAuthn"}</Pill>,
                  `${(r * 60).toFixed(0)}m ago`,
                  <Pill tone={risk === "high" ? "destructive" : risk === "med" ? "warning" : "success"}>{risk}</Pill>,
                ];
              })}
            />
          </div>
        </ChartCard>
      )}

      {tab === "Policies" && (
        <div className={grid}>
          <ChartCard title="Active Policies" span={7}>
            <DataTable
              columns={["Policy", "Scope", "Type", "Status"]}
              rows={[
                ["Require MFA — Admins", "Privileged", "Conditional", <Pill tone="success">enforced</Pill>],
                ["Block legacy auth", "All", "Block", <Pill tone="success">enforced</Pill>],
                ["Geo restrict — Finance", "Finance OU", "Conditional", <Pill tone="success">enforced</Pill>],
                ["Session lifetime 8h", "All", "Lifetime", <Pill tone="info">monitor</Pill>],
                ["Risky sign-in: step-up", "All", "Risk", <Pill tone="warning">draft</Pill>],
              ]}
            />
          </ChartCard>
          <ChartCard title="Policy Coverage" span={5}>
            <div className="grid place-items-center py-3"><Donut value={88} label="Coverage" /></div>
            <div className="text-[11px] text-muted-foreground text-center">12% of apps without conditional access</div>
          </ChartCard>
        </div>
      )}

      {tab === "Audit" && (
        <ChartCard title="Audit Log Stream" toolbar={<Pill tone="success">live</Pill>}>
          <Terminal lines={[
            { t: "[12:42:01] admin.role.assign user=kara role=db-admin", tone: "info" },
            { t: "[12:41:55] mfa.enroll method=webauthn user=jonas", tone: "success" },
            { t: "[12:41:30] policy.eval result=allow user=ben app=salesforce", tone: "muted" },
            { t: "[12:40:12] risk.elevated reason=impossible_travel user=mira", tone: "warning" },
            { t: "[12:39:44] login.failure attempts=5 ip=185.220.101.5", tone: "destructive" },
            { t: "[12:38:01] sso.session.start user=anita app=jira", tone: "muted" },
          ]} />
        </ChartCard>
      )}

      <QuickActions actions={[
        { label: "New Policy", icon: Icons.FilePlus2 },
        { label: "Bulk MFA Enroll", icon: Icons.KeyRound },
        { label: "Run Access Review", icon: Icons.UserCheck, onClick: () => setReviewOpen(true) },
        { label: "Export Audit", icon: Icons.Download },
      ]} />
      <AIInsights items={[
        "37 dormant privileged accounts — recommend revoke",
        "MFA gap detected in Finance OU (3 users)",
        "Geo anomaly cluster from APAC → trigger step-up policy",
      ]} />

      <Modal open={reviewOpen} onClose={() => setReviewOpen(false)} title="Access Review — Q2"
        footer={<><button onClick={() => setReviewOpen(false)} className="px-3 py-1.5 rounded-md text-xs bg-muted border border-border">Cancel</button><button className="px-3 py-1.5 rounded-md text-xs bg-primary text-primary-foreground">Start Review</button></>}>
        <p className="text-sm text-muted-foreground">Initiate an org-wide access certification across all privileged roles. Reviewers will be auto-assigned by manager hierarchy.</p>
        <ul className="mt-3 text-xs space-y-1.5">
          <li className="flex justify-between"><span>Scope</span><span className="text-muted-foreground">1,204 privileged identities</span></li>
          <li className="flex justify-between"><span>Reviewers</span><span className="text-muted-foreground">182 managers</span></li>
          <li className="flex justify-between"><span>Deadline</span><span className="text-muted-foreground">14 days</span></li>
        </ul>
      </Modal>
    </div>
  );
}

/* ============================================================
   2. User & Role Management
   ============================================================ */
export function UserRoles({ d }: { d: DashSpec }) {
  const s = useDashboardState();
  const [tab, setTab] = useState("Roles");

  const kpis = [
    { label: "Total Users", value: "12,840", delta: "+92", tone: "success" as const },
    { label: "Roles", value: "186", delta: "+4", tone: "info" as const },
    { label: "Groups", value: "412", delta: "+11", tone: "info" as const },
    { label: "Permissions", value: "3,206", delta: "+38", tone: "info" as const },
    { label: "Pending Requests", value: "47", tone: "warning" as const },
    { label: "SoD Conflicts", value: "12", tone: "destructive" as const },
  ];

  const roles = [
    { name: "super-admin", users: 8, perms: 412, risk: "high" },
    { name: "platform-admin", users: 24, perms: 218, risk: "high" },
    { name: "engineer", users: 1840, perms: 86, risk: "med" },
    { name: "analyst", users: 720, perms: 42, risk: "low" },
    { name: "support-l2", users: 96, perms: 64, risk: "med" },
    { name: "finance-ops", users: 38, perms: 124, risk: "med" },
    { name: "viewer", users: 9210, perms: 12, risk: "low" },
  ];

  return (
    <div className="space-y-5">
      <Header d={d} />
      <DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveChange={s.setLive}
        right={<Tabs tabs={["Roles", "Users", "Groups", "Requests"]} value={tab} onChange={setTab} />} />
      <Kpis items={kpis} />

      {tab === "Roles" && (
        <div className={grid}>
          <ChartCard title="Role Hierarchy" subtitle="Inheritance tree" span={5}>
            <div className="space-y-1 text-xs font-mono">
              {[
                { d: 0, n: "super-admin", t: "destructive" },
                { d: 1, n: "platform-admin", t: "warning" },
                { d: 2, n: "billing-admin", t: "warning" },
                { d: 2, n: "security-admin", t: "warning" },
                { d: 1, n: "engineer", t: "info" },
                { d: 2, n: "sre", t: "info" },
                { d: 2, n: "developer", t: "info" },
                { d: 1, n: "analyst", t: "muted" },
                { d: 1, n: "viewer", t: "muted" },
              ].map((row, i) => (
                <div key={i} className="flex items-center gap-2 py-1 px-2 rounded hover:bg-muted/40" style={{ paddingLeft: 8 + row.d * 18 }}>
                  <Icons.ChevronRight className="w-3 h-3 text-muted-foreground" />
                  <StatusDot tone={row.t as never} />
                  <span>{row.n}</span>
                </div>
              ))}
            </div>
          </ChartCard>
          <ChartCard title="Role Catalog" span={7}>
            <DataTable
              columns={["Role", "Users", "Permissions", "Risk"]}
              rows={roles.map((r) => [
                <span className="font-medium">{r.name}</span>,
                r.users.toLocaleString(),
                r.perms,
                <Pill tone={r.risk === "high" ? "destructive" : r.risk === "med" ? "warning" : "success"}>{r.risk}</Pill>,
              ])}
            />
          </ChartCard>
          <ChartCard title="Permission Distribution" span={8}>
            <Bars seed={d.id + 2} n={28} color="var(--color-primary)" height={140} />
          </ChartCard>
          <ChartCard title="Separation of Duties" span={4}>
            <div className="grid place-items-center py-2"><Donut value={94} label="Compliant" color="var(--color-success)" /></div>
            <div className="text-[11px] text-center text-muted-foreground">12 conflicts pending review</div>
          </ChartCard>
        </div>
      )}

      {tab === "Users" && (
        <ChartCard title="Users">
          <FilterBar filters={["All", "Active", "Suspended", "Invited"]} active={s.filter} onChange={s.setFilter} />
          <div className="mt-3">
            <DataTable
              columns={["User", "Email", "Roles", "Groups", "Status"]}
              rows={Array.from({ length: 8 }).map((_, i) => [
                <span className="font-medium">User {i + 1}</span>,
                `user${i + 1}@acme.io`,
                <span className="text-muted-foreground">{["engineer", "analyst", "admin", "viewer"][i % 4]}</span>,
                <span className="text-muted-foreground">{["sre", "data", "platform", "ops"][i % 4]}</span>,
                <Pill tone={i % 5 === 0 ? "warning" : "success"}>{i % 5 === 0 ? "invited" : "active"}</Pill>,
              ])}
            />
          </div>
        </ChartCard>
      )}

      {tab === "Groups" && (
        <div className={grid}>
          <ChartCard title="Groups" span={7}>
            <DataTable
              columns={["Group", "Members", "Roles", "Sync"]}
              rows={[
                ["engineering-all", "1,840", "engineer", <Pill tone="success">SCIM</Pill>],
                ["sre-oncall", "42", "sre", <Pill tone="success">SCIM</Pill>],
                ["finance", "120", "finance-ops", <Pill tone="info">manual</Pill>],
                ["contractors-2026", "84", "viewer", <Pill tone="warning">expiring</Pill>],
                ["security-team", "24", "security-admin", <Pill tone="success">SCIM</Pill>],
              ]}
            />
          </ChartCard>
          <ChartCard title="Membership Heatmap" span={5}>
            <Heatmap rows={6} cols={18} seed={d.id + 9} />
          </ChartCard>
        </div>
      )}

      {tab === "Requests" && (
        <ChartCard title="Pending Access Requests">
          <DataTable
            columns={["Requester", "Resource", "Justification", "Approver", "Action"]}
            rows={Array.from({ length: 6 }).map((_, i) => [
              `user${i + 1}@acme.io`,
              ["s3:prod-data", "vault:db-prod", "github:org-owners", "k8s:cluster-admin"][i % 4],
              <span className="text-muted-foreground truncate inline-block max-w-[200px]">incident response · ticket #{1200 + i}</span>,
              `manager${i + 1}@acme.io`,
              <span className="inline-flex gap-1"><button className="px-2 py-0.5 rounded text-[10px] bg-success/15 text-success border border-success/30">Approve</button><button className="px-2 py-0.5 rounded text-[10px] bg-destructive/15 text-destructive border border-destructive/30">Deny</button></span>,
            ])}
          />
        </ChartCard>
      )}

      <QuickActions actions={[
        { label: "Create Role", icon: Icons.ShieldPlus },
        { label: "Invite User", icon: Icons.UserPlus },
        { label: "Sync SCIM", icon: Icons.RefreshCw },
        { label: "Bulk Import", icon: Icons.Upload },
      ]} />
      <AIInsights items={[
        "Role 'platform-admin' grants 3 redundant permissions — recommend split",
        "8 users idle 90+ days hold privileged roles — recommend deprovision",
        "Group 'contractors-2026' has 4 expiring memberships this week",
      ]} />
    </div>
  );
}

/* ============================================================
   3. Biometric & Physical Access Control
   ============================================================ */
export function Biometric({ d }: { d: DashSpec }) {
  const s = useDashboardState();
  const [tab, setTab] = useState("Live");

  const kpis = [
    { label: "Sites", value: "42", delta: "+1", tone: "info" as const },
    { label: "Doors Online", value: "1,206 / 1,210", tone: "success" as const },
    { label: "Today Scans", value: "84,219", delta: "+12%", tone: "success" as const },
    { label: "Denials", value: "204", delta: "-18", tone: "info" as const },
    { label: "Tailgate Alerts", value: "7", tone: "warning" as const },
    { label: "False Match Rate", value: "0.001%", tone: "success" as const },
  ];

  const cameras = Array.from({ length: 12 }).map((_, i) => ({ name: `CAM-${100 + i}`, zone: ["Lobby", "Server", "Garage", "Vault"][i % 4], alert: i === 3 || i === 9 }));

  return (
    <div className="space-y-5">
      <Header d={d} right={<Pill tone="success">live</Pill>} />
      <DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveChange={s.setLive}
        right={<Tabs tabs={["Live", "Doors", "Enrollments", "Incidents"]} value={tab} onChange={setTab} />} />
      <Kpis items={kpis} />

      {tab === "Live" && (
        <div className={grid}>
          <ChartCard title="Camera Wall" subtitle="Live face-recognition feeds" span={8}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {cameras.map((c, i) => (
                <div key={i} className="relative aspect-video rounded-md overflow-hidden border border-border bg-gradient-to-br from-muted to-card grid-bg">
                  <div className="absolute inset-0 grid place-items-center">
                    <Icons.ScanFace className={`w-8 h-8 ${c.alert ? "text-destructive animate-pulse" : "text-muted-foreground/40"}`} />
                  </div>
                  <div className="absolute top-1 left-1 text-[10px] font-mono bg-black/60 text-white px-1.5 py-0.5 rounded">{c.name}</div>
                  <div className="absolute bottom-1 right-1"><StatusDot tone={c.alert ? "destructive" : "success"} /></div>
                  <div className="absolute bottom-1 left-1 text-[10px] text-white/80 bg-black/40 px-1 rounded">{c.zone}</div>
                </div>
              ))}
            </div>
          </ChartCard>
          <ChartCard title="Recognition Confidence" span={4}>
            <div className="grid place-items-center py-2"><Donut value={99} label="Match" color="var(--color-success)" /></div>
            <div className="space-y-2 mt-2 text-xs">
              <div className="flex justify-between"><span>Face</span><span className="text-muted-foreground">99.7%</span></div>
              <ProgressBar value={99} color="var(--color-success)" />
              <div className="flex justify-between"><span>Fingerprint</span><span className="text-muted-foreground">98.2%</span></div>
              <ProgressBar value={98} color="var(--color-primary)" />
              <div className="flex justify-between"><span>Iris</span><span className="text-muted-foreground">99.9%</span></div>
              <ProgressBar value={100} color="var(--color-accent)" />
            </div>
          </ChartCard>

          <ChartCard title="Access Trend" span={8}>
            <LineSeries seed={d.id + 5} lines={2} height={180} />
          </ChartCard>
          <ChartCard title="Zone Activity" span={4}>
            <Heatmap rows={6} cols={14} seed={d.id + 17} color="var(--color-accent)" />
          </ChartCard>
        </div>
      )}

      {tab === "Doors" && (
        <ChartCard title="Door Controllers">
          <DataTable
            columns={["Door", "Site", "Reader", "Status", "Last Event"]}
            rows={Array.from({ length: 8 }).map((_, i) => [
              `D-${200 + i}`,
              ["HQ-NY", "DC-FRA", "HQ-NY", "DC-SIN"][i % 4],
              ["face+pin", "fingerprint", "iris", "card+face"][i % 4],
              <span className="inline-flex items-center gap-1.5"><StatusDot tone={i === 6 ? "destructive" : "success"} />{i === 6 ? "offline" : "online"}</span>,
              `${i + 1}m ago`,
            ])}
          />
        </ChartCard>
      )}

      {tab === "Enrollments" && (
        <div className={grid}>
          <ChartCard title="Enrollment Pipeline" span={8}>
            <Bars seed={d.id + 3} n={20} color="var(--color-primary)" height={140} />
          </ChartCard>
          <ChartCard title="Pending" span={4}>
            <Timeline items={[
              { time: "today", title: "12 new hires queued", tone: "info" },
              { time: "yesterday", title: "8 contractors approved", tone: "success" },
              { time: "2d ago", title: "3 re-enrollments", tone: "warning" },
            ]} />
          </ChartCard>
        </div>
      )}

      {tab === "Incidents" && (
        <ChartCard title="Physical Security Incidents">
          <Timeline items={[
            { time: "12:42", title: "Tailgate detected — Door D-204 (HQ-NY)", tone: "destructive" },
            { time: "11:18", title: "Forced entry alarm cleared — D-118 (DC-FRA)", tone: "warning" },
            { time: "09:02", title: "Badge cloned attempt blocked — Vault zone", tone: "destructive" },
            { time: "08:30", title: "Fire door propped open >5min — D-301", tone: "warning" },
          ]} />
        </ChartCard>
      )}

      <QuickActions actions={[
        { label: "Lockdown", icon: Icons.Lock, tone: "destructive" },
        { label: "Enroll Person", icon: Icons.UserPlus },
        { label: "Export Logs", icon: Icons.Download },
        { label: "Dispatch Guard", icon: Icons.Siren, tone: "warning" },
      ]} />
      <AIInsights items={[
        "Tailgate hotspot: HQ-NY lobby between 09:00-10:00",
        "False rejects spike at D-118 — recommend recalibrate",
        "After-hours access to Vault zone increased 18% WoW",
      ]} />
    </div>
  );
}

/* ============================================================
   4. Device & Endpoint Management (MDM)
   ============================================================ */
export function MDM({ d }: { d: DashSpec }) {
  const s = useDashboardState();
  const [tab, setTab] = useState("Fleet");
  const [pushOpen, setPushOpen] = useState(false);

  const kpis = [
    { label: "Managed Devices", value: "18,420", delta: "+128", tone: "success" as const },
    { label: "Compliant", value: "94.2%", delta: "+0.6%", tone: "success" as const },
    { label: "Encrypted", value: "99.8%", tone: "success" as const },
    { label: "Patched < 30d", value: "88%", delta: "-2%", tone: "warning" as const },
    { label: "Lost / Stolen", value: "12", tone: "destructive" as const },
    { label: "OS Updates Pending", value: "1,842", tone: "info" as const },
  ];

  const platforms = [
    { name: "macOS", count: 7820, pct: 42 },
    { name: "Windows", count: 6210, pct: 34 },
    { name: "iOS", count: 2840, pct: 15 },
    { name: "Android", count: 1120, pct: 6 },
    { name: "Linux", count: 430, pct: 3 },
  ];

  return (
    <div className="space-y-5">
      <Header d={d} right={<button onClick={() => setPushOpen(true)} className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium inline-flex items-center gap-1.5"><Icons.Send className="w-3.5 h-3.5" /> Push Policy</button>} />
      <DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveChange={s.setLive}
        right={<Tabs tabs={["Fleet", "Compliance", "Apps", "Policies"]} value={tab} onChange={setTab} />} />
      <Kpis items={kpis} />

      {tab === "Fleet" && (
        <div className={grid}>
          <ChartCard title="Platform Distribution" span={4}>
            <div className="space-y-2 text-xs">
              {platforms.map((p) => (
                <div key={p.name}>
                  <div className="flex justify-between mb-1"><span>{p.name}</span><span className="text-muted-foreground">{p.count.toLocaleString()} · {p.pct}%</span></div>
                  <ProgressBar value={p.pct * 2} />
                </div>
              ))}
            </div>
          </ChartCard>
          <ChartCard title="Check-ins (24h)" span={8}>
            <LineSeries seed={d.id + 12} lines={3} height={200} />
          </ChartCard>

          <ChartCard title="Device Inventory" span={12}>
            <FilterBar filters={["All", "Workstation", "Mobile", "Server", "Kiosk"]} active={s.filter} onChange={s.setFilter} />
            <div className="mt-3">
              <DataTable
                columns={["Device", "User", "OS", "Last Seen", "Compliance"]}
                rows={Array.from({ length: 8 }).map((_, i) => [
                  <span className="font-mono text-[11px]">DEV-{4000 + i}</span>,
                  `user${i + 1}@acme.io`,
                  ["macOS 15.2", "Win 11 23H2", "iOS 18.3", "Ubuntu 24.04"][i % 4],
                  `${(i + 1) * 3}m ago`,
                  <Pill tone={i === 5 ? "destructive" : i === 2 ? "warning" : "success"}>{i === 5 ? "non-compliant" : i === 2 ? "drift" : "compliant"}</Pill>,
                ])}
              />
            </div>
          </ChartCard>
        </div>
      )}

      {tab === "Compliance" && (
        <div className={grid}>
          <ChartCard title="Compliance Score" span={4}>
            <div className="grid place-items-center py-3"><Donut value={94} label="Compliant" color="var(--color-success)" /></div>
          </ChartCard>
          <ChartCard title="Compliance Checks" span={8}>
            <DataTable
              columns={["Check", "Pass", "Fail", "Coverage"]}
              rows={[
                ["Disk Encryption", "18,388", "32", <ProgressBar value={99} color="var(--color-success)" />],
                ["Screen Lock", "18,210", "210", <ProgressBar value={98} color="var(--color-success)" />],
                ["OS Patched <30d", "16,210", "2,210", <ProgressBar value={88} color="var(--color-warning)" />],
                ["Antivirus Active", "18,402", "18", <ProgressBar value={99} color="var(--color-success)" />],
                ["Firewall On", "17,920", "500", <ProgressBar value={97} color="var(--color-success)" />],
                ["MDM Profile", "18,420", "0", <ProgressBar value={100} color="var(--color-success)" />],
              ]}
            />
          </ChartCard>
        </div>
      )}

      {tab === "Apps" && (
        <ChartCard title="Application Inventory">
          <DataTable
            columns={["App", "Version", "Installs", "Vulnerable", "Action"]}
            rows={[
              ["Chrome", "131.0", "12,820", <Pill tone="success">0</Pill>, <button className="text-[10px] underline text-primary">push</button>],
              ["Slack", "4.42", "9,210", <Pill tone="success">0</Pill>, <button className="text-[10px] underline text-primary">push</button>],
              ["Zoom", "6.2.4", "8,420", <Pill tone="warning">2</Pill>, <button className="text-[10px] underline text-primary">update</button>],
              ["1Password", "8.10", "6,810", <Pill tone="success">0</Pill>, <button className="text-[10px] underline text-primary">push</button>],
              ["Docker", "4.36", "3,210", <Pill tone="destructive">CVE</Pill>, <button className="text-[10px] underline text-destructive">block</button>],
            ]}
          />
        </ChartCard>
      )}

      {tab === "Policies" && (
        <div className={grid}>
          <ChartCard title="Active Policies" span={7}>
            <DataTable
              columns={["Policy", "Platform", "Devices", "Status"]}
              rows={[
                ["Disk Encryption", "macOS/Win", "13,820", <Pill tone="success">enforced</Pill>],
                ["Auto-update OS", "All", "18,420", <Pill tone="success">enforced</Pill>],
                ["VPN Always-on", "Mobile", "3,960", <Pill tone="success">enforced</Pill>],
                ["USB Block", "Win", "6,210", <Pill tone="warning">monitor</Pill>],
                ["App Allowlist", "Kiosk", "120", <Pill tone="success">enforced</Pill>],
              ]}
            />
          </ChartCard>
          <ChartCard title="Rollout Health" span={5}>
            <Bars seed={d.id + 8} n={16} color="var(--color-accent)" height={140} />
          </ChartCard>
        </div>
      )}

      <QuickActions actions={[
        { label: "Push Policy", icon: Icons.Send, onClick: () => setPushOpen(true) },
        { label: "Wipe Device", icon: Icons.Trash2, tone: "destructive" },
        { label: "Lock Device", icon: Icons.Lock },
        { label: "Locate", icon: Icons.MapPin },
      ]} />
      <AIInsights items={[
        "1,842 devices behind on OS patches — schedule maintenance window",
        "Docker CVE-2024-XXX impacts 3,210 devices — push update",
        "12 devices marked stolen still emitting telemetry — auto-wipe candidate",
      ]} />

      <Modal open={pushOpen} onClose={() => setPushOpen(false)} title="Push Policy"
        footer={<><button onClick={() => setPushOpen(false)} className="px-3 py-1.5 rounded-md text-xs bg-muted border border-border">Cancel</button><button className="px-3 py-1.5 rounded-md text-xs bg-primary text-primary-foreground">Push to 18,420 devices</button></>}>
        <div className="space-y-3 text-sm">
          <label className="block">
            <span className="text-xs text-muted-foreground">Policy</span>
            <select className="mt-1 w-full bg-muted border border-border rounded-md px-2 py-1.5 text-sm focus-ring">
              <option>Disk Encryption</option><option>VPN Always-on</option><option>App Allowlist</option>
            </select>
          </label>
          <label className="block">
            <span className="text-xs text-muted-foreground">Target</span>
            <select className="mt-1 w-full bg-muted border border-border rounded-md px-2 py-1.5 text-sm focus-ring">
              <option>All managed devices</option><option>macOS only</option><option>Windows only</option>
            </select>
          </label>
        </div>
      </Modal>
    </div>
  );
}

/* ============================================================
   5. Remote Access & Device Control
   ============================================================ */
export function RemoteAccess({ d }: { d: DashSpec }) {
  const s = useDashboardState();
  const [tab, setTab] = useState("Sessions");
  const [selected, setSelected] = useState<number | null>(null);

  const kpis = [
    { label: "Active Sessions", value: "284", delta: "+12", tone: "info" as const },
    { label: "Avg Latency", value: "42 ms", delta: "-3 ms", tone: "success" as const },
    { label: "Engineers Online", value: "96", tone: "success" as const },
    { label: "Recordings", value: "12,420", tone: "info" as const },
    { label: "Privileged Sessions", value: "38", tone: "warning" as const },
    { label: "Anomalies", value: "4", tone: "destructive" as const },
  ];

  const sessions = Array.from({ length: 6 }).map((_, i) => ({
    id: 1000 + i,
    user: `engineer${i + 1}`,
    device: `prod-${["db", "web", "k8s", "edge"][i % 4]}-${10 + i}`,
    proto: ["SSH", "RDP", "VNC", "Kube"][i % 4],
    region: ["us-east-1", "eu-west-1", "ap-south-1", "us-west-2"][i % 4],
    risk: i === 3 ? "high" : i === 1 ? "med" : "low",
  }));

  return (
    <div className="space-y-5">
      <Header d={d} right={<Pill tone="success">tunnel healthy</Pill>} />
      <DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveChange={s.setLive}
        right={<Tabs tabs={["Sessions", "Devices", "Recordings", "Anomalies"]} value={tab} onChange={setTab} />} />
      <Kpis items={kpis} />

      {tab === "Sessions" && (
        <div className={grid}>
          <ChartCard title="Active Sessions" span={7}>
            <DataTable
              columns={["#", "User", "Target", "Proto", "Region", "Risk", "Action"]}
              rows={sessions.map((sess, i) => [
                <span className="font-mono text-[11px]">{sess.id}</span>,
                sess.user,
                <span className="font-mono text-[11px]">{sess.device}</span>,
                <Pill>{sess.proto}</Pill>,
                <span className="text-muted-foreground">{sess.region}</span>,
                <Pill tone={sess.risk === "high" ? "destructive" : sess.risk === "med" ? "warning" : "success"}>{sess.risk}</Pill>,
                <span className="inline-flex gap-1">
                  <button onClick={() => setSelected(i)} className="px-2 py-0.5 rounded text-[10px] bg-muted border border-border">view</button>
                  <button className="px-2 py-0.5 rounded text-[10px] bg-destructive/15 text-destructive border border-destructive/30">kill</button>
                </span>,
              ])}
            />
          </ChartCard>
          <ChartCard title="Live Terminal" subtitle={selected !== null ? `session #${sessions[selected].id}` : "select a session"} span={5}>
            {selected === null ? <EmptyState title="No session selected" hint="Click view on a row" /> : (
              <Terminal lines={[
                { t: `$ ssh ${sessions[selected].user}@${sessions[selected].device}`, tone: "muted" },
                { t: "Last login: Tue May 14 12:42:01 2026", tone: "muted" },
                { t: "[admin@host] $ kubectl get pods -n prod", tone: "info" },
                { t: "NAME             STATUS    AGE", tone: "muted" },
                { t: "api-7b9c-xxxx    Running   12d", tone: "success" },
                { t: "worker-2f1d-y    Running   12d", tone: "success" },
                { t: "[admin@host] $ tail -f /var/log/app.log", tone: "info" },
              ]} />
            )}
          </ChartCard>

          <ChartCard title="Concurrent Sessions" span={8}>
            <LineSeries seed={d.id + 6} lines={2} height={180} />
          </ChartCard>
          <ChartCard title="Geo Distribution" span={4}>
            <WorldMap seed={d.id + 9} />
          </ChartCard>
        </div>
      )}

      {tab === "Devices" && (
        <ChartCard title="Reachable Devices">
          <DataTable
            columns={["Host", "Type", "Region", "Tunnel", "Last Access"]}
            rows={Array.from({ length: 8 }).map((_, i) => [
              <span className="font-mono text-[11px]">prod-host-{100 + i}</span>,
              ["VM", "Bare metal", "Container", "Edge"][i % 4],
              ["us-east-1", "eu-west-1", "ap-south-1"][i % 3],
              <span className="inline-flex items-center gap-1.5"><StatusDot tone="success" />wireguard</span>,
              `${i + 1}h ago`,
            ])}
          />
        </ChartCard>
      )}

      {tab === "Recordings" && (
        <div className={grid}>
          <ChartCard title="Session Recordings" span={8}>
            <DataTable
              columns={["Session", "User", "Target", "Duration", "Reviewed"]}
              rows={Array.from({ length: 6 }).map((_, i) => [
                <span className="font-mono text-[11px]">REC-{8000 + i}</span>,
                `engineer${i + 1}`,
                <span className="font-mono text-[11px]">prod-db-{10 + i}</span>,
                `${20 + i * 7}m`,
                <Pill tone={i % 2 === 0 ? "success" : "warning"}>{i % 2 === 0 ? "yes" : "pending"}</Pill>,
              ])}
            />
          </ChartCard>
          <ChartCard title="Storage" span={4}>
            <div className="grid place-items-center py-2"><Donut value={62} label="Used" /></div>
            <div className="text-[11px] text-center text-muted-foreground">3.1 TB / 5 TB · 90d retention</div>
          </ChartCard>
        </div>
      )}

      {tab === "Anomalies" && (
        <ChartCard title="Session Anomalies">
          <Timeline items={[
            { time: "12:42", title: "Off-hours SSH to prod-db-12 (engineer4)", tone: "destructive" },
            { time: "11:18", title: "Privileged sudo escalation — engineer2", tone: "warning" },
            { time: "10:02", title: "Geo mismatch: session opened from new country", tone: "warning" },
            { time: "09:30", title: "Long idle session terminated", tone: "info" },
          ]} />
        </ChartCard>
      )}

      <QuickActions actions={[
        { label: "Open Session", icon: Icons.Terminal },
        { label: "Kill All Idle", icon: Icons.PowerOff, tone: "warning" },
        { label: "Export Recording", icon: Icons.Download },
        { label: "Rotate Keys", icon: Icons.KeyRound },
      ]} />
      <AIInsights items={[
        "engineer4 active on prod-db at 02:00 local — flag for review",
        "12 idle sessions >30min — auto-disconnect recommended",
        "RDP latency from ap-south-1 elevated 18% — investigate edge node",
      ]} />
    </div>
  );
}
