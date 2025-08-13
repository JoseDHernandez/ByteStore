"use client";
import { Product } from "@/types/product";
import { numberFormat } from "@/utils/textFormatters";
import Link from "next/link";
import { useEffect, useState } from "react";
import TableSkeleton from "@/ui/skeletons/tableSkeleton";
import { BiEditAlt } from "react-icons/bi";
import { BiEraser } from "react-icons/bi";
interface Props {
  numberPage: number;
  productsPerPage: number;
}
export default function ProductsTable({ numberPage, productsPerPage }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products?_page=${numberPage}&_per_page=${productsPerPage}`
        );
        if (!res.ok) {
          setError(true);
          return;
        }
        const data = await res.json();
        setProducts(data.data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [numberPage, productsPerPage]);

  if (error) {
    return <p>Error al cargar los productos.</p>;
  }
  if (loading) {
    return <TableSkeleton columns={3} rows={productsPerPage} size={70} />;
  }
  return (
    <table className="table-auto w-full border-collapse my-4">
      <thead className="border-b-2 border-gray-300">
        <tr>
          <th colSpan={2} className="p-2 text-xl">
            Producto
          </th>
          <th className="p-2 text-xl">Unidades</th>
          <th className="p-2 text-xl">Precio</th>
          <th className="p-2 text-xl">Descuento</th>
          <th className="p-2 text-xl">Opciones</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id} className="border-t-1 border-gray-300">
            <td className="p-2">
              <img
                src={product.image}
                alt={product.name}
                width={70}
                height={70}
              />
            </td>
            <td className="p-2">
              <b>{product.name}</b>
              <br />
              {`${product.brand} ${product.model}`}
            </td>
            <td className="p-2 text-center">{product.stock}</td>
            <td className="p-2 text-center">{numberFormat(product.price)}</td>
            <td className="p-2 text-center">
              {product.discount > 0
                ? product.discount.toString().concat(" %")
                : 0}
            </td>
            <td className="p-2">
              <div className="flex justify-around ">
                <button className="inline-block mx-auto p-1 border-2 rounded-md hover:bg-yellow-500 hover:scale-105 transition duration-300 ease-in-out">
                  <BiEraser size={30} />
                </button>
                <Link
                  href={`/admin/product/${product.id}`}
                  className="inline-block mx-auto p-1 border-2 rounded-md hover:bg-yellow-500 hover:scale-105 transition duration-300 ease-in-out"
                >
                  <BiEditAlt size={30} />
                </Link>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
