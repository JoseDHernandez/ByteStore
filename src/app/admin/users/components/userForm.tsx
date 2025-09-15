"use client";

import { useState } from "react";
import { z } from "zod";
import { registerSchema, updateAccountSchema } from "@/schemas/usersSchemas";
import type { UserDataItem, UserRegister, UserUpdate } from "@/types/user";
import { useAlerts } from "@/context/altersContext";
import { createUser, updateUser } from "@/services/users"; // 👈 ajusta la ruta según tu proyecto
import Link from "next/link";

type Props = {
  initData?: UserDataItem;
};

export default function UserForm({ initData }: Props) {
  const { addAlert } = useAlerts();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const data: UserRegister | UserUpdate = initData
      ? {
          name: formData.get("name") as string,
          email: formData.get("email") as string,
          physical_address: formData.get("physical_address") as string,
        }
      : {
          name: formData.get("name") as string,
          email: formData.get("email") as string,
          physical_address: formData.get("physical_address") as string,
          password: formData.get("password") as string,
        };

    // validar con Zod
    const schema = initData ? updateAccountSchema : registerSchema;
    const result = (schema as z.ZodSchema<typeof data>).safeParse(data);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }

    let res: number;
    if (initData) {
      // actualizar
      res = await updateUser(initData.id, result.data as UserUpdate);
      if (res === 200) {
        addAlert("Usuario actualizado", "success");
      } else {
        addAlert("No se pudo actualizar", "error");
      }
    } else {
      // crear
      res = await createUser(result.data as UserRegister);
      if (res === 201) {
        addAlert("Usuario registrado", "success");
      } else {
        addAlert("No se pudo registrar", "error");
      }
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4  p-6 ">
      {/* Nombre */}
      <div>
        <label htmlFor="name" className="block font-medium mb-1">
          Nombre
        </label>
        <input
          id="name"
          name="name"
          type="text"
          defaultValue={initData?.name ?? ""}
          className={`border rounded-md p-2 w-full ${
            errors.name ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block font-medium mb-1">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          defaultValue={initData?.email ?? ""}
          className={`border rounded-md p-2 w-full ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      {/* Dirección */}
      <div>
        <label htmlFor="physical_address" className="block font-medium mb-1">
          Dirección
        </label>
        <input
          id="physical_address"
          name="physical_address"
          type="text"
          defaultValue={initData?.physical_address ?? ""}
          className={`border rounded-md p-2 w-full ${
            errors.physical_address ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.physical_address && (
          <p className="text-red-500 text-sm mt-1">{errors.physical_address}</p>
        )}
      </div>

      {/* Password (solo en registro) */}
      {!initData && (
        <div>
          <label htmlFor="password" className="block font-medium mb-1">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className={`border rounded-md p-2 w-full ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>
      )}

      {/* Botones */}
      <div className="flex justify-between gap-3 mt-4">
        <Link href="/admin/users" className="bg-blue p-2 text-white rounded-md">
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
