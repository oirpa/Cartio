import { Link } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";

import logo from "@/assets/cartio-logo.png";
import { useStore } from "@/lib/store";

export function Header({ onCartClick }: { onCartClick: () => void }) {
  const { cartCount } = useStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background shadow-sm">
      <div className="mx-auto grid max-w-5xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3">
        <Link to="/" className="flex min-w-0 items-center" aria-label="Cartio">
          <img src={logo} alt="Cartio" className="h-11 w-auto object-contain sm:h-12" />
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
