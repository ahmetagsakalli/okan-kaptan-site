import { ContactSection } from "../components/content-sections";
import { DetailPage } from "../components/detail-page";
import { SeasonGallery, SocialVideoSection } from "../components/season-gallery";
import { getSiteContent } from "../lib/cms-content";
import { createPageMetadata } from "../lib/seo";

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

export const revalidate = 3600;

export default async function GalleryPage() {
  const content = await getSiteContent();

  return (
    <DetailPage
      title="Galeri"
      description="Yaz ve kış turlarından seçili fotoğraf ve video alanları."
    >
      <SeasonGallery
        season="summer"
        collections={content.galleryCollections}
        id="yaz-galerisi"
        title="Yaz turları"
      />
      <SeasonGallery
        season="winter"
        collections={content.galleryCollections}
        id="kis-galerisi"
        title="Kış balıkçılığı"
      />
      <SocialVideoSection items={content.socialGalleryItems} />
      <ContactSection />
    </DetailPage>
  );
}
