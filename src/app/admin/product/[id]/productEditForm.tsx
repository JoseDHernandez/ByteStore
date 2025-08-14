"use client";
import { useState } from "react";
import { Product } from "@/types/product";
interface Props {
  product: Product;
}

export default function ProductEditForm({ product }: Props) {
  const [form, setForm] = useState<Product>({ ...product });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Manejar cambios simples
  const handleChange = (
    key: keyof Product,
    value: string | number | string[]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // Manejar cambios de nested objects
  const handleNestedChange = (
    parent: keyof Product,
    key: string,
    value: string | number
  ) => {
    setForm((prev) => ({
      ...prev,
      [parent]: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(prev[parent] as any),
        [key]: value,
      },
    }));
  };

  // Manejar array (operating_system)
  const handleArrayChange = (index: number, value: string) => {
    const newArray = [...form.operating_system];
    newArray[index] = value;
    handleChange("operating_system", newArray);
  };

  // Enviar actualización
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${product.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          //Agregar token para validar usuario
          body: JSON.stringify(form),
        }
      );
      if (!res.ok) throw new Error("Error actualizando producto");
      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert("No se pudo actualizar el producto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-3xl mx-auto">
        <div>
          <label className="block font-semibold">Nombre:</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label className="block font-semibold">Descripción:</label>
          <textarea
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="border p-2 w-full"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block font-semibold">Precio:</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => handleChange("price", Number(e.target.value))}
              className="border p-2 w-full"
            />
          </div>
          <div>
            <label className="block font-semibold">Descuento %:</label>
            <input
              type="number"
              value={form.discount}
              onChange={(e) => handleChange("discount", Number(e.target.value))}
              className="border p-2 w-full"
            />
          </div>
          <div>
            <label className="block font-semibold">Stock:</label>
            <input
              type="number"
              value={form.stock}
              onChange={(e) => handleChange("stock", Number(e.target.value))}
              className="border p-2 w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold">Brand:</label>
            <input
              type="text"
              value={form.brand || ""}
              onChange={(e) => handleChange("brand", e.target.value)}
              className="border p-2 w-full"
            />
          </div>
          <div>
            <label className="block font-semibold">Model:</label>
            <input
              type="text"
              value={form.model}
              onChange={(e) => handleChange("model", e.target.value)}
              className="border p-2 w-full"
            />
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-4">Procesador</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block font-semibold">Marca:</label>
            <input
              type="text"
              value={form.processor.brand}
              onChange={(e) =>
                handleNestedChange("processor", "brand", e.target.value)
              }
              className="border p-2 w-full"
            />
          </div>
          <div>
            <label className="block font-semibold">Family:</label>
            <input
              type="text"
              value={form.processor.family}
              onChange={(e) =>
                handleNestedChange("processor", "family", e.target.value)
              }
              className="border p-2 w-full"
            />
          </div>
          <div>
            <label className="block font-semibold">Model:</label>
            <input
              type="text"
              value={form.processor.model}
              onChange={(e) =>
                handleNestedChange("processor", "model", e.target.value)
              }
              className="border p-2 w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-2">
          <div>
            <label className="block font-semibold">Cores:</label>
            <input
              type="number"
              value={form.processor.cores}
              onChange={(e) =>
                handleNestedChange("processor", "cores", Number(e.target.value))
              }
              className="border p-2 w-full"
            />
          </div>
          <div>
            <label className="block font-semibold">Velocidad:</label>
            <input
              type="text"
              value={form.processor.speed}
              onChange={(e) =>
                handleNestedChange("processor", "speed", e.target.value)
              }
              className="border p-2 w-full"
            />
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-4">Sistema Operativo</h3>
        {form.operating_system.map((os, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              type="text"
              value={os}
              onChange={(e) => handleArrayChange(i, e.target.value)}
              className="border p-2 w-full"
            />
          </div>
        ))}

        {form.display && (
          <>
            <h3 className="text-xl font-semibold mt-4">Display</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold">Tamaño:</label>
                <input
                  type="number"
                  value={form.display.size}
                  onChange={(e) =>
                    handleNestedChange(
                      "display",
                      "size",
                      Number(e.target.value)
                    )
                  }
                  className="border p-2 w-full"
                />
              </div>
              <div>
                <label className="block font-semibold">Resolución:</label>
                <input
                  type="text"
                  value={form.display.resolution}
                  onChange={(e) =>
                    handleNestedChange("display", "resolution", e.target.value)
                  }
                  className="border p-2 w-full"
                />
              </div>
              <div>
                <label className="block font-semibold">Gráficos:</label>
                <input
                  type="text"
                  value={form.display.graphics}
                  onChange={(e) =>
                    handleNestedChange("display", "graphics", e.target.value)
                  }
                  className="border p-2 w-full"
                />
              </div>
              <div>
                <label className="block font-semibold">Marca (opcional):</label>
                <input
                  type="text"
                  value={form.display.brand || ""}
                  onChange={(e) =>
                    handleNestedChange("display", "brand", e.target.value)
                  }
                  className="border p-2 w-full"
                />
              </div>
            </div>
          </>
        )}

        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          disabled={loading}
        >
          {loading ? "Guardando..." : "Guardar cambios"}
        </button>

        {success && (
          <p className="text-green-600 mt-2">
            Producto actualizado correctamente
          </p>
        )}
      </form>
    </>
  );
}
