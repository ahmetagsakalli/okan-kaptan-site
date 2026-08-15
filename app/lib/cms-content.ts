import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { readPrivateBlobText, requiresPersistentBlobStorage, writePrivateBlobText } from "./blob-storage";
import { defaultCmsContent } from "./cms-defaults";
import type { CmsContent } from "./cms-types";

const cmsDataPath = path.join(process.cwd(), "data", "site-content.json");
const cmsBlobPath = "cms/site-content.json";

function cloneDefaultContent(): CmsContent {
  return JSON.parse(JSON.stringify(defaultCmsContent)) as CmsContent;
}

function asString(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

function asStringArray(value: unknown, fallback: string[]) {
  return Array.isArray(value)
    ? value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean)
    : fallback;
}

function normalizeCaptains(value: unknown, fallback: CmsContent["captains"]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const defaultCaptain = fallback[0] ?? {
    name: "Kaptan",
    image: "",
    imagePosition: "50% 45%",
    alt: "Kaptan fotoğrafı",
    bio: [],
  };

  return value.map((item, index) => {
    const source = item && typeof item === "object" ? (item as Partial<CmsContent["captains"][number]>) : {};
    const fallbackCaptain = fallback[index] ?? defaultCaptain;

    return {
      ...fallbackCaptain,
      ...source,
      name: asString(source.name, fallbackCaptain.name),
      image: asString(source.image, fallbackCaptain.image),
      imagePosition: asString(source.imagePosition, fallbackCaptain.imagePosition),
      alt: asString(source.alt, fallbackCaptain.alt),
      bio: asStringArray(source.bio, fallbackCaptain.bio),
    };
  });
}

function normalizeContent(input: unknown): CmsContent {
  const fallback = cloneDefaultContent();

  if (!input || typeof input !== "object") {
    return fallback;
  }

  const source = input as Partial<CmsContent>;

  return {
    ...fallback,
    ...source,
    hero: {
      ...fallback.hero,
      ...source.hero,
      title: asString(source.hero?.title, fallback.hero.title),
      summer: {
        ...fallback.hero.summer,
        ...source.hero?.summer,
      },
      winter: {
        ...fallback.hero.winter,
        ...source.hero?.winter,
      },
    },
    services: Array.isArray(source.services) ? source.services : fallback.services,
    galleryCollections: {
      summer: {
        ...fallback.galleryCollections.summer,
        ...source.galleryCollections?.summer,
        items: Array.isArray(source.galleryCollections?.summer?.items)
          ? source.galleryCollections.summer.items
          : fallback.galleryCollections.summer.items,
      },
      winter: {
        ...fallback.galleryCollections.winter,
        ...source.galleryCollections?.winter,
        items: Array.isArray(source.galleryCollections?.winter?.items)
          ? source.galleryCollections.winter.items
          : fallback.galleryCollections.winter.items,
      },
    },
    socialGalleryItems: Array.isArray(source.socialGalleryItems)
      ? source.socialGalleryItems
      : fallback.socialGalleryItems,
    googleReviewHighlights: Array.isArray(source.googleReviewHighlights)
      ? source.googleReviewHighlights
      : fallback.googleReviewHighlights,
    aboutStory: asStringArray(source.aboutStory, fallback.aboutStory),
    captains: normalizeCaptains(source.captains, fallback.captains),
    boat: {
      ...fallback.boat,
      ...source.boat,
    },
    route: {
      ...fallback.route,
      ...source.route,
      steps: Array.isArray(source.route?.steps) ? source.route.steps : fallback.route.steps,
      facts: asStringArray(source.route?.facts, fallback.route.facts),
      coves: asStringArray(source.route?.coves, fallback.route.coves),
    },
    tourSpecs: Array.isArray(source.tourSpecs) ? source.tourSpecs : fallback.tourSpecs,
    mealMenu: Array.isArray(source.mealMenu) ? source.mealMenu : fallback.mealMenu,
    amenityItems: Array.isArray(source.amenityItems) ? source.amenityItems : fallback.amenityItems,
    fishingTourHighlights: Array.isArray(source.fishingTourHighlights)
      ? source.fishingTourHighlights
      : fallback.fishingTourHighlights,
    fishingPreparation: Array.isArray(source.fishingPreparation)
      ? source.fishingPreparation
      : fallback.fishingPreparation,
    fishingNote: asString(source.fishingNote, fallback.fishingNote),
    locationHighlights: asStringArray(source.locationHighlights, fallback.locationHighlights),
    faqItems: Array.isArray(source.faqItems) ? source.faqItems : fallback.faqItems,
  };
}

export async function getSiteContent(): Promise<CmsContent> {
  const blobContent = await readPrivateBlobText(cmsBlobPath);

  if (blobContent) {
    return normalizeContent(JSON.parse(blobContent));
  }

  try {
    const raw = await readFile(cmsDataPath, "utf8");
    return normalizeContent(JSON.parse(raw));
  } catch {
    return cloneDefaultContent();
  }
}

export async function saveSiteContent(content: CmsContent) {
  const normalized = normalizeContent(content);
  const serialized = `${JSON.stringify(normalized, null, 2)}\n`;

  if (await writePrivateBlobText(cmsBlobPath, serialized)) {
    return normalized;
  }

  if (requiresPersistentBlobStorage()) {
    throw new Error("Canlı sitede kaydetmek için Vercel Blob bağlantısı gerekli. BLOB_READ_WRITE_TOKEN ayarını kontrol et.");
  }

  await mkdir(path.dirname(cmsDataPath), { recursive: true });
  await writeFile(cmsDataPath, serialized, "utf8");

  return normalized;
}
