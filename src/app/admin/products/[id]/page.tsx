import { notFound } from "next/navigation";
import { getProductById } from "@/services/products";
import { getAllBrands } from "@/services/brands";
import { getAllDisplays } from "@/services/displays";
import { getAllOS } from "@/services/systems";
import { getAllProcessors } from "@/services/processors";
import { getProductIdFromURL } from "@/utils/productURLFormatters";
import ProductForm from "../components/ProductForm";
export default async function ProductUpdatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = getProductIdFromURL(id);
  const r = /^[0-9]+$/;
  if (!productId.match(r)) return;
  const product = await getProductById(productId);
  const productBrands = await getAllBrands();
  const productsDisplays = await getAllDisplays();
  const productProcessors = await getAllProcessors();
  const productsOS = await getAllOS();
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
      <h2 className="text-2xl font-bold">Editar producto</h2>
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
