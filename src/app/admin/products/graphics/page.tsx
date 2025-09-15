"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { getAllDisplays, deleteDisplay } from "@/services/displays";
import { DisplaysData } from "@/types/display";
import TableSkeleton from "@/components/skeletons/tableSkeleton";
import { BiTrashAlt, BiPencil } from "react-icons/bi";
import Link from "next/link";
import Modal from "@/components/modal";

export default function ProductDisplaysPage() {
  const [displays, setDisplays] = useState<DisplaysData[]>([]);
  const [loading, setLoading] = useState(true);

  // filtros
  const [brandFilter, setBrandFilter] = useState("");
  const [resolutionFilter, setResolutionFilter] = useState("");

  // Modal
  const [modalDisplay, setModalDisplay] = useState<DisplaysData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchDisplays = async () => {
      try {
        setLoading(true);
        const res = await getAllDisplays();
        if (!res) return notFound();
        setDisplays(res);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDisplays();
  }, []);

  // obtener listas únicas para filtros
  const uniqueBrands = [...new Set(displays.map((d) => d.brand))];
  const uniqueResolutions = [
    ...new Set(
      displays
        .filter((d) => (brandFilter ? d.brand === brandFilter : true))
        .map((d) => d.resolution)
    ),
  ];

  // aplicar filtros
  const filteredDisplays = displays.filter((d) => {
    return (
      (brandFilter ? d.brand === brandFilter : true) &&
      (resolutionFilter ? d.resolution === resolutionFilter : true)
    );
  });

  const openModal = (display: DisplaysData) => {
    setModalDisplay(display);
    setModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!modalDisplay) return;
    try {
      const res = await deleteDisplay(modalDisplay.id);
      if (res !== 200) return alert("Error eliminando");
      setDisplays((prev) => prev.filter((d) => d.id !== modalDisplay.id));
    } catch (err) {
      console.error(err);
    } finally {
      setModalOpen(false);
      setModalDisplay(null);
    }
  };

  return (
    <section>
      <h1 className="font-bold text-3xl mb-4">Pantallas</h1>

      {/* Filtros */}
      <div className="grid grid-cols-3 gap-6 mb-4">
        <div>
          <label htmlFor="brand">Marca</label>
          <select
            id="brand"
            value={brandFilter}
            onChange={(e) => {
              setBrandFilter(e.target.value);
              setResolutionFilter(""); // reset al cambiar brand
            }}
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue transition"
          >
            <option value="">Todas las marcas</option>
            {uniqueBrands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="resolution">Resolución</label>
          <select
            id="resolution"
            value={resolutionFilter}
            onChange={(e) => setResolutionFilter(e.target.value)}
            disabled={!brandFilter}
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue transition"
          >
            <option value="">Todas las resoluciones</option>
            {uniqueResolutions.map((res) => (
              <option key={res} value={res}>
                {res}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end justify-end">
          <Link
            href="/admin/products/graphics/new"
            className="bg-green text-white p-2 rounded-md"
          >
            Nuevos gráficos
          </Link>
        </div>
      </div>

      {/* Tabla */}
      <div>
        {loading && <TableSkeleton columns={5} rows={10} size={90} />}
        {!loading && filteredDisplays.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-dark-blue text-white">
              <tr>
                <th className="p-2">Marca</th>
                <th className="p-2">Resolución</th>
                <th className="p-2">Tamaño</th>
                <th className="p-2">Gráficos</th>
                <th className="p-2">Opciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredDisplays.map((display) => (
                <tr key={display.id} className="border-t border-gray-300">
                  <td className="p-2">{display.brand}</td>
                  <td className="p-2">{display.resolution}</td>
                  <td className="p-2">{display.size}</td>
                  <td className="p-2">{display.graphics}</td>
                  <td className="p-2">
                    <div className="flex justify-around">
                      <button
                        onClick={() => openModal(display)}
                        className="p-1 rounded-md hover:scale-105 transition duration-300 ease-in-out hover:bg-red-600 hover:text-white"
                        title="Eliminar pantalla"
                      >
                        <BiTrashAlt size={30} />
                      </button>
                      <Link
                        href={`/admin/products/graphics/${display.id}`}
                        className="p-1 rounded-md hover:scale-105 transition duration-300 ease-in-out hover:bg-green hover:text-white"
                        title="Editar pantalla"
                      >
                        <BiPencil size={30} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          !loading && <p>No se encontraron pantallas</p>
        )}

        {/* Modal Eliminar */}
        {modalOpen && modalDisplay && (
          <Modal
            state={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Eliminar pantalla"
          >
            <p>
              ¿Está seguro de eliminar la pantalla{" "}
              <b>{modalDisplay.brand + " " + modalDisplay.resolution}</b>?
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={handleDeleteConfirm}
              >
                Eliminar
              </button>
              <button
                className="px-4 py-2 border rounded"
                onClick={() => setModalOpen(false)}
              >
                Cancelar
              </button>
            </div>
          </Modal>
        )}
      </div>
    </section>
  );
}
