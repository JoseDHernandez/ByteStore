import { z } from "zod";
//Barra de búsqueda
export const searchSchema = z
  .string()
  .trim()
  .min(3)
  .max(30)
  .regex(/^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s]+$/);
//Formulario de comentario
export const reviewSchema = z.object({
  product_id: z.uuidv7(),
  user_name: z
    .string()
    .min(5)
    .max(50)
    .regex(/^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s]+$/),
  qualification: z.number().max(5),
  comment: z
    .string()
    .min(10)
    .max(1000)
    .regex(/^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s\.\,\'\"\(\)]+$/),
  date: z.date(),
});
//Formulario de ingreso
export const loginSchema = z.object({
  email: z
    .email("Email inválido")
    .trim()
    .min(5, "El email debe tener al menos 5 caracteres")
    .max(300, "El email no puede exceder 300 caracteres")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email no válido"),

  password: z
    .string("Contraseña requerida")
    .trim()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(20, "La contraseña no debe exceder los 20 caracteres")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,20}$/,
      "La contraseña debe tener mayúsculas, minúsculas, número y carácter especial"
    ),
});
//Formulario de registro
export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(6, "Debe tener al menos 6 caracteres")
    .max(100, "No puede exceder 20 caracteres")
    .regex(
      /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
      "Solo letras y espacios para el nombre"
    ),
  email: z
    .email("Email inválido")
    .trim()
    .min(5, "El email debe tener al menos 5 caracteres")
    .max(300, "El email no puede exceder 300 caracteres")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email no válido"),
  password: z
    .string()
    .trim()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(20, "La contraseña no debe exceder los 20 caracteres")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,20}$/,
      "La contraseña debe incluir mayúscula, minúscula, número y carácter especial"
    ),
  physical_address: z
    .string()
    .trim()
    .min(2, "La dirección es muy corta")
    .max(100, "La dirección no debe exceder 100 caracteres")
    .regex(
      /^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s\.\,'"#°\-]+$/,
      "Caracteres inválidos en la dirección"
    ),
});
//Formulario de actualizar cuenta
export const updateAccountSchema = z.object({
  id: z.string().trim().min(7).max(36),
  name: z
    .string()
    .trim()
    .min(6, "Debe tener al menos 6 caracteres")
    .max(100, "No puede exceder 20 caracteres")
    .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, "Solo letras y espacios"),
  email: z
    .email("Email inválido")
    .trim()
    .min(5, "El email debe tener al menos 5 caracteres")
    .max(300, "El email no puede exceder 300 caracteres")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email no válido"),
  physical_address: z
    .string()
    .trim()
    .min(2, "La dirección es muy corta")
    .max(100, "La dirección no debe exceder 100 caracteres")
    .regex(/^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s\.\,'"#°\-]+$/, "Caracteres inválidos"),
});
