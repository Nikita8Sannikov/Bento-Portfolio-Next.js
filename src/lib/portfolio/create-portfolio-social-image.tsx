import { ImageResponse } from "next/og";

import { getPortfolioBySlug } from "@/data/portfolios/get-portfolio-by-slug";

export const portfolioSocialImageSize = {
  width: 1200,
  height: 630,
};

export async function createPortfolioSocialImage(
  slug: string,
) {
  const portfolio = await getPortfolioBySlug(slug, {
    publishedOnly: true,
  });

  const title =
    portfolio?.title ?? "Portfolio";

  const description =
    portfolio?.description ??
    "Fullstack Developer · TypeScript · React · Next.js · Node.js";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0a",
          color: "#ffffff",
          padding: "72px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#a3a3a3",
          }}
        >
          Bento Portfolio
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 84,
              fontWeight: 700,
              letterSpacing: "-3px",
            }}
          >
            {title}
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 24,
              maxWidth: 900,
              fontSize: 32,
              lineHeight: 1.3,
              color: "#a3a3a3",
            }}
          >
            {description}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 24,
            fontSize: 24,
            color: "#d4d4d4",
          }}
        >
          <span>TypeScript</span>
          <span>React</span>
          <span>Next.js</span>
          <span>Node.js</span>
        </div>
      </div>
    ),
    portfolioSocialImageSize,
  );
}