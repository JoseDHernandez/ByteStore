"use server";
import { Review, ReviewData } from "@/types/review";
import { http } from "./http";
//obtener calificaciones paginadas
interface GetReviewsPaginated {
  numberPage?: number;
  sort?: string; //opcional según la api
  order?: string; //opcional según la api
  limit?: number;
}
export const getAllReviews = async ({
  numberPage,
  limit,
}: GetReviewsPaginated): Promise<ReviewData | null> => {
  const params: Record<string, string | number> = {};
  if (numberPage) {
    params["page"] = numberPage;
  }
  if (limit) {
    params["limit"] = limit >= 10 && limit <= 100 ? limit : 10;
  } else {
    params["limit"] = 11;
  }
  //agregar los otros parámetros según los necesita la api de calificaciones
  try {
    const res = await http.get("/reviews", { params });
    return res.data;
  } catch (error) {
    console.error(`Error al obtener todas las reviews`, error);
    return null;
  }
};
//Obtener review
export const getReviewsByProductId = async (
  id: string
): Promise<ReviewData | null> => {
  try {
    const res = await http.get(`/reviews?product_id=${id}`);
    return res.data;
  } catch (error) {
    console.error(`Error al obtener las review del producto ${id}:`, error);
    return null;
  }
};

//Crear review
export const createReview = async (review: Review): Promise<number> => {
  try {
    const res = await http.post("/reviews", { review });
    return res.status;
  } catch (error) {
    console.error(`Error al publicar la calificación`, error);
    return 400;
  }
};
//actualizar review
export const updateReview = async (
  id: string,
  review: Review
): Promise<number> => {
  try {
    const res = await http.put(`/reviews/${id}`, { review });
    return res.status;
  } catch (error) {
    console.error(`Error al actualizar la calificación`, error);
    return 400;
  }
};
//eliminar review
export const deleteReview = async (id: string): Promise<number> => {
  try {
    const res = await http.delete(`/reviews/${id}`);
    return res.status;
  } catch (error) {
    console.error(`Error al eliminar la calificación`, error);
    return 400;
  }
};
