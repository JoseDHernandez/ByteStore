"use client";

import { deleteOS, getAllOS } from "@/services/systems";
import { OperatingSystemData } from "@/types/system";
import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { BiTrashAlt, BiPencil } from "react-icons/bi";
import TableSkeleton from "@/components/skeletons/tableSkeleton";
import Modal from "@/components/modal";
import Link from "next/link";
import { useAlerts } from "@/context/altersContext";
export default function ProductSystemsPage() {
  const { addAlert } = useAlerts();
  const [systems, setSystems] = useState<OperatingSystemData[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal de eliminar
  const [modalSystem, setModalSystem] = useState<OperatingSystemData | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);

  // Filtros
  const [selectedSystem, setSelectedSystem] = useState("");
  const [selectedDistribution, setSelectedDistribution] = useState("");

  useEffect(() => {
    const fetchSystems = async () => {
      try {
        setLoading(true);
        const res = await getAllOS();
        if (!res) return notFound();
        setSystems(res);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSystems();
  }, []);

  // Opciones únicas para los selects
  const systemOptions = [...new Set(systems.map((s) => s.system))];
  const distributionOptions = selectedSystem
    ? [
        ...new Set(
          systems
            .filter((s) => s.system === selectedSystem)
            .map((s) => s.distribution)
        ),
      ]
    : [];

  // Filtrar sistemas
  const filteredSystems = systems.filter((s) => {
    return (
      (!selectedSystem || s.system === selectedSystem) &&
      (!selectedDistribution || s.distribution === selectedDistribution)
    );
  });

  // Abrir modal
  const openModal = (system: OperatingSystemData) => {
    setModalSystem(system);
    setModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!modalSystem) return;
    try {
      setSystems((prev) => prev.filter((s) => s.id !== modalSystem.id));
      const res = await deleteOS(modalSystem.id);
      if (res !== 200)
        return addAlert("Error eliminando el sistema operativo", "error");
      addAlert("Sistema operativo eliminado", "success");
    } catch (err) {
      console.error(err);
    } finally {
      setModalOpen(false);
      setModalSystem(null);
    }
  };

  return (
    <section>
      <h1 className="font-bold text-3xl mb-4">Sistemas operativos</h1>

      {/* Filtros */}
      <div className="grid grid-cols-3 gap-6 mb-4">
        <div>
          <label htmlFor="system" className="block mb-1">
            Sistema
          </label>
          <select
            id="system"
            value={selectedSystem}
            onChange={(e) => {
              setSelectedSystem(e.target.value);
              setSelectedDistribution("");
            }}
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue transition"
          >
            <option value="">Todos los sistemas</option>
            {systemOptions.map((sys) => (
              <option key={sys} value={sys}>
                {sys}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="distribution" className="block mb-1">
            Distribución
          </label>
          <select
            id="distribution"
            value={selectedDistribution}
            onChange={(e) => setSelectedDistribution(e.target.value)}
            disabled={!selectedSystem}
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue transition"
          >
            <option value="">Todas las distribuciones</option>
            {distributionOptions.map((dist) => (
              <option key={dist} value={dist}>
                {dist}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end justify-end">
          <Link
            href="/admin/products/systems/new"
            className="bg-green text-white p-2 rounded-md"
          >
            Nuevo sistema
          </Link>
        </div>
      </div>

      {/* Tabla */}
      <div>
        {loading && <TableSkeleton columns={3} rows={10} size={90} />}
        {!loading && filteredSystems.length > 0 ? (
          <table className="w-full border border-gray-200 rounded-md overflow-hidden">
            <thead className="bg-dark-blue text-white">
              <tr>
                <th className="p-2 text-lg">Sistema</th>
                <th className="p-2 text-lg">Distribución</th>
                <th className="p-2 text-lg">Opciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredSystems.map((system) => (
                <tr
                  key={system.id}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <td className="p-2">{system.system}</td>
                  <td className="p-2">{system.distribution}</td>
                  <td className="p-2">
                    <div className="flex justify-around">
                      <button
                        onClick={() => openModal(system)}
                        className="p-1 rounded-md hover:scale-105 transition duration-300 ease-in-out hover:bg-red-600 hover:text-white"
                        title="Eliminar sistema"
                        aria-label={`Eliminar ${system.system} ${system.distribution}`}
                      >
                        <BiTrashAlt size={30} />
                      </button>
                      <Link
                        href={`/admin/products/systems/${system.id}`}
                        className="p-1 rounded-md hover:scale-105 transition duration-300 ease-in-out hover:text-white hover:bg-green"
                        title="Editar sistema"
                        aria-label={`Editar ${system.system} ${system.distribution}`}
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
          !loading && <p>No se encontraron sistemas operativos</p>
        )}
      </div>

      {/* Modal */}
      {modalOpen && modalSystem && (
        <Modal
          state={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Eliminar sistema"
        >
          <p>
            ¿Está seguro de eliminar el sistema{" "}
            <b>{modalSystem.system + " " + modalSystem.distribution}</b>?
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
    </section>
  );
}
