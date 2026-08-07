# Okan Kaptan Site

Okan Kaptan Mordogan gezi, yuzme ve balik turlari icin hazirlanan Next.js web sitesi.

## Ozellikler

- Next.js App Router
- Mobil uyumlu liquid glass arayuz
- Teknik SEO dosyalari: sitemap, robots, manifest ve metadata
- Admin paneli ile icerik ve gorsel yonetimi
- Vercel Blob destekli medya yukleme
- Galeri, turlar, rota, hakkimizda, SSS ve iletisim bolumleri

## Lokal Calistirma

```bash
pnpm install
pnpm dev
```

Varsayilan lokal adres:

```text
http://localhost:3000
```

## Ortam Degiskenleri

`.env.local` dosyasi repo disinda tutulur. Gerekli degiskenler icin `.env.example` dosyasini kullanabilirsiniz.

```bash
ADMIN_PASSWORD=change-this-admin-password
ADMIN_SESSION_SECRET=change-this-long-random-secret
```

Vercel production ortaminda medya yukleme icin `BLOB_READ_WRITE_TOKEN` tanimli olmalidir.

## Komutlar

```bash
pnpm lint
pnpm build
```

## Canli Site

https://okan-kaptan-site.vercel.app
