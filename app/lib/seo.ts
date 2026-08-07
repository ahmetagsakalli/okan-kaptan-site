import type { Metadata } from "next";

type PageMetadataInput = {
  title: string;
  description: string;
  path: `/${string}`;
  keywords?: string[];
};

const siteName = "Okan Kaptan Mordoğan";
const ogImage = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "Okan Kaptan Mordoğan tekne turu sosyal paylaşım görseli",
};

export function createPageMetadata({
  title,
  description,
  path,
  keywords = [],
}: PageMetadataInput): Metadata {
  const fullTitle = `${title} | ${siteName}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: "website",
      locale: "tr_TR",
      url: path,
      siteName,
      title: fullTitle,
      description,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage.url],
    },
  };
}
