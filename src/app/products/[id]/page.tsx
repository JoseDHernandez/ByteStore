import { Product } from "@/types/product";
import { notFound } from "next/navigation";
import ProductPageInformation from "@/app/products/[id]/productPageInformation";
export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  //Obtener datos del producto
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`);
  if (!res.ok) notFound();
  const product: Product = await res.json();
  return (
    <main>
      <ProductPageInformation product={product} />
    </main>
  );
}
