import { useState } from "react";
import { Search, Star } from "lucide-react";
import { ALL_CONTENT, type ContentItem } from "./ContentCard";

type Page = "home" | "listing" | "detail" | "watch" | "profile" | "search" | "highcontrast" | "createprofile" | "mobilecategories" | "mobilesearch" | "category-visual" | "category-auditiva" | "category-cognitiva" | "category-motora";

const categories = [
  {
    id: "visual",    label: "Visual",    description: "Audiodescrição, contraste",
    bg: "#fce4f0",   color: "#6b0038",   accentColor: "#e6308a",
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  },
  {
    id: "auditiva",  label: "Auditiva",  description: "Legendas, Libras",
    bg: "#e8f0fe",   color: "#003366",   accentColor: "#0073e6",
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 6-6 10a3.5 3.5 0 0 1-7 0"/><path d="M15 8.5a2.5 2.5 0 0 0-5 0v1l4.5 4.5"/></svg>,
  },
  {
    id: "cognitiva", label: "Cognitiva", description: "Linguagem simplificada",
    bg: "#e8f5e9",   color: "#1a4d1a",   accentColor: "#5ba300",
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>,
  },
  {
    id: "motora",    label: "Motora",    description: "Controles adaptativos",
    bg: "#fff3e0",   color: "#854f0b",   accentColor: "#f5a623",
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>,
  },
  {
    id: "tdah",      label: "TDAH",      description: "Conteúdo curto e dinâmico",
    bg: "#ede7f6",   color: "#3c3489",   accentColor: "#7c3aed",
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  },
  {
    id: "tea",       label: "TEA",       description: "Sem sobrecarga sensorial",
    bg: "#e0f7fa",   color: "#0f6e56",   accentColor: "#0891b2",
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.5 7l-5-5-1.5 1.5L12.5 2 7 7.5l1.5 1.5L7 10.5l5 5 1.5-1.5 1.5 1.5 5.5-5.5-1.5-1.5z"/><path d="M9.5 14.5l-5 5"/></svg>,
  },
];

const badgeColors: Record<string, { bg: string; text: string }> = {
  AD:     { bg: "#d4edda", text: "#1a4d1a" },
  Leg:    { bg: "#cce0ff", text: "#003366" },
  Libras: { bg: "#fce4f0", text: "#6b0038" },
  Adapt:  { bg: "#ede9fe", text: "#3b0764" },
};

/* ── Trending mini-card — separate component so hooks aren't called in loops ── */
function TrendingCard({ item, onClick }: { item: ContentItem; onClick: () => void }) {
  const [failed, setFailed] = useState(false);

  return (
    <button
      onClick={onClick}
      aria-label={`${item.title}, ${item.rating.toFixed(1)} estrelas`}
      className="flex-shrink-0 flex flex-col text-left focus:outline-none active:scale-[0.97]"
      style={{ width: 110 }}
      onFocus={(e) => { e.currentTarget.style.outline = "3px solid #0073e6"; e.currentTarget.style.outlineOffset = "2px"; }}
      onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
    >
      <div
        className="relative w-full overflow-hidden rounded-xl"
        style={{ aspectRatio: "2/3", backgroundColor: item.posterColor }}
        aria-hidden="true"
      >
        {!failed ? (
          <img
            src={item.poster}
            alt=""
            className="w-full h-full object-cover"
            onError={() => setFailed(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
              <path d="M6 34L16 20L22 28L28 16L36 34H6Z" fill="white" fillOpacity="0.25" />
            </svg>
          </div>
        )}
      </div>
      <p className="mt-1.5 text-xs font-semibold leading-tight line-clamp-2" style={{ color: "#1a1a2e" }}>{item.title}</p>
      <div className="flex items-center gap-1 mt-0.5">
        <Star size={10} fill="#f5a623" color="#f5a623" aria-hidden="true" />
        <span className="text-xs font-bold" style={{ color: "#4a4a6a" }}>{item.rating.toFixed(1)}</span>
      </div>
      <div className="flex flex-wrap gap-0.5 mt-1">
        {item.badges.slice(0, 2).map((b) => (
          <span key={b} className="font-bold px-1 py-0.5 rounded"
            style={{ backgroundColor: badgeColors[b]?.bg ?? "#f0f0f0", color: badgeColors[b]?.text ?? "#333", fontSize: 12 }}>
            {b}
          </span>
        ))}
      </div>
    </button>
  );
}

interface MobileCategoriesPageProps {
  onNavigate: (page: Page) => void;
  onItemClick: () => void;
}

export function MobileCategoriesPage({ onNavigate, onItemClick }: MobileCategoriesPageProps) {
  const trending = ALL_CONTENT.slice(0, 8);

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: "#f5f7fa" }}>

      {/* Header */}
      <header
        className="flex-shrink-0 flex items-center justify-between px-4"
        style={{ height: 56, backgroundColor: "#ffffff", borderBottom: "1px solid #e8eaf0", flexShrink: 0 }}
      >
        <h1 className="font-bold" style={{ fontSize: 18, color: "#1a1a2e" }}>Categorias</h1>
        <button
          onClick={() => onNavigate("mobilesearch")}
          aria-label="Buscar"
          className="flex items-center justify-center focus:outline-none"
          style={{ width: 44, height: 44, color: "#4a4a6a" }}
          onFocus={(e) => { e.currentTarget.style.outline = "3px solid #0073e6"; e.currentTarget.style.outlineOffset = "2px"; }}
          onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
        >
          <Search size={22} />
        </button>
      </header>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-4 py-4">

        {/* 2×3 grid */}
        <section aria-label="Categorias de acessibilidade" className="mb-6">
          <div className="grid grid-cols-2 gap-3">
            {categories.filter((cat) => ["visual","auditiva","cognitiva","motora"].includes(cat.id)).map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => onNavigate(`category-${cat.id}` as Page)}
                className="af-focus flex flex-col items-center justify-center gap-2 rounded-2xl transition-all active:scale-[0.97]"
                style={{ height: 120, backgroundColor: cat.bg, border: `1.5px solid ${cat.accentColor}28`, padding: 12 }}
                aria-label={`Abrir página de acessibilidade ${cat.label}: ${cat.description}`}
              >
                <div style={{ color: cat.accentColor }}>{cat.icon}</div>
                <div>
                  <div className="text-center font-bold" style={{ fontSize: 15, color: cat.color, lineHeight: 1.2 }}>{cat.label}</div>
                  <div className="text-center text-xs mt-0.5" style={{ color: `${cat.color}88` }}>{cat.description}</div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Em alta esta semana */}
        <section aria-label="Em alta esta semana">
          <h2 className="font-bold mb-3" style={{ fontSize: 16, color: "#1a1a2e" }}>Em alta esta semana 🔥</h2>
          <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
            {trending.map((item) => (
              <TrendingCard key={item.id} item={item} onClick={onItemClick} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
