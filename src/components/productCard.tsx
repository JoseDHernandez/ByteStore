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
    <article className="py-4 px-2 bg-white border-1 border-gray shadow-xl rounded-md text-center h-full group transition duration-300 ease-in-out hover:shadow-2xl">
      <p className="text-center font-medium h-[45px] group-hover:font-semibold">
        {data.name}
      </p>
      <div className="h-[200px] overflow-hidden">
        <img
          src={data.image}
          width="200"
          height="200"
          alt={data.name}
          className="mx-auto object-contain blur-[0.4px] group-hover:scale-110 group-hover:contrast-125 group-hover:blur-none"
          decoding="async"
          loading="lazy"
        />
      </div>
      <Score
        qualification={4.5}
        className="mx-auto text-p-yellow group-hover:text-yellow-500"
      />
      <p className="my-4 h-10 font-(family-name:--font-barlow)">
        <span className="font-medium text-lg group-hover:font-semibold">
          {newPrice}
        </span>
        {data.discount > 0 && (
          <>
            <br />
            <small className="font-light">
              <s>{numberFormat(data.price)}</s>
            </small>
          </>
        )}
      </p>
    </article>
  );
}
