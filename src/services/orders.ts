import { Order } from "@/types/order";
import { http } from "./http";

//Obtener ordenes por usuario
export const getOrdersByUserId = async (
  id: number
): Promise<Order[] | null> => {
  try {
    const res = await http.get(`/orders?user_id=${id}`);
    return res.data;
  } catch (error) {
    console.error(`Error al obtener las ordenes del usuario: ${id}`, error);
    return null;
  }
};
//obtener orden por id
export const getOrderById = async (id: string): Promise<Order | null> => {
  try {
    const res = await http.get(`/orders/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Error al obtener la orden: ${id}`, error);
    return null;
  }
};
