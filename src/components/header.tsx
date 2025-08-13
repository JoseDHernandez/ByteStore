"use client";
import Link from "next/link";
import { BiLogOut } from "react-icons/bi";
import { useSession } from "next-auth/react";
import SearchBar from "./searchBar";
import { BiUser } from "react-icons/bi";
import Cart from "./cart";
import { signOut } from "next-auth/react";
export default function Header() {
  const { data: session } = useSession();
  const isLoggedIn = session?.user;
  const isAdmin = session?.user.role;
  return (
    <header>
      <div className="grid grid-cols-5 gap-5 py-2 px-20 ">
        <img
          src="https://placehold.co/60x60?text=logo"
          width={60}
          height={60}
          alt="logo"
        />
        <div className="col-span-3 h-max self-end">
          <SearchBar />
        </div>
        <div className="self-end flex gap-5">
          <Link href="/account" className="border-2 rounded-md p-1">
            <BiUser size={25} />
          </Link>
          <Cart />
          {isLoggedIn && (
            <button
              className="border-2 rounded-md p-1 flex items-center gap-3 font-bold"
              onClick={() => signOut()}
            >
              Salir <BiLogOut size={25} />
            </button>
          )}
        </div>
      </div>
      <nav>
        <ul className="list-none px-20 flex gap-10 mt-2">
          <li>
            <Link href="/">Inicio</Link>
          </li>
          <li>
            <Link href="/products">Productos</Link>
          </li>
          {!isLoggedIn && (
            <li>
              <Link href="/login">Ingreso</Link>
            </li>
          )}
          {isAdmin && (
            <li>
              <Link href="/admin">Administrar productos</Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
