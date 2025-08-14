import { auth } from "@/auth";
import type { User } from "@/types/user";
import { notFound } from "next/navigation";
import AccountForm from "./accountForm";
export default async function AccountPage() {
  const session = await auth();
  let data: User | null = null;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/${session?.user.id}`
    );
    if (!res.ok) notFound();
    data = await res.json();
    console.log(data);
  } catch (error) {
    return notFound();
  }
  if (data === null) return notFound();
  return (
    <section className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Mi cuenta</h1>
      <AccountForm user={data} />
    </section>
  );
}
