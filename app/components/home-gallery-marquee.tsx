import { Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { CmsContent } from "../lib/cms-types";
import { isDynamicMediaSource } from "../lib/media";
import { galleryCollections, type Season } from "../lib/site-data";

type HomeGalleryMarqueeProps = {
  collections?: CmsContent["galleryCollections"];
  season?: Season;
};

export function HomeGalleryMarquee({
  collections = galleryCollections as unknown as CmsContent["galleryCollections"],
  season = "summer",
}: HomeGalleryMarqueeProps) {
  const activeCollection = collections[season];
  const marqueeItems = activeCollection.items;
  const loopItems = [...marqueeItems, ...marqueeItems];
  const title = season === "summer" ? "Yaz turları nasıl mı?" : "Kış balık avları nasıl mı?";
  const galleryHref = `/galeri?season=${season}`;

  return (
    <section
      className="home-gallery-marquee reveal-item"
      data-season={season}
      aria-labelledby="home-gallery-title"
    >
      <div className="section-heading compact">
        <h2 id="home-gallery-title">{title}</h2>
        <p>{activeCollection.summary}</p>
      </div>
      <div className="home-gallery-window">
        <div className="home-gallery-track" key={season}>
          {loopItems.map((item, index) => {
            const isVideo = item.kind === "video";
            const hasVideoPreview = isVideo && Boolean(item.videoSrc);

            return (
              <Link
                className={`home-gallery-item ${isVideo ? "is-video" : ""}`}
                href={galleryHref}
                key={`${item.kind}-${item.src}-${item.videoSrc ?? ""}-${index}`}
                aria-label="Galeri detay sayfasına git"
              >
                {hasVideoPreview ? (
                  <video
                    className="home-gallery-video"
                    src={item.videoSrc}
                    poster={item.src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    aria-hidden="true"
                  />
                ) : (
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    quality={60}
                    loading="lazy"
                    fetchPriority="low"
                    sizes="(max-width: 640px) 76vw, 28vw"
                    unoptimized={isDynamicMediaSource(item.src)}
                  />
                )}
                {isVideo ? (
                  <span className="home-gallery-play" aria-hidden="true">
                    <Play size={22} fill="currentColor" />
                  </span>
                ) : null}
              </Link>
            );
          })}
        </div>
      </div>
      <div className="home-gallery-link">
        <Link href={galleryHref}>
          {season === "summer" ? "Yaz galerisini aç" : "Kış galerisini aç"}
        </Link>
      </div>
    </section>
  );
}
