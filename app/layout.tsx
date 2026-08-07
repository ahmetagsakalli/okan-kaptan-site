import type { Metadata, Viewport } from "next";
import { LazyFloatingActions } from "./components/lazy-floating-actions";
import { ScrollReveal } from "./components/scroll-reveal";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://okankaptan35.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Okan Kaptan Mordoğan",
  title: {
    default: "Okan Kaptan Mordoğan | Gezi, Yüzme ve Balık Turları",
    template: "%s | Okan Kaptan Mordoğan",
  },
  description:
    "Okan Kaptan (Okan Dörtköşe) Mordoğan Gezi ve Yüzme Turları: İzmir Karaburun koylarında yemekli/yemeksiz tekne turu ve kış olta balıkçılığı.",
  keywords: [
    "Mordoğan tekne turu",
    "Mordoğan gezi turu",
    "Mordoğan yüzme turu",
    "Mordoğan balık turu",
    "Mordoğan olta balıkçılığı",
    "Uzunada balık turu",
    "Ardıç balık avı",
    "Kaynarpınar balık turu",
    "Mordoğan yemekli tekne turu",
    "Mordoğan özel tekne kiralama",
    "Mordoğan SUP",
    "Mordoğan Yeni Liman tekne turu",
    "Ayıbalığı Koyu tekne turu",
    "Korsan Yatağı Alifendere",
    "Manal Koyu tekne turu",
    "İzmir tekne turu",
    "Karaburun tekne turu",
    "Okan Kaptan 35",
  ],
  alternates: {
    canonical: "/",
  },
  authors: [{ name: "Okan Kaptan Mordoğan", url: siteUrl }],
  creator: "Okan Kaptan Mordoğan",
  publisher: "Okan Kaptan Mordoğan",
  formatDetection: {
    telephone: true,
    address: true,
    email: false,
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "/",
    siteName: "Okan Kaptan Mordoğan",
    title: "Okan Kaptan Mordoğan | 12 Kişilik Tekne Turları",
    description:
      "Mordoğan Yeni Liman çıkışlı 12 kişilik ticari tekne. Yazın yemekli/yemeksiz gezi ve yüzme turu, kışın profesyonel olta balıkçılığı.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Okan Kaptan Mordoğan tekne turu sosyal paylaşım görseli",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Okan Kaptan Mordoğan",
    description:
      "Mordoğan Yeni Liman çıkışlı gezi, yüzme ve kışın olta balıkçılığı.",
    images: ["/og.png"],
  },
  icons: {
    icon: [{ url: "/icon.png", type: "image/png", sizes: "96x96" }],
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
  },
  appleWebApp: {
    capable: true,
    title: "Okan Kaptan",
    statusBarStyle: "default",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "travel",
  other: {
    "geo.region": "TR-35",
    "geo.placename": "Mordoğan, Karaburun, İzmir",
    "business:contact_data:locality": "Mordoğan",
    "business:contact_data:region": "İzmir",
    "business:contact_data:country_name": "Türkiye",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#063c43",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" data-scroll-behavior="smooth">
      <body>
        <ScrollReveal />
        {children}
        <LazyFloatingActions />
      </body>
    </html>
  );
}
