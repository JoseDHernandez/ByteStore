import { auth } from "@/auth";
import { getOrdersByUserId } from "@/services/orders";
import { Order } from "@/types/order";
import { numberFormat } from "@/utils/textFormatters";
import Link from "next/link";
import { BiRightArrowAlt, BiSad } from "react-icons/bi";
export default async function OrdersPage() {
  const session = await auth();
  const orders: Order[] | null = await getOrdersByUserId(session?.user.id);

  return (
    <section>
      <h2 className="font-bold text-3xl my-8">Ordenes</h2>
      {orders !== null && orders.length > 0 ? (
        <table className="table-auto w-full border-collapse my-4">
          <thead className="bg-dark-blue text-white">
            <tr>
              <th className="p-2 text-xl">C&oacute;digo</th>
              <th className="p-2 text-xl">Fecha de pago</th>
              <th className="p-2 text-xl">Fecha de entrega</th>
              <th className="p-2 text-xl">Estado</th>
              <th className="p-2 text-xl">Precio</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <th className="p-2">{order.id.slice(0, 10)}</th>
                <td className="p-2 text-center">
                  {new Date(order.pay_date).toLocaleDateString()}
                </td>
                <td className="p-2 text-center">
                  {new Date(order.delivery_date).toLocaleDateString()}
                </td>
                <td className="p-2 text-center">{order.status}</td>
                <td className="p-2 text-center">{numberFormat(order.total)}</td>
                <td className="p-2">
                  <Link
                    href={`/orders/${order.id}`}
                    className="flex flex-row justify-around items-center"
                  >
                    <p>Ver orden completa</p>
                    <BiRightArrowAlt size={25} className="text-green" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <BiSad size={200} />
          <p className="text-center w-100">
            No tienes ordenes realizadas, regresa a la tienda o al carrito para
            terminar tu proceso de compra.
          </p>
          <Link
            href="/products"
            className="bg-green p-2  font-bold rounded-md text-white w-50 text-center"
          >
            Regresar a la tienda
          </Link>
          <Link
            href="/cart"
            className="bg-dark-blue p-2  font-bold rounded-md text-white  w-50 text-center"
          >
            Ir al carrito
          </Link>
        </div>
      )}
    </section>
  );
}
