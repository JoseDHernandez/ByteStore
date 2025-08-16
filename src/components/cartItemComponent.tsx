"use client";
import type { CartItem } from "@/types/cart";
import { numberFormat, getDiscount } from "@/utils/textFormatters";
import { BiMinus, BiPlus, BiTrashAlt } from "react-icons/bi";
import { useCart } from "@/context/cartcontext";
import { useState } from "react";
import { ProductsOrder } from "@/types/order";
interface Props {
  product: CartItem | ProductsOrder;
  className?: string;
}
export default function CartItemComponent({ product, className }: Props) {
  const { addToCart, removeFromCart } = useCart();
  const [quantity, setQuantity] = useState(product.quantity);

  const handleQuantityChange = (q: number) => {
    if ("stock" in product && q > 0 && q <= product.stock) {
      setQuantity(q);
      addToCart(product, q);
    }
  };

  return (
    <div
      className={`flex justify-center md:justify-between items-start border-y-1 border-dark-gray gap-x-4 p-4 ${
        className ? className : ""
      }`}
    >
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 items-center w-full">
          <div className="grid grid-cols-1 grid-rows-[96px_1fr] lg:grid-rows-1 lg:grid-cols-[96px_1fr] gap-5 h-full row-span-2 lg:row-span-1">
            <img
              src={product.image}
              alt={product.name}
              width={96}
              height={96}
              className="w-24 h-24 object-cover rounded mx-auto"
            />
            <div className="sm:text-center lg:text-left lg:flex lg:justify-between lg:flex-col lg:py-4">
              <p>
                <b>{product.name}</b>
              </p>
              <p>{`${product.brand} ${product.model}`}</p>
            </div>
          </div>
          <div className="border-y-1 sm:border-y-0 sm:border-x-1  py-4  sm:px-5 border-dark-gray h-full ">
            <p>
              Precio por unidad: <br />
              <span className="ml-4 block ">
                <span className="font-(family-name:--font-barlow) font-medium">
                  {numberFormat(getDiscount(product.price, product.discount))}
                </span>{" "}
                <br />
                <small className="hidden md:inline-block">
                  <span className="font-(family-name:--font-barlow) text-gray-600">
                    <s>{numberFormat(product.price)}</s>
                  </span>
                  <span className="ml-2">{`-${product.discount}%`}</span>
                </small>
              </span>
            </p>
          </div>
          <div className="sm:border-x-1  py-4  sm:px-5  lg:border-0 border-dark-gray h-full ">
            <p>
              Precio total: <br />
              <span className="ml-4 font-(family-name:--font-barlow) font-medium">
                {numberFormat(
                  getDiscount(product.price, product.discount) * quantity
                )}
              </span>
            </p>
            {"stock" in product && (
              <div className="ml-4 flex items-center">
                <button
                  className=""
                  onClick={() => handleQuantityChange(quantity - 1)}
                >
                  <BiMinus size={20} />
                </button>
                <p className="font-(family-name:--font-barlow) text-center w-7">
                  {quantity}
                </p>
                <button
                  className="text-green"
                  onClick={() => handleQuantityChange(quantity + 1)}
                >
                  <BiPlus size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {"stock" in product && (
        <button>
          <BiTrashAlt size={25} onClick={() => removeFromCart(product.id)} />
        </button>
      )}
    </div>
  );
}
