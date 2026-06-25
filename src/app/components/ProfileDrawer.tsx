import { useEffect, useRef, useState } from "react";
import { X, Star, Check } from "lucide-react";

export type DisabilityProfile = {
  visual: boolean;
  auditiva: boolean;
  cognitiva: boolean;
  motora: boolean;
};

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  disabilityProfile: DisabilityProfile;
  onProfileChange: (profile: DisabilityProfile) => void;
}

const recommendedContent = [
  { id: 1, title: "Planeta dos Macacos: O Reinado", rating: 4.8 },
  { id: 2, title: "Duna: Parte Dois", rating: 4.9 },
];

/* ── Need cards definition ── */
type NeedId =
  | "baixa_visao" | "cegueira" | "daltonismo"
  | "surdez" | "baixa_audicao" | "libras"
  | "tdah" | "autismo" | "dislexia" | "ansiedade" | "def_intelectual"
  | "motora_fina" | "cadeirante" | "eye_tracking";

interface NeedCard {
  id: NeedId;
  label: string;
  group: "visual" | "auditiva" | "cognitiva" | "motora";
  groupColor: string;
  Icon: React.FC<{ size?: number; color?: string }>;
}

/* ── Inline SVG icon components (Tabler-style outline) ── */
const IconEye: React.FC<{ size?: number; color?: string }> = ({ size = 22, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconEyeOff: React.FC<{ size?: number; color?: string }> = ({ size = 22, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const IconPalette: React.FC<{ size?: number; color?: string }> = ({ size = 22, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="13.5" cy="6.5" r=".5" fill={color} />
    <circle cx="17.5" cy="10.5" r=".5" fill={color} />
    <circle cx="8.5" cy="7.5" r=".5" fill={color} />
    <circle cx="6.5" cy="12.5" r=".5" fill={color} />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
  </svg>
);

const IconEar: React.FC<{ size?: number; color?: string }> = ({ size = 22, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 6-6 10a3.5 3.5 0 0 1-7 0" />
    <path d="M15 8.5a2.5 2.5 0 0 0-5 0v1l4.5 4.5" />
  </svg>
);

const IconEarOff: React.FC<{ size?: number; color?: string }> = ({ size = 22, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 8.5a6.5 6.5 0 0 1 11.985-2.014" />
    <path d="M8.5 8.5a2.5 2.5 0 0 1 4.5-1.45" />
    <path d="M15 8.5a2.5 2.5 0 0 0-.5-1.5" />
    <path d="m19 19-4.5-4.5" />
    <path d="M13 13c0 4-6 4-6 8a3.5 3.5 0 0 0 6.865.956" />
    <line x1="2" y1="2" x2="22" y2="22" />
  </svg>
);

const IconHandStop: React.FC<{ size?: number; color?: string }> = ({ size = 22, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
    <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
    <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
    <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
  </svg>
);

const IconBolt: React.FC<{ size?: number; color?: string }> = ({ size = 22, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const IconPuzzle: React.FC<{ size?: number; color?: string }> = ({ size = 22, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20.5 7l-5-5-1.5 1.5L12.5 2 7 7.5l1.5 1.5L7 10.5l5 5 1.5-1.5 1.5 1.5 5.5-5.5-1.5-1.5z" />
    <path d="M9.5 14.5l-5 5" />
  </svg>
);

const IconBook: React.FC<{ size?: number; color?: string }> = ({ size = 22, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const IconHeart: React.FC<{ size?: number; color?: string }> = ({ size = 22, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const IconBrain: React.FC<{ size?: number; color?: string }> = ({ size = 22, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
  </svg>
);

const IconMouse: React.FC<{ size?: number; color?: string }> = ({ size = 22, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="5" y="2" width="14" height="20" rx="7" />
    <path d="M12 6v4" />
  </svg>
);

const IconWheelchair: React.FC<{ size?: number; color?: string }> = ({ size = 22, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="4" r="1" />
    <path d="M9 9h4l2 7" />
    <path d="M9 9 7 18" />
    <path d="M15 16a5 5 0 1 1-6 0" />
  </svg>
);

const IconEyeScan: React.FC<{ size?: number; color?: string }> = ({ size = 22, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 7V5a2 2 0 0 1 2-2h2" />
    <path d="M17 3h2a2 2 0 0 1 2 2v2" />
    <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
    <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
    <circle cx="12" cy="12" r="1" />
    <path d="M5 12s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" />
  </svg>
);

const NEED_CARDS: NeedCard[] = [
  /* Visual */
  { id: "baixa_visao",  label: "Baixa visão",   group: "visual",   groupColor: "#e6308a", Icon: IconEye },
  { id: "cegueira",     label: "Cegueira",       group: "visual",   groupColor: "#e6308a", Icon: IconEyeOff },
  { id: "daltonismo",   label: "Daltonismo",     group: "visual",   groupColor: "#e6308a", Icon: IconPalette },
  /* Auditiva */
  { id: "surdez",       label: "Surdez",         group: "auditiva", groupColor: "#0073e6", Icon: IconEarOff },
  { id: "baixa_audicao",label: "Baixa audição",  group: "auditiva", groupColor: "#0073e6", Icon: IconEar },
  { id: "libras",       label: "Usa Libras",     group: "auditiva", groupColor: "#0073e6", Icon: IconHandStop },
  /* Cognitiva / Neuro */
  { id: "tdah",          label: "TDAH",                  group: "cognitiva", groupColor: "#5ba300", Icon: IconBolt },
  { id: "autismo",       label: "Autismo (TEA)",          group: "cognitiva", groupColor: "#5ba300", Icon: IconPuzzle },
  { id: "dislexia",      label: "Dislexia",               group: "cognitiva", groupColor: "#5ba300", Icon: IconBook },
  { id: "ansiedade",     label: "Ansiedade",               group: "cognitiva", groupColor: "#5ba300", Icon: IconHeart },
  { id: "def_intelectual",label: "Def. Intelectual",      group: "cognitiva", groupColor: "#5ba300", Icon: IconBrain },
  /* Motora */
  { id: "motora_fina",   label: "Motora fina",   group: "motora",   groupColor: "#f5a623", Icon: IconMouse },
  { id: "cadeirante",    label: "Cadeirante",    group: "motora",   groupColor: "#f5a623", Icon: IconWheelchair },
  { id: "eye_tracking",  label: "Eye tracking",  group: "motora",   groupColor: "#f5a623", Icon: IconEyeScan },
];

const GROUP_LABELS: Record<string, string> = {
  visual:   "👁 Visual",
  auditiva: "👂 Auditiva",
  cognitiva:"🧠 Cognitiva / Neuro",
  motora:   "✋ Motora",
};

/* ── NeedCardButton ── */
function NeedCardButton({
  card,
  selected,
  onToggle,
}: {
  card: NeedCard;
  selected: boolean;
  onToggle: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const { Icon, label, groupColor } = card;

  return (
    <button
      onClick={onToggle}
      aria-pressed={selected}
      aria-label={`${label}${selected ? ", selecionado" : ""}`}
      className="relative flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 transition-all focus:outline-none"
      style={{
        padding: "12px 8px 10px",
        backgroundColor: selected ? `${groupColor}18` : hovered ? "#f0f4ff" : "#f8fafc",
        borderColor: selected ? groupColor : hovered ? "#b0c4de" : "#d0d5e0",
        boxShadow: selected ? `0 2px 10px ${groupColor}33` : "none",
        minHeight: 76,
        transition: "all 0.15s ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={(e) => { e.currentTarget.style.outline = `3px solid ${groupColor}`; e.currentTarget.style.outlineOffset = "2px"; }}
      onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
    >
      {/* Checkmark */}
      {selected && (
        <div
          className="absolute top-1.5 right-1.5 rounded-full flex items-center justify-center"
          style={{ width: 16, height: 16, backgroundColor: groupColor }}
          aria-hidden="true"
        >
          <Check size={10} color="white" />
        </div>
      )}

      {/* Icon container */}
      <div
        className="flex items-center justify-center rounded-lg"
        style={{
          width: 40, height: 40,
          backgroundColor: selected ? groupColor : hovered ? `${groupColor}22` : "#f0f0f8",
        }}
        aria-hidden="true"
      >
        <Icon size={20} color={selected ? "white" : groupColor} />
      </div>

      {/* Label */}
      <span
        className="text-center leading-tight"
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: selected ? groupColor : "#2d2d44",
          maxWidth: 72,
        }}
      >
        {label}
      </span>
    </button>
  );
}

export function ProfileDrawer({ isOpen, onClose, disabilityProfile, onProfileChange }: ProfileDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const [selectedNeeds, setSelectedNeeds] = useState<Set<NeedId>>(new Set());

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleEscape);
    drawerRef.current?.querySelector<HTMLElement>('button')?.focus();
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggleNeed = (id: NeedId) => {
    setSelectedNeeds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

    /* Propagate to parent's disability profile */
    const visualIds: NeedId[] = ["baixa_visao", "cegueira", "daltonismo"];
    const auditivaIds: NeedId[] = ["surdez", "baixa_audicao", "libras"];
    const cognitivaIds: NeedId[] = ["tdah", "autismo", "dislexia", "ansiedade", "def_intelectual"];
    const motoraIds: NeedId[] = ["motora_fina", "cadeirante", "eye_tracking"];

    const nextSet = new Set(selectedNeeds);
    if (nextSet.has(id)) nextSet.delete(id); else nextSet.add(id);

    onProfileChange({
      visual:   visualIds.some((x) => nextSet.has(x)),
      auditiva: auditivaIds.some((x) => nextSet.has(x)),
      cognitiva: cognitivaIds.some((x) => nextSet.has(x)),
      motora:   motoraIds.some((x) => nextSet.has(x)),
    });
  };

  const groups = ["visual", "auditiva", "cognitiva", "motora"] as const;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        aria-hidden="true"
        style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", zIndex: 40 }}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-label="Meu Perfil de Acessibilidade"
        className="fixed right-0 top-0 h-full bg-white shadow-2xl z-50 flex flex-col"
        style={{ width: "min(380px, 95vw)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #e8ecf0" }}>
          <div>
            <h2 className="font-bold" style={{ color: "#1a1a2e", fontSize: 18 }}>Meu Perfil</h2>
            <p className="text-xs mt-0.5" style={{ color: "#6b6b8a" }}>Selecione suas necessidades</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors focus:outline-none"
            style={{ minWidth: 44, minHeight: 44 }}
            onFocus={(e) => { e.currentTarget.style.outline = "3px solid #0073e6"; e.currentTarget.style.outlineOffset = "2px"; }}
            onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
          >
            <X size={20} color="#6b6b8a" aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-5">

          {/* Section label */}
          <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#6b6b8a" }}>
            Minhas necessidades
          </p>

          {/* Cards by group */}
          <div className="flex flex-col gap-5 mb-6">
            {groups.map((group) => {
              const cards = NEED_CARDS.filter((c) => c.group === group);
              return (
                <div key={group}>
                  <p className="text-xs font-bold mb-2.5" style={{ color: "#2d2d44" }}>
                    {GROUP_LABELS[group]}
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {cards.map((card) => (
                      <NeedCardButton
                        key={card.id}
                        card={card}
                        selected={selectedNeeds.has(card.id)}
                        onToggle={() => toggleNeed(card.id)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Divider */}
          <div className="mb-4" style={{ borderTop: "1px solid #e8ecf0" }} />

          {/* Saved preferences */}
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#6b6b8a" }}>
            Minhas preferências salvas
          </p>
          <div className="flex flex-col gap-3">
            {recommendedContent.map((item) => (
              <div key={item.id} className="rounded-xl p-4 flex items-center gap-3" style={{ backgroundColor: "#f8fafc", border: "1px solid #e8ecf0" }}>
                <div className="w-10 h-14 rounded-lg flex-shrink-0" style={{ backgroundColor: "#dde8f8" }} aria-hidden="true" />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold mb-1" style={{ color: "#1a1a2e" }}>{item.title}</h4>
                  <div className="flex items-center gap-1">
                    <Star size={12} fill="#f5a623" color="#f5a623" aria-hidden="true" />
                    <span className="text-xs font-bold" style={{ color: "#1a1a2e" }}>{item.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4" style={{ borderTop: "1px solid #e8ecf0" }}>
          {selectedNeeds.size > 0 && (
            <p className="text-xs text-center mb-3" style={{ color: "#0073e6" }}>
              {selectedNeeds.size} necessidade{selectedNeeds.size > 1 ? "s" : ""} selecionada{selectedNeeds.size > 1 ? "s" : ""}
            </p>
          )}
          <button
            onClick={onClose}
            className="w-full rounded-xl text-white font-semibold transition-all active:scale-[0.98] focus:outline-none"
            style={{
              backgroundColor: "#b51963",
              padding: "14px 24px",
              fontSize: 16,
              minHeight: 48,
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#9a1450")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#b51963")}
            onFocus={(e) => { e.currentTarget.style.outline = "3px solid #0073e6"; e.currentTarget.style.outlineOffset = "2px"; }}
            onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
          >
            Salvar e fechar
          </button>
        </div>
      </div>
    </>
  );
}
