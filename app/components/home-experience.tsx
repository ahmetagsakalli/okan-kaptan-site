import { CaptainsSection, RouteSection, SeasonalActivitiesSection } from "./content-sections";
import { FaqSection } from "./faq-section";
import { GoogleReviewsStrip } from "./google-reviews-strip";
import { HomeGalleryMarquee } from "./home-gallery-marquee";
import { getSiteContent } from "../lib/cms-content";
import type { CmsContent } from "../lib/cms-types";
import { SeasonHero } from "./season-hero";

type HomeExperienceProps = {
  content?: CmsContent;
};

export async function HomeExperience({ content: providedContent }: HomeExperienceProps) {
  const content = providedContent ?? (await getSiteContent());

  return (
    <>
      <SeasonHero content={content.hero} />
      <GoogleReviewsStrip reviews={content.googleReviewHighlights} />
      <SeasonalActivitiesSection items={content.services} />
      <HomeGalleryMarquee collections={content.galleryCollections} />
      <CaptainsSection items={content.captains} />
      <RouteSection route={content.route} />
      <FaqSection items={content.faqItems} />
    </>
  );
}
