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
} from "react-icons/bi";

export default function AdminNavMenu() {
  const pathname = usePathname();
  //estilos por defecto
  const linkBase =
    "flex items-center gap-x-4 p-2 rounded-md hover:text-white transition duration-300 ease-in-out group";
  //clase condicional
  const getClass = (match: string, exact = false) => {
    //validar si es /admin o hijos
    const active = exact ? pathname === match : pathname.startsWith(match);
    return active ? "bg-blue text-white hover:bg-dark-blue" : "hover:bg-green";
  };

  return (
    <nav className="p-4 bg-white border border-gray shadow-xl rounded-2xl h-max w-full lg:w-[18rem]">
      <ul className="grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-1">
        <li>
          <Link
            href="/admin"
            className={`${getClass("/admin", true)} ${linkBase}`}
          >
            <BiCategory size={30} /> <span>Administración</span>
          </Link>
        </li>
        <li>
          <Link
            href="/admin/orders"
            className={`${getClass("/admin/orders")} ${linkBase}`}
          >
            <BiDish size={30} /> <span>Órdenes</span>
          </Link>
        </li>
        <li>
          <Link
            href="/admin/products"
            className={`${getClass("/admin/products")} ${linkBase}`}
          >
            <BiLaptop size={30} /> <span>Productos</span>
          </Link>
        </li>
        <li>
          <Link
            href="/admin/users"
            className={`${getClass("/admin/users")} ${linkBase}`}
          >
            <BiUser size={30} /> <span>Usuarios</span>
          </Link>
        </li>
        <li>
          <Link
            href="/admin/processors"
            className={`${getClass("/admin/processors")} ${linkBase}`}
          >
            <BiChip size={30} /> <span>Procesadores</span>
          </Link>
        </li>
        <li>
          <Link
            href="/admin/displays"
            className={`${getClass("/admin/displays")} ${linkBase}`}
          >
            <BiMicrochip size={30} /> <span>Pantallas</span>
          </Link>
        </li>
        <li>
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
