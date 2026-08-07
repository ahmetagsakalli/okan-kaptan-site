import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const outputDir = path.join(process.cwd(), "public", "images");
const businessSourceDir = path.join(process.cwd(), "work", "assets", "business-originals");

const images = [
  {
    name: "hero-boat",
    url: "https://images.unsplash.com/photo-1564166489229-dfb970a591bf?auto=format&fit=crop&fm=jpg&q=82&w=2400",
    width: 1920,
    height: 1180,
  },
  {
    name: "summer-swim",
    url: "https://images.unsplash.com/photo-1564167776935-d9d49beabba5?auto=format&fit=crop&fm=jpg&q=82&w=1800",
    width: 1100,
    height: 1320,
  },
  {
    name: "winter-fishing",
    url: "https://images.unsplash.com/photo-1598855993717-d707289d5abc?auto=format&fit=crop&fm=jpg&q=82&w=1800",
    width: 1100,
    height: 1320,
  },
  {
    name: "clear-water",
    url: "https://images.unsplash.com/photo-1564167776868-cd868ebc6924?auto=format&fit=crop&fm=jpg&q=82&w=1600",
    width: 1000,
    height: 1000,
  },
  {
    name: "coast-boat",
    url: "https://images.unsplash.com/photo-1653070010643-a010c5cefc7b?auto=format&fit=crop&fm=jpg&q=82&w=1800",
    width: 1200,
    height: 900,
  },
];

const generatedImages = [
  {
    name: "hero-scene",
    url: "AI-generated scenic hero based on user-provided composition reference",
    width: 1672,
    height: 941,
    optimized: "public/images/hero-scene.webp",
  },
];

const localImages = [
  {
    name: "okan-clear-coast",
    source: path.join(businessSourceDir, "IMG_5598.PNG"),
    width: 1200,
    height: 820,
    alt: "Mordoğan açıklarında berrak turkuaz deniz ve kıyı manzarası",
  },
  {
    name: "okan-boat-cove",
    source: path.join(businessSourceDir, "IMG_5599.PNG"),
    width: 1200,
    height: 820,
    alt: "Okan Kaptan teknesi Mordoğan koyunda yüzme molasında",
  },
  {
    name: "okan-dining",
    source: path.join(businessSourceDir, "IMG_5596.PNG"),
    width: 1200,
    height: 900,
    alt: "Okan Kaptan teknesinde yemekli tur için hazırlanmış masalar",
  },
  {
    name: "okan-sup",
    source: path.join(businessSourceDir, "IMG_5597.PNG"),
    width: 900,
    height: 1100,
    alt: "Mordoğan turkuaz suyunda ücretsiz SUP kullanan misafir",
  },
];

async function download(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Image download failed: ${response.status} ${url}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

async function buildImage({ name, url, width, height }) {
  const original = await download(url);
  const target = path.join(outputDir, `${name}.webp`);

  await sharp(original)
    .rotate()
    .resize(width, height, { fit: "cover", position: "center" })
    .webp({ quality: 78, effort: 6 })
    .toFile(target);

  return { name, original };
}

async function buildLocalImage({ name, source, width, height }) {
  const original = await readFile(source);
  const target = path.join(outputDir, `${name}.webp`);

  await sharp(original)
    .rotate()
    .trim({ background: "#000000", threshold: 8 })
    .resize(width, height, { fit: "cover", position: "center", withoutEnlargement: true })
    .modulate({ brightness: 1.02, saturation: 1.04 })
    .webp({ quality: 80, effort: 6 })
    .toFile(target);

  return { name, original };
}

async function buildOpenGraph(heroBuffer) {
  const overlay = Buffer.from(`
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shade" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#06262a" stop-opacity="0.84"/>
          <stop offset="58%" stop-color="#064e58" stop-opacity="0.36"/>
          <stop offset="100%" stop-color="#f4c05f" stop-opacity="0.18"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#shade)"/>
      <text x="72" y="104" fill="#f6fbf8" font-family="Inter, Arial, sans-serif" font-size="30" font-weight="700">Okan Kaptan Mordoğan</text>
      <text x="72" y="272" fill="#ffffff" font-family="Inter, Arial, sans-serif" font-size="78" font-weight="800">Mordoğan koylarına</text>
      <text x="72" y="360" fill="#ffffff" font-family="Inter, Arial, sans-serif" font-size="78" font-weight="800">12 kişilik tekneyle</text>
      <text x="72" y="448" fill="#ffffff" font-family="Inter, Arial, sans-serif" font-size="78" font-weight="800">çıkın.</text>
      <text x="76" y="536" fill="#e9fffb" font-family="Inter, Arial, sans-serif" font-size="30" font-weight="600">Yemekli/yemeksiz tur, SUP ve olta keyfi.</text>
    </svg>
  `);

  await sharp(heroBuffer)
    .resize(1200, 630, { fit: "cover", position: "center" })
    .modulate({ brightness: 0.92, saturation: 1.08 })
    .composite([{ input: overlay, top: 0, left: 0 }])
    .png({ quality: 88, compressionLevel: 9 })
    .toFile(path.join(process.cwd(), "public", "og.png"));
}

await mkdir(outputDir, { recursive: true });

const results = [];
for (const image of images) {
  results.push(await buildImage(image));
}

for (const image of localImages) {
  results.push(await buildLocalImage(image));
}

const hero = results.find((image) => image.name === "hero-boat");
let openGraphSource = hero?.original;

try {
  openGraphSource = await readFile(path.join(outputDir, "hero-scene.webp"));
} catch {
  // Keep the downloaded hero photo as a fallback when the generated hero is absent.
}

if (openGraphSource) {
  await buildOpenGraph(openGraphSource);
}

await writeFile(
  path.join(outputDir, "sources.json"),
  `${JSON.stringify(
    [
      ...images,
      ...localImages.map(({ source, ...image }) => ({
        ...image,
        url: `Business-provided local source: ${path.relative(process.cwd(), source)}`,
      })),
      ...generatedImages,
    ],
    null,
    2,
  )}\n`,
  "utf8",
);

console.log(`Optimized ${images.length + localImages.length} images to ${outputDir}`);
