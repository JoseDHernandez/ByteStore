import type { Product } from "@/types/product";
import { numberFormat, getDiscount } from "@/utils/textFormatters";
interface CardProductProps {
  data: Product;
  className?: string;
}

export default function CardProduct({ data }: CardProductProps) {
  const newPrice = numberFormat(getDiscount(data.price, data.discount));

  return (
    <article className="p-2 bg-white shadow-xl rounded-2xl text-center h-full relative">
      <img
        src={data.image}
        width="200"
        height="200"
        alt={data.name}
        className="h-[200px] mx-auto"
        decoding="async"
        loading="lazy"
      />
      <p className="h-[45px] mt-2 text-balance ">{data.name}</p>
      <p className="my-4 h-10">
        <span className="font-semibold">{newPrice}</span>
        {data.discount > 0 && (
          <>
            <br />
            <span className="text-gray-600">
              <small>
                <s>{numberFormat(data.price)}</s>
              </small>
            </span>
          </>
        )}
      </p>
      {data.discount > 0 && (
        <p className="text-sm bg-yellow-500 font-semibold  inline-block py-1 px-2 rounded-sm absolute top-5 right-5 opacity-75">{`- ${data.discount}%`}</p>
      )}
    </article>
  );
}
