"use client";
import { BiBasket } from "react-icons/bi";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Product } from "@/types/product";
import { useCart } from "@/context/cartcontext";
import { getDiscount } from "@/utils/textFormatters";
import { Order, ProductsOrder } from "@/types/order";
import { CartItem } from "@/types/cart";
import { postOrder } from "@/services/orders";
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
  //Quitar stock de los datos
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
    const payDate = new Date().toISOString();
    const date = new Date();
    date.setDate(date.getDate() + 5);
    const deliveryDate = date.toISOString();
    //Pendiente: cambiar logica a servidor
    const data: Order = {
      user_id: isLogged,
      products: products,
      status: "En proceso",
      total,
      pay_date: payDate,
      delivery_date: deliveryDate,
    };
    const res = await postOrder(data);
    if (res == 201) {
      clearCart();
      router.push("/orders");
    }
  };

  const handlePay = () => {
    // Caso: hay producto específico
    if (product) {
      if (!isLogged) {
        // Si no está logeado: agregar al carrito y redirigir a login
        addToCart(product);
        return router.push("/login");
      }

      // Si está logeado: comprar SOLO ese producto
      const total = getDiscount(product.price, product.discount) * quantity;
      return createOrder([productToProductOrder(product, 1)], total);
    }

    // Caso: no hay producto (comprar carrito completo)
    if (!isLogged) return router.push("/login");

    const total = cart.reduce(
      (sum, p) => sum + getDiscount(p.price, p.discount) * p.quantity,
      0
    );
    return createOrder(cartItems(cart), total);
  };

  return (
    <button
      onClick={handlePay}
      disabled={disabled}
      className={`bg-green text-white sm:w-50 flex justify-center items-center gap-2 font-bold p-3 rounded-md hover:scale-105 hover:bg-dark-green transition duration-300 ease-in-out ${className}`}
    >
      <BiBasket size={25} />
      {text}
    </button>
  );
}
