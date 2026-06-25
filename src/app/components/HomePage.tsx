import { useState } from "react";
import { Eye, Ear, Brain, Hand } from "lucide-react";
import { ContentCard, ALL_CONTENT } from "./ContentCard";

type Category = "visual" | "auditiva" | "cognitiva" | "motora";

export type DisabilityProfile = {
  visual: boolean;
  auditiva: boolean;
  cognitiva: boolean;
  motora: boolean;
};

type Page = "home" | "listing" | "detail" | "watch" | "profile" | "search" | "highcontrast";

interface HomePageProps {
  onNavigate: (page: Page) => void;
  disabilityProfile?: DisabilityProfile;
  onShowStreaming?: () => void;
}

const categories: {
  id: Category;
  Icon: React.ElementType;
  label: string;
  description: string;
  accent: string;
}[] = [
  { id: "visual",   Icon: Eye,   label: "Visual",   description: "Audiodescrição, alto contraste",  accent: "#e6308a" },
  { id: "auditiva", Icon: Ear,   label: "Auditiva", description: "Legendas, Libras, sinais",        accent: "#0073e6" },
  { id: "cognitiva",Icon: Brain, label: "Cognitiva",description: "Linguagem simplificada",          accent: "#5ba300" },
  { id: "motora",   Icon: Hand,  label: "Motora",   description: "Controles adaptativos",           accent: "#f5a623" },
];

export function HomePage({ onNavigate, disabilityProfile, onShowStreaming }: HomePageProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const effectiveCategory = selectedCategory
    ?? (disabilityProfile?.auditiva ? "auditiva"
      : disabilityProfile?.visual ? "visual"
      : disabilityProfile?.cognitiva ? "cognitiva"
      : disabilityProfile?.motora ? "motora"
      : null);

  const HOME_CARDS = ALL_CONTENT.slice(0, 8);

  const filteredContent = effectiveCategory
    ? HOME_CARDS.filter((card) => {
        if (effectiveCategory === "visual")    return card.badges.includes("AD");
        if (effectiveCategory === "auditiva")  return card.badges.includes("Leg") || card.badges.includes("Libras");
        if (effectiveCategory === "cognitiva") return card.badges.includes("AD");
        if (effectiveCategory === "motora")    return card.badges.includes("Adapt");
        return true;
      })
    : HOME_CARDS;

  const handleCategoryClick = (id: Category) =>
    setSelectedCategory((prev) => (prev === id ? null : id));

  return (
    <main id="main-content" className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-10">
      <h1
        className="text-center mb-8 md:mb-10"
        style={{ fontSize: "clamp(22px, 4vw, 30px)", fontWeight: 700, color: "#1a1a2e" }}
      >
        Encontre conteúdo acessível para você.
      </h1>

      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {effectiveCategory
          ? `Filtrado para acessibilidade ${effectiveCategory}. ${filteredContent.length} resultados.`
          : `Mostrando todos os ${HOME_CARDS.length} conteúdos.`}
      </div>

      {/* Category Cards */}
      <section aria-label="Categorias de acessibilidade" className="mb-10 md:mb-14">
        {/* Mobile: 2-col, Tablet+: 4-col */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {categories.map((cat) => {
            const isSelected = effectiveCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                aria-pressed={isSelected}
                aria-label={`Acessibilidade ${cat.label}${isSelected ? ", selecionado" : ""}`}
                className="rounded-2xl flex flex-col items-center gap-3 md:gap-4 transition-all duration-200 cursor-pointer"
                style={{
                  padding: "clamp(16px,3vw,28px) 12px",
                  backgroundColor: isSelected ? cat.accent : "white",
                  color: isSelected ? "white" : cat.accent,
                  border: `2px solid ${cat.accent}`,
                  boxShadow: isSelected ? `0 8px 24px ${cat.accent}44` : "0 2px 8px rgba(0,0,0,0.06)",
                  minHeight: 44,
                }}
                onFocus={(e) => { e.currentTarget.style.outline = `3px solid ${cat.accent}`; e.currentTarget.style.outlineOffset = "2px"; }}
                onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
              >
                <div
                  className="flex items-center justify-center rounded-xl transition-colors"
                  style={{
                    width: 52,
                    height: 52,
                    backgroundColor: isSelected ? "rgba(255,255,255,0.2)" : `${cat.accent}18`,
                  }}
                  aria-hidden="true"
                >
                  <cat.Icon size={28} />
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-sm font-bold" style={{ lineHeight: 1.2 }}>{cat.label}</span>
                  <span
                    className="text-xs text-center leading-tight hidden md:block"
                    style={{ opacity: isSelected ? 0.85 : 0.65 }}
                  >
                    {cat.description}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Content Grid */}
      <section aria-label="Melhores avaliados pela comunidade PCD">
        <div className="flex items-center justify-between mb-5 md:mb-6">
          <h2 style={{ fontSize: "clamp(16px, 2.5vw, 20px)", fontWeight: 700, color: "#0073e6" }}>
            Melhores Avaliados pela Comunidade PCD
          </h2>
          <button
            onClick={() => onNavigate("listing")}
            className="text-sm font-semibold hover:underline flex-shrink-0"
            style={{ color: "#0073e6", minHeight: 44, padding: "0 8px" }}
            onFocus={(e) => { e.currentTarget.style.outline = "3px solid #0073e6"; e.currentTarget.style.outlineOffset = "2px"; }}
            onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
          >
            Ver todos →
          </button>
        </div>

        {filteredContent.length === 0 ? (
          <div className="text-center py-16 rounded-2xl bg-white" role="status">
            <p className="font-semibold mb-2" style={{ color: "#4a4a6a" }}>Nenhum conteúdo encontrado</p>
            <p className="text-sm" style={{ color: "#6b6b8a" }}>Tente selecionar outra categoria.</p>
          </div>
        ) : (
          /* Mobile: 2-col, Tablet: 3-col, Desktop: 4-col */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {filteredContent.map((card) => (
              <ContentCard
                key={card.id}
                item={card}
                onClick={() => onNavigate("detail")}
                onStreamingClick={onShowStreaming}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
