import { useState, useEffect } from "react";
import { Search, Clock, Star, SlidersHorizontal, X, Check, Eye, Ear, Brain, Hand } from "lucide-react";

/* ── Badge config ── */
const badgeColors: Record<string, { bg: string; text: string }> = {
  AD:     { bg: "#d4edda", text: "#1a4d1a" },
  Leg:    { bg: "#cce0ff", text: "#003366" },
  Libras: { bg: "#fce4f0", text: "#6b0038" },
  Adapt:  { bg: "#ede9fe", text: "#3b0764" },
};

/* ── Suggestions ── */
const suggestions = [
  { id: 1, type: "search" as const, label: "Avatar: O Último Mestre do Ar", badges: ["AD", "Leg", "Libras"] },
  { id: 2, type: "search" as const, label: "Avatar 2: O Caminho da Água",   badges: ["AD", "Leg"] },
  { id: 3, type: "search" as const, label: "Avatar (série)",                badges: ["Leg"] },
  { id: 4, type: "recent" as const, label: "avatar anime dublado",          badges: [] },
];

/* ── Results ── */
const ALL_RESULTS = [
  { id: 1, title: "Avatar: O Último Mestre do Ar", rating: 4.9, badges: ["AD","Leg","Libras"], posterColor: "#0891b2", type: "Séries" as const, category: "auditiva" },
  { id: 2, title: "Avatar 2: O Caminho da Água",   rating: 4.7, badges: ["AD","Leg"],          posterColor: "#3b82f6", type: "Filmes" as const, category: "visual"   },
  { id: 3, title: "Avatar (série)",                 rating: 4.5, badges: ["Leg"],               posterColor: "#6366f1", type: "Séries" as const, category: "auditiva" },
  { id: 4, title: "Avatar: Legends",               rating: 4.2, badges: ["Leg","Libras"],      posterColor: "#8b5cf6", type: "Séries" as const, category: "auditiva" },
  { id: 5, title: "Avatar (1999)",                 rating: 4.0, badges: ["Leg"],               posterColor: "#14b8a6", type: "Filmes" as const, category: "auditiva" },
  { id: 6, title: "Avatar: Frontiers of Pandora",  rating: 4.3, badges: ["Adapt","Leg"],       posterColor: "#10b981", type: "Jogos" as const,  category: "motora"   },
  { id: 7, title: "Duna: Parte Dois",              rating: 4.9, badges: ["AD","Leg"],          posterColor: "#f59e0b", type: "Filmes" as const, category: "visual"   },
  { id: 8, title: "The Last of Us",                rating: 4.7, badges: ["Leg","Libras"],      posterColor: "#ef4444", type: "Séries" as const, category: "cognitiva"},
];

const PLATFORMS = ["Netflix", "Prime Video", "Disney+", "Globoplay", "Crunchyroll"];
const CONTENT_TYPES = ["Todos", "Filmes", "Séries", "Jogos"] as const;
const emptyFilters = { resources: [] as string[], platforms: [] as string[], contentType: "Todos", minRating: 1 };

/* ── Skeleton ── */
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden" aria-hidden="true">
      <div className="w-full aspect-[2/3] animate-pulse" style={{ backgroundColor: "#e8ecf0" }} />
      <div className="p-3 flex flex-col gap-2">
        <div className="h-3 rounded animate-pulse" style={{ backgroundColor: "#e8ecf0", width: "80%" }} />
        <div className="h-2.5 rounded animate-pulse" style={{ backgroundColor: "#e8ecf0", width: "50%" }} />
        <div className="flex gap-1">
          <div className="h-4 w-8 rounded-full animate-pulse" style={{ backgroundColor: "#e8ecf0" }} />
          <div className="h-4 w-8 rounded-full animate-pulse" style={{ backgroundColor: "#e8ecf0" }} />
        </div>
      </div>
    </div>
  );
}

/* ── Result card ── */
function ResultCard({ item }: { item: typeof ALL_RESULTS[0] }) {
  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
      <div className="w-full aspect-[2/3] flex items-center justify-center relative" style={{ backgroundColor: item.posterColor }} aria-hidden="true">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <path d="M6 34L16 20L22 28L28 16L36 34H6Z" fill="white" fillOpacity="0.22" />
          <circle cx="14" cy="13" r="5" fill="white" fillOpacity="0.22" />
        </svg>
        <div className="absolute bottom-2 left-2 rounded-full px-2 py-0.5 text-xs font-semibold" style={{ backgroundColor: "rgba(0,0,0,0.55)", color: "white" }}>{item.type}</div>
      </div>
      <div className="p-3">
        <h3 className="text-xs font-semibold mb-1.5 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors" style={{ color: "#1a1a2e" }}>{item.title}</h3>
        <div className="flex items-center gap-1 mb-2">
          <Star size={11} fill="#f5a623" color="#f5a623" aria-hidden="true" />
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

/* ── Advanced filters drawer ── */
function AdvancedFiltersDrawer({ isOpen, onClose, activeFilters, onChange }: {
  isOpen: boolean; onClose: () => void;
  activeFilters: typeof emptyFilters;
  onChange: (f: typeof emptyFilters) => void;
}) {
  const [local, setLocal] = useState(activeFilters);
  useEffect(() => { setLocal(activeFilters); }, [activeFilters]);
  useEffect(() => {
    if (!isOpen) return;
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggle = (key: "resources" | "platforms", val: string) =>
    setLocal((p) => ({ ...p, [key]: p[key].includes(val) ? p[key].filter((x: string) => x !== val) : [...p[key], val] }));

  const activeCount = local.resources.length + local.platforms.length + (local.contentType !== "Todos" ? 1 : 0) + (local.minRating > 1 ? 1 : 0);

  return (
    <>
      <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(0,0,0,0.35)" }} onClick={onClose} aria-hidden="true" />
      <div role="dialog" aria-label="Filtros avançados" className="fixed right-0 top-0 h-full bg-white z-50 flex flex-col shadow-2xl" style={{ width: "min(320px, 90vw)" }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #e8ecf0" }}>
          <h2 className="font-bold" style={{ color: "#1a1a2e", fontSize: 17 }}>Filtros avançados</h2>
          <button onClick={onClose} aria-label="Fechar" className="flex items-center justify-center rounded-xl hover:bg-gray-100 focus:outline-none" style={{ width: 44, height: 44 }}
            onFocus={(e) => { e.currentTarget.style.outline = "3px solid #0073e6"; e.currentTarget.style.outlineOffset = "2px"; }}
            onBlur={(e) => { e.currentTarget.style.outline = "none"; }}>
            <X size={20} color="#4a4a6a" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-6">
          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-3 text-sm" style={{ color: "#2d2d44" }}>Recursos de Acessibilidade</h3>
            {["Audiodescrição (AD)", "Legendas (Leg)", "Libras", "Linguagem Simplificada"].map((r) => {
              const checked = local.resources.includes(r);
              return (
                <label key={r} className="flex items-center gap-3 py-2 cursor-pointer hover:bg-blue-50 rounded-lg px-1 transition-colors">
                  <button role="checkbox" aria-checked={checked} onClick={() => toggle("resources", r)}
                    className="flex-shrink-0 rounded flex items-center justify-center focus:outline-none"
                    style={{ width: 20, height: 20, backgroundColor: checked ? "#0073e6" : "white", border: `2px solid ${checked ? "#0073e6" : "#d0d5e0"}`, borderRadius: 4 }}
                    onFocus={(e) => { e.currentTarget.style.outline = "3px solid #0073e6"; e.currentTarget.style.outlineOffset = "2px"; }}
                    onBlur={(e) => { e.currentTarget.style.outline = "none"; }} aria-label={r}>
                    {checked && <Check size={12} color="white" strokeWidth={3} aria-hidden="true" />}
                  </button>
                  <span className="text-sm" style={{ color: "#4a4a6a" }}>{r}</span>
                </label>
              );
            })}
          </div>

          {/* Platforms */}
          <div>
            <h3 className="font-semibold mb-3 text-sm" style={{ color: "#2d2d44" }}>Plataforma de Streaming</h3>
            {PLATFORMS.map((pl) => {
              const checked = local.platforms.includes(pl);
              return (
                <label key={pl} className="flex items-center gap-3 py-2 cursor-pointer hover:bg-blue-50 rounded-lg px-1 transition-colors">
                  <button role="checkbox" aria-checked={checked} onClick={() => toggle("platforms", pl)}
                    className="flex-shrink-0 rounded flex items-center justify-center focus:outline-none"
                    style={{ width: 20, height: 20, backgroundColor: checked ? "#0073e6" : "white", border: `2px solid ${checked ? "#0073e6" : "#d0d5e0"}`, borderRadius: 4 }}
                    onFocus={(e) => { e.currentTarget.style.outline = "3px solid #0073e6"; e.currentTarget.style.outlineOffset = "2px"; }}
                    onBlur={(e) => { e.currentTarget.style.outline = "none"; }} aria-label={pl}>
                    {checked && <Check size={12} color="white" strokeWidth={3} aria-hidden="true" />}
                  </button>
                  <span className="text-sm" style={{ color: "#4a4a6a" }}>{pl}</span>
                </label>
              );
            })}
          </div>

          {/* Content type */}
          <div>
            <h3 className="font-semibold mb-3 text-sm" style={{ color: "#2d2d44" }}>Tipo de conteúdo</h3>
            <div className="flex flex-wrap gap-2">
              {CONTENT_TYPES.map((ct) => (
                <button key={ct} onClick={() => setLocal((p) => ({ ...p, contentType: ct }))} aria-pressed={local.contentType === ct}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none"
                  style={{ backgroundColor: local.contentType === ct ? "#0073e6" : "#f0f4ff", color: local.contentType === ct ? "white" : "#4a4a6a", border: `1.5px solid ${local.contentType === ct ? "#0073e6" : "#d0d5e0"}`, minHeight: 36 }}
                  onFocus={(e) => { e.currentTarget.style.outline = "3px solid #0073e6"; e.currentTarget.style.outlineOffset = "2px"; }}
                  onBlur={(e) => { e.currentTarget.style.outline = "none"; }}>
                  {ct}
                </button>
              ))}
            </div>
          </div>

          {/* Min rating */}
          <div>
            <h3 className="font-semibold mb-3 text-sm" style={{ color: "#2d2d44" }}>
              Avaliação mínima: {local.minRating}★
            </h3>
            <div className="flex gap-1">
              {[1,2,3,4,5].map((n) => (
                <button key={n} onClick={() => setLocal((p) => ({ ...p, minRating: n }))} aria-label={`${n} estrela${n > 1 ? "s" : ""} mínimo`}
                  className="focus:outline-none"
                  onFocus={(e) => { e.currentTarget.style.outline = "2px solid #0073e6"; }}
                  onBlur={(e) => { e.currentTarget.style.outline = "none"; }}>
                  <Star size={28} fill={local.minRating >= n ? "#f5a623" : "none"} color={local.minRating >= n ? "#f5a623" : "#d0d5e0"} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-5 py-4 flex gap-3" style={{ borderTop: "1px solid #e8ecf0" }}>
          <button onClick={() => setLocal(emptyFilters)}
            className="flex-1 py-3 rounded-xl font-semibold focus:outline-none transition-colors"
            style={{ border: "1.5px solid #d0d5e0", backgroundColor: "white", color: "#4a4a6a", minHeight: 48 }}
            onFocus={(e) => { e.currentTarget.style.outline = "3px solid #0073e6"; e.currentTarget.style.outlineOffset = "2px"; }}
            onBlur={(e) => { e.currentTarget.style.outline = "none"; }}>
            Limpar filtros
          </button>
          <button onClick={() => { onChange(local); onClose(); }}
            className="flex-1 py-3 rounded-xl font-semibold text-white transition-all active:scale-[0.98] focus:outline-none"
            style={{ backgroundColor: "#0073e6", minHeight: 48 }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#005bb5")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#0073e6")}
            onFocus={(e) => { e.currentTarget.style.outline = "3px solid #0073e6"; e.currentTarget.style.outlineOffset = "2px"; }}
            onBlur={(e) => { e.currentTarget.style.outline = "none"; }}>
            Aplicar{activeCount > 0 ? ` (${activeCount})` : ""}
          </button>
        </div>
      </div>
    </>
  );
}

/* ── Page ── */
interface SearchPageProps {
  /** Query comes from NavBar — no own search bar rendered here */
  query: string;
  activeChip: string | null;
  onSuggestionClick: (label: string) => void;
}

export function SearchPage({ query, activeChip, onSuggestionClick }: SearchPageProps) {
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState(emptyFilters);
  const [loading, setLoading] = useState(false);

  /* Simulate loading when filters/chip change */
  useEffect(() => {
    if (!query) return;
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, [activeChip, advancedFilters]);

  const activeFilterCount =
    (activeChip ? 1 : 0) +
    advancedFilters.resources.length + advancedFilters.platforms.length +
    (advancedFilters.contentType !== "Todos" ? 1 : 0) +
    (advancedFilters.minRating > 1 ? 1 : 0);

  const filteredResults = ALL_RESULTS.filter((r) => {
    if (activeChip && r.category !== activeChip) return false;
    if (advancedFilters.contentType !== "Todos" && r.type !== advancedFilters.contentType) return false;
    if (r.rating < advancedFilters.minRating) return false;
    return true;
  });

  return (
    <div className="flex-1 overflow-y-auto" style={{ backgroundColor: "#F5F7FA" }}>
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 flex flex-col gap-8">

        {/* Suggestions — shown when no query yet */}
        {!query && (
          <section aria-label="Sugestões de busca">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: "#4a4a6a" }}>Sugestões</h2>
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm" style={{ border: "1px solid #e8ecf0" }}>
              {suggestions.map((s, i) => (
                <button
                  key={s.id}
                  className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors focus:outline-none focus:bg-blue-50 text-left"
                  style={{ borderTop: i > 0 ? "1px solid #f0f2f5" : "none" }}
                  onClick={() => onSuggestionClick(s.label)}
                  aria-label={`Buscar por ${s.label}`}
                >
                  <span className="flex-shrink-0" aria-hidden="true">
                    {s.type === "recent" ? <Clock size={16} color="#9ca3af" /> : <Search size={16} color="#9ca3af" />}
                  </span>
                  <span className="flex-1 text-sm" style={{ color: "#4a4a6a" }}>{s.label}</span>
                  {s.badges.length > 0 && (
                    <div className="flex gap-1.5 flex-shrink-0">
                      {s.badges.map((b) => (
                        <span key={b} className="text-xs font-bold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: badgeColors[b]?.bg, color: badgeColors[b]?.text }}>
                          {b}
                        </span>
                      ))}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Results */}
        {query && (
          <section aria-label={`Resultados para ${query}`}>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h2 className="font-bold" style={{ color: "#1a1a2e", fontSize: 16 }}>
                Resultados para <span style={{ color: "#0073e6" }}>"{query}"</span>
                {activeFilterCount > 0 && (
                  <span className="ml-2 text-sm font-normal" style={{ color: "#4a4a6a" }}>
                    — {activeFilterCount} filtro{activeFilterCount > 1 ? "s" : ""}
                  </span>
                )}
              </h2>
              <div className="flex items-center gap-2">
                {!loading && <span className="text-sm" style={{ color: "#4a4a6a" }}>{filteredResults.length} resultado{filteredResults.length !== 1 ? "s" : ""}</span>}
                <button
                  onClick={() => setAdvancedOpen(true)}
                  className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all relative focus:outline-none"
                  style={{
                    backgroundColor: activeFilterCount > 0 ? "#1a1a2e" : "#f8fafc",
                    borderColor: activeFilterCount > 0 ? "#1a1a2e" : "#d0d5e0",
                    color: activeFilterCount > 0 ? "white" : "#4a4a6a",
                    minHeight: 36,
                  }}
                  aria-label={`Filtros avançados${activeFilterCount > 0 ? `, ${activeFilterCount} ativo${activeFilterCount > 1 ? "s" : ""}` : ""}`}
                  onFocus={(e) => { e.currentTarget.style.outline = "3px solid #0073e6"; e.currentTarget.style.outlineOffset = "2px"; }}
                  onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
                >
                  <SlidersHorizontal size={14} aria-hidden="true" />
                  Filtros avançados
                  {activeFilterCount > 0 && (
                    <span className="flex items-center justify-center rounded-full text-white" style={{ width: 18, height: 18, backgroundColor: "#e6308a", fontSize: 10, fontWeight: 700 }} aria-hidden="true">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" aria-busy="true" aria-label="Carregando resultados">
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : filteredResults.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl" role="status">
                <div className="text-5xl mb-4" aria-hidden="true">🔍</div>
                <p className="font-semibold mb-2" style={{ color: "#1a1a2e" }}>Nenhum resultado com esses filtros</p>
                <p className="text-sm mb-4" style={{ color: "#4a4a6a" }}>Tente ampliar sua busca removendo alguns filtros.</p>
                <button
                  onClick={() => setAdvancedFilters(emptyFilters)}
                  className="px-4 py-2 rounded-xl text-white text-sm font-semibold focus:outline-none"
                  style={{ backgroundColor: "#0073e6" }}
                  onFocus={(e) => { e.currentTarget.style.outline = "3px solid #0073e6"; e.currentTarget.style.outlineOffset = "2px"; }}
                  onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
                >
                  Limpar filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredResults.map((r) => <ResultCard key={r.id} item={r} />)}
              </div>
            )}
          </section>
        )}
      </div>

      <AdvancedFiltersDrawer
        isOpen={advancedOpen}
        onClose={() => setAdvancedOpen(false)}
        activeFilters={advancedFilters}
        onChange={(f) => { setAdvancedFilters(f); }}
      />
    </div>
  );
}
