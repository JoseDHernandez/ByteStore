"use server";
import { updateUser } from "@/services/users";
import { updateAccountSchema } from "@/schemas/usersSchemas";
import { UserUpdate } from "@/types/user";
export const updateAccount = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialState: any,
  formData: FormData
) => {
  "use server";
  const rawFormData: UserUpdate = {
    name: (formData.get("name") as string) ?? "",
    email: (formData.get("email") as string) ?? "",
    physical_address: (formData.get("physical_address") as string) ?? "",
  };

  //validar
  const validate = updateAccountSchema.safeParse(rawFormData);
  if (!validate.success) {
    return { errors: validate.error.flatten().fieldErrors };
  }
  //Actualizar
  const res = await updateUser(validate.data);
  return res === 200 ? { success: true } : { success: false };
};
