import { Eye, Search, Sun, Type, Hand, UserCircle } from "lucide-react";

type Page = "home" | "listing" | "detail" | "watch" | "profile" | "search" | "highcontrast";

interface HighContrastNavBarProps {
  onNavigate: (page: Page) => void;
}

export function HighContrastNavBar({ onNavigate }: HighContrastNavBarProps) {
  return (
    <>
      {/* ALTO CONTRASTE ATIVO banner */}
      <div
        className="w-full text-center text-sm font-bold py-2 flex-shrink-0"
        style={{ backgroundColor: "#FFFF00", color: "#000000" }}
        role="alert"
        aria-live="polite"
      >
        ALTO CONTRASTE ATIVO
      </div>

      {/* Nav bar */}
      <nav
        className="w-full flex-shrink-0 px-6 py-4"
        style={{ backgroundColor: "#000000", borderBottom: "1px solid #FFFFFF" }}
        role="navigation"
        aria-label="Barra de navegação principal — alto contraste"
      >
        <style>{`
          .hc-nav *:focus-visible {
            outline: 3px solid #FFFF00 !important;
            outline-offset: 3px !important;
          }
        `}</style>
        <div className="hc-nav max-w-7xl mx-auto flex items-center gap-4">

          {/* Logo */}
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2 flex-shrink-0 rounded-lg p-1"
            aria-label="AccessFlix — página inicial"
          >
            <Eye size={28} color="#FFFF00" aria-hidden="true" />
            <span className="text-2xl font-bold tracking-tight" style={{ color: "#FFFFFF" }}>
              AccessFlix
            </span>
          </button>

          {/* Search */}
          <button
            onClick={() => onNavigate("search")}
            className="flex-1 mx-4 relative flex items-center"
            aria-label="Abrir busca"
          >
            <Search
              size={18}
              className="absolute left-3 pointer-events-none"
              style={{ color: "#FFFF00" }}
              aria-hidden="true"
            />
            <div
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-left"
              style={{
                backgroundColor: "#000000",
                border: "1px solid #FFFFFF",
                color: "#9CA3AF",
              }}
            >
              Buscar filmes e jogos acessíveis...
            </div>
          </button>

          {/* Toolbar */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {[
              { label: "Contraste", icon: <Sun size={18} />, onClick: () => onNavigate("home"), active: true },
              { label: "Fonte",     icon: <Type size={18} />, onClick: () => {}, active: false },
              { label: "Libras",    icon: <Hand size={18} />, onClick: () => {}, active: true },
            ].map((btn) => (
              <button
                key={btn.label}
                onClick={btn.onClick}
                aria-label={btn.label}
                aria-pressed={btn.active}
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg"
                style={{
                  backgroundColor: "#000000",
                  border: "2px solid #FFFF00",
                  color: "#FFFF00",
                }}
              >
                <span aria-hidden="true">{btn.icon}</span>
                <span className="text-xs font-medium">{btn.label}</span>
              </button>
            ))}

            <button
              onClick={() => onNavigate("profile")}
              aria-label="Meu perfil"
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg"
              style={{
                backgroundColor: "#000000",
                border: "2px solid #FFFF00",
                color: "#FFFF00",
              }}
            >
              <UserCircle size={18} aria-hidden="true" />
              <span className="text-xs font-medium">Perfil</span>
            </button>
          </div>

        </div>
      </nav>
    </>
  );
}
