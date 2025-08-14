"use client";

import { useState } from "react";
import type { User } from "@/types/user";

interface Props {
  user: User;
}

export default function AccountForm({ user }: Props) {
  const [formData, setFormData] = useState(user);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) throw new Error("Error actualizando datos");
      setMessage("Datos actualizados correctamente.");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="first_name"
        value={formData.first_name}
        onChange={handleChange}
        placeholder="Nombre"
        className="border p-2 w-full rounded"
      />
      <input
        type="text"
        name="middle_name"
        value={formData.middle_name}
        onChange={handleChange}
        placeholder="Segundo nombre"
        className="border p-2 w-full rounded"
      />
      <input
        type="text"
        name="last_name"
        value={formData.last_name}
        onChange={handleChange}
        placeholder="Apellidos"
        className="border p-2 w-full rounded"
      />
      <input
        type="email"
        name="email_address"
        value={formData.email_address}
        onChange={handleChange}
        placeholder="Correo"
        className="border p-2 w-full rounded"
      />
      <input
        type="text"
        name="physical_address"
        value={formData.physical_address}
        onChange={handleChange}
        placeholder="Dirección"
        className="border p-2 w-full rounded"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Guardando..." : "Guardar cambios"}
      </button>

      {message && <p className="mt-2 text-sm">{message}</p>}
    </form>
  );
}
