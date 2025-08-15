import Paginator from "@/components/paginator";
import { notFound } from "next/navigation";
import ProductsSection from "@/app/products/productsSection";
import { Suspense } from "react";
import ProductsFilter from "@/components/productsFilter";

export default async function ProductsPage() {
  //Obtener paginas
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products?_page=1&_limit=11`
  );
  if (!res.ok) notFound();
  const data = await res.json();
  //Numero de páginas
  const totalPages = data.pages;

  return (
    <section>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <ProductsFilter />
        <Suspense>
          <ProductsSection />
        </Suspense>
      </div>
      <div>
        <Paginator size={3} />
      </div>
    </section>
  );
}
