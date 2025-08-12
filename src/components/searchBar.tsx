"use client";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { BiSearchAlt } from "react-icons/bi";
export default function SearchBar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const router = useRouter();
  const handleSearch = useDebouncedCallback((e: string) => {
    const params = new URLSearchParams(searchParams);

    if (e) {
      params.set("query", e);
    } else {
      params.delete("query");
    }
    if (pathname.includes("/products"))
      return router.push(`/products?query=${e}`);
    else replace(`${pathname}?${params.toString()}`);
  }, 500);
  return (
    <div className="flex gap-2">
      <input
        type="text"
        name="search"
        id="search"
        minLength={3}
        maxLength={500}
        placeholder="Buscar..."
        className=" border-2 rounded-md h-[37px] w-full px-2"
        onChange={(e) => handleSearch(e.target.value.trim())}
      />
      <button className="h-[37px] border-2 rounded-md p-1">
        <BiSearchAlt size={25} />
      </button>
    </div>
  );
}
