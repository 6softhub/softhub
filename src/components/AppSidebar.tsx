import { Link, useRouterState } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import * as Icons from "lucide-react";
import { DASHBOARDS } from "@/data/dashboards";

export function AppSidebar() {
  const [q, setQ] = useState("");
  const path = useRouterState({ select: (r) => r.location.pathname });

  const grouped = useMemo(() => {
    const filtered = DASHBOARDS.filter(
      (d) =>
        !q ||
        d.title.toLowerCase().includes(q.toLowerCase()) ||
        d.clone.toLowerCase().includes(q.toLowerCase()),
    );
    const map = new Map<string, typeof DASHBOARDS>();
    for (const d of filtered) {
      if (!map.has(d.category)) map.set(d.category, [] as never);
      (map.get(d.category) as typeof DASHBOARDS).push(d);
    }
    return Array.from(map.entries());
  }, [q]);

  return (
    <aside className="w-72 shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground flex flex-col h-screen sticky top-0">
      <Link to="/" className="flex items-center gap-2 px-4 h-14 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary to-accent grid place-items-center">
          <Icons.Cpu className="w-4 h-4 text-primary-foreground" />
        </div>
        <div>
          <div className="text-sm font-semibold tracking-tight">NEXUS / 75</div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-widest">
            Master Control
          </div>
        </div>
      </Link>
      <div className="p-3 border-b border-sidebar-border">
        <div className="relative">
          <Icons.Search className="absolute left-2 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search 75 modules…"
            className="w-full bg-sidebar-accent text-sm rounded-md pl-8 pr-2 py-2 outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-2">
        {grouped.map(([cat, list]) => (
          <div key={cat} className="px-2 py-1">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground px-2 py-1">
              {cat}
            </div>
            {list.map((d) => {
              const Icon = (Icons as never as Record<string, Icons.LucideIcon>)[d.icon] || Icons.Square;
              const active = path === `/d/${d.slug}`;
              return (
                <Link
                  key={d.slug}
                  to="/d/$slug"
                  params={{ slug: d.slug }}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-xs hover:bg-sidebar-accent transition-colors ${
                    active ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{d.title}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
      <div className="p-3 border-t border-sidebar-border text-[10px] text-muted-foreground flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> All systems nominal
      </div>
    </aside>
  );
}
