import {
    createPortfolioSocialImage,
    portfolioSocialImageSize,
  } from "@/lib/portfolio/create-portfolio-social-image";
  
  export const alt =
    "Portfolio preview";
  
  export const size =
    portfolioSocialImageSize;
  
  export const contentType =
    "image/png";
  
  type SocialImageProps = {
    params: Promise<{
      slug: string;
    }>;
  };
  
  export default async function OpenGraphImage({
    params,
  }: SocialImageProps) {
    const { slug } = await params;
  
    return createPortfolioSocialImage(slug);
  }