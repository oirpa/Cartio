import { Link } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";

import { useStore } from "@/lib/store";

export function Header({ onCartClick }: { onCartClick: () => void }) {
  const { cartCount } = useStore();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto grid max-w-5xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-base font-black text-primary-foreground">
            C
          </span>
          <span className="truncate text-xl font-black tracking-tight text-primary">
            Cartio
          </span>
        </Link>
        <button
          onClick={onCartClick}
          aria-label="Buka keranjang"
          className="relative shrink-0 rounded-xl border border-border p-2.5 transition-colors hover:bg-accent"
        >
          <ShoppingCart className="h-5 w-5 text-primary" />
          {cartCount > 0 && (
            <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
