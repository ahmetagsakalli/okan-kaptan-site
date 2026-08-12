import {
  ContactSection,
  LocationInfoSection,
  RouteSection,
} from "../components/content-sections";
import { DetailPage } from "../components/detail-page";
import { getSiteContent } from "../lib/cms-content";
import { createPageMetadata } from "../lib/seo";

export const metadata = createPageMetadata({
  path: "/rota",
  title: "Rota",
  description:
    "Okan Kaptan Mordoğan Yeni Liman çıkışlı örnek rota planı; Ayıbalığı Koyu, Korsan Yatağı ve Manal Koyu gibi noktalar.",
  keywords: [
    "Mordoğan tekne turu rota",
    "Ayıbalığı Koyu",
    "Korsan Yatağı Alifendere",
    "Manal Koyu",
  ],
});

export const dynamic = "force-dynamic";

export default async function RoutePage() {
  const content = await getSiteContent();

  return (
    <DetailPage
      title="Örnek Rotamız"
      description="Mordoğan Yeni Liman çıkışlı plan açık ve rota esnektir; koy seçimi hava ve deniz durumuna göre kaptan kontrolünde yapılır."
    >
      <RouteSection route={content.route} />
      <LocationInfoSection highlights={content.locationHighlights} />
      <ContactSection />
    </DetailPage>
  );
}
