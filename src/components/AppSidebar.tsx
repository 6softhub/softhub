import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import * as Icons from "lucide-react";
import { DASHBOARDS } from "@/data/dashboards";

const MASTER_GROUPS: ReadonlyArray<readonly [string, readonly string[]]> = [
  ["01 · Command Core", ["command-center", "war-room", "master-control", "os-control"]],
  ["02 · AI Systems", ["vala-ai", "ai-copilot", "ai-api", "ai-recovery", "ai-intelligence"]],
  ["03 · User + Access", ["iam", "user-roles", "mdm", "remote-access", "licenses", "biometric"]],
  ["04 · CRM + Sales", ["crm", "leads", "sales-pipeline", "customer-success", "support", "voice-ai", "onboarding"]],
  ["05 · Product + Marketplace", ["marketplace", "product-manager", "gallery", "reviews", "subscriptions", "subscriptions-system", "downloads", "activation"]],
  ["06 · Reseller + Franchise", ["reseller", "franchise", "affiliate", "influencer"]],
  ["07 · Development + DevOps", ["app-builder", "repos", "git-mgmt", "deployment", "cicd", "devops", "api-hub", "infra", "observability", "geo-monitoring", "noc", "sandbox"]],
  ["08 · Analytics + SEO", ["analytics", "reporting", "exec-reports", "seo", "marketing", "social", "market-intel"]],
  ["09 · Security + Risk", ["soc", "fraud", "forensics", "audit-logs", "compliance", "governance", "backup", "disaster-recovery"]],
  ["10 · Finance + Billing", ["revenue", "billing", "payments", "accounting", "financial-ops"]],
  ["11 · Assets + Storage", ["asset-manager", "files", "document-factory", "procurement", "inventory", "supply-chain", "knowledge", "knowledge-graph", "data-lake", "design-system", "broadcast", "projects", "workflows", "browser", "search", "hr", "payroll", "comms", "gamification", "digital-twin", "alerts", "printing"]],
  ["12 · Future Tech", ["iot-control", "iot-drones", "smart-city", "robotics", "satellite", "research-quantum", "metaverse", "blockchain", "energy", "healthcare", "education", "legal", "cloud"]],
];

export function AppSidebar({
  mobileOpen,
  onMobileClose,
}: {
  mobileOpen: boolean;
  onMobileClose: () => void;
}) {
  const [q, setQ] = useState("");
  const path = useRouterState({ select: (r) => r.location.pathname });

  // Close drawer when route changes
  useEffect(() => {
    onMobileClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  const grouped = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const filtered = DASHBOARDS.filter(
      (d) =>
        !needle ||
        d.title.toLowerCase().includes(needle) ||
        d.clone.toLowerCase().includes(needle) ||
        d.category.toLowerCase().includes(needle),
    );
    const bySlug = new Map(filtered.map((d) => [d.slug, d] as const));
    const result: Array<[string, typeof DASHBOARDS]> = [];
    for (const [groupName, slugs] of MASTER_GROUPS) {
      const list = slugs.map((s) => bySlug.get(s)).filter(Boolean) as typeof DASHBOARDS;
      if (list.length) {
        result.push([groupName, list]);
        list.forEach((d) => bySlug.delete(d.slug));
      }
    }
    if (bySlug.size) result.push(["Extras", Array.from(bySlug.values()) as typeof DASHBOARDS]);
    return result;
  }, [q]);

  const total = useMemo(
    () => grouped.reduce((n, [, list]) => n + list.length, 0),
    [grouped],
  );

  const inner = (
    <>
      <Link
        to="/"
        className="flex items-center gap-2 px-4 h-14 border-b border-sidebar-border shrink-0"
      >
        <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary to-accent grid place-items-center">
          <Icons.Cpu className="w-4 h-4 text-primary-foreground" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold tracking-tight truncate">NEXUS / OS</div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-widest truncate">
            Enterprise Operating System
          </div>
        </div>
      </Link>

      <div className="p-3 border-b border-sidebar-border shrink-0">
        <div className="relative">
          <Icons.Search className="absolute left-2 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Search ${DASHBOARDS.length} modules…`}
            className="w-full bg-sidebar-accent text-sm rounded-md pl-8 pr-7 py-2 outline-none focus:ring-1 focus:ring-ring"
          />
          {q && (
            <button
              onClick={() => setQ("")}
              aria-label="Clear search"
              className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
            >
              <Icons.X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        {total === 0 ? (
          <div className="px-4 py-8 text-center text-xs text-muted-foreground">
            <Icons.SearchX className="w-5 h-5 mx-auto mb-2 opacity-60" />
            No modules match “{q}”.
          </div>
        ) : (
          grouped.map(([cat, list]) => (
            <div key={cat} className="px-2 py-1">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground px-2 py-1">
                {cat}
              </div>
              {list.map((d) => {
                const Icon =
                  (Icons as never as Record<string, Icons.LucideIcon>)[d.icon] || Icons.Square;
                const active = path === `/d/${d.slug}`;
                return (
                  <Link
                    key={d.slug}
                    to="/d/$slug"
                    params={{ slug: d.slug }}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-xs hover:bg-sidebar-accent transition-colors ${
                      active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground border-l-2 border-primary pl-1.5"
                        : ""
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{d.title}</span>
                  </Link>
                );
              })}
            </div>
          ))
        )}
      </nav>

      <div className="p-3 border-t border-sidebar-border space-y-2 shrink-0">
        <Link
          to="/login"
          className="flex items-center gap-2 px-2 py-1.5 rounded-md text-xs bg-primary/15 text-primary border border-primary/30 hover:bg-primary/25 transition-colors"
        >
          <Icons.LogIn className="w-3.5 h-3.5" /> Sign in / Sign up
        </Link>
        <div className="text-[10px] text-muted-foreground flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> All systems nominal
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-72 shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground flex-col h-screen sticky top-0">
        {inner}
      </aside>

      {/* Mobile drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition ${
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!mobileOpen}
      >
        <div
          onClick={onMobileClose}
          className={`absolute inset-0 bg-background/70 backdrop-blur-sm transition-opacity ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <aside
          className={`absolute left-0 top-0 h-full w-72 max-w-[85%] bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col shadow-2xl transition-transform ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            onClick={onMobileClose}
            aria-label="Close menu"
            className="absolute top-3 right-3 z-10 w-8 h-8 grid place-items-center rounded-md hover:bg-sidebar-accent"
          >
            <Icons.X className="w-4 h-4" />
          </button>
          {inner}
        </aside>
      </div>
    </>
  );
}
