import { useEffect, useRef, useState } from "react";
import { X, Eye, Ear, Brain, Hand, Check } from "lucide-react";

interface OnboardingModalProps {
  onClose: () => void;
  onCreateProfile: (selected: string[]) => void;
  /** Navigate to the full profile creation flow instead of inline selection */
  onGoToCreateProfile?: () => void;
}

const categories = [
  {
    id: "visual",
    icon: Eye,
    label: "Visual",
    description: "Audiodescrição, alto contraste",
    accentColor: "#e6308a",
    bgColor: "#fce4f0",
  },
  {
    id: "auditiva",
    icon: Ear,
    label: "Auditiva",
    description: "Legendas, Libras",
    accentColor: "#0073e6",
    bgColor: "#e6f2ff",
  },
  {
    id: "cognitiva",
    icon: Brain,
    label: "Cognitiva",
    description: "Linguagem simplificada",
    accentColor: "#5ba300",
    bgColor: "#edf7e0",
  },
  {
    id: "motora",
    icon: Hand,
    label: "Motora",
    description: "Controles adaptativos",
    accentColor: "#f5a623",
    bgColor: "#fff4e0",
  },
];

export function OnboardingModal({ onClose, onCreateProfile, onGoToCreateProfile }: OnboardingModalProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  /* Focus trap */
  useEffect(() => {
    closeButtonRef.current?.focus();

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key !== "Tab" || !modalRef.current) return;

      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="presentation"
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
        className="relative w-full bg-white flex flex-col"
        style={{
          maxWidth: 480,
          borderRadius: 20,
          padding: "32px",
          boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
        }}
      >
        {/* Close button */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-4 right-4 flex items-center justify-center rounded-xl transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2"
          style={{
            width: 44, height: 44,
            ["--tw-ring-color" as string]: "#0073e6",
          }}
        >
          <X size={20} color="#6b6b8a" aria-hidden="true" />
        </button>

        {/* Icon — single UserCircle, perfectly centered, no transforms */}
        <div className="flex justify-center mb-6" aria-hidden="true">
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              backgroundColor: "#e8f0fe",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {/* ti-user-circle equivalent: outer ring + head circle + body arc */}
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0073e6"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="10" r="3" />
              <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2
          id="onboarding-title"
          className="text-center mb-2"
          style={{ fontSize: 22, fontWeight: 700, color: "#1a1a2e", lineHeight: 1.3 }}
        >
          Experiência personalizada para você
        </h2>
        <p className="text-center mb-8" style={{ fontSize: 15, color: "#4a4a6a", lineHeight: 1.5 }}>
          Crie seu perfil e receba recomendações adaptadas às suas necessidades.
        </p>

        {/* 2×2 grid of categories */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selected.includes(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => toggle(cat.id)}
                aria-pressed={isSelected}
                aria-label={`Selecionar acessibilidade ${cat.label}${isSelected ? ", selecionado" : ""}`}
                className="relative flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-all focus:outline-none"
                style={{
                  backgroundColor: isSelected ? cat.bgColor : "#fafafa",
                  borderColor: isSelected ? cat.accentColor : "#e2e8f0",
                  boxShadow: isSelected ? `0 4px 12px ${cat.accentColor}33` : "none",
                  minHeight: 44,
                }}
                onFocus={(e) => { e.currentTarget.style.outline = `3px solid ${cat.accentColor}`; e.currentTarget.style.outlineOffset = "2px"; }}
                onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
              >
                {isSelected && (
                  <div
                    className="absolute top-2 right-2 rounded-full flex items-center justify-center"
                    style={{ width: 20, height: 20, backgroundColor: cat.accentColor }}
                    aria-hidden="true"
                  >
                    <Check size={12} color="white" />
                  </div>
                )}
                <div
                  className="rounded-xl flex items-center justify-center"
                  style={{
                    width: 48, height: 48,
                    backgroundColor: isSelected ? cat.accentColor : "#f0f0f8",
                  }}
                  aria-hidden="true"
                >
                  <Icon size={24} color={isSelected ? "white" : cat.accentColor} />
                </div>
                <span className="text-sm font-semibold" style={{ color: isSelected ? cat.accentColor : "#1a1a2e" }}>
                  {cat.label}
                </span>
                <span className="text-xs text-center leading-tight" style={{ color: "#6b6b8a" }}>
                  {cat.description}
                </span>
              </button>
            );
          })}
        </div>

        {/* Primary CTA — navigates to full CreateProfile page */}
        <button
          onClick={() => onGoToCreateProfile ? onGoToCreateProfile() : onCreateProfile(selected)}
          className="w-full rounded-xl font-semibold text-white mb-3 transition-all active:scale-[0.98] focus:outline-none focus:ring-2"
          style={{
            backgroundColor: "#0073e6",
            padding: "14px 24px",
            fontSize: 16,
            ["--tw-ring-color" as string]: "#0073e6",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#005bb5")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#0073e6")}
          onFocus={(e) => { e.currentTarget.style.outline = "3px solid #0073e6"; e.currentTarget.style.outlineOffset = "2px"; }}
          onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
        >
          Criar meu perfil
        </button>

        {/* Secondary */}
        <button
          onClick={onClose}
          className="w-full text-center underline focus:outline-none focus:ring-2 rounded py-2"
          style={{ color: "#6b6b8a", fontSize: 14, ["--tw-ring-color" as string]: "#0073e6" }}
          onFocus={(e) => { e.currentTarget.style.outline = "3px solid #0073e6"; e.currentTarget.style.outlineOffset = "2px"; }}
          onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
        >
          Continuar sem perfil
        </button>
      </div>
    </div>
  );
}
