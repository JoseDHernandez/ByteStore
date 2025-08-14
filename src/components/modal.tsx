"use client";
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
        <button className="border-2 px-2 py-1 mb-2" onClick={onClose}>
          Cerrar
        </button>
        <div>{children}</div>
      </dialog>
    </div>
  );
}
