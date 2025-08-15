"use client";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { BiSearchAlt } from "react-icons/bi";
import { useState } from "react";
export default function SearchBar() {
  const [query, setQuery] = useState("");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const router = useRouter();
  const handleSearch = useDebouncedCallback((e: string) => {
    //Validar
    setQuery(e);
  }, 500);
  const search = () => {
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set("query", query);
    } else {
      params.delete("query");
    }
    if (!pathname.includes("/products"))
      return router.push(`/products?query=${query}`);
    else replace(`${pathname}?${params.toString()}`);
  };
  return (
    <div className="flex gap-2 rounded-md h-full">
      <input
        type="text"
        name="search"
        id="search"
        minLength={3}
        maxLength={500}
        placeholder="Buscar productos"
        className="  rounded-md h-10 w-full px-2"
        onChange={(e) => handleSearch(e.target.value.trim())}
      />
      <button className="h-10  rounded-md p-1" onClick={() => search()}>
        <BiSearchAlt size={25} />
      </button>
    </div>
  );
}
