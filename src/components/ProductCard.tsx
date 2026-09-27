import { Plus } from "lucide-react";
import { toast } from "sonner";

import { formatIDR, useStore, type Product } from "@/lib/store";

export function ProductCard({
  product,
  onOpen,
}: {
  product: Product;
  onOpen: (product: Product) => void;
}) {
  const { addToCart } = useStore();

  const quickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, []);
    toast.success(`${product.title} masuk keranjang`);
  };

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onOpen(product)}
      onKeyDown={(e) => e.key === "Enter" && onOpen(product)}
      className="group flex cursor-pointer flex-col text-left outline-none"
    >
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-tile p-3">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className={`h-full w-full rounded-xl object-cover transition-transform duration-300 group-hover:scale-[1.03] ${product.soldOut ? "grayscale" : ""}`}
        />
        {product.soldOut ? (
          <>
            <div className="absolute inset-0 bg-background/50" />
            <span className="absolute left-0 top-0 rounded-br-lg bg-destructive px-2.5 py-1 text-xs font-semibold text-destructive-foreground">
              Out of Stock
            </span>
          </>
        ) : (
          <button
            type="button"
            aria-label={`Tambah ${product.title}`}
            onClick={quickAdd}
            className="absolute bottom-2.5 right-2.5 grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground shadow-md transition-transform hover:scale-105 active:scale-95"
          >
            <Plus className="h-5 w-5" />
          </button>
        )}
      </div>
      <div className="mt-3 min-w-0 px-0.5">
        <h3 className="truncate text-sm font-bold text-foreground sm:text-base">
          {product.title}
        </h3>
        <p className="mt-0.5 text-sm text-muted-foreground">{formatIDR(product.price)}</p>
      </div>
    </article>
  );
}
