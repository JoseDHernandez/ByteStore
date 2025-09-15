"use client";

import { z } from "zod";
import { displaySchema } from "@/schemas/displaySchemas";
import { DisplaysData } from "@/types/display";
import { useState } from "react";
import Link from "next/link";
import { createDisplay, updateDisplay } from "@/services/displays";
import { useAlerts } from "@/context/altersContext";

type DisplayFormData = z.infer<typeof displaySchema>;

interface Props {
  initData?: DisplaysData;
  displays: DisplaysData[]; // resultado de getAllDisplays
}

export default function DisplayForm({ initData, displays }: Props) {
  const { addAlert } = useAlerts();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // valores únicos iniciales
  const uniqueBrands = Array.from(new Set(displays.map((d) => d.brand)));
  const uniqueResolutions = Array.from(
    new Set(displays.map((d) => d.resolution))
  );
  const uniqueSizes = Array.from(
    new Set(displays.map((d) => d.size.toString()))
  );

  // estado para selects dinámicos
  const [customBrand, setCustomBrand] = useState(false);
  const [customResolution, setCustomResolution] = useState(false);
  const [customSize, setCustomSize] = useState(false);
  const [customGraphics, setCustomGraphics] = useState(false);

  // brand seleccionado
  const [selectedBrand, setSelectedBrand] = useState(initData?.brand ?? "");
  const [graphicsByBrand, setGraphicsByBrand] = useState<string[]>([]);

  // cuando cambia brand
  const handleBrandChange = (value: string) => {
    if (value === "__new__") {
      setCustomBrand(true);
      setSelectedBrand("");
      setCustomGraphics(true); // si es marca nueva, gráficos también serán input
      setGraphicsByBrand([]);
    } else {
      setCustomBrand(false);
      setSelectedBrand(value);
      setCustomGraphics(false);

      // filtrar gráficos por marca
      const gByBrand = displays
        .filter((d) => d.brand === value)
        .map((d) => d.graphics);

      setGraphicsByBrand(Array.from(new Set(gByBrand)));
    }
  };

  const handleOtherChange = (
    value: string,
    field: "resolution" | "size" | "graphics"
  ) => {
    if (value === "__new__") {
      if (field === "resolution") setCustomResolution(true);
      if (field === "size") setCustomSize(true);
      if (field === "graphics") setCustomGraphics(true);
    } else {
      if (field === "resolution") setCustomResolution(false);
      if (field === "size") setCustomSize(false);
      if (field === "graphics") setCustomGraphics(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data: DisplayFormData = {
      brand: (customBrand
        ? formData.get("newBrand")
        : formData.get("brand")) as string,
      resolution: (customResolution
        ? formData.get("newResolution")
        : formData.get("resolution")) as string,
      size: Number(customSize ? formData.get("newSize") : formData.get("size")),
      graphics: (customGraphics
        ? formData.get("newGraphics")
        : formData.get("graphics")) as string,
    };

    // validar con Zod
    const result = displaySchema.safeParse(data);
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

    if (initData) {
      const res = await updateDisplay(initData.id, result.data);
      if (res === 200) addAlert("Pantalla actualizada", "success");
      else addAlert("Pantalla no actualizada", "warning");
    } else {
      const res = await createDisplay(result.data);
      if (res === 201) addAlert("Pantalla registrada", "success");
      else addAlert("Pantalla no registrada", "warning");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="grid grid-cols-2 gap-6">
        {/* Brand */}
        <div>
          <label htmlFor="brand" className="block font-medium mb-1">
            Marca
          </label>
          {!customBrand ? (
            <select
              id="brand"
              name="brand"
              required
              defaultValue={initData?.brand ?? ""}
              onChange={(e) => handleBrandChange(e.target.value)}
              className={`border rounded-md p-2 w-full ${
                errors.brand ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Seleccione una marca</option>
              {uniqueBrands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
              <option value="__new__">Agregar nueva marca</option>
            </select>
          ) : (
            <input
              id="newBrand"
              name="newBrand"
              type="text"
              defaultValue={initData?.brand ?? ""}
              placeholder="Nueva marca"
              className="border rounded-md p-2 w-full"
            />
          )}
          {errors.brand && (
            <p className="text-red-500 text-sm mt-1">{errors.brand}</p>
          )}
        </div>
        {/* Graphics */}
        <div>
          <label htmlFor="graphics" className="block font-medium mb-1">
            Gráficos
          </label>
          {!customGraphics ? (
            <select
              id="graphics"
              name="graphics"
              required
              defaultValue={initData?.graphics ?? ""}
              onChange={(e) => handleOtherChange(e.target.value, "graphics")}
              disabled={!selectedBrand}
              className={`border rounded-md p-2 w-full ${
                errors.graphics ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Seleccione gráficos</option>
              {graphicsByBrand.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
              <option value="__new__">Agregar nuevos gráficos</option>
            </select>
          ) : (
            <input
              id="newGraphics"
              name="newGraphics"
              type="text"
              defaultValue={initData?.graphics ?? ""}
              placeholder="Ej: Nvidia RTX 3060"
              className="border rounded-md p-2 w-full"
            />
          )}
          {errors.graphics && (
            <p className="text-red-500 text-sm mt-1">{errors.graphics}</p>
          )}
        </div>
        {/* Resolution */}
        <div>
          <label htmlFor="resolution" className="block font-medium mb-1">
            Resolución
          </label>
          {!customResolution ? (
            <select
              id="resolution"
              name="resolution"
              required
              defaultValue={initData?.resolution ?? ""}
              onChange={(e) => handleOtherChange(e.target.value, "resolution")}
              className={`border rounded-md p-2 w-full ${
                errors.resolution ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Seleccione resolución</option>
              {uniqueResolutions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
              <option value="__new__">Agregar nueva resolución</option>
            </select>
          ) : (
            <input
              id="newResolution"
              name="newResolution"
              type="text"
              defaultValue={initData?.resolution ?? ""}
              placeholder="Nueva resolución"
              className="border rounded-md p-2 w-full"
            />
          )}
          {errors.resolution && (
            <p className="text-red-500 text-sm mt-1">{errors.resolution}</p>
          )}
        </div>

        {/* Size */}
        <div>
          <label htmlFor="size" className="block font-medium mb-1">
            Tamaño (pulgadas)
          </label>
          {!customSize ? (
            <select
              id="size"
              name="size"
              required
              defaultValue={initData?.size ?? ""}
              onChange={(e) => handleOtherChange(e.target.value, "size")}
              className={`border rounded-md p-2 w-full ${
                errors.size ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Seleccione tamaño</option>
              {uniqueSizes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
              <option value="__new__">Agregar nuevo tamaño</option>
            </select>
          ) : (
            <input
              id="newSize"
              name="newSize"
              type="number"
              step="0.1"
              defaultValue={initData?.size ?? ""}
              placeholder="Ej: 15.6"
              className="border rounded-md p-2 w-full"
            />
          )}
          {errors.size && (
            <p className="text-red-500 text-sm mt-1">{errors.size}</p>
          )}
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-between gap-3 mt-4">
        <Link
          href="/admin/products/graphics/"
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
