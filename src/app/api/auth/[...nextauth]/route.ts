import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import client from "@/utils/db";
import { verifyPassword } from "@/utils/password";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", required: true },
        password: { label: "Password", required: true },
      },
      async authorize(credentials) {
        await client.connect();
        const db = client.db();
        const user = await db.collection("users").findOne({ email: credentials.email });
        if (user && await verifyPassword(credentials.password, user.password)) {
          return { id: user._id.toString(), email: user.email, role: user.role || "user" };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
});

export const GET = handlers.GET;
export const POST = handlers.POST;