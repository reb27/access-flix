import { useState } from "react";
import { Star, Play } from "lucide-react";

export type BadgeType = "AD" | "Leg" | "Libras" | "Adapt";

export interface ContentItem {
  id: number;
  title: string;
  type: "Filmes" | "Séries" | "Jogos";
  rating: number;
  badges: BadgeType[];
  perfect: boolean;
  posterColor: string;
  poster: string;
}

/* Better contrast: text on light bg */
const badgeConfig: Record<BadgeType, { bg: string; text: string; label: string }> = {
  AD:     { bg: "#d4edda", text: "#1a4d1a", label: "Audiodescrição" },
  Leg:    { bg: "#cce0ff", text: "#003366", label: "Legendas" },
  Libras: { bg: "#fce4f0", text: "#6b0038", label: "Libras" },
  Adapt:  { bg: "#ede9fe", text: "#3b0764", label: "Controles Adaptativos" },
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

  return (
    <article
      className="bg-white rounded-2xl overflow-hidden shadow-sm transition-all duration-200 cursor-pointer group"
      style={{ boxShadow: hovered ? "0 8px 24px rgba(0,0,0,0.12)" : "0 2px 8px rgba(0,0,0,0.06)", outline: "none" }}
      onClick={onClick}
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
      aria-label={`${item.title}, avaliação ${item.rating.toFixed(1)}, recursos: ${item.badges.join(", ")}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={(e) => (e.currentTarget.style.outline = "3px solid #0073e6")}
      onBlur={(e) => (e.currentTarget.style.outline = "none")}
    >
      <div className="relative overflow-hidden">
        <Poster src={item.poster} color={item.posterColor} title={item.title} />
        {item.perfect && (
          <div
            className="absolute top-2 right-2 rounded-full px-2 py-0.5 text-xs font-bold text-white"
            style={{ backgroundColor: "#5ba300" }}
            aria-label="100% acessível"
          >
            100%
          </div>
        )}
        <div
          className="absolute bottom-2 left-2 rounded-full px-2 py-0.5 text-xs font-semibold"
          style={{ backgroundColor: "rgba(0,0,0,0.55)", color: "white" }}
        >
          {item.type}
        </div>

        {/* Hover streaming CTA */}
        {hovered && (
          <button
            className="absolute bottom-2 right-2 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-white text-xs font-bold shadow-lg transition-transform hover:scale-105 active:scale-95"
            style={{ backgroundColor: "#0073e6" }}
            onClick={(e) => {
              e.stopPropagation();
              onStreamingClick?.() ?? onClick?.();
            }}
            aria-label={`Ver ${item.title} agora`}
            tabIndex={-1}
          >
            <Play size={10} fill="white" aria-hidden="true" />
            Ver agora
          </button>
        )}
      </div>
      <div className="p-3">
        <h3
          className="text-sm font-semibold mb-1.5 leading-tight line-clamp-2 transition-colors"
          style={{ color: hovered ? "#0073e6" : "#1a1a2e" }}
        >
          {item.title}
        </h3>
        <div className="flex items-center gap-1 mb-2" aria-label={`Avaliação: ${item.rating.toFixed(1)} de 5.0`}>
          <Star size={13} fill="#f5a623" color="#f5a623" aria-hidden="true" />
          <span className="text-xs font-bold" style={{ color: "#1a1a2e" }}>{item.rating.toFixed(1)}</span>
          <span className="text-xs" style={{ color: "#6b6b8a" }}>/5.0</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {item.badges.map((badge) => (
            <span
              key={badge}
              className="text-xs font-bold px-1.5 py-0.5 rounded-full"
              style={{ backgroundColor: badgeConfig[badge].bg, color: badgeConfig[badge].text }}
              aria-label={badgeConfig[badge].label}
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export const ALL_CONTENT: ContentItem[] = [
  { id: 1,  title: "Planeta dos Macacos: O Reinado", type: "Filmes", rating: 4.8, badges: ["AD","Leg","Libras"],         perfect: true,  posterColor: posterColors[0], poster: `${B}/gKkl37BQuKTanygYQG1pyYgLVgf.jpg` },
  { id: 2,  title: "Duna: Parte Dois",               type: "Filmes", rating: 4.9, badges: ["AD","Leg"],                  perfect: false, posterColor: posterColors[1], poster: `${B}/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg` },
  { id: 3,  title: "The Last of Us",                 type: "Séries", rating: 4.7, badges: ["Leg","Libras","Adapt"],      perfect: true,  posterColor: posterColors[2], poster: `${B}/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg` },
  { id: 4,  title: "Oppenheimer",                    type: "Filmes", rating: 4.8, badges: ["AD","Leg","Libras"],         perfect: true,  posterColor: posterColors[3], poster: `${B}/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg` },
  { id: 5,  title: "Fallout",                        type: "Séries", rating: 4.6, badges: ["Leg","AD"],                  perfect: false, posterColor: posterColors[4], poster: `${B}/AnsSKR9XBrsAXGCmwJUPfEzTkHq.jpg` },
  { id: 6,  title: "The Bear",                       type: "Séries", rating: 4.9, badges: ["Leg","Libras"],              perfect: false, posterColor: posterColors[5], poster: `${B}/sHFlbKS3WLqMnp9t2ghADIJFnuQ.jpg` },
  { id: 7,  title: "Beetlejuice Beetlejuice",        type: "Filmes", rating: 4.3, badges: ["AD","Leg"],                  perfect: false, posterColor: posterColors[6], poster: `${B}/kKgQzkUCnQmeTPkyIwHly2t6ZFI.jpg` },
  { id: 8,  title: "Twisters",                       type: "Filmes", rating: 4.2, badges: ["Leg"],                       perfect: false, posterColor: posterColors[7], poster: `${B}/pAskD3bZ8SjDeHt6OFxCMj4SKQG.jpg` },
  { id: 9,  title: "The Acolyte",                    type: "Séries", rating: 4.1, badges: ["Leg","Libras","AD"],         perfect: true,  posterColor: posterColors[0], poster: `${B}/nSRdr4Ckp5c3RmCHNjxSLDAK4fb.jpg` },
  { id: 10, title: "Alien: Romulus",                 type: "Filmes", rating: 4.5, badges: ["AD","Leg","Libras","Adapt"], perfect: true,  posterColor: posterColors[1], poster: `${B}/b33nnKl1GSFbao4l3fZDDqsMx0F.jpg` },
  { id: 11, title: "The Legend of Zelda: Echoes",    type: "Jogos",  rating: 4.9, badges: ["Adapt","Leg"],               perfect: true,  posterColor: posterColors[2], poster: `${B}/jx5p0aHlbPXqe3AH9G15NvmWaqQ.jpg` },
  { id: 12, title: "Astro Bot",                      type: "Jogos",  rating: 4.8, badges: ["Adapt","AD","Leg"],          perfect: true,  posterColor: posterColors[3], poster: `${B}/xgbeBCMvZqCbhTJFsTJcGsMl7o1.jpg` },
  { id: 13, title: "Black Myth: Wukong",             type: "Jogos",  rating: 4.7, badges: ["Leg","Adapt"],               perfect: false, posterColor: posterColors[4], poster: `${B}/dgfDMwBMJlCMQFpiBLbqcCHiKfW.jpg` },
  { id: 14, title: "Shogun",                         type: "Séries", rating: 4.8, badges: ["Leg","Libras"],              perfect: false, posterColor: posterColors[5], poster: `${B}/7O4iVfOMQmdCSxhOg1WnzM1B5B0.jpg` },
  { id: 15, title: "Deadpool & Wolverine",           type: "Filmes", rating: 4.6, badges: ["AD","Leg","Libras"],         perfect: true,  posterColor: posterColors[6], poster: `${B}/8npISHPPbMHAeJWJbROLGJRCDot.jpg` },
  { id: 16, title: "Inside Out 2",                   type: "Filmes", rating: 4.7, badges: ["AD","Leg","Libras","Adapt"], perfect: true,  posterColor: posterColors[7], poster: `${B}/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg` },
  { id: 17, title: "Hades II",                       type: "Jogos",  rating: 4.8, badges: ["Adapt","Leg"],               perfect: false, posterColor: posterColors[0], poster: `${B}/6pPuHNrGbSDM1UxyOwIi2ccSUGl.jpg` },
  { id: 18, title: "Elden Ring: Shadow of Erdtree",  type: "Jogos",  rating: 4.6, badges: ["Leg"],                       perfect: false, posterColor: posterColors[1], poster: `${B}/fPIq7wbwx2TqXB3jT3jOkGsqJAk.jpg` },
  { id: 19, title: "The Penguin",                    type: "Séries", rating: 4.7, badges: ["AD","Leg","Libras"],         perfect: true,  posterColor: posterColors[2], poster: `${B}/ikuCpFMBpqFVCmSWqEFi1xHtfej.jpg` },
  { id: 20, title: "Agatha All Along",               type: "Séries", rating: 4.4, badges: ["Leg","Libras"],              perfect: false, posterColor: posterColors[3], poster: `${B}/6GDuHQAl0LQM2CJUPQyJPEKWygy.jpg` },
  { id: 21, title: "Longlegs",                       type: "Filmes", rating: 4.0, badges: ["AD","Leg"],                  perfect: false, posterColor: posterColors[4], poster: `${B}/qkQ8pOJOYEFsBQ3LKoRp44YMWpI.jpg` },
  { id: 22, title: "Wicked",                         type: "Filmes", rating: 4.8, badges: ["AD","Leg","Libras","Adapt"], perfect: true,  posterColor: posterColors[5], poster: `${B}/xbKFv4KF3sVYuWKllLlwWDmuZP7.jpg` },
  { id: 23, title: "Hi-Fi Rush",                     type: "Jogos",  rating: 4.9, badges: ["Adapt","AD","Leg","Libras"], perfect: true,  posterColor: posterColors[6], poster: `${B}/dFCNdAFGaLSzuJb9XqFkdHLJmVW.jpg` },
  { id: 24, title: "Concord",                        type: "Jogos",  rating: 3.8, badges: ["Leg","Adapt"],               perfect: false, posterColor: posterColors[7], poster: `${B}/rSnMKBOWCJhvAJYgiODMTUCmIEr.jpg` },
];
