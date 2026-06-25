import { useEffect, useState } from "react";
import {
  Eye, Ear, Brain, Star, ChevronLeft,
  Volume2, Captions, Hand, Monitor, Keyboard, Mic, Zap, BookOpen,
  Bookmark, ThumbsUp, Share2, Send, CheckSquare, Square,
} from "lucide-react";
import { StreamingModal } from "./StreamingModal";

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
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          aria-label={`${n} estrela${n > 1 ? "s" : ""}`}
          className="focus:outline-none"
          onFocus={(e) => { e.currentTarget.style.outline = "2px solid #0073e6"; }}
          onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
        >
          <Star
            size={24}
            fill={(hover || value) >= n ? "#f5a623" : "none"}
            color={(hover || value) >= n ? "#f5a623" : "#d0d5e0"}
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
        <span className="text-xs flex-shrink-0" style={{ color: "#6b6b8a" }}>{review.date}</span>
      </div>

      <div className="flex gap-0.5" aria-label={`Nota: ${review.rating} de 5`}>
        {[1,2,3,4,5].map((n) => (
          <Star key={n} size={14} fill={n <= review.rating ? "#f5a623" : "none"} color={n <= review.rating ? "#f5a623" : "#d0d5e0"} aria-hidden="true" />
        ))}
      </div>

      <p className="text-sm leading-relaxed" style={{ color: "#4a4a6a" }}>{review.text}</p>

      <div className="flex items-center gap-3 pt-1" style={{ borderTop: "1px solid #f0f2f5" }}>
        <button
          onClick={() => { if (!voted) { setHelpful(h => h + 1); setVoted(true); } }}
          className="flex items-center gap-1.5 text-xs transition-colors focus:outline-none focus:ring-2 rounded px-1"
          style={{ color: voted ? "#0073e6" : "#6b6b8a", ["--tw-ring-color" as string]: "#0073e6" }}
          aria-label={`Marcar como útil. ${helpful} pessoas acharam útil.`}
          aria-pressed={voted}
        >
          <ThumbsUp size={14} aria-hidden="true" />
          Útil ({helpful})
        </button>
        <button
          className="flex items-center gap-1.5 text-xs transition-colors focus:outline-none focus:ring-2 rounded px-1"
          style={{ color: "#6b6b8a", ["--tw-ring-color" as string]: "#0073e6" }}
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
function ReviewForm({ onRequireLogin }: { onRequireLogin: () => void }) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [disabilities, setDisabilities] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const toggleDisability = (d: string) =>
    setDisabilities((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]);

  const handleSubmit = () => {
    if (rating === 0) return;
    onRequireLogin();
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl p-6 text-center">
        <div className="text-3xl mb-2" aria-hidden="true">🎉</div>
        <p className="font-semibold" style={{ color: "#1a1a2e" }}>Avaliação publicada!</p>
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
            { id: "motora", label: "Motora", color: "#f5a623" },
          ].map((d) => {
            const checked = disabilities.includes(d.id);
            return (
              <button
                key={d.id}
                onClick={() => toggleDisability(d.id)}
                aria-pressed={checked}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all focus:outline-none"
                style={{
                  backgroundColor: checked ? d.color : "transparent",
                  borderColor: checked ? d.color : "#d0d5e0",
                  color: checked ? "white" : "#4a4a6a",
                }}
                onFocus={(e) => { e.currentTarget.style.outline = `3px solid ${d.color}`; e.currentTarget.style.outlineOffset = "2px"; }}
                onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
              >
                {checked ? <CheckSquare size={12} aria-hidden="true" /> : <Square size={12} aria-hidden="true" />}
                {d.label}
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={rating === 0}
        className="flex items-center justify-center gap-2 rounded-xl py-3 text-white font-semibold transition-all focus:outline-none"
        style={{
          backgroundColor: rating === 0 ? "#b0c4de" : "#0073e6",
          cursor: rating === 0 ? "not-allowed" : "pointer",
        }}
        onMouseEnter={(e) => { if (rating > 0) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#005bb5"; }}
        onMouseLeave={(e) => { if (rating > 0) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#0073e6"; }}
        onFocus={(e) => { e.currentTarget.style.outline = "3px solid #0073e6"; e.currentTarget.style.outlineOffset = "2px"; }}
        onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
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
  onBack: () => void;
  onWatch: () => void;
  hasProfile?: boolean;
  onShowOnboarding?: () => void;
}

export function DetailPage({ onBack, onWatch, hasProfile = false, onShowOnboarding }: DetailPageProps) {
  const [streamingOpen, setStreamingOpen] = useState(false);
  const [reviewFilter, setReviewFilter] = useState("todos");
  const [saved, setSaved] = useState(false);

  const reviewFilters = [
    { id: "todos",    label: "Todos" },
    { id: "visual",   label: "Visual" },
    { id: "auditiva", label: "Auditiva" },
    { id: "cognitiva",label: "Cognitiva" },
  ];

  const filteredReviews = reviewFilter === "todos"
    ? REVIEWS
    : REVIEWS.filter((r) => r.disability.toLowerCase() === reviewFilter);

  const handleRequireLogin = () => {
    if (!hasProfile) { onShowOnboarding?.(); }
  };

  return (
    <div className="flex-1 overflow-y-auto" style={{ backgroundColor: "#F5F7FA" }}>

      {/* ══ HERO ══ */}
      <section style={{ backgroundColor: "#1A1A2E" }}>
        <div className="max-w-6xl mx-auto px-4 md:px-8 pt-6 pb-10 md:pb-14">

          {/* Back */}
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 mb-6 md:mb-8 text-sm rounded focus:outline-none transition-opacity"
            style={{ color: "rgba(255,255,255,0.7)", minHeight: 44 }}
            onFocus={(e) => { e.currentTarget.style.outline = "3px solid #0073e6"; e.currentTarget.style.outlineOffset = "2px"; }}
            onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
            aria-label="Voltar para a listagem"
          >
            <ChevronLeft size={16} aria-hidden="true" />
            Voltar
          </button>

          <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
            {/* Poster */}
            <div
              className="flex-shrink-0 rounded-2xl overflow-hidden flex items-center justify-center self-center md:self-start"
              style={{
                width: "min(180px, 45vw)", aspectRatio: "2/3",
                background: "linear-gradient(145deg,#6366f1 0%,#8b5cf6 100%)",
              }}
              aria-label="Poster do filme" role="img"
            >
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true">
                <path d="M10 52L26 30L36 44L46 26L58 52H10Z" fill="white" fillOpacity="0.22" />
                <circle cx="24" cy="20" r="7" fill="white" fillOpacity="0.22" />
              </svg>
            </div>

            {/* Meta */}
            <div className="flex flex-col gap-4 flex-1 w-full">
              {/* Hero badges */}
              <div className="flex flex-wrap gap-2">
                {["AD","Leg","Libras"].map((b) => {
                  const colors: Record<string,string> = { AD: "#5ba300", Leg: "#0073e6", Libras: "#e6308a" };
                  return (
                    <span
                      key={b}
                      className="px-3 py-1 rounded-full text-white text-xs font-bold"
                      style={{ backgroundColor: colors[b] }}
                      aria-label={b === "AD" ? "Audiodescrição" : b === "Leg" ? "Legendas" : "Libras"}
                    >
                      {b}
                    </span>
                  );
                })}
              </div>

              <h1 className="text-white leading-tight" style={{ fontSize: "clamp(24px, 5vw, 36px)", fontWeight: 800 }}>
                O Grande Filme Acessível
              </h1>

              <div className="flex flex-wrap items-center gap-3">
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded border"
                  style={{ borderColor: "rgba(255,255,255,0.35)", color: "rgba(255,255,255,0.9)" }}
                >
                  14 anos
                </span>
                <span className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                  2024 • 2h 15min • Drama
                </span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5" aria-label="Nota: 4.8 de 5 estrelas">
                  {[1,2,3,4,5].map((n) => (
                    <Star key={n} size={16} fill={n <= 4 ? "#f5a623" : "none"} color={n <= 5 ? "#f5a623" : "#4a4a6a"} aria-hidden="true" />
                  ))}
                </div>
                <span className="text-white font-bold text-lg">4.8</span>
                <span className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>/5.0 • 1.2k avaliações PCD</span>
              </div>

              <p className="text-sm leading-relaxed max-w-xl" style={{ color: "rgba(255,255,255,0.55)" }}>
                Uma história emocionante sobre superação e inclusão, com suporte completo a recursos de acessibilidade para que todos possam desfrutar da experiência cinematográfica.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 mt-1">
                <button
                  onClick={() => setStreamingOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl font-bold text-white text-sm px-6 transition-all active:scale-[0.98] focus:outline-none"
                  style={{ backgroundColor: "#0073e6", height: 48, minWidth: 44 }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#005bb5")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#0073e6")}
                  onFocus={(e) => { e.currentTarget.style.outline = "3px solid #0073e6"; e.currentTarget.style.outlineOffset = "2px"; }}
                  onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
                  aria-label="Ver opções de streaming"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  Ver em...
                </button>

                <button
                  onClick={() => setSaved(!saved)}
                  className="inline-flex items-center gap-2 rounded-xl font-bold text-sm px-6 transition-all focus:outline-none"
                  style={{
                    height: 48,
                    backgroundColor: "transparent",
                    border: "2px solid rgba(255,255,255,0.4)",
                    color: "white",
                    minWidth: 44,
                  }}
                  onFocus={(e) => { e.currentTarget.style.outline = "3px solid #0073e6"; e.currentTarget.style.outlineOffset = "2px"; }}
                  onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
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
                  <span className="mb-1.5 font-semibold text-xl" style={{ color: "rgba(255,255,255,0.45)" }}>/10</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star size={14} fill="#f5a623" color="#f5a623" aria-hidden="true" />
                  <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.75)" }}>Avaliação Geral</span>
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
                    <div className="text-xs mt-0.5" style={{ color: "#6b6b8a" }}>{d.detail}</div>
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
                    <Star key={n} size={16} fill={n <= 4 ? "#f5a623" : "none"} color="#f5a623" aria-hidden="true" />
                  ))}
                </div>
                <span className="text-sm" style={{ color: "#6b6b8a" }}>1.2k avaliações</span>
              </div>

              <div className="flex-1 w-full flex flex-col gap-2">
                {[5,4,3,2,1].map((star) => {
                  const pcts: Record<number,number> = { 5:68,4:20,3:7,2:3,1:2 };
                  return (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-xs w-4 text-right" style={{ color: "#6b6b8a" }}>{star}</span>
                      <Star size={10} fill="#f5a623" color="#f5a623" aria-hidden="true" />
                      <div className="flex-1 rounded-full overflow-hidden" style={{ height: 8, backgroundColor: "#f0f2f5" }} role="progressbar" aria-valuenow={pcts[star]} aria-valuemin={0} aria-valuemax={100} aria-label={`${star} estrelas: ${pcts[star]}%`}>
                        <div className="h-full rounded-full" style={{ width: `${pcts[star]}%`, backgroundColor: "#f5a623" }} />
                      </div>
                      <span className="text-xs w-8" style={{ color: "#6b6b8a" }}>{pcts[star]}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 mb-5 overflow-x-auto pb-1" role="tablist" aria-label="Filtrar avaliações por tipo de deficiência">
            {reviewFilters.map((f) => {
              const colors: Record<string,string> = { todos:"#0073e6", visual:"#e6308a", auditiva:"#0073e6", cognitiva:"#5ba300" };
              const active = reviewFilter === f.id;
              return (
                <button
                  key={f.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setReviewFilter(f.id)}
                  className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all focus:outline-none"
                  style={{
                    backgroundColor: active ? colors[f.id] : "#f0f4ff",
                    color: active ? "white" : "#4a4a6a",
                    border: `1.5px solid ${active ? colors[f.id] : "#d0d5e0"}`,
                    minHeight: 36,
                  }}
                  onFocus={(e) => { e.currentTarget.style.outline = `3px solid ${colors[f.id]}`; e.currentTarget.style.outlineOffset = "2px"; }}
                  onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
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
          <ReviewForm onRequireLogin={handleRequireLogin} />
        </section>
      </div>

      {/* Streaming modal */}
      {streamingOpen && (
        <StreamingModal
          title="O Grande Filme Acessível"
          onClose={() => setStreamingOpen(false)}
          hasProfile={hasProfile}
        />
      )}
    </div>
  );
}
