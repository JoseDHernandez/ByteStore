import { notFound } from "next/navigation";
import Paginator from "@/components/paginator";
import ProductsTable from "@/components/productsTable";
export default async function AdminPage({
  searchParams,
}: {
  searchParams?: { page?: number };
}) {
  const productsPerPage = 15;
  const params = await searchParams; //De gratis este await, Gracias next .i.
  const page = params?.page ?? 1;
  const numberPage = page > 0 && !isNaN(page) ? page : 1;
  //Obtener paginas
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products?_page=${numberPage}&_per_page=${productsPerPage}`
  );
  if (!res.ok) notFound();
  const data = await res.json();
  //Numero de páginas
  const totalPages = data.pages;
  return (
    <section>
      <h2>Panel de administración</h2>
      <ProductsTable
        numberPage={numberPage}
        productsPerPage={productsPerPage}
      />
      <Paginator size={3} currentPage={numberPage} totalPages={totalPages} />
    </section>
  );
}
