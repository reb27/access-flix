import { useState } from "react";
import { ChevronLeft, Check } from "lucide-react";

type Page = "home" | "listing" | "detail" | "watch" | "profile" | "search" | "highcontrast" | "createprofile";

type NeedId =
  | "baixa_visao" | "cegueira" | "daltonismo"
  | "surdez" | "baixa_audicao" | "libras"
  | "tdah" | "autismo" | "dislexia" | "ansiedade" | "def_intelectual"
  | "motora_fina" | "eye_tracking";

/* ── Inline icons ── */
const icons: Record<NeedId | "group_visual" | "group_auditiva" | "group_cognitiva" | "group_motora", JSX.Element> = {
  group_visual:   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  group_auditiva: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 6-6 10a3.5 3.5 0 0 1-7 0"/><path d="M15 8.5a2.5 2.5 0 0 0-5 0v1l4.5 4.5"/></svg>,
  group_cognitiva:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>,
  group_motora:   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>,
  baixa_visao:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  cegueira:     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  daltonismo:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>,
  surdez:       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8.5a6.5 6.5 0 0 1 11.985-2.014"/><path d="M8.5 8.5a2.5 2.5 0 0 1 4.5-1.45"/><path d="M13 13c0 4-6 4-6 8a3.5 3.5 0 0 0 6.865.956"/><line x1="2" y1="2" x2="22" y2="22"/></svg>,
  baixa_audicao:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 6-6 10a3.5 3.5 0 0 1-7 0"/><path d="M15 8.5a2.5 2.5 0 0 0-5 0v1l4.5 4.5"/></svg>,
  libras:       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>,
  tdah:         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  autismo:      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.5 7l-5-5-1.5 1.5L12.5 2 7 7.5l1.5 1.5L7 10.5l5 5 1.5-1.5 1.5 1.5 5.5-5.5-1.5-1.5z"/><path d="M9.5 14.5l-5 5"/></svg>,
  dislexia:     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  ansiedade:    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  def_intelectual:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/></svg>,
  motora_fina:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="7"/><path d="M12 6v4"/></svg>,
  eye_tracking: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><circle cx="12" cy="12" r="1"/><path d="M5 12s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z"/></svg>,
};

interface NeedGroup {
  id: string;
  label: string;
  color: string;
  bgColor: string;
  items: { id: NeedId; label: string }[];
}

const GROUPS: NeedGroup[] = [
  {
    id: "visual", label: "Visual", color: "#e6308a", bgColor: "#fce4f0",
    items: [
      { id: "baixa_visao", label: "Baixa visão" },
      { id: "cegueira",    label: "Cegueira" },
      { id: "daltonismo",  label: "Daltonismo" },
    ],
  },
  {
    id: "auditiva", label: "Auditiva", color: "#0073e6", bgColor: "#e6f2ff",
    items: [
      { id: "surdez",        label: "Surdez" },
      { id: "baixa_audicao", label: "Baixa audição" },
      { id: "libras",        label: "Usa Libras" },
    ],
  },
  {
    id: "cognitiva", label: "Cognitiva / Neuro", color: "#5ba300", bgColor: "#edf7e0",
    items: [
      { id: "tdah",            label: "TDAH" },
      { id: "autismo",         label: "Autismo (TEA)" },
      { id: "dislexia",        label: "Dislexia" },
      { id: "ansiedade",       label: "Ansiedade" },
      { id: "def_intelectual", label: "Def. Intelectual" },
    ],
  },
  {
    id: "motora", label: "Motora", color: "#f5a623", bgColor: "#fff4e0",
    items: [
      { id: "motora_fina",  label: "Motora fina" },
      { id: "eye_tracking", label: "Eye tracking" },
    ],
  },
];

/* ── Step indicator ── */
function StepBar({ step }: { step: 1 | 2 | 3 }) {
  const steps = ["Suas necessidades", "Preferências", "Pronto!"];
  return (
    <div className="flex items-center gap-0 w-full" aria-label={`Etapa ${step} de 3: ${steps[step - 1]}`} role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={3}>
      {steps.map((label, i) => {
        const num = i + 1;
        const done = num < step;
        const current = num === step;
        return (
          <div key={num} className="flex items-center" style={{ flex: 1 }}>
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <div
                className="rounded-full flex items-center justify-center font-bold text-xs"
                style={{
                  width: 28, height: 28,
                  backgroundColor: done ? "#5ba300" : current ? "#0073e6" : "#e8ecf0",
                  color: done || current ? "white" : "#5b5b7a",
                  transition: "all 0.3s ease",
                }}
              >
                {done ? <Check size={14} /> : num}
              </div>
              <span className="text-center" style={{ fontSize: 12, fontWeight: current ? 700 : 400, color: current ? "#0073e6" : done ? "#5ba300" : "#5b5b7a", whiteSpace: "nowrap" }}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className="flex-1 mx-2"
                style={{ height: 2, backgroundColor: done ? "#5ba300" : "#e8ecf0", marginBottom: 16, transition: "background-color 0.3s ease" }}
                aria-hidden="true"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Need card ── */
function NeedCardBtn({ id, label, groupColor, groupBg, selected, onToggle }: {
  id: NeedId; label: string; groupColor: string; groupBg: string;
  selected: boolean; onToggle: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const icon = icons[id];

  return (
    <button
      onClick={onToggle}
      aria-pressed={selected}
      aria-label={`${label}${selected ? ", selecionado" : ""}`}
      className="relative flex flex-col items-center justify-center gap-1.5 rounded-2xl border-2 transition-all focus:outline-none"
      style={{
        padding: "14px 10px 12px",
        backgroundColor: selected ? groupBg : hovered ? "#f0f4ff" : "#fafafa",
        borderColor: selected ? groupColor : hovered ? "#b0c4de" : "#d0d5e0",
        boxShadow: selected ? `0 2px 12px ${groupColor}33` : "none",
        minHeight: 84,
        transition: "all 0.15s ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={(e) => { e.currentTarget.style.outline = `3px solid ${groupColor}`; e.currentTarget.style.outlineOffset = "2px"; }}
      onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
    >
      {selected && (
        <div className="absolute top-2 right-2 rounded-full flex items-center justify-center" style={{ width: 18, height: 18, backgroundColor: groupColor }} aria-hidden="true">
          <Check size={11} color="white" />
        </div>
      )}
      <div
        className="flex items-center justify-center rounded-xl"
        style={{ width: 44, height: 44, backgroundColor: selected ? groupColor : hovered ? `${groupColor}22` : "#f0f0f8", color: selected ? "white" : groupColor, transition: "all 0.15s ease" }}
        aria-hidden="true"
      >
        {icon}
      </div>
      <span className="text-center leading-tight" style={{ fontSize: 13, fontWeight: 700, color: selected ? groupColor : "#2d2d44", maxWidth: 80 }}>
        {label}
      </span>
    </button>
  );
}

/* ── Preferences step ── */
const CONTENT_PREFS = [
  { id: "filmes", label: "Filmes",        emoji: "🎬" },
  { id: "series", label: "Séries",        emoji: "📺" },
  { id: "anime",  label: "Animes",        emoji: "🎌" },
  { id: "jogos",  label: "Jogos",         emoji: "🎮" },
  { id: "docs",   label: "Documentários", emoji: "🎞️" },
];

const STREAMING_PREFS = [
  { id: "netflix",     label: "Netflix",      color: "#E50914" },
  { id: "prime",       label: "Prime Video",  color: "#00A8E0" },
  { id: "disney",      label: "Disney+",      color: "#113CCF" },
  { id: "globoplay",   label: "Globoplay",    color: "#E8303B" },
  { id: "crunchyroll", label: "Crunchyroll",  color: "#F47521" },
];

/* ── Main page ── */
interface CreateProfilePageProps {
  onBack: () => void;
  onComplete: (needs: NeedId[], contentPrefs: string[], streamingPrefs: string[]) => void;
}

export function CreateProfilePage({ onBack, onComplete }: CreateProfilePageProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedNeeds, setSelectedNeeds] = useState<Set<NeedId>>(new Set());
  const [contentPrefs, setContentPrefs] = useState<Set<string>>(new Set());
  const [streamingPrefs, setStreamingPrefs] = useState<Set<string>>(new Set());

  const toggleNeed = (id: NeedId) => {
    setSelectedNeeds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleContent = (id: string) => {
    setContentPrefs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleStreaming = (id: string) => {
    setStreamingPrefs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleFinish = () => {
    onComplete(
      Array.from(selectedNeeds),
      Array.from(contentPrefs),
      Array.from(streamingPrefs),
    );
  };

  return (
    <div className="flex flex-col" style={{ minHeight: "100vh", backgroundColor: "#F5F7FA" }}>

      {/* ── Header ── */}
      <header
        className="w-full flex-shrink-0 flex items-center gap-4 px-4 md:px-6 py-3 bg-white"
        style={{ borderBottom: "1px solid #e8ecf0", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
      >
        <button
          onClick={onBack}
          aria-label="Voltar"
          className="flex items-center gap-1.5 text-sm font-semibold rounded focus:outline-none flex-shrink-0"
          style={{ color: "#0073e6", minHeight: 44 }}
          onFocus={(e) => { e.currentTarget.style.outline = "3px solid #0073e6"; e.currentTarget.style.outlineOffset = "2px"; }}
          onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
        >
          <ChevronLeft size={18} aria-hidden="true" />
          Voltar
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2">
          <svg width="30" height="30" viewBox="0 0 36 36" fill="none" aria-hidden="true">
            <defs><linearGradient id="cpLg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#0073e6"/><stop offset="100%" stopColor="#005bb5"/></linearGradient></defs>
            <rect width="36" height="36" rx="9" fill="url(#cpLg)" />
            <path d="M13 9L13 27L30 18Z" fill="white" />
          </svg>
          <span style={{ fontSize: 17, fontWeight: 800, color: "#1a1a2e", letterSpacing: "-0.02em" }}>
            Access<span style={{ color: "#0073e6" }}>Flix</span>
          </span>
        </div>
      </header>

      {/* ── Step bar ── */}
      <div className="max-w-xl mx-auto w-full px-6 pt-6 pb-2">
        <StepBar step={step} />
      </div>

      {/* ── Step content ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-xl mx-auto px-4 md:px-6 pt-4 pb-32">

          {/* ── STEP 1: Necessidades ── */}
          {step === 1 && (
            <div>
              <h1 className="font-bold mb-1" style={{ fontSize: "clamp(18px,4vw,24px)", color: "#1a1a2e" }}>
                Quais são suas necessidades de acessibilidade?
              </h1>
              <p className="mb-6 text-sm leading-relaxed" style={{ color: "#4a4a6a" }}>
                Selecione todas que se aplicam. Você pode mudar depois.
              </p>

              {GROUPS.map((group) => (
                <div key={group.id} className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="flex items-center justify-center rounded-lg"
                      style={{ width: 28, height: 28, backgroundColor: group.bgColor, color: group.color }}
                      aria-hidden="true"
                    >
                      {icons[`group_${group.id}` as keyof typeof icons]}
                    </div>
                    <h2 className="text-sm font-bold" style={{ color: "#2d2d44" }}>{group.label}</h2>
                  </div>
                  <div className="grid grid-cols-3 gap-2.5">
                    {group.items.map((item) => (
                      <NeedCardBtn
                        key={item.id}
                        id={item.id}
                        label={item.label}
                        groupColor={group.color}
                        groupBg={group.bgColor}
                        selected={selectedNeeds.has(item.id)}
                        onToggle={() => toggleNeed(item.id)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── STEP 2: Preferências ── */}
          {step === 2 && (
            <div>
              <h1 className="font-bold mb-1" style={{ fontSize: "clamp(18px,4vw,24px)", color: "#1a1a2e" }}>
                O que você gosta de assistir?
              </h1>
              <p className="mb-6 text-sm" style={{ color: "#4a4a6a" }}>
                Personalizaremos suas recomendações.
              </p>

              <h2 className="text-sm font-bold mb-3" style={{ color: "#2d2d44" }}>Tipo de conteúdo</h2>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {CONTENT_PREFS.map((p) => {
                  const sel = contentPrefs.has(p.id);
                  return (
                    <button
                      key={p.id}
                      onClick={() => toggleContent(p.id)}
                      aria-pressed={sel}
                      className="flex items-center gap-3 rounded-2xl border-2 p-4 transition-all focus:outline-none"
                      style={{
                        backgroundColor: sel ? "#e6f2ff" : "#fafafa",
                        borderColor: sel ? "#0073e6" : "#d0d5e0",
                        minHeight: 56,
                      }}
                      onFocus={(e) => { e.currentTarget.style.outline = "3px solid #0073e6"; e.currentTarget.style.outlineOffset = "2px"; }}
                      onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
                    >
                      <span style={{ fontSize: 24 }} aria-hidden="true">{p.emoji}</span>
                      <span className="text-sm font-semibold" style={{ color: sel ? "#0073e6" : "#1a1a2e" }}>{p.label}</span>
                      {sel && <div className="ml-auto"><Check size={16} color="#0073e6" aria-hidden="true" /></div>}
                    </button>
                  );
                })}
              </div>

              <h2 className="text-sm font-bold mb-3" style={{ color: "#2d2d44" }}>Plataformas que você usa</h2>
              <div className="flex flex-wrap gap-2">
                {STREAMING_PREFS.map((p) => {
                  const sel = streamingPrefs.has(p.id);
                  return (
                    <button
                      key={p.id}
                      onClick={() => toggleStreaming(p.id)}
                      aria-pressed={sel}
                      className="flex items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-semibold transition-all focus:outline-none"
                      style={{
                        backgroundColor: sel ? p.color : "white",
                        borderColor: sel ? p.color : "#d0d5e0",
                        color: sel ? "white" : "#4a4a6a",
                        minHeight: 40,
                      }}
                      onFocus={(e) => { e.currentTarget.style.outline = `3px solid ${p.color}`; e.currentTarget.style.outlineOffset = "2px"; }}
                      onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
                    >
                      {p.label}
                      {sel && <Check size={13} aria-hidden="true" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── STEP 3: Pronto! ── */}
          {step === 3 && (
            <div className="flex flex-col items-center text-center pt-8">
              <div
                className="flex items-center justify-center rounded-full mb-6"
                style={{ width: 96, height: 96, backgroundColor: "#edf7e0" }}
                aria-hidden="true"
              >
                <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
                  <circle cx="26" cy="26" r="24" fill="#5ba300" fillOpacity="0.15" />
                  <path d="M16 26l8 8 12-14" stroke="#5ba300" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <h1 className="font-bold mb-3" style={{ fontSize: 26, color: "#1a1a2e" }}>Perfil criado!</h1>
              <p className="text-sm leading-relaxed mb-8 max-w-xs" style={{ color: "#4a4a6a" }}>
                Suas recomendações foram personalizadas. Você pode ajustar seu perfil a qualquer momento.
              </p>

              {/* Summary */}
              {selectedNeeds.size > 0 && (
                <div className="w-full bg-white rounded-2xl p-5 mb-4 text-left" style={{ border: "1px solid #e8ecf0" }}>
                  <h3 className="text-sm font-bold mb-3" style={{ color: "#2d2d44" }}>Suas necessidades ({selectedNeeds.size})</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.from(selectedNeeds).map((id) => {
                      const group = GROUPS.find((g) => g.items.some((i) => i.id === id));
                      const item = GROUPS.flatMap((g) => g.items).find((i) => i.id === id);
                      return (
                        <span key={id} className="px-2.5 py-1 rounded-full text-xs font-semibold"
                          style={{ backgroundColor: group?.bgColor ?? "#f0f4ff", color: group?.color ?? "#0073e6" }}>
                          {item?.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Fixed bottom CTA ── */}
      <div
        className="fixed bottom-0 left-0 right-0 px-4 md:px-6 py-4"
        style={{ backgroundColor: "white", borderTop: "1px solid #e8ecf0", boxShadow: "0 -4px 16px rgba(0,0,0,0.06)" }}
      >
        <div className="max-w-xl mx-auto">
          {step === 1 && (
            <button
              onClick={() => setStep(2)}
              className="w-full rounded-xl font-semibold text-white transition-all active:scale-[0.98] focus:outline-none"
              style={{ backgroundColor: "#0073e6", padding: "16px 24px", fontSize: 16, minHeight: 52 }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#005bb5")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#0073e6")}
              onFocus={(e) => { e.currentTarget.style.outline = "3px solid #0073e6"; e.currentTarget.style.outlineOffset = "2px"; }}
              onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
            >
              Continuar{selectedNeeds.size > 0 ? ` (${selectedNeeds.size} selecionado${selectedNeeds.size > 1 ? "s" : ""})` : ""}
            </button>
          )}
          {step === 2 && (
            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="rounded-xl font-semibold transition-colors focus:outline-none flex-shrink-0"
                style={{ border: "1.5px solid #d0d5e0", backgroundColor: "white", color: "#4a4a6a", padding: "16px 20px", minHeight: 52 }}
                onFocus={(e) => { e.currentTarget.style.outline = "3px solid #0073e6"; e.currentTarget.style.outlineOffset = "2px"; }}
                onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
                aria-label="Voltar para etapa anterior"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 rounded-xl font-semibold text-white transition-all active:scale-[0.98] focus:outline-none"
                style={{ backgroundColor: "#0073e6", padding: "16px 24px", fontSize: 16, minHeight: 52 }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#005bb5")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#0073e6")}
                onFocus={(e) => { e.currentTarget.style.outline = "3px solid #0073e6"; e.currentTarget.style.outlineOffset = "2px"; }}
                onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
              >
                Continuar
              </button>
            </div>
          )}
          {step === 3 && (
            <button
              onClick={handleFinish}
              className="w-full rounded-xl font-semibold text-white transition-all active:scale-[0.98] focus:outline-none"
              style={{ backgroundColor: "#5ba300", padding: "16px 24px", fontSize: 16, minHeight: 52 }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#4a8700")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#5ba300")}
              onFocus={(e) => { e.currentTarget.style.outline = "3px solid #5ba300"; e.currentTarget.style.outlineOffset = "2px"; }}
              onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
            >
              Ir para o AccessFlix 🎉
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
