"use client";
import { UserRegister } from "@/types/user";
import { updateAccount } from "@/actions/updateAccount";
import { useActionState } from "react";

type Errors = {
  name?: string[];
  email_address?: string[];
  physical_address?: string[];
  id?: string[];
};

const initialState: { errors: Errors; success?: undefined } = {
  errors: {},
  success: undefined,
};

interface Props {
  userData: UserRegister;
}

export default function UpdateAccountForm({ userData }: Props) {
  const [state, formAction, pending] = useActionState(
    updateAccount,
    initialState
  );

  return (
    <>
      {state.success !== undefined && (
        <p aria-live="polite">
          {state.success
            ? "Perfil actualizado"
            : "Error actualizando el perfil"}
        </p>
      )}

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="id" defaultValue={userData.id} />

        <input
          type="text"
          name="name"
          defaultValue={userData.name ?? ""}
          placeholder="Nombre"
          className="border-dark-gray border-1 p-2 w-full rounded"
          required
        />
        {Array.isArray(state?.errors?.name) && (
          <p aria-live="polite">{state.errors.name.join(", ")}</p>
        )}

        <input
          type="email"
          name="email_address"
          defaultValue={userData.email_address ?? ""}
          placeholder="Correo"
          className="border-dark-gray border-1 p-2 w-full rounded"
          required
        />
        {Array.isArray(state?.errors?.email_address) && (
          <p aria-live="polite">{state.errors.email_address.join(", ")}</p>
        )}

        <input
          type="text"
          name="physical_address"
          defaultValue={userData.physical_address ?? ""}
          placeholder="Dirección"
          className="border-dark-gray border-1 p-2 w-full rounded"
          required
        />
        {Array.isArray(state?.errors?.physical_address) && (
          <p aria-live="polite">{state.errors.physical_address.join(", ")}</p>
        )}

        <input
          type="submit"
          className="bg-green text-white p-2 rounded-md"
          value="Guardar cambios"
          disabled={pending}
        />
      </form>
    </>
  );
}
