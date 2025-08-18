"use client";
import { BiX } from "react-icons/bi";
import React from "react";

interface Props {
  state: boolean;
  children: React.ReactNode;
  onClose: () => void;
}

export default function Modal({ state, children, onClose }: Props) {
  if (!state) return null;

  return (
    <div className="fixed inset-0 bg-black/[var(--bg-opacity)] [--bg-opacity:50%] flex items-center justify-center z-20">
      <dialog
        open
        className="p-4 rounded bg-white shadow-lg w-max max-w-[50dvw] h-max max-h-[50dvh] mx-auto"
      >
        <button
          className="p-2 bg-dark-blue text-white font-bold rounded-md"
          onClick={onClose}
          aria-label="Cerrar modal"
        >
          <BiX size={25} />
        </button>
        <div>{children}</div>
      </dialog>
    </div>
  );
}
