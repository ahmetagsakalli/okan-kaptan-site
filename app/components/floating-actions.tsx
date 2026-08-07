"use client";

import { Pause, Phone, Play } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { phoneHref, whatsappUrl } from "../lib/contact-links";
import { WhatsAppIcon } from "./site-icons";

const musicSrc = "/audio/okan-kaptan-music.mp3";

export function FloatingActions() {
  const pathname = usePathname();
  const audioRef = useRef<HTMLAudioElement>(null);
  const bubbleTimerRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {
    const introTimer = window.setTimeout(() => {
      setShowBubble(true);
      bubbleTimerRef.current = window.setTimeout(() => setShowBubble(false), 5200);
    }, 900);

    return () => {
      window.clearTimeout(introTimer);

      if (bubbleTimerRef.current) {
        window.clearTimeout(bubbleTimerRef.current);
      }
    };
  }, []);

  const showTimedBubble = () => {
    setShowBubble(true);

    if (bubbleTimerRef.current) {
      window.clearTimeout(bubbleTimerRef.current);
    }

    bubbleTimerRef.current = window.setTimeout(() => setShowBubble(false), 4200);
  };

  const toggleMusic = async () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (audio.paused) {
      try {
        audio.volume = 0.62;
        await audio.play();
        setShowBubble(false);
      } catch {
        showTimedBubble();
      }

      return;
    }

    audio.pause();
    showTimedBubble();
  };

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <div className="floating-actions" aria-label="Hızlı iletişim ve müzik kontrolü">
      {showBubble ? (
        <div className="music-bubble" role="status" aria-live="polite">
          {isPlaying
            ? "Müzik açık. Durdurmak için butona dokunabilirsin."
            : "Mordoğan havası hazır. Müziği buradan açıp kapatabilirsin."}
        </div>
      ) : null}
      <audio
        ref={audioRef}
        src={musicSrc}
        preload="none"
        loop
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      <a className="float-contact float-phone" href={phoneHref} aria-label="Telefonla ara">
        <Phone size={25} aria-hidden="true" />
      </a>
      <button
        className={`float-contact float-music ${isPlaying ? "is-playing" : ""}`}
        type="button"
        aria-label={isPlaying ? "Müziği duraklat" : "Müziği başlat"}
        aria-pressed={isPlaying}
        onClick={toggleMusic}
      >
        {isPlaying ? (
          <Pause size={24} aria-hidden="true" />
        ) : (
          <Play size={23} fill="currentColor" aria-hidden="true" />
        )}
      </button>
      <a
        className="float-contact float-whatsapp"
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp ile yaz"
      >
        <WhatsAppIcon />
      </a>
    </div>
  );
}
