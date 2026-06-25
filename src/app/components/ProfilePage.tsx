import { useState } from "react";
import { ChevronLeft, Star, Edit2, Sun, Type, Hand, Moon, LogIn, LogOut, BookOpen } from "lucide-react";

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

/* ── Saved items ── */
const SAVED_ITEMS = [
  { id: 1, title: "The Last of Us",   rating: 4.7, badges: ["Leg","Libras"], posterColor: "#14b8a6" },
  { id: 2, title: "Hi-Fi Rush",       rating: 4.9, badges: ["AD","Leg"],     posterColor: "#6366f1" },
  { id: 3, title: "Wicked",           rating: 4.8, badges: ["AD","Leg","Libras"], posterColor: "#ec4899" },
];

const HISTORY = [
  { id: 1, title: "Oppenheimer",        platform: "Prime Video", posterColor: "#8b5cf6" },
  { id: 2, title: "Duna: Parte Dois",   platform: "Netflix",     posterColor: "#f59e0b" },
  { id: 3, title: "Inside Out 2",       platform: "Disney+",     posterColor: "#ec4899" },
];

/* ── Resource toggle ── */
function ResourceToggle({
  label, icon, on, onChange,
}: { label: string; icon: React.ReactNode; on: boolean; onChange: () => void }) {
  return (
    <div
      className="flex items-center justify-between rounded-xl px-4"
      style={{
        minHeight: 52,
        backgroundColor: on ? "#f0f4ff" : "#fafafa",
        border: `1.5px solid ${on ? "#0073e6" : "#e2e8f0"}`,
        transition: "all 0.15s ease",
      }}
    >
      <div className="flex items-center gap-3">
        <span style={{ color: on ? "#0073e6" : "#9ca3af" }} aria-hidden="true">{icon}</span>
        <span className="text-sm font-medium" style={{ color: on ? "#1a1a2e" : "#4a4a6a" }}>{label}</span>
      </div>
      <button
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={onChange}
        className="relative flex-shrink-0 rounded-full focus:outline-none"
        style={{
          width: 48, height: 26,
          backgroundColor: on ? "#0073e6" : "#d0d5e0",
          transition: "background-color 0.2s ease",
          border: "none",
          cursor: "pointer",
        }}
        onFocus={(e) => { e.currentTarget.style.outline = "3px solid #0073e6"; e.currentTarget.style.outlineOffset = "2px"; }}
        onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
      >
        <span
          className="absolute top-[2px] rounded-full bg-white shadow-sm"
          style={{ width: 22, height: 22, left: on ? 24 : 2, transition: "left 0.2s ease" }}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}

/* ── Saved poster card ── */
function SavedCard({ item }: { item: typeof SAVED_ITEMS[0] }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="flex-shrink-0 flex flex-col" style={{ width: 100 }}>
      <div
        className="rounded-xl overflow-hidden flex-shrink-0"
        style={{ width: 100, height: 140, backgroundColor: item.posterColor }}
        aria-hidden="true"
      >
        {!failed ? (
          <div className="w-full h-full flex items-center justify-center" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
              <path d="M6 34L16 20L22 28L28 16L36 34H6Z" fill="white" fillOpacity="0.22" />
              <circle cx="14" cy="13" r="5" fill="white" fillOpacity="0.22" />
            </svg>
          </div>
        ) : null}
      </div>
      <p className="text-xs font-semibold mt-1.5 leading-tight line-clamp-2" style={{ color: "#1a1a2e" }}>{item.title}</p>
      <div className="flex items-center gap-1 mt-0.5">
        <Star size={10} fill="#f5a623" color="#f5a623" aria-hidden="true" />
        <span className="text-xs font-bold" style={{ color: "#6b6b8a" }}>{item.rating}</span>
      </div>
      <div className="flex flex-wrap gap-0.5 mt-1">
        {item.badges.slice(0, 2).map((b) => (
          <span key={b} className="font-bold px-1 py-0.5 rounded"
            style={{ backgroundColor: badgeColors[b]?.bg ?? "#f0f0f0", color: badgeColors[b]?.text ?? "#333", fontSize: 9 }}>
            {b}
          </span>
        ))}
      </div>
    </div>
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
  const [resources, setResources] = useState({
    contrast:   false,
    fontLarge:  false,
    vlibras:    false,
    darkMode:   false,
  });

  const toggle = (key: keyof typeof resources) =>
    setResources((p) => ({ ...p, [key]: !p[key] }));

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

            {/* ── Recursos ativos — toggles ── */}
            <section aria-label="Recursos de acessibilidade ativos">
              <h2 className="font-bold mb-3" style={{ fontSize: 15, color: "#2d2d44" }}>Recursos ativos</h2>
              <div className="flex flex-col gap-2">
                <ResourceToggle label="Alto Contraste" icon={<Sun size={18} />} on={resources.contrast} onChange={() => toggle("contrast")} />
                <ResourceToggle label="Fonte grande"   icon={<Type size={18} />}  on={resources.fontLarge} onChange={() => toggle("fontLarge")} />
                <ResourceToggle label="VLibras"        icon={<Hand size={18} />}  on={resources.vlibras}  onChange={() => toggle("vlibras")} />
                <ResourceToggle label="Modo escuro"    icon={<Moon size={18} />}  on={resources.darkMode} onChange={() => toggle("darkMode")} />
              </div>
            </section>
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
                  <p className="text-sm text-center" style={{ color: "#6b6b8a" }}>
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
                  <p className="text-sm" style={{ color: "#6b6b8a" }}>
                    Você ainda não salvou nada. Explore o catálogo.
                  </p>
                </div>
              )}
            </section>

            {/* ── Histórico ── */}
            <section aria-label="Histórico de visualização">
              <h2 className="font-bold mb-3" style={{ fontSize: 15, color: "#2d2d44" }}>Histórico</h2>
              <div className="flex flex-col gap-2">
                {HISTORY.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl px-4 py-3 flex items-center gap-3" style={{ border: "1px solid #e8ecf0" }}>
                    <div
                      className="rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ width: 40, height: 40, backgroundColor: item.posterColor }}
                      aria-hidden="true"
                    >
                      <svg width="20" height="20" viewBox="0 0 40 40" fill="none">
                        <path d="M6 34L16 20L22 28L28 16L36 34H6Z" fill="white" fillOpacity="0.3" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: "#1a1a2e" }}>{item.title}</p>
                      <p className="text-xs" style={{ color: "#6b6b8a" }}>Assistido em {item.platform}</p>
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
