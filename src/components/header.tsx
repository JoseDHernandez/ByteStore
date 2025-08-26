"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import SearchBar from "./searchBar";
import { BiLogOut, BiLogIn } from "react-icons/bi";
import Cart from "./cart";
import { signOut } from "next-auth/react";
import { useCart } from "@/context/cartcontext";
export default function Header() {
  //Validar session
  const { data: session } = useSession();
  const isLoggedIn = session?.user;
  const isAdmin = session?.user.role;
  //Cerrar session y limpiar carrito al salir
  const { signOutCart } = useCart();
  const handleSingOut = () => {
    signOutCart();
    signOut();
  };
  return (
    <header className="py-4 mx-auto w-[80dvw] 2xl:max-w-[70dvw]">
      <div className="grid grid-cols-3 md:grid-cols-5 gap-4 xl:gap-10 h-10 items-center mb-4">
        <p className="font-bold hidden md:block text-lg xl:text-2xl text-green">
          Byte store
        </p>
        <div className="col-span-2 md:col-span-3">
          <SearchBar />
        </div>
        <div className="flex gap-4 h-full items-center justify-end lg:justify-normal">
          {isLoggedIn ? (
            <button
              className="rounded-md  flex items-center py-1 px-2 group transition duration-300 ease-in-out hover:scale-105"
              onClick={() => handleSingOut()}
            >
              <BiLogOut
                size={36}
                className="block group-hover:text-dark-blue"
              />{" "}
              <div className="h-9 lg:w-19 ml-1">
                <div className="text-[12px] hidden lg:block">Salir de la</div>
                <div className="lg:relative lg:top-[-5px] font-medium hidden lg:block">
                  Cuenta
                </div>
              </div>
            </button>
          ) : (
            <Link
              href="/account"
              className="rounded-md  flex items-center py-1 px-2 group transition duration-300 ease-in-out hover:scale-105"
            >
              <BiLogIn
                size={36}
                className="block group-hover:text-dark-green"
              />{" "}
              <div className="h-9 lg:w-19 ml-1 ">
                <div className="text-[12px] hidden 2xl:block">
                  Ingresar a la
                </div>
                <div className="lg:relative lg:top-[-5px] font-medium hidden lg:block">
                  Cuenta
                </div>
              </div>
            </Link>
          )}
          <Cart />
        </div>
      </div>
      <nav>
        <ul className="list-none flex flex-wrap lg:flex-nowrap gap-x-10 gap-y-2 mt-4 font-bold justify-center sm:justify-normal">
          <li className="transition duration-300 ease-in-out hover:text-green">
            <Link href="/">Inicio</Link>
          </li>
          <li className="transition duration-300 ease-in-out hover:text-green">
            <Link href="/products">Productos</Link>
          </li>
          {!isLoggedIn ? (
            <>
              <li className="transition duration-300 ease-in-out hover:text-green">
                <Link href="/login">Ingreso</Link>
              </li>
              <li className="transition duration-300 ease-in-out hover:text-green">
                <Link href="/register">Registro</Link>
              </li>
            </>
          ) : (
            <>
              <li className="transition duration-300 ease-in-out hover:text-green">
                <Link href="/orders">Ordenes</Link>
              </li>
              <li className="transition duration-300 ease-in-out hover:text-green">
                <Link href="/cart">Carro</Link>
              </li>
              <li className="transition duration-300 ease-in-out hover:text-green">
                <Link href="/account">Cuenta</Link>
              </li>
            </>
          )}
          {isAdmin ? (
            <li className="transition duration-300 ease-in-out hover:text-green">
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
