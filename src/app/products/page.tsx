import Paginator from "@/components/paginator";
import ProductsSection from "@/app/products/productsSection";
import { Suspense } from "react";
import ProductsFilter from "@/components/productsFilter";

export default async function ProductsPage() {
  return (
    <section>
      <div className="flex flex-col md:flex-row gap-4">
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
