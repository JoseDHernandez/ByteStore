// Esto extiende el tipo User que usan tanto session() como jwt()
declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    role: number;
    token: string;
  }

  interface Session {
    user: {
      id: string;
      name: string;
      role: number;
      token: string;
    } & DefaultSession["user"];
  }
}

import type { JWT } from "next-auth/jwt";
declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    name: string;
    role: number;
    token: string;
  }
}
