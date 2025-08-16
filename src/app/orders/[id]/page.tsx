import { Order, ProductsOrder } from "@/types/order";
import { notFound } from "next/navigation";
import CartItemComponent from "@/components/cartItemComponent";
import Link from "next/link";
import { numberFormat } from "@/utils/textFormatters";
export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  //Obtener datos del producto
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`);
  if (!res.ok) notFound();
  const order: Order = await res.json();

  return (
    <section>
      <h2 className="text-3xl my-8">
        <span className="font-bold ">Orden: </span> {order.id}
      </h2>
      <div className="flex flex-col xl:flex-row justify-between items-start gap-10">
        <div className="w-full mx-auto">
          <h3>Artículos adquiridos</h3>
          <div className="w-full mx-auto">
            {order.products.map((p: ProductsOrder, index) => (
              <CartItemComponent
                key={p.id + order.id}
                product={p}
                className={index > 0 ? "border-t-0" : ""}
              />
            ))}
          </div>
        </div>
        <div className="bg-white shadow-xl rounded-xl p-8 w-full  xl:w-[60vw] max-w-170 space-y-4">
          <h3 className="font-bold text-xl">Información de la compra</h3>
          <div className="grid grid-cols-[45%_1fr] gap-x-2 gap-y-4 items-center">
            <span className="font-medium">Identificador:</span>
            <span>{order.id}</span>
            <span className="font-medium">Fecha de pago:</span>
            <span>{new Date(order.pay_date).toLocaleDateString()}</span>
            <span className="font-medium">
              Fecha de entrega: <br />
              <small>&#40;estimada&#41;</small>
            </span>
            <span>{new Date(order.delivery_date).toLocaleDateString()}</span>
            <span className="font-medium">Estado:</span>
            <span>{order.status}</span>
            <span className="font-bold">Total:</span>
            <span className="font-(family-name:--font-barlow)">
              {numberFormat(order.total)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
