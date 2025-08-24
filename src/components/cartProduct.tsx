"use client";
import type { CartItem } from "@/types/cart";
import { numberFormat, getDiscount } from "@/utils/textFormatters";
import { BiMinus, BiPlus, BiShoppingBag, BiCartDownload } from "react-icons/bi";
import { useCart } from "@/context/cartcontext";
import { useState } from "react";
import Image from "next/image";

interface Props {
  product: CartItem;
}

export default function CartProduct({ product }: Props) {
  const { addToCart, removeFromCart } = useCart();
  const [quantity, setQuantity] = useState(product.quantity);
  const [announcement, setAnnouncement] = useState("");

  const verifyQuantity = (q: number) => {
    if (q > 0 && q <= product.stock) {
      setQuantity(q);
      addToCart(product, q);
      setAnnouncement(`Cantidad de ${product.name} actualizada a ${q}.`);
    }
  };

  const handleRemove = () => {
    removeFromCart(product.id);
    setAnnouncement(`${product.name} eliminado del carrito.`);
  };

  return (
    <div
      className="rounded-md border border-gray-300 p-2 relative"
      role="group"
      aria-label={`Producto en carrito: ${product.name}`}
    >
      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>

      <div className="flex gap-2 flex-col lg:flex-row">
        <Image
          src={product.image}
          alt={`Imagen del producto ${product.name}`}
          width={90}
          height={90}
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
                aria-label={`Eliminar ${product.name} del carrito de compras`}
                title="Eliminar producto"
                className="p-1 rounded-md lg:block hover:scale-105 transition duration-300 ease-in-out bg-white absolute top-2 right-2 hover:text-p-red"
                onClick={handleRemove}
              >
                <BiCartDownload
                  size={25}
                  aria-hidden="true"
                  focusable="false"
                />
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
                <BiShoppingBag size={16} aria-hidden="true" focusable="false" />
                <span aria-label={`Cantidad actual: ${quantity}`}>
                  {quantity}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2 justify-center mt-2 lg:mt-0">
              <button
                type="button"
                aria-label={`Disminuir la cantidad de ${product.name}`}
                title="Disminuir cantidad"
                onClick={() => verifyQuantity(quantity - 1)}
                className="p-1 text-dark-blue rounded-md block hover:scale-105 transition duration-300 ease-in-out hover:text-white hover:bg-dark-blue"
              >
                <BiMinus size={20} aria-hidden="true" focusable="false" />
              </button>

              <input
                type="number"
                value={quantity}
                min={1}
                max={product.stock}
                aria-label={`Cantidad para ${product.name}`}
                onChange={(e) => verifyQuantity(Number(e.target.value))}
                className="w-10 text-center border-dark-gray border-1 rounded-md"
              />

              <button
                type="button"
                aria-label={`Aumentar la cantidad de ${product.name}`}
                title="Aumentar cantidad"
                onClick={() => verifyQuantity(quantity + 1)}
                className="p-1 text-green rounded-md block hover:scale-105 transition duration-300 ease-in-out hover:text-white hover:bg-dark-green"
              >
                <BiPlus size={20} aria-hidden="true" focusable="false" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
