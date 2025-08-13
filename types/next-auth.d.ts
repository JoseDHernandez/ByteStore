// Esto extiende el tipo User que usan tanto session() como jwt()
declare module "next-auth" {
  interface User {
    id: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    role: number;
  }

  interface Session {
    user: {
      id: string;
      first_name: string;
      middle_name: string;
      last_name: string;
      role: number;
    } & DefaultSession["user"];
  }
}

import type { JWT } from "next-auth/jwt";
declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    role: number;
  }
}
