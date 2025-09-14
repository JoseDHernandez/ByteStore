"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BiCategory,
  BiChip,
  BiDish,
  BiCommentDetail,
  BiLaptop,
  BiUser,
  BiMicrochip,
  BiDisc,
  BiPurchaseTagAlt,
} from "react-icons/bi";

export default function AdminNavMenu() {
  const pathname = usePathname();

  //estilos base
  const linkBase =
    "flex items-center gap-x-4 p-2 rounded-md hover:text-white transition duration-300 ease-in-out group";

  //función para clases condicionales
  const getClass = (match: string, exact = false) => {
    const active = exact ? pathname === match : pathname.startsWith(match);
    return active ? "bg-blue text-white hover:bg-dark-blue" : "hover:bg-green";
  };

  return (
    <nav className="p-4 bg-white border border-gray shadow-xl rounded-2xl h-max w-full lg:w-[18rem]">
      <ul className="grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-1">
        <li className="order-1">
          <Link
            href="/admin"
            className={`${getClass("/admin", true)} ${linkBase}`}
          >
            <BiCategory size={30} /> <span>Administración</span>
          </Link>
        </li>

        <li className="order-2">
          <Link
            href="/admin/orders"
            className={`${getClass("/admin/orders")} ${linkBase}`}
          >
            <BiDish size={30} /> <span>Órdenes</span>
          </Link>
        </li>
        <li className="order-3 md:order-4 lg:order-3 col-span-2 md:col-span-3 lg:col-span-1">
          <Link
            href="/admin/products"
            className={`${getClass("/admin/products", true)} ${linkBase}`}
          >
            <BiLaptop size={30} /> <span>Productos</span>
          </Link>
          <ul className="ml-10 mt-2 grid gap-2 grid-cols-2 lg:grid-cols-1">
            <li>
              <Link
                href="/admin/products/processors"
                className={`${getClass(
                  "/admin/products/processors"
                )} ${linkBase} text-sm `}
              >
                <BiChip size={25} /> <span>Procesadores</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/products/graphics"
                className={`${getClass(
                  "/admin/products/graphics"
                )} ${linkBase} text-sm`}
              >
                <BiMicrochip size={25} /> <span>Gráficos</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/products/brands"
                className={`${getClass(
                  "/admin/products/brands"
                )} ${linkBase} text-sm`}
              >
                <BiPurchaseTagAlt size={25} /> <span>Marcas</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/products/systems"
                className={`${getClass(
                  "/admin/products/systems"
                )} ${linkBase} text-sm`}
              >
                <BiDisc size={25} /> <span>Sistemas operativos</span>
              </Link>
            </li>
          </ul>
        </li>

        <li className="order-4 md:order-3 lg:order-4">
          <Link
            href="/admin/users"
            className={`${getClass("/admin/users")} ${linkBase}`}
          >
            <BiUser size={30} /> <span>Usuarios</span>
          </Link>
        </li>
        <li className="order-5">
          <Link
            href="/admin/comments"
            className={`${getClass("/admin/comments")} ${linkBase}`}
          >
            <BiCommentDetail size={30} /> <span>Comentarios</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
