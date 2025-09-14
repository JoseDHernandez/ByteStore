import { getProcessorById } from "@/services/products";
import { notFound } from "next/navigation";
import ProcessorForm from "../components/ProcessorForm";

export default async function ProcessorUpdatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const processor = await getProcessorById(Number(id));
  if (!processor) return notFound();
  return (
    <section>
      <h2 className="text-2xl font-bold">Editar procesador</h2>
      <ProcessorForm initialData={processor} />
    </section>
  );
}
