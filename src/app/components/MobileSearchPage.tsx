import { useState, useRef, useEffect } from "react";
import { ChevronLeft, Search, X, Star, Eye, Ear, Brain, Hand } from "lucide-react";

const badgeColors: Record<string, { bg: string; text: string }> = {
  AD:     { bg: "#d4edda", text: "#1a4d1a" },
  Leg:    { bg: "#cce0ff", text: "#003366" },
  Libras: { bg: "#fce4f0", text: "#6b0038" },
  Adapt:  { bg: "#ede9fe", text: "#3b0764" },
};

const CHIPS = [
  { id: "visual",    label: "Visual",    Icon: Eye,   color: "#e6308a" },
  { id: "auditiva",  label: "Auditiva",  Icon: Ear,   color: "#0073e6" },
  { id: "cognitiva", label: "Cognitiva", Icon: Brain, color: "#5ba300" },
  { id: "motora",    label: "Motora",    Icon: Hand,  color: "#f5a623" },
];

const suggestions = [
  { id: 1, label: "Oppenheimer", badges: ["AD", "Leg", "Libras"] },
  { id: 2, label: "Duna: Parte Dois", badges: ["AD", "Leg"] },
  { id: 3, label: "The Last of Us", badges: ["Leg", "Libras"] },
  { id: 4, label: "Inside Out 2", badges: ["AD", "Leg", "Libras"] },
];

const mockResults = [
  { id: 1, title: "Oppenheimer",         rating: 4.8, badges: ["AD","Leg","Libras"], posterColor: "#6366f1", type: "Filmes" },
  { id: 2, title: "Duna: Parte Dois",    rating: 4.9, badges: ["AD","Leg"],          posterColor: "#f59e0b", type: "Filmes" },
  { id: 3, title: "The Last of Us",      rating: 4.7, badges: ["Leg","Libras"],      posterColor: "#14b8a6", type: "Séries" },
  { id: 4, title: "Inside Out 2",        rating: 4.7, badges: ["AD","Leg","Libras"], posterColor: "#ec4899", type: "Filmes" },
  { id: 5, title: "Fallout",             rating: 4.6, badges: ["Leg","AD"],          posterColor: "#10b981", type: "Séries" },
  { id: 6, title: "The Bear",            rating: 4.9, badges: ["Leg","Libras"],      posterColor: "#3b82f6", type: "Séries" },
];

function ResultCard({ item }: { item: typeof mockResults[0] }) {
  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-sm cursor-pointer group">
      <div
        className="w-full aspect-[2/3] flex items-center justify-center relative"
        style={{ backgroundColor: item.posterColor }}
        aria-hidden="true"
      >
        <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
          <path d="M6 34L16 20L22 28L28 16L36 34H6Z" fill="white" fillOpacity="0.22" />
          <circle cx="14" cy="13" r="5" fill="white" fillOpacity="0.22" />
        </svg>
        <div className="absolute bottom-2 left-2 rounded-full px-2 py-0.5 text-xs font-semibold" style={{ backgroundColor: "rgba(0,0,0,0.55)", color: "white" }}>
          {item.type}
        </div>
      </div>
      <div className="p-2.5">
        <h3 className="text-xs font-semibold mb-1 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors" style={{ color: "#1a1a2e" }}>
          {item.title}
        </h3>
        <div className="flex items-center gap-1 mb-1.5">
          <Star size={10} fill="#f5a623" color="#f5a623" aria-hidden="true" />
          <span className="text-xs font-bold" style={{ color: "#1a1a2e" }}>{item.rating}</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {item.badges.map((b) => (
            <span key={b} className="text-xs font-bold px-1.5 py-0.5 rounded-full"
              style={{ backgroundColor: badgeColors[b]?.bg ?? "#f0f0f0", color: badgeColors[b]?.text ?? "#333" }}>
              {b}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden" aria-hidden="true">
      <div className="w-full aspect-[2/3] animate-pulse" style={{ backgroundColor: "#e8ecf0" }} />
      <div className="p-2.5 flex flex-col gap-1.5">
        <div className="h-3 rounded animate-pulse" style={{ backgroundColor: "#e8ecf0", width: "80%" }} />
        <div className="h-2.5 rounded animate-pulse" style={{ backgroundColor: "#e8ecf0", width: "40%" }} />
        <div className="flex gap-1">
          <div className="h-4 w-8 rounded-full animate-pulse" style={{ backgroundColor: "#e8ecf0" }} />
        </div>
      </div>
    </div>
  );
}

interface MobileSearchPageProps {
  onBack: () => void;
}

export function MobileSearchPage({ onBack }: MobileSearchPageProps) {
  const [query, setQuery] = useState("");
  const [activeChip, setActiveChip] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  /* Auto-focus on mount */
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, []);

  /* Simulate loading on chip change */
  useEffect(() => {
    if (!query) return;
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, [activeChip]);

  const filteredResults = mockResults.filter((r) => {
    if (activeChip === "visual" && !r.badges.includes("AD")) return false;
    if (activeChip === "auditiva" && !r.badges.includes("Leg") && !r.badges.includes("Libras")) return false;
    return true;
  });

  return (
    <div
      className="flex flex-col"
      style={{ height: "100svh", backgroundColor: "#ffffff", overflow: "hidden" }}
    >
      {/* ── Header ── */}
      <header
        className="flex-shrink-0 px-3 flex flex-col"
        style={{ borderBottom: "1px solid #e8eaf0", paddingTop: 8, paddingBottom: 0 }}
      >
        {/* Row: back + input + cancel */}
        <div className="flex items-center gap-2 pb-2">
          <button
            onClick={onBack}
            aria-label="Voltar"
            className="flex items-center justify-center flex-shrink-0 focus:outline-none rounded"
            style={{ width: 40, height: 44, color: "#4a4a6a" }}
            onFocus={(e) => { e.currentTarget.style.outline = "3px solid #0073e6"; e.currentTarget.style.outlineOffset = "2px"; }}
            onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
          >
            <ChevronLeft size={22} />
          </button>

          <div className="flex-1 relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "#0073e6" }}
              aria-hidden="true"
            />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar filmes e jogos acessíveis..."
              aria-label="Campo de busca"
              className="w-full pl-9 pr-8 py-2.5 rounded-xl text-sm"
              style={{
                backgroundColor: "#eff6ff",
                border: "2px solid #0073e6",
                color: "#1a1a2e",
                outline: "none",
                minHeight: 44,
              }}
              onKeyDown={(e) => { if (e.key === "Escape") onBack(); }}
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Limpar"
                className="absolute right-2 top-1/2 -translate-y-1/2 focus:outline-none"
              >
                <X size={15} color="#5b5b7a" />
              </button>
            )}
          </div>

          <button
            onClick={onBack}
            className="flex-shrink-0 text-sm font-semibold focus:outline-none rounded px-1"
            style={{ color: "#0073e6", minHeight: 44 }}
            onFocus={(e) => { e.currentTarget.style.outline = "3px solid #0073e6"; e.currentTarget.style.outlineOffset = "2px"; }}
            onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
          >
            Cancelar
          </button>
        </div>

        {/* Chips row */}
        <div
          className="flex items-center gap-2 pb-2 overflow-x-auto"
          style={{ scrollbarWidth: "none" }}
          aria-label="Filtros rápidos"
        >
          {CHIPS.map((chip) => {
            const active = activeChip === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => setActiveChip(active ? null : chip.id)}
                aria-pressed={active}
                className="flex items-center gap-1.5 flex-shrink-0 rounded-full border transition-all focus:outline-none"
                style={{
                  padding: "6px 12px",
                  fontSize: 13,
                  fontWeight: 600,
                  backgroundColor: active ? chip.color : "#f0f4ff",
                  borderColor: active ? chip.color : "#d0d5e0",
                  color: active ? "white" : "#4a4a6a",
                  minHeight: 32,
                  whiteSpace: "nowrap",
                }}
                onFocus={(e) => { e.currentTarget.style.outline = `3px solid ${chip.color}`; e.currentTarget.style.outlineOffset = "2px"; }}
                onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
              >
                <chip.Icon size={13} aria-hidden="true" />
                {chip.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-6" style={{ backgroundColor: "#f5f7fa" }}>

        {/* Suggestions — when no query */}
        {!query && (
          <section aria-label="Sugestões">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "#4a4a6a" }}>Sugestões</h2>
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm" style={{ border: "1px solid #e8ecf0" }}>
              {suggestions.map((s, i) => (
                <button
                  key={s.id}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors focus:outline-none focus:bg-blue-50 text-left"
                  style={{ borderTop: i > 0 ? "1px solid #f0f2f5" : "none" }}
                  onClick={() => setQuery(s.label)}
                  aria-label={`Buscar por ${s.label}`}
                >
                  <Search size={15} color="#5b5b7a" aria-hidden="true" />
                  <span className="flex-1 text-sm" style={{ color: "#4a4a6a" }}>{s.label}</span>
                  <div className="flex gap-1">
                    {s.badges.map((b) => (
                      <span key={b} className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                        style={{ backgroundColor: badgeColors[b]?.bg, color: badgeColors[b]?.text }}>
                        {b}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Results */}
        {query && (
          <section aria-label={`Resultados para ${query}`}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-sm" style={{ color: "#1a1a2e" }}>
                Resultados para{" "}
                <span style={{ color: "#0073e6" }}>"{query}"</span>
              </h2>
              {!loading && (
                <span className="text-xs" style={{ color: "#4a4a6a" }}>{filteredResults.length} resultado{filteredResults.length !== 1 ? "s" : ""}</span>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-2 gap-3" aria-busy="true">
                {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : filteredResults.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl" role="status">
                <div className="text-4xl mb-3" aria-hidden="true">🔍</div>
                <p className="font-semibold mb-1 text-sm" style={{ color: "#1a1a2e" }}>Nenhum resultado</p>
                <p className="text-xs mb-3" style={{ color: "#4a4a6a" }}>Tente remover filtros.</p>
                <button onClick={() => setActiveChip(null)}
                  className="px-3 py-1.5 rounded-xl text-white text-xs font-semibold focus:outline-none"
                  style={{ backgroundColor: "#0073e6" }}
                  onFocus={(e) => { e.currentTarget.style.outline = "3px solid #0073e6"; e.currentTarget.style.outlineOffset = "2px"; }}
                  onBlur={(e) => { e.currentTarget.style.outline = "none"; }}>
                  Limpar filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {filteredResults.map((r) => <ResultCard key={r.id} item={r} />)}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
