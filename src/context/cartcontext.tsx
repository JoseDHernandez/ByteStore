"use client";
import { Cart, CartItem } from "@/types/cart";
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
import {
  deleteCartById,
  getCartByUserId,
  postCart,
  putCart,
} from "@/services/cart";

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product | CartItem, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  openOffCanvas: (state: boolean) => void;
  clearCart: () => void;
  stateOffCanvas: boolean;
  signOutCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [id, setId] = useState<string | null>(null);
  const { data: session } = useSession();
  const isLoggedIn = session?.user?.name;
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
      if (!isLoggedIn) return;
      try {
        const res = await getCartByUserId(userId);
        //Validar si esta vació
        if (res == null) return;
        setId(res.id);
        const serverCart: CartItem[] = res?.products ?? [];
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
      } catch (err) {
        console.error("Error sincronizando carrito:", err);
      }
    };
    syncCart();
  }, [userId, isLoggedIn]);

  // Función para enviar el carrito al servidor
  const syncCartToServer = async (cartData: CartItem[]) => {
    if (!isLoggedIn) return;
    try {
      console.log("id:", id);
      if (id) {
        const data: Cart = {
          id: id,
          user_id: userId,
          products: cartData,
        };
        const res = await putCart(data);
        if (res !== 200) {
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
    const res = await postCart(userId, cartData);
    if (res !== 201) console.warn("Error al crear carrito");
  };
  //Eliminar
  const deleteCartToServer = async () => {
    if (id === null) return;
    const res = await deleteCartById(id);
    clearCart();
    if (res !== 200) console.warn("Error al eliminar el carrito del servidor");
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
  };

  const openOffCanvas = (state: boolean) => {
    setStateOffCanvas(state);
  };
  //Limpiar carrito al cerrar sesión
  const signOutCart = () => {
    //eliminar carrito del servidor si esta vacio
    if (cart.length == 0) deleteCartToServer();
    else clearCart();
    setId(null);
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
        signOutCart,
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
