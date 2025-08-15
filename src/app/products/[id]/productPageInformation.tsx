"use client";
import { Product } from "@/types/product";
import { numberFormat, getDiscount } from "@/utils/textFormatters";
import { useCart } from "@/context/cartcontext";
import { BiCartAdd, BiBasket, BiCommentCheck } from "react-icons/bi";
import { useState, useEffect } from "react";
import Link from "next/link";
import CardProduct from "@/components/productCard";
import Score from "@/components/score";
import { Review } from "@/types/review";
import { useSession } from "next-auth/react";
interface Props {
  product: Product;
  products: Product[];
}
export default function ProductPageInformation({ product, products }: Props) {
  //Session
  const { data: session } = useSession();
  //Comentarios
  const [reviews, setReviews] = useState<Review[] | null>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  useEffect(() => {
    const getReviews = async () => {
      try {
        setLoadingReviews(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/reviews?product_id=${product.id}`
        );
        if (res.ok) {
          setReviews(await res.json());
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingReviews(false);
      }
    };
    getReviews();
  }, [product]);
  const reviewAction = async (formData: FormData) => {
    const qualification = Number(formData.get("qualification"));
    const comment = formData.get("comment") as string;
    const user_name = session
      ? session?.user.first_name + " " + session?.user.last_name.split(" ")[0]
      : "Tu comentario";
    const date = new Date(Date.now()).toISOString();
    const id = self.crypto.randomUUID();
    const product_id = product.id;
    const review: Review = {
      id,
      product_id,
      user_name,
      qualification,
      comment,
      date,
    };
    setReviews([...(reviews || []), review]);
    if (session) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(review),
        });
        if (!res.ok) console.log(JSON.stringify(review));
      } catch (error) {
        console.log(error);
      }
    }
  };
  //Cart
  const { addToCart, openOffCanvas } = useCart();
  const [quantity, setQuantity] = useState(0);
  const [moreQuantity, setMoreQuantity] = useState(false);
  //Calcular capacidad
  const capacity =
    product.disk_capacity > 999
      ? `${product.disk_capacity / 100} TB`
      : `${product.disk_capacity} GB`;
  const verifyQuantity = (q: number) => {
    if (q > 1 && q <= product.stock) setQuantity(q);
    else if (q <= 0) setMoreQuantity(true);
  };
  const addToCartEvent = () => {
    addToCart(product, quantity);
    product.stock = product.stock - quantity;
    setMoreQuantity(false);
    openOffCanvas(true);
  };
  return (
    <>
      <section>
        <div className="grid gap-2 lg:grid-cols-[1.5fr_2fr] lg:gap-8">
          <div className="text-balance text-center lg:flex lg:items-end">
            <h1 className="text-4xl font-semibold">{product.name}</h1>
          </div>
          <img
            src={product.image}
            alt={product.name}
            width="500"
            className="lg:order-first col-span-1 row-span-2 w-[22em]  mx-auto lg:w-full h-auto object-contain"
          />
          <div className="flex flex-col gap-4">
            <div className="grid gap-5  lg:grid-cols-2 lg:my-4">
              <div className="mx-auto lg:mx-0">
                <Score
                  qualification={4}
                  textNumber={true}
                  size={30}
                  className="text-2xl"
                />
                <p className="text-3xl font-(family-name:--font-barlow)">
                  <strong>
                    {numberFormat(getDiscount(product.price, product.discount))}
                  </strong>
                </p>
                {product.discount > 0 && (
                  <p>
                    <s className="font-(family-name:--font-barlow)">
                      {numberFormat(product.price)}
                    </s>
                    <span className="ml-3">{`- ${product.discount}%`}</span>
                  </p>
                )}
              </div>
              <div className="sm:my-4 lg:my-0">
                <label htmlFor="units-shop">Cantidad de unidades:</label>
                <br />
                {!moreQuantity ? (
                  <select
                    disabled={product.stock < 1}
                    id="units-shop"
                    className="p-2 my-2 ml-4 border-1 rounded-md w-[90%] lg:w-[60%] border-dark-gray h-10"
                    onChange={(e) => verifyQuantity(parseInt(e.target.value))}
                  >
                    <option value="1">1 unidad</option>
                    <option value="2">2 unidades</option>
                    <option value="3">3 unidades</option>
                    <option value="4">4 unidades</option>
                    <option value="5">5 unidades</option>
                    <option value="6">6 unidades</option>
                    <option value="-1">M&aacute;s unidades</option>
                  </select>
                ) : (
                  <input
                    onChange={(e) =>
                      verifyQuantity(Number(e.currentTarget.value))
                    }
                    className="p-2 my-2 ml-4 border-1 rounded-md w-[90%] lg:w-[60%] border-gray-400 h-10"
                    id="units-shop"
                    placeholder="N° de unidades"
                    size={3}
                    type="number"
                    min={1}
                    max={product.stock}
                    disabled={product.stock < 1}
                  />
                )}
                <p className="ml-4">
                  {product.stock < 1
                    ? "Sin unidades disponibles"
                    : `Unidades disponibles: ${product.stock}`}
                </p>
              </div>
            </div>
            <div className="w-full lg:mx-0 mb-4 lg:my-4 flex sm:flex-wrap gap-5 justify-center sm:justify-around lg:justify-normal">
              <button
                className="bg-dark-blue text-white  sm:w-50 flex justify-center items-center gap-2 font-bold p-3 rounded-md  hover:scale-105 transition duration-300 ease-in-out"
                onClick={() => addToCartEvent()}
                disabled={product.stock < 1}
              >
                <BiCartAdd size={25} /> <div>A&ntilde;adir al carro</div>
              </button>
              <button
                disabled={product.stock < 1}
                className="bg-green text-white  sm:w-50 flex justify-center items-center gap-2 font-bold p-3 rounded-md  hover:scale-105 transition duration-300 ease-in-out"
              >
                <BiBasket size={25} />
                {product.stock < 1 ? "No disponible" : "Comprar"}
              </button>
            </div>
            <p className="text-pretty  px-2 lg:px-0 ">{product.description}</p>
          </div>
        </div>
        <div className="space-y-5">
          <h2 className="text-3xl font-bold mt-3 mb-6">
            Caracter&iacute;sticas
          </h2>
          <div className="grid lg:grid-cols-2 gap-x-5">
            <p className="grid grid-cols-3 border-t-1 border-b-1 p-2 border-dark-gray">
              <span className="block">
                <b>Marca</b>
              </span>
              <span className="block col-span-2">{product.brand}</span>
            </p>
            <p className="grid grid-cols-3 lg:border-t-1 border-b-1 p-2 border-dark-gray">
              <span className="block">
                <b>Modelo</b>
              </span>
              <span className="block col-span-2">{product.model}</span>
            </p>
          </div>
          <h3 className="text-2xl font-bold ">
            Almacenamiento y procesamiento
          </h3>
          <div className="grid lg:grid-cols-2 gap-x-5">
            <p className="grid grid-cols-3 border-t-1 border-b-1 p-2 border-dark-gray">
              <span className="block">
                <b>Marca</b>
              </span>
              <span className="block col-span-2">
                {product.processor.brand}
              </span>
            </p>
            <p className="grid grid-cols-3 lg:border-t-1 border-b-1 p-2 border-dark-gray">
              <span className="block">
                <b>Serie</b>
              </span>
              <span className="block col-span-2">
                {product.processor.family}
              </span>
            </p>
            <p className="grid grid-cols-3 border-b-1 p-2 border-dark-gray">
              <span className="block">
                <b>Modelo</b>
              </span>
              <span className="block col-span-2">
                {product.processor.model}
              </span>
            </p>
            <p className="grid grid-cols-3 border-b-1 p-2 border-dark-gray">
              <span className="block">
                <b>N&uacute;mero de n&uacute;cleos</b>
              </span>
              <span className="block col-span-2">
                {product.processor.cores}
              </span>
            </p>
            <p className="grid grid-cols-3 border-b-1 p-2 border-dark-gray">
              <span className="block">
                <b>Almacenamiento</b>
              </span>
              <span className="block col-span-2">{capacity}</span>
            </p>
            <p className="grid grid-cols-3 border-b-1 p-2 border-dark-gray">
              <span className="block">
                <b>Velocidad</b>
              </span>
              <span className="block col-span-2">
                {product.processor.speed}
              </span>
            </p>
            <p className="grid grid-cols-3 border-b-1 p-2 border-dark-gray">
              <span className="block">
                <b>Cantidad de memoria RAM</b>
              </span>
              <span className="block col-span-2">{`${product.ram_memory} GB`}</span>
            </p>
          </div>
          <h3 className="text-2xl font-bold">Pantalla</h3>
          <div className="grid lg:grid-cols-2 gap-x-5">
            <p className="grid grid-cols-3 border-t-1 border-b-1 p-2 border-dark-gray">
              <span className="block">
                <b>Tama&ntilde;o</b>
              </span>
              <span className="block col-span-2">{product.display.size}</span>
            </p>
            <p className="grid grid-cols-3 lg:border-t-1 border-b-1 p-2 border-dark-gray">
              <span className="block">
                <b>Resoluci&oacute;n</b>
              </span>
              <span className="block col-span-2">
                {product.display.resolution}
              </span>
            </p>
            <p className="grid grid-cols-3  border-b-1 p-2 border-dark-gray">
              <span className="block">
                <b>Tarjeta de video</b>
              </span>
              <span className="block col-span-2">
                {product.display.graphics}
              </span>
            </p>
            {product.display.brand && (
              <p className="grid grid-cols-3  border-b-1 p-2 border-dark-gray">
                <span className="block">
                  <b>Marca</b>
                </span>
                <span className="block col-span-2">
                  {product.display.brand}
                </span>
              </p>
            )}
          </div>
        </div>
      </section>
      <section>
        <h2 className="font-bold text-3xl mt-8">Otros productos</h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))]  gap-5 my-5">
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`}>
              <CardProduct data={product} />
            </Link>
          ))}
        </div>
      </section>
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
                  <p>
                    <b>{review.user_name}</b>
                  </p>
                  <Score qualification={review.qualification} />
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
                  *Las calificaciones son registradas si tienes una cuenta.{" "}
                  <Link
                    href="login"
                    className="underline text-green font-medium"
                  >
                    Ingresa aqu&iacute;
                  </Link>
                </small>
              </>
            )}
          </p>
          <div className="grid grid-cols-4 grid-rows-2 gap-5 p-4 pb-0">
            <div>
              <label htmlFor="qualification" className="font-medium">
                Calificaci&oacute;n*
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
                Comentario*
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
                className="text-white bg-dark-blue px-3 py-2 flex justify-center items-center gap-4 rounded-md"
              >
                <BiCommentCheck size={25} />
                Comentar
              </button>
            </div>
          </div>
        </form>
      </section>
    </>
  );
}
