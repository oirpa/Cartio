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
      { title: "EatEight — Pre-order Makanan Praktis" },
      {
        name: "description",
        content:
          "Pre-order makanan lewat EatEight. Pilih menu, tambah topping, checkout langsung via WhatsApp.",
      },
      { property: "og:title", content: "EatEight — Pre-order Makanan Praktis" },
      {
        property: "og:description",
        content: "Menu catering modern dan praktis, pesan cepat via WhatsApp.",
      },
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
  const available = filtered.filter((p) => !p.soldOut);
  const soldOut = filtered.filter((p) => p.soldOut);

  return (
    <div className="min-h-screen bg-background">
      <Header onCartClick={() => setCartOpen(true)} />

      <section className="hero-surface border-b border-border">
        <div className="mx-auto max-w-5xl px-4 py-14 text-center sm:py-20">
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            Marketplace F&B Kampus
          </span>
          <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight sm:text-5xl">
            Pre-order Makanan Praktis bareng EatEight! Pre-order maksimal H-1 ya!
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
            Pilih menu favoritmu, atur topping, dan pesanan langsung dikirim ke gedung
            kelasmu. Bayar gampang lewat WhatsApp.
            <h1 className="mt-4 text-xl font-bold">Dikirim setiap hari sabtu pagi jam 7:30 ya!</h1>
          </p>
          <Button size="lg" className="mt-7" asChild>
            <a href="#menu">Pesan Sekarang</a>
          </Button>
        </div>
      </section>

      <main id="menu" className="mx-auto max-w-5xl px-5 py-10">
        <h2 className="text-2xl font-extrabold tracking-tight">Menu Hari Ini</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Dimasak fresh setiap pagi, langsung siap diantar!.
        </p>

        <div className="-mx-5 mt-6 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none]">
          {["Semua", ...CATEGORIES].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                category === c
                  ? "border-primary text-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <section className="mt-8">
          <h3 className="text-lg font-bold">Menu Tersedia</h3>
          {available.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">Belum ada menu tersedia.</p>
          ) : (
            <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-7 md:grid-cols-3 lg:grid-cols-4">
              {available.map((product) => (
                <ProductCard key={product.id} product={product} onOpen={setDetail} />
              ))}
            </div>
          )}
        </section>

        {soldOut.length > 0 && (
          <section className="mt-12 pt-2">
            <h3 className="text-lg font-bold text-muted-foreground">Menu Habis</h3>
            <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-7 md:grid-cols-3 lg:grid-cols-4">
              {soldOut.map((product) => (
                <ProductCard key={product.id} product={product} onOpen={setDetail} />
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} EatEight · Marketplace F&B mahasiswa
      </footer>

      <ProductDetail product={detail} onClose={() => setDetail(null)} />
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </div>
  );
}
