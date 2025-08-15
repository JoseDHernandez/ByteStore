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
  //Obtener otros productos
  const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?_limit=5`);
  if (!res.ok || !r.ok) notFound();
  const product: Product = await res.json();
  const products: Product[] = await r.json();
  return (
    <main>
      <ProductPageInformation product={product} products={products} />
    </main>
  );
}
