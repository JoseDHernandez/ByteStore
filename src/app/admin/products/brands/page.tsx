"use client";

import { BiTrashAlt, BiPencil } from "react-icons/bi";
import { useEffect, useState } from "react";
import { BrandData } from "@/types/brand";
import {
  getAllBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} from "@/services/brands";
import Modal from "@/components/modal";
import { useAlerts } from "@/context/altersContext";
import { brandSchema } from "@/schemas/productsSchemas";

export default function ProductsBrandsPage() {
  const { addAlert } = useAlerts();
  const [brands, setBrands] = useState<BrandData[]>([]);
  const [loading, setLoading] = useState(true);

  // Estado para modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [currentBrand, setCurrentBrand] = useState<BrandData | null>(null);

  const [name, setName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getAllBrands();
        setBrands(res ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const openModal = (brand?: BrandData) => {
    if (brand) {
      setCurrentBrand(brand);
      setName(brand.name);
    } else {
      setCurrentBrand(null);
      setName("");
    }
    setModalOpen(true);
  };

  const handleSave = async () => {
    // Validar con Zod
    const result = brandSchema.safeParse(name);
    if (!result.success) {
      addAlert(result.error.issues[0].message, "warning");
      return;
    }

    if (currentBrand) {
      // actualizar
      const res = await updateBrand(currentBrand.id, { name: result.data });
      if (res === 200) {
        setBrands((prev) =>
          prev.map((b) =>
            b.id === currentBrand.id ? { ...b, name: result.data } : b
          )
        );
        addAlert("Marca actualizada", "success");
      } else {
        addAlert("No se pudo actualizar", "error");
      }
    } else {
      // crear
      const res = await createBrand({ name: result.data });
      if (res?.id) {
        setBrands((prev) => [...prev, res]);
        addAlert("Marca creada", "success");
      } else {
        addAlert("No se pudo crear", "error");
      }
    }

    // Reset
    setModalOpen(false);
    setCurrentBrand(null);
    setName("");
  };

  const openDeleteModal = (brand: BrandData) => {
    setCurrentBrand(brand);
    setModalDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!currentBrand) return;
    const res = await deleteBrand(currentBrand.id);
    if (res === 200) {
      setBrands((prev) => prev.filter((b) => b.id !== currentBrand.id));
      addAlert("Marca eliminada", "success");
    } else {
      addAlert("No se pudo eliminar", "error");
    }
    setModalDeleteOpen(false);
    setCurrentBrand(null);
  };

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-bold text-3xl">Marcas</h1>
        <button
          onClick={() => openModal()}
          className="bg-green text-white px-4 py-2 rounded-md"
        >
          Nueva Marca
        </button>
      </div>

      {loading && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border rounded-lg shadow-sm border-gray-400 w-[310px] h-[75px] animate-pulse"
            ></div>
          ))}
        </div>
      )}
      {!loading && brands.length === 0 && <p>No hay marcas registradas</p>}

      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
        {brands.map((brand) => (
          <div
            key={brand.id}
            className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm border-dark-gray hover:shadow-md transition group cursor-pointer"
            title={brand.name}
          >
            <p className="font-semibold group-hover:underline truncate ">
              {brand.name}
            </p>

            {/* Botones de acción */}
            <div className="flex gap-2">
              <button
                onClick={() => openDeleteModal(brand)}
                className="p-2 rounded-md hover:scale-105 transition duration-300 ease-in-out hover:bg-red-600 hover:text-white"
                title="Eliminar marca"
                aria-label={`Eliminar: ${brand.name}`}
              >
                <BiTrashAlt size={23} />
              </button>
              <button
                onClick={() => openModal(brand)}
                className="p-2 rounded-md hover:scale-105 transition duration-300 ease-in-out hover:bg-green hover:text-white"
                title="Editar marca"
                aria-label={`Editar: ${brand.name}`}
              >
                <BiPencil size={23} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Crear/Editar */}
      {modalOpen && (
        <Modal
          state={modalOpen}
          onClose={() => setModalOpen(false)}
          title={currentBrand ? "Editar marca" : "Nueva marca"}
        >
          <div className="grid gap-3">
            <label className="block font-medium">Nombre</label>
            <input
              type="text"
              min={2}
              max={30}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded-md p-2 w-full"
              placeholder="Ej: Lenovo"
            />
            <div className="flex justify-between gap-2 mt-4">
              <button
                className="px-4 py-2 border rounded-md bg-blue text-white"
                onClick={() => setModalOpen(false)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-green text-white rounded-md"
                onClick={handleSave}
              >
                {currentBrand ? "Actualizar" : "Registrar"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Eliminar */}
      {modalDeleteOpen && currentBrand && (
        <Modal
          state={modalDeleteOpen}
          onClose={() => setModalDeleteOpen(false)}
          title="Eliminar marca"
        >
          <p>
            ¿Está seguro de eliminar la siguiente marca? <br />
            <b>Marca:</b> <span>{currentBrand.name}</span>
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <button
              className="px-4 py-2 border rounded-md bg-blue text-white"
              onClick={() => setModalDeleteOpen(false)}
            >
              Cancelar
            </button>
            <button
              className="px-4 py-2 bg-green text-white rounded-md"
              onClick={handleDelete}
            >
              Eliminar
            </button>
          </div>
        </Modal>
      )}
    </section>
  );
}
