import { Review } from "@/types/review";
import { http } from "./http";
//Obtener review
export const getReviewsByProductId = async (
  id: string
): Promise<Review[] | null> => {
  try {
    const res = await http.get(`/reviews?product_id=${id}`);
    return res.data;
  } catch (error) {
    console.error(`Error al obtener las review del producto ${id}:`, error);
    return null;
  }
};

//Crear review
export const postReview = async (review: Review): Promise<number> => {
  try {
    const res = await http.post("/reviews", { review });
    return res.status;
  } catch (error) {
    console.error(`Error al publicar la calificación`, error);
    return 400;
  }
};
