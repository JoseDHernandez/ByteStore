"use client";
import { CartItem } from "@/types/cart";
import CartItemComponent from "@/components/cartItemComponent";
import { useCart } from "@/context/cartcontext";
import { BiSad, BiCartDownload } from "react-icons/bi";
import Link from "next/link";
import { getDiscount, numberFormat } from "@/utils/textFormatters";
import { useEffect, useState } from "react";
import PayButton from "@/components/payButton";
export default function MyCartPage() {
  const { cart, clearCart } = useCart();
  const [total, SetTotal] = useState(0);
  useEffect(() => {
    if (cart.length > 0) {
      let t = 0;
      cart.forEach((p) => {
        t = t + getDiscount(p.price, p.discount) * p.quantity;
      });
      SetTotal(t);
    }
  }, [cart]);

  return (
    <section>
      <h2 className="font-bold text-3xl my-8">Tu carrito</h2>
      {cart.length > 0 ? (
        <div
          className={`${
            cart.length > 0
              ? " flex flex-col xl:flex-row justify-between items-start gap-10"
              : ""
          }`}
        >
          <div className="w-full mx-auto">
            {cart.map((p: CartItem, index) => (
              <CartItemComponent
                key={p.id}
                product={p}
                className={index > 0 ? "border-t-0" : ""}
              />
            ))}
          </div>
          <div className="w-full md:max-w-[50%] xl:max-w-100">
            <div className="bg-white shadow-xl rounded-xl p-8 w-full space-y-4 mb-8">
              <h3 className="font-bold text-2xl">Resumen de compra</h3>
              <p className="flex justify-between text-xl">
                <span>Total:</span>
                <span className="font-(family-name:--font-barlow)">
                  {numberFormat(total)}
                </span>
              </p>
              <PayButton text="Realizar compra" className="mx-auto" />
            </div>

            <button
              onClick={() => clearCart()}
              className="bg-dark-blue text-white  sm:w-50 flex justify-center items-center gap-2 font-bold p-3 rounded-md  hover:scale-105 transition duration-300 ease-in-out mx-auto"
            >
              <BiCartDownload size={25} /> Vaciar carrito
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <BiSad size={200} />
          <p>Tu carrito de compras esta vac&iacute;o</p>
          <Link
            href="/products"
            className="bg-green p-2  font-bold rounded-md text-white"
          >
            Regresar a la tienda
          </Link>
        </div>
      )}
    </section>
  );
}
