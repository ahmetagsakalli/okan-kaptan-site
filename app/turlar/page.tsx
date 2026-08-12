import {
  AmenitySection,
  ContactSection,
  FishingTourSection,
  MealMenuSection,
  ServicesSection,
  TrustSection,
  TourSpecsSection,
} from "../components/content-sections";
import { DetailPage } from "../components/detail-page";
import { getSiteContent } from "../lib/cms-content";
import { createPageMetadata } from "../lib/seo";

export const metadata = createPageMetadata({
  path: "/turlar",
  title: "Turlar",
  description:
    "Mordoğan yaz gezi ve yüzme turu, 06:00 çıkışlı balık turu, yemekli/yemeksiz özel tekne turu, menü ve tekne donanımı.",
  keywords: [
    "Mordoğan tekne turu",
    "Mordoğan gezi ve yüzme turu",
    "Mordoğan balık turu",
    "Mordoğan yemekli tekne turu",
  ],
});

export const dynamic = "force-dynamic";

export default async function ToursPage() {
  const content = await getSiteContent();

  return (
    <DetailPage
      title="Turlar"
      description="Yemekli/yemeksiz günlük tekne turları, gün doğumunda başlayan Mordoğan balık turları, güncel menü ve 12 kişilik tekne donanımı."
    >
      <ServicesSection items={content.services} />
      <FishingTourSection
        highlights={content.fishingTourHighlights}
        preparation={content.fishingPreparation}
        note={content.fishingNote}
      />
      <TourSpecsSection items={content.tourSpecs} />
      <MealMenuSection items={content.mealMenu} />
      <AmenitySection items={content.amenityItems} />
      <TrustSection />
      <ContactSection />
    </DetailPage>
  );
}
