import { useState } from "react";
import * as Checkbox from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

const filterGroups = [
  {
    id: "auditiva",
    label: "Acessibilidade Auditiva",
    accentColor: "#0073e6",
    options: [
      "Legendas Descritivas",
      "Intérprete de Libras",
      "Legendas PT-BR",
      "Closed Caption (CC)",
      "Sem música/efeitos sonoros essenciais",
    ],
  },
  {
    id: "visual",
    label: "Acessibilidade Visual",
    accentColor: "#e6308a",
    options: [
      "Audiodescrição",
      "Alto Contraste",
      "Sem Gatilhos de Epilepsia",
      "Narração descritiva de cenas",
      "Modo daltônico (paleta adaptada)",
    ],
  },
  {
    id: "cognitiva",
    label: "Acessibilidade Cognitiva e Neurodivergência",
    accentColor: "#5ba300",
    options: [
      "TDAH — Conteúdo curto e dinâmico",
      "Autismo (TEA) — Sem sobrecarga sensorial",
      "Dislexia — Legendas com fonte adaptada",
      "Ansiedade — Sem cenas de tensão prolongada",
      "Depressão — Conteúdo leve / sem gatilhos pesados",
      "Deficiência Intelectual — Linguagem simplificada",
    ],
  },
  {
    id: "motora",
    label: "Acessibilidade Motora",
    accentColor: "#f5a623",
    options: [
      "Navegação por Teclado",
      "Controles Adaptativos",
      "Comandos por Voz",
      "Eye tracking compatível",
    ],
  },
  {
    id: "outros",
    label: "Outros",
    accentColor: "#7c3aed",
    options: [
      "Conteúdo Idoso-friendly (ritmo lento, texto grande)",
      "Neurodivergência geral",
    ],
  },
  {
    id: "tipo",
    label: "Tipo de Conteúdo",
    accentColor: "#0891b2",
    options: ["Filmes", "Séries", "Jogos"],
  },
];

const DEFAULT_CHECKED: Record<string, boolean> = {
  "Legendas Descritivas": true,
  "Intérprete de Libras": true,
  "Legendas PT-BR": false,
  "Closed Caption (CC)": false,
  "Sem música/efeitos sonoros essenciais": false,
  "Audiodescrição": false,
  "Alto Contraste": false,
  "Sem Gatilhos de Epilepsia": false,
  "Narração descritiva de cenas": false,
  "Modo daltônico (paleta adaptada)": false,
  "TDAH — Conteúdo curto e dinâmico": false,
  "Autismo (TEA) — Sem sobrecarga sensorial": false,
  "Dislexia — Legendas com fonte adaptada": false,
  "Ansiedade — Sem cenas de tensão prolongada": false,
  "Depressão — Conteúdo leve / sem gatilhos pesados": false,
  "Deficiência Intelectual — Linguagem simplificada": false,
  "Navegação por Teclado": false,
  "Controles Adaptativos": false,
  "Comandos por Voz": false,
  "Eye tracking compatível": false,
  "Conteúdo Idoso-friendly (ritmo lento, texto grande)": false,
  "Neurodivergência geral": false,
  "Filmes": true,
  "Séries": true,
  "Jogos": false,
};

type CheckedState = Record<string, boolean>;

interface FilterSidebarProps {
  onApply?: (checked: CheckedState) => void;
}

/* ── Single filter item ── */
function FilterItem({
  option,
  checked,
  accentColor,
  onToggle,
}: {
  option: string;
  checked: boolean;
  accentColor: string;
  onToggle: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="flex items-start gap-3 px-2 py-1.5 rounded-lg transition-colors"
      style={{ backgroundColor: hovered ? "#f0f4ff" : "transparent" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Checkbox.Root
        id={`filter-${option}`}
        checked={!!checked}
        onCheckedChange={onToggle}
        className="flex-shrink-0 rounded focus:outline-none transition-colors"
        style={{
          width: 20,
          height: 20,
          marginTop: 1,
          backgroundColor: checked ? accentColor : "white",
          border: `2px solid ${checked ? accentColor : "#d0d5e0"}`,
          borderRadius: 5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
        onFocus={(e) => { e.currentTarget.style.outline = `3px solid ${accentColor}`; e.currentTarget.style.outlineOffset = "2px"; }}
        onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
        aria-label={option}
      >
        <Checkbox.Indicator>
          <Check size={12} color="white" strokeWidth={3} aria-hidden="true" />
        </Checkbox.Indicator>
      </Checkbox.Root>
      <label
        htmlFor={`filter-${option}`}
        className="cursor-pointer select-none leading-snug"
        style={{ fontSize: 14, color: "#4a4a6a" }}
      >
        {option}
      </label>
    </div>
  );
}

export function FilterSidebar({ onApply }: FilterSidebarProps) {
  const [checked, setChecked] = useState<CheckedState>(DEFAULT_CHECKED);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggle = (key: string) =>
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleSection = (id: string) =>
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));

  const activeCount = Object.values(checked).filter(Boolean).length;

  const handleClear = () =>
    setChecked(Object.fromEntries(Object.keys(DEFAULT_CHECKED).map((k) => [k, false])));

  return (
    <aside
      className="flex-shrink-0 h-full overflow-y-auto"
      style={{ width: 280, backgroundColor: "#F5F7FA" }}
      aria-label="Filtros de acessibilidade"
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-bold" style={{ color: "#1a1a2e" }}>
            Filtros de Acessibilidade
          </h2>
          {activeCount > 0 && (
            <button
              onClick={handleClear}
              className="text-xs font-semibold focus:outline-none rounded px-1"
              style={{ color: "#0073e6" }}
              onFocus={(e) => { e.currentTarget.style.outline = "3px solid #0073e6"; e.currentTarget.style.outlineOffset = "2px"; }}
              onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
            >
              Limpar ({activeCount})
            </button>
          )}
        </div>

        <div className="flex flex-col gap-5">
          {filterGroups.map((group) => {
            const isCollapsed = collapsed[group.id];
            const groupCheckedCount = group.options.filter((o) => checked[o]).length;

            return (
              <fieldset key={group.id} className="border-none p-0 m-0">
                {/* Section header — collapsible */}
                <button
                  onClick={() => toggleSection(group.id)}
                  className="w-full flex items-center justify-between mb-2.5 focus:outline-none rounded"
                  aria-expanded={!isCollapsed}
                  onFocus={(e) => { e.currentTarget.style.outline = `3px solid ${group.accentColor}`; e.currentTarget.style.outlineOffset = "2px"; }}
                  onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
                >
                  <div className="flex items-center gap-2">
                    {/* Color accent dot */}
                    <div
                      className="rounded-full flex-shrink-0"
                      style={{ width: 8, height: 8, backgroundColor: group.accentColor }}
                      aria-hidden="true"
                    />
                    <legend
                      className="text-xs font-bold uppercase tracking-wider text-left"
                      style={{ color: "#2d2d44" }}
                    >
                      {group.label}
                    </legend>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {groupCheckedCount > 0 && (
                      <span
                        className="flex items-center justify-center rounded-full text-white"
                        style={{
                          width: 18, height: 18,
                          backgroundColor: group.accentColor,
                          fontSize: 10, fontWeight: 700,
                        }}
                        aria-label={`${groupCheckedCount} selecionado${groupCheckedCount > 1 ? "s" : ""}`}
                      >
                        {groupCheckedCount}
                      </span>
                    )}
                    <svg
                      width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      style={{ transform: isCollapsed ? "rotate(-90deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}
                      aria-hidden="true"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </button>

                {!isCollapsed && (
                  <div className="flex flex-col gap-0.5 pl-2">
                    {group.options.map((option) => (
                      <FilterItem
                        key={option}
                        option={option}
                        checked={!!checked[option]}
                        accentColor={group.accentColor}
                        onToggle={() => toggle(option)}
                      />
                    ))}
                  </div>
                )}
              </fieldset>
            );
          })}
        </div>

        <button
          onClick={() => onApply?.(checked)}
          className="mt-6 w-full rounded-xl text-white font-bold text-sm transition-all hover:opacity-90 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{
            backgroundColor: "#0073e6",
            height: 44,
            ["--tw-ring-color" as string]: "#0073e6",
          }}
          aria-label="Aplicar filtros selecionados"
        >
          Aplicar Filtros{activeCount > 0 ? ` (${activeCount})` : ""}
        </button>
      </div>
    </aside>
  );
}
