"use client";
import { BiX } from "react-icons/bi";
import React from "react";

interface Props {
  state: boolean;
  children: React.ReactNode;
  onClose: () => void;
  title: string;
}

export default function Modal({ state, children, onClose, title }: Props) {
  if (!state) return null;

  return (
    <div className="fixed inset-0 bg-black/[var(--bg-opacity)] [--bg-opacity:50%] flex items-center justify-center z-20">
      <dialog
        open
        className="p-4 rounded bg-white shadow-lg w-max max-w-[50dvw] h-max max-h-[50dvh] mx-auto min-h-max"
      >
        <div>
          <div className="flex justify-between ">
            <p className="font-bold text-2xl">{title}</p>
            <div>
              <button
                className="p-1 bg-p-red hover:bg-red-800 text-white font-bold rounded-md ml-6"
                onClick={onClose}
                aria-label="Cerrar modal"
              >
                <BiX size={25} />
              </button>
            </div>
          </div>
          <div className="pt-5 pb-2 px-4">{children}</div>
        </div>
      </dialog>
    </div>
  );
}
