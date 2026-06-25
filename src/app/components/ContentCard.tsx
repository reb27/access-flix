import { useState } from "react";
import { Star, Play, Sparkles } from "lucide-react";
import { gamePoster } from "./gamePoster";

export type BadgeType = "AD" | "Leg" | "Libras" | "Adapt";

export type PlatformId = "netflix" | "prime" | "disney" | "globoplay" | "crunchyroll" | "hbomax";

export interface ContentItem {
  id: number;
  title: string;
  type: "Filmes" | "Séries" | "Jogos";
  rating: number;
  badges: BadgeType[];
  platforms: PlatformId[];
  perfect: boolean;
  posterColor: string;
  poster: string;
}

/* Badge config — bg/text pairs all pass WCAG AA (≥4.5:1) */
const badgeConfig: Record<BadgeType, { bg: string; text: string; label: string }> = {
  AD:     { bg: "#d4edda", text: "#1a4d1a", label: "Audiodescrição" },
  Leg:    { bg: "#cce0ff", text: "#003366", label: "Legendas" },
  Libras: { bg: "#fce4f0", text: "#6b0038", label: "Libras" },
  Adapt:  { bg: "#ede9fe", text: "#3b0764", label: "Linguagem adaptada" },
};

/* Platform display config — used for small chips on the card */
export const platformConfig: Record<PlatformId, { name: string; color: string; initials: string }> = {
  netflix:     { name: "Netflix",     color: "#E50914", initials: "N" },
  prime:       { name: "Prime Video", color: "#00A8E0", initials: "P" },
  disney:      { name: "Disney+",     color: "#113CCF", initials: "D+" },
  globoplay:   { name: "Globoplay",   color: "#E8303B", initials: "G" },
  crunchyroll: { name: "Crunchyroll", color: "#F47521", initials: "C" },
  hbomax:      { name: "Max",         color: "#6B0BBA", initials: "M" },
};

const posterColors = [
  "#6366f1", "#ec4899", "#14b8a6", "#f59e0b",
  "#10b981", "#3b82f6", "#ef4444", "#8b5cf6",
];

const B = "https://image.tmdb.org/t/p/w500";

function Poster({ src, color, title }: { src: string; color: string; title: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        className="w-full aspect-[2/3] flex items-center justify-center"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      >
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
          <path d="M14 40L22 28L28 34L34 24L44 40H14Z" fill="white" fillOpacity="0.3" />
          <circle cx="22" cy="20" r="5" fill="white" fillOpacity="0.3" />
        </svg>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={`Pôster de ${title}`}
      className="w-full aspect-[2/3] object-cover"
      onError={() => setFailed(true)}
      loading="lazy"
    />
  );
}

interface ContentCardProps {
  item: ContentItem;
  onClick?: () => void;
  onStreamingClick?: () => void;
}

export function ContentCard({ item, onClick, onStreamingClick }: ContentCardProps) {
  const [hovered, setHovered] = useState(false);

  const platformsLabel = item.platforms.length
    ? `Disponível em ${item.platforms.map((p) => platformConfig[p].name).join(", ")}.`
    : "";

  return (
    <article
      className="af-focus bg-white rounded-2xl overflow-hidden shadow-sm transition-all duration-200 cursor-pointer group flex flex-col w-full"
      style={{
        boxShadow: hovered ? "0 12px 28px rgba(0,0,0,0.15)" : "0 2px 8px rgba(0,0,0,0.06)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
      }}
      onClick={onClick}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onClick?.())}
      aria-label={`${item.title}, ${item.type}, avaliação ${item.rating.toFixed(1)} de 5. Recursos: ${item.badges.map((b) => badgeConfig[b].label).join(", ")}. ${platformsLabel}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative overflow-hidden">
        <Poster src={item.poster} color={item.posterColor} title={item.title} />

        {/* Medal for 100% accessible */}
        {item.perfect && (
          <div
            className="absolute top-2 right-2 flex items-center gap-1 rounded-full text-white"
            style={{
              backgroundColor: "#2f5a00",
              padding: "3px 8px",
              fontSize: 10,
              fontWeight: 800,
              boxShadow: "0 2px 8px rgba(47,90,0,0.4)",
            }}
            aria-label="Conteúdo 100% acessível"
          >
            <Sparkles size={11} aria-hidden="true" />
            100%
          </div>
        )}

        <div
          className="absolute bottom-2 left-2 rounded-full px-2 py-0.5 text-xs font-semibold"
          style={{ backgroundColor: "rgba(0,0,0,0.65)", color: "white" }}
          aria-hidden="true"
        >
          {item.type}
        </div>

        {/* Hover streaming CTA */}
        {hovered && onStreamingClick && (
          <button
            type="button"
            className="absolute bottom-2 right-2 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-white text-xs font-bold shadow-lg transition-transform hover:scale-105 active:scale-95"
            style={{ backgroundColor: "#0073e6" }}
            onClick={(e) => {
              e.stopPropagation();
              onStreamingClick();
            }}
            aria-label={`Ver onde assistir ${item.title}`}
            tabIndex={-1}
          >
            <Play size={10} fill="white" aria-hidden="true" />
            Onde assistir
          </button>
        )}
      </div>

      <div className="p-3 flex flex-col flex-1">
        <h3
          className="text-sm font-semibold mb-1.5 leading-tight line-clamp-2 transition-colors"
          style={{ color: hovered ? "#0073e6" : "#1a1a2e" }}
        >
          {item.title}
        </h3>

        <div
          className="flex items-center gap-1 mb-2"
          aria-label={`Avaliação: ${item.rating.toFixed(1)} de 5`}
        >
          <Star size={13} fill="#b35d00" color="#b35d00" aria-hidden="true" />
          <span className="text-xs font-bold" style={{ color: "#1a1a2e" }}>
            {item.rating.toFixed(1)}
          </span>
          <span className="text-xs" style={{ color: "#4a4a6a" }}>/5</span>
        </div>

        {/* Accessibility badges */}
        <div className="flex flex-wrap gap-1 mb-2" aria-label="Recursos de acessibilidade">
          {item.badges.map((badge) => (
            <span
              key={badge}
              className="text-xs font-bold px-1.5 py-0.5 rounded-full"
              style={{ backgroundColor: badgeConfig[badge].bg, color: badgeConfig[badge].text }}
              title={badgeConfig[badge].label}
              aria-label={badgeConfig[badge].label}
            >
              {badge}
            </span>
          ))}
        </div>

        {/* Platform chips */}
        {item.platforms.length > 0 && (
          <div
            className="flex items-center gap-1"
            aria-label={`Plataformas: ${item.platforms.map((p) => platformConfig[p].name).join(", ")}`}
          >
            {item.platforms.slice(0, 4).map((p) => {
              const cfg = platformConfig[p];
              return (
                <span
                  key={p}
                  className="flex items-center justify-center rounded-md text-white font-black"
                  style={{
                    backgroundColor: cfg.color,
                    width: 22,
                    height: 22,
                    fontSize: 9,
                    letterSpacing: "-0.02em",
                  }}
                  title={cfg.name}
                  aria-hidden="true"
                >
                  {cfg.initials}
                </span>
              );
            })}
            {item.platforms.length > 4 && (
              <span className="text-xs font-bold" style={{ color: "#4a4a6a" }} aria-hidden="true">
                +{item.platforms.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export const ALL_CONTENT: ContentItem[] = [
  { id: 1,  title: "Planeta dos Macacos: O Reinado", type: "Filmes", rating: 4.8, badges: ["AD","Leg","Libras"],         platforms: ["disney","hbomax"],         perfect: true,  posterColor: posterColors[0], poster: `${B}/gKkl37BQuKTanygYQG1pyYgLVgf.jpg` },
  { id: 2,  title: "Duna: Parte Dois",               type: "Filmes", rating: 4.9, badges: ["AD","Leg"],                  platforms: ["hbomax","prime"],          perfect: false, posterColor: posterColors[1], poster: `${B}/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg` },
  { id: 3,  title: "The Last of Us",                 type: "Séries", rating: 4.7, badges: ["Leg","Libras","Adapt"],      platforms: ["hbomax"],                  perfect: true,  posterColor: posterColors[2], poster: `${B}/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg` },
  { id: 4,  title: "Oppenheimer",                    type: "Filmes", rating: 4.8, badges: ["AD","Leg","Libras"],         platforms: ["prime","hbomax"],          perfect: true,  posterColor: posterColors[3], poster: `${B}/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg` },
  { id: 5,  title: "Fallout",                        type: "Séries", rating: 4.6, badges: ["Leg","AD"],                  platforms: ["prime"],                   perfect: false, posterColor: posterColors[4], poster: `${B}/AnsSKR9XBrsAXGCmwJUPfEzTkHq.jpg` },
  { id: 6,  title: "The Bear",                       type: "Séries", rating: 4.9, badges: ["Leg","Libras"],              platforms: ["disney","hbomax"],         perfect: false, posterColor: posterColors[5], poster: `${B}/sHFlbKS3WLqMnp9t2ghADIJFnuQ.jpg` },
  { id: 7,  title: "Beetlejuice Beetlejuice",        type: "Filmes", rating: 4.3, badges: ["AD","Leg"],                  platforms: ["hbomax"],                  perfect: false, posterColor: posterColors[6], poster: `${B}/kKgQzkUCnQmeTPkyIwHly2t6ZFI.jpg` },
  { id: 8,  title: "Twisters",                       type: "Filmes", rating: 4.2, badges: ["Leg"],                       platforms: ["prime"],                   perfect: false, posterColor: posterColors[7], poster: `${B}/pAskD3bZ8SjDeHt6OFxCMj4SKQG.jpg` },
  { id: 9,  title: "The Acolyte",                    type: "Séries", rating: 4.1, badges: ["Leg","Libras","AD"],         platforms: ["disney"],                  perfect: true,  posterColor: posterColors[0], poster: `${B}/nSRdr4Ckp5c3RmCHNjxSLDAK4fb.jpg` },
  { id: 10, title: "Alien: Romulus",                 type: "Filmes", rating: 4.5, badges: ["AD","Leg","Libras","Adapt"], platforms: ["disney","hbomax"],         perfect: true,  posterColor: posterColors[1], poster: `${B}/b33nnKl1GSFbao4l3fZDDqsMx0F.jpg` },
  { id: 11, title: "The Legend of Zelda: Echoes",    type: "Jogos",  rating: 4.9, badges: ["Adapt","Leg"],               platforms: [],                          perfect: true,  posterColor: "#14b8a6", poster: gamePoster({ title: "Zelda: Echoes of Wisdom", studio: "Nintendo",     year: 2024, colors: ["#22c55e","#0f766e"], glyph: "🗡" }) },
  { id: 12, title: "Astro Bot",                      type: "Jogos",  rating: 4.8, badges: ["Adapt","AD","Leg"],          platforms: [],                          perfect: true,  posterColor: "#f59e0b", poster: gamePoster({ title: "Astro Bot",              studio: "Team Asobi",   year: 2024, colors: ["#3b82f6","#1e3a8a"], glyph: "🤖" }) },
  { id: 13, title: "Black Myth: Wukong",             type: "Jogos",  rating: 4.7, badges: ["Leg","Adapt"],               platforms: [],                          perfect: false, posterColor: "#10b981", poster: gamePoster({ title: "Black Myth Wukong",      studio: "Game Science", year: 2024, colors: ["#dc2626","#7c2d12"], glyph: "🐒" }) },
  { id: 14, title: "Shogun",                         type: "Séries", rating: 4.8, badges: ["Leg","Libras"],              platforms: ["disney"],                  perfect: false, posterColor: posterColors[5], poster: `${B}/7O4iVfOMQmdCSxhOg1WnzM1B5B0.jpg` },
  { id: 15, title: "Deadpool & Wolverine",           type: "Filmes", rating: 4.6, badges: ["AD","Leg","Libras"],         platforms: ["disney"],                  perfect: true,  posterColor: posterColors[6], poster: `${B}/8npISHPPbMHAeJWJbROLGJRCDot.jpg` },
  { id: 16, title: "Inside Out 2",                   type: "Filmes", rating: 4.7, badges: ["AD","Leg","Libras","Adapt"], platforms: ["disney"],                  perfect: true,  posterColor: posterColors[7], poster: `${B}/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg` },
  { id: 17, title: "Hades II",                       type: "Jogos",  rating: 4.8, badges: ["Adapt","Leg"],               platforms: [],                          perfect: false, posterColor: "#7c3aed", poster: gamePoster({ title: "Hades II",                studio: "Supergiant",     year: 2024, colors: ["#7c3aed","#1e1b4b"], glyph: "⚔" }) },
  { id: 18, title: "Elden Ring: Shadow of Erdtree",  type: "Jogos",  rating: 4.6, badges: ["Leg"],                       platforms: [],                          perfect: false, posterColor: "#a16207", poster: gamePoster({ title: "Elden Ring SoTE",        studio: "FromSoftware",   year: 2024, colors: ["#a16207","#451a03"], glyph: "🛡" }) },
  { id: 19, title: "The Penguin",                    type: "Séries", rating: 4.7, badges: ["AD","Leg","Libras"],         platforms: ["hbomax"],                  perfect: true,  posterColor: posterColors[2], poster: `${B}/ikuCpFMBpqFVCmSWqEFi1xHtfej.jpg` },
  { id: 20, title: "Agatha All Along",               type: "Séries", rating: 4.4, badges: ["Leg","Libras"],              platforms: ["disney"],                  perfect: false, posterColor: posterColors[3], poster: `${B}/6GDuHQAl0LQM2CJUPQyJPEKWygy.jpg` },
  { id: 21, title: "Longlegs",                       type: "Filmes", rating: 4.0, badges: ["AD","Leg"],                  platforms: ["prime"],                   perfect: false, posterColor: posterColors[4], poster: `${B}/qkQ8pOJOYEFsBQ3LKoRp44YMWpI.jpg` },
  { id: 22, title: "Wicked",                         type: "Filmes", rating: 4.8, badges: ["AD","Leg","Libras","Adapt"], platforms: ["prime","hbomax"],          perfect: true,  posterColor: posterColors[5], poster: `${B}/xbKFv4KF3sVYuWKllLlwWDmuZP7.jpg` },
  { id: 23, title: "Hi-Fi Rush",                     type: "Jogos",  rating: 4.9, badges: ["Adapt","AD","Leg","Libras"], platforms: [],                          perfect: true,  posterColor: "#ec4899", poster: gamePoster({ title: "Hi-Fi Rush",              studio: "Tango Gameworks", year: 2023, colors: ["#ec4899","#7c2d12"], glyph: "🎸" }) },
  { id: 24, title: "Concord",                        type: "Jogos",  rating: 3.8, badges: ["Leg","Adapt"],               platforms: [],                          perfect: false, posterColor: "#475569", poster: gamePoster({ title: "Concord",                 studio: "Firewalk",        year: 2024, colors: ["#475569","#0f172a"], glyph: "🚀" }) },
];
