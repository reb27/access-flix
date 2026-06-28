import { useEffect, useRef } from "react";
import { X, Sparkles, Volume2, Captions, Hand, BookOpen } from "lucide-react";

interface OnboardingModalProps {
  onClose: () => void;
  /* Kept for compatibility with existing callers; we always use onGoToCreateProfile now */
  onCreateProfile?: (selected: string[]) => void;
  onGoToCreateProfile?: () => void;
}

export function OnboardingModal({ onClose, onGoToCreateProfile }: OnboardingModalProps) {
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
          <X size={20} color="#4a4a6a" aria-hidden="true" />
        </button>

        {/* Welcome glyph — friendly waving hand on a soft circle */}
        <div className="flex justify-center mb-6" aria-hidden="true">
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #0073e6 0%, #5b3eb8 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 12px 28px rgba(0,115,230,0.25)",
              fontSize: 44,
              lineHeight: 1,
            }}
          >
            👋
          </div>
        </div>

        {/* Title */}
        <h2
          id="onboarding-title"
          className="text-center mb-3"
          style={{ fontSize: 24, fontWeight: 800, color: "#1a1a2e", lineHeight: 1.2 }}
        >
          Bem-vindo ao AccessFlix
        </h2>
        <p className="text-center mb-6" style={{ fontSize: 15, color: "#4a4a6a", lineHeight: 1.5 }}>
          Hub de filmes, séries, animes, jogos e documentários com recursos de acessibilidade.
          Crie seu perfil em 3 passos rápidos e receba conteúdo adaptado a você.
        </p>

        {/* What we deliver */}
        <ul className="flex flex-col gap-2 mb-6">
          {[
            { Icon: Volume2,  text: "Audiodescrição em PT-BR" },
            { Icon: Captions, text: "Legendas descritivas e closed caption" },
            { Icon: Hand,     text: "Janela de intérprete de Libras" },
            { Icon: BookOpen, text: "Linguagem simplificada e modo dislexia" },
          ].map(({ Icon, text }, i) => (
            <li key={i} className="flex items-center gap-3 rounded-xl px-3 py-2" style={{ backgroundColor: "#f5f7fa" }}>
              <span className="flex items-center justify-center rounded-lg flex-shrink-0" style={{ width: 32, height: 32, backgroundColor: "#e6f2ff", color: "#0073e6" }} aria-hidden="true">
                <Icon size={18} />
              </span>
              <span className="text-sm" style={{ color: "#1a1a2e" }}>{text}</span>
            </li>
          ))}
        </ul>

        {/* Primary CTA — single action, no redundancy */}
        <button
          type="button"
          onClick={() => onGoToCreateProfile?.()}
          className="af-focus w-full rounded-xl font-bold text-white mb-3 transition-transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          style={{ backgroundColor: "#0073e6", padding: "14px 24px", fontSize: 16, minHeight: 48 }}
        >
          <Sparkles size={18} aria-hidden="true" />
          Criar meu perfil
        </button>

        <button
          type="button"
          onClick={onClose}
          className="af-focus w-full text-center rounded py-2"
          style={{ color: "#4a4a6a", fontSize: 14, minHeight: 44, textDecoration: "underline" }}
        >
          Continuar sem perfil
        </button>
      </div>
    </div>
  );
}
