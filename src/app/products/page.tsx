import Paginator from "@/components/paginator";
import ProductsFilter from "./components/productsFilter";
import type { Product } from "@/types/product";
import ProductCard from "@/components/productCard";
import { numberFormat, getDiscount } from "@/utils/textFormatters";
import Link from "next/link";
import Score from "@/components/score";
import { getProductsBySearch } from "@/services/products";
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    sort?: string;
    order?: string;
    query?: string;
  }>;
}) {
  const { page, sort, order, query } = (await searchParams) ?? {};
  const numberPage = page ? parseInt(page) : 1;
  //consulta
  const products: Product[] | null = await getProductsBySearch({
    query,
    numberPage,
    sort,
    order,
  });
  if (products === null)
    return (
      <section>
        <p>Error al obtener productos</p>
      </section>
    );
  return (
    <section>
      <div className="flex flex-col md:flex-row gap-4">
        <ProductsFilter />
        {products.length > 1 ? (
          <div className="lg:col-span-3 grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))]  lg:grid-cols-4 gap-4 w-full">
            {products.map((product, index) => {
              if (index >= 0 && index <= 2) {
                return (
                  <Link
                    href={`/products/${product.id}`}
                    key={product.id}
                    className={
                      index == 0
                        ? "lg:col-span-2 lg:row-span-2"
                        : "lg:col-span-2"
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
        ) : (
          <div>
            <p>
              No se encontraron productos para los términos:{" "}
              <b>{query?.split(" ").join(", ")}</b>
            </p>{" "}
            <br />
            <Link
              href="/products"
              className="bg-green text-white font-bold p-2 inline-block rounded-md"
            >
              Ver todos los productos
            </Link>
          </div>
        )}
      </div>
      <div>
        <Paginator size={3} currentPage={Number(numberPage)} />
      </div>
    </section>
  );
}
