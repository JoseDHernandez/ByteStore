"use client";
import { useCart } from "@/context/cartcontext";
import Link from "next/link";
import { BiCart } from "react-icons/bi";
import { BiX } from "react-icons/bi";
import CartProduct from "./cartProduct";
export default function Cart() {
  const { stateOffCanvas, cart, openOffCanvas } = useCart();

  return (
    <>
      <button
        className="border-2 rounded-md p-1"
        onClick={() => openOffCanvas(true)}
      >
        <BiCart size={25} />
      </button>
      <div
        className={`${
          stateOffCanvas ? "block" : "hidden"
        } z-10 fixed top-0  right-0  h-full bg-white drop-shadow-2xl p-4 w-[25dvw]`}
      >
        <div className="flex justify-between">
          <p className="text-2xl text-center">
            <strong>Tu carrito</strong>
          </p>
          <button
            className="p-1 border-2 border-yellow-500 rounded-md block hover:scale-105 transition duration-300 ease-in-out"
            onClick={() => openOffCanvas(false)}
          >
            <BiX size={25} />
          </button>
        </div>
        <div className="h-[80dvh] my-4 py-4 px-2 overflow-y-scroll">
          {cart.length === 0 ? (
            <div className="flex justify-items-center ">
              <p>No tienes productos a&ntilde;adidos al carrito de compras.</p>
            </div>
          ) : (
            cart.map((product) => (
              <CartProduct product={product} key={product.id} />
            ))
          )}
        </div>
        <Link
          href="/mycart"
          className="p-2 text-center font-bold bg-yellow-500 rounded-md  w-[80%] my-4 mx-auto block hover:scale-105 transition duration-300 ease-in-out"
        >
          Ir a la p&aacute;gina del carrito
        </Link>
      </div>
    </>
  );
}
