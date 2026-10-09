import { ArrowLeft, Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { formatIDR, useStore, type Product } from "@/lib/store";

export function ProductDetail({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const { addToCart } = useStore();
  const [selected, setSelected] = useState<string[]>([]);
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");

  useEffect(() => {
    setSelected([]);
    setQty(1);
    setNote("");
  }, [product?.id]);

  if (!product) return null;

  const addOns = product.addOns.filter((a) => selected.includes(a.id));
  const total = qty * (product.price + addOns.reduce((s, a) => s + a.price, 0));

  const handleAdd = () => {
    addToCart(product, addOns, qty, note);
    toast.success(`${qty}x ${product.title} masuk keranjang`);
    onClose();
  };

  return (
    <Dialog open={!!product} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="flex h-dvh max-h-dvh w-full max-w-full flex-col gap-0 overflow-hidden rounded-none border-0 p-0 sm:h-[90vh] sm:max-w-lg sm:rounded-lg [&>button]:hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="relative bg-tile px-10 pb-8 pt-14">
            <Button variant="outline" size="icon"
              type="button"
              onClick={onClose}
              aria-label="Kembali"
              className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-background shadow-sm"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <img
              src={product.image}
              alt={product.title}
              className="mx-auto aspect-square w-full max-w-xs rounded-lg object-cover"
            />
          </div>

          <div className="space-y-7 px-6 py-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <DialogTitle className="text-2xl font-extrabold leading-tight text-primary">
                  {product.title}
                </DialogTitle>
                <p className="mt-2 text-xs text-muted-foreground">By: {product.vendorName ?? "Lainnya"}</p>
                <p className="mt-3 text-sm font-normal text-muted-foreground">{product.description}</p>
              </div>
              <p className="shrink-0 text-lg font-bold text-primary">
                {formatIDR(product.price)}
              </p>
            </div>

            {product.addOns.length > 0 && (
              <div>
                <h4 className="text-sm font-bold">Add-on</h4>
                <div className="mt-3 divide-y divide-border">
                  {product.addOns.map((a) => (
                    <label key={a.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                      <span className="flex min-w-0 items-center gap-3">
                        <Checkbox
                          checked={selected.includes(a.id)}
                          onCheckedChange={() =>
                            setSelected((p) =>
                              p.includes(a.id) ? p.filter((x) => x !== a.id) : [...p, a.id],
                            )
                          }
                        />
                        <span className="truncate">{a.name}</span>
                      </span>
                      <span className="shrink-0 text-muted-foreground">+{formatIDR(a.price)}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="text-sm font-bold">
                Notes <span className="font-normal text-muted-foreground">(Optional)</span>
              </h4>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Give notes to restaurant"
                className="mt-3 min-h-20 rounded-xl"
              />
            </div>

            <div className="flex items-center justify-center gap-6">
              <Button variant="outline" size="icon"
                type="button"
                aria-label="Kurangi"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="grid h-10 w-10 place-items-center rounded-full border border-border"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-6 text-center text-lg font-bold">{qty}</span>
              <Button variant="outline" size="icon"
                type="button"
                aria-label="Tambah"
                onClick={() => setQty((q) => q + 1)}
                className="grid h-10 w-10 place-items-center rounded-full border border-primary text-primary"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-border bg-background p-4">
          <Button
            type="button"
            disabled={product.soldOut}
            onClick={handleAdd}
            className="h-12 w-full justify-between bg-primary px-4 text-sm font-bold text-primary-foreground shadow-none disabled:bg-muted disabled:text-muted-foreground"
          >
            <span>{product.soldOut ? "Out of Stock" : "Add to Cart"}</span>
            {!product.soldOut && <span className="text-base font-extrabold text-accent">{formatIDR(total)}</span>}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
