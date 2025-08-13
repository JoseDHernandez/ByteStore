"use client";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
export default function LoginPage() {
  const { data: session } = useSession();

  return (
    <div>
      page <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}
