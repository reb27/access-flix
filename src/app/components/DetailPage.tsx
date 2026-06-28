import { useEffect, useState } from "react";
import {
  Eye, Ear, Brain, Star, ChevronLeft,
  Volume2, Captions, Hand, Monitor, Keyboard, Mic, Zap, BookOpen,
  Bookmark, ThumbsUp, Share2, Send, CheckSquare, Square, Calendar, Clock, Film, Play,
} from "lucide-react";
import { StreamingModal } from "./StreamingModal";
import { ContentCard, ALL_CONTENT, platformConfig, type PlatformId } from "./ContentCard";

/* ── Animated score bar ── */
function ScoreBar({ icon, label, score, barColor, delay }: {
  icon: React.ReactNode; label: string; score: number; barColor: string; delay: number;
}) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const id = setTimeout(() => setWidth((score / 10) * 100), delay);
    return () => clearTimeout(id);
  }, [score, delay]);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium" style={{ color: "rgba(255,255,255,0.85)" }}>
          <span aria-hidden="true">{icon}</span>{label}
        </div>
        <span className="text-sm font-bold text-white">{score.toFixed(1)}/10</span>
      </div>
      <div
        className="rounded-full overflow-hidden"
        style={{ height: 8, backgroundColor: "rgba(255,255,255,0.18)" }}
        role="progressbar" aria-valuenow={score} aria-valuemin={0} aria-valuemax={10}
        aria-label={`${label}: ${score} de 10`}
      >
        <div
          className="h-full rounded-full"
          style={{ backgroundColor: barColor, width: `${width}%`, transition: "width 0.85s cubic-bezier(0.4,0,0.2,1)" }}
        />
      </div>
    </div>
  );
}

/* ── Accessibility features ── */
const features = [
  { icon: <Volume2 size={13} />,  label: "Audiodescrição",            color: "#5ba300" },
  { icon: <Captions size={13} />, label: "Legendas PT-BR",            color: "#0073e6" },
  { icon: <Captions size={13} />, label: "Legendas Descritivas",      color: "#1d6fa8" },
  { icon: <Hand size={13} />,     label: "Intérprete de Libras",      color: "#e6308a" },
  { icon: <Monitor size={13} />,  label: "Alto Contraste",            color: "#7c3aed" },
  { icon: <Keyboard size={13} />, label: "Navegação por Teclado",     color: "#0891b2" },
  { icon: <Mic size={13} />,      label: "Comandos por Voz",          color: "#d97706" },
  { icon: <Zap size={13} />,      label: "Sem Gatilhos de Epilepsia", color: "#dc2626" },
  { icon: <BookOpen size={13} />, label: "Linguagem Simplificada",    color: "#059669" },
];

/* ── Review star selector ── */
function StarSelector({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1" aria-label="Selecione sua nota">
      {[1,2,3,4,5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          aria-label={`${n} estrela${n > 1 ? "s" : ""}`}
          className="af-focus rounded p-1"
        >
          <Star
            size={26}
            fill={(hover || value) >= n ? "#b35d00" : "none"}
            color={(hover || value) >= n ? "#b35d00" : "#4a4a6a"}
          />
        </button>
      ))}
    </div>
  );
}

/* ── Review card ── */
interface ReviewItem {
  id: number;
  name: string;
  anonymous: boolean;
  disability: string;
  disabilityColor: string;
  rating: number;
  date: string;
  text: string;
  helpful: number;
}

const REVIEWS: ReviewItem[] = [
  {
    id: 1, name: "Maria S.", anonymous: false, disability: "Visual", disabilityColor: "#e6308a",
    rating: 5, date: "Mar 2024",
    text: "A audiodescrição é excelente! Consegui acompanhar cada cena com clareza. Altamente recomendo para quem tem deficiência visual.",
    helpful: 24,
  },
  {
    id: 2, name: "Usuário anônimo", anonymous: true, disability: "Auditiva", disabilityColor: "#0073e6",
    rating: 4, date: "Fev 2024",
    text: "As legendas estão muito bem sincronizadas e descritivas. Faltou a língua de sinais em alguns momentos, mas no geral é ótimo.",
    helpful: 18,
  },
  {
    id: 3, name: "Carlos M.", anonymous: false, disability: "Cognitiva", disabilityColor: "#5ba300",
    rating: 5, date: "Jan 2024",
    text: "A linguagem simplificada nas legendas ajudou muito na compreensão. Seria incrível ter mais conteúdo assim disponível.",
    helpful: 11,
  },
];

function ReviewCard({ review }: { review: ReviewItem }) {
  const [helpful, setHelpful] = useState(review.helpful);
  const [voted, setVoted] = useState(false);

  return (
    <article
      className="bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-3"
      aria-label={`Avaliação de ${review.anonymous ? "usuário anônimo" : review.name}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold"
            style={{ width: 40, height: 40, backgroundColor: review.disabilityColor, fontSize: 14 }}
            aria-hidden="true"
          >
            {review.anonymous ? "?" : review.name.charAt(0)}
          </div>
          <div>
            <div className="text-sm font-semibold" style={{ color: "#1a1a2e" }}>{review.name}</div>
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
              style={{ backgroundColor: review.disabilityColor }}
            >
              {review.disability}
            </span>
          </div>
        </div>
        <span className="text-xs flex-shrink-0" style={{ color: "#4a4a6a" }}>{review.date}</span>
      </div>

      <div className="flex gap-0.5" aria-label={`Nota: ${review.rating} de 5`}>
        {[1,2,3,4,5].map((n) => (
          <Star key={n} size={14} fill={n <= review.rating ? "#b35d00" : "none"} color={n <= review.rating ? "#b35d00" : "#d0d5e0"} aria-hidden="true" />
        ))}
      </div>

      <p className="text-sm leading-relaxed" style={{ color: "#4a4a6a" }}>{review.text}</p>

      <div className="flex items-center gap-3 pt-1" style={{ borderTop: "1px solid #f0f2f5" }}>
        <button
          onClick={() => { if (!voted) { setHelpful(h => h + 1); setVoted(true); } }}
          className="flex items-center gap-1.5 text-xs transition-colors focus:outline-none focus:ring-2 rounded px-1"
          style={{ color: voted ? "#0073e6" : "#4a4a6a", ["--tw-ring-color" as string]: "#0073e6" }}
          aria-label={`Marcar como útil. ${helpful} pessoas acharam útil.`}
          aria-pressed={voted}
        >
          <ThumbsUp size={14} aria-hidden="true" />
          Útil ({helpful})
        </button>
        <button
          className="flex items-center gap-1.5 text-xs transition-colors focus:outline-none focus:ring-2 rounded px-1"
          style={{ color: "#4a4a6a", ["--tw-ring-color" as string]: "#0073e6" }}
          aria-label="Compartilhar avaliação"
        >
          <Share2 size={14} aria-hidden="true" />
          Compartilhar
        </button>
      </div>
    </article>
  );
}

/* ── Inline review form ── */
function ReviewForm({ onSubmit, onRequireLogin }: { onSubmit: (r: ReviewItem) => void; onRequireLogin: () => void }) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [disabilities, setDisabilities] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const toggleDisability = (d: string) =>
    setDisabilities((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]);

  const handleSubmit = () => {
    if (rating === 0) return;
    /* Build the new review and prepend it to the list */
    const firstDisability = disabilities[0] ?? "visual";
    const disabilityLabel = firstDisability.charAt(0).toUpperCase() + firstDisability.slice(1);
    const disabilityColor =
      firstDisability === "visual" ? "#c01a6f"
        : firstDisability === "auditiva" ? "#005bb5"
        : firstDisability === "cognitiva" ? "#3d7500"
        : "#a35e00";

    const newReview: ReviewItem = {
      id: Date.now(),
      name: "Você",
      anonymous: false,
      disability: disabilityLabel,
      disabilityColor,
      rating,
      date: new Date().toLocaleDateString("pt-BR", { month: "short", year: "numeric" }),
      text: text.trim() || "Avaliação rápida — sem comentário escrito.",
      helpful: 0,
    };
    onSubmit(newReview);
    setSubmitted(true);
    onRequireLogin();
    /* Reset form so user can submit another */
    setTimeout(() => {
      setRating(0);
      setText("");
      setDisabilities([]);
      setSubmitted(false);
    }, 2200);
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl p-6 text-center" role="status" aria-live="polite">
        <div className="text-3xl mb-2" aria-hidden="true">🎉</div>
        <p className="font-semibold" style={{ color: "#1a1a2e", fontSize: 16 }}>Avaliação publicada!</p>
        <p className="text-sm mt-1" style={{ color: "#4a4a6a" }}>Obrigado por contribuir com a comunidade PCD.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-4">
      <h3 className="font-semibold" style={{ color: "#1a1a2e", fontSize: 16 }}>Escreva sua avaliação</h3>

      <div>
        <label className="block text-sm mb-2" style={{ color: "#4a4a6a" }}>Sua nota</label>
        <StarSelector value={rating} onChange={setRating} />
      </div>

      <div>
        <label htmlFor="review-text" className="block text-sm mb-2" style={{ color: "#4a4a6a" }}>
          Conte sua experiência com a acessibilidade deste título...
        </label>
        <textarea
          id="review-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          placeholder="Como foram as legendas, audiodescrição, Libras...?"
          className="w-full rounded-xl border px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2"
          style={{
            borderColor: "#d0d5e0",
            color: "#1a1a2e",
            ["--tw-ring-color" as string]: "#0073e6",
          }}
        />
      </div>

      <div>
        <p className="text-sm mb-2" style={{ color: "#4a4a6a" }}>Minha deficiência:</p>
        <div className="flex flex-wrap gap-2">
          {[
            { id: "visual", label: "Visual", color: "#e6308a" },
            { id: "auditiva", label: "Auditiva", color: "#0073e6" },
            { id: "cognitiva", label: "Cognitiva", color: "#5ba300" },
            { id: "motora", label: "Motora", color: "#b35d00" },
          ].map((d) => {
            const checked = disabilities.includes(d.id);
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => toggleDisability(d.id)}
                aria-pressed={checked}
                className="af-focus flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all"
                style={{
                  backgroundColor: checked ? d.color : "transparent",
                  borderColor: checked ? d.color : "#d0d5e0",
                  color: checked ? "white" : "#4a4a6a",
                  minHeight: 36,
                }}
              >
                {checked ? <CheckSquare size={12} aria-hidden="true" /> : <Square size={12} aria-hidden="true" />}
                {d.label}
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={rating === 0}
        className="af-focus flex items-center justify-center gap-2 rounded-xl py-3 text-white font-semibold transition-colors"
        style={{
          backgroundColor: rating === 0 ? "#4a4a6a" : "#0073e6",
          cursor: rating === 0 ? "not-allowed" : "pointer",
          minHeight: 48,
        }}
        onMouseEnter={(e) => { if (rating > 0) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#005bb5"; }}
        onMouseLeave={(e) => { if (rating > 0) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#0073e6"; }}
        aria-disabled={rating === 0}
      >
        <Send size={16} aria-hidden="true" />
        Publicar avaliação
      </button>
    </div>
  );
}

/* ── Page ── */
interface DetailPageProps {
  /** Selected film/series/game. When null, falls back to mock data. */
  item?: import("./ContentCard").ContentItem | null;
  onBack: () => void;
  onWatch: () => void;
  /** Open another item (used by the similar titles section) */
  onSelectItem?: (item: import("./ContentCard").ContentItem) => void;
  hasProfile?: boolean;
  onShowOnboarding?: () => void;
}

const badgeFullLabel: Record<string, string> = {
  AD: "Audiodescrição",
  Leg: "Legendas",
  Libras: "Libras",
  Adapt: "Linguagem adaptada",
};
const badgeBg: Record<string, string> = {
  AD: "#1a4d1a",
  Leg: "#003366",
  Libras: "#6b0038",
  Adapt: "#3b0764",
};

export function DetailPage({ item, onBack, onWatch, onSelectItem, hasProfile = false, onShowOnboarding }: DetailPageProps) {
  const [streamingOpen, setStreamingOpen] = useState(false);
  const [reviewFilter, setReviewFilter] = useState("todos");
  const [saved, setSaved] = useState(false);
  const [reviews, setReviews] = useState<ReviewItem[]>(REVIEWS);

  /* Use the clicked item when available; fall back to mock for legacy callers. */
  const title = item?.title ?? "O Grande Filme Acessível";
  const type = item?.type ?? "Filmes";
  const rating = item?.rating ?? 4.8;
  const badges = item?.badges ?? ["AD", "Leg", "Libras"];
  const platforms: PlatformId[] = item?.platforms ?? ["prime", "hbomax", "disney"];
  const isPerfect = item?.perfect ?? true;
  const posterUrl = item?.poster;
  const posterColor = item?.posterColor ?? "#6366f1";
  const synopsis = type === "Jogos"
    ? `Uma experiência de jogo com cuidado especial em acessibilidade — confira os recursos abaixo e leia avaliações reais de jogadores PCD.`
    : `Uma história emocionante com suporte completo a recursos de acessibilidade para que todos possam desfrutar da experiência.`;

  const reviewFilters = [
    { id: "todos",    label: "Todos" },
    { id: "visual",   label: "Visual" },
    { id: "auditiva", label: "Auditiva" },
    { id: "cognitiva",label: "Cognitiva" },
  ];

  const filteredReviews = reviewFilter === "todos"
    ? reviews
    : reviews.filter((r) => r.disability.toLowerCase() === reviewFilter);

  const handleAddReview = (r: ReviewItem) => setReviews((prev) => [r, ...prev]);

  const handleRequireLogin = () => {
    if (!hasProfile) { onShowOnboarding?.(); }
  };

  return (
    <div style={{ backgroundColor: "#F5F7FA" }}>

      {/* ══ HERO ══ */}
      <section
        style={{
          background:
            "radial-gradient(ellipse at top left, #2a1a4e 0%, #1A1A2E 60%, #0f0f1e 100%)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-8 pt-6 pb-10 md:pb-14">

          {/* Back */}
          <button
            type="button"
            onClick={onBack}
            className="af-focus-light inline-flex items-center gap-1.5 mb-6 md:mb-8 text-sm rounded transition-opacity hover:opacity-100"
            style={{ color: "rgba(255,255,255,0.95)", minHeight: 44, padding: "0 4px" }}
            aria-label="Voltar para a listagem"
          >
            <ChevronLeft size={18} aria-hidden="true" />
            Voltar
          </button>

          <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
            {/* Poster */}
            <div
              className="flex-shrink-0 rounded-2xl overflow-hidden flex items-center justify-center self-center md:self-start relative"
              style={{
                width: "min(220px, 50vw)", aspectRatio: "2/3",
                background: posterUrl ? "#000" : `linear-gradient(145deg,${posterColor},${posterColor}cc)`,
                boxShadow: `0 20px 60px ${posterColor}66`,
              }}
              aria-label={`Pôster de ${title}`}
              role="img"
            >
              {posterUrl ? (
                <img
                  src={posterUrl}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                />
              ) : (
                <svg width="72" height="72" viewBox="0 0 64 64" fill="none" aria-hidden="true">
                  <path d="M10 52L26 30L36 44L46 26L58 52H10Z" fill="white" fillOpacity="0.22" />
                  <circle cx="24" cy="20" r="7" fill="white" fillOpacity="0.22" />
                </svg>
              )}
              {/* 100% badge floating */}
              {isPerfect && (
                <div
                  className="absolute top-2 right-2 flex items-center gap-1 rounded-full text-white"
                  style={{
                    backgroundColor: "#2f5a00",
                    padding: "4px 9px",
                    fontSize: 13,
                    fontWeight: 800,
                    boxShadow: "0 2px 10px rgba(47,90,0,0.5)",
                  }}
                  aria-label="100% acessível"
                >
                  ✨ 100%
                </div>
              )}
              <div
                className="absolute bottom-2 left-2 rounded-full px-2 py-0.5 text-xs font-semibold"
                style={{ backgroundColor: "rgba(0,0,0,0.65)", color: "white" }}
              >
                {type}
              </div>
            </div>

            {/* Meta */}
            <div className="flex flex-col gap-4 flex-1 w-full min-w-0">
              {/* Access feature badges */}
              <div className="flex flex-wrap gap-2" aria-label="Recursos de acessibilidade">
                {badges.map((b) => (
                  <span
                    key={b}
                    className="px-3 py-1.5 rounded-full text-white text-xs font-bold flex items-center gap-1.5"
                    style={{ backgroundColor: badgeBg[b] ?? "#003366", border: "1px solid rgba(255,255,255,0.15)" }}
                  >
                    <span aria-hidden="true">✓</span>
                    {badgeFullLabel[b] ?? b}
                  </span>
                ))}
              </div>

              <h1 className="text-white leading-tight" style={{ fontSize: "clamp(26px, 5vw, 40px)", fontWeight: 800 }}>
                {title}
              </h1>

              {/* Metadata chips */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded-md" style={{ border: "1.5px solid rgba(255,255,255,0.4)", color: "white" }}>
                  14 anos
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md" style={{ backgroundColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.95)" }}>
                  <Calendar size={12} aria-hidden="true" /> 2024
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md" style={{ backgroundColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.95)" }}>
                  <Clock size={12} aria-hidden="true" /> 2h 15min
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md" style={{ backgroundColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.95)" }}>
                  <Film size={12} aria-hidden="true" /> Drama
                </span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5" aria-label={`Nota: ${rating} de 5 estrelas`}>
                  {[1,2,3,4,5].map((n) => (
                    <Star key={n} size={18} fill={n <= Math.round(rating) ? "#ffb84d" : "rgba(255,184,77,0.25)"} color="#ffb84d" aria-hidden="true" />
                  ))}
                </div>
                <span className="text-white font-bold text-lg">{rating.toFixed(1)}</span>
                <span className="text-sm" style={{ color: "rgba(255,255,255,0.85)" }}>/5 · {item ? "avaliações da comunidade PCD" : "1.2k avaliações PCD"}</span>
              </div>

              {/* Available on (platforms preview) */}
              {platforms.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.92)" }}>
                    {type === "Jogos" ? "Disponível para:" : "Disponível em:"}
                  </span>
                  <div className="flex items-center gap-1.5" aria-label={`Plataformas: ${platforms.map((p) => platformConfig[p].name).join(", ")}`}>
                    {platforms.map((p) => {
                      const cfg = platformConfig[p];
                      return (
                        <span
                          key={p}
                          className="flex items-center justify-center rounded-md text-white font-black"
                          style={{ backgroundColor: cfg.color, width: 28, height: 28, fontSize: 12 }}
                          title={cfg.name}
                          aria-hidden="true"
                        >
                          {cfg.initials}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              <p className="text-sm leading-relaxed max-w-xl" style={{ color: "rgba(255,255,255,0.92)" }}>
                {synopsis}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setStreamingOpen(true)}
                  className="af-focus inline-flex items-center gap-2 rounded-xl font-bold text-white text-sm px-6 transition-transform hover:scale-[1.03] active:scale-[0.98]"
                  style={{ backgroundColor: "#0073e6", height: 48, minWidth: 44, boxShadow: "0 6px 18px rgba(0,115,230,0.4)" }}
                  aria-label="Ver onde assistir este filme"
                >
                  <Play size={16} fill="white" aria-hidden="true" />
                  Onde assistir
                </button>

                <button
                  type="button"
                  onClick={() => setSaved(!saved)}
                  className="af-focus-light inline-flex items-center gap-2 rounded-xl font-bold text-sm px-6 transition-colors"
                  style={{
                    height: 48,
                    backgroundColor: saved ? "rgba(255,255,255,0.15)" : "transparent",
                    border: "2px solid rgba(255,255,255,0.92)",
                    color: "white",
                    minWidth: 44,
                  }}
                  aria-label={saved ? "Remover da lista" : "Salvar na lista"}
                  aria-pressed={saved}
                >
                  <Bookmark size={16} fill={saved ? "white" : "none"} aria-hidden="true" />
                  {saved ? "Salvo" : "Salvar na lista"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ BODY ══ */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 flex flex-col gap-8">

        {/* Accessibility score */}
        <section aria-label="Pontuação de acessibilidade">
          <div className="rounded-2xl p-6 md:p-8" style={{ backgroundColor: "#0073e6" }}>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
              <div className="flex flex-col items-center gap-2 flex-shrink-0">
                <div className="flex items-end gap-1 leading-none">
                  <span className="font-bold text-white" style={{ fontSize: 56, lineHeight: 1 }}>8.5</span>
                  <span className="mb-1.5 font-semibold text-xl" style={{ color: "rgba(255,255,255,0.92)" }}>/10</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star size={14} fill="#b35d00" color="#b35d00" aria-hidden="true" />
                  <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.95)" }}>Avaliação Geral</span>
                </div>
              </div>
              <div className="self-stretch hidden md:block" style={{ width: 1, backgroundColor: "rgba(255,255,255,0.2)", minHeight: 80 }} aria-hidden="true" />
              <div className="flex-1 flex flex-col gap-5 w-full" style={{ minWidth: 0 }}>
                <ScoreBar icon={<Eye size={16} />} label="Acessibilidade Visual" score={9.0} barColor="#5ba300" delay={100} />
                <ScoreBar icon={<Ear size={16} />} label="Acessibilidade Auditiva" score={8.5} barColor="#e6308a" delay={260} />
                <ScoreBar icon={<Brain size={16} />} label="Acessibilidade Cognitiva" score={7.5} barColor="rgba(255,255,255,0.82)" delay={420} />
              </div>
            </div>
          </div>
        </section>

        {/* Accessibility details */}
        <section aria-label="Detalhes de acessibilidade">
          <h2 className="mb-4 font-bold" style={{ color: "#1a1a2e", fontSize: 18 }}>Detalhes de Acessibilidade</h2>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            {/* AD card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
              {[
                { color: "#5ba300", label: "Audiodescrição", detail: "Português • Alta qualidade" },
                { color: "#0073e6", label: "Legendas", detail: "PT-BR • Fechada e Aberta" },
                { color: "#e6308a", label: "Libras", detail: "Disponível • Canto inferior" },
              ].map((d) => (
                <div key={d.label} className="rounded-xl p-4 flex items-start gap-3" style={{ backgroundColor: "#f8fafc", border: "1px solid #e8ecf0" }}>
                  <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: d.color }} aria-hidden="true" />
                  <div>
                    <div className="text-sm font-bold" style={{ color: "#1a1a2e" }}>{d.label}</div>
                    <div className="text-xs mt-0.5" style={{ color: "#4a4a6a" }}>{d.detail}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {features.map((f) => (
                <span
                  key={f.label}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-white text-xs font-semibold"
                  style={{ backgroundColor: f.color }}
                >
                  <span aria-hidden="true">{f.icon}</span>
                  {f.label}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section aria-label="Avaliações da comunidade PCD">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold" style={{ color: "#1a1a2e", fontSize: 18 }}>Avaliações da Comunidade PCD</h2>
          </div>

          {/* Rating summary */}
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-5">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex flex-col items-center">
                <span className="font-black" style={{ fontSize: 56, color: "#1a1a2e", lineHeight: 1 }}>4.8</span>
                <div className="flex gap-0.5 my-1" aria-label="4.8 de 5 estrelas">
                  {[1,2,3,4,5].map((n) => (
                    <Star key={n} size={16} fill={n <= 4 ? "#b35d00" : "none"} color="#b35d00" aria-hidden="true" />
                  ))}
                </div>
                <span className="text-sm" style={{ color: "#4a4a6a" }}>1.2k avaliações</span>
              </div>

              <div className="flex-1 w-full flex flex-col gap-2">
                {[5,4,3,2,1].map((star) => {
                  const pcts: Record<number,number> = { 5:68,4:20,3:7,2:3,1:2 };
                  return (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-xs w-4 text-right" style={{ color: "#4a4a6a" }}>{star}</span>
                      <Star size={10} fill="#b35d00" color="#b35d00" aria-hidden="true" />
                      <div className="flex-1 rounded-full overflow-hidden" style={{ height: 8, backgroundColor: "#f0f2f5" }} role="progressbar" aria-valuenow={pcts[star]} aria-valuemin={0} aria-valuemax={100} aria-label={`${star} estrelas: ${pcts[star]}%`}>
                        <div className="h-full rounded-full" style={{ width: `${pcts[star]}%`, backgroundColor: "#b35d00" }} />
                      </div>
                      <span className="text-xs w-8" style={{ color: "#4a4a6a" }}>{pcts[star]}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 mb-5 overflow-x-auto pb-1" role="tablist" aria-label="Filtrar avaliações por tipo de deficiência">
            {reviewFilters.map((f) => {
              const colors: Record<string,string> = { todos:"#0073e6", visual:"#c01a6f", auditiva:"#005bb5", cognitiva:"#3d7500" };
              const active = reviewFilter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setReviewFilter(f.id)}
                  className="af-focus flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all"
                  style={{
                    backgroundColor: active ? colors[f.id] : "white",
                    color: active ? "white" : "#1a1a2e",
                    border: `1.5px solid ${active ? colors[f.id] : "#d0d5e0"}`,
                    minHeight: 44,
                  }}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          {/* Review cards */}
          <div className="flex flex-col gap-4 mb-6">
            {filteredReviews.length > 0
              ? filteredReviews.map((r) => <ReviewCard key={r.id} review={r} />)
              : (
                <div className="text-center py-10 bg-white rounded-2xl" role="status">
                  <p className="font-semibold" style={{ color: "#4a4a6a" }}>Nenhuma avaliação com esse filtro.</p>
                </div>
              )
            }
          </div>

          {/* Write review */}
          <ReviewForm onSubmit={handleAddReview} onRequireLogin={handleRequireLogin} />
        </section>

        {/* Similar titles */}
        <section aria-label="Títulos similares acessíveis">
          <h2 className="font-bold mb-4" style={{ color: "#1a1a2e", fontSize: 18 }}>
            Outros títulos 100% acessíveis
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {ALL_CONTENT.filter((c) => c.perfect && c.id !== item?.id).slice(0, 8).map((c) => (
              <ContentCard
                key={c.id}
                item={c}
                onClick={() => onSelectItem ? onSelectItem(c) : onBack()}
                onStreamingClick={() => setStreamingOpen(true)}
              />
            ))}
          </div>
        </section>
      </div>

      {/* Streaming modal */}
      {streamingOpen && (
        <StreamingModal
          title={title}
          onClose={() => setStreamingOpen(false)}
          hasProfile={hasProfile}
        />
      )}
    </div>
  );
}
