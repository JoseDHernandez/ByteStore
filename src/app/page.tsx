import Link from "next/link";
import type { Product } from "@/types/product";
import {
  wordBreaker,
  numberFormat,
  getDiscount,
} from "../utils/textFormatters";
import CardProduct from "@/components/productCard";
export default async function Home() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products?_limit=15`
  );
  const products: Product[] = await res.json();
  return (
    <>
      <h1 className="text-center my-4 text-5xl">ByteShop</h1>
      <section className="grid  gap-9  grid-cols-1 md:grid-cols-2 lg:grid-rows-2 lg:grid-cols-4">
        <Link
          href={`/products/${products[0].id}`}
          className="md:col-span-2 lg:row-span-2"
        >
          <article className=" p-8  bg-white shadow-xl rounded-2xl  relative h-full">
            <div className="flex gap-5 justify-between">
              <p className="text-4xl text-center">
                <strong>{products[0].name}</strong>
              </p>
              {products[0].discount > 0 && (
                <span className="bg-yellow-400 font-semibold inline-block py-1 px-2 rounded-sm text-xl h-max">{`-${products[0].discount}%`}</span>
              )}
            </div>
            <img
              src={products[0].image}
              alt={products[0].name}
              width="400"
              className="row-start-2 mx-auto lx:row-start-3"
            />
            <div>
              <p> {`${wordBreaker(products[0].description, 17)}...`}</p>
              <br />
              <p>
                {products[0].discount == 0 ? (
                  <strong className="text-xl text-center">{`${numberFormat(
                    products[0].price
                  )}`}</strong>
                ) : (
                  <span className="text-center block">
                    <strong className="text-xl">
                      {numberFormat(
                        getDiscount(products[0].price, products[0].discount)
                      )}
                    </strong>{" "}
                    <br />
                    <s className="block my-4 lg:my-2">
                      <small>{`${numberFormat(products[0].price)}`}</small>
                    </s>
                  </span>
                )}
              </p>
            </div>
          </article>
        </Link>
        {products.slice(1, 3).map((product) => (
          <Link
            href={`/products/${product.id}`}
            key={product.id}
            className="lg:col-span-2"
          >
            <article className=" p-8 bg-white shadow-xl rounded-2xl relative">
              <p className="flex gap-5 justify-between">
                <strong className="text-2xl">{product.name}</strong>
                {product.discount > 0 && (
                  <span className="bg-yellow-400 font-semibold inline-block py-1 px-2 rounded-sm h-max">{`-${product.discount}%`}</span>
                )}
              </p>
              <img
                src={product.image}
                alt={product.name}
                width="200"
                className="mx-auto"
              />
              <div className="text-center">
                <strong>
                  {numberFormat(getDiscount(product.price, product.discount))}
                </strong>
              </div>
            </article>
          </Link>
        ))}
      </section>
      <section>
        <h2 className="my-8 text-4xl ml-8">Other products</h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))]  xl:grid-cols-6 gap-9">
          {products.slice(3).map((product) => (
            <Link key={product.id} href={`/products/${product.id}`}>
              <CardProduct data={product} />
            </Link>
          ))}
        </div>
        <div className="flex justify-center self-center">
          <Link
            href="/products/"
            className=" my-8 bg-amber-300 p-4 rounded-md inline-block font-bold "
          >
            Ver m&aacute;s productos
          </Link>
        </div>
      </section>
    </>
  );
}
