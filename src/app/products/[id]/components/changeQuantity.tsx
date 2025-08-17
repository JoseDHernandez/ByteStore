"use client";
import { useCartItemContext } from "@/context/cartItemContext";

export function ChangeQuantity() {
  const { moreQuantity, verifyQuantity, product } = useCartItemContext();

  return (
    <div className="sm:my-4 lg:my-0">
      <label htmlFor="units-shop">Cantidad de unidades:</label>
      <br />
      {!moreQuantity ? (
        <select
          disabled={product.stock < 1}
          id="units-shop"
          className="p-2 my-2 ml-4 border-1 rounded-md w-[90%] lg:w-[60%] border-dark-gray h-10"
          onChange={(e) => verifyQuantity(parseInt(e.target.value))}
        >
          <option value="1">1 unidad</option>
          <option value="2">2 unidades</option>
          <option value="3">3 unidades</option>
          <option value="4">4 unidades</option>
          <option value="5">5 unidades</option>
          <option value="6">6 unidades</option>
          <option value="-1">Más unidades</option>
        </select>
      ) : (
        <input
          onChange={(e) => verifyQuantity(Number(e.currentTarget.value))}
          className="p-2 my-2 ml-4 border-1 rounded-md w-[90%] lg:w-[60%] border-gray-400 h-10"
          id="units-shop"
          placeholder="N° de unidades"
          size={3}
          type="number"
          min={1}
          max={product.stock}
          disabled={product.stock < 1}
        />
      )}
      <p className="ml-4">
        {product.stock < 1
          ? "Sin unidades disponibles"
          : `Unidades disponibles: ${product.stock}`}
      </p>
    </div>
  );
}
