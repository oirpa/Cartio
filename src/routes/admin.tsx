import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { formatIDR, useStore, type Product } from "@/lib/store";

const PASSWORD = "admincartio";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Cartio" },
      { name: "description", content: "Kelola menu dan ketersediaan produk Cartio." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin Dashboard — Cartio" },
      { property: "og:description", content: "Kelola menu Cartio." },
    ],
  }),
  component: AdminPage,
});

type FormState = {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string;
  addOns: string;
};

const emptyForm: FormState = {
  id: "",
  title: "",
  description: "",
  price: "",
  image: "",
  addOns: "",
};

function toForm(product: Product): FormState {
  return {
    id: product.id,
    title: product.title,
    description: product.description,
    price: String(product.price),
    image: product.image,
    addOns: product.addOns.map((a) => `${a.name}:${a.price}`).join(", "),
  };
}

function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (password === PASSWORD) setAuthed(true);
            else toast.error("Password salah.");
          }}
          className="card-soft w-full max-w-sm space-y-4 rounded-2xl border border-border bg-card p-6"
        >
          <div>
            <h1 className="text-xl font-black text-primary">Cartio Admin</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Masukkan password untuk mengelola menu.
            </p>
          </div>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <Button type="submit" className="w-full">
            Masuk
          </Button>
        </form>
      </div>
    );
  }

  return <AdminDashboard />;
}

function AdminDashboard() {
  const { products, saveProduct, deleteProduct, toggleSoldOut } = useStore();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editing, setEditing] = useState(false);

  const update = (patch: Partial<FormState>) => setForm((f) => ({ ...f, ...patch }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.price.trim()) {
      toast.error("Judul dan harga wajib diisi.");
      return;
    }
    const addOns = form.addOns
      .split(",")
      .map((chunk) => chunk.trim())
      .filter(Boolean)
      .map((chunk, index) => {
        const [name, price] = chunk.split(":");
        return {
          id: `ad${index}-${name?.trim() ?? ""}`,
          name: (name ?? "").trim(),
          price: Number(price ?? 0) || 0,
        };
      });

    saveProduct({
      id: form.id || `p${Date.now()}`,
      title: form.title.trim(),
      description: form.description.trim(),
      price: Number(form.price) || 0,
      image: form.image.trim() || "https://placehold.co/600x600?text=Cartio",
      soldOut: products.find((p) => p.id === form.id)?.soldOut ?? false,
      addOns,
    });

    toast.success(editing ? "Menu diperbarui" : "Menu ditambahkan");
    setForm(emptyForm);
    setEditing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 px-4 py-3 backdrop-blur">
        <div className="mx-auto grid max-w-5xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <h1 className="truncate text-lg font-black text-primary">Cartio Admin</h1>
          <Button variant="outline" size="sm" asChild>
            <Link to="/">Lihat Toko</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto grid max-w-5xl gap-6 px-4 py-8 lg:grid-cols-[360px_minmax(0,1fr)]">
        <form
          onSubmit={handleSubmit}
          className="card-soft h-fit space-y-3 rounded-2xl border border-border bg-card p-5"
        >
          <h2 className="flex items-center gap-2 font-bold">
            <Plus className="h-4 w-4 text-primary" />
            {editing ? "Edit Menu" : "Add New Menu"}
          </h2>
          <div className="space-y-1.5">
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              value={form.image}
              onChange={(e) => update({ image: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => update({ title: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="desc">Description</Label>
            <Textarea
              id="desc"
              value={form.description}
              onChange={(e) => update({ description: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="price">Price (IDR) *</Label>
            <Input
              id="price"
              type="number"
              value={form.price}
              onChange={(e) => update({ price: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="addons">Add-ons</Label>
            <Input
              id="addons"
              value={form.addOns}
              onChange={(e) => update({ addOns: e.target.value })}
              placeholder="Ekstra Telur:4000, Ekstra Sambal:2000"
            />
            <p className="text-xs text-muted-foreground">
              Format: Nama:Harga, dipisah koma.
            </p>
          </div>
          <div className="flex gap-2 pt-1">
            <Button type="submit" className="flex-1">
              {editing ? "Simpan Perubahan" : "Tambah Menu"}
            </Button>
            {editing && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setForm(emptyForm);
                  setEditing(false);
                }}
              >
                Batal
              </Button>
            )}
          </div>
        </form>

        <section className="space-y-3">
          <h2 className="font-bold">Semua Menu ({products.length})</h2>
          {products.map((product) => (
            <div
              key={product.id}
              className="card-soft rounded-2xl border border-border bg-card p-4"
            >
              <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
                <img
                  src={product.image}
                  alt={product.title}
                  loading="lazy"
                  className="h-16 w-16 shrink-0 rounded-xl object-cover"
                />
                <div className="min-w-0">
                  <p className="truncate font-semibold">{product.title}</p>
                  <p className="text-sm font-bold text-primary">
                    {formatIDR(product.price)}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {product.addOns.map((a) => a.name).join(", ") || "Tanpa add-on"}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-border pt-3">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={!product.soldOut}
                    onCheckedChange={() => toggleSoldOut(product.id)}
                    aria-label="Ketersediaan"
                  />
                  <span className="text-xs font-medium">
                    {product.soldOut ? "Sold Out" : "Available"}
                  </span>
                </div>
                <div className="ml-auto flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setForm(toForm(product));
                      setEditing(true);
                    }}
                  >
                    <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      deleteProduct(product.id);
                      toast.success("Menu dihapus");
                    }}
                  >
                    <Trash2 className="mr-1 h-3.5 w-3.5" /> Hapus
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
