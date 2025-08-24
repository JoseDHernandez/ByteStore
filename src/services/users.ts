import { UserRegister, User, UserUpdate } from "@/types/user";
import { http } from "./http";
//Obtener usuario
export const getUserById = async (id: string): Promise<UserRegister | null> => {
  try {
    const res = await http.get(`/users/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Error al obtener el usuario ${id}`, error);
    return null;
  }
};
//Actualizar usuario
export const putUser = async (user: UserUpdate): Promise<number> => {
  try {
    const res = await http.put(`/users/${user.id}`, { user });
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
    const params = new URLSearchParams({ email, password });
    const res = await http.get(`/users?${params.toString()}`);
    return { ...res.data[0], token: "" };
  } catch (error) {
    console.error(
      `Error al obtener el usuario con el correo: ${email} y la contraseña: ${password}`,
      error
    );
    return null;
  }
};
//Registrar usuario
export const postUser = async (user: UserRegister): Promise<number> => {
  try {
    const res = await http.post(`/users`, { ...user, role: 0 });
    return res.status;
  } catch (error) {
    console.error(
      `Error al registrar el usuario: ${user.name} - ${user.email}`,
      error
    );
    return 400;
  }
};
