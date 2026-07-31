import bcrypt from "bcryptjs";
import { createHash } from "node:crypto";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

const credentialsSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },

  providers: [
    Credentials({
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },

        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        const result = credentialsSchema.safeParse(credentials);

        if (!result.success) {
          return null;
        }

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

        if (!adminEmail || !adminPasswordHash) {
          throw new Error("Admin credentials are not configured");
        }

        const emailMatches =
          result.data.email.toLowerCase() === adminEmail.toLowerCase();

        const passwordMatches = await bcrypt.compare(
          result.data.password,
          adminPasswordHash,
        );

        if (!emailMatches || !passwordMatches) {
          return null;
        }

        return {
          id: "portfolio-admin",
          email: adminEmail,
          name: "Administrator",
        };
      },
    }),
  ],
});
