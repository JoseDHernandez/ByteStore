"use client";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const credentialsAction = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

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
    <form action={credentialsAction}>
      <label htmlFor="email">Correo electrónico</label>
      <input className="border-1" type="email" name="email" id="email" />

      <label htmlFor="password">Clave</label>
      <input
        className="border-1"
        type="password"
        name="password"
        id="password"
      />

      {error && <p className="text-red-500">{error}</p>}

      <input className="border-1" type="submit" value="Enviar" />
    </form>
  );
}
