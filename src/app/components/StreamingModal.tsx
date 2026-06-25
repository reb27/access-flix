import { useEffect, useRef, useState } from "react";
import { X, ExternalLink, Award } from "lucide-react";

interface Platform {
  id: string;
  name: string;
  color: string;
  bgColor: string;
  price: string;
  ad: boolean;
  leg: boolean;
  libras: boolean;
  best?: boolean;
  url: string;
}

const platforms: Platform[] = [
  {
    id: "netflix",
    name: "Netflix",
    color: "#E50914",
    bgColor: "#fff0f0",
    price: "A partir de R$18/mês",
    ad: true,
    leg: true,
    libras: false,
    url: "https://netflix.com",
  },
  {
    id: "prime",
    name: "Prime Video",
    color: "#00A8E0",
    bgColor: "#f0f9ff",
    price: "A partir de R$14/mês",
    ad: true,
    leg: true,
    libras: true,
    best: true,
    url: "https://primevideo.com",
  },
  {
    id: "disney",
    name: "Disney+",
    color: "#113CCF",
    bgColor: "#f0f3ff",
    price: "A partir de R$27/mês",
    ad: true,
    leg: true,
    libras: false,
    url: "https://disneyplus.com",
  },
  {
    id: "globoplay",
    name: "Globoplay",
    color: "#E8303B",
    bgColor: "#fff0f0",
    price: "A partir de R$22/mês",
    ad: false,
    leg: true,
    libras: true,
    url: "https://globoplay.globo.com",
  },
  {
    id: "crunchyroll",
    name: "Crunchyroll",
    color: "#F47521",
    bgColor: "#fff5ef",
    price: "A partir de R$16/mês",
    ad: false,
    leg: true,
    libras: false,
    url: "https://crunchyroll.com",
  },
  {
    id: "hbomax",
    name: "Max",
    color: "#6B0BBA",
    bgColor: "#f5f0ff",
    price: "A partir de R$20/mês",
    ad: true,
    leg: true,
    libras: false,
    url: "https://max.com/br",
  },
];

interface StreamingModalProps {
  title?: string;
  onClose: () => void;
  hasProfile?: boolean;
}

function AccessBadge({ available, label }: { available: boolean; label: string }) {
  return (
    <span
      className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-bold"
      style={{
        backgroundColor: available ? "#d4edda" : "#f3f4f6",
        color: available ? "#1a4d1a" : "#9ca3af",
      }}
      aria-label={`${label}: ${available ? "disponível" : "indisponível"}`}
    >
      {label}
    </span>
  );
}

export function StreamingModal({ title = "O Grande Filme Acessível", onClose, hasProfile = false }: StreamingModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeButtonRef.current?.focus();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key !== "Tab" || !modalRef.current) return;
      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="presentation"
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="streaming-title"
        className="relative w-full bg-white overflow-hidden"
        style={{
          maxWidth: 540,
          maxHeight: "90vh",
          borderRadius: 20,
          boxShadow: "0 24px 64px rgba(0,0,0,0.25)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 flex-shrink-0"
          style={{ borderBottom: "1px solid #e8ecf0" }}
        >
          <div>
            <h2 id="streaming-title" className="font-bold" style={{ color: "#1a1a2e", fontSize: 18 }}>
              Disponível em
            </h2>
            <p className="text-sm" style={{ color: "#4a4a6a" }}>{title}</p>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Fechar"
            className="flex items-center justify-center rounded-xl transition-colors hover:bg-gray-100 focus:outline-none"
            style={{ width: 44, height: 44 }}
            onFocus={(e) => { e.currentTarget.style.outline = "3px solid #0073e6"; e.currentTarget.style.outlineOffset = "2px"; }}
            onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
          >
            <X size={20} color="#4a4a6a" aria-hidden="true" />
          </button>
        </div>

        {/* No profile banner */}
        {!hasProfile && (
          <div
            className="mx-4 mt-3 px-4 py-3 rounded-xl flex items-center gap-3"
            style={{ backgroundColor: "#fffbeb", border: "1px solid #fde68a" }}
          >
            <span style={{ fontSize: 18 }} aria-hidden="true">💡</span>
            <p className="text-sm" style={{ color: "#92400e" }}>
              <strong>Crie um perfil</strong> para salvar onde você já assiste e personalizar suas recomendações.
            </p>
          </div>
        )}

        {/* Platform grid */}
        <div className="overflow-y-auto p-4 flex-1">
          <div className="grid grid-cols-2 gap-3">
            {platforms.map((p) => (
              <PlatformCard key={p.id} platform={p} />
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div
          className="px-6 py-3 flex-shrink-0"
          style={{ borderTop: "1px solid #e8ecf0" }}
        >
          <p className="text-xs text-center" style={{ color: "#9ca3af" }}>
            O AccessFlix não é responsável pelo conteúdo das plataformas externas.
          </p>
        </div>
      </div>
    </div>
  );
}

function PlatformCard({ platform: p }: { platform: Platform }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative rounded-2xl p-4 flex flex-col gap-3 transition-all"
      style={{
        backgroundColor: hovered ? p.bgColor : "#fafafa",
        border: `2px solid ${hovered ? p.color : "#e2e8f0"}`,
        boxShadow: hovered ? `0 4px 16px ${p.color}22` : "none",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Best for accessibility badge */}
      {p.best && (
        <div
          className="absolute -top-2 left-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-white"
          style={{ fontSize: 10, fontWeight: 700, backgroundColor: "#5ba300" }}
          aria-label="Melhor para acessibilidade"
        >
          <Award size={10} aria-hidden="true" />
          Melhor para Acessibilidade
        </div>
      )}

      {/* Platform name + logo placeholder */}
      <div className="flex items-center gap-2">
        <div
          className="rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ width: 40, height: 40, backgroundColor: p.color }}
          aria-hidden="true"
        >
          <span className="text-white font-black" style={{ fontSize: 11 }}>
            {p.name.slice(0, 2).toUpperCase()}
          </span>
        </div>
        <div>
          <div className="font-bold text-sm" style={{ color: "#1a1a2e" }}>{p.name}</div>
          <div className="text-xs" style={{ color: "#4a4a6a" }}>{p.price}</div>
        </div>
      </div>

      {/* Accessibility badges */}
      <div className="flex flex-wrap gap-1">
        <AccessBadge available={p.ad} label="AD" />
        <AccessBadge available={p.leg} label="Leg" />
        <AccessBadge available={p.libras} label="Libras" />
      </div>

      {/* Open button */}
      <a
        href={p.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-1.5 rounded-xl py-2 text-white text-xs font-semibold transition-all focus:outline-none"
        style={{
          backgroundColor: p.color,
          minHeight: 36,
        }}
        onFocus={(e) => { e.currentTarget.style.outline = "3px solid #0073e6"; e.currentTarget.style.outlineOffset = "2px"; }}
        onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
        aria-label={`Abrir ${p.name} em nova aba`}
      >
        Abrir
        <ExternalLink size={12} aria-hidden="true" />
      </a>
    </div>
  );
}
