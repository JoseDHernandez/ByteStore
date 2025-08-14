import { notFound } from "next/navigation";
import type { Product } from "@/types/product";
import ProductEditForm from "./productEditForm";
import Link from "next/link";
export default async function ProductUpdatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`);
  if (!res.ok) notFound();
  const product: Product = await res.json();
  return (
    <section>
      <div className="flex justify-between p-4 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold">Editar Producto</h2>
        <Link href="/admin" className="p-2 border-1">
          Cancelar
        </Link>
      </div>
      <ProductEditForm product={product} />
    </section>
  );
}
