"use server";
import type { ImageUpload } from "@/types/image";
import { api } from "./http";

//subir imagen
export const uploadImage = async (
  image: ImageUpload
): Promise<string | null> => {
  try {
    const formData = new FormData();
    formData.append("file", image.file);
    const res = await api.post("/products/images/upload/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data.filepath;
  } catch (error) {
    console.error(`Error al subir la imagen`, error);
    return null;
  }
};
