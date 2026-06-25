import { ExternalLink, Award } from "lucide-react";

/* Stylized brand mark — gradient + bold mono initial. Not a real logo (copyright-safe). */
function BrandMark({ name, color, size }: { name: string; color: string; size: number }) {
  const initial = name === "Disney+" ? "D+" : name === "Prime Video" ? "P" : name === "Apple TV+" ? "TV+" : name.slice(0, 1);
  return (
    <div
      className="flex items-center justify-center rounded-2xl flex-shrink-0 text-white font-black relative overflow-hidden"
      style={{
        width: size, height: size,
        background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`,
        boxShadow: `0 4px 14px ${color}55, inset 0 1px 0 rgba(255,255,255,0.25)`,
      }}
      aria-hidden="true"
    >
      {/* Subtle play triangle behind initial */}
      <svg
        width={size * 0.7} height={size * 0.7} viewBox="0 0 32 32" fill="none"
        style={{ position: "absolute", opacity: 0.18 }}
      >
        <path d="M10 6L10 26L26 16Z" fill="white" />
      </svg>
      <span style={{ fontSize: size * 0.38, lineHeight: 1, letterSpacing: "-0.04em", position: "relative", zIndex: 1, textShadow: "0 1px 2px rgba(0,0,0,0.25)" }}>
        {initial}
      </span>
    </div>
  );
}

/**
 * Streaming platform accessibility data (Brasil — curado em 2024-2025).
 *
 * Fontes consultadas:
 *  - Help/Suporte oficial das plataformas (Netflix, Prime Video, Disney+, Max, Globoplay, Apple TV+).
 *  - Lei Brasileira de Inclusão (LBI nº 13.146/2015) — exige AD/Leg em obras audiovisuais.
 *  - Reportagens: Folha (Mar/2024 — Prime Video adicionou janela de Libras), Globoplay (Out/2023).
 *
 * "score" é uma síntese editorial considerando:
 *  - Cobertura de Audiodescrição (AD)
 *  - Legendas PT-BR descritivas (CC)
 *  - Janela de Libras (LSB)
 *  - Controles na interface (tamanho de fonte, contraste)
 *  - Documentação/suporte de acessibilidade
 */
export type PlatformRank = {
  id: string;
  name: string;
  color: string;
  score: number;            // 0–10
  ad: "amplo" | "parcial" | "limitado" | "não";
  leg: "amplo" | "parcial" | "limitado" | "não";
  libras: "amplo" | "parcial" | "limitado" | "não";
  highlight: string;
  url: string;
};

export const PLATFORM_RANKING: PlatformRank[] = [
  {
    id: "prime", name: "Prime Video", color: "#00A8E0", score: 9.0,
    ad: "amplo", leg: "amplo", libras: "parcial",
    highlight: "Janela de Libras em produções originais nacionais desde 2024",
    url: "https://www.primevideo.com",
  },
  {
    id: "netflix", name: "Netflix", color: "#E50914", score: 8.5,
    ad: "amplo", leg: "amplo", libras: "limitado",
    highlight: "Maior catálogo com AD em PT-BR; controles de legendas customizáveis",
    url: "https://www.netflix.com",
  },
  {
    id: "appletv", name: "Apple TV+", color: "#000000", score: 8.0,
    ad: "amplo", leg: "amplo", libras: "não",
    highlight: "Originais com AD em múltiplos idiomas; SDH em PT-BR",
    url: "https://tv.apple.com",
  },
  {
    id: "disney", name: "Disney+", color: "#113CCF", score: 7.5,
    ad: "amplo", leg: "amplo", libras: "limitado",
    highlight: "AD em quase todas as produções Marvel, Star Wars e Pixar",
    url: "https://www.disneyplus.com",
  },
  {
    id: "globoplay", name: "Globoplay", color: "#E8303B", score: 7.0,
    ad: "parcial", leg: "amplo", libras: "amplo",
    highlight: "Líder em Libras (LSB) — novelas e jornais com janela permanente",
    url: "https://globoplay.globo.com",
  },
  {
    id: "max", name: "Max", color: "#6B0BBA", score: 6.5,
    ad: "parcial", leg: "amplo", libras: "limitado",
    highlight: "AD crescente em séries HBO; legendas SDH bem feitas",
    url: "https://www.max.com/br",
  },
];

const coverageStyle: Record<PlatformRank["ad"], { bg: string; text: string; label: string }> = {
  amplo:    { bg: "#d4edda", text: "#1a4d1a", label: "Amplo"    },
  parcial:  { bg: "#fff3cd", text: "#7c4a03", label: "Parcial"  },
  limitado: { bg: "#fde2e2", text: "#7a1a1a", label: "Limitado" },
  "não":    { bg: "#eceff3", text: "#4a4a6a", label: "Não"      },
};

function CoverageBadge({ kind, label }: { kind: PlatformRank["ad"]; label: string }) {
  const s = coverageStyle[kind];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold"
      style={{ backgroundColor: s.bg, color: s.text }}
      aria-label={`${label}: ${s.label}`}
    >
      <span className="opacity-70 mr-1" aria-hidden="true">{label}</span>
      {s.label}
    </span>
  );
}

export function PlatformRanking() {
  const top = PLATFORM_RANKING[0];

  return (
    <section
      aria-labelledby="platform-ranking-title"
      className="mb-8 md:mb-12 rounded-3xl p-5 md:p-7"
      style={{
        background: "linear-gradient(135deg, #fff7e0 0%, #ffffff 60%, #f0f9ff 100%)",
        border: "1px solid rgba(0,0,0,0.05)",
      }}
    >
      <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <span
            className="flex items-center justify-center rounded-2xl flex-shrink-0"
            style={{ width: 44, height: 44, background: "linear-gradient(135deg,#f5a623,#b35d00)", color: "white" }}
            aria-hidden="true"
          >
            <Award size={24} />
          </span>
          <div className="min-w-0">
            <h2 id="platform-ranking-title" className="font-bold leading-tight" style={{ fontSize: "clamp(17px, 2.4vw, 22px)", color: "#1a1a2e" }}>
              🏆 Ranking de plataformas
            </h2>
            <p className="text-xs md:text-sm" style={{ color: "#4a4a6a" }}>
              Acessibilidade no streaming brasileiro — atualizado em 2025
            </p>
          </div>
        </div>
      </div>

      {/* Champion card */}
      <div
        className="rounded-2xl p-5 mb-4 flex flex-col md:flex-row md:items-center gap-4"
        style={{
          background: `linear-gradient(135deg, ${top.color}15, ${top.color}05)`,
          border: `2px solid ${top.color}`,
        }}
      >
        <BrandMark name={top.name} color={top.color} size={72} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: "#2f5a00" }}>
              🥇 #1
            </span>
            <h3 className="font-bold" style={{ color: "#1a1a2e", fontSize: 18 }}>{top.name}</h3>
            <span className="text-lg font-black" style={{ color: top.color }}>{top.score.toFixed(1)}</span>
          </div>
          <p className="text-sm" style={{ color: "#4a4a6a" }}>{top.highlight}</p>
        </div>
        <a
          href={top.url}
          target="_blank"
          rel="noopener noreferrer"
          className="af-focus inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-white text-sm font-bold flex-shrink-0"
          style={{ backgroundColor: top.color, minHeight: 44 }}
          aria-label={`Abrir ${top.name} em nova aba`}
        >
          Visitar <ExternalLink size={14} aria-hidden="true" />
        </a>
      </div>

      {/* Rest of ranking */}
      <ol className="flex flex-col gap-2" aria-label="Demais plataformas">
        {PLATFORM_RANKING.slice(1).map((p, i) => (
          <li
            key={p.id}
            className="rounded-2xl p-4 flex items-center gap-3 bg-white"
            style={{ border: "1px solid #e8ecf0" }}
          >
            <span
              className="font-black text-base flex-shrink-0 flex items-center justify-center rounded-xl"
              style={{ width: 36, height: 36, color: "#4a4a6a", backgroundColor: "#f5f7fa" }}
              aria-label={`Posição ${i + 2}`}
            >
              {i + 2}
            </span>
            <BrandMark name={p.name} color={p.color} size={44} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm" style={{ color: "#1a1a2e" }}>{p.name}</span>
                <span className="text-sm font-bold" style={{ color: p.color }}>{p.score.toFixed(1)}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-1">
                <CoverageBadge kind={p.ad}     label="AD" />
                <CoverageBadge kind={p.leg}    label="Leg" />
                <CoverageBadge kind={p.libras} label="Libras" />
              </div>
              <p className="text-xs mt-1.5 hidden sm:block" style={{ color: "#4a4a6a" }}>{p.highlight}</p>
            </div>
            <a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="af-focus af-icon-btn flex-shrink-0"
              aria-label={`Abrir ${p.name} em nova aba`}
            >
              <ExternalLink size={16} aria-hidden="true" />
            </a>
          </li>
        ))}
      </ol>

      <p className="text-xs mt-4" style={{ color: "#4a4a6a" }}>
        💡 Score editorial baseado em cobertura de AD, legendas PT-BR/SDH e janela de Libras nas plataformas no Brasil.
      </p>
    </section>
  );
}
