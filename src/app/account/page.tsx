import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { getUserById } from "@/services/users";
import UpdatePasswordForm from "./components/updatePasswordForm";
import UserAccountForm from "./components/updateAccountForm";
//Metadata
export const metadata = {
  title: "Cuenta - Byte store",
};
export default async function AccountPage() {
  //Obtener datos del usuario
  const session = await auth();
  const userId = session?.user?.id;
  const userData = await getUserById(userId);
  if (userData === null) return notFound();
  return (
    <section className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Mi cuenta</h1>
      <UserAccountForm initData={userData} />
      <article className="mt-10">
        <h2 className="text-2xl font-bold mb-6">Cambiar contrase&ntilde;a</h2>
        <p>
          Cliquea el botón de abajo para poder cambiar la contrase&ntilde;a.
        </p>
        <UpdatePasswordForm id={userId} />
      </article>
    </section>
  );
}
