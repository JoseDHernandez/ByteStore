import { getOSById } from "@/services/systems";
import { notFound } from "next/navigation";
import SystemForm from "../components/systemForm";

export default async function SystemUpdatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await getOSById(id);
  if (!res) return notFound();
  return (
    <section>
      <h2 className="text-2xl font-bold">Editar procesador</h2>
      <SystemForm initData={res} />
    </section>
  );
}
