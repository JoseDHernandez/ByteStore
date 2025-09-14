"use server";
import { api } from "./http";
import type { OperatingSystem, OperatingSystemData } from "@/types/system";
//sistemas operativos
export const getAllOS = async (): Promise<OperatingSystemData[] | null> => {
  try {
    const res = await api.get("/products/operating-systems/");
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
//sistema operativo por id
export const getOSById = async (
  id: string
): Promise<OperatingSystemData | null> => {
  try {
    const res = await api.get(`/products/operating-systems/${id}`);
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
//crear sistema operativo
export const createOS = async (system: OperatingSystem): Promise<number> => {
  try {
    const res = await api.post("/products/operating-systems/", system);
    return res.status;
  } catch (error) {
    console.error(error);
    return 400;
  }
};
//actualizar
export const updateOS = async (
  id: string,
  system: OperatingSystem
): Promise<number> => {
  try {
    const res = await api.put(`/products/operating-systems/${id}`, system);
    return res.status;
  } catch (error) {
    console.error(error);
    return 400;
  }
};
//eliminar
export const deleteOS = async (id: string): Promise<number> => {
  try {
    const res = await api.delete(`/products/operating-systems/${id}`);
    return res.status;
  } catch (error) {
    console.error(error);
    return 400;
  }
};
