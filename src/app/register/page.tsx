"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { registerSchema } from "@/schemas/usersSchemas";
import { signIn } from "next-auth/react";
import { createUser } from "@/services/users";
export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  //Action del registro
  const registerAction = async (formData: FormData) => {
    //Capturar datos
    const d = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      physical_address: formData.get("physical_address") as string,
    };
    //Validar datos
    const result = registerSchema.safeParse(d);
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    try {
      //Registrar en el servidor
      const res = await createUser(result.data);
      //En caso de error
      if (res !== 201) {
        setError("No se pudo registrar el usuario");
        return;
      }
      //Logear automáticamente
      const { email: email, password } = result.data;

      //Autenticar
      const loginRes = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      //Credenciales invalidas
      if (loginRes?.error) {
        setError("Credenciales inválidas");
      } else {
        router.push("/products");
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión");
    }
  };

  return (
    <section>
      <h1 className="text-center font-bold text-3xl mb-12">Registro</h1>
      <form
        action={registerAction}
        className="flex flex-col gap-4 w-[20rem] mx-auto"
      >
        <div>
          <label htmlFor="name">Nombre</label>
          <input
            className="border rounded-sm border-dark-gray p-1 w-full mt-2"
            type="text"
            name="name"
            id="name"
            required
          />
        </div>

        <div>
          <label htmlFor="email">Correo electrónico</label>
          <input
            className="border rounded-sm border-dark-gray p-1 w-full mt-2"
            type="email"
            name="email"
            id="email"
            required
          />
        </div>

        <div>
          <label htmlFor="password">Contraseña</label>
          <input
            className="border rounded-sm border-dark-gray p-1 w-full mt-2"
            type="password"
            name="password"
            id="password"
            required
          />
        </div>

        <div>
          <label htmlFor="physical_address">Dirección</label>
          <input
            className="border rounded-sm border-dark-gray p-1 w-full mt-2"
            type="text"
            name="physical_address"
            id="physical_address"
            required
          />
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <input
          className="p-2 text-white font-bold bg-green rounded-md w-[80%] mx-auto mt-8 hover:scale-105 transition duration-300 ease-in-out hover:bg-dark-green"
          type="submit"
          value="Registrarse"
        />
      </form>
    </section>
  );
}
