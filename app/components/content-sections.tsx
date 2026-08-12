import Image from "next/image";
import Link from "next/link";
import { Anchor, MapPinned, PhoneCall } from "lucide-react";
import type {
  CmsBoat,
  CmsCaptain,
  CmsListGroup,
  CmsRoute,
  CmsService,
  CmsTextItem,
} from "../lib/cms-types";
import { isDynamicMediaSource } from "../lib/media";
import {
  aboutFacts,
  aboutStory,
  amenityItems,
  captains,
  developerUrl,
  fishingNote,
  fishingPreparation,
  fishingTourHighlights,
  googleMapsEmbedUrl,
  googleMapsUrl,
  instagramUrl,
  locationHighlights,
  mealMenu,
  phoneDisplay,
  phoneHref,
  routeCoves,
  routeFacts,
  routePointPositions,
  routeSteps,
  services,
  trustItems,
  tourSpecs,
  whatsappUrl,
} from "../lib/site-data";
import { BrandLogo } from "./brand-logo";
import { InstagramIcon, WhatsAppIcon } from "./site-icons";

const serviceAnchors = ["yaz-gezi-yuzme", "kis-olta-balikciligi", "yemekli-tur"] as const;

type ServicesProps = {
  items?: CmsService[];
};

export function SeasonalActivitiesSection({ items = services }: ServicesProps) {
  const featuredServices = items.slice(0, 2);

  return (
    <section className="seasonal-activities reveal-item" aria-labelledby="etkinlikler-title">
      <div className="section-heading compact">
        <h2 id="etkinlikler-title">Etkinliklerimiz</h2>
      </div>
      <div className="activity-grid">
        {featuredServices.map((service, index) => {
          const Icon = services[index]?.icon ?? services[0].icon;
          const href = `/turlar#${serviceAnchors[index]}`;

          return (
            <Link className="activity-card" href={href} key={service.title}>
              <div className="activity-image">
                <Image
                  src={service.image}
                  alt={service.alt}
                  fill
                  quality={68}
                  loading="lazy"
                  fetchPriority="low"
                  sizes="(max-width: 860px) 100vw, 42vw"
                  unoptimized={isDynamicMediaSource(service.image)}
                />
              </div>
              <div className="activity-body">
                <span className="icon-badge">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <strong>Detayları gör</strong>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export function ServicesSection({ items = services }: ServicesProps) {
  return (
    <section className="section reveal-item" id="turlar" aria-labelledby="turlar-title">
      <div className="section-heading">
        <h2 id="turlar-title">Yazın koy turu, kışın olta keyfi.</h2>
      </div>
      <div className="service-grid">
        {items.map((service, index) => {
          const Icon = services[index]?.icon ?? services[0].icon;

          return (
            <article className="service-card" id={serviceAnchors[index]} key={service.title}>
              <div className="service-image">
                <Image
                  src={service.image}
                  alt={service.alt}
                  fill
                  quality={68}
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "auto" : "low"}
                  sizes="(max-width: 720px) 100vw, 33vw"
                  unoptimized={isDynamicMediaSource(service.image)}
                />
              </div>
              <div className="service-body">
                <span className="icon-badge">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

type TextItemsProps = {
  items?: CmsTextItem[];
};

export function TourSpecsSection({ items = tourSpecs }: TextItemsProps) {
  return (
    <section className="section specs-section reveal-item" aria-labelledby="tekne-title">
      <div className="section-heading compact">
        <h2 id="tekne-title">Tur özellikleri ve tekne donanımı.</h2>
      </div>
      <div className="specs-grid">
        {items.map((item, index) => {
          const Icon = tourSpecs[index]?.icon ?? tourSpecs[0].icon;

          return (
            <article className="spec-card" key={item.title}>
              <span className="icon-badge">
                <Icon size={20} aria-hidden="true" />
              </span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

type FishingTourSectionProps = {
  highlights?: CmsTextItem[];
  preparation?: CmsListGroup[];
  note?: string;
};

export function FishingTourSection({
  highlights = fishingTourHighlights,
  preparation = fishingPreparation,
  note = fishingNote,
}: FishingTourSectionProps) {
  return (
    <section className="fishing-section reveal-item" aria-labelledby="balik-title">
      <div className="fishing-copy">
        <h2 id="balik-title">Mordoğan balık turları</h2>
        <p>
          Gün doğumunda başlayan olta balıkçılığı turlarında rota; hava, akıntı ve deniz
          durumuna göre kaptan kontrolünde planlanır.
        </p>
      </div>
      <div className="fishing-highlight-grid">
        {highlights.map((item, index) => {
          const Icon = fishingTourHighlights[index]?.icon ?? fishingTourHighlights[0].icon;

          return (
            <article className="fishing-highlight" key={item.title}>
              <span className="icon-badge">
                <Icon size={20} aria-hidden="true" />
              </span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </article>
          );
        })}
      </div>
      <div className="fishing-prep-grid" aria-label="Balık turu hazırlık bilgileri">
        {preparation.map((group) => (
          <article className="fishing-prep-card" key={group.title}>
            <h3>{group.title}</h3>
            <ul>
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <p className="fishing-note">{note}</p>
    </section>
  );
}

export function MealMenuSection({ items = mealMenu }: TextItemsProps) {
  return (
    <section className="meal-section reveal-item" aria-labelledby="menu-title">
      <div className="meal-copy">
        <h2 id="menu-title">Yemekli tur menüsü</h2>
        <p>
          Lezzetli yemekler eşliğinde Mordoğan’ın birbirinden güzel koylarında unutulmaz
          bir gezi ve yüzme deneyimi planlanır. Menü rezervasyon sırasında netleştirilir.
        </p>
      </div>
      <div className="meal-list">
        {items.map((item) => (
          <article className="meal-item" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function AmenitySection({ items = amenityItems }: TextItemsProps) {
  return (
    <section className="section amenity-section reveal-item" aria-labelledby="olanaklar-title">
      <div className="section-heading compact">
        <h2 id="olanaklar-title">Yemek, müzik, güvenlik ve konfor detayları hazır.</h2>
      </div>
      <div className="amenity-grid">
        {items.map((item, index) => {
          const Icon = amenityItems[index]?.icon ?? amenityItems[0].icon;

          return (
            <article className="amenity-item" key={item.title}>
              <span className="icon-badge">
                <Icon size={20} aria-hidden="true" />
              </span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

type AboutSectionProps = {
  story?: string[];
};

export function AboutSection({ story = aboutStory }: AboutSectionProps) {
  return (
    <section className="about-section reveal-item" id="hakkimizda" aria-labelledby="hakkimizda-title">
      <div className="about-copy">
        <h2 id="hakkimizda-title">Hakkımızda</h2>
        {story.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <div className="about-facts">
          {aboutFacts.map((fact) => {
            const Icon = fact.icon;

            return (
              <article key={fact.title}>
                <span className="icon-badge">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <div>
                  <h3>{fact.title}</h3>
                  <p>{fact.text}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

type CaptainsSectionProps = {
  items?: CmsCaptain[];
};

export function CaptainsSection({ items = captains }: CaptainsSectionProps) {
  return (
    <section className="captains-section reveal-item" id="kaptanlar" aria-labelledby="kaptanlar-title">
      <div className="section-heading compact">
        <h2 id="kaptanlar-title">Kaptanlarımız</h2>
      </div>
      <div className="captain-grid">
        {items.map((captain) => {
          const preview = captain.bio.slice(0, 2);
          const more = captain.bio.slice(2);

          return (
            <article className="captain-card" key={captain.name}>
              <div className="captain-image" style={{ position: "relative" }}>
                <Image
                  src={captain.image}
                  alt={captain.alt}
                  fill
                  quality={68}
                  loading="lazy"
                  fetchPriority="low"
                  sizes="(max-width: 860px) 100vw, 34vw"
                  style={{ objectPosition: captain.imagePosition }}
                  unoptimized={isDynamicMediaSource(captain.image)}
                />
              </div>
              <div className="captain-body">
                <h3>{captain.name}</h3>
                <div className="captain-bio">
                  {preview.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                {more.length > 0 ? (
                  <details className="captain-more">
                    <summary>Devamını oku</summary>
                    <div className="captain-bio captain-bio-full">
                      {more.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </details>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

type BoatInfoSectionProps = {
  boat?: CmsBoat;
  specs?: CmsTextItem[];
};

export function BoatInfoSection({
  boat = {
    title: "12 kişilik ticari tekne",
    text: "Mordoğan Yeni Liman’da bağlı teknemiz; kalabalıktan uzak, aile ve arkadaş gruplarına özel güvenli bir deniz günü için hazırlanır.",
    image: "/images/okan-boat-real-wide.webp",
    alt: "Okan Kaptan teknesi Mordoğan koylarında seyir halinde",
  },
  specs = tourSpecs,
}: BoatInfoSectionProps) {
  const boatGallery = boat.gallery ?? [];

  return (
    <section className="boat-info-section reveal-item" id="tekne" aria-labelledby="tekne-bilgi-title">
      <div className="section-heading compact">
        <h2 id="tekne-bilgi-title">Teknemiz</h2>
      </div>
      <article className="boat-info-card">
        <div className="boat-info-image">
          <Image
            src={boat.image}
            alt={boat.alt}
            fill
            quality={68}
            loading="lazy"
            fetchPriority="low"
            sizes="(max-width: 860px) 100vw, 42vw"
            unoptimized={isDynamicMediaSource(boat.image)}
          />
        </div>
        <div className="boat-info-body">
          <h3>{boat.title}</h3>
          <p>{boat.text}</p>
          <div className="boat-info-grid">
            {specs.map((item, index) => {
              const Icon = tourSpecs[index]?.icon ?? tourSpecs[0].icon;

              return (
                <div className="boat-info-item" key={item.title}>
                  <span className="icon-badge">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </article>
      {boatGallery.length > 0 ? (
        <div className="boat-gallery-strip" aria-label="Tekneden seçili kareler">
          {boatGallery.map((item) => (
            <div className="boat-gallery-thumb" key={item.src}>
              <Image
                src={item.src}
                alt={item.alt}
                fill
                quality={68}
                loading="lazy"
                fetchPriority="low"
                sizes="(max-width: 860px) 92vw, 24vw"
                unoptimized={isDynamicMediaSource(item.src)}
              />
              <span className="visually-hidden">{item.title}</span>
            </div>
          ))}
        </div>
      ) : null}
      {boat.videoSrc ? (
        <article className="boat-video-card" aria-labelledby="boat-video-title">
          <div className="boat-video-frame">
            <span className="boat-video-label" id="boat-video-title">
              {boat.videoTitle ?? "Teknemizi birlikte gezelim"}
            </span>
            <video
              className="boat-video"
              controls
              playsInline
              preload="metadata"
              src={boat.videoSrc}
            />
          </div>
        </article>
      ) : null}
    </section>
  );
}

type RouteSectionProps = {
  route?: CmsRoute;
};

export function RouteSection({
  route = {
    steps: routeSteps,
    facts: routeFacts.map((fact) => fact.text),
    coves: routeCoves,
  },
}: RouteSectionProps) {
  return (
    <section className="route-section reveal-item" id="rota" aria-labelledby="rota-title">
      <div className="route-heading">
        <h2 id="rota-title">Örnek Rotamız</h2>
      </div>
      <div className="route-mobile-heading">
        <span className="route-mobile-mark" aria-hidden="true">
          <span />
          <Anchor size={34} />
          <span />
        </span>
        <h2>Günün Rotası</h2>
      </div>
      <div className="route-map" aria-label="Örnek tur akışı">
        <div className="route-visual" aria-hidden="true">
          <div className="route-boat-sketch">
            <svg viewBox="0 0 260 170">
              <path d="M45 104h166l-20 26H66L45 104Z" />
              <path d="M70 104V62h92v42" />
              <path d="M88 62V34h55v28" />
              <path d="M57 82h146" />
              <path d="M80 78h24M116 78h24M152 78h24" />
              <path d="M35 132c20 8 41 8 61 0 19-7 40-7 60 0 20 8 41 8 62 0" />
              <path d="M52 146c15 5 31 5 46 0 15-5 31-5 46 0 16 5 31 5 47 0" />
              <path d="M164 62l31 19" />
              <path d="M45 104l-16 16" />
            </svg>
          </div>
          <svg className="route-path" viewBox="0 0 1180 150">
            <path d="M70 96 C145 58 210 80 292 74 S460 62 562 86 724 96 825 76 980 106 1116 72" />
          </svg>
          <span className="route-birds route-birds-left">
            <span />
            <span />
          </span>
          <span className="route-birds route-birds-mid">
            <span />
            <span />
            <span />
          </span>
          <span className="route-island">
            <svg viewBox="0 0 150 80">
              <path d="M20 56c20-12 37-8 51-25 9-11 27-7 33 7 13 2 24 9 31 18" />
              <path d="M46 50c12 5 24 5 36 0 12-4 24-4 36 0" />
              <path d="M66 34c3-13 11-20 24-22" />
              <path d="M85 22c-2-8 0-14 7-19" />
              <path d="M16 64c22 7 44 7 66 0 21-7 43-7 65 0" />
            </svg>
          </span>
          <span className="route-end-anchor">
            <Anchor size={44} aria-hidden="true" />
          </span>
          <div className="route-points">
            {route.steps.map((step, index) => (
              <span
                className="route-point"
                key={step.title}
                style={{ left: routePointPositions[index] ?? `${18 + index * 20}%` }}
              >
                <span className="route-pin">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </span>
                <span className="route-dot" />
              </span>
            ))}
          </div>
        </div>
        <div className="route-cards">
          {route.steps.map((step, index) => {
            const Icon = routeSteps[index]?.icon ?? routeSteps[0].icon;

            return (
              <article className="route-card" key={step.title}>
                <span className="route-icon">
                  <Icon size={34} aria-hidden="true" />
                </span>
                <time>{step.time}</time>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
                {index < route.steps.length - 1 ? (
                  <span className="route-card-arrow" aria-hidden="true">
                    ›
                  </span>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
      <div className="route-summary-bar" aria-label="Rota kısa bilgileri">
        {route.facts.map((fact, index) => {
          const Icon = routeFacts[index]?.icon ?? routeFacts[0].icon;

          return (
            <span key={fact}>
              <Icon size={24} aria-hidden="true" />
              {fact}
            </span>
          );
        })}
      </div>
      <p className="route-cove-text">Örnek koylar: {route.coves.join(", ")}.</p>
      <div className="route-mobile-sea" aria-hidden="true">
        <svg viewBox="0 0 360 92">
          <path
            d="M0 52c38-24 75-24 112 0 37 24 75 24 113 0 45-28 90-22 135 18v22H0V52Z"
            fill="#a7dce0"
          />
          <path
            d="M0 68c44-16 88-16 132 0 43 15 86 15 129 0 34-12 67-11 99 4v20H0V68Z"
            fill="#7fcbd2"
          />
          <path d="M149 55h67l-14 16h-42l-11-16Z" fill="#07394f" />
          <path d="M163 55V35h35v20" fill="none" stroke="#07394f" strokeWidth="4" />
          <path d="M173 35V25h18v10" fill="none" stroke="#07394f" strokeWidth="4" />
          <path
            d="M150 82c20-7 39-7 59 0 17 6 34 6 51 0"
            fill="none"
            stroke="#f8ffff"
            strokeLinecap="round"
            strokeWidth="3"
          />
          <path
            d="M91 24c8-7 17-7 25 0M276 22c8-7 17-7 25 0"
            fill="none"
            stroke="#6aaab5"
            strokeLinecap="round"
            strokeWidth="4"
          />
        </svg>
      </div>
    </section>
  );
}

type LocationInfoSectionProps = {
  highlights?: string[];
};

export function LocationInfoSection({ highlights = locationHighlights }: LocationInfoSectionProps) {
  return (
    <section className="location-info-section reveal-item" aria-labelledby="konum-title">
      <div>
        <h2 id="konum-title">Kalkış noktası ve konum</h2>
        <p>
          Tekne Mordoğan Yeni Liman bünyesinde bağlıdır. Tur rotası hava durumuna göre
          Ayıbalığı Koyu, Korsan Yatağı (Alifendere), Manal Koyu ve benzeri yüzme
          noktalarına göre planlanır.
        </p>
      </div>
      <ul>
        {highlights.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

export function TrustSection() {
  return (
    <section className="section trust-section reveal-item" aria-labelledby="guven-title">
      <div className="section-heading compact">
        <h2 id="guven-title">Küçük teknede net iletişim, güvenli planlama.</h2>
      </div>
      <div className="trust-grid">
        {trustItems.map((item) => {
          const Icon = item.icon;

          return (
            <article className="trust-item" key={item.title}>
              <span className="icon-badge muted">
                <Icon size={21} aria-hidden="true" />
              </span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function ContactSection() {
  return (
    <section className="contact-section reveal-item" id="iletisim" aria-label="İletişim ve konum">
      <div className="contact-copy-block">
        <Link className="contact-brand" href="/" aria-label="Okan Kaptan Mordoğan ana sayfa">
          <BrandLogo className="contact-logo-image" />
          <span>Mordoğan / Karaburun</span>
        </Link>
        <p>
          Mordoğan Yeni Liman çıkışlı, 10 m boyunda ve 3.30 m eninde 12 kişilik ticari
          tekne.
        </p>
        <nav className="contact-nav" aria-label="Alt menü">
          <Link href="/galeri">Galeri</Link>
          <Link href="/hakkimizda">Hakkımızda</Link>
          <Link href="/turlar">Turlar</Link>
          <Link href="/rota">Rota</Link>
          <Link href="/teknemiz">Teknemiz</Link>
          <Link href="/#sss">SSS</Link>
          <Link href="/#iletisim">İletişim</Link>
        </nav>
        <p className="contact-credit">
          Web tasarım, uygulama ve geliştirme:{" "}
          <a href={developerUrl} target="_blank" rel="noreferrer">
            kocyigityazilim.com
          </a>
        </p>
      </div>
      <div className="contact-actions">
        <a className="contact-card" href={phoneHref}>
          <span className="contact-icon contact-phone-icon">
            <PhoneCall size={23} aria-hidden="true" />
          </span>
          <span className="contact-copy">
            <strong>{phoneDisplay}</strong>
            Telefonla bilgi al
          </span>
        </a>
        <a className="contact-card" href={instagramUrl} target="_blank" rel="noreferrer">
          <span className="contact-icon contact-instagram-icon">
            <InstagramIcon />
          </span>
          <span className="contact-copy">
            <strong>@okankaptan35</strong>
            Güncel paylaşımlar
          </span>
        </a>
        <a className="contact-card" href={whatsappUrl} target="_blank" rel="noreferrer">
          <span className="contact-icon contact-whatsapp-icon">
            <WhatsAppIcon />
          </span>
          <span className="contact-copy">
            <strong>WhatsApp</strong>
            Rezervasyon mesajı
          </span>
        </a>
        <a className="contact-card" href={googleMapsUrl} target="_blank" rel="noreferrer">
          <span className="contact-icon contact-map-icon">
            <MapPinned size={23} aria-hidden="true" />
          </span>
          <span className="contact-copy">
            <strong>Mordoğan Yeni Liman</strong>
            Mordoğan, Karaburun / İzmir
          </span>
        </a>
      </div>
      <div className="map-card">
        <iframe
          title="Okan Kaptan Mordoğan Google Maps konumu"
          src={googleMapsEmbedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <a className="map-open" href={googleMapsUrl} target="_blank" rel="noreferrer">
          <MapPinned size={18} aria-hidden="true" />
          Google Maps&apos;te aç
        </a>
      </div>
    </section>
  );
}
