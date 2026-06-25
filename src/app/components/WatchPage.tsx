import { ChevronLeft, Info } from "lucide-react";

/* ─── Badge config ─── */
type BadgeType = "AD" | "Leg" | "Libras";

const badgeConfig: Record<BadgeType, { label: string; bg: string }> = {
  AD:     { label: "Audiodescrição", bg: "#5ba300" },
  Leg:    { label: "Legendas",       bg: "#0073e6" },
  Libras: { label: "Libras",         bg: "#e6308a" },
};

/* ─── Platform data ─── */
interface Platform {
  id: string;
  name: string;
  initial: string;
  iconBg: string;
  badges: BadgeType[];
}

const platforms: Platform[] = [
  { id: "netflix",   name: "Netflix",    initial: "N", iconBg: "#e50914", badges: ["AD", "Leg", "Libras"] },
  { id: "prime",     name: "Prime Video",initial: "P", iconBg: "#00a8e0", badges: ["AD", "Leg"] },
  { id: "globoplay", name: "Globoplay",  initial: "G", iconBg: "#1db954", badges: ["Leg"] },
  { id: "appletv",   name: "Apple TV+",  initial: "A", iconBg: "#f97316", badges: ["AD", "Leg", "Libras"] },
];

/* ─── Single card ─── */
function PlatformCard({ platform }: { platform: Platform }) {
  const hasLibras = platform.badges.includes("Libras");

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      style={hasLibras ? { borderLeft: "4px solid #e6308a" } : { borderLeft: "4px solid transparent" }}
    >
      <div className="flex items-center gap-5 px-6 py-5">

        {/* Platform icon */}
        <div
          className="flex-shrink-0 rounded-full flex items-center justify-center text-white font-bold text-xl"
          style={{ width: 52, height: 52, backgroundColor: platform.iconBg }}
          aria-hidden="true"
        >
          {platform.initial}
        </div>

        {/* Name + badges */}
        <div className="flex-1 flex flex-col gap-2.5">
          <span className="text-base font-bold text-gray-800">{platform.name}</span>
          <div className="flex flex-wrap gap-2" aria-label="Recursos de acessibilidade disponíveis">
            {platform.badges.map((b) => (
              <span
                key={b}
                className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: badgeConfig[b].bg }}
                aria-label={badgeConfig[b].label}
              >
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          className="flex-shrink-0 rounded-xl font-bold text-white text-sm px-6 hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{
            backgroundColor: "#0073e6",
            height: 44,
            ["--tw-ring-color" as string]: "#0073e6",
          }}
          aria-label={`Assistir no ${platform.name}`}
        >
          Assistir
        </button>

      </div>
    </div>
  );
}

/* ─── Page ─── */
interface WatchPageProps {
  onBack: () => void;
}

export function WatchPage({ onBack }: WatchPageProps) {
  return (
    <div className="flex-1 overflow-y-auto" style={{ backgroundColor: "#F5F7FA" }}>
      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* Back */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 mb-8 text-sm text-gray-500 hover:text-gray-800 transition-colors focus:outline-none focus:ring-2 rounded"
          style={{ ["--tw-ring-color" as string]: "#0073e6" }}
          aria-label="Voltar para os detalhes do filme"
        >
          <ChevronLeft size={16} aria-hidden="true" />
          Voltar
        </button>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Onde Assistir com Acessibilidade
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            O Grande Filme Acessível
          </p>
        </div>

        {/* Info banner */}
        <div
          className="flex items-start gap-3 rounded-xl px-4 py-3 mb-8 text-sm font-medium"
          style={{ backgroundColor: "#dbeafe", color: "#1d4ed8" }}
          role="note"
        >
          <Info size={16} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
          Mostrando plataformas com pelo menos 1 recurso de acessibilidade ativo.
        </div>

        {/* Platform cards */}
        <div className="flex flex-col gap-4" role="list" aria-label="Plataformas de streaming">
          {platforms.map((p) => (
            <div key={p.id} role="listitem">
              <PlatformCard platform={p} />
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-8 flex items-center gap-2 text-xs text-gray-400">
          <div
            className="rounded-sm flex-shrink-0"
            style={{ width: 4, height: 20, backgroundColor: "#e6308a" }}
            aria-hidden="true"
          />
          Borda rosa indica plataformas com Intérprete de Libras disponível.
        </div>

      </div>
    </div>
  );
}
