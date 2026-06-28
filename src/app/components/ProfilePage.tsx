import { useState } from "react";
import { ChevronLeft, Star, Edit2, LogIn, LogOut, BookOpen } from "lucide-react";
import { ALL_CONTENT } from "./ContentCard";

/* ── Badge colors ── */
const badgeColors: Record<string, { bg: string; text: string }> = {
  AD:     { bg: "#d4edda", text: "#1a4d1a" },
  Leg:    { bg: "#cce0ff", text: "#003366" },
  Libras: { bg: "#fce4f0", text: "#6b0038" },
  Adapt:  { bg: "#ede9fe", text: "#3b0764" },
};

/* ── Need chip ── */
const NEED_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  baixa_visao:    { label: "Baixa visão",   color: "#e6308a", bg: "#fce4f0" },
  cegueira:       { label: "Cegueira",      color: "#e6308a", bg: "#fce4f0" },
  daltonismo:     { label: "Daltonismo",    color: "#e6308a", bg: "#fce4f0" },
  surdez:         { label: "Surdez",        color: "#0073e6", bg: "#e6f2ff" },
  baixa_audicao:  { label: "Baixa audição", color: "#0073e6", bg: "#e6f2ff" },
  libras:         { label: "Usa Libras",    color: "#0073e6", bg: "#e6f2ff" },
  tdah:           { label: "TDAH",          color: "#7c3aed", bg: "#ede9fe" },
  autismo:        { label: "Autismo (TEA)", color: "#7c3aed", bg: "#ede9fe" },
  dislexia:       { label: "Dislexia",      color: "#5ba300", bg: "#edf7e0" },
  ansiedade:      { label: "Ansiedade",     color: "#5ba300", bg: "#edf7e0" },
  def_intelectual:{ label: "Def. Intelectual", color: "#5ba300", bg: "#edf7e0" },
  motora_fina:    { label: "Motora fina",   color: "#f5a623", bg: "#fff4e0" },
  eye_tracking:   { label: "Eye tracking",  color: "#f5a623", bg: "#fff4e0" },
};

/* Saved/history pull real items from the catalog so posters render. */
const SAVED_ITEMS = ALL_CONTENT.filter((c) => [3, 23, 22].includes(c.id));   // TLOU, Hi-Fi Rush, Wicked
const HISTORY = ALL_CONTENT.filter((c) => [4, 2, 16].includes(c.id))         // Oppenheimer, Duna 2, Inside Out 2
  .map((c, i) => ({ ...c, platform: ["Prime Video", "Netflix", "Disney+"][i] }));

/* ── Saved poster card — uses real ContentItem with poster ── */
function SavedCard({ item, onClick }: { item: typeof SAVED_ITEMS[0]; onClick?: () => void }) {
  const [failed, setFailed] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      className="af-focus flex-shrink-0 flex flex-col text-left rounded-xl"
      style={{ width: 110 }}
    >
      <div
        className="rounded-xl overflow-hidden flex-shrink-0 relative"
        style={{ width: 110, height: 165, backgroundColor: item.posterColor }}
      >
        {!failed ? (
          <img
            src={item.poster}
            alt={`Pôster de ${item.title}`}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={() => setFailed(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
              <path d="M6 34L16 20L22 28L28 16L36 34H6Z" fill="white" fillOpacity="0.4" />
              <circle cx="14" cy="13" r="5" fill="white" fillOpacity="0.4" />
            </svg>
          </div>
        )}
      </div>
      <p className="text-xs font-semibold mt-1.5 leading-tight line-clamp-2" style={{ color: "#1a1a2e" }}>{item.title}</p>
      <div className="flex items-center gap-1 mt-0.5">
        <Star size={10} fill="#b35d00" color="#b35d00" aria-hidden="true" />
        <span className="text-xs font-bold" style={{ color: "#1a1a2e" }}>{item.rating.toFixed(1)}</span>
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

interface ProfilePageProps {
  onBack: () => void;
  onGoToCreateProfile?: () => void;
  isLoggedIn?: boolean;
  userName?: string;
  selectedNeeds?: string[];
}

export function ProfilePage({
  onBack,
  onGoToCreateProfile,
  isLoggedIn = false,
  userName,
  selectedNeeds = [],
}: ProfilePageProps) {
  const displayName = userName || "Visitante";
  const initials = displayName.slice(0, 2).toUpperCase();

  const hasNeeds = selectedNeeds.length > 0;

  return (
    <div
      className="flex-1 overflow-y-auto"
      style={{ backgroundColor: "#F5F7FA" }}
    >
      {/* Desktop: 2-col wrapper. Mobile: single col. */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-10">

        {/* Back button — desktop only via onBack */}
        <button
          onClick={onBack}
          className="hidden md:inline-flex items-center gap-1.5 text-sm mb-6 rounded focus:outline-none"
          style={{ color: "#0073e6", minHeight: 44 }}
          onFocus={(e) => { e.currentTarget.style.outline = "3px solid #0073e6"; e.currentTarget.style.outlineOffset = "2px"; }}
          onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
          aria-label="Voltar"
        >
          <ChevronLeft size={16} aria-hidden="true" />
          Voltar
        </button>

        <div className="flex flex-col md:flex-row gap-6">

          {/* ── LEFT COLUMN (or full-width on mobile) ── */}
          <div className="flex flex-col gap-5 md:w-72 flex-shrink-0">

            {/* ── Avatar + info ── */}
            <section aria-label="Informações do usuário" className="bg-white rounded-2xl p-5 flex flex-col items-center text-center gap-3" style={{ border: "1px solid #e8ecf0" }}>
              <div
                className="rounded-full flex items-center justify-center font-bold text-white"
                style={{ width: 80, height: 80, backgroundColor: "#0073e6", fontSize: 26 }}
                aria-label={`Avatar: ${initials}`}
              >
                {initials}
              </div>
              <div>
                <h1 className="font-bold" style={{ fontSize: 18, color: "#1a1a2e" }}>{displayName}</h1>
                <span
                  className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: isLoggedIn ? "#e6f2ff" : "#fffbeb",
                    color: isLoggedIn ? "#003366" : "#92400e",
                  }}
                >
                  {isLoggedIn ? "Membro" : "Perfil básico"}
                </span>
              </div>
            </section>

            {/* ── Account CTAs ── */}
            <div className="flex flex-col gap-2">
              {!isLoggedIn && (
                <button
                  className="w-full rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98] focus:outline-none"
                  style={{ backgroundColor: "#0073e6", minHeight: 48, fontSize: 15 }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#005bb5")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#0073e6")}
                  onFocus={(e) => { e.currentTarget.style.outline = "3px solid #0073e6"; e.currentTarget.style.outlineOffset = "2px"; }}
                  onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
                >
                  <LogIn size={18} aria-hidden="true" />
                  Criar conta / Entrar
                </button>
              )}
              <button
                className="w-full rounded-xl font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] focus:outline-none"
                style={{ border: "1.5px solid #fca5a5", backgroundColor: "white", color: "#dc2626", minHeight: 48, fontSize: 14 }}
                onFocus={(e) => { e.currentTarget.style.outline = "3px solid #dc2626"; e.currentTarget.style.outlineOffset = "2px"; }}
                onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
              >
                <LogOut size={16} aria-hidden="true" />
                {isLoggedIn ? "Sair da conta" : "Sair"}
              </button>
            </div>

            <p className="text-xs" style={{ color: "#4a4a6a", lineHeight: 1.5 }}>
              💡 Pra ajustar contraste, fonte e Libras, use os botões no topo da página.
            </p>
          </div>

          {/* ── RIGHT COLUMN (stacks below on mobile) ── */}
          <div className="flex flex-col gap-5 flex-1 min-w-0">

            {/* ── Minhas necessidades ── */}
            <section aria-label="Minhas necessidades" className="bg-white rounded-2xl p-5" style={{ border: "1px solid #e8ecf0" }}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold" style={{ fontSize: 15, color: "#2d2d44" }}>Minhas necessidades</h2>
                <button
                  onClick={onGoToCreateProfile}
                  aria-label="Editar necessidades"
                  className="flex items-center gap-1 text-xs font-semibold focus:outline-none rounded px-2 py-1"
                  style={{ color: "#0073e6" }}
                  onFocus={(e) => { e.currentTarget.style.outline = "3px solid #0073e6"; e.currentTarget.style.outlineOffset = "2px"; }}
                  onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
                >
                  <Edit2 size={13} aria-hidden="true" />
                  Editar
                </button>
              </div>

              {hasNeeds ? (
                <div className="flex flex-wrap gap-2">
                  {selectedNeeds.map((id) => {
                    const n = NEED_LABELS[id];
                    if (!n) return null;
                    return (
                      <span key={id} className="px-3 py-1 rounded-full text-xs font-semibold"
                        style={{ backgroundColor: n.bg, color: n.color }}>
                        {n.label}
                      </span>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center py-4 gap-3">
                  <span className="text-3xl" aria-hidden="true">🧩</span>
                  <p className="text-sm text-center" style={{ color: "#4a4a6a" }}>
                    Você ainda não definiu suas necessidades.
                  </p>
                  <button
                    onClick={onGoToCreateProfile}
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-white focus:outline-none"
                    style={{ backgroundColor: "#0073e6" }}
                    onFocus={(e) => { e.currentTarget.style.outline = "3px solid #0073e6"; e.currentTarget.style.outlineOffset = "2px"; }}
                    onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
                  >
                    Definir necessidades
                  </button>
                </div>
              )}
            </section>

            {/* ── Minha lista ── */}
            <section aria-label="Minha lista">
              <h2 className="font-bold mb-3" style={{ fontSize: 15, color: "#2d2d44" }}>
                <BookOpen size={15} className="inline mr-1.5 relative -top-px" aria-hidden="true" />
                Minha lista
              </h2>
              {SAVED_ITEMS.length > 0 ? (
                <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                  {SAVED_ITEMS.map((item) => <SavedCard key={item.id} item={item} />)}
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-6 flex flex-col items-center gap-2 text-center" style={{ border: "1px solid #e8ecf0" }}>
                  <span className="text-3xl" aria-hidden="true">🎬</span>
                  <p className="text-sm" style={{ color: "#4a4a6a" }}>
                    Você ainda não salvou nada. Explore o catálogo.
                  </p>
                </div>
              )}
            </section>

            {/* ── Histórico ── */}
            <section aria-label="Histórico de visualização">
              <h2 className="font-bold mb-3" style={{ fontSize: 15, color: "#2d2d44" }}>Histórico</h2>
              <div className="flex flex-col gap-2">
                {HISTORY.map((h) => (
                  <div key={h.id} className="bg-white rounded-xl px-3 py-2.5 flex items-center gap-3" style={{ border: "1px solid #e8ecf0" }}>
                    <div
                      className="rounded-lg overflow-hidden flex-shrink-0"
                      style={{ width: 44, height: 64, backgroundColor: h.posterColor }}
                    >
                      <img
                        src={h.poster}
                        alt={`Pôster de ${h.title}`}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        loading="lazy"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: "#1a1a2e" }}>{h.title}</p>
                      <p className="text-xs" style={{ color: "#4a4a6a" }}>Assistido em {h.platform}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
