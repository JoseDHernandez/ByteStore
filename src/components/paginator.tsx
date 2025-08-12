import Link from "next/link";
interface PaginatorProps {
  path: string;
  currentPage: number;
  totalPages: number;
  size: number;
}
interface Page {
  numPage: number;
  path: string;
}
export default function Paginator({
  path,
  currentPage,
  totalPages,
  size,
}: PaginatorProps) {
  let pages: Page[] = [];
  //Corregir el numero de la pagina
  if (currentPage < 1) currentPage = 1;
  if (currentPage > totalPages) currentPage = totalPages;
  //Añadir
  let start = currentPage === 1 ? currentPage + 1 : currentPage - 1;
  for (let i = start; i <= totalPages && pages.length < size; i++) {
    if (i > 0) {
      pages.push({
        numPage: i,
        path: `${path}?page=${i}`,
      });
    }
  }

  return (
    <div className="my-8 flex gap-2 w-max mx-auto">
      {currentPage > totalPages - size && (
        <Link
          href={`${path}?page=1`}
          className="inline-block  min-w-9 text-center p-2 rounded-md hover:bg-yellow-500  bg-gray-300 hover:scale-105 transition duration-300 ease-in-out"
          title="Ir a la primer página"
        >
          &larr;
        </Link>
      )}
      {pages.map((page) => (
        <Link
          key={page.numPage}
          href={page.path}
          className={`inline-block  min-w-9 text-center p-2 rounded-md hover:bg-yellow-500 hover:scale-105 transition duration-300 ease-in-out ${
            currentPage == page.numPage ? "bg-yellow-400" : "bg-gray-300"
          }`}
        >
          {page.numPage}
        </Link>
      ))}
      {currentPage < totalPages - 1 && (
        <Link
          href={`${path}?page=${totalPages}`}
          className="inline-block  min-w-9 text-center p-2 rounded-md hover:bg-yellow-500  bg-gray-300 hover:scale-105 transition duration-300 ease-in-out"
          title="Ir a la ultima página"
        >
          &rarr;
        </Link>
      )}
    </div>
  );
}
