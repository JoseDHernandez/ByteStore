import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { getUserById } from "@/services/users";
import UpdateAccountForm from "./components/updateAccountForm";
//Metadata
export const metadata = {
  title: "Cuenta - Byte store",
};
export default async function AccountPage() {
  //Obtener datos del usuario
  const session = await auth();
  const userData = await getUserById(session?.user?.id);
  if (userData === null) return notFound();
  return (
    <section className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Mi cuenta</h1>
      <UpdateAccountForm userData={userData} />
    </section>
  );
}
