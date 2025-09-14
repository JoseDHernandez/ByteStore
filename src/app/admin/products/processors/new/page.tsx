import ProcessorForm from "../components/ProcessorForm";
export default async function ProcessorCreatePage() {
  return (
    <section>
      <h2 className="text-2xl font-bold">Crear procesador</h2>
      <ProcessorForm />
    </section>
  );
}
