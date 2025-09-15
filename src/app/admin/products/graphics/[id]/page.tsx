import { getAllDisplays, getDisplayById } from "@/services/displays";
import DisplayForm from "../components/displayForm";
import { notFound } from "next/navigation";

export default async function UpdateDisplayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await getDisplayById(id);
  if (!res) return notFound();
  const displays = await getAllDisplays();
  if (!displays) return notFound();
  return (
    <section>
      <h2 className="text-2xl font-bold mb-2">Actualizar gráficos</h2>
      <DisplayForm initData={res} displays={displays} />
    </section>
  );
}
