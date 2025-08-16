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
    //Validar
    const data = searchSchema.safeParse(e.trim());
    if (data.success) {
      setQuery(data.data);
      search(data.data);
    } else search("");
  }, 500);
  const search = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("query", value);
    } else {
      params.delete("query");
    }
    if (!pathname.includes("/products"))
      return router.push(`/products?query=${value}`);
    else replace(`${pathname}?${params.toString()}`);
  };
  return (
    <div className="flex gap-2 rounded-md h-full">
      <input
        type="text"
        name="search"
        id="search"
        minLength={0}
        maxLength={30}
        placeholder="Buscar productos"
        className="  rounded-md h-10 w-full px-2"
        onChange={(e) => handleSearch(e.target.value.trim())}
      />
      <button className="h-10  rounded-md p-1" onClick={() => search(query)}>
        <BiSearchAlt size={25} />
      </button>
    </div>
  );
}
