"use client";
import { Product } from "@/types/product";
import { numberFormat, getDiscount } from "@/utils/textFormatters";
import { useCart } from "@/context/cartcontext";
import { BiCartAdd } from "react-icons/bi";
import { useState } from "react";
interface Props {
  product: Product;
}
export default function ProductPageInformation({ product }: Props) {
  const { addToCart, openOffCanvas } = useCart();
  const [quantity, setQuantity] = useState(0);
  const [moreQuantity, setMoreQuantity] = useState(false);
  //Calcular capacidad
  const capacity =
    product.disk_capacity > 999
      ? `${product.disk_capacity / 100} TB`
      : `${product.disk_capacity} GB`;
  const verifyQuantity = (q: number) => {
    if (q > 1 && q <= product.stock) setQuantity(q);
    else if (q <= 0) setMoreQuantity(true);
  };
  const addToCartEvent = () => {
    addToCart(product, quantity);
    product.stock = product.stock - quantity;
    setMoreQuantity(false);
    openOffCanvas(true);
  };
  return (
    <section>
      <div className="grid gap-2 lg:grid-cols-[1.5fr_2fr] lg:gap-8">
        <div className="text-balance text-center lg:flex lg:items-end">
          <h1 className="text-4xl font-bold">{product.name}</h1>
        </div>
        <img
          src={product.image}
          alt={product.name}
          width="700"
          className="lg:order-first col-span-1 row-span-2 w-[30em] sm:w-[22em]  mx-auto lg:w-full h-auto object-contain"
        />
        <div>
          <div className="h-10 bg-gray-200 my-2">rating</div>
          <div className="grid gap-5  lg:grid-cols-2 my-4">
            <div className="mx-auto lg:mx-0">
              <p>
                <strong className="text-2xl">
                  {numberFormat(getDiscount(product.price, product.discount))}
                </strong>{" "}
                &nbsp;
                <span className="bg-green-600 p-2 rounded-sm font-semibold text-white">{`- ${product.discount}%`}</span>
              </p>
              {product.discount > 0 && (
                <p className="text-gray-700">
                  <s>{numberFormat(product.price)}</s>
                </p>
              )}
            </div>
            <div className="my-4 lg:my-0">
              <label htmlFor="units-shop" className="text-xl">
                Cantidad de unidades:
              </label>
              <br />
              {!moreQuantity ? (
                <select
                  disabled={product.stock < 1}
                  id="units-shop"
                  className="p-2 my-2 ml-4 border-1 rounded-md w-[90%] lg:w-[60%] border-gray-400 h-10"
                  onChange={(e) => verifyQuantity(parseInt(e.target.value))}
                >
                  <option value="1">1 unidad</option>
                  <option value="2">2 unidades</option>
                  <option value="3">3 unidades</option>
                  <option value="4">4 unidades</option>
                  <option value="5">5 unidades</option>
                  <option value="6">6 unidades</option>
                  <option value="-1">M&aacute;s unidades</option>
                </select>
              ) : (
                <input
                  onChange={(e) =>
                    verifyQuantity(Number(e.currentTarget.value))
                  }
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
              <p className="ml-4 text-gray-700">
                {product.stock < 1
                  ? "Sin unidades disponibles"
                  : `Unidades disponibles: ${product.stock}`}
              </p>
            </div>
          </div>
          <div className="mx-auto lg:mx-0 mt-4 mb-8 lg:my-4 flex flex-wrap gap-5 justify-around lg:justify-normal">
            <button
              disabled={product.stock < 1}
              className="border-2 border-yellow-500 bg-yellow-500 font-bold p-3 rounded-md  hover:scale-105 transition duration-300 ease-in-out"
            >
              {product.stock < 1 ? "No disponible" : "Comprar"}
            </button>
            <button
              className="border-2 border-yellow-500 font-bold px-3 py-1 rounded-md hover:scale-105 transition duration-300 ease-in-out"
              onClick={() => addToCartEvent()}
              disabled={product.stock < 1}
            >
              <BiCartAdd size={30} />
            </button>
          </div>

          <p className="text-pretty py-2 px-2 lg:px-0 lg:pt-8 ">
            {product.description}
          </p>
        </div>
      </div>
      <div>
        <h2 className="text-3xl font-bold mt-3 mb-6">Caracter&iacute;sticas</h2>
        <div className="grid grid-cols-2 gap-2 my-4">
          <p>
            <b>Marca</b>
            <br />
            <span> {product.brand}</span>
          </p>
          <p>
            <b>Modelo</b>
            <br />
            {product.model}
          </p>
        </div>
        <h3 className="text-2xl font-bold mt-3  mb-4">
          Especificaciones t&eacute;cnicas
        </h3>
        <h4 className="text-xl font-bold mt-3  mb-4">
          Almacenamiento y procesamiento
        </h4>
        <div className="grid lg:grid-cols-2 gap-x-5 mt-4 mb-6">
          <p className="grid grid-cols-3 border-t-1 border-b-1 p-2 border-gray-400">
            <span className="block">
              <b>Marca</b>
            </span>
            <span className="block col-span-2">{product.processor.brand}</span>
          </p>
          <p className="grid grid-cols-3 lg:border-t-1 border-b-1 p-2 border-gray-400">
            <span className="block">
              <b>Serie</b>
            </span>
            <span className="block col-span-2">{product.processor.family}</span>
          </p>
          <p className="grid grid-cols-3 border-b-1 p-2 border-gray-400">
            <span className="block">
              <b>Modelo</b>
            </span>
            <span className="block col-span-2">{product.processor.model}</span>
          </p>
          <p className="grid grid-cols-3 border-b-1 p-2 border-gray-400">
            <span className="block">
              <b>N&uacute;mero de n&uacute;cleos</b>
            </span>
            <span className="block col-span-2">{product.processor.cores}</span>
          </p>
          <p className="grid grid-cols-3 border-b-1 p-2 border-gray-400">
            <span className="block">
              <b>Velocidad</b>
            </span>
            <span className="block col-span-2">{product.processor.speed}</span>
          </p>
          <p className="grid grid-cols-3 border-b-1 p-2 border-gray-400">
            <span className="block">
              <b>Cantidad de memoria RAM</b>
            </span>
            <span className="block col-span-2">{`${product.ram_memory} GB`}</span>
          </p>
          <p className="grid grid-cols-3 border-b-1 p-2 border-gray-400">
            <span className="block">
              <b>Almacenamiento</b>
            </span>
            <span className="block col-span-2">{capacity}</span>
          </p>
        </div>
        <h4 className="text-2xl font-bold mb-4">Pantalla</h4>
        <div className="grid lg:grid-cols-2 gap-x-5 mt-4 mb-6">
          <p className="grid grid-cols-3 border-t-1 border-b-1 p-2 border-gray-400">
            <span className="block">
              <b>Tama&ntilde;o</b>
            </span>
            <span className="block col-span-2">{product.display.size}</span>
          </p>
          <p className="grid grid-cols-3 lg:border-t-1 border-b-1 p-2 border-gray-400">
            <span className="block">
              <b>Resoluci&oacute;n</b>
            </span>
            <span className="block col-span-2">
              {product.display.resolution}
            </span>
          </p>
          <p className="grid grid-cols-3  border-b-1 p-2 border-gray-400">
            <span className="block">
              <b>Tarjeta de video</b>
            </span>
            <span className="block col-span-2">{product.display.graphics}</span>
          </p>
          {product.display.brand && (
            <p className="grid grid-cols-3  border-b-1 p-2 border-gray-400">
              <span className="block">
                <b>Marca</b>
              </span>
              <span className="block col-span-2">{product.display.brand}</span>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
