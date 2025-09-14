import { notFound } from "next/navigation";
import {
  getProductBrands,
  getProductDisplays,
  getProductOS,
  getProductProcessors,
} from "@/services/products";
import ProductForm from "../components/ProductForm";
export default async function ProductCreatePage() {
  const productBrands = await getProductBrands();
  const productsDisplays = await getProductDisplays();
  const productProcessors = await getProductProcessors();
  const productsOS = await getProductOS();
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
