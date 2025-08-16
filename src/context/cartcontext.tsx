"use client";
import { CartItem } from "@/types/cart";
import { Product } from "@/types/product";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
} from "react";
import { useSession } from "next-auth/react";

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product | CartItem, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  openOffCanvas: (state: boolean) => void;
  clearCart: () => void;
  stateOffCanvas: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [id, setId] = useState<string | null>(null);
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [cart, setCart] = useState<CartItem[]>([]);
  const [stateOffCanvas, setStateOffCanvas] = useState(false);

  // referencia para debounce
  const updateTimer = useRef<NodeJS.Timeout | null>(null);

  // Cargar datos locales
  useEffect(() => {
    const storeCart = localStorage.getItem("cart");
    if (storeCart) {
      setCart(JSON.parse(storeCart));
    }
  }, []);

  // Guardar en localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Cargar cart desde el db
  useEffect(() => {
    const syncCart = async () => {
      if (!userId) return;
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/carts?user_id=${userId}`
        );
        if (!res.ok) return;
        const de = await res.json();
        const d = de[0];
        if (d?.id) {
          setId(d.id);
          const serverCart: CartItem[] = d?.products ?? [];

          setCart((prevCart) => {
            const map = new Map<string, CartItem>();
            [...serverCart, ...prevCart].forEach((item) => {
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
            return Array.from(map.values());
          });
        }
      } catch (err) {
        console.error("Error sincronizando carrito:", err);
      }
    };
    syncCart();
  }, [userId]);

  // Función para enviar el carrito al servidor
  const syncCartToServer = async (cartData: CartItem[]) => {
    if (!userId) return;
    try {
      if (id) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/carts/${id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: userId, products: cartData }),
          }
        );
        if (res.status === 404) {
          // carrito no existe, crearlo
          createCartToServer(cartData);
        }
      } else createCartToServer(cartData);
    } catch (err) {
      console.warn("Error al sincronizar carrito:", err);
    }
  };
  //Crear
  const createCartToServer = async (cartData: CartItem[]) => {
    if (cart.length < 1 && !id) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/carts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, products: cartData }),
      });
    } catch (err) {
      console.warn("Error al crear carrito:", err);
    }
  };
  //Eliminar
  const deleteCartToServer = async () => {
    if (cart.length < 1 && !id) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/carts/${id}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.warn("Error eliminando carrito en servidor:", err);
    }
  };
  // Programar la actualización con debounce
  const scheduleUpdate = (newCart: CartItem[]) => {
    if (updateTimer.current) clearTimeout(updateTimer.current);
    updateTimer.current = setTimeout(() => {
      if (userId) syncCartToServer(newCart);
    }, 900);
  };

  const addToCart = (product: Product | CartItem, quantity?: number) => {
    if (product.stock < 1) return;
    const q = quantity != null && quantity > 1 ? quantity : 1;

    setCart((prev) => {
      const existing = prev.find((e) => e.id === product.id);
      let updated: CartItem[];
      if (existing) {
        updated = prev.map((i) =>
          i.id === product.id
            ? { ...i, quantity: quantity ? q : i.quantity + 1 }
            : i
        );
      } else {
        const { id, discount, price, name, image, stock, brand, model } =
          product;
        updated = [
          ...prev,
          {
            id,
            name,
            price,
            discount,
            image,
            stock,
            brand,
            model,
            quantity: q,
          },
        ];
      }
      scheduleUpdate(updated);
      return updated;
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const updated = prev.filter((i) => i.id !== id);
      scheduleUpdate(updated);
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    deleteCartToServer();
  };

  const openOffCanvas = (state: boolean) => {
    setStateOffCanvas(state);
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
