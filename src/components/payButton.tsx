"use client";
import { BiBasket } from "react-icons/bi";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Product } from "@/types/product";
import { useCart } from "@/context/cartcontext";
import { getDiscount } from "@/utils/textFormatters";
import { ProductsOrder } from "@/types/order";
import { CartItem } from "@/types/cart";
interface Props {
  text?: string;
  disabled?: boolean;
  product?: Product;
  className?: string;
  quantity?: number;
}

export default function PayButton({
  text = "Comprar",
  disabled,
  product,
  className,
  quantity = 1,
}: Props) {
  const { data: session } = useSession();
  const { addToCart, cart, clearCart } = useCart();
  const router = useRouter();
  const isLogged = session?.user.id;
  function cartItems(cart: CartItem[]): ProductsOrder[] {
    return cart.map(({ stock, ...rest }) => rest);
  }
  function productToProductOrder(
    product: Product,
    quantity: number
  ): ProductsOrder {
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      discount: product.discount,
      quantity: quantity,
      brand: product.brand,
      model: product.model,
      image: product.image,
    };
  }

  // Función genérica para crear una orden en el backend
  const createOrder = async (products: ProductsOrder[], total: number) => {
    try {
      const payDate = new Date().toISOString();
      const date = new Date();
      date.setDate(date.getDate() + 5);
      const deliveryDate = date.toISOString();

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: isLogged,
          products: products,
          status: "En proceso",
          total,
          pay_date: payDate,
          delivery_date: deliveryDate,
        }),
      });

      if (res.ok) {
        clearCart();
        router.push("/orders");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePay = async () => {
    // Caso: hay producto específico
    if (product) {
      if (!isLogged) {
        // Si no está logeado: agregar al carrito y redirigir a login
        addToCart(product);
        return router.push("/login");
      }

      // Si está logeado: comprar SOLO ese producto
      const total = getDiscount(product.price, product.discount) * quantity;
      return await createOrder([productToProductOrder(product, 1)], total);
    }

    // Caso: no hay producto (comprar carrito completo)
    if (!isLogged) return router.push("/login");

    const total = cart.reduce(
      (sum, p) => sum + getDiscount(p.price, p.discount) * p.quantity,
      0
    );
    return await createOrder(cartItems(cart), total);
  };

  return (
    <button
      onClick={handlePay}
      disabled={disabled}
      className={`bg-green text-white sm:w-50 flex justify-center items-center gap-2 font-bold p-3 rounded-md hover:scale-105 transition duration-300 ease-in-out ${className}`}
    >
      <BiBasket size={25} />
      {text}
    </button>
  );
}
