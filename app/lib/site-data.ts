import {
  Anchor,
  Binoculars,
  Camera,
  Clock3,
  CloudSun,
  Coffee,
  Fish,
  LifeBuoy,
  MapPinned,
  Music2,
  ReceiptText,
  RotateCcw,
  ShieldCheck,
  Ship,
  Utensils,
  UsersRound,
  Waves,
  type LucideIcon,
} from "lucide-react";
import { phoneHref, whatsappUrl } from "./contact-links";

export { phoneHref, whatsappUrl };

export type Season = "summer" | "winter";

export const phoneDisplay = "0533 613 19 20";
export const instagramUrl = "https://www.instagram.com/okankaptan35/";
export const googleBusinessUrl = "https://share.google/FSKuHB1bqvSqEgC4M";
export const googleMapsUrl = "https://maps.app.goo.gl/W6DfMqYWbUxW1w987";
export const googleMapsEmbedUrl =
  "https://www.google.com/maps?q=Okan%20Kaptan%20Mordo%C4%9Fan%20Gezi%20ve%20Y%C3%BCzme%20Turlar%C4%B1&output=embed";
export const developerUrl = "https://kocyigityazilim.com";
export const googleReviewsUrl =
  "https://www.google.com/search?sca_esv=b59435e14644ce34&hl=tr-TR&sxsrf=APpeQnutGrAcyJBjNf0MBclq-g3i4u3alw:1785864251874&q=Okan+kaptan+Mordo%C4%9Fan+gezi+ve+y%C3%BCzme+turlar%C4%B1&si=APenkKm7iecQ4G6P-TsbSMFKIQtv3EFIqRAFw-i8uEbk55Z-_5AspuU_C4tEsUvKcQu1pJSx1GJiBNv3Ur6ZCq7IoAEYiIsBeCREommuKDGeJidjkZH0Xic%3D&uds=AJ5uw1_qjlRx65q3NdtskgtQzMvnGUhsc4Fnua-baHjnSg5k9TReZPY2GMwKaSUl5bsM_kXEvLdnoa58dSB3JsDkQxV-j0_rESGxtNlZSKvkWq1ArnqrkSY2ATHPsA3jcKTsEbkBeXh59kBnzRnJlU2U1OWqMwlFmA&sa=X&ved=2ahUKEwiu5uXivoeWAxXRhP0HHVn3IVwQ3PALegQIGxAE&biw=1680&bih=823&dpr=2";
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://okankaptan35.com";

type IconItem = {
  icon: LucideIcon;
  title: string;
  text: string;
};

export const services = [
  {
    icon: Waves,
    title: "Yaz Gezi ve Yüzme Turu",
    image: "/images/okan-boat-real-cove.webp",
    alt: "Okan Kaptan teknesi Mordoğan koyunda gerçek tur görüntüsü",
    text: "İzmir Karaburun'un eşsiz koylarında yemekli veya yemeksiz günlük gezi ve yüzme turu.",
  },
  {
    icon: Fish,
    title: "Kış Olta Balıkçılığı",
    image: "/images/fish-guest-catch-2.webp",
    alt: "Okan Kaptan balık turunda misafirin yakaladığı balık",
    text: "06:00 çıkış, 18:00 dönüş planıyla Mordoğan çevresinde profesyonel olta balıkçılığı.",
  },
  {
    icon: Utensils,
    title: "Yemekli / Yemeksiz Özel Tur",
    image: "/images/okan-dining.webp",
    alt: "Okan Kaptan teknesinde yemekli tur için hazırlanmış masalar",
    text: "Kasap köfte, tavuk pirzola veya ızgara çupra seçenekleri; meze, içecek ve sıcak ikramlarla tamamlanır.",
  },
];

export const galleryCollections = {
  summer: {
    title: "Yaz galerisi",
    summary: "Gezi, yüzme, SUP, yemekli tur ve teknenin gerçek tur kareleri.",
    items: [
      {
        kind: "photo",
        title: "Okan Kaptan teknesi koyda",
        src: "/images/okan-boat-real-cove.webp",
        alt: "Okan Kaptan teknesi Mordoğan koyunda seyir halinde",
        featured: true,
      },
      {
        kind: "photo",
        title: "Tekne dış görünüm",
        src: "/images/okan-boat-real-wide.webp",
        alt: "Okan Kaptan teknesinin deniz üzerindeki dış görünümü",
      },
      {
        kind: "photo",
        title: "Tekne ön alanı",
        src: "/images/okan-boat-front-group.webp",
        alt: "Okan Kaptan teknesinde ön bölüm ve misafir alanı",
      },
      {
        kind: "photo",
        title: "Tekne iç düzeni",
        src: "/images/okan-boat-interior-guests.webp",
        alt: "Okan Kaptan teknesinin iç oturma ve masa düzeni",
      },
      {
        kind: "photo",
        title: "Teknede sofra",
        src: "/images/okan-dining.webp",
        alt: "Okan Kaptan teknesinde hazırlanmış yemek masaları",
      },
      {
        kind: "photo",
        title: "SUP keyfi",
        src: "/images/okan-sup.webp",
        alt: "Mordoğan turunda SUP yapan misafir",
      },
      {
        kind: "photo",
        title: "Berrak koy suyu",
        src: "/images/clear-water.webp",
        alt: "Mordoğan koylarında berrak turkuaz su",
      },
    ],
  },
  winter: {
    title: "Kış galerisi",
    summary: "Olta balıkçılığı, av anları, yakalanan balıklar ve sakin kış rotası.",
    items: [
      {
        kind: "photo",
        title: "Balık turu av keyfi",
        src: "/images/fish-guest-catch-1.webp",
        alt: "Okan Kaptan balık turunda yakalanan balığı gösteren misafir",
        featured: true,
      },
      {
        kind: "video",
        title: "Olta balıkçılığı videosu",
        src: "/images/fish-guest-catch-2.webp",
        videoSrc: "/videos/fishing-catch-1.mp4",
        alt: "Okan Kaptan balık turu videosu için yakalanan balık görseli",
      },
      {
        kind: "photo",
        title: "Günün bereketi",
        src: "/images/fish-catch-bucket.webp",
        alt: "Okan Kaptan balık turunda kovada yakalanan balıklar",
      },
      {
        kind: "photo",
        title: "Balık sepeti",
        src: "/images/fish-catch-bag.webp",
        alt: "Balık turunda gün içinde yakalanan balıklar",
      },
      {
        kind: "video",
        title: "Denizde av anları",
        src: "/images/fish-guest-catch-3.webp",
        videoSrc: "/videos/fishing-catch-2.mp4",
        alt: "Okan Kaptan olta balıkçılığı turundan video kapağı",
      },
      {
        kind: "photo",
        title: "Kış rotasında tekne",
        src: "/images/fish-boat-side.webp",
        alt: "Okan Kaptan teknesi balık turu için liman yanında",
      },
      {
        kind: "video",
        title: "Balık turundan kısa kesit",
        src: "/images/fish-catch-bucket.webp",
        videoSrc: "/videos/fishing-catch-3.mp4",
        alt: "Balık turundan kısa video için yakalanan balıklar",
      },
    ],
  },
} as const;

export const socialGalleryItems = [
  {
    platform: "Instagram",
    title: "Mordoğan tur videosu",
    href: "https://www.instagram.com/reel/Dbkq5j1SqXI/",
    image: "/images/okan-boat-real-cove.webp",
    alt: "Instagram Reel için Okan Kaptan tekne turu görüntüsü",
  },
  {
    platform: "Facebook",
    title: "Tekneden kısa video",
    href: "https://www.facebook.com/share/v/1CtBctSpmQ/?mibextid=wwXIfr",
    image: "/images/okan-boat-front-group.webp",
    alt: "Facebook videosu için Okan Kaptan tekne görüntüsü",
  },
];

export const routeSteps = [
  {
    time: "10:00",
    title: "Mordoğan çıkışı ve karşılama",
    text: "Tekneye geçiş yapılır, kısa bilgilendirme verilir ve rota başlatılır.",
    icon: Anchor,
  },
  {
    time: "11:00",
    title: "Hava durumuna göre koy seçimi",
    text: "Ayıbalığı Koyu, Korsan Yatağı (Alifendere) veya Manal Koyu gibi uygun noktalardan biri seçilir.",
    icon: CloudSun,
  },
  {
    time: "12:00",
    title: "Yüzme, SUP, dinlenme ve fotoğraf molaları",
    text: "Uygun koyda yüzme keyfi, SUP deneyimi ve dinlenme için serbest zaman verilir.",
    icon: Binoculars,
  },
  {
    time: "18:00",
    title: "Dönüş planı",
    text: "Günün sonunda Mordoğan'a dönüş yapılır ve tur tamamlanır.",
    icon: RotateCcw,
  },
];

export const routeFacts = [
  {
    icon: Clock3,
    text: "Sabah 10:00 çıkış, 18:00 dönüş",
  },
  {
    icon: UsersRound,
    text: "Aile ve gruplara uygun",
  },
  {
    icon: Ship,
    text: "10 m tekne, 3.30 m en, 12 kişi",
  },
];

export const routeCoves = [
  "Ayıbalığı Koyu",
  "Korsan Yatağı (Alifendere)",
  "Manal Koyu",
];

export const routePointPositions = ["18%", "40%", "63%", "86%"];

export const googleReviewHighlights = [
  {
    author: "Google kullanıcısı",
    text: "Tekne temizliği, ilgili kaptan ve sakin rota yorumlarda öne çıkıyor.",
  },
  {
    author: "Google kullanıcısı",
    text: "Aileler ve gruplar için keyifli, güvenli ve rahat bir deniz günü.",
  },
  {
    author: "Google kullanıcısı",
    text: "Mordoğan koyları, yüzme molaları ve berrak deniz deneyimi beğeniliyor.",
  },
  {
    author: "Google kullanıcısı",
    text: "Samimi ekip, planlı tur akışı ve güzel manzara sıkça vurgulanıyor.",
  },
  {
    author: "Google kullanıcısı",
    text: "Yaz turları kadar kış olta balıkçılığı da tercih ediliyor.",
  },
];

export const trustItems: IconItem[] = [
  {
    icon: UsersRound,
    title: "12 kişilik ticari evraklı tekne",
    text: "Kalabalıktan uzak, sadece grubunuza özel 12 kişilik konsept.",
  },
  {
    icon: ShieldCheck,
    title: "Sigortalı ve güvenli tur",
    text: "Tam donanımlı ticari evraklı tekne; güvenlik ve konfor donanımlarıyla hazırlanır.",
  },
  {
    icon: Camera,
    title: "Mordoğan ve Karaburun koyları",
    text: "Mordoğan Yeni Liman çıkışlı rota, Karaburun'un berrak yüzme noktalarına uzanır.",
  },
];

export const aboutFacts: IconItem[] = [
  {
    icon: Ship,
    title: "12 kişilik tekne",
    text: "10 metre boy, 3.30 metre en ve 12 kişi kapasite ile küçük gruplara kontrollü alan sunar.",
  },
  {
    icon: Waves,
    title: "4 mevsim rota",
    text: "Yazın gezi ve yüzme, kışın olta balıkçılığı için hava durumuna göre planlanır.",
  },
  {
    icon: ShieldCheck,
    title: "Ticari işletme",
    text: "Ticari evraklı teknede kapalı WC, duş, güneşlenme minderleri, buzdolabı ve mutfak kullanımı bulunur.",
  },
];

export const aboutStory = [
  "Biz, Okan Kaptan ve Abdullah Kaptan olarak, denize olan tutkumuzu yılların deneyimiyle birleştirerek misafirlerimize unutulmaz anlar yaşatmak için hizmet veriyoruz.",
  "Okan Kaptan, Mordoğanlıdır. Halkla İlişkiler ve İşletme Fakültesi mezunudur. Uzun yıllar bankacılık sektöründe görev yaptıktan sonra 2019 yılında emekli olmuş ve çocukluğundan beri içinde taşıdığı deniz sevgisini mesleğe dönüştürmüştür. Emekliliğinin ardından teknesini büyüterek Mordoğan’ın eşsiz koylarında gezi, yüzme ve balık avı turları düzenlemeye başlamıştır.",
  "Abdullah Kaptan ise Ankara’da doğup büyümüştür. Çocukluğu Kesikköprü, Kurtboğazı ve Hirfanlı Barajı’nda balık avlayarak geçmiş, bu tutkusunu yıllar içinde geliştirerek kendi teknesiyle kamp ve balıkçılık faaliyetleri gerçekleştirmiştir. 35 yıl Çevre ve Şehircilik Bakanlığı’nda kamu görevlisi olarak çalışmış, ayrıca uzun yıllar sendikanın Eğitim Sekreteri görevini yürütmüştür. Emekli olduktan sonra yaşam biçimi, doğası ve insanlarını çok sevdiği İzmir Mordoğan’a yerleşmiş ve deniz tutkusunu burada yaşamaya devam etmiştir.",
  "Yollarımız Mordoğan’da kesişti. Ortak deniz sevgimiz ve dostluğumuz zamanla güçlü bir iş ortaklığına dönüştü. Teknelerimizi büyüterek misafirlerimize güvenli, konforlu ve samimi bir ortamda gezi, yüzme ve balık avı turları sunmaya başladık.",
  "Her turumuzda önceliğimiz güven, kaliteli hizmet ve misafir memnuniyetidir. Mordoğan ve Karaburun’un birbirinden güzel koylarını, berrak denizini ve doğal güzelliklerini sizlerle paylaşırken, kendinizi misafir değil, ailemizin bir parçası gibi hissetmenizi amaçlıyoruz.",
  "Denizi seven herkesi, birlikte güzel anılar biriktirmeye ve Ege’nin eşsiz maviliğini bizimle keşfetmeye davet ediyoruz.",
];

export const captains = [
  {
    name: "Okan Dörtköşe",
    image: "/images/captain-okan-dortkose.webp",
    imagePosition: "center 44%",
    alt: "Okan Dörtköşe Okan Kaptan teknesinde kaptan kıyafetiyle",
    bio: [
      "Merhaba, ben Okan Dörtköşe, misafirlerimizin tanıdığı adıyla Okan Kaptan.",
      "Mordoğan’da doğup büyüdüm. Çocukluğum Ege Denizi’nin masmavi sularında, koylarında ve teknelerin arasında geçti. Deniz sevgisi benim için sadece bir hobi değil, yaşam biçimi oldu.",
      "Eğitim hayatım boyunca Halkla İlişkiler ve İşletme Fakültesi alanlarında öğrenim gördüm. Ardından uzun yıllar bankacılık sektöründe çalışarak müşteri ilişkileri, hizmet kalitesi, planlama ve güven odaklı çalışma anlayışı kazandım.",
      "2019 yılında bankacılık mesleğinden emekli olduktan sonra, yıllardır kurduğum hayalimi gerçekleştirdim. Teknemi büyüterek ticari gezi, yüzme ve balık avı turlarına başladım. O günden bu yana, doğup büyüdüğüm Mordoğan’ın eşsiz koylarını yerli ve yabancı misafirlerimize tanıtmanın gururunu yaşıyorum.",
      "Her turda amacımız; misafirlerimizin kendilerini evlerinde hissedecekleri sıcak ve samimi bir ortam sunmak, güvenli bir deniz yolculuğu gerçekleştirmek ve Ege’nin doğal güzelliklerini en keyifli şekilde keşfetmelerini sağlamaktır. Lezzetli ikramlarımız, özenle seçtiğimiz rotalarımız ve misafir memnuniyetini esas alan hizmet anlayışımızla her gün aynı heyecanla denize açılıyoruz.",
      "Bizim için tekne turu yalnızca bir gezi değildir; dostlukların kurulduğu, güzel anıların biriktiği ve denizin huzurunun paylaşıldığı özel bir deneyimdir.",
      "Sizleri de Mordoğan ve Karaburun’un berrak koylarında, güvenli, huzurlu ve keyif dolu bir gün geçirmek üzere teknemizde ağırlamaktan büyük mutluluk duyarız.",
      "Sevgi ve saygılarımla, Okan Dörtköşe (Okan Kaptan)",
    ],
    details: ["Mordoğanlı kaptan", "Kurucu ve kaptan", "Gezi, yüzme ve balık avı"],
  },
  {
    name: "Abdullah Yüksel",
    image: "/images/captain-abdullah-yuksel.webp",
    imagePosition: "center 38%",
    alt: "Abdullah Yüksel Okan Kaptan teknesinde kaptan kıyafetiyle",
    bio: [
      "Merhaba, ben Abdullah Yüksel. Ankara’da doğup büyüdüm. Çocukluğum Ankara’nın çevresindeki Kesikköprü, Kurtboğazı ve Hirfanlı barajlarında balık avlayarak geçti.",
      "Hobimi biraz daha ilerleterek küçük bir tekne aldım. Hafta sonları özellikle Kesikköprü’de hem kamp yapıp hem de balık avları gerçekleştirdim.",
      "Bu süre içinde 35 yıl Çevre ve Şehircilik Bakanlığı’nda kamu görevlisi olarak çalıştım. Kurumun bağlı olduğu sendikada uzun süre Eğitim Sekreteri olarak görev yaptım.",
      "12 sene önce emekli olup yaşam biçimiyle, kültürüyle ve insanıyla çok sevdiğim İzmir Mordoğan’a yerleştim. İlk işim, hayalim olan; ailem ve sevdiklerimle yazın yüzme, kışın ise balık avları yapabileceğim bir tekne almak oldu.",
      "Emekliliğimi bu şekilde zevkle geçirirken Okan Kaptan ile gelişen dostluğumuz sayesinde teknelerimizi büyüterek ticari gezi, yüzme ve balık avı turlarımıza başladık.",
    ],
    details: ["Olta balıkçılığı deneyimi", "35 yıl kamu görevi", "Abdullah Kaptan"],
  },
];

export const amenityItems: IconItem[] = [
  {
    icon: Utensils,
    title: "Yemekli veya yemeksiz tur",
    text: "Menü ve masa düzeni talepleriniz doğrultusunda rezervasyon sırasında netleşir.",
  },
  {
    icon: Coffee,
    title: "Çay ve Türk kahvesi",
    text: "Gün boyu sıcak içecek ikramı, yemek sonrası Türk kahvesi servisi planlanabilir.",
  },
  {
    icon: Waves,
    title: "Ücretsiz SUP",
    text: "Uygun koylarda misafirler için SUP deneyimi tur akışına eklenebilir.",
  },
  {
    icon: Music2,
    title: "Müzik sistemi ve karaoke",
    text: "Aile ve arkadaş grupları için eğlence odaklı özel günler düzenlenebilir.",
  },
  {
    icon: LifeBuoy,
    title: "Kapalı WC, can yeleği ve mutfak",
    text: "Kapalı WC, kişi sayısı kadar can yeleği, mutfak kullanımı ve konfor donanımları bulunur.",
  },
  {
    icon: ReceiptText,
    title: "Rezervasyon notu",
    text: "Güncel fiyat ve kapora bilgisi rezervasyon öncesinde telefonla netleştirilir.",
  },
];

export const tourSpecs: IconItem[] = [
  {
    icon: UsersRound,
    title: "12 kişi kapasite",
    text: "Kalabalıktan uzak, sadece grubunuza özel günlük tekne turu konsepti.",
  },
  {
    icon: Ship,
    title: "10 m boy, 3.30 m en",
    text: "Mordoğan Yeni Liman'da bağlı ticari evraklı tekne.",
  },
  {
    icon: LifeBuoy,
    title: "Donanımlı tekne",
    text: "Kapalı WC, kişi sayısı kadar can yeleği, mutfak kullanımı ve sıcak içecek ikramı.",
  },
  {
    icon: ReceiptText,
    title: "Esnek ödeme",
    text: "Nakit, faturalı ödeme veya KDV dahil IBAN transferi.",
  },
];

export const mealMenu = [
  {
    title: "Ana yemek",
    text: "Kasap köfte, tavuk pirzola veya ızgara çupra",
  },
  {
    title: "Yan lezzetler",
    text: "Mevsim salatası, makarna ve 4 çeşit soğuk meze",
  },
  {
    title: "Yemek içeceği",
    text: "Yemek esnasında kola, Fanta veya ayran ikramı",
  },
  {
    title: "Sıcak ikram",
    text: "Gün boyu çay, yemek sonrası Türk kahvesi servisi",
  },
];

export const fishingTourHighlights: IconItem[] = [
  {
    icon: Clock3,
    title: "06:00 çıkış, 18:00 dönüş",
    text: "Sabah gün doğumunda denizde olunur. Hafta içi ve hafta sonu planları rezervasyon sırasında netleşir.",
  },
  {
    icon: Ship,
    title: "10 m ticari evraklı tekne",
    text: "3.30 m en, kapalı WC, kişi sayısı kadar can yeleği, mutfak kullanımı ve sıcak içecek ikramı.",
  },
  {
    icon: Fish,
    title: "Av türleri",
    text: "Mercan, fangri, manda göz, lidaki, çupra, istavrit, kolyoz, gopez, ahtapot ve kalamar.",
  },
  {
    icon: MapPinned,
    title: "Av bölgeleri",
    text: "Mordoğan, Uzunada, Ardıç, Kaynarpınar, Sasko, Eşendere ve derin sular.",
  },
];

export const fishingPreparation = [
  {
    title: "Yem tavsiyesi",
    items: ["Taze sardalya", "Mamun", "Sülünez", "Çimçim"],
  },
  {
    title: "Takım önerisi",
    items: ["2-3-4 numara iğne", "Düz veya çapraz Maruto / Fudo", "Uzun pala önerilir"],
  },
  {
    title: "Ekipman",
    items: ["135-180 cm kamış", "75 / 100 / 125 / 150 gr kurşun", "En az 3-4 hazır takım"],
  },
  {
    title: "Rezervasyon",
    items: ["Grup katılımlarına indirim uygulanabilir", "Kaporosuz rezervasyon yapılmaz", "Güncel fiyat telefonla netleşir"],
  },
];

export const fishingNote =
  "Bizim turlarımızda eğlenmek, gülmek ve aile ya da arkadaşlarla keyifli vakit geçirmek önceliğimizdir. Balık işi nasip kısmettir; biz her zaman elimizden gelenin en iyisini yapmak için denizdeyiz.";

export const locationHighlights = [
  "Tekne Mordoğan Yeni Liman bünyesinde bağlıdır.",
  "Yol tarifi için Google Maps Okan Kaptan profili kullanılabilir.",
  "Güncel fiyat ve rezervasyon için 0 (533) 613 19 20 üzerinden doğrudan iletişim kurulabilir.",
  "Güncel paylaşımlar için @okankaptan35 Instagram hesabı takip edilebilir.",
];

export const faqItems = [
  {
    id: "rota",
    question: "Rota sabit mi, hava durumuna göre değişiyor mu?",
    answer:
      "Rota rüzgar, deniz durumu ve grubun beklentisine göre kaptan tarafından belirlenir. Ayıbalığı Koyu, Korsan Yatağı (Alifendere) veya Manal Koyu gibi uygun noktalar planlanabilir.",
  },
  {
    id: "kapasite",
    question: "Tekne kaç kişilik?",
    answer:
      "Tekne 12 kişi kapasiteli ticari teknedir. 10 metre boyunda, 3.30 metre enindedir ve kalabalıktan uzak özel grup konseptiyle planlanır.",
  },
  {
    id: "yemek",
    question: "Yemekli tur menüsünde neler var?",
    answer:
      "Ana yemek seçenekleri kasap köfte, tavuk pirzola veya ızgara çupradır. Yanında mevsim salatası, makarna, 4 çeşit soğuk meze; yemek esnasında kola, Fanta veya ayran sunulabilir. Gün boyu çay, yemek sonrası Türk kahvesi servisi de planlanabilir.",
  },
  {
    id: "saat",
    question: "Tur saatleri nasıl ilerliyor?",
    answer:
      "Örnek plan sabah 10:00 çıkış ve 18:00 dönüş şeklindedir. Özel durumlar rezervasyon sırasında netleşir.",
  },
  {
    id: "kis",
    question: "Kışın hangi etkinlik yapılıyor?",
    answer:
      "Kış sezonunda olta balıkçılığı odaklı turlar düzenlenir. Balık turlarında örnek plan 06:00 çıkış ve 18:00 dönüş şeklindedir; hava, akıntı ve deniz koşullarına göre rota kaptan kontrolünde netleşir.",
  },
  {
    id: "balik-av",
    question: "Balık turunda hangi türler hedefleniyor?",
    answer:
      "Turlarda ağırlıklı olarak mercan, fangri, manda göz, lidaki, çupra, istavrit, kolyoz, gopez, ahtapot ve kalamar avı hedeflenebilir. Balık avı nasip işidir; ekip her turda en uygun planı yapmak için çalışır.",
  },
  {
    id: "balik-ekipman",
    question: "Balık avı için hangi ekipman öneriliyor?",
    answer:
      "Taze sardalya, mamun, sülünez ve çimçim yem olarak önerilir. 2-3-4 numara düz veya çapraz Maruto / Fudo iğne, uzun pala, 135-180 cm kamış ve 75 / 100 / 125 / 150 gr kurşun hazırlanabilir. En az 3-4 hazır takım önerilir.",
  },
  {
    id: "konum",
    question: "Tekne nereden kalkıyor?",
    answer:
      "Tekne Mordoğan Yeni Liman bünyesinde bağlıdır. Yol tarifi için Google Maps Okan Kaptan profili kullanılabilir.",
  },
  {
    id: "odeme",
    question: "Ödeme nasıl yapılabiliyor?",
    answer:
      "Ödeme nakit, faturalı veya KDV dahil IBAN transferi olarak planlanabilir. Güncel fiyat bilgisi rezervasyon öncesinde telefonla netleştirilir; kaporosuz rezervasyon yapılmaz.",
  },
  {
    id: "rezervasyon",
    question: "Rezervasyon için nasıl iletişime geçebilirim?",
    answer:
      "Rezervasyon ve güncel fiyat bilgisi için 0 (533) 613 19 20 numarasını arayabilir veya WhatsApp üzerinden mesaj gönderebilirsiniz. Güncel paylaşımlar için @okankaptan35 Instagram hesabı takip edilebilir.",
  },
];

export const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["TravelAgency", "LocalBusiness"],
      "@id": `${siteUrl}/#business`,
      name: "Okan Kaptan (Okan Dörtköşe) Mordoğan Gezi ve Yüzme Turları",
      image: [`${siteUrl}/og.png`, `${siteUrl}/images/okan-kaptan-logo.png`],
      logo: `${siteUrl}/images/okan-kaptan-logo.png`,
      telephone: "+90 533 613 19 20",
      url: siteUrl,
      priceRange: "₺₺",
      sameAs: [instagramUrl, googleBusinessUrl],
      hasMap: googleMapsUrl,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Mordoğan Yeni Liman",
        addressLocality: "Mordoğan",
        addressRegion: "İzmir",
        addressCountry: "TR",
      },
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: "+90 533 613 19 20",
          contactType: "reservations",
          areaServed: "TR",
          availableLanguage: ["Turkish"],
        },
      ],
      areaServed: ["Mordoğan", "Karaburun", "İzmir"],
      description:
        "İzmir Karaburun Mordoğan'da yemekli/yemeksiz günlük gezi ve yüzme turları, 06:00 çıkışlı olta balıkçılığı turları düzenleyen 10 metre boyunda, 3.30 metre eninde ve 12 kişi kapasiteli ticari tekne işletmesi.",
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Mordoğan Tekne Turu Hizmetleri",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Mordoğan gezi ve yüzme turu",
              areaServed: "Mordoğan, Karaburun",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Mordoğan 06:00 çıkışlı olta balıkçılığı turu",
              areaServed: "Mordoğan, Karaburun",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "12 kişilik özel tekne organizasyonu",
              areaServed: "Mordoğan, Karaburun",
            },
          },
        ],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Okan Kaptan Mordoğan",
      inLanguage: "tr-TR",
      publisher: {
        "@id": `${siteUrl}/#business`,
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/#faq`,
      inLanguage: "tr-TR",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ],
};
