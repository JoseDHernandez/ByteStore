import Link from "next/link";
import type { Product } from "@/types/product";
import {
  wordBreaker,
  numberFormat,
  getDiscount,
} from "../utils/textFormatters";
import CardProduct from "@/components/productCard";
import { notFound } from "next/navigation";
export default async function Home() {
  let products: Product[] = [];
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products?_limit=15`
    );
    if (!res.ok) notFound();
    products = await res.json();
  } catch (error) {
    return notFound();
  }
  if (products.length === 0)
    return (
      <>
        <h1 className="text-center text-5xl font-bold">ByteShop</h1>
        <p>Conexión perdida.</p>
      </>
    );
  return (
    <>
      <h1 className="text-center  text-5xl font-bold">ByteShop</h1>
      <section className="grid mt-8  gap-9  grid-cols-1 md:grid-cols-2 lg:grid-rows-2 lg:grid-cols-4">
        <Link
          href={`/products/${products[0].id}`}
          className="md:col-span-2 lg:row-span-2"
        >
          <article className=" p-4 bg-white shadow-xl rounded-2xl h-full">
            <p className="text-3xl text-center font-bold">
              <strong>{products[0].name}</strong>
            </p>
            <img
              src={products[0].image}
              alt={products[0].name}
              width="250"
              className="object-contain mx-auto"
            />
            <div className="px-5 space-y-4">
              <div className="flex gap-8 items-center justify-center">
                <p className="font-medium text-2xl">
                  {numberFormat(
                    getDiscount(products[0].price, products[0].discount)
                  )}
                </p>
                {products[0].discount > 0 && (
                  <div className="bg-dark-blue text-white font-semibold inline-block py-1 px-2 rounded-sm  h-max">{`-${products[0].discount}%`}</div>
                )}
              </div>
              <p> {`${wordBreaker(products[0].description, 35)}...`}</p>
            </div>
          </article>
        </Link>
        {products.slice(1, 3).map((product) => (
          <Link
            href={`/products/${product.id}`}
            key={product.id}
            className="lg:col-span-2"
          >
            <article className="px-8 py-5 bg-white shadow-xl rounded-2xl relative grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
              <img
                src={product.image}
                alt={product.name}
                width="200"
                className="mx-auto row-span-3 object-contain self-center"
              />
              <p className="col-span-2 lg:w-[80%] text-center lg:text-left order-first md:order-none">
                <strong className="text-2xl">{product.name}</strong>
              </p>
              <p className="col-span-2 order-last lg:order-none">
                {wordBreaker(product.description, 20)}
              </p>
              {product.discount > 0 && (
                <span className="bg-dark-blue text-white font-semibold inline-block py-1 px-2 rounded-sm h-max absolute top-4 right-4">{`-${product.discount}%`}</span>
              )}
              <div className="flex gap-4 justify-between col-span-2 flex-col-reverse flex-wrap lg:flex-row">
                <button className="bg-green text-white font-bold rounded-md py-2 px-4 hidden lg:inline-block">
                  Ver en detalle
                </button>
                <div className="text-center lg:text-left">
                  <strong>
                    {numberFormat(getDiscount(product.price, product.discount))}
                  </strong>{" "}
                  <br />
                  <small>
                    <s>{numberFormat(product.price)}</s>
                  </small>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </section>
      <section>
        <h2 className="my-8 text-3xl font-bold">M&aacute;s productos</h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))]  gap-5">
          {products.slice(3).map((product) => (
            <Link key={product.id} href={`/products/${product.id}`}>
              <CardProduct data={product} />
            </Link>
          ))}
        </div>
        <div className="flex justify-center self-center">
          <Link
            href="/products/"
            className=" my-8 bg-green text-white p-4 rounded-md inline-block font-bold hover:scale-105 transition duration-300 ease-in-out"
          >
            Ver m&aacute;s productos
          </Link>
        </div>
      </section>
    </>
  );
}
