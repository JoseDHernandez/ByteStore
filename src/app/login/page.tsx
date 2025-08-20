"use client";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { loginSchema } from "@/types/zodSchemas";
export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          errors[issue.path[0].toString()] = issue.message;
        }
      });
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setError(null);
    //Autenticar
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Credenciales inválidas");
    } else {
      router.push("/products");
    }
  };

  return (
    <section>
      <h1 className="text-center font-bold text-3xl mb-12">Ingreso</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-[20rem] mx-auto"
      >
        <div>
          <label htmlFor="email">Correo electrónico</label> <br />
          <input
            className="border-1 rounded-sm border-dark-gray p-1 w-full mt-2"
            type="email"
            name="email"
            id="email"
          />
          {fieldErrors.email && (
            <p className="text-red-500">{fieldErrors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="password">Contraseña</label> <br />
          <input
            className="border-1 rounded-sm border-dark-gray p-1 w-full mt-2"
            type="password"
            name="password"
            id="password"
          />
          {fieldErrors.password && (
            <p className="text-red-500">{fieldErrors.password}</p>
          )}
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <input
          className="p-2 text-white font-bold bg-green rounded-md w-[80%] mx-auto mt-8"
          type="submit"
          value="Enviar"
        />
      </form>
    </section>
  );
}
