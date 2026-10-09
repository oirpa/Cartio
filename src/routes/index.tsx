import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { CartDrawer } from "@/components/CartDrawer";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { ProductDetail } from "@/components/ProductDetail";
import { Button } from "@/components/ui/button";
import { CATEGORIES, useStore, type Product } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TEMU — Katalog UMKM Mahasiswa" },
      {
        name: "description",
        content:
          "Pesan makanan dari UMKM mahasiswa lewat TEMU. Satu katalog, satu keranjang, checkout via WhatsApp.",
      },
      { property: "og:title", content: "TEMU — Katalog UMKM Mahasiswa" },
      {
        property: "og:description",
        content: "Temukan menu UMKM mahasiswa, gabungkan pesanan, dan checkout via WhatsApp.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { products } = useStore();
  const [cartOpen, setCartOpen] = useState(false);
  const [category, setCategory] = useState("Semua");
  const [detail, setDetail] = useState<Product | null>(null);
  const filtered = products.filter(
    (p) => category === "Semua" || (p.category ?? "Paket Nasi") === category,
  );
  const vendors = [...new Set(filtered.map((p) => p.vendorName ?? "Lainnya"))];

  return (
    <div className="min-h-screen bg-background">
      <Header onCartClick={() => setCartOpen(true)} />

      <main id="menu" className="mx-auto max-w-5xl px-5 py-8 sm:py-10">
        <div className="flex flex-wrap items-start justify-between gap-5 border-b border-border pb-7">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-primary">Marketplace F&B Mahasiswa</p>
            <h1 className="text-3xl font-extrabold leading-tight text-primary sm:text-4xl">TEMU · Katalog Kampus</h1>
            <p className="mt-3 text-sm font-normal text-muted-foreground">Menu dari usaha mahasiswa, dalam satu keranjang.</p>
          </div>
          <div className="border-l-4 border-accent pl-4 text-sm">
            <p className="font-bold">Pre-order maksimal H-1</p>
            <p className="mt-1 text-muted-foreground">Pengiriman Sabtu · 07.30</p>
          </div>
        </div>
        <div className="mt-7 flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold">Pilihan Menu</h2>
          <span className="text-xs text-muted-foreground">{vendors.length} UMKM · {filtered.length} menu</span>
        </div>

        <div className="-mx-5 mt-6 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none]">
          {["Semua", ...CATEGORIES].map((c) => (
            <Button variant="outline"
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`h-10 shrink-0 rounded-full border px-4 py-2 text-sm font-bold shadow-none ${
                category === c
                   ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </Button>
          ))}
        </div>

        {vendors.length === 0 && (
          <p className="mt-8 text-sm text-muted-foreground">Belum ada menu tersedia.</p>
        )}
        {vendors.map((vendor) => {
          const items = filtered
            .filter((p) => (p.vendorName ?? "Lainnya") === vendor)
            .sort((a, b) => Number(a.soldOut) - Number(b.soldOut));
          return (
            <section key={vendor} className="mt-10">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="min-w-0 text-lg font-bold text-primary">{vendor}</h3>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {items.length} menu
                </span>
              </div>
              <div className="-mx-5 mt-4 flex snap-x gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none]">
                {items.map((product) => (
                  <div
                    key={product.id}
                     className="w-[46%] shrink-0 snap-start sm:w-[30%] lg:w-[23%]"
                  >
                    <ProductCard product={product} onOpen={setDetail} />
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </main>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} TEMU · Marketplace F&B mahasiswa
      </footer>

      <ProductDetail product={detail} onClose={() => setDetail(null)} />
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </div>
  );
}
