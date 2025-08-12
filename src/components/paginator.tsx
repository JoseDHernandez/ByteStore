"use client";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
interface PaginatorProps {
  currentPage: number;
  totalPages: number;
  size: number;
}
interface Page {
  numPage: number;
  path: string;
}
export default function Paginator({
  currentPage,
  totalPages,
  size,
}: PaginatorProps) {
  const [actualPage, setActualPage] = useState(1);
  let pages: number[] = [];
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
  let start = actualPage === 1 ? actualPage + 1 : actualPage - 1;
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
      {actualPage > totalPages - size && (
        <button
          onClick={() => setPageParam(1)}
          className="inline-block  min-w-9 text-center p-2 rounded-md hover:bg-yellow-500  bg-gray-300 hover:scale-105 transition duration-300 ease-in-out"
          title="Ir a la primer página"
        >
          &larr;
        </button>
      )}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => setPageParam(page)}
          className={`inline-block  min-w-9 text-center p-2 rounded-md hover:bg-yellow-500 hover:scale-105 transition duration-300 ease-in-out ${
            actualPage == page ? "bg-yellow-400" : "bg-gray-300"
          }`}
        >
          {page}
        </button>
      ))}
      {actualPage < totalPages - 1 && (
        <button
          onClick={() => setPageParam(totalPages)}
          className="inline-block  min-w-9 text-center p-2 rounded-md hover:bg-yellow-500  bg-gray-300 hover:scale-105 transition duration-300 ease-in-out"
          title="Ir a la ultima página"
        >
          &rarr;
        </button>
      )}
    </div>
  );
}
