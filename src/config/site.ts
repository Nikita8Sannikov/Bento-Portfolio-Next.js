const siteUrl =
  process.env.SITE_URL ?? "http://localhost:3000";

export const siteConfig = {
  name: "Nikita Portfolio",

  defaultPortfolioSlug: "nikita",

  description:
    "Fullstack developer building web applications and API integrations with TypeScript, React, Next.js and Node.js.",

  url: siteUrl.replace(/\/$/, ""),
};