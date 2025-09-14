"use server";
import { Cart, CartItem } from "@/types/cart";
import { http } from "./http";
//Obtener carrito por usuario
export const getCartByUserId = async (userId: string): Promise<Cart | null> => {
  try {
    const res = await http.get(`/carts?user_id=${userId}`);
    return res.data[0];
  } catch (error) {
    console.error(`Error al obtener el carro del usuario: ${userId}`, error);
    return null;
  }
};
//Actualizar carrito
export const updateCart = async (data: Cart): Promise<number> => {
  try {
    const res = await http.put(`/carts/${data.id}`, {
      user_id: data.user_id,
      products: data.products,
    });
    return res.status;
  } catch (error) {
    console.error(`Error al actualizar el carrito: ${data.id}`, error);
    return 400;
  }
};
//Crear carrito
export const createCart = async (
  userId: string,
  products: CartItem[]
): Promise<number> => {
  try {
    const res = await http.post(`/carts`, {
      user_id: userId,
      products: products,
    });
    return res.status;
  } catch (error) {
    console.error(`Error al crear el carro para el usuario ${userId}`, error);
    return 400;
  }
};
//Eliminar carrito
export const deleteCartById = async (id: string): Promise<number> => {
  try {
    const res = await http.delete(`/carts/${id}`);
    return res.status;
  } catch (error) {
    console.error(`Error al eliminar el carro con la id: ${id}`, error);
    return 400;
  }
};
