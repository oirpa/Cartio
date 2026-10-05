import { useState } from "react";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { buildWhatsAppUrl, formatIDR, useStore } from "@/lib/store";

export function CartDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { cart, subtotal, setQuantity, removeItem, clearCart } = useStore();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  const handleOrder = () => {
    if (!cart.length) {
      toast.error("Keranjang masih kosong.");
      return;
    }
    if (!name.trim() || !location.trim()) {
      toast.error("Nama dan detail lokasi wajib diisi.");
      return;
    }
    const url = buildWhatsAppUrl({
      name: name.trim(),
      location: location.trim(),
      notes: notes.trim(),
      cart,
      total: subtotal,
    });
    window.open(url, "_blank", "noopener,noreferrer");
    clearCart();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border px-5 py-4">
          <SheetTitle className="flex items-center gap-2 text-lg">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Keranjang Kamu
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
          {cart.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Belum ada menu di keranjang.
            </p>
          ) : (
            <div className="space-y-5">
              {[...new Set(cart.map((i) => i.vendorName ?? "Lainnya"))].map((vendor) => (
              <div key={vendor}>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-primary">
                {vendor}
              </p>
            <ul className="space-y-3">
              {cart.filter((i) => (i.vendorName ?? "Lainnya") === vendor).map((item) => {
                const unit = item.price + item.addOns.reduce((s, a) => s + a.price, 0);
                return (
                  <li
                    key={item.key}
                    className="rounded-xl border border-border bg-card p-3"
                  >
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{item.title}</p>
                        {item.addOns.length > 0 && (
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {item.addOns.map((a) => a.name).join(", ")}
                          </p>
                        )}
                        <p className="mt-1 text-sm font-semibold text-primary">
                          {formatIDR(unit * item.quantity)}
                        </p>
                      </div>
                      <button
                        aria-label={`Hapus ${item.title}`}
                        onClick={() => removeItem(item.key)}
                        className="shrink-0 rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        aria-label="Kurangi"
                        onClick={() => setQuantity(item.key, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        aria-label="Tambah"
                        onClick={() => setQuantity(item.key, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
              </div>
              ))}
            </div>
          )}

          <div className="space-y-3 border-t border-border pt-5">
            <div className="space-y-1.5">
              <Label htmlFor="nama">Nama Pemesan *</Label>
              <Input
                id="nama"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama kamu"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lokasi">Detail Lokasi Pengiriman *</Label>
              <Textarea
                id="lokasi"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Contoh: Gedung A Lantai 2 / Lobi Utama"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="catatan">Catatan Tambahan</Label>
              <Textarea
                id="catatan"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Opsional, misal: pedas level 2"
              />
            </div>
          </div>
        </div>

        <div className="space-y-3 border-t border-border px-5 py-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-lg font-bold text-primary">{formatIDR(subtotal)}</span>
          </div>
          <Button className="w-full" size="lg" onClick={handleOrder}>
            Pesan via WhatsApp
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
