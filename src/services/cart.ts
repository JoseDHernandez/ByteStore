"use server";
import { Cart, CartItem } from "@/types/cart";
import { api } from "./http";
//Obtener carrito por usuario
export const getCartByUserId = async (userId: string): Promise<Cart | null> => {
  try {
    const res = await api.get(`/carts?user_id=${userId}`);
    return res.data[0];
  } catch (error) {
    console.error(`Error al obtener el carro del usuario: ${userId}`, error);
    return null;
  }
};
//Actualizar carrito
export const updateCart = async (data: Cart): Promise<number> => {
  try {
    const res = await api.put(`/carts/${data.id}`, {
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
  user_id: string,
  products: CartItem[]
): Promise<number> => {
  try {
    const res = await api.post(`/carts/`, {
      user_id,
      products,
    });
    return res.status;
  } catch (error) {
    console.error(`Error al crear el carro para el usuario ${user_id}`, error);
    return 400;
  }
};
//Eliminar carrito
export const deleteCartById = async (id: string): Promise<number> => {
  try {
    const res = await api.delete(`/carts/${id}`);
    return res.status;
  } catch (error) {
    console.error(`Error al eliminar el carro con la id: ${id}`, error);
    return 400;
  }
};
