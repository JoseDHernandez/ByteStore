"use client";
import { CartItem } from "@/types/cartItem";
import { Product } from "@/types/product";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

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
      const { id, discount, price, name, image, stock } = product;
      return [
        ...prev,
        { id, name, price, discount, image, stock, quantity: q },
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
