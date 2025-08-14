"use client";
import { CartItem } from "@/types/cart";
import { Product } from "@/types/product";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useSession } from "next-auth/react";
interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product | CartItem, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  openOffCanvas: (state: boolean) => void;
  clearCart: () => void;
  stateOffCanvas: boolean;
  syncCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();
  //Para los datos
  const [cart, setCart] = useState<CartItem[]>([]);
  //Canvas
  const [stateOffCanvas, setStateOffCanvas] = useState(false);
  //Cargar datos
  useEffect(() => {
    const storeCart = localStorage.getItem("cart");
    if (storeCart) {
      setCart(JSON.parse(storeCart));
    }
  }, []);
  //Guardar
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);
  const addToCart = (product: Product | CartItem, quantity?: number) => {
    if (product.stock < 1) return;
    const q = quantity != null && quantity > 1 ? quantity : 1;
    setCart((prev) => {
      //Verificar si existe
      const existing = prev.find((e) => e.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id
            ? { ...i, quantity: quantity ? q : i.quantity + 1 }
            : i
        );
      }
      const { id, discount, price, name, image, stock, brand, model } = product;
      return [
        ...prev,
        { id, name, price, discount, image, stock, brand, model, quantity: q },
      ];
    });
  };
  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };
  const clearCart = () => {
    setCart([]);
  };
  const openOffCanvas = (state: boolean) => {
    setStateOffCanvas(state);
  };
  // Sincronizar cart del server
  const syncCart = async () => {
    const userId = session?.user.id;
    if (!userId) return;

    try {
      //Solicitar carrito
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/carts/${userId}`
      );
      if (!res.ok) return;

      const d = await res.json();
      const serverCart: CartItem[] = d.products ?? [];

      // Fusionar serverCart y cart local
      const map = new Map<string, CartItem>();
      [...serverCart, ...cart].forEach((item) => {
        if (map.has(item.id)) {
          const existing = map.get(item.id)!;
          map.set(item.id, {
            ...existing,
            quantity: Math.max(existing.quantity, item.quantity),
          });
        } else {
          map.set(item.id, { ...item });
        }
      });

      const mergedCart = Array.from(map.values());
      setCart(mergedCart);
    } catch (err) {
      console.log("Error sincronizando carrito:", err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        openOffCanvas,
        stateOffCanvas,
        syncCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error();
  return context;
};
