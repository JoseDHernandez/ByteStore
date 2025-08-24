import { notFound } from "next/navigation";
import { numberFormat, getDiscount } from "@/utils/textFormatters";
import Link from "next/link";
import CardProduct from "@/components/productCard";
import Score from "@/components/score";
import PayButton from "@/components/payButton";
import { getReviewsByProductId } from "@/services/reviews";
import CommentSection from "./components/commentSection";
import { auth } from "@/auth";
import { getProductById, getProductsLimited } from "@/services/products";
import { CartItemProvider } from "@/context/cartItemContext";
import { ChangeQuantity } from "./components/changeQuantity";
import { AddCartButton } from "./components/addCartButton";
import Image from "next/image";
export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  //Obtener id del producto desde los parámetros
  const { id } = await params;
  //Obtener nombre de usuario
  const session = await auth();
  const username =
    session?.user?.name?.split(" ").slice(0, 2).join(" ") ?? null;
  //Obtener datos de los productos
  const product = await getProductById(id);
  const products = await getProductsLimited(5);
  if (product === null || products === null) notFound();
  //Obtener calificaciones
  const reviews = await getReviewsByProductId(product.id);

  const capacity =
    product.disk_capacity > 999
      ? `${product.disk_capacity / 100} TB`
      : `${product.disk_capacity} GB`;

  return (
    <main>
      <section>
        <div className="grid gap-2 lg:grid-cols-[1.5fr_2fr] lg:gap-8">
          <div className="text-balance text-center lg:flex lg:items-end">
            <h1 className="text-4xl font-semibold">{product.name}</h1>
          </div>
          <Image
            src={product.image}
            alt={product.name}
            width="500"
            height="500"
            className="lg:order-first col-span-1 row-span-2 w-[22em]  mx-auto lg:w-full h-auto object-contain"
            priority={true}
          />
          <CartItemProvider product={product}>
            <div className="flex flex-col gap-4">
              <div className="grid gap-5  lg:grid-cols-2 lg:my-4">
                <div className="mx-auto lg:mx-0">
                  <Score
                    qualification={4}
                    size={30}
                    className="text-2xl text-p-yellow"
                  />
                  <p className="text-3xl font-(family-name:--font-barlow)">
                    <strong>
                      {numberFormat(
                        getDiscount(product.price, product.discount)
                      )}
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
                <ChangeQuantity />
              </div>
              <div className="w-full lg:mx-0 mb-4 lg:my-4 flex sm:flex-wrap gap-5 justify-center sm:justify-around lg:justify-normal">
                <AddCartButton />
                <PayButton
                  disabled={product.stock < 1}
                  text={product.stock < 1 ? "No disponible" : "Comprar"}
                  product={product}
                />
              </div>
              <p className="text-pretty  px-2 lg:px-0 ">
                {product.description}
              </p>
            </div>
          </CartItemProvider>
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
      <CommentSection
        reviewsData={reviews}
        product_id={product.id}
        session={username}
      />
    </main>
  );
}
