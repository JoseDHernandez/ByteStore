import Link from "next/link";
import SearchBar from "./searchBar";
import { BiUser } from "react-icons/bi";
import Cart from "./cart";
export default function Header() {
  return (
    <div>
      <div className="grid grid-cols-5 gap-5 py-2 px-20 ">
        <img src="https://placehold.co/60x60?text=logo" width="60" alt="logo" />
        <div className="col-span-3 h-max self-end">
          <SearchBar />
        </div>
        <div className="self-end flex gap-5">
          <Link href="/account" className="border-2 rounded-md p-1">
            <BiUser size={25} />
          </Link>
          <Cart />
        </div>
      </div>
      <nav>
        <ul className="list-none flex px-20 gap-10 mt-2">
          <li>
            <Link href="/">Inicio</Link>
          </li>
          <li>
            <Link href="/products">Productos</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
