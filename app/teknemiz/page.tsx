import { BoatInfoSection, ContactSection } from "../components/content-sections";
import { DetailPage } from "../components/detail-page";
import { getSiteContent } from "../lib/cms-content";
import { createPageMetadata } from "../lib/seo";

export const metadata = createPageMetadata({
  path: "/teknemiz",
  title: "Teknemiz",
  description:
    "Okan Kaptan'ın Mordoğan Yeni Liman bağlı 12 kişilik ticari teknesi, ölçüleri, donanımı, galeri görselleri ve tekne tanıtım videosu.",
  keywords: [
    "Okan Kaptan tekne",
    "Mordoğan tekne özellikleri",
    "12 kişilik ticari tekne",
    "Mordoğan Yeni Liman tekne",
  ],
});

export const revalidate = 3600;

export default async function BoatPage() {
  const content = await getSiteContent();

  return (
    <DetailPage
      title="Teknemiz"
      description="10 metre boyunda, 3.30 metre eninde, 12 kişilik ticari evraklı Okan Kaptan teknesinin donanımı ve seçili görüntüleri."
    >
      <BoatInfoSection boat={content.boat} specs={content.tourSpecs} />
      <ContactSection />
    </DetailPage>
  );
}
