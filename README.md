# Okan Kaptan Site

Okan Kaptan Mordogan gezi, yuzme ve balik turlari icin hazirlanan Next.js web sitesi.

## Ozellikler

- Next.js App Router
- Mobil uyumlu liquid glass arayuz
- Teknik SEO dosyalari: sitemap, robots, manifest ve metadata
- Admin paneli ile icerik ve gorsel yonetimi
- VPS volume veya Vercel Blob destekli medya yukleme
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
ADMIN_SESSION_SECRET=change-this-long-random-secret-at-least-32-chars
```

Vercel production ortaminda medya yukleme icin `BLOB_READ_WRITE_TOKEN` tanimli olmalidir.

## VPS'te Docker ile Yayinlama

VPS uzerinde Docker ve Docker Compose kuruluysa siteyi su sekilde yayinlayabilirsiniz:

```bash
git clone https://github.com/ahmetagsakalli/okan-kaptan-site.git
cd okan-kaptan-site
cp .env.production.example .env.production
```

`.env.production` icindeki degerleri sunucuya gore doldurun:

```bash
ADMIN_PASSWORD=guclu-admin-sifresi
ADMIN_SESSION_SECRET=uzun-rastgele-bir-secret-en-az-32-karakter
NEXT_PUBLIC_SITE_URL=https://okankaptan.com
```

VPS'te Vercel Blob kullanmak zorunlu degildir. `BLOB_READ_WRITE_TOKEN` bos kalirsa admin panelinden kaydedilen icerikler `data/`, yuklenen medyalar `public/uploads/` volume'lerinde saklanir.

```bash
docker compose up -d --build
docker compose ps
curl -f http://127.0.0.1:3000/api/health
```

Nginx icin ornek reverse proxy dosyasi:

```bash
sudo cp deploy/nginx/okan-kaptan.conf /etc/nginx/sites-available/okan-kaptan.conf
sudo ln -s /etc/nginx/sites-available/okan-kaptan.conf /etc/nginx/sites-enabled/okan-kaptan.conf
sudo nginx -t
sudo systemctl reload nginx
```

SSL icin domain DNS'i VPS'e yonlendikten sonra:

```bash
sudo certbot --nginx -d okankaptan.com -d www.okankaptan.com
```

Guncelleme komutu:

```bash
git pull
docker compose up -d --build
```

Rollback icin GitHub'daki onceki commit'e donup container'i tekrar kurabilirsiniz:

```bash
git log --oneline -5
git checkout <onceki-commit-sha>
docker compose up -d --build
```

## Komutlar

```bash
pnpm lint
pnpm build
```

## Canli Site

https://okankaptan.com
