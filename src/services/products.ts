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
//obtener productos por pagina y con limite
export const getProductsPaginatedAndLimited = async (
  page: number,
  limit: number
): Promise<Product[] | null> => {
  try {
    const res = await http.get(`/products?_page=${page}&_limit=${limit}`);
    return res.data;
  } catch (error) {
    console.error(
      `Error al obtener ${page} productos con limite ${limit}`,
      error
    );
    return null;
  }
};
//eliminar producto
export const deleteProductById = async (id: string): Promise<number> => {
  try {
    const res = await http.delete(`/products/${id}`);
    return res.status;
  } catch (error) {
    console.error(`Error al eliminar el producto ${id}`, error);
    return 400;
  }
};
//Obtener productos por consulta
interface GetProductsBySearchParams {
  query?: string;
  numberPage?: number;
  sort?: string;
  order?: string;
}
export const getProductsBySearch = async ({
  query,
  numberPage,
  sort,
  order,
}: GetProductsBySearchParams): Promise<Product[] | null> => {
  const params: Record<string, string | number> = {};

  if (query) {
    //Formatear para varios términos
    let q = "^";
    if (query && query.split(" ").length > 1) {
      query.split(" ").forEach((e) => {
        q += `(?=.*${e})`;
      });
    }
    const nameLike = query.split(" ").length > 1 ? q : query;
    params["name_like"] = nameLike;
  }

  if (numberPage) {
    params["_page"] = numberPage;
    params["_limit"] = 11;
  }

  if (sort) {
    params["_sort"] = sort;
  }
  if (order) params["_order"] = order == "asc" ? "asc" : "desc";

  try {
    const res = await http.get(`/products`, { params });
    return res.data;
  } catch (error) {
    console.error("Error al obtener productos por consulta", error);
    return null;
  }
};
