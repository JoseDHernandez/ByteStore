"use client";
import type { CartItem } from "@/types/cart";
import { numberFormat, getDiscount } from "@/utils/textFormatters";
import { BiMinus, BiPlus, BiShoppingBag } from "react-icons/bi";
import { BiCartDownload } from "react-icons/bi";
import { useCart } from "@/context/cartcontext";
import { useState } from "react";

interface Props {
  product: CartItem;
}
export default function CartProduct({ product }: Props) {
  const { addToCart, removeFromCart } = useCart();
  const [quantity, setQuantity] = useState(product.quantity);

  const verifyQuantity = (q: number) => {
    if (q > 0 && q <= product.stock) {
      setQuantity(q);
      addToCart(product, q);
    }
  };

  return (
    <div className="rounded-md border border-gray-300 p-2 relative">
      <div className="flex gap-2 flex-col lg:flex-row">
        <img
          src={product.image}
          alt={product.name}
          width={90}
          loading="lazy"
          decoding="async"
          className="mx-auto object-contain"
        />
        <div className="w-full">
          <div className="flex gap-4 justify-center lg:justify-between ">
            <p className="break-words">
              <b>{product.name}</b>
            </p>
            <div className="w-7">
              <button
                className="p-1 rounded-md lg:block hover:scale-105 transition duration-300 ease-in-out bg-white absolute top-2 right-2 hover:bg-dark-blue hover:text-white"
                onClick={() => removeFromCart(product.id)}
              >
                <BiCartDownload size={25} />
              </button>
            </div>
          </div>
          <div className="flex w-full justify-between flex-wrap flex-col lg:flex-row mt-2 lg:mt-0 ">
            <div className="flex justify-center gap-4 lg:block">
              <p className="font-medium">
                {numberFormat(
                  getDiscount(product.price * quantity, product.discount)
                )}
              </p>
              <p className="flex items-center gap-1">
                <BiShoppingBag size={16} />
                {quantity}
              </p>
            </div>
            <div className="flex items-center gap-2 justify-center mt-2 lg:mt-0">
              <button
                onClick={() => verifyQuantity(quantity - 1)}
                className="p-1 text-green rounded-md block hover:scale-105 transition duration-300 ease-in-out hover:text-white hover:bg-green"
              >
                <BiMinus size={20} />
              </button>

              <input
                type="number"
                value={quantity}
                min={1}
                max={product.stock}
                onChange={(e) => verifyQuantity(Number(e.target.value))}
                className="w-10 text-center border-dark-gray border-1 rounded-md"
              />

              <button
                onClick={() => verifyQuantity(quantity + 1)}
                className="p-1  rounded-md block hover:scale-105 transition duration-300 ease-in-out hover:text-white hover:bg-dark-blue"
              >
                <BiPlus size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
