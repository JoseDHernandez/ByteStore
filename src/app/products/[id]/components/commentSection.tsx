"use client";
import { useEffect, useState } from "react";
import { Review, ReviewData } from "@/types/review";
import { reviewSchema } from "@/schemas/reviewsSchemas";
import { BiCommentCheck } from "react-icons/bi";
import Score from "@/components/score";
import Link from "next/link";
import { createReview, getReviewsByProductId } from "@/services/reviews";
import Paginator from "@/components/paginator";
import { useSearchParams } from "next/navigation";
interface Props {
  session: string | null;
  product_id: string;
}
export default function CommentSection({ product_id, session }: Props) {
  //paginación
  const searchParams = useSearchParams();
  const numberPage = parseInt(searchParams.get("page") ?? "1");
  //Comentarios
  const [reviewsData, setReviewsData] = useState<ReviewData | null>(null);
  const [reviews, setReviews] = useState<Review[] | null>(null);
  useEffect(() => {
    try {
      const fetchData = async () => {
        //Obtener calificaciones
        const res = await getReviewsByProductId(product_id);
        setReviewsData(res ?? null);
      };
      fetchData();
    } catch (error) {
      console.log(error);
    }
  }, [numberPage, product_id]);
  setReviews(reviewsData ? reviewsData.data : null);
  //publicar calificación
  const reviewAction = async (formData: FormData) => {
    //Generar campos de la reseña
    const qualification = Number(formData.get("qualification"));
    const comment = formData.get("comment") as string;
    const user_name = session ?? "Tu comentario";
    const date = new Date(Date.now()).toISOString();
    //id local
    const id = self.crypto.randomUUID();
    //datos
    const review: Review = {
      product_id,
      name: user_name,
      qualification,
      comment,
      date,
    };
    //Mostrar reseña en el cliente
    setReviews([...(reviews || []), { ...review, id: id }]);

    if (session && reviewSchema.safeParse(review)) {
      //Publicar reseña
      const res = await createReview(review);
      if (res !== 201) return alert("Error al publicar reseña"); //Pendiente de componente de avisos
    }
  };
  return (
    <section>
      <h2 className="font-bold text-3xl mt-8 ">Calificaciones</h2>
      <div className="mt-6 mb-15">
        {reviews && reviews.length > 0 ? (
          reviews.map((review, index) => (
            <figure
              key={review.id}
              className={`border-dark-gray p-4 ${
                index == 0 ? "border-y-1" : "border-b-1"
              }`}
            >
              <figcaption className="flex justify-between">
                <p className="text-dark-blue">
                  <b>{review.name}</b>
                </p>
                <Score
                  qualification={review.qualification}
                  className="text-p-yellow"
                />
              </figcaption>
              <blockquote className="ml-4 mt-1">
                <p>{review.comment}</p>
              </blockquote>
            </figure>
          ))
        ) : (
          <p>No hay calificaciones para este producto, escribe una.</p>
        )}
      </div>
      <form
        action={reviewAction}
        className="border-dark-gray p-4 pb-0 border-y-1"
      >
        <p>
          <b>Tu calificaci&oacute;n</b>
          {!session && (
            <>
              <br />
              <small>
                <span className="text-p-red">*</span>Las calificaciones son
                registradas si tienes una cuenta.{" "}
                <Link href="login" className="underline text-green font-medium">
                  Ingresa aqu&iacute;
                </Link>
              </small>
            </>
          )}
        </p>
        <div className="grid grid-cols-4 grid-rows-2 gap-5 p-4 pb-0">
          <div>
            <label htmlFor="qualification" className="font-medium">
              Calificaci&oacute;n<span className="text-p-red">*</span>
            </label>
            <br />
            <input
              type="number"
              name="qualification"
              id="qualification"
              max={5}
              min={0}
              placeholder="5"
              required
              className="border-1 border-dark-gray rounded-md placeholder:text-dark-gray p-2 mt-2"
            />
          </div>
          <div className="col-span-3 row-span-2">
            <label htmlFor="comment" className="font-medium">
              Comentario<span className="text-p-red">*</span>
            </label>
            <br />
            <textarea
              name="comment"
              id="comment"
              placeholder="Escribe un comentario sobre el producto"
              required
              maxLength={1000}
              minLength={10}
              className="border-1 border-dark-gray rounded-md placeholder:text-dark-gray p-2 mt-2  resize-y w-full min-h-[60%]"
            ></textarea>
          </div>
          <div>
            <button
              type="submit"
              className="text-white bg-blue px-3 py-2 flex justify-center items-center gap-4 rounded-md hover:scale-105 transition duration-300 ease-in-out hover:bg-dark-green"
            >
              <BiCommentCheck size={25} />
              Comentar
            </button>
          </div>
        </div>
      </form>
      {/*Paginación de comentarios*/}
      {reviewsData && (
        <Paginator
          size={4}
          totalPages={reviewsData.pages}
          currentPage={numberPage}
        />
      )}
    </section>
  );
}
