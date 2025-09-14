"use client";

import { useEffect, useState } from "react";
import {
  createProcessor,
  getAllProcessors,
  updateProcessor,
} from "@/services/processors";
import { processorSchema } from "@/schemas/processorSchemas";
import Link from "next/link";
import { ProcessorData } from "@/types/processor";
import { useAlerts } from "@/context/altersContext";
type Props = {
  initialData?: ProcessorData; // para edición
};

export default function ProcessorForm({ initialData }: Props) {
  const { addAlert } = useAlerts();
  const [processors, setProcessors] = useState<ProcessorData[]>([]);

  // Estados de selects/inputs dinámicos
  const [brand, setBrand] = useState(initialData?.brand ?? "");
  const [family, setFamily] = useState(initialData?.family ?? "");
  const [model, setModel] = useState(initialData?.model ?? "");
  const [cores, setCores] = useState(initialData?.cores ?? 4);
  const [speed, setSpeed] = useState(initialData?.speed ?? "");

  const [customBrand, setCustomBrand] = useState(false);
  const [customFamily, setCustomFamily] = useState(false);
  const [customModel, setCustomModel] = useState(false);

  useEffect(() => {
    const fetchProcessors = async () => {
      try {
        const res = await getAllProcessors();
        if (res) setProcessors(res);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProcessors();
  }, []);

  // Opciones únicas
  const brands = [...new Set(processors.map((p) => p.brand))];
  const families = brand
    ? [
        ...new Set(
          processors.filter((p) => p.brand === brand).map((p) => p.family)
        ),
      ]
    : [];
  const models = family
    ? [
        ...new Set(
          processors
            .filter((p) => p.brand === brand && p.family === family)
            .map((p) => p.model)
        ),
      ]
    : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      brand,
      family,
      model,
      cores: Number(cores),
      speed,
    };
    const validation = processorSchema.safeParse(data);
    if (!validation.success) {
      console.log(validation.error);
      return addAlert("Datos incorrectos", "error");
    }
    //actualizar
    if (initialData) {
      const res = await updateProcessor(initialData.id, validation.data);
      if (res === 200) return addAlert("Procesador actualizado", "success");
      return addAlert("Procesador no actualizado", "warning");
    } else {
      //crear
      const res = await createProcessor(validation.data);
      if (res === 201) return addAlert("Procesador registrado", "success");
      return addAlert("Procesador no registrado", "warning");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6 p-6">
      {/* Marca */}
      <div>
        <label htmlFor="brand" className="block font-medium mb-1">
          Marca
        </label>
        {!customBrand ? (
          <select
            id="brand"
            value={brand}
            onChange={(e) => {
              if (e.target.value === "custom") {
                setCustomBrand(true);
                setBrand("");
              } else {
                setBrand(e.target.value);
              }
            }}
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue"
          >
            <option value="">Selecciona una marca</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
            <option value="custom">Agregar nuevo</option>
          </select>
        ) : (
          <input
            type="text"
            placeholder="Nueva marca"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue"
          />
        )}
      </div>

      {/* Familia */}
      <div>
        <label htmlFor="family" className="block font-medium mb-1">
          Familia
        </label>
        {!customFamily ? (
          <select
            id="family"
            value={family}
            onChange={(e) => {
              if (e.target.value === "custom") {
                setCustomFamily(true);
                setFamily("");
              } else {
                setFamily(e.target.value);
              }
            }}
            disabled={!brand}
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue"
          >
            <option value="">Selecciona una familia</option>
            {families.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
            <option value="custom">Agregar nuevo</option>
          </select>
        ) : (
          <input
            type="text"
            placeholder="Nueva familia"
            value={family}
            onChange={(e) => setFamily(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue"
          />
        )}
      </div>

      {/* Modelo */}
      <div>
        <label htmlFor="model" className="block font-medium mb-1">
          Modelo
        </label>
        {!customModel ? (
          <select
            id="model"
            value={model}
            onChange={(e) => {
              if (e.target.value === "custom") {
                setCustomModel(true);
                setModel("");
              } else {
                setModel(e.target.value);
              }
            }}
            disabled={!family}
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue"
          >
            <option value="">Selecciona un modelo</option>
            {models.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
            <option value="custom">Agregar nuevo</option>
          </select>
        ) : (
          <input
            type="text"
            placeholder="Nuevo modelo"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue"
          />
        )}
      </div>

      {/* Núcleos */}
      <div>
        <label htmlFor="cores" className="block font-medium mb-1">
          Núcleos
        </label>
        <input
          type="number"
          id="cores"
          min={4}
          max={64}
          value={cores}
          onChange={(e) => setCores(Number(e.target.value))}
          className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue"
        />
      </div>

      {/* Velocidad */}
      <div>
        <label htmlFor="speed" className="block font-medium mb-1">
          Velocidad
        </label>
        <input
          type="text"
          id="speed"
          placeholder="Ej: 3.6 GHz"
          value={speed}
          onChange={(e) => setSpeed(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue"
        />
      </div>

      <div className="col-span-2 flex justify-between gap-2 mt-4">
        <Link
          href="/admin/products/processors/"
          className="p-2 bg-blue text-white rounded hover:bg-dark-blue transition"
        >
          Volver
        </Link>
        <button
          type="submit"
          className="p-2 bg-green text-white rounded hover:bg-dark-green transition"
        >
          Guardar
        </button>
      </div>
    </form>
  );
}
