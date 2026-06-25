import { Home, Grid3X3, User, Search } from "lucide-react";

type Page = "home" | "listing" | "detail" | "watch" | "profile" | "search" | "highcontrast" | "createprofile" | "mobilecategories" | "mobilesearch";

/* ── Fixed mobile header: logo + search icon only ── */
interface MobileHeaderProps {
  onNavigate: (page: Page) => void;
}

export function MobileHeader({ onNavigate }: MobileHeaderProps) {
  return (
    <header
      className="flex-shrink-0 w-full flex items-center justify-between px-4"
      style={{
        height: 56,
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e8eaf0",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
      aria-label="Cabeçalho"
    >
      {/* Logo */}
      <button
        onClick={() => onNavigate("home")}
        aria-label="AccessFlix — início"
        className="flex items-center gap-2 focus:outline-none"
        onFocus={(e) => { e.currentTarget.style.outline = "3px solid #0073e6"; e.currentTarget.style.outlineOffset = "2px"; }}
        onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
      >
        <svg width="26" height="26" viewBox="0 0 36 36" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id="mhLg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0073e6" />
              <stop offset="100%" stopColor="#005bb5" />
            </linearGradient>
          </defs>
          <rect width="36" height="36" rx="9" fill="url(#mhLg)" />
          {/* Play triangle — centroid at (18.67, 18) */}
          <path d="M13 9L13 27L30 18Z" fill="white" />
        </svg>
        <span style={{ fontSize: 17, fontWeight: 800, color: "#1a1a2e", letterSpacing: "-0.02em" }}>
          Access<span style={{ color: "#0073e6" }}>Flix</span>
        </span>
      </button>

      {/* Search icon — opens full-screen search */}
      <button
        onClick={() => onNavigate("mobilesearch")}
        aria-label="Buscar"
        className="flex items-center justify-center rounded-xl transition-colors focus:outline-none"
        style={{ width: 44, height: 44, color: "#4a4a6a" }}
        onFocus={(e) => { e.currentTarget.style.outline = "3px solid #0073e6"; e.currentTarget.style.outlineOffset = "2px"; }}
        onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
      >
        <Search size={22} aria-hidden="true" />
      </button>
    </header>
  );
}

/* ── Bottom navigation bar ── */
interface MobileBottomNavProps {
  onNavigate: (page: Page) => void;
  currentPage?: string;
  dark?: boolean;
}

export function MobileBottomNav({ onNavigate, currentPage, dark = false }: MobileBottomNavProps) {
  const tabs = [
    { page: "home" as Page,             label: "Início",     Icon: Home },
    { page: "mobilecategories" as Page, label: "Categorias", Icon: Grid3X3 },
    { page: "profile" as Page,          label: "Perfil",     Icon: User },
  ];

  return (
    <nav
      className="flex-shrink-0 w-full flex items-stretch"
      style={{
        height: 60,
        backgroundColor: dark ? "rgba(0,0,0,0.8)" : "#ffffff",
        borderTop: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "#e8eaf0"}`,
      }}
      aria-label="Navegação principal"
    >
      {tabs.map(({ page, label, Icon }) => {
        const active = currentPage === page;
        return (
          <button
            key={page}
            onClick={() => onNavigate(page)}
            aria-label={label}
            aria-current={active ? "page" : undefined}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors focus:outline-none"
            style={{ minHeight: 44 }}
            onFocus={(e) => { e.currentTarget.style.outline = "3px solid #0073e6"; e.currentTarget.style.outlineOffset = "-2px"; }}
            onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
          >
            <Icon
              size={22}
              color={active ? (dark ? "#4da3ff" : "#0073e6") : (dark ? "rgba(255,255,255,0.45)" : "#9898b8")}
              strokeWidth={active ? 2.2 : 1.8}
              aria-hidden="true"
            />
            <span style={{ fontSize: 11, fontWeight: active ? 700 : 400, color: active ? (dark ? "#4da3ff" : "#0073e6") : (dark ? "rgba(255,255,255,0.45)" : "#9898b8"), lineHeight: 1 }}>
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
