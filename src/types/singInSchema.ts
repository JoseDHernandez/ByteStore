import { object, string, email } from "zod";

export const signInSchema = object({
  email: email().min(5, "Email is required"),
  password: string()
    .min(1, "Password is required")
    .min(3, "Password must be more than 8 characters")
    .max(20, "Password must be less than 32 characters"),
});
