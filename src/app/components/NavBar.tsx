import { useState, useRef, useEffect } from "react";
import { Sun, Type, Hand, UserCircle, Menu, X, SlidersHorizontal, Eye, Ear, Brain } from "lucide-react";

type Page = "home" | "listing" | "detail" | "watch" | "profile" | "search" | "highcontrast";
type FontSize = "small" | "medium" | "large";
type FontSpacing = "normal" | "wide";

interface NavBarProps {
  onNavigate: (page: Page) => void;
  currentPage?: Page;
  librasActive: boolean;
  onLibrasToggle: () => void;
  highContrast: boolean;
  onContrastToggle: () => void;
  fontSize: FontSize;
  fontSpacing: FontSpacing;
  onFontSizeChange: (size: FontSize) => void;
  onFontSpacingChange: (spacing: FontSpacing) => void;
  onProfileClick: () => void;
  /* search state — lifted to App */
  searchQuery: string;
  searchActive: boolean;
  onSearchChange: (q: string) => void;
  onSearchActivate: () => void;
  onSearchDeactivate: () => void;
  activeSearchChip: string | null;
  onSearchChipChange: (id: string | null) => void;
}

/* ── Logo SVG ── */
function AccessFlixLogo({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2.5 flex-shrink-0 focus:outline-none rounded-lg"
      style={{ outline: "none", padding: "4px" }}
      onFocus={(e) => (e.currentTarget.style.outline = "3px solid #0073e6")}
      onBlur={(e) => (e.currentTarget.style.outline = "none")}
      aria-label="AccessFlix — página inicial"
    >
      {/*
        Container 36×36, border-radius 9.
        Triangle vertices: (13,9) (13,27) (30,18)
        Centroid X = (13+13+30)/3 = 18.67 — 0.67px right of center (optical compensation).
        Centroid Y = (9+27+18)/3 = 18 — exactly centered vertically.
      */}
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="lg1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0073e6" />
            <stop offset="100%" stopColor="#005bb5" />
          </linearGradient>
        </defs>
        <rect width="36" height="36" rx="9" fill="url(#lg1)" />
        {/* Play triangle — centroid at (18.67, 18), optically centered */}
        <path d="M13 9L13 27L30 18Z" fill="white" />
        {/* Accessibility arc */}
        <path d="M24 7.5C28.5 9.5 31 13.5 31 18" stroke="white" strokeWidth="1.6" strokeLinecap="round" fill="none" strokeOpacity="0.6" />
        <circle cx="30" cy="7" r="1.7" fill="white" fillOpacity="0.6" />
      </svg>
      <span
        style={{ fontSize: "21px", fontWeight: 800, color: "#1a1a2e", letterSpacing: "-0.02em", lineHeight: 1 }}
      >
        Access<span style={{ color: "#0073e6" }}>Flix</span>
      </span>
    </button>
  );
}

/* ── NavButton ── */
interface NavButtonProps {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick: () => void;
  ariaLabel: string;
  ariaPressed?: boolean;
}

function NavButton({ label, icon, active = false, onClick, ariaLabel, ariaPressed }: NavButtonProps) {
  const [hovered, setHovered] = useState(false);
  const style: React.CSSProperties = active
    ? { backgroundColor: "#0073e6", border: "1.5px solid #0073e6", color: "#ffffff" }
    : hovered
    ? { backgroundColor: "#f0f4ff", border: "1.5px solid #0073e6", color: "#0073e6" }
    : { backgroundColor: "#ffffff", border: "1.5px solid #d0d5e0", color: "#4a4a6a" };

  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={(e) => { e.currentTarget.style.outline = "3px solid #0073e6"; e.currentTarget.style.outlineOffset = "2px"; }}
      onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
      className="relative flex flex-col items-center gap-0.5 rounded-[10px] transition-all flex-shrink-0"
      style={{ ...style, padding: "8px 14px", minHeight: 44, minWidth: 44, fontSize: 13, fontWeight: 500, outline: "none", transition: "all 0.2s ease" }}
    >
      <span aria-hidden="true">{icon}</span>
      <span style={{ fontSize: 12, lineHeight: 1.2 }}>{label}</span>
      {active && (
        <div className="absolute bottom-1 right-1 rounded-full" style={{ width: 8, height: 8, backgroundColor: "#22c55e" }} aria-hidden="true" />
      )}
    </button>
  );
}

/* ── Search chips ── */
const SEARCH_CHIPS = [
  { id: "visual",    label: "Visual",    Icon: Eye,   color: "#e6308a" },
  { id: "auditiva",  label: "Auditiva",  Icon: Ear,   color: "#0073e6" },
  { id: "cognitiva", label: "Cognitiva", Icon: Brain, color: "#5ba300" },
  { id: "motora",    label: "Motora",    Icon: Hand,  color: "#f5a623" },
];

export function NavBar({
  onNavigate,
  currentPage,
  librasActive,
  onLibrasToggle,
  highContrast,
  onContrastToggle,
  fontSize,
  fontSpacing,
  onFontSizeChange,
  onFontSpacingChange,
  onProfileClick,
  searchQuery,
  searchActive,
  onSearchChange,
  onSearchActivate,
  onSearchDeactivate,
  activeSearchChip,
  onSearchChipChange,
}: NavBarProps) {
  const isHighContrast = highContrast;
  const [fontPopoverOpen, setFontPopoverOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const fontButtonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  /* Focus input when search activates */
  useEffect(() => {
    if (searchActive) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [searchActive]);

  /* Close popover on outside click / ESC */
  useEffect(() => {
    if (!fontPopoverOpen) return;
    const handleOut = (e: MouseEvent) => {
      if (
        popoverRef.current && !popoverRef.current.contains(e.target as Node) &&
        fontButtonRef.current && !fontButtonRef.current.contains(e.target as Node)
      ) setFontPopoverOpen(false);
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setFontPopoverOpen(false); fontButtonRef.current?.focus(); }
    };
    document.addEventListener("mousedown", handleOut);
    document.addEventListener("keydown", handleEsc);
    return () => { document.removeEventListener("mousedown", handleOut); document.removeEventListener("keydown", handleEsc); };
  }, [fontPopoverOpen]);

  useEffect(() => {
    if (fontPopoverOpen && popoverRef.current) {
      popoverRef.current.querySelectorAll<HTMLElement>('button')[0]?.focus();
    }
  }, [fontPopoverOpen]);

  const handleDeactivateSearch = () => {
    onSearchDeactivate();
    onSearchChange("");
    onSearchChipChange(null);
  };

  /* ── Toolbar (Contraste / Fonte / Libras / Perfil) ── */
  const toolbar = (
    <>
      {/* Contraste */}
      <NavButton
        label="Contraste"
        icon={<Sun size={18} />}
        active={isHighContrast}
        onClick={onContrastToggle}
        ariaLabel={isHighContrast ? "Desativar alto contraste" : "Ativar alto contraste"}
        ariaPressed={isHighContrast}
      />

      {/* Fonte */}
      <div className="relative flex-shrink-0">
        <button
          ref={fontButtonRef}
          onClick={() => setFontPopoverOpen(!fontPopoverOpen)}
          aria-label="Ajustar fonte"
          aria-expanded={fontPopoverOpen}
          onMouseEnter={(e) => {
            if (!fontPopoverOpen) { Object.assign((e.currentTarget as HTMLButtonElement).style, { backgroundColor: "#f0f4ff", borderColor: "#0073e6", color: "#0073e6" }); }
          }}
          onMouseLeave={(e) => {
            if (!fontPopoverOpen) { Object.assign((e.currentTarget as HTMLButtonElement).style, { backgroundColor: "#ffffff", borderColor: "#d0d5e0", color: "#4a4a6a" }); }
          }}
          onFocus={(e) => { e.currentTarget.style.outline = "3px solid #0073e6"; e.currentTarget.style.outlineOffset = "2px"; }}
          onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
          className="relative flex flex-col items-center gap-0.5 rounded-[10px] transition-all"
          style={{
            padding: "8px 14px", minHeight: 44, minWidth: 44, fontSize: 13, fontWeight: 500, outline: "none",
            backgroundColor: fontPopoverOpen ? "#0073e6" : "#ffffff",
            border: `1.5px solid ${fontPopoverOpen ? "#0073e6" : "#d0d5e0"}`,
            color: fontPopoverOpen ? "#ffffff" : "#4a4a6a",
            transition: "all 0.2s ease",
          }}
        >
          <Type size={18} aria-hidden="true" />
          <span style={{ fontSize: 12, lineHeight: 1.2 }}>Fonte</span>
          {fontPopoverOpen && <div className="absolute bottom-1 right-1 rounded-full" style={{ width: 8, height: 8, backgroundColor: "#22c55e" }} aria-hidden="true" />}
        </button>

        {fontPopoverOpen && (
          <div
            ref={popoverRef}
            role="dialog"
            aria-label="Opções de fonte"
            className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-xl border z-50 p-4"
            style={{ width: 240, borderColor: "#e2e8f0" }}
          >
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2" style={{ color: "#2d2d44" }}>Tamanho</label>
              <div className="flex gap-2">
                {(["small", "medium", "large"] as FontSize[]).map((s) => (
                  <button key={s} onClick={() => onFontSizeChange(s)} aria-pressed={fontSize === s}
                    onFocus={(e) => { e.currentTarget.style.outline = "3px solid #0073e6"; e.currentTarget.style.outlineOffset = "2px"; }}
                    onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
                    className="flex-1 py-2 rounded-lg border-2 transition-colors"
                    style={{ fontSize: s === "small" ? 12 : s === "medium" ? 16 : 20, borderColor: fontSize === s ? "#0073e6" : "#d0d5e0", backgroundColor: fontSize === s ? "#e6f2ff" : "white", color: fontSize === s ? "#0073e6" : "#4a4a6a", minHeight: 44, outline: "none" }}
                  >A</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "#2d2d44" }}>Espaçamento</label>
              <div className="flex gap-2">
                {(["normal", "wide"] as FontSpacing[]).map((sp) => (
                  <button key={sp} onClick={() => onFontSpacingChange(sp)} aria-pressed={fontSpacing === sp}
                    onFocus={(e) => { e.currentTarget.style.outline = "3px solid #0073e6"; e.currentTarget.style.outlineOffset = "2px"; }}
                    onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
                    className="flex-1 py-2 rounded-lg border-2 transition-colors text-sm"
                    style={{ borderColor: fontSpacing === sp ? "#0073e6" : "#d0d5e0", backgroundColor: fontSpacing === sp ? "#e6f2ff" : "white", color: fontSpacing === sp ? "#0073e6" : "#4a4a6a", minHeight: 44, outline: "none" }}
                  >{sp === "normal" ? "Normal" : "Amplo"}</button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Libras */}
      <NavButton
        label="Libras"
        icon={<Hand size={18} />}
        active={librasActive}
        onClick={onLibrasToggle}
        ariaLabel={librasActive ? "Desativar Libras" : "Ativar Libras"}
        ariaPressed={librasActive}
      />

      {/* Perfil */}
      <NavButton
        label="Perfil"
        icon={<UserCircle size={18} />}
        onClick={onProfileClick}
        ariaLabel="Meu perfil de acessibilidade"
      />
    </>
  );

  return (
    <nav
      className="w-full bg-white flex-shrink-0"
      style={{ borderBottom: "1px solid #e8ecf0", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
      role="navigation"
      aria-label="Barra de navegação principal"
    >
      {/* ── Main row ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center gap-3">

        {/* Logo — hidden when search active on mobile */}
        <div className={searchActive ? "hidden md:block" : ""}>
          <AccessFlixLogo onClick={() => onNavigate("home")} />
        </div>

        {/* ── Search bar — two states ── */}
        <div className="flex-1 flex items-center gap-2 min-w-0">
          {!searchActive ? (
            /* ── RESTING STATE ── */
            <button
              onClick={onSearchActivate}
              aria-label="Ativar busca"
              className="flex-1 flex items-center gap-2 rounded-xl border transition-colors text-left"
              style={{
                backgroundColor: "#f0f4ff",
                borderColor: "#d0d8f0",
                padding: "10px 14px",
                minHeight: 44,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span className="text-sm flex-1 truncate" style={{ color: "#9ca3af" }}>
                <span className="hidden sm:inline">Buscar filmes e jogos acessíveis...</span>
                <span className="sm:hidden">Buscar...</span>
              </span>
            </button>
          ) : (
            /* ── ACTIVE STATE ── */
            <div className="flex-1 flex items-center gap-2">
              <div className="flex-1 relative">
                <svg
                  width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="#0073e6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  ref={searchInputRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Buscar filmes e jogos acessíveis..."
                  aria-label="Campo de busca"
                  className="w-full pl-9 pr-9 py-2.5 rounded-xl text-sm"
                  style={{
                    backgroundColor: "white",
                    border: "2px solid #0073e6",
                    color: "#1a1a2e",
                    outline: "none",
                    minHeight: 44,
                  }}
                  onKeyDown={(e) => { if (e.key === "Escape") handleDeactivateSearch(); }}
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange("")}
                    aria-label="Limpar busca"
                    className="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none rounded"
                    onFocus={(e) => { e.currentTarget.style.outline = "2px solid #0073e6"; }}
                    onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
                  >
                    <X size={15} color="#9ca3af" />
                  </button>
                )}
              </div>

              {/* Cancelar — outside the input, hides the toolbar */}
              <button
                onClick={handleDeactivateSearch}
                className="flex-shrink-0 text-sm font-semibold rounded focus:outline-none px-1 py-2"
                style={{ color: "#0073e6", minHeight: 44, minWidth: 60 }}
                onFocus={(e) => { e.currentTarget.style.outline = "3px solid #0073e6"; e.currentTarget.style.outlineOffset = "2px"; }}
                onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
              >
                Cancelar
              </button>
            </div>
          )}
        </div>

        {/* Toolbar — hidden when search active */}
        {!searchActive && (
          <>
            {/* Desktop */}
            <div className="hidden md:flex items-center gap-2 flex-shrink-0">
              {toolbar}
            </div>
            {/* Mobile hamburger */}
            <button
              className="md:hidden flex items-center justify-center rounded-[10px] border flex-shrink-0 transition-colors"
              style={{
                width: 44, height: 44,
                backgroundColor: mobileMenuOpen ? "#0073e6" : "#ffffff",
                borderColor: mobileMenuOpen ? "#0073e6" : "#d0d5e0",
                color: mobileMenuOpen ? "#ffffff" : "#4a4a6a",
              }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </>
        )}
      </div>

      {/* Mobile menu */}
      {!searchActive && mobileMenuOpen && (
        <div className="md:hidden px-4 pb-3 flex flex-wrap gap-2" style={{ borderTop: "1px solid #e8ecf0", backgroundColor: "#fafbfc", paddingTop: 12 }}>
          {toolbar}
        </div>
      )}

      {/* ── Filter chips sub-bar — only when search is active ── */}
      {searchActive && (
        <div
          className="border-t"
          style={{ borderColor: "#e8ecf0", backgroundColor: "#fafbff" }}
        >
          <div
            className="max-w-7xl mx-auto px-4 md:px-6 py-2 flex items-center gap-2 overflow-x-auto"
            style={{ scrollbarWidth: "none" }}
            aria-label="Filtros rápidos"
          >
            {SEARCH_CHIPS.map((chip) => {
              const active = activeSearchChip === chip.id;
              return (
                <button
                  key={chip.id}
                  onClick={() => onSearchChipChange(active ? null : chip.id)}
                  aria-pressed={active}
                  className="flex items-center gap-1.5 flex-shrink-0 rounded-full border transition-all focus:outline-none"
                  style={{
                    padding: "7px 14px",
                    fontSize: 13,
                    fontWeight: 600,
                    backgroundColor: active ? chip.color : "#f0f4ff",
                    borderColor: active ? chip.color : "#d0d5e0",
                    color: active ? "white" : "#4a4a6a",
                    transition: "all 0.15s ease",
                    minHeight: 36,
                  }}
                  onFocus={(e) => { e.currentTarget.style.outline = `3px solid ${chip.color}`; e.currentTarget.style.outlineOffset = "2px"; }}
                  onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
                >
                  <chip.Icon size={14} aria-hidden="true" />
                  {chip.label}
                </button>
              );
            })}

            {/* Filtros avançados */}
            <button
              className="flex items-center gap-1.5 flex-shrink-0 rounded-full border transition-all focus:outline-none ml-1"
              style={{
                padding: "7px 14px",
                fontSize: 13,
                fontWeight: 600,
                backgroundColor: "#f8fafc",
                borderColor: "#d0d5e0",
                color: "#4a4a6a",
                minHeight: 36,
              }}
              aria-label="Filtros avançados"
              onFocus={(e) => { e.currentTarget.style.outline = "3px solid #0073e6"; e.currentTarget.style.outlineOffset = "2px"; }}
              onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
            >
              <SlidersHorizontal size={14} aria-hidden="true" />
              Filtros
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
