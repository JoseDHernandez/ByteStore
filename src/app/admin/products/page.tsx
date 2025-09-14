"use client";
import Image from "next/image";
import { Product, ProductData } from "@/types/product";
import { numberFormat } from "@/utils/textFormatters";
import Link from "next/link";
import { useEffect, useState } from "react";
import TableSkeleton from "@/components/skeletons/tableSkeleton";
import { BiTrashAlt, BiShow, BiPencil } from "react-icons/bi";
import Modal from "../../../components/modal";
import Paginator from "@/components/paginator";
import {
  notFound,
  useSearchParams,
  usePathname,
  useRouter,
} from "next/navigation";
import { searchSchema } from "@/schemas/searchSchema";
import { deleteProductById, getProductsBySearch } from "@/services/products";
import { useDebouncedCallback } from "use-debounce";
import { productURL } from "@/utils/productURLFormatters";
export default function ProductsTable() {
  const searchParams = useSearchParams();
  const numberPage = parseInt(searchParams.get("page") ?? "1");
  const searchQuery = searchParams.get("query") ?? "";
  const [products, setProducts] = useState<ProductData>();
  //En caso de error
  const [error, setError] = useState(false);
  //Mostrar esqueleto de la tabla
  const [loading, setLoading] = useState(true);
  //Producto a eliminar
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  //Estado del modal
  const [modalOpen, setModalOpen] = useState(false);
  //Productos por página
  const [productsPerPage, setProductsPerPage] = useState(15);
  //Buscador
  const [query, setQuery] = useState("");
  const pathname = usePathname();
  const { replace } = useRouter();
  //productos
  const handleProductsPerPage = useDebouncedCallback((q: number) => {
    if (q >= 10 && q <= 100) setProductsPerPage(q);
  }, 500);
  //buscador
  const handleSearch = useDebouncedCallback((e: string) => {
    const data = searchSchema.safeParse(e.trim());
    if (data.success) {
      setQuery(data.data);
      search(data.data);
    } else {
      search("");
    }
  }, 500);
  //abrir modal
  const openModal = (product: Product) => {
    setModalProduct(product);
    setModalOpen(true);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProductsBySearch({
          numberPage,
          query: searchQuery,
          limit: productsPerPage,
        });
        if (data === null) return notFound();
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [numberPage, productsPerPage, searchQuery]);
  //buscar
  const search = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("query", value.replaceAll(" ", ","));
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  };
  if (error) {
    return <p>Error al cargar los productos.</p>;
  }

  //Para eliminar producto
  const handleDeleteConfirm = async () => {
    if (products == null || !modalProduct) return;
    try {
      const res = await deleteProductById(modalProduct.id);
      if (res !== 200) return alert("Error eliminando producto");
      //eliminar del cliente
      setProducts({
        ...products,
        data: products.data.filter((e) => e.id !== modalProduct.id),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setModalOpen(false);
      setModalProduct(null);
    }
  };

  return (
    <section>
      <h2 className="font-bold text-3xl mb-4">Gestor de productos</h2>
      <div className="flex justify-between flex-wrap gap-4">
        <input
          defaultValue={query}
          type="search"
          name="query"
          minLength={3}
          maxLength={50}
          placeholder="Buscar producto registrado"
          className="border rounded-md h-full w-[80%] p-2 border-gray-400"
          onChange={(e) => handleSearch(e.target.value.trim())}
        />
        <Link
          href="/admin/products/new"
          className="bg-green p-2 rounded-md text-white "
        >
          Nuevo producto
        </Link>
      </div>
      <div className=" flex gap-4 items-center mt-4">
        <label htmlFor="quantity">Limite de registros por página</label>
        <input
          type="number"
          name="quantity"
          id="quantity"
          min={10}
          max={100}
          defaultValue={productsPerPage}
          className="border-b border-dark-gray p-y-2 w-15 text-center"
          onChange={(e) =>
            handleProductsPerPage(parseInt(e.target.value.trim()))
          }
        />
      </div>
      {loading && (
        <TableSkeleton columns={4} rows={productsPerPage} size={90} />
      )}
      {products && products.data.length > 0 ? (
        <>
          <div className="overflow-x-scroll lg:overflow-x-auto">
            <table className="table-auto w-full border-collapse my-4">
              <thead className="bg-dark-blue text-white">
                <tr>
                  <th colSpan={2} className="p-2 text-lg">
                    Producto
                  </th>
                  <th className="p-2 text-lg">Unidades</th>
                  <th className="p-2 text-lg">Precio</th>
                  <th className="p-2 text-lg">Descuento</th>
                  <th className="p-2 text-lg">Opciones</th>
                </tr>
              </thead>
              <tbody>
                {products.data.map((product) => (
                  <tr key={product.id} className="border-t-1 border-gray-300">
                    <td className="p-2">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={70}
                        height={70}
                      />
                    </td>
                    <td className="p-2">
                      <p className="flex flex-col justify-around">
                        <b>{product.name}</b>
                        {`${product.brand} ${product.model}`}
                      </p>
                    </td>
                    <td className="p-2 text-center">{product.stock}</td>
                    <td className="p-2 text-center">
                      {numberFormat(product.price)}
                    </td>
                    <td className="p-2 text-center">
                      {product.discount > 0
                        ? product.discount.toString().concat(" %")
                        : 0}
                    </td>
                    <td className="p-2">
                      <div className="flex justify-around">
                        <button
                          onClick={() => openModal(product)}
                          className="block p-1 rounded-md  hover:scale-105 transition duration-300 ease-in-out hover:bg-red-600 hover:text-white"
                          title="Eliminar este producto"
                          aria-label={`Eliminar ${product.name}`}
                        >
                          <BiTrashAlt size={30} />
                        </button>
                        <Link
                          href={`/products/${productURL(
                            product.id,
                            product.name
                          )}`}
                          className="block p-1 rounded-md  hover:scale-105 transition duration-300 ease-in-out hover:text-white hover:bg-dark-blue"
                          title="Ver página del producto"
                          aria-label={`Ir a la página del producto ${product.name}`}
                        >
                          <BiShow size={30} />
                        </Link>
                        <Link
                          href={`/admin/products/${productURL(
                            product.id,
                            product.name
                          )}`}
                          className="block p-1 rounded-md  hover:scale-105 transition duration-300 ease-in-out hover:text-white hover:bg-green"
                          title="Editar producto"
                          aria-label={`Editar ${product.name}`}
                        >
                          <BiPencil size={30} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {modalOpen && modalProduct && (
            <Modal
              state={modalOpen}
              onClose={() => setModalOpen(false)}
              title="Eliminar producto"
            >
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

          <Paginator
            size={3}
            totalPages={products.pages}
            currentPage={numberPage}
          />
        </>
      ) : query.length === 0 ? (
        <p>Error al cargar los productos</p>
      ) : (
        <p className="mt-4">
          No se encontraron productos para los términos:
          <br />
          <span className="italic ml-4">
            {" "}
            {searchQuery.split(",").join(", ")}
          </span>
        </p>
      )}
    </section>
  );
}
