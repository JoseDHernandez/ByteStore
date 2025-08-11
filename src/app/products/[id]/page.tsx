import { Product } from "@/types/product";
import { notFound } from "next/navigation";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`);

  console.log(res.status);
  return (
    <main>
      <section>
        <div>{id}</div>
      </section>
    </main>
  );
}
