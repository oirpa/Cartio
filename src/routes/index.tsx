import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { CartDrawer } from "@/components/CartDrawer";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cartio — Makan Siang Kampus Praktis" },
      {
        name: "description",
        content:
          "Pesan makan siang kampus lewat Cartio. Pilih menu, tambah topping, checkout langsung via WhatsApp.",
      },
      { property: "og:title", content: "Cartio — Makan Siang Kampus Praktis" },
      {
        property: "og:description",
        content: "Menu catering kampus praktis, pesan cepat via WhatsApp.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { products } = useStore();
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header onCartClick={() => setCartOpen(true)} />

      <section className="hero-surface border-b border-border">
        <div className="mx-auto max-w-5xl px-4 py-14 text-center sm:py-20">
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            Catering Kampus
          </span>
          <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight sm:text-5xl">
            Makan Siang Kampus Praktis bareng Cartio!
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
            Pilih menu favoritmu, atur topping, dan pesanan langsung dikirim ke gedung
            kelasmu. Bayar gampang lewat WhatsApp.
          </p>
          <Button size="lg" className="mt-7" asChild>
            <a href="#menu">Pesan Sekarang</a>
          </Button>
        </div>
      </section>

      <main id="menu" className="mx-auto max-w-5xl px-4 py-10">
        <h2 className="text-2xl font-black tracking-tight">Menu Hari Ini</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Dimasak fresh setiap pagi, siap diantar jam makan siang.
        </p>

        {products.length === 0 ? (
          <p className="mt-10 text-center text-sm text-muted-foreground">
            Belum ada menu tersedia.
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Cartio · Catering kampus
      </footer>

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </div>
  );
}
