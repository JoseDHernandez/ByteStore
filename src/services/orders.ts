"use server";
import { Order, OrderData } from "@/types/order";
import { http } from "./http";
//obtener todas las ordenes (pendiente paginación y agregar parámetros de paginación (ver ejemplo en /products.ts))
interface GetOrdersPaginated {
  numberPage?: number;
  sort?: string; //opcional según la api
  order?: string; //opcional según la api
  limit?: number;
}
export const getAllOrders = async ({
  numberPage,
  limit,
}: GetOrdersPaginated): Promise<OrderData | null> => {
  const params: Record<string, string | number> = {};
  if (numberPage) {
    params["page"] = numberPage;
  }
  if (limit) {
    params["limit"] = limit >= 10 && limit <= 100 ? limit : 10;
  } else {
    params["limit"] = 11;
  }
  //agregar los otros parámetros según los necesita la api de ordenes
  try {
    const res = await http.get("/orders", { params });
    return res.data;
  } catch (error) {
    console.error(`Error al obtener  todas las ordenes`, error);
    return null;
  }
};
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
//Crear orden
export const createOrder = async (body: Order): Promise<number> => {
  try {
    const res = await http.post("/orders", { body });
    return res.status;
  } catch (error) {
    console.error(
      `Error al registrar la orden del usuario: ${body.user_id}`,
      error
    );
    return 400;
  }
};
//actualizar orden
export const updateOrder = async (
  id: string,
  order: Order
): Promise<number> => {
  try {
    const res = await http.put(`/orders/${id}`, order);
    return res.status;
  } catch (error) {
    console.error(
      `Error al actualizar la orden del usuario: ${order.user_id}`,
      error
    );
    return 400;
  }
};
//eliminar orden
export const deleteOrder = async (id: string): Promise<number> => {
  try {
    const res = await http.delete(`/orders/${id}`);
    return res.status;
  } catch (error) {
    console.error(`Error al eliminar la orden: ${id}`, error);
    return 400;
  }
};
