import { Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { CmsContent } from "../lib/cms-types";
import { galleryCollections } from "../lib/site-data";

type HomeGalleryMarqueeProps = {
  collections?: CmsContent["galleryCollections"];
};

export function HomeGalleryMarquee({
  collections = galleryCollections as unknown as CmsContent["galleryCollections"],
}: HomeGalleryMarqueeProps) {
  const marqueeItems = [
    ...collections.summer.items,
    ...collections.winter.items.slice(0, 3),
  ];
  const loopItems = [...marqueeItems, ...marqueeItems];

  return (
    <section className="home-gallery-marquee reveal-item" aria-labelledby="home-gallery-title">
      <div className="section-heading compact">
        <h2 id="home-gallery-title">Turlarımız nasıl mı?</h2>
      </div>
      <div className="home-gallery-window">
        <div className="home-gallery-track">
          {loopItems.map((item, index) => {
            const isVideo = item.kind === "video";

            return (
              <Link
                className={`home-gallery-item ${isVideo ? "is-video" : ""}`}
                href="/galeri"
                key={`${item.title}-${index}`}
                aria-label="Galeri detay sayfasına git"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  quality={60}
                  loading="lazy"
                  fetchPriority="low"
                  sizes="(max-width: 640px) 76vw, 28vw"
                />
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
        <Link href="/galeri">Galeriyi aç</Link>
      </div>
    </section>
  );
}
