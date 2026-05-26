import { useState } from "react";
import * as Icons from "lucide-react";
import type { DashSpec } from "@/data/dashboards";
import {
  Pill, Donut, Bars, LineSeries, Heatmap, Timeline,
  WorldMap, Terminal, Spark, DataTable,
} from "./_primitives";
import {
  ChartCard, AIInsights, DashboardToolbar, Modal, TabBar, FilterBar, QuickActions,
  useDashboardState, useTabs,
} from "./_universal";

/* ============================================================
   CATEGORY 02 — IDENTITY + USER + ACCESS (multi-tab)
   IAM · User Roles · Biometric · MDM · Remote Access
   ============================================================ */

const grid = "grid grid-cols-12 gap-4";

function Header({ d, right }: { d: DashSpec; right?: React.ReactNode }) {
  const Icon = (Icons as never as Record<string, Icons.LucideIcon>)[d.icon] || Icons.ShieldCheck;
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 animate-fade-up">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-accent/10 border border-border grid place-items-center text-primary">
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
        {d.tags.slice(0, 3).map((t) => (
          <span key={t} className="px-2 py-1 rounded-md bg-muted border border-border">{t}</span>
        ))}
        {right}
      </div>
    </header>
  );
}

type Kpi = { label: string; value: string; delta?: string; tone?: "success" | "warning" | "destructive" | "info" };
function Kpis({ items }: { items: Kpi[] }) {
  const map = { success: "text-success", warning: "text-warning", destructive: "text-destructive", info: "text-info" };
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-3">
      {items.map((m, i) => (
        <div key={i} className="glass rounded-xl p-3 card-hover animate-fade-up">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{m.label}</span>
            {m.delta && <span className={`text-[10px] ${map[m.tone || "info"]}`}>{m.delta}</span>}
          </div>
          <div className="mt-1 text-xl font-semibold tabular-nums tracking-tight">{m.value}</div>
          <div className={`mt-1 ${map[m.tone || "info"]}`}><Spark seed={i + 3} height={22} /></div>
        </div>
      ))}
    </div>
  );
}

function PageShell({ d, toolbar, children }: { d: DashSpec; toolbar: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1600px] mx-auto">
      <Header d={d} right={toolbar} />
      {children}
    </div>
  );
}

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

/* ============================================================
   1. IAM
   ============================================================ */
type IAMTab = "sign-ins" | "mfa" | "apps" | "risk";
export function IAM({ d }: { d: DashSpec }) {
  const s = useDashboardState();
  const { tab, setTab } = useTabs<IAMTab>("sign-ins");
  return (
    <PageShell d={d} toolbar={<DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive} />}>
      <Kpis items={[
        { label: "Active users", value: "18,402", delta: "+312", tone: "success" },
        { label: "Sign-ins / 24h", value: "94,118", delta: "+4.1%", tone: "info" },
        { label: "MFA coverage", value: "96.4%", delta: "+1.2pp", tone: "success" },
        { label: "Risky sign-ins", value: "284", delta: "-18", tone: "warning" },
        { label: "Blocked", value: "61", tone: "destructive" },
        { label: "Apps integrated", value: "412", tone: "info" },
      ]} />
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <FilterBar value={s.filter} onChange={s.setFilter} placeholder="Search users, apps, policies…" />
      </div>
      <TabBar<IAMTab>
        value={tab} onChange={setTab}
        tabs={[
          { id: "sign-ins", label: "Sign-ins", icon: "LogIn" },
          { id: "mfa", label: "MFA & Factors", icon: "KeyRound" },
          { id: "apps", label: "Applications", icon: "AppWindow", badge: 412 },
          { id: "risk", label: "Risk & Policies", icon: "ShieldAlert", badge: 12 },
        ]}
      />

      {tab === "sign-ins" && (
        <div className={grid}>
          <ChartCard span={8} title="Sign-in Activity · Success vs Risk" toolbar={<Pill tone="success">99.6% success</Pill>}>
            <LineSeries seed={22} lines={2} height={220} />
          </ChartCard>
          <ChartCard span={4} title="Auth Outcomes">
            <DonutRow items={[
              { label: "Success", value: 92, color: "var(--color-success)" },
              { label: "Step-up", value: 5, color: "var(--color-warning)" },
              { label: "Blocked", value: 2, color: "var(--color-destructive)" },
              { label: "Federated", value: 64, color: "var(--color-info)" },
            ]} />
          </ChartCard>
          <ChartCard span={7} title="Sign-ins by Region · Live"><WorldMap seed={61} /></ChartCard>
          <ChartCard span={5} title="Recent Sign-ins">
            <Timeline items={[
              { time: "now", title: "alex@acme.io · WebAuthn · NY", tone: "success" },
              { time: "2m", title: "mira@acme.io · TOTP step-up · Berlin", tone: "info" },
              { time: "6m", title: "sven@acme.io · BLOCKED · Moscow", tone: "destructive" },
              { time: "12m", title: "luca@acme.io · BLOCKED · TOR exit", tone: "destructive" },
              { time: "22m", title: "ops bot · service token rotated", tone: "info" },
            ]} />
          </ChartCard>
        </div>
      )}

      {tab === "mfa" && (
        <div className={grid}>
          <ChartCard span={4} title="MFA Coverage">
            <DonutRow items={[
              { label: "WebAuthn", value: 46, color: "var(--color-success)" },
              { label: "TOTP", value: 36, color: "var(--color-info)" },
              { label: "SMS", value: 14, color: "var(--color-warning)" },
              { label: "None", value: 4, color: "var(--color-destructive)" },
            ]} />
          </ChartCard>
          <ChartCard span={8} title="Factor enrollment trend"><LineSeries seed={48} lines={3} height={220} /></ChartCard>
          <ChartCard span={12} title="Users without strong factor">
            <DataTable columns={["User", "Department", "Last sign-in", "Current factor", "Action"]} rows={[
              ["k.howard@acme.io", "Sales", "3h ago", "SMS", "Enforce WebAuthn"],
              ["t.nakano@acme.io", "Eng", "1d ago", "None", "Enroll required"],
              ["s.olsen@acme.io", "Finance", "2h ago", "SMS", "Enforce TOTP"],
              ["r.bhatia@acme.io", "Ops", "1h ago", "None", "Enroll required"],
            ]} />
          </ChartCard>
        </div>
      )}

      {tab === "apps" && (
        <div className={grid}>
          <ChartCard span={6} title="App Access Heatmap · Day × Hour"><Heatmap rows={8} cols={24} seed={2} color="var(--color-info)" /></ChartCard>
          <ChartCard span={6} title="Top Apps by Sign-in Volume"><Bars seed={29} color="var(--color-primary)" /></ChartCard>
          <ChartCard span={12} title="Integrated Applications">
            <DataTable columns={["App", "Protocol", "Users", "MFA", "Risk"]} rows={[
              ["Salesforce", "SAML", "4,802", "Enforced", "Low"],
              ["GitHub", "OIDC", "1,184", "Enforced", "Low"],
              ["Snowflake", "SAML", "612", "Enforced", "Medium"],
              ["Okta Admin", "SAML", "18", "WebAuthn", "Critical"],
              ["Slack", "OIDC", "12,401", "Enforced", "Low"],
              ["AWS Console", "SAML", "284", "WebAuthn", "High"],
            ]} />
          </ChartCard>
        </div>
      )}

      {tab === "risk" && (
        <div className={grid}>
          <ChartCard span={8} title="Risky Sign-ins">
            <DataTable columns={["User", "App", "Risk", "Location", "Action"]} rows={[
              ["alex@acme.io", "Salesforce", "High", "Lagos · NG", "Step-up"],
              ["mira@acme.io", "GitHub", "Medium", "Berlin · DE", "Allow"],
              ["sven@acme.io", "Snowflake", "High", "Moscow · RU", "Block"],
              ["luca@acme.io", "Okta Admin", "Critical", "TOR exit", "Block"],
              ["dev-bot", "AWS", "Medium", "Anomalous ASN", "Step-up"],
            ]} />
          </ChartCard>
          <ChartCard span={4} title="Conditional Access Policies">
            <Timeline items={[
              { time: "active", title: "Tier-1 admins · WebAuthn required", tone: "success" },
              { time: "active", title: "Block legacy auth · all tenants", tone: "success" },
              { time: "active", title: "Geo-block · sanctioned regions", tone: "warning" },
              { time: "draft", title: "Device compliance gate · Snowflake", tone: "info" },
            ]} />
          </ChartCard>
          <AIInsights items={[
            { title: "Dormant admin", body: "3 admin accounts inactive 90+ days — revoke privileges via lifecycle workflow.", tone: "warning", confidence: 92 },
            { title: "Token reuse", body: "Refresh-token replay detected on 4 sessions in last hour — recommend revoke.", tone: "destructive", confidence: 95 },
          ]} />
        </div>
      )}
    </PageShell>
  );
}

/* ============================================================
   2. USER ROLES
   ============================================================ */
type URTab = "overview" | "matrix" | "drift" | "audit";
export function UserRoles({ d }: { d: DashSpec }) {
  const s = useDashboardState();
  const { tab, setTab } = useTabs<URTab>("overview");
  return (
    <PageShell d={d} toolbar={<DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive} />}>
      <Kpis items={[
        { label: "Tenants", value: "248", tone: "info" },
        { label: "Roles", value: "62", tone: "info" },
        { label: "Permissions", value: "1,402", tone: "info" },
        { label: "Members", value: "18,402", tone: "success" },
        { label: "Drift findings", value: "37", delta: "+5", tone: "warning" },
        { label: "Pending reviews", value: "12", tone: "warning" },
      ]} />
      <FilterBar value={s.filter} onChange={s.setFilter} placeholder="Search role, tenant, permission…" />
      <TabBar<URTab>
        value={tab} onChange={setTab}
        tabs={[
          { id: "overview", label: "Overview", icon: "LayoutDashboard" },
          { id: "matrix", label: "Role Matrix", icon: "Grid3x3" },
          { id: "drift", label: "Drift", icon: "GitBranch", badge: 37 },
          { id: "audit", label: "Audit Log", icon: "FileClock" },
        ]}
      />

      {tab === "overview" && (
        <div className={grid}>
          <ChartCard span={4} title="Role Distribution">
            <DonutRow items={[
              { label: "Member", value: 62, color: "var(--color-primary)" },
              { label: "Editor", value: 22, color: "var(--color-accent)" },
              { label: "Admin", value: 11, color: "var(--color-warning)" },
              { label: "Owner", value: 5, color: "var(--color-destructive)" },
            ]} />
          </ChartCard>
          <ChartCard span={8} title="Membership growth · 30d"><LineSeries seed={71} lines={2} height={220} /></ChartCard>
          <ChartCard span={12} title="Tenants & Roles">
            <DataTable columns={["Tenant", "Role", "Members", "Perms", "Updated"]} rows={[
              ["acme", "admin", "18", "248", "2h ago"],
              ["initech", "editor", "412", "82", "1d ago"],
              ["umbrella", "viewer", "1,204", "12", "3d ago"],
              ["stark", "owner", "6", "∞", "12m ago"],
              ["wayne", "admin", "24", "248", "5h ago"],
            ]} />
          </ChartCard>
        </div>
      )}

      {tab === "matrix" && (
        <div className={grid}>
          <ChartCard span={12} title="Role × Resource permission matrix">
            <Heatmap rows={8} cols={16} seed={41} color="var(--color-primary)" />
          </ChartCard>
          <ChartCard span={6} title="Permissions per role"><Bars seed={48} color="var(--color-warning)" /></ChartCard>
          <ChartCard span={6} title="Resources per role"><Bars seed={52} color="var(--color-accent)" /></ChartCard>
        </div>
      )}

      {tab === "drift" && (
        <div className={grid}>
          <ChartCard span={8} title="Drift by tenant"><Bars seed={48} color="var(--color-warning)" /></ChartCard>
          <ChartCard span={4} title="Drift severity">
            <DonutRow items={[
              { label: "Critical", value: 8, color: "var(--color-destructive)" },
              { label: "High", value: 14, color: "var(--color-warning)" },
              { label: "Medium", value: 9, color: "var(--color-info)" },
              { label: "Low", value: 6, color: "var(--color-success)" },
            ]} />
          </ChartCard>
          <ChartCard span={12} title="Drift findings">
            <DataTable columns={["Tenant", "Role", "Drift", "Severity", "Detected"]} rows={[
              ["acme", "editor", "+billing.write granted out-of-band", "High", "4h ago"],
              ["umbrella", "viewer", "unused: 12 perms", "Low", "1d ago"],
              ["initech", "admin", "missing: audit.read", "Medium", "6h ago"],
              ["stark", "owner", "shadow role 'super'", "Critical", "12m ago"],
            ]} />
          </ChartCard>
          <AIInsights items={[
            { title: "Over-privileged role", body: "'editor' grants 14 unused permissions across 412 users — split into 2 roles.", tone: "warning", confidence: 84 },
          ]} />
        </div>
      )}

      {tab === "audit" && (
        <div className={grid}>
          <ChartCard span={12} title="Role change activity"><LineSeries seed={19} lines={3} height={200} /></ChartCard>
          <ChartCard span={12} title="Recent role changes">
            <Timeline items={[
              { time: "now", title: "acme · Granted billing.read to finance", tone: "info" },
              { time: "22m", title: "stark · Revoked owner from j.doe", tone: "warning" },
              { time: "1h", title: "initech · New custom role 'auditor'", tone: "success" },
              { time: "3h", title: "umbrella · Bulk demoted 4 admins", tone: "warning" },
              { time: "1d", title: "wayne · Granted infra.deploy to platform", tone: "info" },
            ]} />
          </ChartCard>
        </div>
      )}
    </PageShell>
  );
}

/* ============================================================
   3. BIOMETRIC ACCESS
   ============================================================ */
type BioTab = "live" | "doors" | "enrolment" | "incidents";
export function Biometric({ d }: { d: DashSpec }) {
  const s = useDashboardState();
  const { tab, setTab } = useTabs<BioTab>("live");
  return (
    <PageShell d={d} toolbar={<DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive} />}>
      <Kpis items={[
        { label: "Doors online", value: "318 / 324", tone: "success" },
        { label: "Events / 24h", value: "84,201", delta: "+2.3%", tone: "info" },
        { label: "Enrolled badges", value: "12,408", tone: "info" },
        { label: "Tailgate events", value: "9", delta: "+2", tone: "destructive" },
        { label: "FAR", value: "0.001%", tone: "success" },
        { label: "FRR", value: "0.4%", tone: "warning" },
      ]} />
      <FilterBar value={s.filter} onChange={s.setFilter} placeholder="Filter door, badge, event…" />
      <TabBar<BioTab>
        value={tab} onChange={setTab}
        tabs={[
          { id: "live", label: "Live", icon: "Activity" },
          { id: "doors", label: "Doors", icon: "DoorOpen", badge: 324 },
          { id: "enrolment", label: "Enrolment", icon: "UserPlus" },
          { id: "incidents", label: "Incidents", icon: "AlertTriangle", badge: 9 },
        ]}
      />

      {tab === "live" && (
        <div className={grid}>
          <ChartCard span={8} title="Access Events · Live"><LineSeries seed={55} lines={2} height={220} /></ChartCard>
          <ChartCard span={4} title="Auth Methods">
            <DonutRow items={[
              { label: "Face", value: 48, color: "var(--color-primary)" },
              { label: "Fingerprint", value: 28, color: "var(--color-accent)" },
              { label: "Mobile ID", value: 18, color: "var(--color-info)" },
              { label: "NFC", value: 6, color: "var(--color-warning)" },
            ]} />
          </ChartCard>
          <ChartCard span={12} title="Door Activity · Day × Hour"><Heatmap rows={7} cols={24} seed={3} color="var(--color-primary)" /></ChartCard>
        </div>
      )}

      {tab === "doors" && (
        <div className={grid}>
          <ChartCard span={12} title="Doors">
            <DataTable columns={["Door", "Building", "Mode", "Today", "Status"]} rows={[
              ["D-101", "HQ · L1", "Face+PIN", "2,418", "Online"],
              ["D-204", "R&D · L2", "Face", "1,902", "Online"],
              ["D-309", "DC-East", "Multi-factor", "614", "Locked"],
              ["D-410", "Cafeteria", "NFC", "3,201", "Online"],
              ["D-512", "Lab-B", "Face+Finger", "421", "Online"],
              ["D-618", "Roof", "Face+PIN", "12", "Offline"],
            ]} />
          </ChartCard>
          <ChartCard span={6} title="Throughput per door"><Bars seed={91} color="var(--color-primary)" /></ChartCard>
          <ChartCard span={6} title="Door uptime · 30d"><LineSeries seed={66} lines={2} height={200} /></ChartCard>
        </div>
      )}

      {tab === "enrolment" && (
        <div className={grid}>
          <ChartCard span={8} title="Enrolments per week"><Bars seed={31} color="var(--color-accent)" /></ChartCard>
          <ChartCard span={4} title="Modality mix">
            <DonutRow items={[
              { label: "Face", value: 58, color: "var(--color-primary)" },
              { label: "Finger", value: 24, color: "var(--color-accent)" },
              { label: "Iris", value: 12, color: "var(--color-info)" },
              { label: "Palm", value: 6, color: "var(--color-warning)" },
            ]} />
          </ChartCard>
          <ChartCard span={12} title="Pending enrolments">
            <DataTable columns={["Badge", "Name", "Department", "Requested", "Status"]} rows={[
              ["B-8412", "K. Howard", "Sales", "2h ago", "Awaiting face capture"],
              ["B-8411", "T. Nakano", "Eng", "4h ago", "Approved"],
              ["B-8410", "S. Olsen", "Finance", "1d ago", "Awaiting fingerprint"],
            ]} />
          </ChartCard>
        </div>
      )}

      {tab === "incidents" && (
        <div className={grid}>
          <ChartCard span={7} title="Security Events">
            <Timeline items={[
              { time: "now", title: "D-309 · Tailgate attempt detected", tone: "destructive" },
              { time: "14m", title: "D-101 · Badge cloning alert resolved", tone: "warning" },
              { time: "1h", title: "D-204 · After-hours access granted", tone: "info" },
              { time: "3h", title: "D-512 · 3 failed face match retries", tone: "warning" },
            ]} />
          </ChartCard>
          <ChartCard span={5} title="Incident mix">
            <DonutRow items={[
              { label: "Tailgate", value: 36, color: "var(--color-destructive)" },
              { label: "Force-open", value: 24, color: "var(--color-warning)" },
              { label: "Spoof", value: 12, color: "var(--color-info)" },
              { label: "Hardware", value: 28, color: "var(--color-muted-foreground)" },
            ]} />
          </ChartCard>
          <AIInsights items={[
            { title: "Tailgate cluster", body: "D-309 shows 3 tailgate events this week — recommend turnstile retrofit.", tone: "destructive", confidence: 90 },
          ]} />
        </div>
      )}
    </PageShell>
  );
}

/* ============================================================
   4. MDM
   ============================================================ */
type MDMTab = "fleet" | "compliance" | "apps" | "actions";
export function MDM({ d }: { d: DashSpec }) {
  const s = useDashboardState();
  const { tab, setTab } = useTabs<MDMTab>("fleet");
  return (
    <PageShell d={d} toolbar={<DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive} extra={<QuickActions items={[{ label: "Push profile", icon: "Send", tone: "primary" }, { label: "Wipe", icon: "Trash2", tone: "destructive" }]} />} />}>
      <Kpis items={[
        { label: "Devices managed", value: "12,408", delta: "+184", tone: "success" },
        { label: "Compliant", value: "94.2%", tone: "success" },
        { label: "At risk", value: "412", delta: "-32", tone: "warning" },
        { label: "Quarantined", value: "18", tone: "destructive" },
        { label: "OS lag (avg)", value: "1.3 ver", tone: "info" },
        { label: "Pending wipe", value: "4", tone: "destructive" },
      ]} />
      <FilterBar value={s.filter} onChange={s.setFilter} placeholder="Search device, app, profile…" />
      <TabBar<MDMTab>
        value={tab} onChange={setTab}
        tabs={[
          { id: "fleet", label: "Fleet", icon: "Smartphone" },
          { id: "compliance", label: "Compliance", icon: "ShieldCheck", badge: "94%" },
          { id: "apps", label: "Apps & Patches", icon: "Package" },
          { id: "actions", label: "Actions", icon: "Zap" },
        ]}
      />

      {tab === "fleet" && (
        <div className={grid}>
          <ChartCard span={4} title="Platforms">
            <DonutRow items={[
              { label: "Windows", value: 38, color: "var(--color-info)" },
              { label: "macOS", value: 22, color: "var(--color-primary)" },
              { label: "iOS", value: 24, color: "var(--color-accent)" },
              { label: "Android", value: 16, color: "var(--color-success)" },
            ]} />
          </ChartCard>
          <ChartCard span={8} title="Enrolments · 30d"><LineSeries seed={77} lines={2} height={220} /></ChartCard>
          <ChartCard span={12} title="Device inventory">
            <DataTable columns={["Device", "User", "Platform", "OS", "Last seen"]} rows={[
              ["MAC-2841", "j.lin", "macOS", "13.4", "12m"],
              ["WIN-9120", "r.ortiz", "Windows", "11 23H2", "2h"],
              ["IOS-4412", "k.silva", "iOS", "16.1", "1d"],
              ["AND-7720", "m.gupta", "Android", "12", "3h"],
              ["MAC-2901", "p.tran", "macOS", "14.4", "now"],
            ]} />
          </ChartCard>
        </div>
      )}

      {tab === "compliance" && (
        <div className={grid}>
          <ChartCard span={8} title="Compliance trend · 30d"><LineSeries seed={77} lines={2} height={220} /></ChartCard>
          <ChartCard span={4} title="Failure reasons">
            <DonutRow items={[
              { label: "OS outdated", value: 42, color: "var(--color-warning)" },
              { label: "No encryption", value: 28, color: "var(--color-destructive)" },
              { label: "Jailbroken", value: 6, color: "var(--color-destructive)" },
              { label: "No lock", value: 24, color: "var(--color-info)" },
            ]} />
          </ChartCard>
          <ChartCard span={12} title="Non-compliant devices">
            <DataTable columns={["Device", "User", "Platform", "Issue", "Last seen"]} rows={[
              ["MAC-2841", "j.lin", "macOS 13.4", "OS outdated", "12m"],
              ["WIN-9120", "r.ortiz", "Win 11", "Disk unencrypted", "2h"],
              ["IOS-4412", "k.silva", "iOS 16.1", "Jailbroken", "1d"],
              ["AND-7720", "m.gupta", "Android 12", "No screen lock", "3h"],
            ]} />
          </ChartCard>
          <AIInsights items={[
            { title: "OS fleet drift", body: "38 macOS devices lag 2+ minor versions — schedule auto-update window Sat 02:00.", tone: "warning", confidence: 87 },
          ]} />
        </div>
      )}

      {tab === "apps" && (
        <div className={grid}>
          <ChartCard span={6} title="Patch Adoption (per app)"><Bars seed={64} color="var(--color-success)" /></ChartCard>
          <ChartCard span={6} title="Enrolments · Day × Hour"><Heatmap rows={7} cols={24} seed={6} color="var(--color-info)" /></ChartCard>
          <ChartCard span={12} title="Managed apps">
            <DataTable columns={["App", "Version", "Installs", "Pending", "Policy"]} rows={[
              ["Chrome", "125.0.6422", "11,402", "184", "Auto-update"],
              ["Slack", "4.36.140", "12,001", "62", "Auto-update"],
              ["VPN Client", "5.12.1", "12,408", "0", "Required"],
              ["Office", "16.84", "9,841", "412", "Auto-update"],
            ]} />
          </ChartCard>
        </div>
      )}

      {tab === "actions" && (
        <div className={grid}>
          <ChartCard span={7} title="Recent actions">
            <Timeline items={[
              { time: "now", title: "Wipe issued · IOS-4412 (jailbroken)", tone: "destructive" },
              { time: "12m", title: "Profile pushed · 2,401 macOS devices", tone: "info" },
              { time: "1h", title: "Patch deployed · Chrome 125", tone: "success" },
              { time: "3h", title: "Quarantine lifted · WIN-9120", tone: "warning" },
            ]} />
          </ChartCard>
          <ChartCard span={5} title="Action mix">
            <DonutRow items={[
              { label: "Push profile", value: 48, color: "var(--color-primary)" },
              { label: "Patch", value: 26, color: "var(--color-success)" },
              { label: "Quarantine", value: 14, color: "var(--color-warning)" },
              { label: "Wipe", value: 12, color: "var(--color-destructive)" },
            ]} />
          </ChartCard>
        </div>
      )}
    </PageShell>
  );
}

/* ============================================================
   5. REMOTE ACCESS
   ============================================================ */
type RATab = "sessions" | "endpoints" | "policies" | "recordings";
export function RemoteAccess({ d }: { d: DashSpec }) {
  const s = useDashboardState();
  const { tab, setTab } = useTabs<RATab>("sessions");
  const [term, setTerm] = useState(false);
  return (
    <PageShell d={d} toolbar={<DashboardToolbar range={s.range} onRangeChange={s.setRange} live={s.live} onLiveToggle={s.setLive} extra={<QuickActions items={[{ label: "Open Console", icon: "Terminal", tone: "primary", onClick: () => setTerm(true) }]} />} />}>
      <Kpis items={[
        { label: "Live sessions", value: "184", delta: "+12", tone: "info" },
        { label: "Avg latency", value: "42 ms", tone: "success" },
        { label: "Endpoints online", value: "8,402", tone: "success" },
        { label: "BYOD endpoints", value: "612", tone: "warning" },
        { label: "Recordings (24h)", value: "1,402", tone: "info" },
        { label: "Policy breaches", value: "7", tone: "destructive" },
      ]} />
      <FilterBar value={s.filter} onChange={s.setFilter} placeholder="Search session, endpoint, technician…" />
      <TabBar<RATab>
        value={tab} onChange={setTab}
        tabs={[
          { id: "sessions", label: "Sessions", icon: "MonitorSmartphone", badge: 184 },
          { id: "endpoints", label: "Endpoints", icon: "Server" },
          { id: "policies", label: "Policies", icon: "ShieldCheck" },
          { id: "recordings", label: "Recordings", icon: "Video" },
        ]}
      />

      {tab === "sessions" && (
        <div className={grid}>
          <ChartCard span={8} title="Active Sessions · Latency"><LineSeries seed={8} lines={3} height={220} /></ChartCard>
          <ChartCard span={4} title="Session Types">
            <DonutRow items={[
              { label: "Attended", value: 54, color: "var(--color-primary)" },
              { label: "Unattended", value: 32, color: "var(--color-accent)" },
              { label: "M2M", value: 14, color: "var(--color-info)" },
              { label: "Recorded", value: 78, color: "var(--color-success)" },
            ]} />
          </ChartCard>
          <ChartCard span={12} title="Live Sessions">
            <DataTable columns={["Session", "Endpoint", "Technician", "Duration", "Latency"]} rows={[
              ["RA-7184", "srv-prd-04", "M. Reyes", "00:14:22", "38ms"],
              ["RA-7183", "laptop-128", "A. Voss", "00:42:10", "52ms"],
              ["RA-7181", "kiosk-09", "J. Tan", "01:08:48", "64ms"],
              ["RA-7179", "router-edge-2", "S. Park", "00:03:42", "22ms"],
              ["RA-7178", "db-replica-1", "K. Howard", "00:21:09", "48ms"],
            ]} />
          </ChartCard>
        </div>
      )}

      {tab === "endpoints" && (
        <div className={grid}>
          <ChartCard span={7} title="Endpoints Online by Region"><WorldMap seed={29} /></ChartCard>
          <ChartCard span={5} title="Session Heatmap"><Heatmap rows={7} cols={24} seed={5} color="var(--color-primary)" /></ChartCard>
          <ChartCard span={12} title="Endpoint inventory">
            <DataTable columns={["Endpoint", "Type", "OS", "Region", "Status"]} rows={[
              ["srv-prd-04", "Server", "Ubuntu 22.04", "us-east-1", "Online"],
              ["laptop-128", "Workstation", "macOS 14.4", "EU-West", "Online"],
              ["kiosk-09", "Kiosk", "Win 11 IoT", "APAC", "Online"],
              ["router-edge-2", "Network", "JunOS 22", "us-west-2", "Online"],
              ["db-replica-1", "DB Node", "Debian 12", "us-east-1", "Degraded"],
            ]} />
          </ChartCard>
        </div>
      )}

      {tab === "policies" && (
        <div className={grid}>
          <ChartCard span={8} title="Conditional Access Policies">
            <Timeline items={[
              { time: "active", title: "Tier1-Production · WebAuthn + managed device", tone: "success" },
              { time: "active", title: "BYOD restricted to read-only", tone: "warning" },
              { time: "active", title: "Session recording mandatory for prod", tone: "info" },
              { time: "draft", title: "JIT elevation · 30-min windows", tone: "info" },
            ]} />
          </ChartCard>
          <ChartCard span={4} title="Policy outcomes">
            <DonutRow items={[
              { label: "Allowed", value: 88, color: "var(--color-success)" },
              { label: "Step-up", value: 8, color: "var(--color-warning)" },
              { label: "Denied", value: 4, color: "var(--color-destructive)" },
              { label: "Recorded", value: 78, color: "var(--color-info)" },
            ]} />
          </ChartCard>
          <AIInsights items={[
            { title: "Conditional access drift", body: "7 endpoints accept unmanaged BYOD sessions — tighten policy 'Tier1-Production'.", tone: "warning", confidence: 91 },
          ]} />
        </div>
      )}

      {tab === "recordings" && (
        <div className={grid}>
          <ChartCard span={8} title="Recording volume · 7d"><Bars seed={44} color="var(--color-accent)" /></ChartCard>
          <ChartCard span={4} title="Storage tier">
            <DonutRow items={[
              { label: "Hot", value: 28, color: "var(--color-primary)" },
              { label: "Warm", value: 42, color: "var(--color-accent)" },
              { label: "Cold", value: 24, color: "var(--color-info)" },
              { label: "Glacier", value: 6, color: "var(--color-muted-foreground)" },
            ]} />
          </ChartCard>
          <ChartCard span={12} title="Recent recordings">
            <DataTable columns={["Recording", "Session", "Technician", "Length", "Size"]} rows={[
              ["REC-9182", "RA-7184", "M. Reyes", "14:22", "82 MB"],
              ["REC-9181", "RA-7183", "A. Voss", "42:10", "248 MB"],
              ["REC-9179", "RA-7179", "S. Park", "03:42", "21 MB"],
              ["REC-9178", "RA-7178", "K. Howard", "21:09", "124 MB"],
            ]} />
          </ChartCard>
        </div>
      )}

      <Modal open={term} onClose={() => setTerm(false)} title="Remote console · srv-prd-04" size="lg">
        <Terminal lines={[
          { t: "$ ssh ops@srv-prd-04" },
          { t: "Welcome to Ubuntu 22.04.4 LTS", tone: "muted" },
          { t: "ops@srv-prd-04:~$ systemctl status nginx" },
          { t: "● nginx.service — active (running)", tone: "success" },
          { t: "ops@srv-prd-04:~$ tail -f /var/log/nginx/access.log" },
          { t: "10.0.4.18 - - [19/May/2026:11:42:08] \"GET / HTTP/2\" 200 1842", tone: "info" },
        ]} />
      </Modal>
    </PageShell>
  );
}
