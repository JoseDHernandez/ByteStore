"use client";
import { useCart } from "@/context/cartcontext";
import Link from "next/link";
import { BiCart, BiX } from "react-icons/bi";
import CartProduct from "./cartProduct";
import { usePathname } from "next/navigation";
export default function Cart() {
  const { stateOffCanvas, cart, openOffCanvas } = useCart();
  const pathname = usePathname();
  return (
    <>
      <button
        className="rounded-md p-1   hover:text-dark-green transition duration-300 ease-in-out hover:scale-105"
        onClick={() => openOffCanvas(true)}
        disabled={pathname.includes("/cart")}
      >
        <BiCart size={36} />
      </button>
      <div
        className={`${
          stateOffCanvas ? "block" : "hidden"
        } z-10 fixed top-0  right-0  h-full bg-white drop-shadow-2xl p-4 w-[80dvw] sm:w-[50dvw] md:w-[35dvw] xl:w-[30dvw] max-w-[25rem]`}
      >
        <div className="flex justify-between items-center">
          <p className="text-2xl text-center p-2">
            <strong>Tu carro de compras</strong>
          </p>
          <button
            className="p-1 bg-blue rounded-md block hover:scale-105 transition duration-300 ease-in-out text-white hover:bg-dark-blue"
            onClick={() => openOffCanvas(false)}
          >
            <BiX size={30} />
          </button>
        </div>
        <div className="h-[75dvh] my-4 py-4 px-2 overflow-y-scroll space-y-3">
          {cart.length === 0 ? (
            <div className="flex justify-items-center">
              <p>No tienes productos a&ntilde;adidos al carrito de compras.</p>
            </div>
          ) : (
            cart.map((product) => (
              <CartProduct product={product} key={product.id} />
            ))
          )}
        </div>
        <Link
          onClick={() => openOffCanvas(false)}
          href="/cart"
          className="p-2 text-center font-bold text-white bg-green hover:bg-dark-green rounded-md  w-[80%] mt-8 mx-auto block hover:scale-105 transition duration-300 ease-in-out"
        >
          Ir al carrito
        </Link>
      </div>
    </>
  );
}
