import type { Product } from "@/types/product";
import CardProduct from "@/components/cardProduct";
import Paginator from "@/components/paginator";
import { numberFormat, getDiscount, wordBreaker } from "@/utils/textFormatters";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: { page?: number };
}) {
  const params = await searchParams; //De gratis este await, Gracias next .i.
  const page = params?.page ?? 1;
  const numberPage = page > 0 && !isNaN(page) ? page : 1;
  //Obtener datos
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products?_page=${numberPage}&_per_page=11`
  );
  if (!res.ok) notFound();
  const data = await res.json();
  //Productos
  const products: Product[] = data.data;
  //Numero de páginas
  const totalPages = data.pages;

  return (
    <section>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <aside className="p-4 bg-white shadow-xl rounded-2xl h-full">
          <h2>Filtros</h2>
          <div>
            <label htmlFor="sort-price">Ordenar por precio</label>
            <select name="sort-price" id="sort-price">
              <option value="">Selecciona</option>
              <option value="">Menor a mayor</option>
              <option value="">Mayor a menor</option>
            </select>
          </div>
          <div>
            <p>Marca</p>
            <div>
              <input type="checkbox" name="brand" id="" />
              <label htmlFor="">Marca 1</label>
            </div>
            <div>
              <input type="checkbox" name="brand" id="" />
              <label htmlFor="">Marca 1</label>
            </div>
            <div>
              <input type="checkbox" name="brand" id="" />
              <label htmlFor="">Marca 1</label>
            </div>
            <div>
              <input type="checkbox" name="brand" id="" />
              <label htmlFor="">Marca 1</label>
            </div>
          </div>
          <button className="py-2 px-4 block mx-auto font-bold bg-yellow-400 rounded-md hover:scale-105 transition duration-300 ease-in-out">
            Filtrar
          </button>
        </aside>
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
                    <div className="mt-2 flex flex-wrap justify-between ">
                      <h2 className="text-balance text-2xl">{product.name}</h2>
                      {product.discount > 0 && (
                        <p className="bg-yellow-500 font-semibold  inline-block py-1 px-2 rounded-sm  opacity-75">{`- ${product.discount}%`}</p>
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
                        {numberFormat(
                          getDiscount(product.price, product.discount)
                        )}
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
                <CardProduct data={product} />
              </Link>
            );
          })}
        </div>
      </div>
      <div>
        <Paginator
          path="/products"
          currentPage={numberPage}
          totalPages={totalPages}
          size={3}
        />
      </div>
    </section>
  );
}
