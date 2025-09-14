"use server";
import {
  NewProduct,
  Product,
  ProductBrands,
  ProductData,
  ProductDisplays,
  ProductFilters,
  ProductOS,
  ProductProcessors,
  ProductUpdate,
} from "@/types/product";
import { api } from "./http";
import { Processor, ProcessorData } from "@/types/processor";
//Obtener producto por id
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const res = await api.get<Product>(`/products/${id}`);
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
    const res = await api.get(`/products?limit=${limit}`);
    return res.data.data;
  } catch (error) {
    console.error(`Error al obtener ${limit} productos.`, error);
    return null;
  }
};
//obtener productos por pagina y con limite
export const getProductsPaginatedAndLimited = async (
  page: number,
  limit: number
): Promise<ProductData | null> => {
  try {
    const res = await api.get(`/products?page=${page}&limit=${limit}`);
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
    const res = await api.delete(`/products/${id}`);
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
  limit?: number;
}
export const getProductsBySearch = async ({
  query,
  numberPage,
  sort,
  order,
  limit,
}: GetProductsBySearchParams): Promise<ProductData | null> => {
  const params: Record<string, string | number> = {};

  if (query) {
    params["search"] = query;
  }
  if (numberPage) {
    params["page"] = numberPage;
  }
  if (limit) {
    params["limit"] = limit >= 10 && limit <= 100 ? limit : 10;
  } else {
    params["limit"] = 11;
  }
  if (sort) {
    params["sort"] = "order_" + sort;
  }
  if (order) params["order"] = order == "asc" ? "asc" : "desc";
  try {
    const res = await api.get(`/products`, { params });
    return res.data;
  } catch (error) {
    console.error("Error al obtener productos por consulta", error);
    return null;
  }
};
//obtener filtros
export const getProductFilters = async (): Promise<ProductFilters | null> => {
  try {
    const res = await api.get("/products/filters");
    return res.data;
  } catch (error) {
    console.error("Error al obtener los filtros de productos", error);
    return null;
  }
};
//obtener marcas
export const getProductBrands = async (): Promise<ProductBrands[] | null> => {
  try {
    const res = await api.get("/products/brands/");
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
//obtener pantallas
export const getProductDisplays = async (): Promise<
  ProductDisplays[] | null
> => {
  try {
    const res = await api.get("/products/displays/");
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
//obtener procesadores
export const getProductProcessors = async (): Promise<
  ProductProcessors[] | null
> => {
  try {
    const res = await api.get("/products/processors/");
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
//sistemas operativos
export const getProductOS = async (): Promise<ProductOS[] | null> => {
  try {
    const res = await api.get("/products/operating-systems/");
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
//actualizar
export const updateProductById = async (
  id: string,
  product: ProductUpdate
): Promise<number> => {
  try {
    const res = await api.put(`/products/${id}`, { ...product });
    return res.status;
  } catch (error) {
    console.error(error);
    return 400;
  }
};
//crear producto
export const createProduct = async (product: NewProduct): Promise<number> => {
  try {
    const res = await api.post(`/products/`, { ...product });
    return res.status;
  } catch (error) {
    console.error(error);
    return 400;
  }
};
//eliminar procesador
export const deleteProcessorById = async (id: number): Promise<number> => {
  try {
    const res = await api.delete(`/products/processors/${id}`);
    return res.status;
  } catch (error) {
    console.error(`Error al eliminar el procesador ${id}`, error);
    return 400;
  }
};
//obtener procesador
export const getProcessorById = async (
  id: number
): Promise<ProcessorData | null> => {
  try {
    const res = await api.get(`/products/processors/${id}`);
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
//crear procesador
export const createProcessor = async (data: Processor): Promise<number> => {
  try {
    const res = await api.post(`/products/processors/`, data);
    return res.status;
  } catch (error) {
    console.error(error);
    return 400;
  }
};
//actualizar procesador
export const updateProcessor = async (
  id: number,
  data: Processor
): Promise<number> => {
  try {
    const res = await api.put(`/products/processors/${id}`, data);
    return res.status;
  } catch (error) {
    console.error(error);
    return 400;
  }
};
