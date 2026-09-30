import bcrypt from "bcryptjs";
import { createHash } from "node:crypto";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

const credentialsSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

const bcryptHashPattern = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;

function readAdminPasswordHash(value: string): string | null {
  const trimmed = value.trim().replace(/^["']|["']$/g, "");
  const unescaped = trimmed.replace(/\\\$/g, "$");

  if (bcryptHashPattern.test(unescaped)) {
    return unescaped;
  }

  const decoded = Buffer.from(trimmed, "base64").toString("utf8");

  if (bcryptHashPattern.test(decoded)) {
    return decoded;
  }

  return null;
}

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
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH
          ? readAdminPasswordHash(process.env.ADMIN_PASSWORD_HASH)
          : null;

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
