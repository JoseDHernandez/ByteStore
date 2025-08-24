"use client";
import { useState } from "react";
import { Review } from "@/types/review";
import { reviewSchema } from "@/types/zodSchemas";
import { BiCommentCheck } from "react-icons/bi";
import Score from "../../../../components/score";
import Link from "next/link";
import { postReview } from "@/services/reviews";
interface Props {
  reviewsData: Review[] | null;
  session: string | null;
  product_id: string;
}
export default function CommentSection({
  reviewsData,
  product_id,
  session,
}: Props) {
  //Comentarios
  const [reviews, setReviews] = useState<Review[] | null>(reviewsData);
  const reviewAction = async (formData: FormData) => {
    //Generar campos de la reseña
    const qualification = Number(formData.get("qualification"));
    const comment = formData.get("comment") as string;
    const user_name = session ?? "Tu comentario";
    const date = new Date(Date.now()).toISOString();
    //id local
    const id = self.crypto.randomUUID();
    const review: Review = {
      product_id,
      name: user_name,
      qualification,
      comment,
      date,
    };
    setReviews([...(reviews || []), { ...review, id: id }]);

    if (session && reviewSchema.safeParse(review)) {
      //Publicar reseña
      const res = await postReview(review);
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
    </section>
  );
}
