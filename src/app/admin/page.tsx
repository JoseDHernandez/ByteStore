"use client";
import { Product } from "@/types/product";
import { numberFormat } from "@/utils/textFormatters";
import Link from "next/link";
import { useEffect, useState } from "react";
import TableSkeleton from "@/components/skeletons/tableSkeleton";
import { BiEditAlt, BiLink, BiEraser } from "react-icons/bi";
import Modal from "../../components/modal";
import Paginator from "@/components/paginator";
import { useSearchParams } from "next/navigation";
export default function ProductsTable() {
  const searchParams = useSearchParams();
  const numberPage = parseInt(searchParams.get("page") ?? "1");
  const [products, setProducts] = useState<Product[]>([]);
  //En caso de error
  const [error, setError] = useState(false);
  //Mostrar esqueleto de la tabla
  const [loading, setLoading] = useState(true);
  //Producto a eliminar
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  //Estado del modal
  const [modalOpen, setModalOpen] = useState(false);
  //Total de páginas
  const [totalPages, setTotalPages] = useState(0);
  //Productos por página
  const [productsPerPage, setProductsPerPage] = useState(15);
  //Cantidad total de productos en la db
  const [quantityOfProducts, setQuantityOfProducts] = useState(20);
  //Cantidad de productos por página (input)
  const [quantityInput, setQuantityInput] = useState(10);

  const openModal = (product: Product) => {
    setModalProduct(product);
    setModalOpen(true);
  };

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
        setTotalPages(data.pages);
        setQuantityOfProducts(data.items);
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
  //Para eliminar producto
  const handleDeleteConfirm = async () => {
    if (!modalProduct) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${modalProduct.id}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Error eliminando producto");
      setProducts((prev) => prev.filter((p) => p.id !== modalProduct.id));
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar el producto");
    } finally {
      setModalOpen(false);
      setModalProduct(null);
    }
  };
  //Productos por pagina
  const handleProductsPerPage = () => {
    if (quantityInput >= 10 && quantityInput <= quantityOfProducts)
      setProductsPerPage(quantityInput);
  };
  return (
    <section>
      <h2>Administración de productos</h2>
      <div>
        <span>
          <label htmlFor="quantity">Cantidad de registros por página</label>
          <input
            type="number"
            name="quantity"
            id="quantity"
            min={10}
            defaultValue={10}
            className="border-1"
            onChange={(e) => setQuantityInput(parseInt(e.target.value.trim()))}
          />
        </span>
        <button className="border-1" onClick={() => handleProductsPerPage()}>
          Cambiar
        </button>
      </div>
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
                  <button
                    onClick={() => openModal(product)}
                    className="inline-block mx-auto p-1 border-2 rounded-md hover:bg-yellow-500 hover:scale-105 transition duration-300 ease-in-out"
                  >
                    <BiEraser size={30} />
                  </button>
                  <Link
                    href={`/products/${product.id}`}
                    className="inline-block mx-auto p-1 border-2 rounded-md hover:bg-yellow-500 hover:scale-105 transition duration-300 ease-in-out"
                  >
                    <BiLink size={30} />
                  </Link>
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
      {modalOpen && modalProduct && (
        <Modal state={modalOpen} onClose={() => setModalOpen(false)}>
          <p>
            ¿Está seguro de eliminar el producto <b>{modalProduct.name}</b>?
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <button
              className="px-4 py-2 bg-red-500 text-white rounded"
              onClick={handleDeleteConfirm}
            >
              Eliminar
            </button>
            <button
              className="px-4 py-2 border rounded"
              onClick={() => setModalOpen(false)}
            >
              Cancelar
            </button>
          </div>
        </Modal>
      )}

      <Paginator size={3} currentPage={numberPage} totalPages={totalPages} />
    </section>
  );
}
