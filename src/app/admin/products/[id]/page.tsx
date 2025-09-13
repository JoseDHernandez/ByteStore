import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getProductBrands,
  getProductById,
  getProductDisplays,
  getProductOS,
  getProductProcessors,
} from "@/services/products";
import { getProductIdFromURL } from "@/utils/productURLFormatters";
import ProductForm from "./components/ProductForm";
export default async function ProductUpdatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(getProductIdFromURL(id));
  const productBrands = await getProductBrands();
  const productsDisplays = await getProductDisplays();
  const productProcessors = await getProductProcessors();
  const productsOS = await getProductOS();
  if (
    !product ||
    !productBrands ||
    !productsDisplays ||
    !productProcessors ||
    !productsOS
  )
    notFound();
  return (
    <section>
      <h2 className="text-2xl font-bold">Editar Producto</h2>
      <ProductForm
        product={product}
        productBrands={productBrands}
        productDisplays={productsDisplays}
        productProcessors={productProcessors}
        productOS={productsOS}
      />
    </section>
  );
}
