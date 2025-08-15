"use client";
import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
export default function ProductsFilter() {
  //Url
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  // 0=menor, 1=relevancia, 2=mayor
  const [sortValue, setSortValue] = useState(1);

  const handleChange = (e: number) => {
    setSortValue(e);
    const params = new URLSearchParams(searchParams);
    const order = e === 0 ? "asc" : "desc";
    if (e === 0 || e === 2) {
      params.set("sort", "price");
      params.set("order", order);
    } else {
      params.delete("sort");
      params.delete("order");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <aside className="p-4 bg-white drop-shadow-xl rounded-md h-full">
      <h2 className="font-bold text-center text-2xl my-4">Filtros</h2>
      <div>
        <label htmlFor="sort-price">Ordenar por precio</label>
        <br />
        <div className="grid grid-cols-3 grid-rows-2 gap-2 items-center mb-4">
          <input
            type="range"
            name="sort-price"
            id="sort-price"
            min={0}
            max={2}
            step={1}
            className="w-full col-span-3"
            value={sortValue}
            onChange={(e) => handleChange(Number(e.target.value))}
          />
          <small>Menor precio</small>
          <small>Relevancia</small>
          <small>Mayor precio</small>
        </div>
      </div>
      <div className="mb-4">
        <p>Marca principal</p>
        <div className="grid grid-cols-[24px_1fr] gap-4 mt-2">
          <input
            type="checkbox"
            name="brand"
            id="brand-1"
            className="w-6 h-6 border-0 rounded-sm"
          />
          <label htmlFor="brand-1">Lenovo</label>

          <input
            type="checkbox"
            name="brand"
            id="brand-2"
            className="w-6 h-6 border-0 rounded-sm"
          />
          <label htmlFor="brand-2">Hewlett-Packerd &#40;HP&#41;</label>

          <input
            type="checkbox"
            name="brand"
            id="brand-3"
            className="w-6 h-6 border-0 rounded-sm"
          />
          <label htmlFor="brand-3">Asus</label>

          <input
            type="checkbox"
            name="brand"
            id="brand-4"
            className="w-6 h-6 border-0 rounded-sm"
          />
          <label htmlFor="brand-4">Apple</label>
        </div>
      </div>
      <div className="mb-4">
        <p>Marca</p>
        <div className="grid grid-cols-[24px_1fr] gap-4 mt-2">
          <input
            type="checkbox"
            name="brand"
            id="brand-1"
            className="w-6 h-6 border-0 rounded-sm"
          />
          <label htmlFor="brand-1">Intel</label>

          <input
            type="checkbox"
            name="brand"
            id="brand-2"
            className="w-6 h-6 border-0 rounded-sm"
          />
          <label htmlFor="brand-2">Amd</label>

          <input
            type="checkbox"
            name="brand"
            id="brand-3"
            className="w-6 h-6 border-0 rounded-sm"
          />
          <label htmlFor="brand-3">Nvidea</label>
        </div>
      </div>
      <button className="py-2 px-4 block mx-auto font-bold bg-green text-white rounded-md hover:scale-105 transition duration-300 ease-in-out">
        Filtrar
      </button>
    </aside>
  );
}
