"use client";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { BiSearchAlt } from "react-icons/bi";
import { useState } from "react";
import { searchSchema } from "@/types/zodSchemas";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const router = useRouter();

  const handleSearch = useDebouncedCallback((e: string) => {
    const data = searchSchema.safeParse(e.trim());
    if (data.success) {
      setQuery(data.data);
      search(data.data);
    } else {
      search("");
    }
  }, 500);

  const search = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("query", value);
    } else {
      params.delete("query");
    }
    if (!pathname.includes("/products")) {
      return router.push(`/products?query=${value}`);
    } else {
      replace(`${pathname}?${params.toString()}`);
    }
  };

  return (
    <div className="flex gap-2 rounded-md h-full" role="search">
      <label htmlFor="search" className="sr-only">
        Buscar productos
      </label>

      <input
        type="search"
        name="search"
        id="search"
        minLength={0}
        maxLength={30}
        placeholder="Buscar productos"
        aria-label="Campo de texto para buscar productos"
        className="rounded-md h-10 w-full px-2 border-1 border-transparent hover:border-dark-gray transition duration-200 ease-linear"
        onChange={(e) => handleSearch(e.target.value.trim())}
      />

      <button
        type="button"
        aria-label="Ejecutar búsqueda"
        className="h-10 rounded-md p-1 hover:text-dark-blue transition duration-300 ease-in-out hover:scale-105"
        onClick={() => search(query)}
      >
        <BiSearchAlt size={25} aria-hidden="true" focusable="false" />
      </button>
    </div>
  );
}
