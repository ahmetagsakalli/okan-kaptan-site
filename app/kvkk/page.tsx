import { ContactSection } from "../components/content-sections";
import { DetailPage } from "../components/detail-page";
import { createPageMetadata } from "../lib/seo";

const contactEmail = "okandortkose@gmail.com";
const siteDomain = "https://okankaptan.com";
const businessAddress = "Mordoğan Yeni Liman, Mordoğan, Karaburun / İzmir";

const processedData = [
  {
    title: "Ziyaretçi işlem güvenliği bilgileri",
    text: "İnternet sitesine erişim sırasında IP adresi, tarayıcı ve cihaz bilgileri, ziyaret tarihi, saat bilgisi, sayfa görüntüleme ve teknik log kayıtları işlenebilir.",
  },
  {
    title: "İletişim ve rezervasyon bilgileri",
    text: "Telefon, WhatsApp veya e-posta üzerinden iletilmesi halinde ad, soyad, telefon numarası, e-posta adresi, mesaj içeriği, tur tarihi, kişi sayısı ve rezervasyon tercihleri işlenebilir.",
  },
  {
    title: "Talep ve işlem bilgileri",
    text: "Rezervasyon, bilgi alma, fiyat sorma, rota, ödeme, kapora, özel tur ve müşteri memnuniyeti süreçlerine ilişkin yazışma ve işlem kayıtları işlenebilir.",
  },
  {
    title: "Çerez ve üçüncü taraf hizmet bilgileri",
    text: "Sitede teknik olarak gerekli çerezler ve gömülü Google Maps haritası gibi üçüncü taraf hizmetler kullanılabilir. Sosyal medya bağlantılarına geçiş yapılması halinde ilgili platformların kendi veri işleme süreçleri geçerli olur.",
  },
];

const purposes = [
  "İnternet sitesinin güvenli ve doğru şekilde çalıştırılması",
  "Rezervasyon, bilgi alma ve iletişim taleplerinin yanıtlanması",
  "Tekne turu planlama, fiyatlandırma, kapora ve ödeme süreçlerinin yürütülmesi",
  "Talep, öneri ve şikayetlerin alınması ve sonuçlandırılması",
  "Hukuki yükümlülüklerin yerine getirilmesi ve olası uyuşmazlıklarda hakların korunması",
  "Hizmet kalitesinin ölçülmesi ve iş süreçlerinin iyileştirilmesi",
];

const legalReasons = [
  "Bir sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması",
  "Veri sorumlusunun hukuki yükümlülüğünü yerine getirebilmesi",
  "Bir hakkın tesisi, kullanılması veya korunması için veri işlemenin zorunlu olması",
  "İlgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla meşru menfaat",
  "Gerekli hallerde ilgili kişinin açık rızası",
];

const transfers = [
  "Sunucu, alan adı, e-posta, yedekleme, güvenlik ve teknik altyapı hizmeti alınan tedarikçiler",
  "WhatsApp, Instagram, Facebook ve Google Maps gibi iletişim, harita ve sosyal medya platformları",
  "Hukuki yükümlülük doğması halinde yetkili kamu kurum ve kuruluşları",
  "Muhasebe, hukuk, danışmanlık ve iş süreçlerinin yürütülmesi için hizmet alınan gerçek veya tüzel kişiler",
];

const rights = [
  "Kişisel verilerinizin işlenip işlenmediğini öğrenme",
  "Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme",
  "Kişisel verilerinizin işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme",
  "Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme",
  "Eksik veya yanlış işlenmiş kişisel verilerin düzeltilmesini isteme",
  "Kanunda öngörülen şartlar çerçevesinde kişisel verilerin silinmesini veya yok edilmesini isteme",
  "Düzeltme, silme veya yok etme işlemlerinin aktarılan üçüncü kişilere bildirilmesini isteme",
  "Otomatik sistemler yoluyla aleyhinize bir sonucun ortaya çıkmasına itiraz etme",
  "Kanuna aykırı işleme sebebiyle zarara uğramanız halinde zararın giderilmesini talep etme",
];

export const metadata = createPageMetadata({
  path: "/kvkk",
  title: "KVKK Aydınlatma Metni",
  description:
    "Okan Kaptan internet sitesi ziyaretçileri ve iletişim kanalları üzerinden rezervasyon talebi ileten kişiler için KVKK aydınlatma metni.",
  keywords: ["Okan Kaptan KVKK", "KVKK aydınlatma metni", "Okan Kaptan kişisel veriler"],
});

export default function KvkkPage() {
  return (
    <DetailPage
      title="KVKK Aydınlatma Metni"
      description="Okan Kaptan internet sitesi ziyaretçileri ve iletişim kanallarını kullanan kişiler için kişisel verilerin işlenmesine ilişkin bilgilendirme."
    >
      <section className="legal-page reveal-item" aria-labelledby="kvkk-title">
        <div className="legal-document">
          <div className="legal-heading">
            <span>6698 sayılı Kanun kapsamında</span>
            <h2 id="kvkk-title">KVKK Aydınlatma Metni</h2>
            <p>
              Bu metin, Okan Kaptan tarafından işletilen {siteDomain} internet sitesini ziyaret eden
              kişiler ile telefon, WhatsApp, e-posta ve sosyal medya kanalları üzerinden iletişim
              kuran kişilerin kişisel verilerinin işlenmesine ilişkin bilgilendirme amacıyla
              hazırlanmıştır.
            </p>
          </div>

          <dl className="legal-summary">
            <div>
              <dt>Veri sorumlusu</dt>
              <dd>Okan Kaptan</dd>
            </div>
            <div>
              <dt>Adres</dt>
              <dd>{businessAddress}</dd>
            </div>
            <div>
              <dt>İnternet sitesi</dt>
              <dd>
                <a href={siteDomain} target="_blank" rel="noreferrer">
                  {siteDomain}
                </a>
              </dd>
            </div>
            <div>
              <dt>Başvuru e-postası</dt>
              <dd>
                <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
              </dd>
            </div>
          </dl>

          <article className="legal-section">
            <h3>1. İşlenen Kişisel Veri Kategorileri</h3>
            <div className="legal-data-grid">
              {processedData.map((item) => (
                <section key={item.title}>
                  <h4>{item.title}</h4>
                  <p>{item.text}</p>
                </section>
              ))}
            </div>
            <p>
              İnternet sitesi üzerinden üyelik, online sipariş veya online ödeme alınmamaktadır.
              Bu nedenle T.C. kimlik numarası, doğum tarihi, kullanıcı hesabı şifresi veya sipariş
              hesabı gibi veriler site ziyaretçilerinden talep edilmez.
            </p>
          </article>

          <article className="legal-section">
            <h3>2. Kişisel Verilerin İşlenme Amaçları</h3>
            <ul>
              {purposes.map((purpose) => (
                <li key={purpose}>{purpose}</li>
              ))}
            </ul>
          </article>

          <article className="legal-section">
            <h3>3. Toplama Yöntemi ve Hukuki Sebepler</h3>
            <p>
              Kişisel veriler; internet sitesi, sunucu kayıtları, telefon görüşmeleri, WhatsApp
              yazışmaları, e-posta, sosyal medya mesajları ve benzeri iletişim kanalları aracılığıyla
              elektronik, sözlü veya yazılı olarak toplanabilir.
            </p>
            <ul>
              {legalReasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </article>

          <article className="legal-section">
            <h3>4. Kişisel Verilerin Aktarımı</h3>
            <p>
              Kişisel veriler, yukarıda belirtilen amaçlarla sınırlı olmak üzere aşağıdaki kişi,
              kurum ve hizmet sağlayıcılarla paylaşılabilir:
            </p>
            <ul>
              {transfers.map((transfer) => (
                <li key={transfer}>{transfer}</li>
              ))}
            </ul>
            <p>
              Üçüncü taraf platformlara yönlendiren bağlantılar kullanıldığında, ilgili platformların
              kendi gizlilik ve veri işleme politikaları ayrıca uygulanabilir.
            </p>
          </article>

          <article className="legal-section">
            <h3>5. İlgili Kişinin Hakları</h3>
            <p>
              6698 sayılı Kişisel Verilerin Korunması Kanunu&apos;nun 11. maddesi kapsamında aşağıdaki
              haklara sahipsiniz:
            </p>
            <ul>
              {rights.map((right) => (
                <li key={right}>{right}</li>
              ))}
            </ul>
          </article>

          <article className="legal-section">
            <h3>6. Başvuru Yöntemi</h3>
            <p>
              KVKK kapsamındaki taleplerinizi {contactEmail} adresine e-posta göndererek veya
              {businessAddress} adresine yazılı başvuru yaparak iletebilirsiniz. Başvurular, talebin
              niteliğine göre en kısa sürede ve en geç otuz gün içinde sonuçlandırılır.
            </p>
          </article>

          <p className="legal-update">Son güncelleme: 13 Ağustos 2026</p>
        </div>
      </section>
      <ContactSection />
    </DetailPage>
  );
}
