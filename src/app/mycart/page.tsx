"use client";
import { useEffect } from "react";
import { CartItem } from "@/types/cart";
import CartItemComponent from "@/components/cartItemComponent";
import { useCart } from "@/context/cartcontext";
export default function MyCartPage() {
  const { syncCart, cart } = useCart();

  useEffect(() => {
    syncCart();
  });

  return (
    <section className="p-4">
      <h2 className="text-2xl font-bold mb-4">Mi carrito</h2>
      <div className="space-y-4">
        {cart.length > 0 ? (
          cart.map((p: CartItem) => (
            <CartItemComponent key={p.id} product={p} />
          ))
        ) : (
          <p>No tienes productos en el carrito.</p>
        )}
      </div>
    </section>
  );
}
