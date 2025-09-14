"use server";
import {
  UserRegister,
  User,
  UserUpdate,
  UserChangePassword,
} from "@/types/user";
import { api } from "./http";
//Obtener usuario
export const getUserById = async (id: string): Promise<UserUpdate | null> => {
  try {
    const res = await api.get(`/users/${id}`);
    return res.data.data;
  } catch (error) {
    console.error(`Error al obtener el usuario ${id}`, error);
    return null;
  }
};
//Actualizar usuario
export const updateUser = async (user: UserUpdate): Promise<number> => {
  try {
    const res = await api.put(`/users/${user.id}`, { user });
    return res.status;
  } catch (error) {
    console.error(`Error al actualizar el usuario ${user.id}`, error);
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
