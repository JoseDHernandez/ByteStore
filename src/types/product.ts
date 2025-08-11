export interface Processor {
  brand: string;
  family: string;
  processor_model: string;
  core_count: number;
  processor_speed: string;
}

export interface Display {
  size: number;
  resolution: string;
  graphics_card: string;
  brand?: string;
}

export interface Product {
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
  operating_system: string[];
  ram_memory: number;
  disk_capacity: number;
  display: Display;
}
