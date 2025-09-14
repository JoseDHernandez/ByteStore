"use server";
import { api } from "./http";
import { Processor, ProcessorData } from "@/types/processor";
//obtener procesadores
export const getAllProcessors = async (): Promise<ProcessorData[] | null> => {
  try {
    const res = await api.get("/products/processors/");
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
//eliminar procesador
export const deleteProcessorById = async (id: string): Promise<number> => {
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
  id: string
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
  id: string,
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
