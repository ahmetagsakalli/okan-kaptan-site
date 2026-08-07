import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Okan Kaptan Mordoğan",
    short_name: "Okan Kaptan",
    description:
      "Mordoğan çıkışlı gezi, yüzme, SUP ve olta balıkçılığı turları.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6fbf8",
    theme_color: "#063c43",
    lang: "tr",
    icons: [
      {
        src: "/images/okan-kaptan-icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/images/okan-kaptan-icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
