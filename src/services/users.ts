import { UserRegister } from "@/types/user";
import { http } from "./http";
//Obtener usuario
export const getUserById = async (id: string): Promise<UserRegister | null> => {
  try {
    const res = await http.get(`/users/${id}`);
    return res.data.user;
  } catch (error) {
    console.error(`Error al obtener el usuario ${id}`, error);
    return null;
  }
};
//Actualizar usuario
export const putUser = async (user: UserRegister): Promise<number> => {
  try {
    const res = await http.put(`/users/${user.id}`, { user });
    return res.status;
  } catch (error) {
    console.error(`Error al actualizar el usuario ${user.id}`, error);
    return 400;
  }
};
