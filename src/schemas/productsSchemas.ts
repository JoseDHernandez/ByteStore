import { z } from "zod";
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
  description: z
    .string()
    .min(10)
    .max(1000)
    .regex(/^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s\.\,\'\"\(\)\-]+$/),
  processor_id: z.int().gte(1),
  system_id: z.int().gte(1),
  display_id: z.int().gte(1),
  brand_id: z.int().gte(1),
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
  price: z.number().gte(100000.0).lte(20000000.0),
  discount: z.number().positive().lte(90),
  ram_capacity: z.number().gte(8).lte(128),
  disk_capacity: z.number().gte(120).lte(10000),
  description: z
    .string()
    .min(10)
    .max(1000)
    .regex(/^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s\.\,\'\"\(\)\-]+$/),
  display: {
    size: z.number().gte(10.0).lte(20.0),
    resolution: z
      .string()
      .trim()
      .min(2)
      .max(10)
      .regex(/^[\w\d\s]+$/),
    brand: z
      .string()
      .trim()
      .min(3)
      .max(30)
      .regex(/^[\w\d\s]+$/),
    graphics: z
      .string()
      .trim()
      .min(3)
      .max(30)
      .regex(/^[\w\d\s]+$/),
  },

  processor: {
    brand: z
      .string()
      .trim()
      .min(3)
      .max(30)
      .regex(/^[\w\d]+$/),
    family: z
      .string()
      .trim()
      .min(3)
      .max(30)
      .regex(/^[\w\d\s]+$/),
    model: z
      .string()
      .trim()
      .min(3)
      .max(30)
      .regex(/^[\w\d\-]+$/),
    cores: z.int().gte(4).lte(64),
    speed: z
      .string()
      .min(10)
      .max(200)
      .regex(/^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s\.\,\-\)\(\\)]+$/),
  },

  system: {
    system: z
      .string()
      .trim()
      .min(3)
      .max(30)
      .regex(/^[\w\d\s]+$/),
    distribution: z
      .string()
      .trim()
      .min(3)
      .max(30)
      .regex(/^[\w\d\s]+$/),
  },
});
