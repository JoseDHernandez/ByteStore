import Paginator from "@/components/paginator";
import { notFound } from "next/navigation";
import ProductsSection from "@/ui/productsPage/productsSection";
import { Suspense } from "react";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: { page?: number };
}) {
  const params = await searchParams; //De gratis este await, Gracias next .i.
  const page = params?.page ?? 1;
  const numberPage = page > 0 && !isNaN(page) ? page : 1;
  //Obtener paginas
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products?_page=${numberPage}&_per_page=11`
  );
  if (!res.ok) notFound();
  const data = await res.json();
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
        <Suspense>
          <ProductsSection numberPage={numberPage} />
        </Suspense>
      </div>
      <div>
        <Paginator currentPage={numberPage} totalPages={totalPages} size={3} />
      </div>
    </section>
  );
}
