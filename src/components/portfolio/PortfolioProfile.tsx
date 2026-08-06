import Image from "next/image";

import type { PortfolioData } from "@/types/portfolio";

type PortfolioProfileProps = {
  portfolio: Pick<
    PortfolioData,
    "title" | "position" | "description" | "avatarUrl"
  >;
};

export function PortfolioProfile({ portfolio }: PortfolioProfileProps) {
  const isLocalAvatar = portfolio.avatarUrl?.startsWith("/");

  return (
    <div className="lg:sticky lg:top-8">
      <div className="relative mx-auto aspect-square w-full max-w-36 overflow-hidden rounded-2xl bg-neutral-900 sm:max-w-44 lg:mx-0 lg:max-w-none">
        {portfolio.avatarUrl ? (
          isLocalAvatar ? (
            <Image
              src={portfolio.avatarUrl}
              alt={portfolio.title}
              fill
              sizes="(min-width: 1024px) 25vw, 100vw"
              className="object-cover"
              priority
            />
          ) : (
            <img
              src={portfolio.avatarUrl}
              alt={portfolio.title}
              className="h-full w-full object-cover"
            />
          )
        ) : (
          <div className="flex h-full items-center justify-center text-neutral-600">
            <span className="text-3xl font-bold sm:text-4xl lg:text-5xl">
              {portfolio.title.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {portfolio.position && (
        <p className="mt-4 text-sm text-neutral-400">{portfolio.position}</p>
      )}

      <h1 className="mt-2 text-2xl font-bold tracking-tight lg:text-3xl">
        {portfolio.title}
      </h1>

      {portfolio.description && (
        <p className="mt-3 text-sm text-neutral-400">{portfolio.description}</p>
      )}
    </div>
  );
}
