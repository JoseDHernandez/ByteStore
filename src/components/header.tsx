"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import SearchBar from "./searchBar";
import { BiUser } from "react-icons/bi";
import Cart from "./cart";
import { signOut } from "next-auth/react";
import { useCart } from "@/context/cartcontext";
export default function Header() {
  const { signOutCart } = useCart();
  const { data: session } = useSession();
  const isLoggedIn = session?.user;
  const isAdmin = session?.user.role;
  const handleSingOut = () => {
    signOutCart();
    signOut();
  };
  return (
    <header className="py-4 mx-auto w-[80dvw] md:max-w-[70dvw]">
      <div className="grid grid-cols-5 gap-10 h-10 items-center mb-4">
        <p className="font-bold hidden md:block text-lg xl:text-2xl">
          Byte store
        </p>
        <div className="col-span-3">
          <SearchBar />
        </div>
        <div className="flex gap-10 h-full items-center">
          {isLoggedIn ? (
            <button
              className="rounded-md  flex items-center"
              onClick={() => handleSingOut()}
            >
              <BiUser size={36} className="block" />{" "}
              <div className="h-9">
                <div className="text-[12px] hidden 2xl:block">Salir de la</div>
                <div className="2xl:relative 2xl:top-[-5px] font-medium hidden md:block">
                  Cuenta
                </div>
              </div>
            </button>
          ) : (
            <Link href="/account" className="rounded-md  flex items-center">
              <BiUser size={36} className="block" />{" "}
              <div className="h-full">
                <div className="text-[0.62em] hidden 2xl:block">
                  Ingresar a la
                </div>
                <div className="2xl:relative 2xl:top-[-5px] font-medium hidden md:block">
                  Cuenta
                </div>
              </div>
            </Link>
          )}
          <Cart />
        </div>
      </div>
      <nav>
        <ul className="list-none flex flex-wrap lg:flex-nowrap gap-x-10 mt-4 font-bold">
          <li>
            <Link href="/">Inicio</Link>
          </li>
          <li>
            <Link href="/products">Productos</Link>
          </li>
          {!isLoggedIn ? (
            <>
              <li>
                <Link href="/login">Ingreso</Link>
              </li>
              <li>
                <Link href="/register">Registro</Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/orders">Ordenes</Link>
              </li>
              <li>
                <Link href="/cart">Carro</Link>
              </li>
              <li>
                <Link href="/account">Cuenta</Link>
              </li>
            </>
          )}
          {isAdmin ? (
            <li>
              <Link href="/admin">Administrar</Link>
            </li>
          ) : (
            ""
          )}
        </ul>
      </nav>
    </header>
  );
}
