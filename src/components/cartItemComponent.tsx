"use client";
import type { CartItem } from "@/types/cart";
import { numberFormat, getDiscount } from "@/utils/textFormatters";
import { BiMinus, BiPlus, BiTrashAlt } from "react-icons/bi";
import { useCart } from "@/context/cartcontext";
import { useState } from "react";
interface Props {
  product: CartItem;
}
export default function CartItemComponent({ product }: Props) {
  const { addToCart, removeFromCart } = useCart();
  const [quantity, setQuantity] = useState(product.quantity);

  const handleQuantityChange = (q: number) => {
    if (q > 0 && q <= product.stock) {
      setQuantity(q);
      addToCart(product, q);
    }
  };

  const handleRemove = () => {
    removeFromCart(product.id);
  };

  const discountedPrice = getDiscount(product.price, product.discount);

  return (
    <div className="flex items-center gap-4 border-b py-4">
      <img
        src={product.image}
        alt={product.name}
        className="w-24 h-24 object-cover rounded"
      />
      <div className="flex-1">
        <h3 className="font-bold">{product.name}</h3>
        <p className="text-sm text-gray-600">
          {product.brand} {product.model}
        </p>
        <p className="text-sm">
          {product.discount > 0 && (
            <span className="line-through text-gray-400 mr-2">
              {numberFormat(product.price)}
            </span>
          )}
          <span className="font-semibold">{numberFormat(discountedPrice)}</span>
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="p-1 border rounded hover:bg-gray-200"
          onClick={() => handleQuantityChange(quantity - 1)}
        >
          <BiMinus size={20} />
        </button>
        <span className="w-6 text-center">{quantity}</span>
        <button
          className="p-1 border rounded hover:bg-gray-200"
          onClick={() => handleQuantityChange(quantity + 1)}
        >
          <BiPlus size={20} />
        </button>
      </div>

      <div className="ml-4 font-semibold">
        {numberFormat(discountedPrice * quantity)}
      </div>

      <button
        className="ml-4 text-red-500 hover:text-red-700"
        onClick={handleRemove}
      >
        <BiTrashAlt size={24} />
      </button>
    </div>
  );
}
