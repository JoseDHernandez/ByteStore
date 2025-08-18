"use client";
import { useCart } from "@/context/cartcontext";
import { signOut } from "next-auth/react";
import { BiUser } from "react-icons/bi";
export default function SingOutButton() {
  const { clearCart } = useCart();
  const handleSingOut = () => {
    clearCart();
    signOut();
  };
  return (
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
  );
}
