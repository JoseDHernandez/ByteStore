import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Usuario y contraseña son requeridos.");
        }
        let user = null;
        //Pendiente
        /*
         const res = await fetch(`${process.env.API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password
            })
          });
           const user = await res.json();
        if (!user) {
          throw new Error("Invalid credentials.")
        }
 
        */
        if (credentials.email !== "test@test.test")
          throw new Error("Invalid credentials.");
        user = {
          id: "01989493-0def-7f41-ab40-20b04679fbb4",
          first_name: "José",
          middle_name: "David",
          last_name: "Hernández Hortúa",
          role: 1,
          token: "",
        };
        return user;
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
