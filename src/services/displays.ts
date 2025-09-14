"use server";
import { api } from "./http";
import type { Display, DisplaysData } from "@/types/display";
//obtener pantallas
export const getAllDisplays = async (): Promise<DisplaysData[] | null> => {
  try {
    const res = await api.get("/products/displays/");
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
//obtener por id
export const getDisplayById = async (
  id: string
): Promise<DisplaysData | null> => {
  try {
    const res = await api.get(`/products/displays/${id}`);
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
//crear
export const createDisplay = async (display: Display): Promise<number> => {
  try {
    const res = await api.post(`/products/displays/`, display);
    return res.status;
  } catch (error) {
    console.error(error);
    return 400;
  }
};
//actualizar
export const updateDisplay = async (
  id: number,
  display: Display
): Promise<number> => {
  try {
    const res = await api.put(`/products/displays/${id}`, display);
    return res.status;
  } catch (error) {
    console.error(error);
    return 400;
  }
};
//eliminar
export const deleteDisplay = async (id: number): Promise<number> => {
  try {
    const res = await api.delete(`/products/displays/${id}`);
    return res.status;
  } catch (error) {
    console.error(error);
    return 400;
  }
};
