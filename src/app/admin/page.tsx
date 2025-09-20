export default function AdminPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Administración</h1>
      <p className="text-gray-700">
        Esta es la página de administración. Desde aquí puedes acceder a la
        gestión de
        <span className="font-semibold"> productos</span> y sus categorías
        derivadas,
        <span className="font-semibold"> usuarios</span>,
        <span className="font-semibold"> órdenes</span> y
        <span className="font-semibold"> comentarios</span>.
      </p>
    </div>
  );
}
