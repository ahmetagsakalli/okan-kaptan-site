import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { readPrivateBlobText, requiresPersistentBlobStorage, writePrivateBlobText } from "./blob-storage";
import { defaultCmsContent } from "./cms-defaults";
import type { CmsContent, CmsGalleryItem } from "./cms-types";
import { toRoutableMediaSource } from "./media";

const cmsDataPath = path.join(process.cwd(), "data", "site-content.json");
const cmsBlobPath = "cms/site-content.json";

function cloneDefaultContent(): CmsContent {
  return JSON.parse(JSON.stringify(defaultCmsContent)) as CmsContent;
}

function asString(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

function asOptionalString(value: unknown, fallback?: string) {
  return typeof value === "string" ? value : fallback;
}

function asMediaSource(value: unknown, fallback: string) {
  return toRoutableMediaSource(asString(value, fallback));
}

function asOptionalMediaSource(value: unknown, fallback?: string) {
  const source = asOptionalString(value, fallback);

  return source ? toRoutableMediaSource(source) : source;
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
      image: asMediaSource(source.image, fallbackCaptain.image),
      imagePosition: asString(source.imagePosition, fallbackCaptain.imagePosition),
      alt: asString(source.alt, fallbackCaptain.alt),
      bio: asStringArray(source.bio, fallbackCaptain.bio),
    };
  });
}

function normalizeServices(value: unknown, fallback: CmsContent["services"]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const defaultService = fallback[0] ?? {
    title: "Tur",
    text: "",
    image: "",
    alt: "Okan Kaptan tur fotoğrafı",
  };

  return value.map((item, index) => {
    const source = item && typeof item === "object" ? (item as Partial<CmsContent["services"][number]>) : {};
    const fallbackService = fallback[index] ?? defaultService;

    return {
      ...fallbackService,
      ...source,
      title: asString(source.title, fallbackService.title),
      text: asString(source.text, fallbackService.text),
      image: asMediaSource(source.image, fallbackService.image),
      alt: asString(source.alt, fallbackService.alt),
    };
  });
}

function normalizeGalleryItems(value: unknown, fallback: CmsGalleryItem[]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const defaultItem = fallback[0] ?? {
    kind: "photo" as const,
    title: "Galeri fotoğrafı",
    src: "",
    alt: "Okan Kaptan galeri fotoğrafı",
  };

  return value.map((item, index) => {
    const source = item && typeof item === "object" ? (item as Partial<CmsContent["galleryCollections"]["summer"]["items"][number]>) : {};
    const fallbackItem = fallback[index] ?? defaultItem;

    return {
      ...fallbackItem,
      ...source,
      kind: source.kind === "video" ? "video" as const : "photo" as const,
      title: asString(source.title, fallbackItem.title),
      src: asMediaSource(source.src, fallbackItem.src),
      videoSrc: asOptionalMediaSource(source.videoSrc, fallbackItem.videoSrc),
      alt: asString(source.alt, fallbackItem.alt),
      featured: typeof source.featured === "boolean" ? source.featured : fallbackItem.featured,
    };
  });
}

function normalizeSocialGalleryItems(value: unknown, fallback: CmsContent["socialGalleryItems"]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const defaultItem = fallback[0] ?? {
    platform: "Instagram" as const,
    title: "Sosyal medya videosu",
    href: "",
    image: "",
    alt: "Okan Kaptan sosyal medya görseli",
  };

  return value.map((item, index) => {
    const source = item && typeof item === "object" ? (item as Partial<CmsContent["socialGalleryItems"][number]>) : {};
    const fallbackItem = fallback[index] ?? defaultItem;

    return {
      ...fallbackItem,
      ...source,
      platform: source.platform === "Facebook" ? "Facebook" as const : "Instagram" as const,
      title: asString(source.title, fallbackItem.title),
      href: asString(source.href, fallbackItem.href),
      image: asMediaSource(source.image, fallbackItem.image),
      alt: asString(source.alt, fallbackItem.alt),
    };
  });
}

function normalizeBoat(value: Partial<CmsContent["boat"]> | undefined, fallback: CmsContent["boat"]) {
  const source = value && typeof value === "object" ? value : {};

  return {
    ...fallback,
    ...source,
    title: asString(source.title, fallback.title),
    text: asString(source.text, fallback.text),
    image: asMediaSource(source.image, fallback.image),
    alt: asString(source.alt, fallback.alt),
    gallery: Array.isArray(source.gallery)
      ? source.gallery.map((item, index) => {
          const fallbackItem = fallback.gallery?.[index] ?? fallback.gallery?.[0] ?? {
            title: "Tekne fotoğrafı",
            src: fallback.image,
            alt: fallback.alt,
          };

          return {
            ...fallbackItem,
            ...item,
            title: asString(item.title, fallbackItem.title),
            src: asMediaSource(item.src, fallbackItem.src),
            alt: asString(item.alt, fallbackItem.alt),
          };
        })
      : fallback.gallery,
    videoTitle: asOptionalString(source.videoTitle, fallback.videoTitle),
    videoSrc: asOptionalMediaSource(source.videoSrc, fallback.videoSrc),
    videoPoster: asOptionalMediaSource(source.videoPoster, fallback.videoPoster),
  };
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
    services: normalizeServices(source.services, fallback.services),
    galleryCollections: {
      summer: {
        ...fallback.galleryCollections.summer,
        ...source.galleryCollections?.summer,
        items: normalizeGalleryItems(source.galleryCollections?.summer?.items, fallback.galleryCollections.summer.items),
      },
      winter: {
        ...fallback.galleryCollections.winter,
        ...source.galleryCollections?.winter,
        items: normalizeGalleryItems(source.galleryCollections?.winter?.items, fallback.galleryCollections.winter.items),
      },
    },
    socialGalleryItems: normalizeSocialGalleryItems(source.socialGalleryItems, fallback.socialGalleryItems),
    googleReviewHighlights: Array.isArray(source.googleReviewHighlights)
      ? source.googleReviewHighlights
      : fallback.googleReviewHighlights,
    aboutStory: asStringArray(source.aboutStory, fallback.aboutStory),
    captains: normalizeCaptains(source.captains, fallback.captains),
    boat: normalizeBoat(source.boat, fallback.boat),
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
    throw new Error("Vercel'de kaydetmek için Blob bağlantısı gerekli. BLOB_READ_WRITE_TOKEN ayarını kontrol et.");
  }

  try {
    await mkdir(path.dirname(cmsDataPath), { recursive: true });
    await writeFile(cmsDataPath, serialized, "utf8");
  } catch {
    throw new Error("İçerik dosyası sunucu diskine kaydedilemedi. VPS'te /app/data volume ve izinlerini kontrol et.");
  }

  return normalized;
}
