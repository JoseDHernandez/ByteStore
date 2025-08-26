// Contexto para comunicar  los componentes del products/[id]/components
"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "@/types/product";
import { useCart } from "@/context/cartcontext";
type CartItemContextType = {
  product: Product;
  quantity: number;
  moreQuantity: boolean;
  verifyQuantity: (q: number) => void;
  addToCartEvent: () => void;
};

const CartItemContext = createContext<CartItemContextType | undefined>(
  undefined
);
interface Props {
  children: ReactNode;
  product: Product;
}
export function CartItemProvider({ children, product }: Props) {
  const [quantity, setQuantity] = useState<number>(0);
  const [moreQuantity, setMoreQuantity] = useState(false);

  const { addToCart, openOffCanvas } = useCart();

  const verifyQuantity = (q: number) => {
    if (!product) return;
    if (q > 1 && q <= product.stock) setQuantity(q);
    else if (q <= 0) setMoreQuantity(true);
  };

  const addToCartEvent = () => {
    if (!product) return;
    addToCart(product, quantity);
    product.stock = product.stock - quantity;
    setMoreQuantity(false);
    openOffCanvas(true);
  };

  return (
    <CartItemContext.Provider
      value={{
        product,
        quantity,
        moreQuantity,
        verifyQuantity,
        addToCartEvent,
      }}
    >
      {children}
    </CartItemContext.Provider>
  );
}

export function useCartItemContext() {
  const context = useContext(CartItemContext);
  if (!context) {
    throw new Error(
      "useCartItemContext debe usarse dentro de un CartItemProvider"
    );
  }
  return context;
}
