import React, { useEffect, useState } from "react";
import { BiX } from "react-icons/bi";

export interface AlertProps {
  id?: number;
  text: string;
  type: "success" | "error" | "warning" | "info";
  durationMs?: number;
  onClose?: (id?: number) => void;
}

export default function Alert({
  id,
  text,
  type,
  durationMs = 5000,
  onClose,
}: AlertProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => handleClose(), durationMs);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, durationMs]);

  if (!visible) return null;

  const typeMap: Record<AlertProps["type"], { border: string; hover: string }> =
    {
      success: {
        border: "border-dark-green",
        hover: "hover:bg-dark-green",
      },
      error: {
        border: "border-p-red",
        hover: "hover:bg-p-red",
      },
      warning: {
        border: "border-p-yellow",
        hover: "hover:bg-p-yellow",
      },
      info: {
        border: "border-dark-blue",
        hover: "hover:bg-dark-blue",
      },
    };

  const styles = typeMap[type] || typeMap.info;

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose(id);
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={`w-full bg-white ${styles.border} border-1 rounded-lg shadow-xl`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 text-sm leading-tight text-gray-800 p-2 break-words">
          {text}
        </div>
        <button
          title="Cerrar alerta"
          aria-label="Cerrar alerta"
          className={`ml-2 ${styles.hover} hover:text-white p-2 rounded-tr-lg rounded-br-lg transition duration-300 ease-in-out hover:scale-105`}
          onClick={handleClose}
        >
          <BiX size={20} />
        </button>
      </div>
    </div>
  );
}
