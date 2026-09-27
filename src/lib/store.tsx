import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import geprek from "@/assets/menu-geprek.jpg";
import nasgor from "@/assets/menu-nasgor.jpg";
import katsu from "@/assets/menu-katsu.jpg";
import esteh from "@/assets/menu-esteh.jpg";

export type AddOn = { id: string; name: string; price: number };

export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  soldOut: boolean;
  addOns: AddOn[];
  category?: string;
};

export const CATEGORIES = ["Paket Nasi", "Minuman", "Add On"] as const;

export type CartItem = {
  key: string;
  productId: string;
  title: string;
  price: number;
  quantity: number;
  addOns: AddOn[];
  note?: string;
};

const PRODUCTS_KEY = "cartio.products.v1";
const CART_KEY = "cartio.cart.v1";

export const WHATSAPP_NUMBER = "62895370004561";

export const defaultProducts: Product[] = [
  {
    id: "p1",
    category: "Paket Nasi",
    title: "Nasi Ayam Geprek",
    description: "Ayam crispy digeprek sambal bawang, nasi hangat, lalapan.",
    price: 20000,
    image: geprek,
    soldOut: false,
    addOns: [
      { id: "a1", name: "Ekstra Telur", price: 4000 },
      { id: "a2", name: "Ekstra Sambal", price: 2000 },
    ],
  },
  {
    id: "p2",
    category: "Paket Nasi",
    title: "Nasi Goreng Spesial",
    description: "Nasi goreng kampung dengan telur mata sapi dan acar.",
    price: 22000,
    image: nasgor,
    soldOut: false,
    addOns: [{ id: "a1", name: "Ekstra Telur", price: 4000 }],
  },
  {
    id: "p3",
    category: "Paket Nasi",
    title: "Chicken Katsu Bowl",
    description: "Katsu ayam saus teriyaki dengan salad segar.",
    price: 25000,
    image: katsu,
    soldOut: true,
    addOns: [{ id: "a3", name: "Ekstra Saus Keju", price: 5000 }],
  },
  {
    id: "p4",
    category: "Minuman",
    title: "Es Teh Manis Jumbo",
    description: "Teh melati dingin segar ukuran jumbo 500ml.",
    price: 6000,
    image: esteh,
    soldOut: false,
    addOns: [],
  },
];

export function formatIDR(value: number) {
  return "Rp " + value.toLocaleString("id-ID");
}

type StoreValue = {
  products: Product[];
  cart: CartItem[];
  cartCount: number;
  subtotal: number;
  addToCart: (product: Product, addOns: AddOn[], quantity?: number, note?: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
  saveProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  toggleSoldOut: (id: string) => void;
};

const StoreContext = createContext<StoreValue | null>(null);

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function CartioProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setProducts(read(PRODUCTS_KEY, defaultProducts));
    setCart(read(CART_KEY, [] as CartItem[]));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  }, [products, hydrated]);

  useEffect(() => {
    if (hydrated) localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  const addToCart = useCallback(
    (product: Product, addOns: AddOn[], quantity = 1, note = "") => {
    const cleanNote = note.trim();
    const key =
      product.id + "|" + addOns.map((a) => a.id).sort().join(",") + (cleanNote ? "|" + cleanNote : "");
    setCart((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, quantity: i.quantity + quantity } : i));
      }
      return [
        ...prev,
        {
          key,
          productId: product.id,
          title: product.title,
          price: product.price,
          quantity,
          addOns,
          note: cleanNote || undefined,
        },
      ];
    });
  }, []);

  const setQuantity = useCallback((key: string, quantity: number) => {
    setCart((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.key !== key)
        : prev.map((i) => (i.key === key ? { ...i, quantity } : i)),
    );
  }, []);

  const removeItem = useCallback((key: string) => {
    setCart((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const saveProduct = useCallback((product: Product) => {
    setProducts((prev) =>
      prev.some((p) => p.id === product.id)
        ? prev.map((p) => (p.id === product.id ? product : p))
        : [...prev, product],
    );
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const toggleSoldOut = useCallback((id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, soldOut: !p.soldOut } : p)),
    );
  }, []);

  const value = useMemo<StoreValue>(() => {
    const subtotal = cart.reduce(
      (sum, i) =>
        sum + i.quantity * (i.price + i.addOns.reduce((s, a) => s + a.price, 0)),
      0,
    );
    return {
      products,
      cart,
      cartCount: cart.reduce((n, i) => n + i.quantity, 0),
      subtotal,
      addToCart,
      setQuantity,
      removeItem,
      clearCart,
      saveProduct,
      deleteProduct,
      toggleSoldOut,
    };
  }, [
    products,
    cart,
    addToCart,
    setQuantity,
    removeItem,
    clearCart,
    saveProduct,
    deleteProduct,
    toggleSoldOut,
  ]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside CartioProvider");
  return ctx;
}

export function buildWhatsAppUrl(args: {
  name: string;
  location: string;
  notes: string;
  cart: CartItem[];
  total: number;
}) {
  const lines = args.cart.map((i) => {
    const itemTotal = i.quantity * (i.price + i.addOns.reduce((s, a) => s + a.price, 0));
    const extras = i.addOns.length
      ? "\n   + " + i.addOns.map((a) => `${a.name} (${formatIDR(a.price)})`).join(", ")
      : "";
    const note = i.note ? `\n   Catatan: ${i.note}` : "";
    return `• ${i.quantity}x ${i.title}${extras}${note}\n   ${formatIDR(itemTotal)}`;
  });

  const message =
    "Halo Cartio, saya ingin memesan makanan:\n\n" +
    `*Nama:* ${args.name}\n` +
    `*Lokasi Pengiriman:* ${args.location}\n\n` +
    "*Pesanan:*\n" +
    lines.join("\n") +
    "\n\n" +
    `*Catatan:* ${args.notes || "-"}\n` +
    `*Total Pembayaran: ${formatIDR(args.total)}*\n\n` +
    "Mohon info rekening/QRIS untuk pembayaran ya.";

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${window.encodeURIComponent(message)}`;
}
