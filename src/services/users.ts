"use server";
import {
  UserRegister,
  User,
  UserUpdate,
  UserChangePassword,
  UserData,
  UserDataItem,
} from "@/types/user";
import { api } from "./http";
//Obtener usuario
export const getUserById = async (id: string): Promise<UserDataItem | null> => {
  try {
    const res = await api.get(`/users/${id}`);
    return res.data.data;
  } catch (error) {
    console.error(`Error al obtener el usuario ${id}`, error);
    return null;
  }
};
//Actualizar usuario
export const updateUser = async (
  id: string,
  user: UserUpdate
): Promise<number> => {
  try {
    const res = await api.put(`/users/${id}`, user);
    return res.status;
  } catch (error) {
    console.error(`Error al actualizar el usuario ${id}`, error);
    return 400;
  }
};
//Obtener usuario por correo y contraseña
export const getUserForLogin = async (
  email: string,
  password: string
): Promise<User | null> => {
  try {
    const res = await api.post(`/users/sign-in`, { password, email });
    return res.data.data;
  } catch (error) {
    console.error(
      `Error al obtener el usuario con el correo: ${email} y la contraseña: ${password}`,
      error
    );
    return null;
  }
};
//Registrar usuario
export const createUser = async (user: UserRegister): Promise<number> => {
  try {
    const res = await api.post(`/users/sign-up`, { ...user, role: 0 });
    return res.status;
  } catch (error) {
    console.error(
      `Error al registrar el usuario: ${user.name} - ${user.email}`,
      error
    );
    return 400;
  }
};
//cambiar contraseña
export const changePassword = async (
  user: UserChangePassword
): Promise<number> => {
  try {
    const res = await api.patch(`/users/${user.id}/password`, {
      password: user.password,
    });
    return res.status;
  } catch (error) {
    console.error(`Error al cambiar contraseña`, error);
    return 400;
  }
};
//obtener usuarios paginados
interface GetUsersPaginated {
  numberPage?: number;
  limit?: number;
  query?: string;
}
export const getUsersPaginated = async ({
  numberPage,
  limit,
  query,
}: GetUsersPaginated): Promise<UserData | null> => {
  const params: Record<string, string | number> = {};
  if (numberPage) {
    params["page"] = numberPage;
  }
  if (limit) {
    params["limit"] = limit >= 10 && limit <= 100 ? limit : 10;
  } else {
    params["limit"] = 11;
  }
  if (query) {
    params["search"] = query.trim();
  }
  try {
    const res = await api.get(`/users/`, { params });
    return res.data;
  } catch (error) {
    console.error(`Error al obtener usuarios`, error);
    return null;
  }
};
//eliminar
export const deleteUser = async (id: string): Promise<number> => {
  try {
    const res = await api.delete(`/users/${id}`);
    return res.status;
  } catch (error) {
    console.error(`Error al eliminar el usuario ${id}`, error);
    return 400;
  }
};
//cambiar rol
export const changeRole = async (id: string, role: string): Promise<number> => {
  try {
    console.log(role);
    const res = await api.patch(`/users/${id}/role`, { role: role });
    return res.status;
  } catch (error) {
    console.error(`Error al cambiar el rol del usuario ${id}`, error);
    return 400;
  }
};
