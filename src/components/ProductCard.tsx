import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

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
      <div className="relative aspect-square overflow-hidden rounded-lg bg-tile p-2">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className={`h-full w-full rounded-md object-cover motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-[1.03] ${product.soldOut ? "grayscale" : ""}`}
        />
        {product.soldOut ? (
          <>
            <div className="absolute inset-0 bg-background/50" />
            <span className="absolute left-0 top-0 rounded-br-lg bg-accent px-2.5 py-1 text-xs font-bold text-accent-foreground">
              Out of Stock
            </span>
          </>
        ) : (
          <Button size="icon"
            type="button"
            aria-label={`Tambah ${product.title}`}
            onClick={quickAdd}
            className="absolute bottom-3 right-3 h-9 w-9 rounded-full bg-primary text-primary-foreground shadow-none"
          >
            <Plus className="h-5 w-5" />
          </Button>
        )}
      </div>
      <div className="mt-3 min-w-0 px-0.5">
        <h3 className="min-h-10 text-sm font-medium leading-5 text-foreground sm:text-base">
          {product.title}
        </h3>
        <p className="mt-1 truncate text-xs font-normal text-muted-foreground">
          By: {product.vendorName ?? "Lainnya"}
        </p>
        <p className="mt-2 text-sm font-bold text-primary">{formatIDR(product.price)}</p>
      </div>
    </article>
  );
}
