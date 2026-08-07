"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, MessageCircle, Phone, PhoneCall, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { phoneHref, whatsappUrl } from "../lib/contact-links";
import { BrandLogo } from "./brand-logo";

const navItems = [
  { href: "/", label: "Ana sayfa" },
  { href: "/turlar", label: "Turlar" },
  { href: "/rota", label: "Rota" },
  { href: "/teknemiz", label: "Teknemiz" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/#sss", label: "SSS" },
  { href: "/#iletisim", label: "İletişim" },
];

type SiteHeaderProps = {
  className?: string;
};

export function SiteHeader({ className = "" }: SiteHeaderProps) {
  const pathname = usePathname();
  const [reservationOpen, setReservationOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const reservationRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!reservationRef.current?.contains(event.target as Node)) {
        setReservationOpen(false);
      }

      if (!mobileMenuRef.current?.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setReservationOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const closeMenus = () => {
    setReservationOpen(false);
    setMobileMenuOpen(false);
  };


  return (
    <header className={`site-header ${className}`} aria-label="Ana gezinme">
      <Link className="brand" href="/" aria-label="Okan Kaptan Mordoğan ana sayfa" onClick={closeMenus}>
        <BrandLogo />
      </Link>
      <nav className="nav-links" aria-label="Sayfa bağlantıları">
        {navItems.map((item) => (
          <Link
            className={pathname === item.href ? "active" : ""}
            href={item.href}
            key={item.href}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="header-actions">
        <div className="reservation-menu" ref={reservationRef}>
          <button
            className="header-call"
            type="button"
            aria-expanded={reservationOpen}
            aria-controls="reservation-options"
            onClick={() => {
              setMobileMenuOpen(false);
              setReservationOpen((open) => !open);
            }}
          >
            <Phone size={18} aria-hidden="true" />
            <span>Rezervasyon</span>
          </button>
          <div
            className={`reservation-options ${reservationOpen ? "is-open" : ""}`}
            id="reservation-options"
            aria-hidden={!reservationOpen}
          >
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              tabIndex={reservationOpen ? 0 : -1}
              onClick={() => setReservationOpen(false)}
            >
              <MessageCircle size={19} aria-hidden="true" />
              <span>
                <strong>WhatsApp</strong>
                Mesajla rezervasyon
              </span>
            </a>
            <a
              href={phoneHref}
              tabIndex={reservationOpen ? 0 : -1}
              onClick={() => setReservationOpen(false)}
            >
              <PhoneCall size={19} aria-hidden="true" />
              <span>
                <strong>Telefon</strong>
                Hemen ara
              </span>
            </a>
          </div>
        </div>
        <div className="mobile-nav-wrap" ref={mobileMenuRef}>
          <button
            className="mobile-menu-toggle"
            type="button"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-panel"
            onClick={() => {
              setReservationOpen(false);
              setMobileMenuOpen((open) => !open);
            }}
          >
            {mobileMenuOpen ? (
              <X size={20} aria-hidden="true" />
            ) : (
              <Menu size={20} aria-hidden="true" />
            )}
            <span className="visually-hidden">Menüyü aç veya kapat</span>
          </button>
          <nav
            className={`mobile-nav-panel ${mobileMenuOpen ? "is-open" : ""}`}
            id="mobile-nav-panel"
            aria-label="Mobil sayfa bağlantıları"
            aria-hidden={!mobileMenuOpen}
          >
            {navItems.map((item) => (
              <Link
                className={pathname === item.href ? "active" : ""}
                href={item.href}
                key={item.href}
                tabIndex={mobileMenuOpen ? 0 : -1}
                onClick={closeMenus}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
