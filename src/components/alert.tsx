import React, { useEffect, useState } from "react";
import { BiX } from "react-icons/bi";

interface Props {
  text: string;
  type: "success" | "error" | "warning" | "info";
  durationMs?: number;
}

export default function Alert({ text, type, durationMs = 5000 }: Props) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setVisible(false), durationMs);
    return () => clearTimeout(t);
  }, [visible, durationMs]);

  if (!visible) return null;

  const typeMap: Record<
    Props["type"],
    { bg: string; border: string; hover: string }
  > = {
    success: {
      bg: "green-50",
      border: "border-dark-green",
      hover: "bg-dark-green",
    },
    error: {
      bg: "red-50",
      border: "border-p-red",
      hover: "hover:bg-p-red",
    },
    warning: {
      bg: "yellow-50",
      border: "border-p-yellow",
      hover: "hover:bg-p-yellow",
    },
    info: {
      bg: "blue-50",
      border: "border-dark-blue",
      hover: "hover:bg-dark-blue",
    },
  };

  const styles = typeMap[type] || typeMap.info;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed z-50 bottom-6 right-6 max-w-xs ${styles.bg} ${styles.border} border-1 rounded-lg shadow-xl`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 text-sm leading-tight text-gray-800 p-2 break-words">
          {text}
        </div>
        <button
          title="Cerrar alerta"
          aria-label="Cerrar alerta"
          className={`ml-2 rounded-tr-lg rounded-br-lg ${styles.hover} hover:text-white p-2 transition duration-300 ease-in-out hover:scale-105`}
          onClick={() => setVisible(false)}
        >
          <BiX size={25} />
        </button>
      </div>
    </div>
  );
}
