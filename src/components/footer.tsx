import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-white container mx-auto max-w-[100rem] px-[5dvw]">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        <div className="sm:col-span-2 md:col-span-1">
          <h2 className="text-2xl font-bold text-green">Byte Store</h2>
          <p className="text-sm text-gray-500 mt-2">Tú tienda de confianza.</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
            Navegación
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link
                href="/"
                className="hover:text-dark-green transition duration-300 ease-it-out"
              >
                Inicio
              </Link>
            </li>
            <li>
              <Link
                href="/products"
                className="hover:text-dark-green transition duration-300 ease-it-out"
              >
                Productos
              </Link>
            </li>
            <li>
              <Link
                href="/orders"
                className="hover:text-dark-green transition duration-300 ease-it-out"
              >
                Órdenes
              </Link>
            </li>
            <li>
              <Link
                href="/cart"
                className="hover:text-dark-green transition duration-300 ease-it-out"
              >
                Carro
              </Link>
            </li>
            <li>
              <Link
                href="/account"
                className="hover:text-dark-green transition duration-300 ease-it-out"
              >
                Cuenta
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
            Información
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link
                href="https://github.com/JoseDHernandez/ByteStore"
                className="hover:text-dark-green transition duration-300 ease-it-out"
              >
                Sobre el proyecto
              </Link>
            </li>
            <li>
              <a
                href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-dark-green transition duration-300 ease-it-out"
              >
                Licencia CC BY-NC-SA 4.0
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-200 text-center py-4 text-sm text-gray-500">
        © 2025{" "}
        <a href="https://josedhernandez.com" target="_blank">
          José David Hernández Hortúa.
        </a>
      </div>
    </footer>
  );
}
