import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react";
import { DASHBOARDS, NEXUS_75 } from "@/data/dashboards";
import { resolveDashboard } from "@/dashboards/registry";

export const Route = createFileRoute("/d/$slug")({
  component: DashRoute,
  head: ({ params }) => {
    const d = DASHBOARDS.find((x) => x.slug === params?.slug);
    return {
      meta: [
        { title: d ? `${d.title} — Nexus 75` : "Module — Nexus 75" },
        { name: "description", content: d ? `${d.title} (clone of ${d.clone})` : "Nexus module" },
      ],
    };
  },
});

function DashRoute() {
  const { slug } = Route.useParams();
  const d = DASHBOARDS.find((x) => x.slug === slug);
  if (!d) throw notFound();
  const View = resolveDashboard(slug);
  const moduleIndex = NEXUS_75.findIndex((module) => module.slug === slug);
  const previous = moduleIndex > 0 ? NEXUS_75[moduleIndex - 1] : null;
  const next = moduleIndex >= 0 && moduleIndex < NEXUS_75.length - 1 ? NEXUS_75[moduleIndex + 1] : null;

  return (
    <>
      <View d={d} />
      {moduleIndex >= 0 && (
        <nav aria-label="Dashboard sequence" className="sticky bottom-0 z-20 mx-3 mb-3 flex items-center gap-2 rounded-xl border border-border bg-background/90 p-2 shadow-2xl backdrop-blur-md sm:mx-6">
          {previous ? (
            <Link to="/d/$slug" params={{ slug: previous.slug }} className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs transition-colors hover:bg-muted">
              <ChevronLeft className="h-4 w-4 shrink-0" />
              <span className="min-w-0"><span className="block text-[10px] uppercase tracking-wider text-muted-foreground">Previous · {moduleIndex}</span><span className="block truncate font-medium">{previous.title}</span></span>
            </Link>
          ) : <div className="flex-1" />}
          <Link to="/" aria-label="Open all dashboards" className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-border bg-muted/40 hover:bg-muted">
            <LayoutGrid className="h-4 w-4" />
          </Link>
          <div className="hidden shrink-0 text-center text-[10px] uppercase tracking-widest text-muted-foreground sm:block">Module<br /><span className="text-sm font-semibold text-foreground">{moduleIndex + 1} / 75</span></div>
          {next ? (
            <Link to="/d/$slug" params={{ slug: next.slug }} className="flex min-w-0 flex-1 items-center justify-end gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-right text-xs text-primary transition-colors hover:bg-primary/20">
              <span className="min-w-0"><span className="block text-[10px] uppercase tracking-wider opacity-70">Next · {moduleIndex + 2}</span><span className="block truncate font-medium">{next.title}</span></span>
              <ChevronRight className="h-4 w-4 shrink-0" />
            </Link>
          ) : <div className="flex-1 text-right text-xs font-medium text-success">75 / 75 complete</div>}
        </nav>
      )}
    </>
  );
}

