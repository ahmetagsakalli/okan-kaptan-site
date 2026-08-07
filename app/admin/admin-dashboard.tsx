"use client";

import Image from "next/image";
import { CheckCircle2, ImagePlus, KeyRound, LayoutDashboard, LogOut, Plus, Save, ShieldCheck, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import type {
  CmsCaptain,
  CmsContent,
  CmsGalleryItem,
  CmsListGroup,
  CmsSeason,
  CmsService,
  CmsTextItem,
} from "../lib/cms-types";

type AdminDashboardProps = {
  initialContent: CmsContent;
};

type AdminTab = "hero" | "services" | "gallery" | "captains" | "routeFaq" | "extra" | "settings";
type TextItemKey = "tourSpecs" | "mealMenu" | "amenityItems" | "fishingTourHighlights";

const tabs: { id: AdminTab; label: string }[] = [
  { id: "hero", label: "Hero" },
  { id: "services", label: "Turlar" },
  { id: "gallery", label: "Galeri" },
  { id: "captains", label: "Kaptanlar" },
  { id: "routeFaq", label: "Rota & SSS" },
  { id: "extra", label: "Ek içerikler" },
  { id: "settings", label: "Ayarlar" },
];

const seasons: { id: CmsSeason; label: string }[] = [
  { id: "summer", label: "Yaz" },
  { id: "winter", label: "Kış" },
];

function splitLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitParagraphs(value: string) {
  return value
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function paragraphsToText(items: string[]) {
  return items.join("\n\n");
}

function makeId(value: string) {
  const slug = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

  return slug || `sss-${Date.now()}`;
}

export function AdminDashboard({ initialContent }: AdminDashboardProps) {
  const router = useRouter();
  const [content, setContent] = useState<CmsContent>(initialContent);
  const [activeTab, setActiveTab] = useState<AdminTab>("hero");
  const [saveMessage, setSaveMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState("");
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", nextPassword: "", repeatPassword: "" });
  const [passwordMessage, setPasswordMessage] = useState("");
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);

  const stats = useMemo(
    () => [
      { label: "Galeri öğesi", value: content.galleryCollections.summer.items.length + content.galleryCollections.winter.items.length },
      { label: "SSS", value: content.faqItems.length },
      { label: "Kaptan", value: content.captains.length },
      { label: "Rota adımı", value: content.route.steps.length },
    ],
    [content],
  );

  function updateContent(updater: (current: CmsContent) => CmsContent) {
    setContent(updater);
    setSaveMessage("");
  }

  async function saveContent() {
    setIsSaving(true);
    setSaveMessage("");

    const response = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { message?: string } | null;
      setSaveMessage(body?.message ?? "Kaydetme sırasında hata oluştu.");
      setIsSaving(false);
      return;
    }

    setContent((await response.json()) as CmsContent);
    setSaveMessage("Değişiklikler kaydedildi.");
    setIsSaving(false);
    router.refresh();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordMessage("");

    if (passwordForm.nextPassword.length < 12) {
      setPasswordMessage("Yeni şifre en az 12 karakter olmalı.");
      return;
    }

    if (passwordForm.nextPassword !== passwordForm.repeatPassword) {
      setPasswordMessage("Yeni şifreler aynı değil.");
      return;
    }

    setIsPasswordSaving(true);

    const response = await fetch("/api/admin/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: passwordForm.currentPassword,
        nextPassword: passwordForm.nextPassword,
      }),
    });

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { message?: string } | null;
      setPasswordMessage(body?.message ?? "Şifre güncellenemedi.");
      setIsPasswordSaving(false);
      return;
    }

    setPasswordForm({ currentPassword: "", nextPassword: "", repeatPassword: "" });
    setPasswordMessage("Şifre güncellendi. Bir sonraki girişte yeni şifre kullanılacak.");
    setIsPasswordSaving(false);
    router.refresh();
  }

  async function uploadImage(file: File, key: string) {
    setUploadingKey(key);
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    setUploadingKey("");

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { message?: string } | null;
      throw new Error(body?.message ?? "Görsel yüklenemedi.");
    }

    return ((await response.json()) as { url: string }).url;
  }

  function updateService(index: number, patch: Partial<CmsService>) {
    updateContent((current) => ({
      ...current,
      services: current.services.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)),
    }));
  }

  function updateTextItem(key: TextItemKey, index: number, patch: Partial<CmsTextItem>) {
    updateContent((current) => ({
      ...current,
      [key]: current[key].map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)),
    }));
  }

  function addTextItem(key: TextItemKey) {
    updateContent((current) => ({
      ...current,
      [key]: [...current[key], { title: "Yeni başlık", text: "Açıklama metni" }],
    }));
  }

  function removeTextItem(key: TextItemKey, index: number) {
    updateContent((current) => ({
      ...current,
      [key]: current[key].filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  function updateFishingPreparation(index: number, patch: Partial<CmsListGroup>) {
    updateContent((current) => ({
      ...current,
      fishingPreparation: current.fishingPreparation.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    }));
  }

  function addFishingPreparation() {
    updateContent((current) => ({
      ...current,
      fishingPreparation: [
        ...current.fishingPreparation,
        { title: "Yeni hazırlık başlığı", items: ["Yeni madde"] },
      ],
    }));
  }

  function removeFishingPreparation(index: number) {
    updateContent((current) => ({
      ...current,
      fishingPreparation: current.fishingPreparation.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  function updateCaptain(index: number, patch: Partial<CmsCaptain>) {
    updateContent((current) => ({
      ...current,
      captains: current.captains.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)),
    }));
  }

  function updateGalleryItem(season: CmsSeason, index: number, patch: Partial<CmsGalleryItem>) {
    updateContent((current) => ({
      ...current,
      galleryCollections: {
        ...current.galleryCollections,
        [season]: {
          ...current.galleryCollections[season],
          items: current.galleryCollections[season].items.map((item, itemIndex) =>
            itemIndex === index ? { ...item, ...patch } : item,
          ),
        },
      },
    }));
  }

  function addGalleryItem(season: CmsSeason) {
    updateContent((current) => ({
      ...current,
      galleryCollections: {
        ...current.galleryCollections,
        [season]: {
          ...current.galleryCollections[season],
          items: [
            ...current.galleryCollections[season].items,
            {
              kind: "photo",
              title: "Yeni görsel",
              src: "/images/okan-boat-cove.webp",
              alt: "Okan Kaptan tur görseli",
            },
          ],
        },
      },
    }));
  }

  function removeGalleryItem(season: CmsSeason, index: number) {
    updateContent((current) => ({
      ...current,
      galleryCollections: {
        ...current.galleryCollections,
        [season]: {
          ...current.galleryCollections[season],
          items: current.galleryCollections[season].items.filter((_, itemIndex) => itemIndex !== index),
        },
      },
    }));
  }

  return (
    <main className="admin-shell">
      <header className="admin-topbar">
        <div>
          <span className="admin-eyebrow">
            <ShieldCheck size={16} aria-hidden="true" />
            Güvenli oturum
          </span>
          <h1>Okan Kaptan Yönetim Paneli</h1>
          <p>Site içerikleri, rota, SSS ve görseller buradan düzenlenir.</p>
        </div>
        <div className="admin-topbar-actions">
          <a href="/" target="_blank" rel="noreferrer">
            Siteyi aç
          </a>
          <button type="button" onClick={logout}>
            <LogOut size={18} aria-hidden="true" />
            Çıkış
          </button>
        </div>
      </header>

      <section className="admin-stat-grid" aria-label="Panel özeti">
        {stats.map((stat) => (
          <article className="admin-stat-card" key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </article>
        ))}
      </section>

      <div className="admin-workspace">
        <aside className="admin-sidebar">
          <span className="admin-sidebar-title">
            <LayoutDashboard size={18} aria-hidden="true" />
            Bölümler
          </span>
          <nav aria-label="Admin bölümleri">
            {tabs.map((tab) => (
              <button
                className={activeTab === tab.id ? "is-active" : ""}
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        <section className="admin-editor-panel">
          {activeTab === "hero" ? (
            <Panel title="Hero alanı" description="Ana sayfa ilk ekranındaki başlık ve mevsim metinleri.">
              <Field label="Ana başlık">
                <input
                  value={content.hero.title}
                  onChange={(event) =>
                    updateContent((current) => ({
                      ...current,
                      hero: { ...current.hero, title: event.target.value },
                    }))
                  }
                />
              </Field>
              <div className="admin-two-col">
                {seasons.map((season) => (
                  <div className="admin-card-soft" key={season.id}>
                    <h3>{season.label}</h3>
                    <Field label="Başlık">
                      <input
                        value={content.hero[season.id].title}
                        onChange={(event) =>
                          updateContent((current) => ({
                            ...current,
                            hero: {
                              ...current.hero,
                              [season.id]: { ...current.hero[season.id], title: event.target.value },
                            },
                          }))
                        }
                      />
                    </Field>
                    <Field label="Kısa açıklama">
                      <textarea
                        rows={3}
                        value={content.hero[season.id].note}
                        onChange={(event) =>
                          updateContent((current) => ({
                            ...current,
                            hero: {
                              ...current.hero,
                              [season.id]: { ...current.hero[season.id], note: event.target.value },
                            },
                          }))
                        }
                      />
                    </Field>
                  </div>
                ))}
              </div>
            </Panel>
          ) : null}

          {activeTab === "services" ? (
            <Panel title="Tur kartları" description="Ana sayfa etkinlikleri ve turlar sayfasındaki ana kartlar.">
              <div className="admin-repeat-grid">
                {content.services.map((service, index) => (
                  <article className="admin-edit-card" key={`${service.title}-${index}`}>
                    <MediaField
                      value={service.image}
                      alt={service.alt}
                      uploadKey={`service-${index}`}
                      uploadingKey={uploadingKey}
                      onUpload={uploadImage}
                      onChange={(image) => updateService(index, { image })}
                    />
                    <Field label="Başlık">
                      <input value={service.title} onChange={(event) => updateService(index, { title: event.target.value })} />
                    </Field>
                    <Field label="Açıklama">
                      <textarea rows={4} value={service.text} onChange={(event) => updateService(index, { text: event.target.value })} />
                    </Field>
                    <Field label="Görsel alt metni">
                      <input value={service.alt} onChange={(event) => updateService(index, { alt: event.target.value })} />
                    </Field>
                  </article>
                ))}
              </div>
            </Panel>
          ) : null}

          {activeTab === "gallery" ? (
            <Panel title="Galeri" description="Yaz ve kış galerisi ayrı ayrı düzenlenir. Yüklenen görseller WebP olarak optimize edilir.">
              {seasons.map((season) => (
                <div className="admin-season-block" key={season.id}>
                  <div className="admin-section-row">
                    <h3>{season.label} galerisi</h3>
                    <button type="button" onClick={() => addGalleryItem(season.id)}>
                      Görsel ekle
                    </button>
                  </div>
                  <Field label="Galeri açıklaması">
                    <textarea
                      rows={2}
                      value={content.galleryCollections[season.id].summary}
                      onChange={(event) =>
                        updateContent((current) => ({
                          ...current,
                          galleryCollections: {
                            ...current.galleryCollections,
                            [season.id]: {
                              ...current.galleryCollections[season.id],
                              summary: event.target.value,
                            },
                          },
                        }))
                      }
                    />
                  </Field>
                  <div className="admin-repeat-grid">
                    {content.galleryCollections[season.id].items.map((item, index) => (
                      <article className="admin-edit-card" key={`${season.id}-${item.title}-${index}`}>
                        <MediaField
                          value={item.src}
                          alt={item.alt}
                          uploadKey={`${season.id}-gallery-${index}`}
                          uploadingKey={uploadingKey}
                          onUpload={uploadImage}
                          onChange={(src) => updateGalleryItem(season.id, index, { src })}
                        />
                        <Field label="Başlık">
                          <input value={item.title} onChange={(event) => updateGalleryItem(season.id, index, { title: event.target.value })} />
                        </Field>
                        <Field label="Alt metin">
                          <input value={item.alt} onChange={(event) => updateGalleryItem(season.id, index, { alt: event.target.value })} />
                        </Field>
                        <div className="admin-inline-controls">
                          <select
                            value={item.kind}
                            onChange={(event) => updateGalleryItem(season.id, index, { kind: event.target.value as CmsGalleryItem["kind"] })}
                          >
                            <option value="photo">Fotoğraf</option>
                            <option value="video">Video kapak</option>
                          </select>
                          <label className="admin-check">
                            <input
                              type="checkbox"
                              checked={item.featured === true}
                              onChange={(event) => updateGalleryItem(season.id, index, { featured: event.target.checked })}
                            />
                            Öne çıkar
                          </label>
                        </div>
                        <button className="admin-danger" type="button" onClick={() => removeGalleryItem(season.id, index)}>
                          Sil
                        </button>
                      </article>
                    ))}
                  </div>
                </div>
              ))}
              <div className="admin-season-block">
                <h3>Sosyal video bağlantıları</h3>
                {content.socialGalleryItems.map((item, index) => (
                  <article className="admin-edit-row" key={item.href}>
                    <Field label="Başlık">
                      <input
                        value={item.title}
                        onChange={(event) =>
                          updateContent((current) => ({
                            ...current,
                            socialGalleryItems: current.socialGalleryItems.map((social, socialIndex) =>
                              socialIndex === index ? { ...social, title: event.target.value } : social,
                            ),
                          }))
                        }
                      />
                    </Field>
                    <Field label="Bağlantı">
                      <input
                        value={item.href}
                        onChange={(event) =>
                          updateContent((current) => ({
                            ...current,
                            socialGalleryItems: current.socialGalleryItems.map((social, socialIndex) =>
                              socialIndex === index ? { ...social, href: event.target.value } : social,
                            ),
                          }))
                        }
                      />
                    </Field>
                  </article>
                ))}
              </div>
            </Panel>
          ) : null}

          {activeTab === "captains" ? (
            <Panel title="Kaptanlar" description="Kaptan görselleri ve uzun biyografi metinleri. Paragrafları boş satırla ayır.">
              <div className="admin-repeat-grid">
                {content.captains.map((captain, index) => (
                  <article className="admin-edit-card is-wide" key={captain.name}>
                    <MediaField
                      value={captain.image}
                      alt={captain.alt}
                      uploadKey={`captain-${index}`}
                      uploadingKey={uploadingKey}
                      onUpload={uploadImage}
                      onChange={(image) => updateCaptain(index, { image })}
                    />
                    <Field label="İsim">
                      <input value={captain.name} onChange={(event) => updateCaptain(index, { name: event.target.value })} />
                    </Field>
                    <Field label="Görsel pozisyonu">
                      <input value={captain.imagePosition} onChange={(event) => updateCaptain(index, { imagePosition: event.target.value })} />
                    </Field>
                    <Field label="Görsel alt metni">
                      <input value={captain.alt} onChange={(event) => updateCaptain(index, { alt: event.target.value })} />
                    </Field>
                    <Field label="Biyografi">
                      <textarea
                        rows={12}
                        value={paragraphsToText(captain.bio)}
                        onChange={(event) => updateCaptain(index, { bio: splitParagraphs(event.target.value) })}
                      />
                    </Field>
                  </article>
                ))}
              </div>
            </Panel>
          ) : null}

          {activeTab === "routeFaq" ? (
            <Panel title="Rota ve SSS" description="Rota adımları, kısa bilgiler ve sık sorulan sorular.">
              <div className="admin-repeat-grid">
                {content.route.steps.map((step, index) => (
                  <article className="admin-edit-card" key={`${step.time}-${index}`}>
                    <Field label="Saat">
                      <input
                        value={step.time}
                        onChange={(event) =>
                          updateContent((current) => ({
                            ...current,
                            route: {
                              ...current.route,
                              steps: current.route.steps.map((routeStep, stepIndex) =>
                                stepIndex === index ? { ...routeStep, time: event.target.value } : routeStep,
                              ),
                            },
                          }))
                        }
                      />
                    </Field>
                    <Field label="Başlık">
                      <input
                        value={step.title}
                        onChange={(event) =>
                          updateContent((current) => ({
                            ...current,
                            route: {
                              ...current.route,
                              steps: current.route.steps.map((routeStep, stepIndex) =>
                                stepIndex === index ? { ...routeStep, title: event.target.value } : routeStep,
                              ),
                            },
                          }))
                        }
                      />
                    </Field>
                    <Field label="Açıklama">
                      <textarea
                        rows={3}
                        value={step.text}
                        onChange={(event) =>
                          updateContent((current) => ({
                            ...current,
                            route: {
                              ...current.route,
                              steps: current.route.steps.map((routeStep, stepIndex) =>
                                stepIndex === index ? { ...routeStep, text: event.target.value } : routeStep,
                              ),
                            },
                          }))
                        }
                      />
                    </Field>
                  </article>
                ))}
              </div>
              <div className="admin-two-col">
                <Field label="Rota kısa bilgileri">
                  <textarea
                    rows={4}
                    value={content.route.facts.join("\n")}
                    onChange={(event) =>
                      updateContent((current) => ({
                        ...current,
                        route: { ...current.route, facts: splitLines(event.target.value) },
                      }))
                    }
                  />
                </Field>
                <Field label="Örnek koylar">
                  <textarea
                    rows={4}
                    value={content.route.coves.join("\n")}
                    onChange={(event) =>
                      updateContent((current) => ({
                        ...current,
                        route: { ...current.route, coves: splitLines(event.target.value) },
                      }))
                    }
                  />
                </Field>
              </div>
              <div className="admin-section-row">
                <h3>SSS</h3>
                <button
                  type="button"
                  onClick={() =>
                    updateContent((current) => ({
                      ...current,
                      faqItems: [
                        ...current.faqItems,
                        { id: `sss-${Date.now()}`, question: "Yeni soru", answer: "Yanıt metni" },
                      ],
                    }))
                  }
                >
                  Soru ekle
                </button>
              </div>
              <div className="admin-repeat-grid">
                {content.faqItems.map((faq, index) => (
                  <article className="admin-edit-card" key={faq.id}>
                    <Field label="Soru">
                      <input
                        value={faq.question}
                        onChange={(event) =>
                          updateContent((current) => ({
                            ...current,
                            faqItems: current.faqItems.map((item, itemIndex) =>
                              itemIndex === index ? { ...item, question: event.target.value, id: makeId(event.target.value) } : item,
                            ),
                          }))
                        }
                      />
                    </Field>
                    <Field label="Yanıt">
                      <textarea
                        rows={5}
                        value={faq.answer}
                        onChange={(event) =>
                          updateContent((current) => ({
                            ...current,
                            faqItems: current.faqItems.map((item, itemIndex) =>
                              itemIndex === index ? { ...item, answer: event.target.value } : item,
                            ),
                          }))
                        }
                      />
                    </Field>
                    <button
                      className="admin-danger"
                      type="button"
                      onClick={() =>
                        updateContent((current) => ({
                          ...current,
                          faqItems: current.faqItems.filter((_, itemIndex) => itemIndex !== index),
                        }))
                      }
                    >
                      Sil
                    </button>
                  </article>
                ))}
              </div>
            </Panel>
          ) : null}

          {activeTab === "extra" ? (
            <Panel title="Ek içerikler" description="Hakkımızda, tekne, menü, balık turu ve konum içerikleri.">
              <Field label="Hakkımızda metni">
                <textarea
                  rows={12}
                  value={paragraphsToText(content.aboutStory)}
                  onChange={(event) =>
                    updateContent((current) => ({ ...current, aboutStory: splitParagraphs(event.target.value) }))
                  }
                />
              </Field>
              <div className="admin-card-soft">
                <h3>Tekne bilgisi</h3>
                <MediaField
                  value={content.boat.image}
                  alt={content.boat.alt}
                  uploadKey="boat"
                  uploadingKey={uploadingKey}
                  onUpload={uploadImage}
                  onChange={(image) =>
                    updateContent((current) => ({ ...current, boat: { ...current.boat, image } }))
                  }
                />
                <Field label="Başlık">
                  <input
                    value={content.boat.title}
                    onChange={(event) =>
                      updateContent((current) => ({ ...current, boat: { ...current.boat, title: event.target.value } }))
                    }
                  />
                </Field>
                <Field label="Açıklama">
                  <textarea
                    rows={4}
                    value={content.boat.text}
                    onChange={(event) =>
                      updateContent((current) => ({ ...current, boat: { ...current.boat, text: event.target.value } }))
                    }
                  />
                </Field>
              </div>
              <EditableTextItems
                title="Tekne özellikleri ve donanım"
                items={content.tourSpecs}
                onAdd={() => addTextItem("tourSpecs")}
                onChange={(index, patch) => updateTextItem("tourSpecs", index, patch)}
                onRemove={(index) => removeTextItem("tourSpecs", index)}
              />
              <EditableTextItems
                title="Yemek menüsü"
                items={content.mealMenu}
                onAdd={() => addTextItem("mealMenu")}
                onChange={(index, patch) => updateTextItem("mealMenu", index, patch)}
                onRemove={(index) => removeTextItem("mealMenu", index)}
              />
              <EditableTextItems
                title="Konfor detayları"
                items={content.amenityItems}
                onAdd={() => addTextItem("amenityItems")}
                onChange={(index, patch) => updateTextItem("amenityItems", index, patch)}
                onRemove={(index) => removeTextItem("amenityItems", index)}
              />
              <EditableTextItems
                title="Balık turu bilgileri"
                items={content.fishingTourHighlights}
                onAdd={() => addTextItem("fishingTourHighlights")}
                onChange={(index, patch) => updateTextItem("fishingTourHighlights", index, patch)}
                onRemove={(index) => removeTextItem("fishingTourHighlights", index)}
              />
              <div className="admin-season-block">
                <div className="admin-section-row">
                  <h3>Balık avı hazırlığı</h3>
                  <button type="button" onClick={addFishingPreparation}>
                    <Plus size={16} aria-hidden="true" />
                    Grup ekle
                  </button>
                </div>
                <div className="admin-repeat-grid">
                  {content.fishingPreparation.map((group, index) => (
                    <article className="admin-edit-card" key={`${group.title}-${index}`}>
                      <Field label="Başlık">
                        <input
                          value={group.title}
                          onChange={(event) => updateFishingPreparation(index, { title: event.target.value })}
                        />
                      </Field>
                      <Field label="Maddeler">
                        <textarea
                          rows={5}
                          value={group.items.join("\n")}
                          onChange={(event) => updateFishingPreparation(index, { items: splitLines(event.target.value) })}
                        />
                      </Field>
                      <button className="admin-danger" type="button" onClick={() => removeFishingPreparation(index)}>
                        <Trash2 size={16} aria-hidden="true" />
                        Sil
                      </button>
                    </article>
                  ))}
                </div>
              </div>
              <Field label="Balık turu notu">
                <textarea
                  rows={4}
                  value={content.fishingNote}
                  onChange={(event) => updateContent((current) => ({ ...current, fishingNote: event.target.value }))}
                />
              </Field>
              <Field label="Konum maddeleri">
                <textarea
                  rows={5}
                  value={content.locationHighlights.join("\n")}
                  onChange={(event) =>
                    updateContent((current) => ({ ...current, locationHighlights: splitLines(event.target.value) }))
                  }
                />
              </Field>
            </Panel>
          ) : null}

          {activeTab === "settings" ? (
            <Panel title="Panel ayarları" description="Admin şifresini buradan değiştirebilirsin.">
              <form className="admin-settings-card" onSubmit={changePassword}>
                <span className="admin-settings-icon">
                  <KeyRound size={22} aria-hidden="true" />
                </span>
                <div>
                  <h3>Şifre değiştir</h3>
                  <p>Yeni şifre en az 12 karakter olmalı. Şifre düz metin değil, hash olarak saklanır.</p>
                </div>
                <div className="admin-password-grid">
                  <Field label="Mevcut şifre">
                    <input
                      type="password"
                      autoComplete="current-password"
                      value={passwordForm.currentPassword}
                      onChange={(event) => setPasswordForm((current) => ({ ...current, currentPassword: event.target.value }))}
                    />
                  </Field>
                  <Field label="Yeni şifre">
                    <input
                      type="password"
                      autoComplete="new-password"
                      value={passwordForm.nextPassword}
                      onChange={(event) => setPasswordForm((current) => ({ ...current, nextPassword: event.target.value }))}
                    />
                  </Field>
                  <Field label="Yeni şifre tekrar">
                    <input
                      type="password"
                      autoComplete="new-password"
                      value={passwordForm.repeatPassword}
                      onChange={(event) => setPasswordForm((current) => ({ ...current, repeatPassword: event.target.value }))}
                    />
                  </Field>
                </div>
                {passwordMessage ? (
                  <p className={passwordMessage.includes("güncellendi") ? "admin-form-success" : "admin-form-error"}>
                    {passwordMessage}
                  </p>
                ) : null}
                <button type="submit" disabled={isPasswordSaving}>
                  <KeyRound size={18} aria-hidden="true" />
                  {isPasswordSaving ? "Güncelleniyor..." : "Şifreyi güncelle"}
                </button>
              </form>
            </Panel>
          ) : null}

          {activeTab !== "settings" ? (
            <div className="admin-savebar">
              {saveMessage ? (
                <span className={saveMessage.includes("kaydedildi") ? "is-success" : "is-error"}>
                  {saveMessage.includes("kaydedildi") ? <CheckCircle2 size={18} aria-hidden="true" /> : null}
                  {saveMessage}
                </span>
              ) : (
                <span>Değişikliklerden sonra kaydetmeyi unutma.</span>
              )}
              <button type="button" onClick={saveContent} disabled={isSaving}>
                <Save size={18} aria-hidden="true" />
                {isSaving ? "Kaydediliyor..." : "Değişiklikleri kaydet"}
              </button>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}

function Panel({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="admin-panel">
      <header>
        <h2>{title}</h2>
        <p>{description}</p>
      </header>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function MediaField({
  value,
  alt,
  uploadKey,
  uploadingKey,
  onUpload,
  onChange,
}: {
  value: string;
  alt: string;
  uploadKey: string;
  uploadingKey: string;
  onUpload: (file: File, key: string) => Promise<string>;
  onChange: (value: string) => void;
}) {
  async function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      onChange(await onUpload(file, uploadKey));
    } catch (error) {
      alert(error instanceof Error ? error.message : "Görsel yüklenemedi.");
    } finally {
      event.target.value = "";
    }
  }

  return (
    <div className="admin-media-field">
      <div className="admin-media-preview">
        <Image src={value} alt={alt || "Admin görsel önizlemesi"} fill sizes="220px" />
      </div>
      <label className="admin-upload-button">
        <ImagePlus size={18} aria-hidden="true" />
        <span>
          <strong>{uploadingKey === uploadKey ? "Yükleniyor..." : "Fotoğraf seç"}</strong>
          <small>JPG, PNG veya WebP seç; sistem otomatik küçültür.</small>
        </span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={uploadingKey === uploadKey}
          onChange={onFileChange}
        />
      </label>
      <details className="admin-advanced-field">
        <summary>Görsel yolunu elle yaz</summary>
        <input value={value} aria-label="Görsel yolu" onChange={(event) => onChange(event.target.value)} />
      </details>
      <p className="admin-media-help">Mevcut görsel: {value}</p>
    </div>
  );
}

function EditableTextItems({
  title,
  items,
  onAdd,
  onChange,
  onRemove,
}: {
  title: string;
  items: CmsTextItem[];
  onAdd: () => void;
  onChange: (index: number, patch: Partial<CmsTextItem>) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="admin-season-block">
      <div className="admin-section-row">
        <h3>{title}</h3>
        <button type="button" onClick={onAdd}>
          <Plus size={16} aria-hidden="true" />
          Madde ekle
        </button>
      </div>
      <div className="admin-repeat-grid">
        {items.map((item, index) => (
          <article className="admin-edit-card" key={`${title}-${item.title}-${index}`}>
            <Field label="Başlık">
              <input value={item.title} onChange={(event) => onChange(index, { title: event.target.value })} />
            </Field>
            <Field label="Açıklama">
              <textarea rows={4} value={item.text} onChange={(event) => onChange(index, { text: event.target.value })} />
            </Field>
            <button className="admin-danger" type="button" onClick={() => onRemove(index)}>
              <Trash2 size={16} aria-hidden="true" />
              Sil
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
