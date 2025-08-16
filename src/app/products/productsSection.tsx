"use client";
import type { Product } from "@/types/product";
import ProductCard from "@/components/productCard";
import { numberFormat, getDiscount } from "@/utils/textFormatters";
import { notFound } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Score from "@/components/score";
export default function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const searchParams = useSearchParams();
  const numberPage = searchParams.get("page") ?? "1";
  const sort = searchParams.get("sort");
  const order = searchParams.get("order");
  const query = searchParams.get("query");

  useEffect(() => {
    const getProducts = async () => {
      try {
        //Búsqueda
        let q = "^";
        if (query && query.split(" ").length > 1) {
          query.split(" ").forEach((e) => {
            q += `(?=.*${e})`;
          });
        }
        //consulta
        const url =
          `${process.env.NEXT_PUBLIC_API_URL}/products?` +
          (query
            ? `&name_like=${query.split(" ").length > 1 ? q : query}`
            : "") +
          (numberPage ? `&_page=${numberPage}&_limit=11` : "") +
          (sort ? `&_sort=${sort}` : "") +
          (order ? `&_order=${order}` : "");
        const res = await fetch(url);
        if (!res.ok) notFound();

        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.log(error);
      }
    };

    getProducts();
  }, [numberPage, sort, order, query]);

  if (products !== null)
    return (
      <div className="lg:col-span-3 grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))]  lg:grid-cols-4 gap-4 w-full">
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
                <article
                  className={`py-4 px-2 lg:py-4 lg:px-8 bg-white shadow-xl rounded-2xl text-center h-full relative grid ${
                    index == 0 ? "lg:grid-cols-1" : "lg:grid-cols-2"
                  }`}
                >
                  <h2
                    className={`text-balance font-bold self-center ${
                      index == 0 ? "lg:text-3xl " : "lg:text-2xl "
                    }`}
                  >
                    {product.name}
                  </h2>
                  <img
                    src={product.image}
                    width={index == 0 ? 370 : 200}
                    height={index == 0 ? 370 : 200}
                    alt={product.name}
                    className="mx-auto object-contain lg:row-span-2 w-[200px] lg:w-full"
                    decoding="async"
                    loading="lazy"
                  />

                  <div
                    className={`flex justify-center flex-col ${
                      index == 0 && "lg:flex-col-reverse"
                    }`}
                  >
                    <Score qualification={4} className="mx-auto mb-4" />
                    <p className="h-10 flex items-center justify-center">
                      <span className="font-medium text-2xl font-(family-name:--font-barlow)">
                        {numberFormat(
                          getDiscount(product.price, product.discount)
                        )}
                      </span>
                      {product.discount > 0 && (
                        <span className="hidden lg:block">
                          <span
                            className={`bg-dark-blue text-white font-semibold  inline-block py-1 px-2 rounded-sm ml-4 ${
                              index > 0 && "lg:absolute top-4 right-4 ml-0"
                            }`}
                          >{`-${product.discount}%`}</span>
                        </span>
                      )}
                    </p>
                    <p>
                      <span
                        className={`text-gray-600 font-(family-name:--font-barlow) ${
                          index == 0 && "lg:hidden"
                        }`}
                      >
                        <s>{numberFormat(product.price)}</s>
                      </span>
                      {product.discount > 0 && (
                        <span
                          className={`ml-2 lg:hidden`}
                        >{`-${product.discount}%`}</span>
                      )}
                    </p>
                  </div>
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
