"use client";
import { useCartItemContext } from "@/context/cartItemContext";
import { BiCartAdd } from "react-icons/bi";

export function AddCartButton() {
  const { addToCartEvent, product } = useCartItemContext();

  return (
    <button
      className="bg-dark-blue text-white sm:w-50 flex justify-center items-center gap-2 font-bold p-3 rounded-md hover:scale-105 transition duration-300 ease-in-out"
      onClick={addToCartEvent}
      disabled={product ? product.stock < 1 : false}
    >
      <BiCartAdd size={25} /> <div>Añadir al carro</div>
    </button>
  );
}
