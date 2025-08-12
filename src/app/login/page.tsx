"use client";
import { signIn } from "next-auth/react";
export default function LoginPage() {
  const credentialsAction = (formData: FormData) => {
    signIn("credentials", formData);
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
      <input className="border-1" type="submit" value="Enviar" />
    </form>
  );
}
