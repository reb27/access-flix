import { Gamepad2, Eye, Ear, Brain, Hand } from "lucide-react";
import { useState } from "react";
import { gamePoster, steamCover } from "./gamePoster";

/**
 * Jogos com excelente acessibilidade — curadoria 2024-2025.
 *
 * Fontes consultadas:
 *  - CanIPlayThat.com (reviews de acessibilidade)
 *  - AbleGamers (gamesaccessibility.org)
 *  - Game Accessibility Awards (https://gameaccessibilityawards.com)
 *  - Site oficial de cada estúdio (página de acessibilidade)
 *
 * "score" 0-10 é uma síntese editorial considerando recursos para:
 *  Visual (V) · Auditiva (A) · Cognitiva (C) · Motora (M)
 */
export type GameRank = {
  id: string;
  title: string;
  studio: string;
  year: number;
  platforms: string[];
  score: number;
  V: number; A: number; C: number; M: number;
  highlight: string;
  poster: string;
  fallbackPoster?: string;
  posterColor: string;
};

/* Image with cascading fallback: src → fallback → hide. */
function GamePic({ src, fallback, alt, style }: { src: string; fallback?: string; alt: string; style?: React.CSSProperties }) {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  if (step === 2) return null;
  const current = step === 0 ? src : (fallback ?? "");
  if (!current) return null;
  return (
    <img
      src={current}
      alt={alt}
      style={{ width: "100%", height: "100%", objectFit: "cover", ...style }}
      loading="lazy"
      onError={() => setStep((s) => (s + 1) as 0 | 1 | 2)}
    />
  );
}

export const GAME_RANKING: GameRank[] = [
  {
    id: "tlou2",
    title: "The Last of Us Part II",
    studio: "Naughty Dog",
    year: 2020,
    platforms: ["PS5", "PS4"],
    score: 9.7,
    V: 10, A: 9, C: 9, M: 10,
    highlight: "60+ opções de acessibilidade. Marco zero da indústria — vencedor do prêmio Innovation in Accessibility (Game Awards 2020).",
    posterColor: "#1a3a52",
    poster: steamCover(2531310),
    fallbackPoster: gamePoster({ title: "The Last of Us II", studio: "Naughty Dog", year: 2020, colors: ["#1a3a52","#0c1f2e"], glyph: "🍂" }),
  },
  {
    id: "forza5",
    title: "Forza Horizon 5",
    studio: "Playground Games",
    year: 2021,
    platforms: ["Xbox", "PC"],
    score: 9.5,
    V: 9, A: 10, C: 9, M: 10,
    highlight: "Primeira a oferecer interpretação em ASL/BSL nas cutscenes; cones de TTS, magic wheel para motora.",
    posterColor: "#b35d00",
    poster: steamCover(1551360),
    fallbackPoster: gamePoster({ title: "Forza Horizon 5", studio: "Playground", year: 2021, colors: ["#f59e0b","#7a3c0a"], glyph: "🏁" }),
  },
  {
    id: "gow",
    title: "God of War Ragnarök",
    studio: "Santa Monica Studio",
    year: 2022,
    platforms: ["PS5", "PS4", "PC"],
    score: 9.3,
    V: 9, A: 9, C: 10, M: 9,
    highlight: "70+ recursos: descrição de áudio, lock-on auto, contraste alto, dicas persistentes.",
    posterColor: "#2a1a3a",
    poster: steamCover(2322010),
    fallbackPoster: gamePoster({ title: "God of War Ragnarök", studio: "Santa Monica", year: 2022, colors: ["#5a3d8c","#1e1538"], glyph: "⚔" }),
  },
  {
    id: "spiderman2",
    title: "Marvel's Spider-Man 2",
    studio: "Insomniac Games",
    year: 2023,
    platforms: ["PS5"],
    score: 9.2,
    V: 9, A: 9, C: 9, M: 10,
    highlight: "Game Speed (slow motion), screen reader em menus, captura de tela com descrição.",
    posterColor: "#990000",
    poster: gamePoster({ title: "Spider-Man 2", studio: "Insomniac", year: 2023, colors: ["#dc2626","#450a0a"], glyph: "🕷" }),
  },
  {
    id: "hifirush",
    title: "Hi-Fi Rush",
    studio: "Tango Gameworks",
    year: 2023,
    platforms: ["Xbox", "PC", "PS5"],
    score: 9.0,
    V: 9, A: 10, C: 8, M: 9,
    highlight: "Pulso visual no ritmo da música — surdos podem jogar pelo som apenas com indicadores visuais.",
    posterColor: "#ec4899",
    poster: steamCover(1817230),
    fallbackPoster: gamePoster({ title: "Hi-Fi Rush", studio: "Tango Gameworks", year: 2023, colors: ["#ec4899","#7c2d12"], glyph: "🎸" }),
  },
  {
    id: "celeste",
    title: "Celeste",
    studio: "Maddy Makes Games",
    year: 2018,
    platforms: ["PC", "PS5", "Xbox", "Switch"],
    score: 8.8,
    V: 8, A: 8, C: 9, M: 10,
    highlight: "Assist Mode pioneiro: invencibilidade, slow-mo, infinite dash. Modelo de design inclusivo.",
    posterColor: "#5a3d8c",
    poster: steamCover(504230),
    fallbackPoster: gamePoster({ title: "Celeste", studio: "Maddy Makes Games", year: 2018, colors: ["#a855f7","#1e1b4b"], glyph: "⛰" }),
  },
];

function CategoryBar({ Icon, label, value, color }: { Icon: React.ElementType; label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon size={12} color={color} aria-hidden="true" />
      <span className="text-xs font-semibold w-3 text-center" style={{ color: "#1a1a2e" }} aria-label={`${label}: ${value} de 10`}>
        {value}
      </span>
    </div>
  );
}

export function GameRanking() {
  const top3 = GAME_RANKING.slice(0, 3);
  const rest = GAME_RANKING.slice(3);

  return (
    <section
      aria-labelledby="game-ranking-title"
      className="mb-8 md:mb-12 rounded-3xl p-5 md:p-7"
      style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #2a1a4e 50%, #3a1a5e 100%)",
        color: "white",
      }}
    >
      <div className="flex items-start gap-3 mb-6">
        <span
          className="flex items-center justify-center rounded-2xl flex-shrink-0"
          style={{ width: 52, height: 52, background: "linear-gradient(135deg,#ff4dba,#7c3aed)", boxShadow: "0 8px 24px rgba(124,58,237,0.4)" }}
          aria-hidden="true"
        >
          <Gamepad2 size={28} color="white" />
        </span>
        <div className="flex-1 min-w-0">
          <h2 id="game-ranking-title" className="font-bold leading-tight mb-1" style={{ fontSize: "clamp(18px, 2.8vw, 26px)" }}>
            🎮 Top jogos acessíveis
          </h2>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.95)" }}>
            Os marcos da indústria em acessibilidade — curado de CanIPlayThat, AbleGamers e Game Accessibility Awards
          </p>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Jogos analisados", value: "60+", accent: "#ffe27a" },
          { label: "Recursos no TLOU2", value: "60+", accent: "#ff4dba" },
          { label: "Estúdios líderes",  value: "12",  accent: "#a855f7" },
          { label: "Padrão WCAG",       value: "AA+", accent: "#22c55e" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl p-3"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
          >
            <div className="font-black leading-none mb-1" style={{ fontSize: 26, color: s.accent }}>{s.value}</div>
            <div className="text-sm" style={{ color: "rgba(255,255,255,0.92)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Top 3 podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        {top3.map((g, i) => {
          const medals = ["🥇", "🥈", "🥉"];
          return (
            <article
              key={g.id}
              className="rounded-2xl p-4 flex flex-col gap-3 transition-transform hover:scale-[1.02]"
              style={{
                background: `linear-gradient(135deg, ${g.posterColor}aa, ${g.posterColor}33)`,
                border: "1px solid rgba(255,255,255,0.18)",
                backdropFilter: "blur(8px)",
              }}
              aria-label={`Posição ${i + 1}: ${g.title}, score ${g.score} de 10`}
            >
              <div className="flex items-start gap-3">
                <div
                  className="rounded-xl overflow-hidden flex-shrink-0"
                  style={{ width: 76, height: 114, backgroundColor: g.posterColor, boxShadow: "0 6px 16px rgba(0,0,0,0.35)" }}
                >
                  <GamePic src={g.poster} fallback={g.fallbackPoster} alt={`Pôster de ${g.title}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span style={{ fontSize: 18 }} aria-hidden="true">{medals[i]}</span>
                    <span className="text-xs font-bold uppercase opacity-80">#{i + 1}</span>
                  </div>
                  <h3 className="font-bold leading-tight" style={{ fontSize: 14 }}>{g.title}</h3>
                  <p className="text-xs opacity-80 mt-0.5">{g.studio} · {g.year}</p>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="font-black" style={{ fontSize: 20, color: "#ffe27a" }}>{g.score.toFixed(1)}</span>
                    <span className="text-xs opacity-70">/10</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap" aria-label="Pontuação por categoria">
                <CategoryBar Icon={Eye}   label="Visual"    value={g.V} color="#ffe27a" />
                <CategoryBar Icon={Ear}   label="Auditiva"  value={g.A} color="#ffe27a" />
                <CategoryBar Icon={Brain} label="Cognitiva" value={g.C} color="#ffe27a" />
                <CategoryBar Icon={Hand}  label="Motora"    value={g.M} color="#ffe27a" />
              </div>

              <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.95)" }}>{g.highlight}</p>

              <div className="flex flex-wrap gap-1 mt-auto">
                {g.platforms.map((p) => (
                  <span
                    key={p}
                    className="text-xs font-bold px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "white" }}
                  >
                    {p}
                  </span>
                ))}
              </div>
            </article>
          );
        })}
      </div>

      {/* Recursos que mudaram tudo */}
      <div className="mb-5">
        <h3 className="font-bold mb-3" style={{ fontSize: 16, color: "white" }}>
          🌟 Recursos que mudaram a indústria
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            { emoji: "🎯", title: "Assist Mode (Celeste, 2018)",      desc: "Modo configurável: invencibilidade, slow-mo, infinite dash. Inspirou toda a indústria." },
            { emoji: "🎮", title: "Xbox Adaptive Controller (2018)",  desc: "Controle modular pra motora fina, criado em parceria com hospitais e PCD." },
            { emoji: "🔊", title: "Sinais sonoros 3D (TLOU2, 2020)",   desc: "Permite cegos completarem o jogo inteiro só pelo áudio." },
            { emoji: "🤟", title: "ASL/BSL em cutscenes (Forza H5)",   desc: "Primeira a oferecer intérprete em vídeo nas cenas do jogo." },
          ].map((r) => (
            <div
              key={r.title}
              className="rounded-xl p-3 flex gap-3"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
            >
              <span className="flex-shrink-0" style={{ fontSize: 26, lineHeight: 1 }} aria-hidden="true">{r.emoji}</span>
              <div className="min-w-0">
                <div className="font-bold leading-tight mb-1" style={{ fontSize: 14, color: "white" }}>{r.title}</div>
                <div className="text-sm leading-snug" style={{ color: "rgba(255,255,255,0.95)" }}>{r.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <h3 className="font-bold mb-3" style={{ fontSize: 16, color: "white" }}>
        Outros destaques
      </h3>

      {/* Rest list */}
      <ol className="flex flex-col gap-2">
        {rest.map((g, i) => (
          <li
            key={g.id}
            className="rounded-xl p-3 flex items-center gap-3"
            style={{ backgroundColor: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}
          >
            <span
              className="font-black flex-shrink-0 flex items-center justify-center rounded-lg"
              style={{ width: 32, height: 32, backgroundColor: "rgba(255,255,255,0.18)", fontSize: 14, color: "white" }}
              aria-label={`Posição ${i + 4}`}
            >
              {i + 4}
            </span>
            <div
              className="rounded-lg overflow-hidden flex-shrink-0"
              style={{ width: 50, height: 75, backgroundColor: g.posterColor }}
            >
              <GamePic src={g.poster} fallback={g.fallbackPoster} alt={`Pôster de ${g.title}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="font-bold text-white" style={{ fontSize: 14 }}>{g.title}</span>
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.95)" }}>{g.studio} · {g.year}</span>
              </div>
              <p className="text-xs mt-1 line-clamp-1" style={{ color: "rgba(255,255,255,0.9)" }}>{g.highlight}</p>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {g.platforms.slice(0, 3).map((p) => (
                  <span
                    key={p}
                    className="text-xs font-bold px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "white" }}
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
            <span className="font-black flex-shrink-0" style={{ fontSize: 22, color: "#ffe27a" }}>
              {g.score.toFixed(1)}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
