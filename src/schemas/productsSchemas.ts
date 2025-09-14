import { z } from "zod";
import { processorSchema } from "./processorSchemas";
//Actualización de un producto
export const productUpdateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(5)
    .max(40)
    .regex(/^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s\-]+$/),
  model: z
    .string()
    .trim()
    .min(5)
    .max(36)
    .regex(/^[\w\d\-\/\\]+$/),
  price: z.number().gte(100000.0).lte(20000000.0),
  discount: z.number().positive().lte(90),
  ram_capacity: z.number().gte(8).lte(128),
  disk_capacity: z.number().gte(120).lte(10000),
  stock: z.int().positive(),
  description: z
    .string()
    .min(10)
    .max(1000)
    .regex(/^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s\.\,\'\"\(\)\-\!\¡]+$/),
  processor_id: z.int().positive(),
  system_id: z.int().positive(),
  display_id: z.int().positive(),
  brand_id: z.int().positive(),
});
//crear producto
export const productRegisterSchema = z.object({
  name: z
    .string()
    .trim()
    .min(5)
    .max(40)
    .regex(/^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s\-]+$/),
  model: z
    .string()
    .trim()
    .min(5)
    .max(36)
    .regex(/^[\w\d\-\/\\]+$/),
  brand: z
    .string()
    .trim()
    .min(2)
    .max(10)
    .regex(/^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s\-]+$/),
  stock: z.int().positive(),
  price: z.number().gte(100000.0).lte(20000000.0),
  discount: z.number().gte(0).lte(90),
  ram_capacity: z.number().gte(8).lte(128),
  disk_capacity: z.number().gte(120).lte(10000),
  image: z.string().regex(/^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\-\.]+$/),
  description: z
    .string()
    .min(10)
    .max(1000)
    .regex(/^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s\.\,\'\"\(\)\-\!\¡]+$/),
  display: z.object({
    size: z.number().gte(10.0).lte(20.0),
    resolution: z
      .string()
      .trim()
      .min(2)
      .max(10)
      .regex(/^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s\-]+$/),
    brand: z
      .string()
      .trim()
      .min(3)
      .max(30)
      .regex(/^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s\-]+$/),
    graphics: z
      .string()
      .trim()
      .min(3)
      .max(30)
      .regex(/^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s\-]+$/),
  }),

  processor: processorSchema,

  system: z.object({
    system: z
      .string()
      .trim()
      .min(3)
      .max(30)
      .regex(/^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s\-]+$/),
    distribution: z
      .string()
      .trim()
      .min(3)
      .max(30)
      .regex(/^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s\-]+$/),
  }),
});
