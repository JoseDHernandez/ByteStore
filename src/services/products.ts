'use server';
import {
  Product,
  ProductBrands,
  ProductData,
  ProductDisplays,
  ProductFilters,
  ProductOS,
  ProductProcessors,
} from '@/types/product';
import { api } from './http';
/**
 * Fetches a product by its ID.
 * Returns null if not found or on error.
 */
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const res = await api.get<Product>(`/products/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Error obteniendo el producto ${id}:`, error);
    return null;
  }
};
/**
 * Fetches products with a limit.
 * Always returns an array (empty if error).
 */
export const getProductsLimited = async (limit: number): Promise<Product[]> => {
  try {
    const res = await api.get(`/products?limit=${limit}`);
    return res.data?.data ?? [];
  } catch (error) {
    console.error(`Error al obtener ${limit} productos.`, error);
    return [];
  }
};
/**
 * Fetches paginated products with a limit.
 * Returns null if not found or on error.
 */
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
/**
 * Deletes a product by its ID.
 * Returns HTTP status code (200 if success, 400 if error).
 */
export const deleteProductById = async (id: string): Promise<number> => {
  try {
    const res = await api.delete(`/products/${id}`);
    return res.status;
  } catch (error) {
    console.error(`Error al eliminar el producto ${id}`, error);
    return 400;
  }
};
/**
 * Fetches products by search query and filters.
 */
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
    params['search'] = query;
  }
  if (numberPage) {
    params['page'] = numberPage;
  }
  if (limit) {
    params['limit'] = limit >= 10 && limit <= 100 ? limit : 10;
  } else {
    params['limit'] = 11;
  }
  if (sort) {
    params['sort'] = 'order_' + sort;
  }
  if (order) params['order'] = order == 'asc' ? 'asc' : 'desc';
  try {
    const res = await api.get(`/products`, { params });
    return res.data;
  } catch (error) {
    console.error('Error al obtener productos por consulta', error);
    return null;
  }
};
//obtener filtros
export const getProductFilters = async (): Promise<ProductFilters | null> => {
  try {
    const res = await api.get('/products/filters');
    return res.data;
  } catch (error) {
    console.error('Error al obtener los filtros de productos', error);
    return null;
  }
};
//obtener marcas
export const getProductBrands = async (): Promise<ProductBrands[] | null> => {
  try {
    const res = await api.get('/products/brands/');
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
    const res = await api.get('/products/displays/');
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
    const res = await api.get('/products/processors/');
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
//sistemas operativos
export const getProductOS = async (): Promise<ProductOS[] | null> => {
  try {
    const res = await api.get('/products/operating-systems/');
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
