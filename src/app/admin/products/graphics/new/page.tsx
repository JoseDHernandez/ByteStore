import { getAllDisplays } from "@/services/displays";
import DisplayForm from "../components/displayForm";
import { notFound } from "next/navigation";
export default async function DisplayCreatePage() {
  const displays = await getAllDisplays();
  if (!displays) return notFound();
  return (
    <section>
      <h2 className="text-2xl font-bold mb-2">Registrar nuevos gráficos</h2>
      <DisplayForm displays={displays} />
    </section>
  );
}
