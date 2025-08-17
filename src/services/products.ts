import { Product } from "@/types/product";
import { http } from "./http";
//Obtener producto por id
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const res = await http.get<Product>(`/products/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Error obteniendo el producto ${id}:`, error);
    return null;
  }
};
//Obtener productos por limite
export const getProductsLimited = async (
  limit: number
): Promise<Product[] | null> => {
  try {
    const res = await http.get(`/products?_limit=${limit}`);
    return res.data;
  } catch (error) {
    console.error(`Error al obtener ${limit} productos.`, error);
    return null;
  }
};
