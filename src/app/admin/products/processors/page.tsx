"use client";

import { deleteProcessorById, getAllProcessors } from "@/services/processors";
import { notFound } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import TableSkeleton from "@/components/skeletons/tableSkeleton";
import { BiTrashAlt, BiPencil } from "react-icons/bi";
import Modal from "@/components/modal";
import Link from "next/link";
import { ProcessorData } from "@/types/processor";
import { useAlerts } from "@/context/altersContext";
export default function AdminProcessorsPage() {
  const { addAlert } = useAlerts();
  const [processors, setProcessors] = useState<ProcessorData[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalProcessor, setModalProcessor] = useState<ProcessorData | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);

  // Filtros
  const [brand, setBrand] = useState("");
  const [family, setFamily] = useState("");
  const [cores, setCores] = useState("");

  // Abrir modal
  const openModal = (processor: ProcessorData) => {
    setModalProcessor(processor);
    setModalOpen(true);
  };

  useEffect(() => {
    const fetchProcessors = async () => {
      try {
        setLoading(true);
        const res = await getAllProcessors();
        if (!res) return notFound();
        setProcessors(res);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProcessors();
  }, []);

  // Opciones dinámicas
  const brands = useMemo(
    () => [...new Set(processors.map((p) => p.brand))],
    [processors]
  );

  const families = useMemo(() => {
    if (!brand) return [];
    return [
      ...new Set(
        processors.filter((p) => p.brand === brand).map((p) => p.family)
      ),
    ];
  }, [brand, processors]);

  const coresOptions = useMemo(() => {
    if (!family) return [];
    return [
      ...new Set(
        processors
          .filter((p) => p.brand === brand && p.family === family)
          .map((p) => p.cores)
      ),
    ];
  }, [brand, family, processors]);

  // Procesadores filtrados
  const filteredProcessors = useMemo(() => {
    return processors.filter((p) => {
      return (
        (!brand || p.brand === brand) &&
        (!family || p.family === family) &&
        (!cores || p.cores === Number(cores))
      );
    });
  }, [processors, brand, family, cores]);

  // Eliminar
  const handleDeleteConfirm = async () => {
    if (processors == null || !modalProcessor) return;
    try {
      const res = await deleteProcessorById(modalProcessor.id);
      if (res !== 200) return alert("Error eliminando");
      setProcessors(processors.filter((e) => e.id !== modalProcessor.id));
      addAlert("Procesador eliminado", "success");
    } catch (err) {
      console.error(err);
    } finally {
      setModalOpen(false);
      setModalProcessor(null);
    }
  };

  return (
    <section>
      <h1 className="font-bold text-3xl mb-4">Procesadores</h1>
      {/* Filtros */}
      <div className="grid grid-cols-4 gap-6 mb-4">
        <div>
          <label htmlFor="brand">Marca</label>
          <select
            id="brand"
            value={brand}
            onChange={(e) => {
              setBrand(e.target.value);
              setFamily(""); // reset familia
              setCores(""); // reset cores
            }}
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue transition"
          >
            <option value="">Todas</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="family">Familia</label>
          <select
            id="family"
            value={family}
            onChange={(e) => {
              setFamily(e.target.value);
              setCores(""); // reset cores
            }}
            disabled={!brand}
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue transition"
          >
            <option value="">Todas</option>
            {families.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="cores">Núcleos</label>
          <select
            id="cores"
            value={cores}
            onChange={(e) => setCores(e.target.value)}
            disabled={!family}
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue transition"
          >
            <option value="">Todos</option>
            {coresOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end justify-end">
          <Link
            href="/admin/products/processors/new"
            className="bg-green text-white p-2 rounded-md"
          >
            Nuevo procesador
          </Link>
        </div>
      </div>

      {/* Tabla */}
      <div>
        {loading && <TableSkeleton columns={4} rows={10} size={90} />}
        {filteredProcessors.length > 0 ? (
          <table width="100%" className="rounded-md overflow-hidden">
            <thead className="bg-dark-blue text-white">
              <tr>
                <th className="p-2 text-lg">Marca</th>
                <th className="p-2 text-lg">Familia</th>
                <th className="p-2 text-lg">Modelo</th>
                <th className="p-2 text-lg">Núcleos</th>
                <th className="p-2 text-lg">Velocidad</th>
                <th className="p-2 text-lg">Opciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProcessors.map((processor) => (
                <tr
                  key={processor.id}
                  className="border-t-1 border-gray-300 w-full"
                >
                  <td className="p-2">{processor.brand}</td>
                  <td className="p-2">{processor.family}</td>
                  <td className="p-2">{processor.model}</td>
                  <td className="p-2">{processor.cores}</td>
                  <td className="p-2" width="40%">
                    {processor.speed}
                  </td>
                  <td className="p-2">
                    <div className="flex justify-around">
                      <button
                        onClick={() => openModal(processor)}
                        className="block p-1 rounded-md  hover:scale-105 transition duration-300 ease-in-out hover:bg-red-600 hover:text-white"
                        title="Eliminar este procesador"
                      >
                        <BiTrashAlt size={30} />
                      </button>
                      <Link
                        href={`/admin/products/processors/${processor.id}`}
                        className="block p-1 rounded-md  hover:scale-105 transition duration-300 ease-in-out hover:text-white hover:bg-green"
                        title="Editar procesador"
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
          !loading && <p>No se encontraron procesadores con esos filtros</p>
        )}

        {/* Modal */}
        {modalOpen && modalProcessor && (
          <Modal
            state={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Eliminar producto"
          >
            <p>
              ¿Está seguro de eliminar el procesador{" "}
              <b>{modalProcessor.family + " " + modalProcessor.model}</b>?
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
