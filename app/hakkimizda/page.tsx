import {
  AboutSection,
  CaptainsSection,
  ContactSection,
} from "../components/content-sections";
import { DetailPage } from "../components/detail-page";
import { getSiteContent } from "../lib/cms-content";
import { createPageMetadata } from "../lib/seo";

export const metadata = createPageMetadata({
  path: "/hakkimizda",
  title: "Hakkımızda",
  description:
    "Okan Kaptan ve Abdullah Kaptan'ın Mordoğan'da deniz tutkusu, gezi, yüzme ve balık avı turlarına uzanan hikayesi.",
  keywords: [
    "Okan Dörtköşe",
    "Okan Kaptan",
    "Abdullah Yüksel",
    "Mordoğan kaptan",
  ],
});

export const revalidate = 3600;

export default async function AboutPage() {
  const content = await getSiteContent();

  return (
    <DetailPage
      title="Hakkımızda"
      description="Okan Kaptan ve Abdullah Kaptan'ın yıllara dayanan deniz sevgisiyle Mordoğan ve Karaburun koylarında sunduğu samimi tur deneyimi."
    >
      <AboutSection story={content.aboutStory} />
      <CaptainsSection items={content.captains} />
      <ContactSection />
    </DetailPage>
  );
}
