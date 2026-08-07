export type CmsSeason = "summer" | "winter";

export type CmsTextItem = {
  title: string;
  text: string;
};

export type CmsListGroup = {
  title: string;
  items: string[];
};

export type CmsHeroSeason = {
  label: string;
  title: string;
  note: string;
};

export type CmsHero = {
  title: string;
  summer: CmsHeroSeason;
  winter: CmsHeroSeason;
};

export type CmsService = CmsTextItem & {
  image: string;
  alt: string;
};

export type CmsGalleryItem = {
  kind: "photo" | "video";
  title: string;
  src: string;
  videoSrc?: string;
  alt: string;
  featured?: boolean;
};

export type CmsGalleryCollection = {
  title: string;
  summary: string;
  items: CmsGalleryItem[];
};

export type CmsSocialGalleryItem = {
  platform: "Instagram" | "Facebook";
  title: string;
  href: string;
  image: string;
  alt: string;
};

export type CmsReview = {
  author: string;
  text: string;
};

export type CmsCaptain = {
  name: string;
  image: string;
  imagePosition: string;
  alt: string;
  bio: string[];
};

export type CmsBoat = {
  title: string;
  text: string;
  image: string;
  alt: string;
  gallery?: {
    title: string;
    src: string;
    alt: string;
  }[];
  videoTitle?: string;
  videoSrc?: string;
  videoPoster?: string;
};

export type CmsRouteStep = CmsTextItem & {
  time: string;
};

export type CmsRoute = {
  steps: CmsRouteStep[];
  facts: string[];
  coves: string[];
};

export type CmsFaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type CmsContent = {
  hero: CmsHero;
  services: CmsService[];
  galleryCollections: Record<CmsSeason, CmsGalleryCollection>;
  socialGalleryItems: CmsSocialGalleryItem[];
  googleReviewHighlights: CmsReview[];
  aboutStory: string[];
  captains: CmsCaptain[];
  boat: CmsBoat;
  route: CmsRoute;
  tourSpecs: CmsTextItem[];
  mealMenu: CmsTextItem[];
  amenityItems: CmsTextItem[];
  fishingTourHighlights: CmsTextItem[];
  fishingPreparation: CmsListGroup[];
  fishingNote: string;
  locationHighlights: string[];
  faqItems: CmsFaqItem[];
};
