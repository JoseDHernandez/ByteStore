"use client";

import { z } from "zod";
import { OperatingSystemData } from "@/types/system";
import { systemSchema } from "@/schemas/systemSchema";
import { useState } from "react";
import Link from "next/link";
import { createOS, updateOS } from "@/services/systems";
import { useAlerts } from "@/context/altersContext";
type SystemFormData = z.infer<typeof systemSchema>;

interface Props {
  initData?: OperatingSystemData;
}

export default function SystemForm({ initData }: Props) {
  const { addAlert } = useAlerts();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data: SystemFormData = {
      system: formData.get("system") as string,
      distribution: formData.get("distribution") as string,
    };

    // Validar con Zod
    const result = systemSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          const field = err.path[0].toString();
          fieldErrors[field] = err.message;
        }
      });
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }
    //actualizar
    if (initData) {
      const res = await updateOS(initData.id, result.data);
      if (res === 200) {
        addAlert("Sistema operativo actualizado", "success");
        return setLoading(false);
      }
      addAlert("Sistema operativo no actualizado", "warning");
    } else {
      //crear
      const res = await createOS(result.data);
      if (res === 201) {
        addAlert("Sistema operativo registrado", "success");
        return setLoading(false);
      }
      addAlert("Sistema operativo no registrado", "warning");
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 bg-white p-6 rounded-lg shadow-md"
    >
      {/* Campo System */}
      <div>
        <label htmlFor="system" className="block font-medium mb-1">
          Sistema
        </label>
        <input
          id="system"
          name="system"
          type="text"
          minLength={3}
          maxLength={30}
          required
          defaultValue={initData?.system ?? ""}
          className={`border rounded-md p-2 w-full focus:outline-none focus:ring-2 ${
            errors.system
              ? "border-red-500 focus:ring-red-300"
              : "border-dark-gray "
          }`}
          placeholder="Ej: Linux, Windows, macOS"
        />
        {errors.system && (
          <p className="text-red-500 text-sm mt-1">{errors.system}</p>
        )}
      </div>

      {/* Campo Distribution */}
      <div>
        <label htmlFor="distribution" className="block font-medium mb-1">
          Distribución
        </label>
        <input
          id="distribution"
          name="distribution"
          type="text"
          minLength={3}
          maxLength={30}
          required
          defaultValue={initData?.distribution ?? ""}
          className={`border rounded-md p-2 w-full focus:outline-none focus:ring-2 ${
            errors.distribution
              ? "border-red-500 focus:ring-red-300"
              : "border-dark-gray "
          }`}
          placeholder="Ej: Ubuntu, Windows 11, Ventura"
        />
        {errors.distribution && (
          <p className="text-red-500 text-sm mt-1">{errors.distribution}</p>
        )}
      </div>

      {/* Botones */}
      <div className="flex justify-between gap-3 mt-4">
        <Link
          href="/admin/products/systems"
          className="bg-blue p-2 text-white rounded-md"
        >
          Volver
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="bg-green text-white p-2 rounded-md transition disabled:opacity-50"
        >
          {loading ? "Guardando..." : initData ? "Actualizar" : "Registrar"}
        </button>
      </div>
    </form>
  );
}
