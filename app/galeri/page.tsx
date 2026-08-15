import { ContactSection } from "../components/content-sections";
import { DetailPage } from "../components/detail-page";
import { SeasonGallerySwitcher, SocialVideoSection } from "../components/season-gallery";
import { getSiteContent } from "../lib/cms-content";
import { createPageMetadata } from "../lib/seo";
import type { Season } from "../lib/site-data";

export const metadata = createPageMetadata({
  path: "/galeri",
  title: "Galeri",
  description:
    "Okan Kaptan Mordoğan yaz gezi ve yüzme turları ile kış olta balıkçılığı galeri görselleri.",
  keywords: [
    "Okan Kaptan galeri",
    "Mordoğan tekne turu fotoğrafları",
    "Mordoğan balık turu videoları",
  ],
});

export const dynamic = "force-dynamic";

type GalleryPageProps = {
  searchParams?: Promise<{
    season?: string | string[];
  }>;
};

export default async function GalleryPage({ searchParams }: GalleryPageProps) {
  const content = await getSiteContent();
  const params = await searchParams;
  const seasonParam = Array.isArray(params?.season) ? params.season[0] : params?.season;
  const initialSeason: Season = seasonParam === "winter" ? "winter" : "summer";

  return (
    <DetailPage
      title="Galeri"
      description="Yaz ve kış turlarından seçili fotoğraf ve video alanları."
    >
      <SeasonGallerySwitcher collections={content.galleryCollections} initialSeason={initialSeason} />
      <SocialVideoSection items={content.socialGalleryItems} />
      <ContactSection />
    </DetailPage>
  );
}
