"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { BiFilterAlt, BiX, BiTrashAlt } from "react-icons/bi";
import Link from "next/link";
export default function ProductsFilter() {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setOpen(true);
      } else {
        setOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
  //p-4 bg-white drop-shadow-2xl xl:drop-shadow-xl rounded-md h-full w-[40dvw] xl:w-[27dvw] fixed xl:static z-10 top-0 left-0 xl:z-0 xl:top-auto xl:left-auto
  return (
    <div className="relative xl:static">
      <div className="h-11 md:h-auto md:fixed">
        <button
          onClick={() => setOpen(!open)}
          className={`flex items-center p-2 font-bold bg-dark-blue text-white rounded-md md:absolute left-[-2em] top-4.5 ${
            !open ? "block" : "hidden"
          }`}
          aria-label="Abrir panel de filtros"
          disabled={open}
        >
          <BiFilterAlt size={25} />
          <span className="ml-4 block md:hidden">Filtros</span>
        </button>
      </div>
      <aside
        className={`p-4 bg-white border-1 border-gray shadow-xl rounded-2xl h-full xl:h-max w-[60dvw] max-w-[20rem]  sm:w-[50dvw] md:w-[40dvw] xl:w-[27dvw] fixed xl:static z-10 top-0 left-0 xl:z-0 xl:top-auto xl:left-auto ${
          !open ? "hidden" : ""
        }`}
      >
        <div className="flex gap-5 items-center mb-4">
          <div>
            <button
              onClick={() => setOpen(!open)}
              className="p-2 font-bold bg-dark-blue text-white rounded-md xl:hidden"
              aria-label="Abrir panel de filtros"
            >
              <BiX size={25} />
            </button>
          </div>
          <h2 className="font-bold text-center text-2xl w-full">Filtros</h2>
        </div>
        <div className="overflow-y-scroll h-[70dvh] xl:h-max xl:overflow-y-auto">
          <label htmlFor="sort-price">Ordenar por precio</label>
          <br />
          <select
            id="sort-price"
            className=" border border-dark-gray rounded-md p-2 my-2 w-full"
            value={sortValue}
            onChange={(e) => handleChange(Number(e.target.value))}
          >
            <option value={0}>Menor precio</option>
            <option value={1}>Relevancia</option>
            <option value={2}>Mayor precio</option>
          </select>
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
                id="brand-5"
                className="w-6 h-6 border-0 rounded-sm"
              />
              <label htmlFor="brand-5">Intel</label>

              <input
                type="checkbox"
                name="brand"
                id="brand-6"
                className="w-6 h-6 border-0 rounded-sm"
              />
              <label htmlFor="brand-6">Amd</label>

              <input
                type="checkbox"
                name="brand"
                id="brand-7"
                className="w-6 h-6 border-0 rounded-sm"
              />
              <label htmlFor="brand-7">Nvidea</label>
            </div>
          </div>
        </div>
        <div className="flex gap-4  xl:flex-wrap ">
          <Link
            aria-label="Eliminar filtros"
            href="/products"
            className="my-4 w-full xl:w-max py-2 px-4 block font-bold bg-blue text-white rounded-md hover:bg-dark-blue hover:scale-105 transition duration-300 ease-in-out"
          >
            <BiTrashAlt size={25} />
          </Link>
          <button className="my-4 w-full xl:w-max py-2 px-4 block font-bold bg-green text-white rounded-md hover:bg-dark-green transition duration-300 ease-in-out">
            Filtrar
          </button>
        </div>
      </aside>
    </div>
  );
}
