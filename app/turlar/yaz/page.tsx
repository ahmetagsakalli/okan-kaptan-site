import {
  AmenitySection,
  ContactSection,
  MealMenuSection,
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
  path: "/turlar/yaz",
  title: "Yaz Gezi ve Yüzme Turu",
  description:
    "Mordoğan Yeni Liman çıkışlı yaz gezi ve yüzme turu; koy molaları, SUP, yemekli/yemeksiz seçenekler ve yaz galerisi.",
  keywords: ["Mordoğan yaz tekne turu", "Mordoğan yüzme turu", "Mordoğan yemekli tekne turu"],
});

export const dynamic = "force-dynamic";

export default async function SummerTourPage() {
  const content = await getSiteContent();
  const service = content.services[0] ?? services[0];

  return (
    <DetailPage
      title="Yaz Gezi ve Yüzme Turu"
      description="Mordoğan koylarında yaz gezi ve yüzme turu detayları."
    >
      <TourDetailIntro
        season="summer"
        eyebrow="Yaz sezonu"
        title={service.title}
        text="Mordoğan ve Karaburun'un berrak koylarında yüzme molaları, sakin tekne düzeni, SUP keyfi ve yemekli ya da yemeksiz tur seçenekleriyle yaz günü planlanır."
        image={service.image}
        alt={service.alt}
        facts={["10:00 çıkış", "18:00 dönüş", "Yemekli / yemeksiz", "Özel grup planı"]}
      />
      <MealMenuSection items={content.mealMenu} />
      <TourSpecsSection items={content.tourSpecs} />
      <AmenitySection items={content.amenityItems} />
      <SeasonGallery
        season="summer"
        collections={content.galleryCollections}
        id="yaz-galerisi"
        title="Yaz turu galerisi"
      />
      <TrustSection />
      <ContactSection />
    </DetailPage>
  );
}
