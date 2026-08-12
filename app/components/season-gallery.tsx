"use client";

import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { CmsContent, CmsGalleryItem, CmsSocialGalleryItem } from "../lib/cms-types";
import { isDynamicMediaSource } from "../lib/media";
import { galleryCollections, socialGalleryItems, type Season } from "../lib/site-data";
import { FacebookIcon, InstagramIcon } from "./site-icons";

type SeasonGalleryProps = {
  season: Season;
  collections?: CmsContent["galleryCollections"];
  id?: string;
  title?: string;
};

export function SeasonGallery({
  season,
  collections = galleryCollections as unknown as CmsContent["galleryCollections"],
  id = "galeri",
  title = "Fotoğraf ve video galerisi",
}: SeasonGalleryProps) {
  const active = collections[season];
  const items = useMemo<readonly CmsGalleryItem[]>(() => active.items, [active.items]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const selectedItem = activeIndex === null ? null : items[activeIndex];

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveIndex(null);
      }

      if (event.key === "ArrowRight") {
        setActiveIndex((current) =>
          current === null ? current : current === items.length - 1 ? 0 : current + 1,
        );
      }

      if (event.key === "ArrowLeft") {
        setActiveIndex((current) =>
          current === null ? current : current === 0 ? items.length - 1 : current - 1,
        );
      }
    }

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, items.length]);

  function showPrevious() {
    setActiveIndex((current) =>
      current === null ? current : current === 0 ? items.length - 1 : current - 1,
    );
  }

  function showNext() {
    setActiveIndex((current) =>
      current === null ? current : current === items.length - 1 ? 0 : current + 1,
    );
  }

  return (
    <>
      <section
        className="season-gallery reveal-item"
        data-season={season}
        id={id}
        aria-labelledby={`${id}-title`}
      >
        <div className="season-gallery-head">
          <div>
            <h2 id={`${id}-title`}>{title}</h2>
            <p>{active.summary}</p>
          </div>
        </div>

        <div className="gallery-stage" data-season={season}>
          <div className="media-grid">
            {items.map((item, index) => {
              const isVideo = item.kind === "video";
              const hasVideoPreview = isVideo && Boolean(item.videoSrc);
              const isFeatured = item.featured === true;

              return (
                <button
                  className={`media-card ${isFeatured ? "is-featured" : ""} ${
                    isVideo ? "is-video" : ""
                  }`}
                  key={`${season}-${item.kind}-${item.src}-${item.videoSrc ?? ""}-${index}`}
                  onClick={() => setActiveIndex(index)}
                  style={{ position: "relative" }}
                  type="button"
                  aria-label={`${item.title} görselini büyüt`}
                >
                  {hasVideoPreview ? (
                    <video
                      className="media-card-video"
                      src={item.videoSrc}
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
                      quality={68}
                      loading={isFeatured && season === "summer" ? "eager" : "lazy"}
                      fetchPriority={isFeatured && season === "summer" ? "auto" : "low"}
                      sizes={
                        isFeatured
                          ? "(max-width: 860px) 100vw, 48vw"
                          : "(max-width: 860px) 100vw, 24vw"
                      }
                      unoptimized={isDynamicMediaSource(item.src)}
                    />
                  )}
                  {isVideo ? (
                    <span className="media-play" aria-hidden="true">
                      <Play size={22} fill="currentColor" />
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {selectedItem ? (
        <div className="gallery-modal" role="dialog" aria-modal="true" aria-label={selectedItem.title}>
          <button
            className="gallery-modal-backdrop"
            onClick={() => setActiveIndex(null)}
            type="button"
            aria-label="Galeriyi kapat"
          />
          <div className="gallery-modal-panel">
            <button
              className="gallery-modal-close"
              onClick={() => setActiveIndex(null)}
              type="button"
              aria-label="Kapat"
            >
              <X size={22} aria-hidden="true" />
            </button>
            <button
              className="gallery-modal-nav gallery-modal-prev"
              onClick={showPrevious}
              type="button"
              aria-label="Önceki görsel"
            >
              <ChevronLeft size={28} aria-hidden="true" />
            </button>
            <div className="gallery-modal-image">
              {selectedItem.kind === "video" && selectedItem.videoSrc ? (
                <video
                  className="gallery-modal-video"
                  controls
                  playsInline
                  preload="metadata"
                  src={selectedItem.videoSrc}
                />
              ) : (
                <Image
                  src={selectedItem.src}
                  alt={selectedItem.alt}
                  fill
                  quality={86}
                  sizes="100vw"
                  unoptimized={isDynamicMediaSource(selectedItem.src)}
                />
              )}
            </div>
            <button
              className="gallery-modal-nav gallery-modal-next"
              onClick={showNext}
              type="button"
              aria-label="Sonraki görsel"
            >
              <ChevronRight size={28} aria-hidden="true" />
            </button>
            <p className="gallery-modal-caption">{selectedItem.title}</p>
          </div>
        </div>
      ) : null}
    </>
  );
}

type SocialVideoSectionProps = {
  items?: CmsSocialGalleryItem[];
};

export function SocialVideoSection({
  items = socialGalleryItems as unknown as CmsSocialGalleryItem[],
}: SocialVideoSectionProps) {
  return (
    <section className="social-gallery-section reveal-item" aria-labelledby="sosyal-galeri-title">
      <div className="section-heading compact">
        <h2 id="sosyal-galeri-title">Sosyal medyadan videolar</h2>
      </div>
      <div className="social-video-grid">
        {items.map((item) => {
          const isInstagram = item.platform === "Instagram";

          return (
            <a
              className="social-video-card"
              href={item.href}
              target="_blank"
              rel="noreferrer"
              key={item.href}
            >
              <div className="social-video-image">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  quality={68}
                  loading="lazy"
                  fetchPriority="low"
                  sizes="(max-width: 860px) 100vw, 42vw"
                  unoptimized={isDynamicMediaSource(item.image)}
                />
                <span className="social-video-play" aria-hidden="true">
                  <Play size={24} fill="currentColor" />
                </span>
              </div>
              <div className="social-video-body">
                <span
                  className={`social-video-icon ${
                    isInstagram ? "social-video-icon-instagram" : "social-video-icon-facebook"
                  }`}
                  aria-hidden="true"
                >
                  {isInstagram ? <InstagramIcon /> : <FacebookIcon />}
                </span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.platform} üzerinde izle</p>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
