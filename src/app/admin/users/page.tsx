"use client";

import { useEffect, useState } from "react";
import { getUsersPaginated, deleteUser, changeRole } from "@/services/users";
import type { UserDataItem } from "@/types/user";
import { BiShow, BiEdit, BiTrashAlt } from "react-icons/bi";
import Link from "next/link";
import { useDebouncedCallback } from "use-debounce";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { searchSchema } from "@/schemas/searchSchema";
import Paginator from "@/components/paginator";
import { useAlerts } from "@/context/altersContext";
import Modal from "@/components/modal";

export default function UsersPage() {
  const searchParams = useSearchParams();
  const numberPage = parseInt(searchParams.get("page") ?? "1");
  const searchQuery = searchParams.get("query") ?? "";
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [users, setUsers] = useState<UserDataItem[]>([]);
  const [loading, setLoading] = useState(false);

  // modal eliminar
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // modal detalles
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState<UserDataItem | null>(null);

  const { addAlert } = useAlerts();

  // buscador
  const [query, setQuery] = useState(searchQuery.replaceAll(",", " "));
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((e: string) => {
    const data = searchSchema.safeParse(e.trim());
    if (data.success) {
      setQuery(data.data);
      search(data.data);
    } else {
      search("");
    }
  }, 500);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const data = await getUsersPaginated({
        numberPage,
        limit: 10,
        query: searchQuery,
      });
      if (data) {
        setTotalPages(data.pages);
        setUsers(data.data);
      }
      setLoading(false);
    };
    fetchUsers();
  }, [numberPage, searchQuery]);

  const search = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("query", value.replaceAll(" ", ","));
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const openDeleteModal = (user: UserDataItem) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  const openDetailModal = (user: UserDataItem) => {
    setSelectedUser(user);
    setDetailModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    const res = await deleteUser(selectedUser.id);
    if (res === 200) {
      setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
      addAlert("Usuario eliminado correctamente", "success");
    } else {
      addAlert("No se pudo eliminar el usuario", "error");
    }
    setDeleteModalOpen(false);
    setSelectedUser(null);
  };

  const handleChangeRole = async (role: string) => {
    if (!selectedUser || role.length === 0) return;
    const res = await changeRole(selectedUser.id, role.toLowerCase());
    if (res === 200) {
      setUsers((prev) =>
        prev.map((u) => (u.id === selectedUser.id ? { ...u, role } : u))
      );
      addAlert("Rol actualizado correctamente", "success");
      setSelectedUser((prev) => prev && { ...prev, role });
    } else {
      addAlert("No se pudo actualizar el rol", "error");
    }
  };

  return (
    <section className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Usuarios</h1>

      {/* Barra de búsqueda */}
      <div className="flex justify-between items-center mb-4">
        <input
          defaultValue={query}
          type="search"
          name="query"
          minLength={3}
          maxLength={50}
          placeholder="Buscar usuario por nombre o email"
          className="border rounded-md w-[80%] p-2 border-gray-400"
          onChange={(e) => handleSearch(e.target.value.trim())}
        />

        <Link
          href="/admin/users/new"
          className="bg-green text-white px-4 py-2 rounded-md hover:scale-105 transition"
        >
          Nuevo usuario
        </Link>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full border-collapse">
          <thead className="bg-dark-blue text-white">
            <tr>
              <th className="p-2 text-lg">Nombre</th>
              <th className="p-2 text-lg">Email</th>
              <th className="p-2 text-lg">Rol</th>
              <th className="p-2 text-lg">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="py-4 text-center">
                  Cargando...
                </td>
              </tr>
            ) : users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id} className="border-t border-gray-300">
                  <td className="p-2">{user.name}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">{user.role}</td>
                  <td className="p-2">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => openDeleteModal(user)}
                        className="p-1 rounded-md hover:scale-105 transition duration-300 ease-in-out hover:bg-red-600 hover:text-white"
                        title="Eliminar usuario"
                      >
                        <BiTrashAlt size={30} />
                      </button>
                      <button
                        onClick={() => openDetailModal(user)}
                        className="p-1 rounded-md hover:scale-105 transition duration-300 ease-in-out hover:text-white hover:bg-dark-blue"
                        title="Ver detalles del usuario"
                      >
                        <BiShow size={30} />
                      </button>
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="p-1 rounded-md hover:scale-105 transition duration-300 ease-in-out hover:text-white hover:bg-green"
                        title="Editar usuario"
                      >
                        <BiEdit size={30} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-4 text-center">
                  No se encontraron usuarios
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginador */}
      {totalPages && (
        <Paginator size={3} currentPage={numberPage} totalPages={totalPages} />
      )}

      {/* Modal de eliminación */}
      {deleteModalOpen && selectedUser && (
        <Modal
          state={deleteModalOpen}
          title="Confirmar eliminación"
          onClose={() => setDeleteModalOpen(false)}
        >
          <p className="mb-6">
            ¿Estás seguro de que deseas eliminar el siguiente usuario? <br />
            <br />
            <b>Usuario:</b> <span>{selectedUser.name}</span>
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setDeleteModalOpen(false);
                setSelectedUser(null);
              }}
              className="p-2 rounded-md text-white bg-blue"
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              className="p-2 rounded-md text-white bg-green"
            >
              Eliminar
            </button>
          </div>
        </Modal>
      )}

      {/* Modal de detalles */}
      {detailModalOpen && selectedUser && (
        <Modal
          state={detailModalOpen}
          title="Detalles del usuario"
          onClose={() => setDetailModalOpen(false)}
        >
          <p>
            <span className="font-semibold">Nombre:</span> {selectedUser.name}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {selectedUser.email}
          </p>
          <p>
            <span className="font-semibold">Dirección:</span>{" "}
            {selectedUser.physical_address}
          </p>
          <p>
            <span className="font-semibold">Rol actual:</span>{" "}
            {selectedUser.role}
          </p>

          <div className="mt-4">
            <label htmlFor="role" className="block font-medium mb-1">
              Cambiar rol
            </label>
            <select
              id="role"
              defaultValue={selectedUser.role}
              onChange={(e) => handleChangeRole(e.target.value)}
              className="border rounded-md p-2 w-full"
            >
              <option value="">Selecciona el rol</option>
              <option value="cliente">Cliente</option>
              <option value="administrador">Administrador</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => {
                setDetailModalOpen(false);
                setSelectedUser(null);
              }}
              className="p-2 rounded-md text-white bg-green"
            >
              Cerrar
            </button>
          </div>
        </Modal>
      )}
    </section>
  );
}
