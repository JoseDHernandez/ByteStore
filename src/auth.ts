import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "./types/zodSchemas";
import { ZodError } from "zod";
import { User } from "./types/user";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          const { email, password } = await loginSchema.parseAsync(credentials);
          const params = new URLSearchParams({ email, password });
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/users?${params.toString()}`
          );

          const userData = await res.json();

          if (userData && userData.length > 0) {
            const u = userData[0];
            const user: User = {
              id: u.id,
              name: u.name,
              role: u.role,
              token: "",
            };
            return user;
          }

          throw new Error("Credenciales invalidas");
        } catch (error) {
          if (error instanceof ZodError) {
            return null;
          }
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.role = user.role;
        token.token = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        name: token.name,
        role: token.role,
        token: token.token,
      };
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
