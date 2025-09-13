"use client";

import { usePathname } from "next/navigation";
import { BiLastPage, BiFirstPage } from "react-icons/bi";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
interface PaginatorProps {
  currentPage: number;
  totalPages: number;
  size?: number;
}

export default function Paginator({
  currentPage,
  totalPages,
  size = 3,
}: PaginatorProps) {
  const path = usePathname();
  //Corregir el numero de la pagina
  if (currentPage < 1) currentPage = 1;
  if (currentPage > totalPages) currentPage = totalPages;
  // totalPages debería ser consultado desde la base de datos indicando cuantos registros tiene en endpoint consultado
  const urlParams = useSearchParams();
  const pages: number[] = [];
  //Añadir
  const start = currentPage === 1 ? currentPage + 1 : currentPage - 1;
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
      {currentPage > 2 && (
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
            currentPage == page && "bg-blue text-white"
          }`}
          aria-label={`Ir a la página número: ${page}`}
        >
          {page}
        </Link>
      ))}
      {size !== totalPages && currentPage < totalPages - 1 && (
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
