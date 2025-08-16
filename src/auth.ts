import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "./types/zodSchemas";
import { ZodError } from "zod";

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
            const user = {
              id: u.id,
              first_name: u.first_name,
              middle_name: u.middle_name,
              last_name: u.last_name,
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
        token.first_name = user.first_name;
        token.middle_name = user.middle_name;
        token.last_name = user.last_name;
        token.role = user.role;
        token.token = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        first_name: token.first_name,
        middle_name: token.middle_name,
        last_name: token.last_name,
        role: token.role,
        token: token.token,
      };
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
