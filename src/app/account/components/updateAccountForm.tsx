"use client";

import { useState } from "react";
import type { UserDataItem } from "@/types/user";
import { updateAccountSchema } from "@/schemas/usersSchemas";
import { useAlerts } from "@/context/altersContext";
import { updateUser } from "@/services/users";

type Props = {
  initData?: UserDataItem;
};

export default function UserAccountForm({ initData }: Props) {
  const { addAlert } = useAlerts();
  const [formData, setFormData] = useState<Omit<UserDataItem, "id" | "role">>({
    name: initData?.name ?? "",
    email: initData?.email ?? "",
    physical_address: initData?.physical_address ?? "",
  });

  const update = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = updateAccountSchema.safeParse(formData);
    if (!validation.success || !initData) {
      addAlert("Datos de actualización inválidos", "warning");
      return;
    }

    try {
      const res = await updateUser(initData.id, formData);
      if (res === 200) {
        addAlert("Cuenta actualizada", "success");
      } else {
        addAlert("Cuenta no actualizada", "warning");
      }
    } catch (error) {
      console.error(error);
      addAlert("Error en el servidor", "error");
    }
  };

  return (
    <form className="space-y-4" onSubmit={update}>
      {/* Nombre */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Nombre completo
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          minLength={6}
          maxLength={100}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full border rounded-md p-2 focus:ring focus:ring-blue-200"
        />
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          minLength={5}
          maxLength={300}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full border rounded-md p-2 focus:ring focus:ring-blue-200"
        />
      </div>

      {/* Dirección */}
      <div>
        <label
          htmlFor="physical_address"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Dirección
        </label>
        <input
          id="physical_address"
          name="physical_address"
          type="text"
          required
          minLength={2}
          maxLength={100}
          value={formData.physical_address}
          onChange={(e) =>
            setFormData({ ...formData, physical_address: e.target.value })
          }
          className="w-full border rounded-md p-2 focus:ring focus:ring-blue-200"
        />
      </div>

      {/* Botón */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-dark-blue text-white px-4 py-2 rounded-md hover:scale-105 transition"
        >
          Guardar cambios
        </button>
      </div>
    </form>
  );
}
