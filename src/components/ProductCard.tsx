import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { formatIDR, useStore, type Product } from "@/lib/store";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useStore();
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const handleAdd = () => {
    addToCart(
      product,
      product.addOns.filter((a) => selected.includes(a.id)),
    );
    setSelected([]);
    toast.success(`${product.title} masuk keranjang`);
  };

  return (
    <article className="card-soft flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className={`h-full w-full object-cover ${product.soldOut ? "opacity-40 grayscale" : ""}`}
        />
        {product.soldOut && (
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-destructive px-4 py-1.5 text-sm font-bold uppercase tracking-wide text-destructive-foreground shadow-md">
            Sold Out
          </span>
        )}
      </div>

      <div className={`flex flex-1 flex-col gap-3 p-4 ${product.soldOut ? "opacity-60" : ""}`}>
        <div className="min-w-0">
          <h3 className="truncate text-base font-bold">{product.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {product.description}
          </p>
        </div>

        <p className="text-lg font-black text-primary">{formatIDR(product.price)}</p>

        {!product.soldOut && product.addOns.length > 0 && (
          <div className="space-y-2 rounded-xl bg-secondary/60 p-3">
            {product.addOns.map((addOn) => (
              <label
                key={addOn.id}
                className="flex items-center gap-2 text-sm text-secondary-foreground"
              >
                <Checkbox
                  checked={selected.includes(addOn.id)}
                  onCheckedChange={() => toggle(addOn.id)}
                />
                <span className="min-w-0 truncate">
                  {addOn.name} +{formatIDR(addOn.price)}
                </span>
              </label>
            ))}
          </div>
        )}

        <Button
          className="mt-auto w-full"
          disabled={product.soldOut}
          variant={product.soldOut ? "secondary" : "default"}
          onClick={handleAdd}
        >
          {product.soldOut ? "Sold Out" : "Add to Cart"}
        </Button>
      </div>
    </article>
  );
}
