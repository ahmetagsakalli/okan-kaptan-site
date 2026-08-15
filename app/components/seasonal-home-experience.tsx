"use client";

import { useState } from "react";
import type { CmsContent } from "../lib/cms-types";
import { type Season } from "../lib/site-data";
import { SeasonalActivitiesSection } from "./content-sections";
import { GoogleReviewsStrip } from "./google-reviews-strip";
import { HomeGalleryMarquee } from "./home-gallery-marquee";
import { SeasonHero } from "./season-hero";

type SeasonalHomeExperienceProps = {
  galleryCollections: CmsContent["galleryCollections"];
  hero: CmsContent["hero"];
  reviews: CmsContent["googleReviewHighlights"];
  services: CmsContent["services"];
};

export function SeasonalHomeExperience({
  galleryCollections,
  hero,
  reviews,
  services,
}: SeasonalHomeExperienceProps) {
  const [season, setSeason] = useState<Season>("summer");

  return (
    <div className="home-season-experience" data-season={season}>
      <SeasonHero content={hero} season={season} onSeasonChange={setSeason} />
      <GoogleReviewsStrip reviews={reviews} />
      <SeasonalActivitiesSection items={services} season={season} />
      <HomeGalleryMarquee collections={galleryCollections} season={season} />
    </div>
  );
}
