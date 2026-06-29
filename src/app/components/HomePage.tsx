import { useRef, useState } from "react";
import {
  Eye, Ear, Brain, Hand,
  Sparkles, ChevronLeft, ChevronRight,
  Award, Headphones, Hand as HandIcon, BookOpen, Star,
} from "lucide-react";
import { ContentCard, ALL_CONTENT, type ContentItem } from "./ContentCard";
import { PlatformRanking } from "./PlatformRanking";
import { GameRanking } from "./GameRanking";

type Category = "visual" | "auditiva" | "cognitiva" | "motora";

export type DisabilityProfile = {
  visual: boolean;
  auditiva: boolean;
  cognitiva: boolean;
  motora: boolean;
};

type Page = "home" | "listing" | "detail" | "watch" | "profile" | "search" | "highcontrast" | "createprofile"
  | "category-visual" | "category-auditiva" | "category-cognitiva" | "category-motora";

interface HomePageProps {
  onNavigate: (page: Page) => void;
  disabilityProfile?: DisabilityProfile;
  hasProfile?: boolean;
  selectedNeeds?: string[];
  contentPrefs?: string[];     // filmes / series / jogos / docs
  streamingPrefs?: string[];   // netflix / prime / disney / globoplay / crunchyroll / hbomax
  onItemClick?: (item: ContentItem) => void;
  onShowStreaming?: () => void;
}

type CategoryDef = {
  id: Category;
  Icon: React.ElementType;
  label: string;
  description: string;
  accent: string;
  accentSelected: string;
};

/* All color pairs verified for WCAG AA contrast (≥4.5:1) on white or with white text */
const categories: CategoryDef[] = [
  { id: "visual",    Icon: Eye,   label: "Visual",    description: "Audiodescrição, alto contraste", accent: "#c01a6f", accentSelected: "#a01560" },
  { id: "auditiva",  Icon: Ear,   label: "Auditiva",  description: "Legendas, Libras, sinais",       accent: "#0073e6", accentSelected: "#005bb5" },
  { id: "cognitiva", Icon: Brain, label: "Cognitiva", description: "Linguagem simplificada",         accent: "#3d7500", accentSelected: "#2f5a00" },
  { id: "motora",    Icon: Hand,  label: "Motora",    description: "Controles adaptativos",          accent: "#a35e00", accentSelected: "#7a4600" },
];

function categoryMatches(card: ContentItem, cat: Category): boolean {
  if (cat === "visual")    return card.badges.includes("AD");
  if (cat === "auditiva")  return card.badges.includes("Leg") || card.badges.includes("Libras");
  if (cat === "cognitiva") return card.badges.includes("Adapt");
  if (cat === "motora")    return card.badges.includes("Adapt");
  return true;
}

type ShelfTheme = {
  Icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  tint: string;
};

function Shelf({
  title,
  subtitle,
  theme,
  items,
  onItemClick,
  onStreamingClick,
}: {
  title: string;
  subtitle?: string;
  theme: ShelfTheme;
  items: ContentItem[];
  onItemClick: (item: ContentItem) => void;
  onStreamingClick?: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  if (items.length === 0) return null;

  return (
    <section
      aria-label={title}
      className="mb-8 md:mb-10 rounded-3xl"
      style={{ background: theme.tint, padding: "16px 16px 8px", border: "1px solid rgba(0,0,0,0.04)" }}
    >
      <div className="flex items-center justify-between mb-3 md:mb-4 pl-1">
        <div className="flex items-center gap-3 min-w-0">
          <span
            className="flex items-center justify-center rounded-2xl flex-shrink-0"
            style={{ width: 40, height: 40, backgroundColor: theme.iconBg, color: theme.iconColor }}
            aria-hidden="true"
          >
            <theme.Icon size={22} />
          </span>
          <div className="min-w-0">
            <h2
              className="font-bold leading-tight truncate"
              style={{ fontSize: "clamp(15px, 2vw, 19px)", color: "#1a1a2e" }}
            >
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs md:text-sm" style={{ color: "#4a4a6a" }}>
                {subtitle} · {items.length} {items.length === 1 ? "título" : "títulos"}
              </p>
            )}
          </div>
        </div>
        <div className="hidden md:flex gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label={`Rolar ${title} para trás`}
            className="af-icon-btn"
          >
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label={`Rolar ${title} para frente`}
            className="af-icon-btn"
          >
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-3 md:gap-4 overflow-x-auto pb-3 snap-x snap-mandatory items-stretch"
        style={{ scrollbarWidth: "thin" }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="snap-start flex-shrink-0 flex"
            style={{ width: "clamp(150px, 22vw, 200px)" }}
          >
            <ContentCard item={item} onClick={() => onItemClick(item)} onStreamingClick={onStreamingClick} />
          </div>
        ))}
      </div>
    </section>
  );
}

function HeroPosterCluster() {
  /* Decorative floating posters — aria-hidden. Each is a real poster from ALL_CONTENT. */
  const featured = ALL_CONTENT.filter((c) => c.perfect).slice(0, 3);
  return (
    <div
      className="af-hero-posters relative flex-shrink-0"
      style={{ width: 320, height: 220 }}
      aria-hidden="true"
    >
      {featured.map((item, i) => {
        const positions = [
          { left: 0,   top: 30, rotate: -8, z: 1, delay: "0s"   },
          { left: 90,  top: 0,  rotate: 0,  z: 3, delay: "0.4s" },
          { left: 195, top: 30, rotate: 8,  z: 2, delay: "0.8s" },
        ];
        const p = positions[i];
        return (
          <div
            key={item.id}
            className="af-hero-poster"
            style={{
              position: "absolute",
              left: p.left,
              top: p.top,
              width: 110,
              height: 165,
              borderRadius: 14,
              overflow: "hidden",
              transform: `rotate(${p.rotate}deg)`,
              boxShadow: "0 18px 40px rgba(0,0,0,0.35)",
              border: "3px solid rgba(255,255,255,0.4)",
              zIndex: p.z,
              animationDelay: p.delay,
              background: item.posterColor,
            }}
          >
            <img
              src={item.poster}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              loading="lazy"
            />
            {/* "100%" sticker on top poster */}
            {i === 1 && (
              <div
                style={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  backgroundColor: "#2f5a00",
                  color: "white",
                  fontSize: 12,
                  fontWeight: 800,
                  padding: "2px 6px",
                  borderRadius: 999,
                  boxShadow: "0 2px 6px rgba(47,90,0,0.4)",
                }}
              >
                ✨ 100%
              </div>
            )}
          </div>
        );
      })}
      {/* Sparkles */}
      <span className="af-hero-twinkle" style={{ position: "absolute", left: 10,  top: 6,   fontSize: 22 }}>✨</span>
      <span className="af-hero-twinkle af-hero-twinkle-2" style={{ position: "absolute", right: 0, bottom: 20, fontSize: 18 }}>⭐</span>
      <span className="af-hero-twinkle af-hero-twinkle-3" style={{ position: "absolute", left: 140, bottom: 0, fontSize: 16 }}>✨</span>
    </div>
  );
}

export function HomePage({ onNavigate, disabilityProfile, hasProfile, selectedNeeds = [], contentPrefs = [], streamingPrefs = [], onItemClick, onShowStreaming }: HomePageProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  /* Open detail: prefer the item-aware callback; fall back to plain navigate */
  const openItem = (item: ContentItem) => {
    if (onItemClick) onItemClick(item);
    else onNavigate("detail");
  };

  /* ── Personalization helpers ── */
  /* Map needs → required badges */
  const needsBadges = (() => {
    const out: ContentItem["badges"] = [];
    if (selectedNeeds.some((n) => ["baixa_visao", "cegueira", "daltonismo"].includes(n))) out.push("AD");
    if (selectedNeeds.some((n) => ["surdez", "baixa_audicao"].includes(n))) out.push("Leg");
    if (selectedNeeds.includes("libras")) out.push("Libras");
    if (selectedNeeds.some((n) => ["tdah", "autismo", "dislexia", "ansiedade", "def_intelectual", "motora_fina", "eye_tracking"].includes(n))) out.push("Adapt");
    return Array.from(new Set(out));
  })();

  /* Filter the whole catalog by content-type prefs (Filmes/Séries/Jogos) and streaming prefs */
  const catalogForUser = (() => {
    const typeMap: Record<string, ContentItem["type"]> = { filmes: "Filmes", series: "Séries", jogos: "Jogos", anime: "Anime", docs: "Documentário" };
    const wantedTypes = contentPrefs.map((p) => typeMap[p]).filter(Boolean);
    return ALL_CONTENT.filter((c) => {
      if (wantedTypes.length > 0 && !wantedTypes.includes(c.type)) return false;
      if (streamingPrefs.length > 0 && c.platforms.length > 0
          && !c.platforms.some((p) => streamingPrefs.includes(p))) return false;
      return true;
    });
  })();

  /* Content matching ALL of the user's accessibility needs (most personal shelf) */
  const personalizedItems = hasProfile && needsBadges.length > 0
    ? catalogForUser.filter((c) => needsBadges.every((b) => c.badges.includes(b)))
    : [];

  const activeNeedsLabels = (() => {
    if (!disabilityProfile) return [];
    const out: string[] = [];
    if (disabilityProfile.visual)    out.push("audiodescrição");
    if (disabilityProfile.auditiva)  out.push("legendas e Libras");
    if (disabilityProfile.cognitiva) out.push("linguagem simplificada");
    if (disabilityProfile.motora)    out.push("controles adaptativos");
    return out;
  })();

  // Shelves
  const destaque = catalogForUser.filter((c) => c.perfect).slice(0, 8);
  const comAD = catalogForUser.filter((c) => c.badges.includes("AD")).slice(0, 10);
  const emLibras = catalogForUser.filter((c) => c.badges.includes("Libras")).slice(0, 10);
  const linguagemSimples = catalogForUser.filter((c) => c.badges.includes("Adapt")).slice(0, 10);
  const animes = catalogForUser.filter((c) => c.type === "Anime").slice(0, 10);
  const docs = catalogForUser.filter((c) => c.type === "Documentário").slice(0, 10);
  const topRated = [...catalogForUser].sort((a, b) => b.rating - a.rating).slice(0, 10);

  const shelfThemes: Record<string, ShelfTheme> = {
    foryou:    { Icon: Sparkles,    iconBg: "#fef3c7", iconColor: "#7a4600", tint: "linear-gradient(180deg, #fffbeb 0%, #ffffff 100%)" },
    anime:     { Icon: Sparkles,    iconBg: "#fce7f3", iconColor: "#a01560", tint: "linear-gradient(180deg, #fdf2f8 0%, #ffffff 100%)" },
    doc:       { Icon: BookOpen,    iconBg: "#dbeafe", iconColor: "#1e3a8a", tint: "linear-gradient(180deg, #eff6ff 0%, #ffffff 100%)" },
    destaque:  { Icon: Award,       iconBg: "#fff4d6", iconColor: "#7a4600", tint: "linear-gradient(180deg, #fffaeb 0%, #ffffff 100%)" },
    ad:        { Icon: Headphones,  iconBg: "#d4edda", iconColor: "#1a4d1a", tint: "linear-gradient(180deg, #ecf7ef 0%, #ffffff 100%)" },
    libras:    { Icon: HandIcon,    iconBg: "#fce4f0", iconColor: "#6b0038", tint: "linear-gradient(180deg, #fdeef5 0%, #ffffff 100%)" },
    adapt:     { Icon: BookOpen,    iconBg: "#ede9fe", iconColor: "#3b0764", tint: "linear-gradient(180deg, #f3effe 0%, #ffffff 100%)" },
    top:       { Icon: Star,        iconBg: "#cce0ff", iconColor: "#003366", tint: "linear-gradient(180deg, #eef4ff 0%, #ffffff 100%)" },
  };

  const filteredGrid = selectedCategory
    ? ALL_CONTENT.filter((c) => categoryMatches(c, selectedCategory))
    : [];

  return (
    <main id="main-content" className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8">
      {/* Hero */}
      <section aria-labelledby="hero-title" className="mb-8 md:mb-12">
        <div
          className="af-hero relative rounded-3xl p-5 md:p-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 overflow-hidden"
          style={{
            background:
              "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.18), transparent 50%), " +
              "radial-gradient(circle at 20% 80%, rgba(229,48,138,0.5), transparent 60%), " +
              "linear-gradient(135deg, #0073e6 0%, #5b3eb8 55%, #b51963 110%)",
            color: "white",
            boxShadow: "0 20px 60px rgba(91,62,184,0.25)",
          }}
        >
          {/* Decorative bokeh circles */}
          <div className="af-hero-bokeh" aria-hidden="true" />
          <div className="af-hero-bokeh af-hero-bokeh-2" aria-hidden="true" />

          <div className="flex-1 relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)" }}>
              <Sparkles size={14} aria-hidden="true" />
              <span className="text-xs font-bold tracking-wide uppercase">Hub PCD do Brasil</span>
            </div>
            <h1
              id="hero-title"
              className="font-black mb-3 break-words"
              style={{ fontSize: "clamp(22px, 5.5vw, 44px)", lineHeight: 1.1, letterSpacing: "-0.02em" }}
            >
              {hasProfile
                ? "Oi! Selecionamos uns títulos pra você."
                : (
                  <>
                    Cinema, séries e games <br className="hidden md:inline" />
                    <span style={{ color: "#ffe27a" }}>pra todo mundo.</span>
                  </>
                )}
            </h1>
            <p className="text-base md:text-lg opacity-95" style={{ maxWidth: 520, lineHeight: 1.5 }}>
              {hasProfile && activeNeedsLabels.length > 0
                ? `Filtrando por ${activeNeedsLabels.join(", ")}. Você pode mudar isso quando quiser.`
                : "Audiodescrição, legendas, Libras, linguagem simplificada — avaliado por quem usa de verdade."}
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {!hasProfile ? (
                <button
                  type="button"
                  onClick={() => onNavigate("createprofile")}
                  className="af-focus rounded-full font-bold transition-transform hover:scale-[1.03] active:scale-[0.97] shadow-lg"
                  style={{ backgroundColor: "white", color: "#0073e6", padding: "12px 20px", minHeight: 44, fontSize: 15 }}
                >
                  ✨ Personalizar minha experiência
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onNavigate("profile")}
                  className="af-focus rounded-full font-bold transition-transform hover:scale-[1.03] active:scale-[0.97]"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.15)",
                    color: "white",
                    border: "2px solid rgba(255,255,255,0.7)",
                    padding: "10px 18px",
                    minHeight: 44,
                    fontSize: 14,
                  }}
                >
                  Ajustar meu perfil
                </button>
              )}
            </div>

            {/* Quick shortcuts — point to rankings + categories below */}
            <div className="flex flex-wrap gap-2 mt-4" aria-label="Atalhos">
              {[
                { id: "platforms",  label: "🏆 Ranking de plataformas", target: "platform-ranking-title" },
                { id: "games",      label: "🎮 Top jogos acessíveis",    target: "game-ranking-title" },
                { id: "categories", label: "📂 Categorias",              target: "categories-section" },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => document.getElementById(s.target)?.scrollIntoView({ behavior: "smooth", block: "start" })}
                  className="af-focus rounded-full font-semibold text-sm transition-colors"
                  style={{
                    padding: "8px 14px",
                    backgroundColor: "rgba(255,255,255,0.18)",
                    color: "white",
                    border: "1px solid rgba(255,255,255,0.35)",
                    backdropFilter: "blur(6px)",
                    minHeight: 36,
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <div className="hidden lg:block flex-shrink-0">
            <HeroPosterCluster />
          </div>
        </div>
      </section>

      {/* Screen-reader live region */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {selectedCategory
          ? `Filtrado por acessibilidade ${selectedCategory}. ${filteredGrid.length} resultados.`
          : "Mostrando todas as categorias."}
      </div>

      {/* Category Cards */}
      <section id="categories-section" aria-label="Categorias de acessibilidade" className="mb-8 md:mb-12">
        <h2 className="sr-only" id="categories-section-title">Filtrar por categoria</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const bg = isSelected ? cat.accentSelected : "white";
            const fg = isSelected ? "white" : cat.accent;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onNavigate(`category-${cat.id}` as Page)}
                aria-pressed={isSelected}
                aria-label={`Abrir página de acessibilidade ${cat.label}`}
                className="af-focus af-category-card rounded-2xl flex flex-col items-center gap-3 md:gap-4 cursor-pointer"
                style={{
                  padding: "clamp(16px,3vw,28px) 12px",
                  backgroundColor: bg,
                  color: fg,
                  border: `2px solid ${cat.accent}`,
                  boxShadow: isSelected
                    ? `0 10px 28px ${cat.accentSelected}55`
                    : "0 2px 8px rgba(0,0,0,0.06)",
                  minHeight: 44,
                }}
              >
                <div
                  className="flex items-center justify-center rounded-2xl"
                  style={{
                    width: 56,
                    height: 56,
                    backgroundColor: isSelected ? "rgba(255,255,255,0.22)" : `${cat.accent}15`,
                  }}
                  aria-hidden="true"
                >
                  <cat.Icon size={30} />
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-sm font-bold" style={{ lineHeight: 1.2 }}>{cat.label}</span>
                  <span
                    className="text-xs text-center leading-tight hidden md:block"
                    style={{ opacity: isSelected ? 0.94 : 0.8 }}
                  >
                    {cat.description}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Rankings between categories and shelves */}
      {!selectedCategory && (
        <>
          <PlatformRanking needsBadges={needsBadges} />
          <GameRanking />
        </>
      )}

      {/* Either filtered grid (category active) or shelves (default) */}
      <div id="af-shelves">
        {selectedCategory ? (
          <section aria-label={`Conteúdo filtrado por acessibilidade ${selectedCategory}`}>
            <div className="flex items-center justify-between mb-5 md:mb-6">
              <h2 className="font-bold" style={{ fontSize: "clamp(16px, 2.5vw, 20px)", color: "#1a1a2e" }}>
                {filteredGrid.length} {filteredGrid.length === 1 ? "resultado" : "resultados"} para acessibilidade {selectedCategory}
              </h2>
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className="af-focus text-sm font-semibold hover:underline"
                style={{ color: "#0073e6", minHeight: 44, padding: "0 8px" }}
              >
                Limpar filtro
              </button>
            </div>
            {filteredGrid.length === 0 ? (
              <div className="text-center py-16 rounded-3xl bg-white" role="status">
                <div style={{ fontSize: 48 }} aria-hidden="true">🔍</div>
                <p className="font-semibold mt-3 mb-1" style={{ color: "#1a1a2e" }}>
                  Nada por aqui ainda
                </p>
                <p className="text-sm" style={{ color: "#4a4a6a" }}>
                  Tente outra categoria de acessibilidade.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
                {filteredGrid.map((card) => (
                  <ContentCard
                    key={card.id}
                    item={card}
                    onClick={() => openItem(card)}
                    onStreamingClick={onShowStreaming}
                  />
                ))}
              </div>
            )}
          </section>
        ) : (
          <>
            {hasProfile ? (
              <>
                {/* Personalized banner — visible proof that the profile is shaping the feed */}
                <div
                  className="rounded-3xl p-5 mb-6"
                  style={{
                    background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
                    border: "2px solid #f5a623",
                  }}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <span style={{ fontSize: 28 }} aria-hidden="true">🎯</span>
                    <div>
                      <h2 className="font-bold mb-1" style={{ fontSize: 17, color: "#1a1a2e" }}>
                        Modo personalizado ativo
                      </h2>
                      <p className="text-sm" style={{ color: "#4a4a6a" }}>
                        Mostrando {catalogForUser.length} {catalogForUser.length === 1 ? "título" : "títulos"} compatíveis com seu perfil.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {needsBadges.map((b) => (
                      <span key={b} className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: "#0073e6", color: "white" }}>
                        ✓ {b}
                      </span>
                    ))}
                    {contentPrefs.map((p) => (
                      <span key={p} className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: "#3d7500", color: "white" }}>
                        {p === "filmes" ? "🎬 Filmes" : p === "series" ? "📺 Séries" : p === "anime" ? "🎌 Animes" : p === "jogos" ? "🎮 Jogos" : "🎞️ Docs"}
                      </span>
                    ))}
                    {streamingPrefs.map((p) => (
                      <span key={p} className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: "#c01a6f", color: "white" }}>
                        {p}
                      </span>
                    ))}
                    <button
                      type="button"
                      onClick={() => onNavigate("createprofile")}
                      className="af-focus text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: "white", color: "#0073e6", border: "1.5px dashed #0073e6" }}
                    >
                      ✏ Editar perfil
                    </button>
                  </div>
                </div>

                {/* Personalized shelf — main feed when profile exists */}
                {personalizedItems.length > 0 ? (
                  <Shelf
                    title="✨ Combina 100% com seu perfil"
                    subtitle={`Tem ${needsBadges.join(" + ")}`}
                    theme={shelfThemes.foryou}
                    items={personalizedItems}
                    onItemClick={openItem}
                    onStreamingClick={onShowStreaming}
                  />
                ) : (
                  <div className="rounded-3xl p-6 mb-6 text-center" style={{ background: "#fff", border: "1px dashed #d0d5e0" }}>
                    <div style={{ fontSize: 36 }} aria-hidden="true">🔍</div>
                    <p className="font-bold mt-2" style={{ color: "#1a1a2e" }}>
                      Nenhum título combina com todos os recursos
                    </p>
                    <p className="text-sm mt-1" style={{ color: "#4a4a6a" }}>
                      Você precisa de {needsBadges.join(" + ")} simultâneo. Veja parciais abaixo.
                    </p>
                  </div>
                )}

                {/* Only show shelves matching the user's actual needs */}
                {needsBadges.includes("AD") && (
                  <Shelf
                    title="Com audiodescrição"
                    subtitle="Para sua necessidade visual"
                    theme={shelfThemes.ad}
                    items={comAD}
                    onItemClick={openItem}
                    onStreamingClick={onShowStreaming}
                  />
                )}
                {needsBadges.includes("Libras") && (
                  <Shelf
                    title="Com intérprete de Libras"
                    subtitle="Janela de Libras incluída"
                    theme={shelfThemes.libras}
                    items={emLibras}
                    onItemClick={openItem}
                    onStreamingClick={onShowStreaming}
                  />
                )}
                {needsBadges.includes("Adapt") && (
                  <Shelf
                    title="Linguagem simplificada"
                    subtitle="Para sua necessidade cognitiva"
                    theme={shelfThemes.adapt}
                    items={linguagemSimples}
                    onItemClick={openItem}
                    onStreamingClick={onShowStreaming}
                  />
                )}
                <Shelf
                  title="🎌 Animes acessíveis"
                  subtitle="Janela de Libras + legendas PT-BR"
                  theme={shelfThemes.anime}
                  items={animes}
                  onItemClick={openItem}
                  onStreamingClick={onShowStreaming}
                />
                <Shelf
                  title="🎞️ Documentários"
                  subtitle="Histórias reais, acessíveis pra todos"
                  theme={shelfThemes.doc}
                  items={docs}
                  onItemClick={openItem}
                  onStreamingClick={onShowStreaming}
                />
                <Shelf
                  title="Outros recomendados"
                  subtitle="Filtrados pelo seu perfil"
                  theme={shelfThemes.top}
                  items={topRated}
                  onItemClick={openItem}
                  onStreamingClick={onShowStreaming}
                />
              </>
            ) : (
              <>
                {/* No profile — generic feed */}
                <Shelf
                  title="Em destaque · 100% acessível"
                  subtitle="Os queridinhos da comunidade"
                  theme={shelfThemes.destaque}
                  items={destaque}
                  onItemClick={openItem}
                  onStreamingClick={onShowStreaming}
                />
                <Shelf
                  title="Com audiodescrição"
                  subtitle="Para quem ouve a história"
                  theme={shelfThemes.ad}
                  items={comAD}
                  onItemClick={openItem}
                  onStreamingClick={onShowStreaming}
                />
                <Shelf
                  title="Com intérprete de Libras"
                  subtitle="Janela de Libras incluída"
                  theme={shelfThemes.libras}
                  items={emLibras}
                  onItemClick={openItem}
                  onStreamingClick={onShowStreaming}
                />
                <Shelf
                  title="Linguagem simplificada"
                  subtitle="Mais fácil de acompanhar"
                  theme={shelfThemes.adapt}
                  items={linguagemSimples}
                  onItemClick={openItem}
                  onStreamingClick={onShowStreaming}
                />
                <Shelf
                  title="🎌 Animes acessíveis"
                  subtitle="Janela de Libras + legendas PT-BR"
                  theme={shelfThemes.anime}
                  items={animes}
                  onItemClick={openItem}
                  onStreamingClick={onShowStreaming}
                />
                <Shelf
                  title="🎞️ Documentários"
                  subtitle="Histórias reais, acessíveis pra todos"
                  theme={shelfThemes.doc}
                  items={docs}
                  onItemClick={openItem}
                  onStreamingClick={onShowStreaming}
                />
                <Shelf
                  title="Top da comunidade PCD"
                  subtitle="Melhores avaliações"
                  theme={shelfThemes.top}
                  items={topRated}
                  onItemClick={openItem}
                  onStreamingClick={onShowStreaming}
                />
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
}
