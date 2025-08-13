import type { Product } from "@/types/product";
import ProductCard from "@/components/productCard";
import { numberFormat, getDiscount, wordBreaker } from "@/utils/textFormatters";
import { notFound } from "next/navigation";
import Link from "next/link";
interface Props {
  numberPage: number;
}
export default async function ProductsSection({ numberPage }: Props) {
  //Obtener datos
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products?_page=${numberPage}&_per_page=11`
  );
  if (!res.ok) notFound();
  const data = await res.json();
  //Productos
  const products: Product[] = data.data;

  return (
    <div className="lg:col-span-3 grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] lg:grid-cols-4 gap-4">
      {products.map((product, index) => {
        if (index >= 0 && index <= 2) {
          return (
            <Link
              href={`/products/${product.id}`}
              key={product.id}
              className={
                index == 0 ? "lg:col-span-2 lg:row-span-2" : "lg:col-span-2"
              }
            >
              <article className="py-4 px-8 bg-white shadow-xl rounded-2xl text-center h-full ">
                <div className="mt-2 grid grid-cols-[1fr_4em]">
                  <h2 className="text-balance text-2xl">{product.name}</h2>
                  {product.discount > 0 && (
                    <div>
                      <p className="bg-yellow-500 font-semibold  inline-block py-1 px-2 rounded-sm  opacity-75">{`- ${product.discount}%`}</p>
                    </div>
                  )}
                </div>
                <img
                  src={product.image}
                  width={index == 0 ? 370 : 200}
                  height={index == 0 ? 370 : 200}
                  alt={product.name}
                  className="mx-auto"
                  decoding="async"
                  loading="lazy"
                />
                {index == 0 && product.discount > 0 && (
                  <p className="text-left text-pretty hidden lg:block">
                    {`${wordBreaker(product.description, 40)}...`}
                  </p>
                )}
                <p className="my-4 h-10">
                  <span className="font-semibold">
                    {numberFormat(getDiscount(product.price, product.discount))}
                  </span>
                  {product.discount > 0 && (
                    <>
                      <br />
                      <span className="text-gray-600">
                        <small>
                          <s>{numberFormat(product.price)}</s>
                        </small>
                      </span>
                    </>
                  )}
                </p>
              </article>
            </Link>
          );
        }
        return (
          <Link href={`/products/${product.id}`} key={product.id}>
            <ProductCard data={product} />
          </Link>
        );
      })}
    </div>
  );
}
