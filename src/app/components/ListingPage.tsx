import { useState, useMemo } from "react";
import { SlidersHorizontal } from "lucide-react";
import { FilterSidebar } from "./FilterSidebar";
import { ContentCard, ALL_CONTENT } from "./ContentCard";

type SortOption = "relevance" | "rating_desc" | "rating_asc" | "az" | "za";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "relevance",   label: "Mais Relevantes" },
  { value: "rating_desc", label: "Melhor Avaliados" },
  { value: "rating_asc",  label: "Menor Avaliação" },
  { value: "az",          label: "A → Z" },
  { value: "za",          label: "Z → A" },
];

interface ListingPageProps {
  onNavigate: (page: "home" | "listing" | "detail") => void;
}

export function ListingPage({ onNavigate }: ListingPageProps) {
  const [sort, setSort] = useState<SortOption>("relevance");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const sorted = useMemo(() => {
    const items = [...ALL_CONTENT];
    switch (sort) {
      case "rating_desc": return items.sort((a, b) => b.rating - a.rating);
      case "rating_asc":  return items.sort((a, b) => a.rating - b.rating);
      case "az":          return items.sort((a, b) => a.title.localeCompare(b.title));
      case "za":          return items.sort((a, b) => b.title.localeCompare(a.title));
      default:            return items.sort((a, b) => (b.perfect ? 1 : 0) - (a.perfect ? 1 : 0) || b.rating - a.rating);
    }
  }, [sort]);

  return (
    <div className="flex flex-1 overflow-hidden" style={{ minHeight: 0 }}>
      {/* Sidebar */}
      {sidebarOpen && (
        <div
          className="border-r border-gray-200 overflow-y-auto flex-shrink-0"
          style={{ width: 280, backgroundColor: "#F5F7FA" }}
        >
          <FilterSidebar />
        </div>
      )}

      {/* Content area */}
      <div className="flex-1 overflow-y-auto" style={{ backgroundColor: "#F5F7FA" }}>
        <div className="px-6 py-6">
          {/* Toolbar row */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label={sidebarOpen ? "Fechar filtros" : "Abrir filtros"}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2"
                style={{ "--tw-ring-color": "#0073e6" } as React.CSSProperties}
              >
                <SlidersHorizontal size={16} aria-hidden="true" />
                Filtros
              </button>
              <h1 className="text-base font-bold text-gray-800">
                Resultados{" "}
                <span className="text-gray-500 font-normal">
                  ({sorted.length} itens)
                </span>
              </h1>
            </div>

            {/* Sort dropdown */}
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                aria-label="Ordenar resultados"
                className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 cursor-pointer focus:outline-none focus:ring-2 hover:bg-gray-50 transition-colors"
                style={{ "--tw-ring-color": "#0073e6" } as React.CSSProperties}
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <svg
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
              >
                <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Grid */}
          <div
            className="grid gap-5"
            style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
            role="list"
            aria-label="Lista de conteúdos acessíveis"
          >
            {sorted.map((item) => (
              <div key={item.id} role="listitem">
                <ContentCard item={item} onClick={() => onNavigate("detail")} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
