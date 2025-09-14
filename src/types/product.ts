import type { Processor } from "./processor";
//tipo de display
export type Display = {
  size: number;
  resolution: string;
  graphics: string;
  brand: string;
};
//sistema
export type OperatingSystem = {
  system: string;
  distribution: string;
};
//Producto
export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  stock: number;
  image: string;
  brand: string;
  model: string;
  processor: Processor;
  system: OperatingSystem;
  ram_capacity: number;
  disk_capacity: number;
  display: Display;
};
//Productos paginados
export type ProductData = {
  total: number;
  pages: number;
  first: number;
  next: number | null;
  prev: number | null;
  data: Product[];
};
//Filtros/ marcas de productos
type Item = {
  name: string;
};

export type ProductFilters = {
  brands: Item[];
  processors: Item[];
  displays: Item[];
};
//marcas
export type ProductBrands = {
  id: number;
  name: string;
};
//pantallas
export type ProductDisplays = Display & {
  id: number;
};
//sistemas
export type ProductOS = OperatingSystem & {
  id: number;
};
//procesadores
export type ProductProcessors = Processor & {
  id: number;
};
//actualizar procesador
export type ProductUpdate = Omit<
  Product,
  "processor" | "system" | "display" | "image" | "brand" | "id"
> & {
  processor_id: number;
  system_id: number;
  display_id: number;
  brand_id: number;
};
//crear producto
export type NewProduct = Omit<Product, "id"> & {};
