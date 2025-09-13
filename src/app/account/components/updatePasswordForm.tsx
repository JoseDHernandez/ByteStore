"use client";
import { useState } from "react";
import Modal from "@/components/modal";
import Alert from "@/components/alert";
import { patchPassword } from "@/services/users";
import { updatePasswordSchema } from "@/types/zodSchemas";
interface Props {
  id: string;
}

export default function UpdatePasswordForm({ id }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [stateAlert, setStateAlert] = useState({
    type: "error" as "success" | "error" | "warning" | "info",
    text: "Error al cambiar contraseña.",
    open: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    //obtener datos
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    //validar
    const data = updatePasswordSchema.safeParse({
      id,
      password,
      confirmPassword,
    });
    //mostrar errores
    if (!data.success) {
      const fieldErrors: Record<string, string> = {};
      data.error.issues.forEach((err) => {
        const field = err.path[0] as string;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    const d = data.data;
    if (!d?.id) return;
    //actualizar
    const status = await patchPassword({ id: d.id, password: d.password });
    //mensaje de éxito
    if (status === 200) {
      setModalOpen(false);
      return setStateAlert({
        type: "success",
        text: "Contraseña actualizada",
        open: true,
      });
    }
    //mensaje de error
    setModalOpen(false);
    setStateAlert({ ...stateAlert, open: true });
  };

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="bg-p-yellow p-2 rounded-md mt-4"
      >
        Cambiar contrase&ntilde;a
      </button>

      {modalOpen && (
        <Modal
          state={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Cambiar contraseña"
        >
          <form className="space-y-4 w-full" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="password" className="block mb-1">
                Nueva contrase&ntilde;a
              </label>
              <input
                required
                type="text"
                name="password"
                id="password"
                maxLength={20}
                minLength={8}
                className={`border p-2 w-full rounded ${
                  errors.password ? "border-red-500" : "border-dark-gray"
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block mb-1">
                Confirmar contrase&ntilde;a
              </label>
              <input
                required
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                maxLength={20}
                minLength={8}
                className={`border p-2 w-full rounded ${
                  errors.confirmPassword ? "border-red-500" : "border-dark-gray"
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div className="flex justify-between">
              <input
                type="reset"
                value="Limpiar"
                className="bg-dark-blue text-white p-2 rounded-md mr-4"
              />
              <input
                type="submit"
                value="Cambiar"
                className="bg-green text-white p-2 rounded-md"
              />
            </div>
          </form>
        </Modal>
      )}

      {stateAlert.open && (
        <Alert text={stateAlert.text} type={stateAlert.type} />
      )}
    </>
  );
}
