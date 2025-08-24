"use client";

import { usePathname } from "next/navigation";
import { BiLastPage, BiFirstPage } from "react-icons/bi";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
interface PaginatorProps {
  perPages?: number;
  size: number;
  currentPage: number;
}
export default function Paginator({
  perPages,
  size,
  currentPage,
}: PaginatorProps) {
  const path = usePathname();
  // totalPages debería ser consultado desde la base de datos indicando cuantos registros tiene en endpoint consultado
  const items = 51;
  const totalPages = Math.ceil(items / (perPages ?? 11));
  const urlParams = useSearchParams();
  const pages: number[] = [];
  //Corregir el numero de la pagina
  const actualPage = currentPage > totalPages ? totalPages : currentPage;
  //Añadir
  const start = actualPage === 1 ? actualPage + 1 : actualPage - 1;
  for (let i = start; i <= totalPages && pages.length < size; i++) {
    if (i > 0) {
      pages.push(i);
    }
  }
  //Parámetro page
  const buildPageUrl = (page: number) => {
    const params = new URLSearchParams(urlParams.toString());
    params.set("page", page.toString());
    return `${path}?${params.toString()}`;
  };
  return (
    <div className="my-8 flex gap-2 w-max mx-auto">
      {actualPage > 2 && (
        <Link
          href={buildPageUrl(1)}
          className="inline-block border-1 border-gray   min-w-9 text-center py-2 px-1 rounded-md hover:bg-green hover:text-white   hover:scale-105 transition duration-300 ease-in-out"
          title="Ir a la primer página"
          aria-label="Ir a la primer página"
        >
          <BiFirstPage size={25} />
        </Link>
      )}
      {pages.map((page) => (
        <Link
          key={page}
          href={buildPageUrl(page)}
          className={`inline-block border-1 border-gray   min-w-9 text-center p-2 rounded-md hover:bg-green hover:text-white hover:scale-105 transition duration-300 ease-in-out ${
            actualPage == page && "bg-blue text-white"
          }`}
          aria-label={`Ir a la página número: ${page}`}
        >
          {page}
        </Link>
      ))}
      {size !== totalPages && actualPage < totalPages - 1 && (
        <Link
          href={buildPageUrl(totalPages)}
          className="inline-block border-1 border-gray   min-w-9 text-center py-2 px-1 rounded-md hover:bg-green hover:text-white   hover:scale-105 transition duration-300 ease-in-out"
          title="Ir a la ultima página"
          aria-label="Ir a la ultima página"
        >
          <BiLastPage size={25} />
        </Link>
      )}
    </div>
  );
}
