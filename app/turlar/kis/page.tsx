import {
  ContactSection,
  FishingTourSection,
  TourSpecsSection,
  TrustSection,
} from "../../components/content-sections";
import { DetailPage } from "../../components/detail-page";
import { SeasonGallery } from "../../components/season-gallery";
import { TourDetailIntro } from "../../components/tour-detail-intro";
import { getSiteContent } from "../../lib/cms-content";
import { createPageMetadata } from "../../lib/seo";
import { services } from "../../lib/site-data";

export const metadata = createPageMetadata({
  path: "/turlar/kis",
  title: "Kış Olta Balıkçılığı",
  description:
    "Mordoğan çevresinde kış olta balıkçılığı turu; 06:00 çıkış, 18:00 dönüş, hazırlık bilgileri ve balık turu galerisi.",
  keywords: ["Mordoğan balık turu", "Mordoğan olta balıkçılığı", "Karaburun balık avı"],
});

export const dynamic = "force-dynamic";

export default async function WinterTourPage() {
  const content = await getSiteContent();
  const service = content.services[1] ?? services[1];

  return (
    <DetailPage
      title="Kış Olta Balıkçılığı"
      description="Mordoğan çevresinde kış balık avı turu detayları."
    >
      <TourDetailIntro
        season="winter"
        eyebrow="Kış sezonu"
        title={service.title}
        text="Gün doğumunda başlayan olta balıkçılığı turunda rota; hava, akıntı ve deniz durumuna göre kaptan kontrolünde netleşir. Amaç keyifli, güvenli ve bereketli bir deniz günü planlamaktır."
        image={service.image}
        alt={service.alt}
        facts={["06:00 çıkış", "18:00 dönüş", "Olta balıkçılığı", "Rota hava durumuna göre"]}
      />
      <FishingTourSection
        highlights={content.fishingTourHighlights}
        preparation={content.fishingPreparation}
        note={content.fishingNote}
      />
      <TourSpecsSection items={content.tourSpecs} />
      <SeasonGallery
        season="winter"
        collections={content.galleryCollections}
        id="kis-galerisi"
        title="Kış balıkçılığı galerisi"
      />
      <TrustSection />
      <ContactSection />
    </DetailPage>
  );
}
