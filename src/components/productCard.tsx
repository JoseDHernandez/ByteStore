import type { Product } from "@/types/product";
import { numberFormat, getDiscount } from "@/utils/textFormatters";
import Score from "./score";
interface ProductCardProps {
  data: Product;
  className?: string;
}

export default function ProductCard({ data }: ProductCardProps) {
  const newPrice = numberFormat(getDiscount(data.price, data.discount));

  return (
    <article className="py-4 px-2 bg-white drop-shadow-xl rounded-md text-center h-full">
      <p className="text-center font-medium h-[45px]">{data.name}</p>
      <img
        src={data.image}
        width="200"
        height="200"
        alt={data.name}
        className="h-[200px] mx-auto object-contain"
        decoding="async"
        loading="lazy"
      />
      <Score qualification={4.5} className="mx-auto" />
      <p className="my-4 h-10">
        <b>{newPrice}</b>
        {data.discount > 0 && (
          <>
            <br />
            <small>
              <s>{numberFormat(data.price)}</s>
            </small>
            <span className="ml-2 font-medium">{`-${data.discount}%`}</span>
          </>
        )}
      </p>
    </article>
  );
}
