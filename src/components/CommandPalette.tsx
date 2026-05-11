import { useEffect, useState, useMemo } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import * as Icons from "lucide-react";
import { DASHBOARDS } from "@/data/dashboards";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

const RECENT_KEY = "nexus.cmdk.recent";

function loadRecent(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"); } catch { return []; }
}
function pushRecent(slug: string) {
  if (typeof window === "undefined") return;
  const cur = loadRecent().filter((s) => s !== slug);
  cur.unshift(slug);
  localStorage.setItem(RECENT_KEY, JSON.stringify(cur.slice(0, 6)));
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const navigate = useNavigate();
  const path = useRouterState({ select: (r) => r.location.pathname });

  useEffect(() => {
    setRecent(loadRecent());
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Close on route change
  useEffect(() => { setOpen(false); }, [path]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof DASHBOARDS>();
    for (const d of DASHBOARDS) {
      if (!map.has(d.category)) map.set(d.category, [] as never);
      (map.get(d.category) as typeof DASHBOARDS).push(d);
    }
    return Array.from(map.entries());
  }, []);

  const recentDashes = recent
    .map((s) => DASHBOARDS.find((d) => d.slug === s))
    .filter((x): x is (typeof DASHBOARDS)[number] => Boolean(x));

  const go = (slug: string) => {
    pushRecent(slug);
    setRecent(loadRecent());
    setOpen(false);
    navigate({ to: "/d/$slug", params: { slug } });
  };

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open command palette"
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 px-3 py-2 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:scale-105 transition-transform border border-primary/40"
      >
        <Icons.Command className="w-3.5 h-3.5" />
        <span className="text-xs font-medium">Search · ⌘K</span>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Jump to any of 75 modules… (type a name, clone, or category)" />
        <CommandList className="max-h-[480px]">
          <CommandEmpty>No modules match.</CommandEmpty>

          <CommandGroup heading="Quick actions">
            <CommandItem onSelect={() => { setOpen(false); navigate({ to: "/" }); }}>
              <Icons.LayoutGrid className="mr-2 h-4 w-4 text-primary" />
              <span>Open Master Grid</span>
              <CommandShortcut>↵</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => go("master-control")}>
              <Icons.Cpu className="mr-2 h-4 w-4 text-accent" />
              <span>Universal Master Control</span>
            </CommandItem>
            <CommandItem onSelect={() => go("command-center")}>
              <Icons.Activity className="mr-2 h-4 w-4 text-info" />
              <span>Global Command Center</span>
            </CommandItem>
            <CommandItem onSelect={() => go("war-room")}>
              <Icons.Radar className="mr-2 h-4 w-4 text-destructive" />
              <span>Executive War Room</span>
            </CommandItem>
          </CommandGroup>

          {recentDashes.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Recent">
                {recentDashes.map((d) => {
                  const Icon = (Icons as never as Record<string, Icons.LucideIcon>)[d.icon] || Icons.Square;
                  return (
                    <CommandItem key={`r-${d.slug}`} value={`recent ${d.title} ${d.clone}`} onSelect={() => go(d.slug)}>
                      <Icon className="mr-2 h-4 w-4" />
                      <span>{d.title}</span>
                      <span className="ml-auto text-[10px] text-muted-foreground">{d.clone}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </>
          )}

          {grouped.map(([cat, list]) => (
            <div key={cat}>
              <CommandSeparator />
              <CommandGroup heading={cat}>
                {list.map((d) => {
                  const Icon = (Icons as never as Record<string, Icons.LucideIcon>)[d.icon] || Icons.Square;
                  return (
                    <CommandItem
                      key={d.slug}
                      value={`${d.title} ${d.clone} ${d.category} ${d.tags.join(" ")}`}
                      onSelect={() => go(d.slug)}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      <span>{d.title}</span>
                      <span className="ml-auto text-[10px] text-muted-foreground truncate max-w-[180px]">{d.clone}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </div>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
