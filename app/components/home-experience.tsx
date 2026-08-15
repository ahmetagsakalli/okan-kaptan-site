import { CaptainsSection, RouteSection } from "./content-sections";
import { FaqSection } from "./faq-section";
import { getSiteContent } from "../lib/cms-content";
import type { CmsContent } from "../lib/cms-types";
import { SeasonalHomeExperience } from "./seasonal-home-experience";

type HomeExperienceProps = {
  content?: CmsContent;
};

export async function HomeExperience({ content: providedContent }: HomeExperienceProps) {
  const content = providedContent ?? (await getSiteContent());

  return (
    <>
      <SeasonalHomeExperience
        galleryCollections={content.galleryCollections}
        hero={content.hero}
        reviews={content.googleReviewHighlights}
        services={content.services}
      />
      <CaptainsSection items={content.captains} />
      <RouteSection route={content.route} />
      <FaqSection items={content.faqItems} />
    </>
  );
}
