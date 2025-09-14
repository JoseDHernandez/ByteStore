import { notFound } from "next/navigation";
import { getAllBrands } from "@/services/brands";
import { getAllDisplays } from "@/services/displays";
import { getAllOS } from "@/services/systems";
import { getAllProcessors } from "@/services/processors";
import ProductForm from "../components/ProductForm";
export default async function ProductCreatePage() {
  const productBrands = await getAllBrands();
  const productsDisplays = await getAllDisplays();
  const productProcessors = await getAllProcessors();
  const productsOS = await getAllOS();
  if (!productBrands || !productsDisplays || !productProcessors || !productsOS)
    notFound();
  return (
    <section>
      <h2 className="text-2xl font-bold">Registrar nuevo producto</h2>
      <ProductForm
        productBrands={productBrands}
        productDisplays={productsDisplays}
        productProcessors={productProcessors}
        productOS={productsOS}
      />
    </section>
  );
}
