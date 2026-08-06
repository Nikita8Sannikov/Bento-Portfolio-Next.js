"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/require-admin";
import { prisma } from "@/lib/prisma";

const portfolioProfileSchema = z.object({
  title: z.string().trim().min(1),
  position: z.string().trim().optional(),
  description: z.string().trim().optional(),
  avatarUrl: z.string().trim().optional(),
});

export type PortfolioProfileInput = z.infer<
  typeof portfolioProfileSchema
>;

export async function updatePortfolioProfileAction(
  portfolioId: string,
  input: PortfolioProfileInput,
): Promise<void> {
  await requireAdmin();

  const profile = portfolioProfileSchema.parse(input);

  const portfolio = await prisma.portfolio.update({
    where: {
      id: portfolioId,
    },
    data: {
      title: profile.title,
      position: profile.position || null,
      description: profile.description || null,
      avatarUrl: profile.avatarUrl || null,
    },
    select: {
      slug: true,
    },
  });

  revalidatePath(`/${portfolio.slug}`);
  revalidatePath("/admin");
}
