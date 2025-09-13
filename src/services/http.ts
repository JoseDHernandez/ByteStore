"use server";
import { auth } from "@/auth";
import axios from "axios";
//para peticiones con la base de datos temporal
export const http = axios.create({
  baseURL: "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
});
//Api real
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});
export const getToken = async (): Promise<string | null> => {
  const session = await auth();
  return session?.user.token ?? null;
};
//añadir header de autenticación a api
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});
