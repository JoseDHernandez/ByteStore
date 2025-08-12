"use client";
import { CartItem } from "@/types/cartItem";
import { numberFormat, getDiscount } from "@/utils/textFormatters";
import { BiMinus, BiPlus } from "react-icons/bi";
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
    <div className="rounded-lg border border-gray-300 p-2">
      <div className="flex gap-2">
        <p className=" break-words">
          <b>{product.name}</b>
        </p>
        <div>
          <button
            className="p-1 border-red-500 border-1 rounded-md block hover:scale-105 transition duration-300 ease-in-out"
            onClick={() => removeFromCart(product.id)}
          >
            <BiCartDownload size={21} />
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        <img src={product.image} alt={product.name} width={90} loading="lazy" />
        <div>
          <p>
            <span>
              {numberFormat(
                getDiscount(product.price * quantity, product.discount)
              )}
            </span>
            {product.discount > 0 && (
              <>
                <br />
                <span className="py-1 px-2 bg-red-500 rounded-md text-white text-sm">
                  - {product.discount}%
                </span>
              </>
            )}
            <br />
            <span>
              <b>Unidades: </b>
              {quantity}
            </span>
          </p>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="flex items-center gap-2 mt-2 mx-auto">
          <button
            onClick={() => verifyQuantity(quantity - 1)}
            className="p-1 border-yellow-500 border-1 rounded-md block hover:scale-105 transition duration-300 ease-in-out"
          >
            <BiMinus />
          </button>

          <input
            type="number"
            value={quantity}
            min={1}
            max={product.stock}
            onChange={(e) => verifyQuantity(Number(e.target.value))}
            className="w-16 text-center border-gray-500 border-1 rounded-md"
          />

          <button
            onClick={() => verifyQuantity(quantity + 1)}
            className="p-1 border-yellow-500 border-1 rounded-md block hover:scale-105 transition duration-300 ease-in-out"
          >
            <BiPlus />
          </button>
        </div>
      </div>
    </div>
  );
}
