import { getUserById } from "@/services/users";
import { notFound } from "next/navigation";
import UserForm from "../components/userForm";

export default async function UserUpdatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await getUserById(id);
  if (!res) return notFound();
  return (
    <section>
      <h2 className="text-2xl font-bold">Actualizar usuario</h2>
      <UserForm initData={res} />
    </section>
  );
}
