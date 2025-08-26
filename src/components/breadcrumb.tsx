"use client";
import { getProductById } from "@/services/products";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Breadcrumb() {
  //Nombre de producto (si existe)
  const [productName, setProductName] = useState<string | null>(null);
  //Obtener pathname
  const pathname = usePathname();
  //Rutas excluidas
  const excludePaths = ["", "login", "register"];
  //Filtrar rutas
  const paths = pathname.split("/").filter((e) => !excludePaths.includes(e));
  //Traducción de las rutas
  const namePath: Record<string, string> = {
    products: "Productos",
    orders: "Órdenes",
    cart: "Carrito",
    account: "Cuenta",
    admin: "Administrar",
  };
  //Pagina actual
  const actualPage = paths[paths.length - 1];
  //Obtener nombre del producto
  useEffect(() => {
    if (pathname.match(/^\/products\/([A-Za-z0-9\-]+)$/)) {
      getProductById(actualPage)
        .then((res) =>
          setProductName(
            res?.name
              ? res.name + " (" + res.brand + ": " + res.model + ")"
              : null
          )
        )
        .catch(() => setProductName(null));
    } else {
      setProductName(null);
    }
  }, [pathname, actualPage, paths]);
  if (paths.length === 0) return <div className="mb-6">&nbsp;</div>;

  return (
    <nav aria-label="Migas de pan">
      <ol className="flex gap-2 mb-6 flex-wrap">
        <li>
          <Link
            href="/"
            className="after:content-['/'] after:text-p-yellow after:font-bold after:ml-2  hover:text-dark-green hover:underline transition duration-300 ease-in-out"
          >
            Inicio
          </Link>
        </li>
        {paths.map((path, index) => {
          //Si es ultimo
          const isLast = index === paths.length - 1;
          //Validaciones del path
          const isProduct = paths[0] === "products" && isLast && productName;
          const isOrder =
            pathname.match(/^\/orders\/([A-Za-z0-9\-]+)$/) && isLast;
          //Asignar texto
          let text: string;

          switch (true) {
            case !!isProduct:
              text = productName ?? path;
              break;
            case !!isOrder:
              text = `Orden: ${path}`;
              break;
            default:
              text = namePath[path] || path;
              break;
          }

          return (
            <li key={index}>
              <Link
                className={`${
                  isLast
                    ? "text-dark-blue font-semibold"
                    : " after:content-['/'] after:text-p-yellow after:font-bold after:ml-2"
                } font-medium   hover:text-dark-green hover:underline transition duration-300 ease-in-out`}
                href={`/${paths.slice(0, index + 1).join("/")}`}
                aria-current={isLast ? "location" : "false"}
              >
                {text}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
