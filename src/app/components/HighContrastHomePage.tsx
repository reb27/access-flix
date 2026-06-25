import { useState } from "react";
import { Eye, Ear, Brain, Star } from "lucide-react";

type Category = "visual" | "auditiva" | "cognitiva";

const categories: { id: Category; icon: React.ReactNode; label: string }[] = [
  { id: "visual",   icon: <Eye size={36} />,   label: "Eu busco acessibilidade Visual" },
  { id: "auditiva", icon: <Ear size={36} />,   label: "Eu busco acessibilidade Auditiva" },
  { id: "cognitiva",icon: <Brain size={36} />, label: "Eu busco acessibilidade Cognitiva" },
];

const contentCards = [
  { id: 1, title: "Planeta dos Macacos: O Reinado", rating: 4.8, badges: ["AD", "Leg", "Libras"] },
  { id: 2, title: "Duna: Parte Dois",               rating: 4.9, badges: ["AD", "Leg"] },
  { id: 3, title: "The Last of Us",                 rating: 4.7, badges: ["Leg", "Libras"] },
  { id: 4, title: "Oppenheimer",                    rating: 4.8, badges: ["AD", "Leg", "Libras"] },
];

interface HighContrastHomePageProps {
  onNavigate: (page: "home" | "listing" | "detail" | "watch" | "profile" | "search" | "highcontrast") => void;
}

export function HighContrastHomePage({ onNavigate }: HighContrastHomePageProps) {
  const [selected, setSelected] = useState<Category>("auditiva");

  /* Focus style injected globally on this page via a wrapper class */
  return (
    <div
      className="flex-1 overflow-y-auto hc-page"
      style={{ backgroundColor: "#000000" }}
    >
      <style>{`
        .hc-page *:focus-visible {
          outline: 3px solid #FFFF00 !important;
          outline-offset: 3px !important;
        }
      `}</style>

      {/* ── Main content ── */}
      <main className="max-w-6xl mx-auto px-6 py-10">

        <h1
          className="text-center text-3xl font-bold mb-10"
          style={{ color: "#FFFFFF" }}
          tabIndex={0}
        >
          Encontre conteúdo acessível para você.
        </h1>

        {/* Category cards */}
        <section aria-label="Categorias de acessibilidade" className="mb-12">
          <div className="grid grid-cols-3 gap-5">
            {categories.map((cat) => {
              const isSelected = selected === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelected(cat.id)}
                  aria-pressed={isSelected}
                  aria-label={cat.label}
                  className="rounded-2xl p-8 flex flex-col items-center gap-5 transition-colors cursor-pointer"
                  style={{
                    backgroundColor: "#000000",
                    border: isSelected ? "2px solid #FFFF00" : "2px solid #FFFFFF",
                    color: isSelected ? "#FFFF00" : "#FFFFFF",
                  }}
                >
                  <span aria-hidden="true">{cat.icon}</span>
                  <span className="text-base font-semibold text-center leading-snug">
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Community section */}
        <section aria-label="Melhores avaliados pela comunidade PCD">
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-xl font-bold"
              style={{ color: "#FFFFFF" }}
            >
              Melhores Avaliados pela Comunidade PCD
            </h2>
            <button
              onClick={() => onNavigate("listing")}
              className="text-sm font-semibold underline"
              style={{ color: "#FFFF00" }}
              aria-label="Ver todos os conteúdos"
            >
              Ver todos →
            </button>
          </div>

          <div className="grid grid-cols-4 gap-5">
            {contentCards.map((card) => (
              <article
                key={card.id}
                className="rounded-2xl overflow-hidden cursor-pointer"
                style={{
                  backgroundColor: "#000000",
                  border: "1px solid #FFFFFF",
                }}
              >
                {/* Poster placeholder */}
                <div
                  className="w-full aspect-[2/3] flex items-center justify-center"
                  style={{ backgroundColor: "#1a1a1a", borderBottom: "1px solid #FFFFFF" }}
                  aria-hidden="true"
                >
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <path d="M16 32L22 24L26 28L30 22L36 32H16Z" fill="#FFFFFF" fillOpacity="0.4" />
                    <circle cx="20" cy="20" r="4" fill="#FFFFFF" fillOpacity="0.4" />
                  </svg>
                </div>

                <div className="p-4">
                  <h3
                    className="text-sm font-semibold mb-2 leading-tight line-clamp-2"
                    style={{ color: "#FFFFFF" }}
                  >
                    {card.title}
                  </h3>

                  {/* Rating — yellow star + yellow score */}
                  <div
                    className="flex items-center gap-1 mb-3"
                    aria-label={`Avaliação: ${card.rating} de 5.0`}
                  >
                    <Star size={14} fill="#FFFF00" color="#FFFF00" aria-hidden="true" />
                    <span className="text-xs font-bold" style={{ color: "#FFFF00" }}>
                      {card.rating}
                    </span>
                    <span className="text-xs" style={{ color: "#9CA3AF" }}>/5.0</span>
                  </div>

                  {/* Badges — white bg, black text, black border */}
                  <div className="flex flex-wrap gap-1">
                    {card.badges.map((b) => (
                      <span
                        key={b}
                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: "#FFFFFF",
                          color: "#000000",
                          border: "1px solid #000000",
                        }}
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
