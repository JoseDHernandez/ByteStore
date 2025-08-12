import { Product } from "./product";

export type CartItem = Pick<
  Product,
  "id" | "discount" | "price" | "name" | "image" | "stock"
> & {
  quantity: number;
};
