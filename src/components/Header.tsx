import { Link } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";

import { TemuLogo } from "@/components/TemuLogo";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

export function Header({ onCartClick }: { onCartClick: () => void }) {
  const { cartCount } = useStore();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-primary bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-5xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3">
        <Link to="/" className="flex min-w-0 items-center" aria-label="TEMU">
          <TemuLogo light className="h-9 w-auto max-w-full sm:h-10" />
        </Link>
        <Button variant="ghost" size="icon"
          onClick={onCartClick}
          aria-label="Buka keranjang"
          className="relative h-10 w-10 shrink-0 border border-primary-foreground/30 hover:bg-primary-foreground/10 hover:text-primary-foreground"
        >
          <ShoppingCart className="h-5 w-5" />
          {cartCount > 0 && (
            <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] font-bold text-accent-foreground">
              {cartCount}
            </span>
          )}
        </Button>
      </div>
    </header>
  );
}
