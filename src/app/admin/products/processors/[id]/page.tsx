import { getProcessorById } from "@/services/processors";
import { notFound } from "next/navigation";
import ProcessorForm from "../components/ProcessorForm";

export default async function ProcessorUpdatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const processor = await getProcessorById(id);
  if (!processor) return notFound();
  return (
    <section>
      <h2 className="text-2xl font-bold">Editar procesador</h2>
      <ProcessorForm initialData={processor} />
    </section>
  );
}
