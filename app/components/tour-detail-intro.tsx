import { MessageCircle, PhoneCall } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { isDynamicMediaSource } from "../lib/media";
import { phoneHref, whatsappUrl } from "../lib/site-data";

type TourDetailIntroProps = {
  alt: string;
  eyebrow: string;
  facts: string[];
  image: string;
  season: "summer" | "winter";
  text: string;
  title: string;
};

export function TourDetailIntro({
  alt,
  eyebrow,
  facts,
  image,
  season,
  text,
  title,
}: TourDetailIntroProps) {
  return (
    <section className="tour-detail-intro reveal-item" data-season={season} aria-labelledby="tur-detay-title">
      <Image
        className="tour-detail-bg"
        src={image}
        alt={alt}
        fill
        priority
        quality={74}
        sizes="100vw"
        unoptimized={isDynamicMediaSource(image)}
      />
      <div className="tour-detail-shade" />
      <div className="tour-detail-copy">
        <span>{eyebrow}</span>
        <h2 id="tur-detay-title">{title}</h2>
        <p>{text}</p>
        <div className="tour-detail-actions">
          <a href={whatsappUrl} target="_blank" rel="noreferrer">
            <MessageCircle size={18} aria-hidden="true" />
            WhatsApp ile sor
          </a>
          <a href={phoneHref}>
            <PhoneCall size={18} aria-hidden="true" />
            Telefonla ara
          </a>
        </div>
      </div>
      <div className="tour-detail-facts" aria-label="Tur kısa bilgileri">
        {facts.map((fact) => (
          <span key={fact}>{fact}</span>
        ))}
      </div>
      <Link className="tour-detail-gallery-link" href={`/galeri?season=${season}`}>
        {season === "summer" ? "Yaz galerisini gör" : "Kış galerisini gör"}
      </Link>
    </section>
  );
}
