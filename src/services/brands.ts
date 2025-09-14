"use server";
import { api } from "./http";
import type { Brand, BrandData } from "@/types/brand";
//obtener marcas
export const getAllBrands = async (): Promise<BrandData[] | null> => {
  try {
    const res = await api.get("/products/brands/");
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
//obtener por id
export const getBrandById = async (id: string): Promise<BrandData | null> => {
  try {
    const res = await api.get(`/products/brands/${id}`);
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
//crear
export const createBrand = async (brand: Brand): Promise<BrandData | null> => {
  try {
    const res = await api.post("/products/brands/", brand);
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
//actualizar
export const updateBrand = async (
  id: string,
  brand: Brand
): Promise<number> => {
  try {
    const res = await api.patch(`/products/brands/${id}`, brand);
    return res.status;
  } catch (error) {
    console.error(error);
    return 400;
  }
};
//eliminar
export const deleteBrand = async (id: string): Promise<number> => {
  try {
    const res = await api.delete(`/products/brands/${id}`);
    return res.status;
  } catch (error) {
    console.error(error);
    return 400;
  }
};
