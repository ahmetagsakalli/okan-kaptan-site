"use client";

import Image from "next/image";
import { Snowflake, SunMedium } from "lucide-react";
import { useState } from "react";
import type { CmsHero } from "../lib/cms-types";
import { type Season } from "../lib/site-data";
import { SiteHeader } from "./site-header";

const seasonCopy = {
  summer: {
    label: "Yaz",
    title: "Gezi ve yüzme",
    note: "Yazın koy turu, yüzme molaları ve SUP keyfi.",
    Icon: SunMedium,
  },
  winter: {
    label: "Kış",
    title: "Olta balıkçılığı",
    note: "Kışın sakin rota, olta balıkçılığı ve kaptan eşliği.",
    Icon: Snowflake,
  },
} as const;

type SeasonHeroProps = {
  content?: CmsHero;
  season?: Season;
  onSeasonChange?: (season: Season) => void;
};

export function SeasonHero({ content, season, onSeasonChange }: SeasonHeroProps) {
  const [internalSeason, setInternalSeason] = useState<Season>("summer");
  const selectedSeason = season ?? internalSeason;
  const setSelectedSeason = onSeasonChange ?? setInternalSeason;
  const activeCopy = seasonCopy[selectedSeason];
  const active = {
    ...activeCopy,
    ...(content?.[selectedSeason] ?? {}),
    Icon: activeCopy.Icon,
  };
  const ActiveIcon = active.Icon;
  const isWinter = selectedSeason === "winter";

  return (
    <section
      className={`hero ${isWinter ? "hero-winter" : "hero-summer"}`}
      id="anasayfa"
      aria-labelledby="hero-title"
    >
      <div className="hero-scene-wrap" aria-hidden="true">
        <Image
          src="/images/hero-scene.webp"
          alt=""
          fill
          preload
          fetchPriority="high"
          sizes="100vw"
          className="hero-scene"
        />
      </div>
      <h1 id="hero-title" className="hero-title-backdrop">
        {content?.title ?? "4 MEVSİM ETKİNLİK"}
      </h1>

      <SiteHeader />

      <div className="hero-content">
        <div className="season-switch" aria-label="Mevsim seçimi">
          <span className={`season-thumb ${isWinter ? "is-winter" : ""}`} aria-hidden="true" />
          <button
            type="button"
            className={!isWinter ? "active" : ""}
            aria-pressed={!isWinter}
            onClick={() => setSelectedSeason("summer")}
          >
            <SunMedium size={16} aria-hidden="true" />
            Yaz
          </button>
          <button
            type="button"
            className={isWinter ? "active" : ""}
            aria-pressed={isWinter}
            onClick={() => setSelectedSeason("winter")}
          >
            <Snowflake size={16} aria-hidden="true" />
            Kış
          </button>
        </div>
        <h2 className="hero-season-title">
          <ActiveIcon size={18} aria-hidden="true" />
          {active.title}
        </h2>
      </div>

      <div className="hero-bottom" aria-label="Okan Kaptan mevsim bilgileri">
        <p className="hero-note">{active.note}</p>
      </div>
    </section>
  );
}
