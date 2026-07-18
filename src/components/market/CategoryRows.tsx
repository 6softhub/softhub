import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { CATALOG } from "@/data/marketplace-catalog";
import { PremiumProductCard } from "./PremiumProductCard";
import { resolveIcon } from "@/lib/marketplace-icons";

function useDragScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const state = useRef({ down: false, moved: false, startX: 0, startScroll: 0 });
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEdges = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateEdges();
    const el = ref.current;
    if (!el) return;
    el.addEventListener("scroll", updateEdges, { passive: true });
    window.addEventListener("resize", updateEdges);
    return () => {
      el.removeEventListener("scroll", updateEdges);
      window.removeEventListener("resize", updateEdges);
    };
  }, [updateEdges]);

  const onPointerDown = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    state.current = { down: true, moved: false, startX: e.clientX, startScroll: el.scrollLeft };
    el.classList.add("dragging");
    el.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || !state.current.down) return;
    const dx = e.clientX - state.current.startX;
    if (Math.abs(dx) > 4) state.current.moved = true;
    el.scrollLeft = state.current.startScroll - dx;
  };
  const endDrag = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    state.current.down = false;
    el.classList.remove("dragging");
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
  };
  const onClickCapture = (e: React.MouseEvent) => {
    if (state.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      state.current.moved = false;
    }
  };

  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(320, el.clientWidth * 0.85), behavior: "smooth" });
  };

  return { ref, atStart, atEnd, scroll, onPointerDown, onPointerMove, onPointerUp: endDrag, onPointerCancel: endDrag, onClickCapture };
}

function CategoryRow({ cat }: { cat: (typeof CATALOG)[number] }) {
  const Icon = resolveIcon(cat.icon);
  const d = useDragScroll();

  return (
    <section id={`cat-${cat.slug}`} className="scroll-mt-24">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 mb-4">
        <div className="min-w-0 flex items-center gap-3">
          <div
            className="shrink-0 grid place-items-center h-12 w-12 rounded-xl border border-white/10 btn-3d"
            style={{ background: `linear-gradient(135deg, ${cat.palette[0]}, ${cat.palette[1]})` }}
          >
            <Icon className="h-5 w-5 text-white drop-shadow" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-primary/80">
              <span className="h-1 w-1 rounded-full bg-primary" />
              Category · {cat.products.length} products
            </div>
            <h2 className="font-display text-2xl lg:text-3xl font-bold tracking-tight truncate">
              {cat.title}
            </h2>
            <p className="text-xs text-muted-foreground truncate">{cat.tagline}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => d.scroll(-1)}
            disabled={d.atStart}
            className="btn-3d h-10 w-10 grid place-items-center rounded-xl border border-border bg-panel-elevated disabled:opacity-30 disabled:pointer-events-none"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => d.scroll(1)}
            disabled={d.atEnd}
            className="btn-3d h-10 w-10 grid place-items-center rounded-xl border border-border bg-panel-elevated disabled:opacity-30 disabled:pointer-events-none"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button className="btn-3d hidden sm:inline-flex h-10 px-3 items-center gap-1 rounded-xl border border-border bg-panel-elevated text-xs font-semibold">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>

      <div className="relative">
        {/* fade edges */}
        <div
          className={`pointer-events-none absolute inset-y-0 left-0 w-16 z-10 transition-opacity ${d.atStart ? "opacity-0" : "opacity-100"}`}
          style={{ background: "linear-gradient(90deg, var(--background), transparent)" }}
        />
        <div
          className={`pointer-events-none absolute inset-y-0 right-0 w-16 z-10 transition-opacity ${d.atEnd ? "opacity-0" : "opacity-100"}`}
          style={{ background: "linear-gradient(270deg, var(--background), transparent)" }}
        />
        <div
          ref={d.ref}
          onPointerDown={d.onPointerDown}
          onPointerMove={d.onPointerMove}
          onPointerUp={d.onPointerUp}
          onPointerCancel={d.onPointerCancel}
          onClickCapture={d.onClickCapture}
          className="flex gap-4 overflow-x-auto pb-5 pt-1 scroll-smooth snap-x snap-mandatory no-scrollbar cursor-grab select-none"
        >
          {cat.products.map((p) => (
            <div key={p.slug} className="snap-start">
              <PremiumProductCard p={p} cat={cat} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CategoryRows() {
  return (
    <div className="space-y-12">
      {CATALOG.map((c) => <CategoryRow key={c.slug} cat={c} />)}
    </div>
  );
}
