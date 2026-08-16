"use client";

import {
  Anchor,
  Check,
  CheckCircle2,
  CircleAlert,
  ExternalLink,
  FileText,
  HelpCircle,
  ImagePlus,
  Images,
  KeyRound,
  LayoutDashboard,
  LogOut,
  MapPinned,
  Menu,
  Plus,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  Ship,
  Trash2,
  UsersRound,
  Video,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { CSSProperties, ChangeEvent, DragEvent, FormEvent } from "react";
import { useEffect, useId, useMemo, useState } from "react";
import type {
  CmsCaptain,
  CmsContent,
  CmsGalleryItem,
  CmsListGroup,
  CmsSeason,
  CmsService,
  CmsSocialGalleryItem,
  CmsTextItem,
} from "../lib/cms-types";

type AdminDashboardProps = {
  initialContent: CmsContent;
  systemStatus?: AdminSystemStatus;
};

type AdminSystemStatus = {
  hasBlobStorage: boolean;
  requiresBlobStorage: boolean;
};

type AdminTab = "overview" | "hero" | "services" | "gallery" | "captains" | "routeFaq" | "extra" | "settings";
type TextItemKey = "tourSpecs" | "mealMenu" | "amenityItems" | "fishingTourHighlights";
type UploadedMedia = {
  url: string;
  kind: "image" | "video";
  size: number;
  contentType: string;
};
type Notice = {
  type: "success" | "error" | "info";
  text: string;
};

const maxImageUploadBytes = 8 * 1024 * 1024;
const maxVideoUploadBytes = 120 * 1024 * 1024;
const clientImageTypes = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);
const clientVideoTypes = new Set(["video/mp4", "video/webm", "video/quicktime"]);
const clientImageExtensions = new Set(["jpg", "jpeg", "png", "webp"]);
const clientVideoExtensions = new Set(["mp4", "webm", "mov"]);

const tabs: { id: AdminTab; label: string; description: string; icon: LucideIcon }[] = [
  { id: "overview", label: "Genel bakış", description: "Özet ve hızlı geçişler", icon: LayoutDashboard },
  { id: "hero", label: "Hero", description: "Ana sayfa ilk ekranı", icon: Ship },
  { id: "services", label: "Turlar", description: "Tur kartları ve fotoğrafları", icon: Anchor },
  { id: "gallery", label: "Galeri", description: "Yaz, kış ve sosyal medya", icon: Images },
  { id: "captains", label: "Kaptanlar", description: "Kaptan profilleri", icon: UsersRound },
  { id: "routeFaq", label: "Rota & SSS", description: "Tur akışı ve sorular", icon: MapPinned },
  { id: "extra", label: "Ek içerikler", description: "Tekne, menü ve notlar", icon: FileText },
  { id: "settings", label: "Ayarlar", description: "Şifre ve oturum", icon: KeyRound },
];

const seasons: { id: CmsSeason; label: string; heading: string; description: string }[] = [
  {
    id: "summer",
    label: "Yaz",
    heading: "Yaz turu fotoğrafları",
    description: "Koy, yüzme, yemek, güneşli tekne turu ve yaz gezi kareleri.",
  },
  {
    id: "winter",
    label: "Kış",
    heading: "Kış balık turu fotoğrafları",
    description: "Olta, av anı, yakalanan balıklar ve sakin kış rotası kareleri.",
  },
];

function splitLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim());
}

function splitParagraphs(value: string) {
  return value
    .split(/\n{2,}/)
    .map((item) => item.trim());
}

function paragraphsToText(items: string[]) {
  return items.join("\n\n");
}

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileExtension(name: string) {
  return name.split(".").pop()?.toLocaleLowerCase("tr-TR") ?? "";
}

function parsePositionToken(token: string | undefined, axis: "x" | "y") {
  const normalized = token?.trim().toLocaleLowerCase("tr-TR");

  if (!normalized) {
    return axis === "x" ? 50 : 45;
  }

  if (normalized.endsWith("%")) {
    const value = Number.parseFloat(normalized);

    if (Number.isFinite(value)) {
      return Math.min(100, Math.max(0, Math.round(value)));
    }
  }

  if (normalized === "left" || normalized === "top") {
    return 0;
  }

  if (normalized === "right" || normalized === "bottom") {
    return 100;
  }

  return normalized === "center" ? 50 : axis === "x" ? 50 : 45;
}

function parseImageFocus(value: string | undefined) {
  const [xToken, yToken] = (value || "").trim().split(/\s+/);

  return {
    x: parsePositionToken(xToken, "x"),
    y: parsePositionToken(yToken, "y"),
  };
}

function formatImagePosition(x: number, y: number) {
  return `${Math.min(100, Math.max(0, Math.round(x)))}% ${Math.min(100, Math.max(0, Math.round(y)))}%`;
}

function getMediaValidationError(file: File, expectedKind: "image" | "video") {
  const extension = getFileExtension(file.name);

  if (expectedKind === "image") {
    if (!clientImageTypes.has(file.type) && !clientImageExtensions.has(extension)) {
      return "Fotoğraf için JPG, PNG veya WebP dosyası seç.";
    }

    if (file.size > maxImageUploadBytes) {
      return "Fotoğraf 8 MB'tan küçük olmalı.";
    }

    return null;
  }

  if (!clientVideoTypes.has(file.type) && !clientVideoExtensions.has(extension)) {
    return "Video için MP4, WebM veya MOV dosyası seç.";
  }

  if (file.size > maxVideoUploadBytes) {
    return "Video 120 MB'tan küçük olmalı.";
  }

  return null;
}

function makeMediaTitle(label: string, index: number) {
  return `${label} ${index}`;
}

function makeMediaAlt(label: string) {
  return `Okan Kaptan ${label.toLocaleLowerCase("tr-TR")} fotoğrafı`;
}

export function AdminDashboard({ initialContent, systemStatus }: AdminDashboardProps) {
  const router = useRouter();
  const [content, setContent] = useState<CmsContent>(initialContent);
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [activeGallerySeason, setActiveGallerySeason] = useState<CmsSeason>("summer");
  const [saveNotice, setSaveNotice] = useState<Notice | null>(null);
  const [uploadNotice, setUploadNotice] = useState<Notice | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState("");
  const [recentlyAddedMediaKey, setRecentlyAddedMediaKey] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [navFilter, setNavFilter] = useState("");
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", nextPassword: "", repeatPassword: "" });
  const [passwordMessage, setPasswordMessage] = useState("");
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);

  const allGalleryItems = useMemo(
    () => [...content.galleryCollections.summer.items, ...content.galleryCollections.winter.items],
    [content.galleryCollections.summer.items, content.galleryCollections.winter.items],
  );

  const mediaSummary = useMemo(() => {
    const galleryVideos = allGalleryItems.filter((item) => item.kind === "video").length;
    const boatVideos = content.boat.videoSrc ? 1 : 0;

    return {
      total: allGalleryItems.length + content.services.length + content.captains.length + (content.boat.gallery ?? []).length,
      videos: galleryVideos + boatVideos,
    };
  }, [allGalleryItems, content.boat.gallery, content.boat.videoSrc, content.captains.length, content.services.length]);

  const qualitySummary = useMemo(() => {
    const videoWithoutFile = allGalleryItems.filter((item) => item.kind === "video" && !item.videoSrc).length;

    return { videoWithoutFile };
  }, [allGalleryItems]);

  const stats = useMemo(
    () => [
      { label: "Medya", value: mediaSummary.total, helper: `${mediaSummary.videos} video`, icon: Images },
      { label: "Tur kartı", value: content.services.length, helper: "Ana sayfa ve turlar", icon: Anchor },
      { label: "SSS", value: content.faqItems.length, helper: "Rota sayfası", icon: HelpCircle },
      { label: "Rota adımı", value: content.route.steps.length, helper: "Tur akışı", icon: MapPinned },
    ],
    [content.faqItems.length, content.route.steps.length, content.services.length, mediaSummary.total, mediaSummary.videos],
  );

  const filteredTabs = useMemo(() => {
    const filter = navFilter.trim().toLocaleLowerCase("tr-TR");

    if (!filter) {
      return tabs;
    }

    return tabs.filter((tab) =>
      `${tab.label} ${tab.description}`.toLocaleLowerCase("tr-TR").includes(filter),
    );
  }, [navFilter]);

  const activeTabMeta = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];
  const activeGalleryMeta = seasons.find((season) => season.id === activeGallerySeason) ?? seasons[0];
  const activeGallery = content.galleryCollections[activeGallerySeason];

  function updateContent(updater: (current: CmsContent) => CmsContent) {
    setContent(updater);
    setSaveNotice(null);
    setIsDirty(true);
  }

  async function saveContent() {
    if (qualitySummary.videoWithoutFile > 0) {
      setSaveNotice({
        type: "error",
        text: "Video kartı eklenmiş ama video dosyası seçilmemiş. Kaydetmeden önce video dosyasını seç.",
      });
      return;
    }

    setIsSaving(true);
    setSaveNotice(null);

    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { message?: string } | null;
        setSaveNotice({ type: "error", text: body?.message ?? "Kaydetme sırasında hata oluştu." });
        return;
      }

      setContent((await response.json()) as CmsContent);
      setIsDirty(false);
      setSaveNotice({ type: "success", text: "Değişiklikler kaydedildi." });
      router.refresh();
    } catch {
      setSaveNotice({ type: "error", text: "Kaydetme sırasında bağlantı hatası oluştu. Tekrar dene." });
    } finally {
      setIsSaving(false);
    }
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

  async function uploadMedia(file: File, key: string) {
    setUploadingKey(key);
    setUploadNotice(null);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { message?: string } | null;
        const message = body?.message ?? "Medya yüklenemedi.";
        setUploadNotice({ type: "error", text: message });
        throw new Error(message);
      }

      const uploaded = (await response.json()) as UploadedMedia;
      const uploadedLabel = uploaded.kind === "video" ? "Video" : "Fotoğraf";
      setUploadNotice({
        type: "success",
        text: `${uploadedLabel} yüklendi (${formatFileSize(uploaded.size)}). Yayına almak için değişiklikleri kaydet.`,
      });

      return uploaded;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Medya yüklenemedi.";
      setUploadNotice({ type: "error", text: message });
      throw error;
    } finally {
      setUploadingKey("");
    }
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

  function addGalleryItem(season: CmsSeason, kind: CmsGalleryItem["kind"]) {
    setActiveGallerySeason(season);
    const nextIndex = content.galleryCollections[season].items.length + 1;
    const seasonLabel = seasons.find((item) => item.id === season)?.label ?? "Galeri";
    const itemTitle = makeMediaTitle(kind === "video" ? `${seasonLabel} videosu` : `${seasonLabel} fotoğrafı`, nextIndex);
    const item: CmsGalleryItem = {
      kind,
      title: itemTitle,
      src: "/images/okan-boat-cove.webp",
      ...(kind === "video" ? { videoSrc: "" } : {}),
      alt: makeMediaAlt(kind === "video" ? "galeri videosu kapağı" : "galeri fotoğrafı"),
    };

    updateContent((current) => ({
      ...current,
      galleryCollections: {
        ...current.galleryCollections,
        [season]: {
          ...current.galleryCollections[season],
          items: [item, ...current.galleryCollections[season].items],
        },
      },
    }));
    setRecentlyAddedMediaKey(`${season}-gallery-${kind}-0`);
    setSaveNotice({
      type: "info",
      text:
        kind === "video"
          ? "Yeni video en üste eklendi. Kapak fotoğrafını ve video dosyasını seçip kaydet."
          : "Yeni fotoğraf en üste eklendi. Fotoğrafı seçip kaydet.",
    });
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

  function updateBoatGalleryItem(index: number, patch: Partial<NonNullable<CmsContent["boat"]["gallery"]>[number]>) {
    updateContent((current) => ({
      ...current,
      boat: {
        ...current.boat,
        gallery: (current.boat.gallery ?? []).map((item, itemIndex) =>
          itemIndex === index ? { ...item, ...patch } : item,
        ),
      },
    }));
  }

  function addBoatGalleryItem() {
    const nextIndex = (content.boat.gallery ?? []).length + 1;
    const itemTitle = makeMediaTitle("Tekne fotoğrafı", nextIndex);
    const item = {
      title: itemTitle,
      src: content.boat.image || "/images/okan-boat-real-wide.webp",
      alt: makeMediaAlt("tekne fotoğrafı"),
    };

    updateContent((current) => ({
      ...current,
      boat: {
        ...current.boat,
        gallery: [item, ...(current.boat.gallery ?? [])],
      },
    }));
    setRecentlyAddedMediaKey("boat-gallery-0");
    setSaveNotice({ type: "info", text: "Yeni tekne fotoğrafı en üste eklendi. Fotoğrafı seçip kaydet." });
  }

  function removeBoatGalleryItem(index: number) {
    updateContent((current) => ({
      ...current,
      boat: {
        ...current.boat,
        gallery: (current.boat.gallery ?? []).filter((_, itemIndex) => itemIndex !== index),
      },
    }));
  }

  return (
    <main className="admin-shell">
      <button
        className={`admin-sidebar-backdrop ${isSidebarOpen ? "is-open" : ""}`}
        type="button"
        aria-label="Menüyü kapat"
        onClick={() => setIsSidebarOpen(false)}
      />

      <aside className={`admin-sidebar ${isSidebarOpen ? "is-open" : ""}`}>
        <div className="admin-sidebar-brand">
          <span className="admin-brand-mark" aria-hidden="true">
            <Ship size={24} />
          </span>
          <div>
            <strong>Yönetim Paneli</strong>
            <span>Site yönetimi</span>
          </div>
        </div>

        <label className="admin-sidebar-search">
          <Search size={16} aria-hidden="true" />
          <input
            value={navFilter}
            placeholder="Bölüm ara"
            onChange={(event) => setNavFilter(event.target.value)}
          />
        </label>

        <nav aria-label="Admin bölümleri">
          <span className="admin-sidebar-title">İçerik</span>
          {filteredTabs.map((tab) => {
            const Icon = tab.icon;

            return (
              <button
                className={activeTab === tab.id ? "is-active" : ""}
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsSidebarOpen(false);
                }}
              >
                <Icon size={19} aria-hidden="true" />
                <span>
                  <strong>{tab.label}</strong>
                  <small>{tab.description}</small>
                </span>
              </button>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <span className={isDirty ? "is-dirty" : ""}>{isDirty ? "Kaydedilmemiş değişiklik var" : "İçerik kayıtlı"}</span>
        </div>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <button className="admin-menu-button" type="button" onClick={() => setIsSidebarOpen(true)}>
            <Menu size={21} aria-hidden="true" />
            <span>Menü</span>
          </button>

          <div className="admin-topbar-title">
            <span className="admin-eyebrow">
              <ShieldCheck size={16} aria-hidden="true" />
              Güvenli oturum
            </span>
            <h1>{activeTabMeta.label}</h1>
            <p>{activeTabMeta.description}</p>
          </div>

          <div className="admin-topbar-actions">
            <a href="/" target="_blank" rel="noreferrer">
              <ExternalLink size={17} aria-hidden="true" />
              Site
            </a>
            <button type="button" onClick={logout}>
              <LogOut size={18} aria-hidden="true" />
              Çıkış
            </button>
          </div>
        </header>

        <section className="admin-stat-grid" aria-label="Panel özeti">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <article className="admin-stat-card" key={stat.label}>
                <span className="admin-stat-icon">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <div>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                  <small>{stat.helper}</small>
                </div>
              </article>
            );
          })}
        </section>

        <section className="admin-editor-panel">
          {activeTab === "overview" ? (
            <OverviewPanel
              isDirty={isDirty}
              uploadNotice={uploadNotice}
              systemStatus={systemStatus}
              onOpenTab={setActiveTab}
              onSave={saveContent}
              isSaving={isSaving}
            />
          ) : null}
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
                  <article className="admin-edit-card" key={`service-${index}`}>
                    <MediaField
                      value={service.image}
                      alt={service.alt}
                      uploadKey={`service-${index}`}
                      uploadingKey={uploadingKey}
                      onUpload={uploadMedia}
                      onChange={(image) => updateService(index, { image })}
                    />
                    <Field label="Başlık">
                      <input
                        value={service.title}
                        onChange={(event) =>
                          updateService(index, {
                            title: event.target.value,
                            alt: makeMediaAlt(event.target.value || "tur"),
                          })
                        }
                      />
                    </Field>
                    <Field label="Açıklama">
                      <textarea rows={4} value={service.text} onChange={(event) => updateService(index, { text: event.target.value })} />
                    </Field>
                  </article>
                ))}
              </div>
            </Panel>
          ) : null}

          {activeTab === "gallery" ? (
            <Panel title="Galeri" description="Yaz ve kış medya alanları ayrı bloklarda tutulur.">
              <div className="admin-segment" aria-label="Galeri mevsimi">
                {seasons.map((season) => (
                  <button
                    className={activeGallerySeason === season.id ? "is-active" : ""}
                    key={season.id}
                    type="button"
                    aria-pressed={activeGallerySeason === season.id}
                    onClick={() => setActiveGallerySeason(season.id)}
                  >
                    <strong>{season.label}</strong>
                    <span>{content.galleryCollections[season.id].items.length} medya</span>
                  </button>
                ))}
              </div>

              <div className={`admin-season-block admin-season-block-${activeGallerySeason}`}>
                <div className="admin-season-banner">
                  <div>
                    <span>{activeGalleryMeta.label} galerisi</span>
                    <h3>{activeGalleryMeta.heading}</h3>
                    <p>{activeGalleryMeta.description}</p>
                  </div>
                  <strong>{activeGallery.items.length} medya</strong>
                </div>
                <div className="admin-section-row">
                  <h3>{activeGalleryMeta.label} galerisi düzenle</h3>
                  <div className="admin-action-group">
                    <button type="button" onClick={() => addGalleryItem(activeGallerySeason, "photo")}>
                      <ImagePlus size={16} aria-hidden="true" />
                      Fotoğraf ekle
                    </button>
                    <button type="button" onClick={() => addGalleryItem(activeGallerySeason, "video")}>
                      <Video size={16} aria-hidden="true" />
                      Video ekle
                    </button>
                  </div>
                </div>
                <Field label="Galeri açıklaması">
                  <textarea
                    rows={2}
                    value={activeGallery.summary}
                    onChange={(event) =>
                      updateContent((current) => ({
                        ...current,
                        galleryCollections: {
                          ...current.galleryCollections,
                          [activeGallerySeason]: {
                            ...current.galleryCollections[activeGallerySeason],
                            summary: event.target.value,
                          },
                        },
                      }))
                    }
                  />
                </Field>
                <div className="admin-repeat-grid">
                  {activeGallery.items.map((item, index) => {
                    const mediaKey = `${activeGallerySeason}-gallery-${item.kind}-${index}`;
                    const isNew = recentlyAddedMediaKey === mediaKey;

                    return (
                      <article className={`admin-edit-card ${isNew ? "is-new" : ""}`} key={mediaKey}>
                        <div className="admin-media-card-header">
                          <div>
                            <strong>
                              {activeGalleryMeta.label} {item.kind === "video" ? "videosu" : "fotoğrafı"} {index + 1}
                            </strong>
                            <span>
                              {item.kind === "video"
                                ? "Video dosyası hem önizleme hem de oynatma için kullanılır"
                                : "Bu fotoğraf sadece seçili galeriye eklenir"}
                            </span>
                          </div>
                          {isNew ? <span className="admin-new-badge">Yeni eklendi</span> : null}
                        </div>
                        {item.kind === "video" ? (
                          <MediaField
                            value={item.videoSrc ?? ""}
                            alt={`${item.title} videosu`}
                            uploadKey={`${activeGallerySeason}-gallery-video-${index}`}
                            uploadingKey={uploadingKey}
                            onUpload={uploadMedia}
                            onChange={(videoSrc) => updateGalleryItem(activeGallerySeason, index, { videoSrc })}
                            preview="video"
                            accept="video/mp4,video/webm,video/quicktime"
                            buttonLabel="Video seç"
                            emptyLabel="Video dosyası seçilmedi"
                            helpText="MP4, WebM veya MOV yükle. Sitedeki önizleme videonun ilk karesinden gelir."
                          />
                        ) : (
                          <MediaField
                            value={item.src}
                            alt={item.alt}
                            uploadKey={`${activeGallerySeason}-gallery-${index}`}
                            uploadingKey={uploadingKey}
                            onUpload={uploadMedia}
                            onChange={(src) => updateGalleryItem(activeGallerySeason, index, { src })}
                            buttonLabel="Fotoğraf seç"
                            emptyLabel="Fotoğraf seçilmedi"
                            helpText={`${activeGalleryMeta.label} galerisinde görünecek fotoğrafı yükle.`}
                          />
                        )}
                        <button className="admin-danger" type="button" onClick={() => removeGalleryItem(activeGallerySeason, index)}>
                          <Trash2 size={16} aria-hidden="true" />
                          Bu medyayı sil
                        </button>
                      </article>
                    );
                  })}
                </div>
              </div>

              <div className="admin-season-block">
                <div className="admin-section-row">
                  <h3>Sosyal video bağlantıları</h3>
                  <button
                    type="button"
                    onClick={() =>
                      updateContent((current) => ({
                        ...current,
                        socialGalleryItems: [
                          ...current.socialGalleryItems,
                          {
                            platform: "Instagram",
                            title: "Yeni sosyal video",
                            href: "https://www.instagram.com/okankaptanmordogantekneturu/",
                            image: "/images/okan-boat-real-cove.webp",
                            alt: "Okan Kaptan sosyal video kapağı",
                          },
                        ],
                      }))
                    }
                  >
                    <Plus size={16} aria-hidden="true" />
                    Bağlantı ekle
                  </button>
                </div>
                <div className="admin-repeat-grid">
                {content.socialGalleryItems.map((item, index) => (
                  <article className="admin-edit-card" key={`social-gallery-${index}`}>
                    <MediaField
                      value={item.image}
                      alt={item.alt}
                      uploadKey={`social-gallery-${index}`}
                      uploadingKey={uploadingKey}
                      onUpload={uploadMedia}
                      onChange={(image) =>
                        updateContent((current) => ({
                          ...current,
                          socialGalleryItems: current.socialGalleryItems.map((social, socialIndex) =>
                            socialIndex === index ? { ...social, image } : social,
                          ),
                        }))
                      }
                      buttonLabel="Kapak fotoğrafı seç"
                      emptyLabel="Kapak fotoğrafı seçilmedi"
                      helpText="Bu kapak, aşağıdaki Instagram/Facebook bağlantısı için görünür."
	                    />
	                    <Field label="Platform">
                      <select
                        value={item.platform}
                        onChange={(event) =>
                          updateContent((current) => ({
                            ...current,
                            socialGalleryItems: current.socialGalleryItems.map((social, socialIndex) =>
                              socialIndex === index
                                ? { ...social, platform: event.target.value as CmsSocialGalleryItem["platform"] }
                                : social,
                            ),
                          }))
                        }
                      >
                        <option value="Instagram">Instagram</option>
                        <option value="Facebook">Facebook</option>
                      </select>
	                    </Field>
	                    <Field label="Paylaşım adı">
	                      <input
	                        value={item.title}
	                        onChange={(event) =>
	                          updateContent((current) => ({
	                            ...current,
	                            socialGalleryItems: current.socialGalleryItems.map((social, socialIndex) =>
	                              socialIndex === index
                                  ? { ...social, title: event.target.value, alt: makeMediaAlt(event.target.value || "sosyal video kapağı") }
                                  : social,
	                            ),
	                          }))
	                        }
	                      />
	                    </Field>
                    <Field label="Açılacak video bağlantısı">
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
	                    <button
                      className="admin-danger"
                      type="button"
                      onClick={() =>
                        updateContent((current) => ({
                          ...current,
                          socialGalleryItems: current.socialGalleryItems.filter((_, socialIndex) => socialIndex !== index),
                        }))
                      }
                    >
                      <Trash2 size={16} aria-hidden="true" />
                      Sil
                    </button>
                  </article>
                ))}
                </div>
              </div>
            </Panel>
          ) : null}

          {activeTab === "captains" ? (
            <Panel title="Kaptanlar" description="Kaptan fotoğrafları ve uzun biyografi metinleri. Paragrafları boş satırla ayır.">
              <div className="admin-repeat-grid">
                {content.captains.map((captain, index) => (
                  <article className="admin-edit-card is-wide" key={`captain-${index}`}>
                    <MediaField
                      value={captain.image}
                      alt={captain.alt}
                      uploadKey={`captain-${index}`}
                      uploadingKey={uploadingKey}
                      onUpload={uploadMedia}
                      onChange={(image) => updateCaptain(index, { image })}
                      objectPosition={captain.imagePosition}
                      previewFrame="captain"
                    />
                    <ImagePositionControl
                      value={captain.imagePosition}
                      onChange={(imagePosition) => updateCaptain(index, { imagePosition })}
                    />
                    <Field label="İsim">
                      <input
                          value={captain.name}
                          onChange={(event) =>
                            updateCaptain(index, {
                              name: event.target.value,
                              alt: makeMediaAlt(event.target.value || "kaptan"),
                            })
                          }
                        />
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
                  <article className="admin-edit-card" key={`route-step-${index}`}>
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
                              itemIndex === index ? { ...item, question: event.target.value } : item,
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
                  onUpload={uploadMedia}
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
                <div className="admin-two-col">
                  <Field label="Video başlığı">
                    <input
                      value={content.boat.videoTitle ?? ""}
                      onChange={(event) =>
                        updateContent((current) => ({
                          ...current,
                          boat: { ...current.boat, videoTitle: event.target.value },
                        }))
                      }
                    />
                  </Field>
                  <MediaField
                    value={content.boat.videoPoster ?? ""}
	                    alt="Tekne video kapak fotoğrafı"
                    uploadKey="boat-video-poster"
                    uploadingKey={uploadingKey}
                    onUpload={uploadMedia}
                    onChange={(videoPoster) =>
                      updateContent((current) => ({ ...current, boat: { ...current.boat, videoPoster } }))
                    }
	                    emptyLabel="Kapak fotoğrafı seçilmedi"
	                    buttonLabel="Kapak fotoğrafı seç"
                  />
                </div>
                <MediaField
                  value={content.boat.videoSrc ?? ""}
                  alt="Tekne tanıtım videosu"
                  uploadKey="boat-video"
                  uploadingKey={uploadingKey}
                  onUpload={uploadMedia}
                  onChange={(videoSrc) =>
                    updateContent((current) => ({ ...current, boat: { ...current.boat, videoSrc } }))
                  }
                  preview="video"
                  accept="video/mp4,video/webm,video/quicktime"
                  buttonLabel="Tekne videosu seç"
                  emptyLabel="Tekne videosu seçilmedi"
                  helpText="MP4, WebM veya MOV yükle."
                />
                <div className="admin-season-block">
                  <div className="admin-section-row">
                    <h3>Tekne galerisi</h3>
	                    <button type="button" onClick={addBoatGalleryItem}>
	                      <Plus size={16} aria-hidden="true" />
	                      Fotoğraf ekle
	                    </button>
                  </div>
		                  <div className="admin-repeat-grid">
		                    {(content.boat.gallery ?? []).map((item, index) => {
                          const mediaKey = `boat-gallery-${index}`;
                          const isNew = recentlyAddedMediaKey === mediaKey;

                          return (
		                      <article className={`admin-edit-card ${isNew ? "is-new" : ""}`} key={mediaKey}>
		                        <div className="admin-media-card-header">
                              <div>
		                            <strong>Tekne fotoğrafı {index + 1}</strong>
		                            <span>Fotoğraf</span>
                              </div>
                              {isNew ? <span className="admin-new-badge">Yeni eklendi</span> : null}
		                        </div>
		                        <MediaField
		                          value={item.src}
		                          alt={item.alt}
	                          uploadKey={`boat-gallery-${index}`}
	                          uploadingKey={uploadingKey}
	                          onUpload={uploadMedia}
	                          onChange={(src) =>
                              updateBoatGalleryItem(index, {
                                src,
                                title: makeMediaTitle("Tekne fotoğrafı", index + 1),
                                alt: makeMediaAlt("tekne fotoğrafı"),
                              })
                            }
	                        />
	                        <button className="admin-danger" type="button" onClick={() => removeBoatGalleryItem(index)}>
		                          <Trash2 size={16} aria-hidden="true" />
		                          Bu fotoğrafı sil
		                        </button>
		                      </article>
                          );
                        })}
	                  </div>
                </div>
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
                    <article className="admin-edit-card" key={`fishing-preparation-${index}`}>
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

          {activeTab !== "settings" && activeTab !== "overview" ? (
            <div className={`admin-savebar ${isDirty ? "is-dirty" : ""}`}>
              <span className={saveNotice ? `is-${saveNotice.type}` : ""}>
                {saveNotice?.type === "success" ? <CheckCircle2 size={18} aria-hidden="true" /> : null}
                {saveNotice?.type === "error" ? <XCircle size={18} aria-hidden="true" /> : null}
                {saveNotice?.text ?? (isDirty ? "Kaydedilmemiş değişiklik var." : "Tüm değişiklikler kayıtlı.")}
              </span>
              <button type="button" onClick={saveContent} disabled={isSaving}>
                <Save size={18} aria-hidden="true" />
                {isSaving ? "Kaydediliyor..." : "Değişiklikleri kaydet"}
              </button>
            </div>
          ) : null}
        </section>
      </section>
    </main>
  );
}

function OverviewPanel({
  isDirty,
  uploadNotice,
  systemStatus,
  onOpenTab,
  onSave,
  isSaving,
}: {
  isDirty: boolean;
  uploadNotice: Notice | null;
  systemStatus?: AdminSystemStatus;
  onOpenTab: (tab: AdminTab) => void;
  onSave: () => void;
  isSaving: boolean;
}) {
  const quickActions: { title: string; text: string; tab: AdminTab; icon: LucideIcon }[] = [
    { title: "Tur kartları", text: "Yaz ve kış tur görselleri", tab: "services", icon: Anchor },
    { title: "Galeri", text: "Fotoğraf, video, sosyal bağlantılar", tab: "gallery", icon: Images },
    { title: "Tekne", text: "Tekne fotoğrafları ve donanım", tab: "extra", icon: Ship },
    { title: "Rota & SSS", text: "Saat akışı, koylar, sorular", tab: "routeFaq", icon: HelpCircle },
  ];

  return (
    <section className="admin-overview-home" aria-label="Genel bakış">
      <div className={`admin-overview-status ${isDirty ? "is-dirty" : ""}`}>
        <span className="admin-overview-icon" aria-hidden="true">
          {isDirty ? <CircleAlert size={24} /> : <CheckCircle2 size={24} />}
        </span>
        <div>
          <span className="admin-status-kicker">Son durum</span>
          <h2>{isDirty ? "Yayına alınmayı bekleyen değişiklikler var" : "İçerik yayında ve güncel"}</h2>
          <p>{isDirty ? "Düzenlemeyi bitirdiğinde tek tuşla siteye aktarabilirsin." : "Şu an kaydedilmemiş bir değişiklik görünmüyor."}</p>
        </div>
        {isDirty ? (
          <button type="button" onClick={onSave} disabled={isSaving}>
            <Save size={18} aria-hidden="true" />
            {isSaving ? "Kaydediliyor..." : "Kaydet"}
          </button>
        ) : null}
      </div>

      {uploadNotice ? (
        <div className={`admin-system-notice is-${uploadNotice.type}`}>
          {uploadNotice.type === "success" ? <CheckCircle2 size={18} aria-hidden="true" /> : <XCircle size={18} aria-hidden="true" />}
          <span>{uploadNotice.text}</span>
        </div>
      ) : null}

      {systemStatus?.requiresBlobStorage && !systemStatus.hasBlobStorage ? (
        <div className="admin-system-notice is-error">
          <CircleAlert size={18} aria-hidden="true" />
          <span>Vercel ortamında medya yükleme ve içerik kaydetme için Blob bağlantısı eksik.</span>
          <code>BLOB_READ_WRITE_TOKEN</code>
        </div>
      ) : null}

      <section className="admin-overview-shortcuts" aria-labelledby="admin-shortcuts-title">
        <header className="admin-overview-section-header">
          <div>
            <h2 id="admin-shortcuts-title">Hızlı düzenle</h2>
            <p>En sık girilen bölümlere buradan geç.</p>
          </div>
        </header>

        <div className="admin-quick-grid">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <button className="admin-quick-card" key={action.tab} type="button" onClick={() => onOpenTab(action.tab)}>
                <span aria-hidden="true">
                  <Icon size={21} />
                </span>
                <strong>{action.title}</strong>
                <small>{action.text}</small>
              </button>
            );
          })}
        </div>
      </section>
    </section>
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

function ImagePositionControl({ value, onChange }: { value?: string; onChange: (value: string) => void }) {
  const focus = parseImageFocus(value);

  function handleHorizontalChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(formatImagePosition(Number(event.target.value), focus.y));
  }

  function handleVerticalChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(formatImagePosition(focus.x, Number(event.target.value)));
  }

  return (
    <div className="admin-image-focus" aria-label="Fotoğraf görünen alanı">
      <div className="admin-image-focus-header">
        <strong>Görünen alan</strong>
        <span>
          {focus.x}% / {focus.y}%
        </span>
      </div>
      <label>
        <span>Yatay odak</span>
        <input type="range" min="0" max="100" value={focus.x} onChange={handleHorizontalChange} />
        <small>Sol · Orta · Sağ</small>
      </label>
      <label>
        <span>Dikey odak</span>
        <input type="range" min="0" max="100" value={focus.y} onChange={handleVerticalChange} />
        <small>Üst · Orta · Alt</small>
      </label>
    </div>
  );
}

function MediaField({
  value,
  alt,
  uploadKey,
  uploadingKey,
  onUpload,
  onChange,
  preview = "image",
  accept = "image/jpeg,image/jpg,image/png,image/webp",
  buttonLabel,
  emptyLabel,
  helpText,
  objectPosition,
  previewFrame = "default",
}: {
  value: string;
  alt?: string;
  uploadKey: string;
  uploadingKey: string;
  onUpload: (file: File, key: string) => Promise<UploadedMedia>;
  onChange: (value: string) => void;
  preview?: "image" | "video";
  accept?: string;
  buttonLabel?: string;
  emptyLabel?: string;
  helpText?: string;
  objectPosition?: string;
  previewFrame?: "default" | "captain";
}) {
  const inputId = useId();
  const isVideo = preview === "video";
  const UploadIcon = isVideo ? Video : ImagePlus;
  const isUploading = uploadingKey === uploadKey;
  const actionLabel = buttonLabel ?? (isVideo ? "Video seç" : "Fotoğraf seç");
  const mediaHelpText = helpText ?? (isVideo ? "MP4, WebM veya MOV. En fazla 120 MB." : "JPG, PNG veya WebP. En fazla 8 MB.");
  const [isDragging, setIsDragging] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState("");
  const displayValue = localPreviewUrl || value;
  const imageStyle: CSSProperties | undefined = objectPosition ? { objectPosition } : undefined;

  useEffect(() => {
    return () => {
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
      }
    };
  }, [localPreviewUrl]);

  async function handleFile(file?: File) {
    if (!file) {
      return;
    }

    setNotice(null);
    const validationError = getMediaValidationError(file, isVideo ? "video" : "image");

    if (validationError) {
      setNotice({ type: "error", text: validationError });
      return;
    }

    const nextPreviewUrl = URL.createObjectURL(file);
    setLocalPreviewUrl((currentPreviewUrl) => {
      if (currentPreviewUrl) {
        URL.revokeObjectURL(currentPreviewUrl);
      }

      return nextPreviewUrl;
    });

    try {
      const uploaded = await onUpload(file, uploadKey);
      onChange(uploaded.url);
      setLocalPreviewUrl((currentPreviewUrl) => {
        if (currentPreviewUrl) {
          URL.revokeObjectURL(currentPreviewUrl);
        }

        return "";
      });
      setNotice({
        type: "success",
        text: `${uploaded.kind === "video" ? "Video" : "Fotoğraf"} yüklendi. Yayına almak için kaydet.`,
      });
    } catch (error) {
      setLocalPreviewUrl((currentPreviewUrl) => {
        if (currentPreviewUrl) {
          URL.revokeObjectURL(currentPreviewUrl);
        }

        return "";
      });
      setNotice({
        type: "error",
        text: error instanceof Error ? error.message : "Medya yüklenemedi.",
      });
    }
  }

  async function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    await handleFile(event.target.files?.[0]);
    event.target.value = "";
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);

    if (isUploading) {
      return;
    }

    void handleFile(event.dataTransfer.files?.[0]);
  }

  return (
    <div className="admin-media-field">
      <div
        className={`admin-media-picker ${isDragging ? "is-dragging" : ""} ${isUploading ? "is-uploading" : ""}`}
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
      >
        <div
          className={`admin-media-preview ${displayValue ? "" : "is-empty"} ${isVideo ? "is-video" : ""} ${
            previewFrame === "captain" ? "is-captain" : ""
          }`}
        >
          {displayValue ? (
            isVideo ? (
              <video className="admin-media-video-preview" src={displayValue} controls preload="metadata" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={displayValue} alt={alt || "Admin fotoğraf önizlemesi"} style={imageStyle} />
            )
          ) : (
            <span>{emptyLabel ?? (isVideo ? "Video seçilmedi" : "Fotoğraf seçilmedi")}</span>
          )}
        </div>

        <label className="admin-upload-pill" htmlFor={inputId}>
          <span aria-hidden="true">
            {isUploading ? <RefreshCw size={16} /> : <UploadIcon size={16} />}
          </span>
          <strong>{isUploading ? "Yükleniyor" : displayValue ? "Değiştir" : actionLabel}</strong>
          <input id={inputId} type="file" accept={accept} disabled={isUploading} onChange={onFileChange} />
        </label>
      </div>

      {notice ? (
        <p className={`admin-media-notice is-${notice.type}`}>
          {notice.type === "success" ? <Check size={16} aria-hidden="true" /> : <XCircle size={16} aria-hidden="true" />}
          {notice.text}
        </p>
      ) : null}
      <p className="admin-media-help">{mediaHelpText}</p>
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
          <article className="admin-edit-card" key={`${title}-${index}`}>
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
