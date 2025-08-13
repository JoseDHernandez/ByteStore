"use client";
import { BiArrowFromLeft, BiArrowFromRight } from "react-icons/bi";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
interface PaginatorProps {
  currentPage: number;
  totalPages: number;
  size: number;
}
export default function Paginator({
  currentPage,
  totalPages,
  size,
}: PaginatorProps) {
  const [actualPage, setActualPage] = useState(1);
  const pages: number[] = [];
  //Corregir el numero de la pagina
  useEffect(() => {
    if (isNaN(currentPage) || currentPage < 1) {
      setActualPage(1);
    } else if (currentPage > totalPages) {
      setActualPage(totalPages);
    } else {
      setActualPage(currentPage);
    }
  }, [currentPage, totalPages]);

  //Añadir
  const start = actualPage === 1 ? actualPage + 1 : actualPage - 1;
  for (let i = start; i <= totalPages && pages.length < size; i++) {
    if (i > 0) {
      pages.push(i);
    }
  }
  //Parametro page
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const setPageParam = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    setActualPage(page);
  };
  return (
    <div className="my-8 flex gap-2 w-max mx-auto">
      {actualPage > 1 && (
        <button
          onClick={() => setPageParam(1)}
          className="inline-block border-2 font-bold  min-w-9 text-center p-1 rounded-md hover:bg-yellow-500   hover:scale-105 transition duration-300 ease-in-out"
          title="Ir a la primer página"
          aria-label="Ir a la primer página"
        >
          <BiArrowFromRight size={25} />
        </button>
      )}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => setPageParam(page)}
          className={`inline-block border-2 font-bold  min-w-9 text-center p-2 rounded-md hover:bg-yellow-500 hover:scale-105 transition duration-300 ease-in-out ${
            actualPage == page && "bg-gray-300"
          }`}
          aria-label={`Ir a la página número: ${page}`}
        >
          {page}
        </button>
      ))}
      {size !== totalPages && actualPage < totalPages - 1 && (
        <button
          onClick={() => setPageParam(totalPages)}
          className="inline-block border-2 font-bold  min-w-9 text-center p-1 rounded-md hover:bg-yellow-500   hover:scale-105 transition duration-300 ease-in-out"
          title="Ir a la ultima página"
          aria-label="Ir a la ultima página"
        >
          <BiArrowFromLeft size={25} />
        </button>
      )}
    </div>
  );
}
