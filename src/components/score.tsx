import { JSX } from "react";
import { BiSolidStar, BiSolidStarHalf, BiStar } from "react-icons/bi";

interface Props {
  qualification: number;
  size?: number;
  className?: string;
  textNumber?: boolean;
}

export default function Score({
  qualification,
  size,
  className,
  textNumber,
}: Props) {
  const score = Math.max(0, Math.min(5, qualification));
  const s = size ?? 20;
  const starsFull = Math.floor(score);
  const hasHalf = score % 1 >= 0.25 && score % 1 < 0.75;
  const extraFull = score % 1 >= 0.75 ? 1 : 0;
  const totalFull = starsFull + extraFull;
  const totalStars = hasHalf ? totalFull + 1 : totalFull;
  const emptyStars = 5 - totalStars;

  const stars: JSX.Element[] = [];

  // Estrellas llenas
  for (let i = 0; i < totalFull; i++) {
    stars.push(<BiSolidStar size={s} key={`full-${i}`} />);
  }

  // Media estrella
  if (hasHalf) {
    stars.push(<BiSolidStarHalf size={s} key="half" />);
  }

  // Estrellas vacías
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<BiStar size={s} key={`empty-${i}`} />);
  }

  return (
    <div className={`flex justify-items-center gap-1 w-max ${className}`}>
      {stars} {textNumber && <span className="ml-2">{`${qualification}`}</span>}
    </div>
  );
}
