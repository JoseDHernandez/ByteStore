import { CartItem } from "./cart";

export type ProductsOrder = Omit<CartItem, "stock">;
export type Order = {
  id?: string;
  user_id: string;
  products: ProductsOrder[];
  status: string;
  total: number;
  pay_date: string;
  delivery_date: string;
};
