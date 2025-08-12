"use client";
import { BiSearchAlt } from "react-icons/bi";
export default function SearchBar() {
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
      />
      <button className="h-[37px] border-2 rounded-md p-1">
        <BiSearchAlt size={25} />
      </button>
    </div>
  );
}
