import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet, Link, createRootRouteWithContext, useRouter, useRouterState, HeadContent, Scripts,
} from "@tanstack/react-router";
import { useState } from "react";
import * as Icons from "lucide-react";
import appCss from "../styles.css?url";
import { AppSidebar } from "@/components/AppSidebar";
import { CommandPalette } from "@/components/CommandPalette";
import { DASHBOARDS } from "@/data/dashboards";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold">404</h1>
        <p className="mt-2 text-sm text-muted-foreground">Module not found.</p>
        <Link to="/" className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">Command Center</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <div className="p-8">
      <h1 className="text-xl">System fault</h1>
      <p className="text-sm text-muted-foreground">{error.message}</p>
      <button onClick={() => { router.invalidate(); reset(); }} className="mt-4 px-3 py-1.5 bg-primary text-primary-foreground rounded">Retry</button>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Nexus 75 — Enterprise Master Control" },
      { name: "description", content: "75 enterprise dashboards in one unified UI." },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function Topbar({ onMenu }: { onMenu: () => void }) {
  const path = useRouterState({ select: (r) => r.location.pathname });
  let crumb: string;
  let groupCrumb: string | null = null;
  if (path === "/") {
    crumb = "Master Grid";
  } else if (path.startsWith("/d/")) {
    const slug = path.slice(3);
    const d = DASHBOARDS.find((x) => x.slug === slug);
    crumb = d?.title ?? "Module";
    groupCrumb = d?.category ?? null;
  } else {
    crumb = path.slice(1);
  }
  return (
    <header className="sticky top-0 z-30 h-14 flex items-center gap-3 px-4 border-b border-border bg-background/80 backdrop-blur-md">
      <button
        onClick={onMenu}
        aria-label="Open menu"
        className="lg:hidden w-9 h-9 grid place-items-center rounded-md hover:bg-muted border border-border"
      >
        <Icons.Menu className="w-4 h-4" />
      </button>
      <div className="flex items-center gap-2 text-xs text-muted-foreground min-w-0">
        <Link to="/" className="hover:text-foreground">Nexus</Link>
        <Icons.ChevronRight className="w-3 h-3" />
        <span className="text-foreground truncate capitalize">{crumb}</span>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] text-muted-foreground px-2 py-1 rounded-md bg-muted border border-border">
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> Live
        </span>
        <button
          aria-label="Notifications"
          className="w-9 h-9 grid place-items-center rounded-md hover:bg-muted border border-border relative"
        >
          <Icons.Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-destructive" />
        </button>
        <Link
          to="/login"
          className="w-9 h-9 grid place-items-center rounded-md bg-gradient-to-br from-primary to-accent text-primary-foreground"
          aria-label="Account"
        >
          <Icons.User className="w-4 h-4" />
        </Link>
      </div>
    </header>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const path = useRouterState({ select: (r) => r.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);

  // Auth-style routes render full-bleed (no chrome)
  const isFullBleed = path === "/login";

  if (isFullBleed) {
    return (
      <QueryClientProvider client={queryClient}>
        <Outlet />
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen w-full">
        <AppSidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
        <div className="flex-1 min-w-0 flex flex-col">
          <Topbar onMenu={() => setMobileOpen(true)} />
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
        <CommandPalette />
      </div>
    </QueryClientProvider>
  );
}
