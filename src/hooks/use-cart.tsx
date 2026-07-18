import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";

export type CartItem = {
  id: string;
  name: string;
  industry?: string;
  price: string;
  period?: string;
};

type CartCtx = {
  items: CartItem[];
  count: number;
  add: (item: CartItem) => void;
  remove: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "vala.cart.v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  const add = (item: CartItem) => {
    setItems((prev) => {
      if (prev.find((p) => p.id === item.id)) {
        toast("Already in cart", { description: item.name });
        return prev;
      }
      toast.success("Added to cart", { description: item.name });
      return [...prev, item];
    });
  };

  const remove = (id: string) => {
    setItems((prev) => {
      const found = prev.find((p) => p.id === id);
      if (found) toast("Removed from cart", { description: found.name });
      return prev.filter((p) => p.id !== id);
    });
  };

  const clear = () => setItems([]);
  const has = (id: string) => items.some((p) => p.id === id);

  return (
    <Ctx.Provider value={{ items, count: items.length, add, remove, clear, has }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCart must be used inside CartProvider");
  return v;
}

export function parsePriceUSD(price: string): number {
  const m = price.replace(/,/g, "").match(/[\d.]+/);
  return m ? Number(m[0]) : 0;
}
