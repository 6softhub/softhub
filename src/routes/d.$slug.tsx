import { createFileRoute, notFound } from "@tanstack/react-router";
import { DASHBOARDS } from "@/data/dashboards";
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
  return <View d={d} />;
}

