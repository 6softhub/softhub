import {
  Search, Sparkles, Bell as BellIcon, ChevronDown, User, Menu, LayoutDashboard,
  Store, Building2, LayoutGrid, Flame, Rocket, Star, Crown, Tag, Repeat,
  Handshake, ShoppingBag, Network, PenTool, GraduationCap, Calendar, LifeBuoy, Download,
  ShoppingCart,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { LanguageSelector } from "@/components/market/LanguageSelector";
import valaLogo from "@/assets/vala-logo.png";


type NavItem = { label: string; icon: React.ComponentType<{ className?: string }>; badge?: string; tone?: string };
type NavMenu = { label: string; groups: { heading: string; items: NavItem[] }[] };

const menus: NavMenu[] = [
  {
    label: "Marketplace",
    groups: [
      {
        heading: "Browse",
        items: [
          { label: "Marketplace Home", icon: Store },
          { label: "All Software", icon: LayoutGrid, badge: "1,284" },
          { label: "Featured", icon: Sparkles },
          { label: "Trending", icon: Flame, badge: "Hot" },
          { label: "New Launches", icon: Rocket, badge: "62" },
        ],
      },
      {
        heading: "Curated",
        items: [
          { label: "Top Rated", icon: Star },
          { label: "Best Sellers", icon: Crown },
          { label: "Lifetime Deals", icon: Tag },
          { label: "Subscriptions", icon: Repeat },
        ],
      },
    ],
  },
  {
    label: "Industries",
    groups: [
      {
        heading: "Verticals",
        items: [
          { label: "Education", icon: Building2 },
          { label: "Healthcare", icon: Building2 },
          { label: "Retail", icon: Building2 },
          { label: "Manufacturing", icon: Building2 },
          { label: "Construction", icon: Building2 },
          { label: "Hotel", icon: Building2 },
        ],
      },
      {
        heading: "More",
        items: [
          { label: "Transport", icon: Building2 },
          { label: "Finance", icon: Building2 },
          { label: "Real Estate", icon: Building2 },
          { label: "Legal", icon: Building2 },
          { label: "Government", icon: Building2 },
          { label: "NGO", icon: Building2 },
        ],
      },
    ],
  },
  {
    label: "Ecosystem",
    groups: [
      {
        heading: "Join the network",
        items: [
          { label: "Reseller Zone", icon: Handshake },
          { label: "Vendor Zone", icon: ShoppingBag },
          { label: "Franchise Zone", icon: Network },
          { label: "Author Zone", icon: PenTool },
        ],
      },
      {
        heading: "Resources",
        items: [
          { label: "Academy", icon: GraduationCap },
          { label: "Events", icon: Calendar, badge: "Live" },
          { label: "Downloads", icon: Download },
          { label: "Support", icon: LifeBuoy },
        ],
      },
    ],
  },
];

function NavDropdown({ menu }: { menu: NavMenu }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`px-3 h-9 rounded-md hover:bg-primary/10 hover:text-primary transition-colors text-[13px] flex items-center gap-1 ${open ? "text-primary bg-primary/10" : "text-foreground/85"}`}
      >
        {menu.label}
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 w-[440px] rounded-xl border border-border bg-panel/95 backdrop-blur-xl shadow-[var(--shadow-card-hover)] p-3 grid grid-cols-2 gap-2 z-50 animate-rise">
          {menu.groups.map((g) => (
            <div key={g.heading}>
              <div className="px-2 mb-1.5 text-[10px] uppercase tracking-[0.22em] text-muted-foreground/80">{g.heading}</div>
              <ul className="space-y-0.5">
                {g.items.map((it) => {
                  const Icon = it.icon;
                  return (
                    <li key={it.label}>
                      <button
                        onClick={() => setOpen(false)}
                        className="w-full flex items-center gap-2.5 px-2.5 h-9 rounded-lg text-sm hover:bg-primary/10 hover:text-primary transition-colors text-left"
                      >
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span className="flex-1">{it.label}</span>
                        {it.badge && (
                          <span className="text-mono text-[10px] px-1.5 py-0.5 rounded border border-border text-muted-foreground bg-background/40">
                            {it.badge}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function MarketHeader({ onMenu }: { onMenu?: () => void }) {
  const { user, loading } = useAuth();
  const { count } = useCart();
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 h-[72px] bg-background/70 backdrop-blur-xl border-b border-border">
      <div className="max-w-[1600px] mx-auto h-full px-4 lg:px-6 flex items-center gap-4">
        <button
          onClick={() => {
            setMobileMenu((v) => !v);
            onMenu?.();
          }}
          className="lg:hidden h-9 w-9 grid place-items-center rounded-md border border-border bg-panel/60"
        >
          <Menu className="h-4 w-4" />
        </button>

        <Link to="/" className="flex items-center gap-2 shrink-0 pr-2 hover:opacity-90 transition-opacity">
          <img src={valaLogo} alt="Software Vala — The Name of Trust" className="h-12 lg:h-[52px] w-auto drop-shadow-[0_2px_10px_oklch(0.82_0.16_200_/_0.35)]" />
        </Link>

        <nav className="hidden lg:flex items-center gap-1 text-[13px]">
          {menus.map((m) => <NavDropdown key={m.label} menu={m} />)}
        </nav>

        <div className="flex-1 max-w-[500px] mx-auto">
          <div className="flex items-center h-10 rounded-xl border border-border bg-panel/60 px-3 gap-2 hover:border-primary/50 transition-colors">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search 1,284+ products, industries, vendors…"
              className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground/70 focus:outline-none"
            />
            <kbd className="hidden sm:inline text-mono text-[10px] px-1.5 py-0.5 rounded border border-border text-muted-foreground bg-muted/40">⌘K</kbd>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <LanguageSelector />
          <button className="h-10 px-2.5 rounded-md hover:bg-panel/60 text-xs text-muted-foreground hidden lg:flex items-center gap-1">

            USD <ChevronDown className="h-3 w-3" />
          </button>
          <a href="#" className="h-10 w-10 rounded-md hover:bg-panel/60 grid place-items-center relative" aria-label="Cart">
            <ShoppingCart className="h-4 w-4" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-mono text-[10px] font-bold grid place-items-center glow-primary">
                {count}
              </span>
            )}
          </a>
          <button className="h-10 w-10 rounded-md hover:bg-panel/60 grid place-items-center relative">
            <BellIcon className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-magenta animate-blink" />
          </button>

          <button className="h-10 px-3 rounded-md border border-primary/40 bg-primary/10 hover:bg-primary/20 text-primary flex items-center gap-1.5 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" /> AI
          </button>
        </div>

        <div className="flex items-center gap-2">
          {loading ? null : user ? (
            <a href="#" className="btn-3d h-10 px-4 rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground text-xs font-semibold flex items-center gap-1.5">
              <LayoutDashboard className="h-3.5 w-3.5" /> My Dashboard
            </a>
          ) : (
            <>
              <a href="#" className="hidden sm:flex h-10 px-3 items-center text-xs text-foreground/85 hover:text-primary">Login</a>
              <a href="#" className="btn-3d h-10 px-4 rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground text-xs font-semibold flex items-center">
                Register
              </a>
            </>
          )}
          <button className="md:hidden h-10 w-10 rounded-full border border-border grid place-items-center"><User className="h-4 w-4" /></button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenu && (
        <div className="lg:hidden absolute left-0 right-0 top-full bg-panel/95 backdrop-blur-xl border-b border-border max-h-[80vh] overflow-y-auto">
          <div className="max-w-[1600px] mx-auto p-4 space-y-4">
            {menus.map((m) => (
              <div key={m.label}>
                <div className="px-2 mb-1.5 text-[10px] uppercase tracking-[0.22em] text-primary">{m.label}</div>
                <div className="grid grid-cols-2 gap-1">
                  {m.groups.flatMap((g) => g.items).map((it) => {
                    const Icon = it.icon;
                    return (
                      <button
                        key={it.label}
                        onClick={() => setMobileMenu(false)}
                        className="flex items-center gap-2 px-2.5 h-9 rounded-lg text-sm hover:bg-primary/10 hover:text-primary text-left"
                      >
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate">{it.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
