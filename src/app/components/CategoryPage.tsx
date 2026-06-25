import { ChevronLeft, Eye, Ear, Brain, Hand, CheckCircle2, Info } from "lucide-react";
import { ContentCard, ALL_CONTENT, type ContentItem } from "./ContentCard";

export type CategoryId = "visual" | "auditiva" | "cognitiva" | "motora";

type CategoryConfig = {
  id: CategoryId;
  Icon: React.ElementType;
  label: string;
  tagline: string;
  description: string;
  accent: string;
  accentDark: string;
  /** Featured accessibility resources for this category */
  resources: { name: string; description: string }[];
  /** Tips for the user */
  tips: string[];
  /** Useful external links */
  links: { label: string; url: string }[];
  /** How to filter ALL_CONTENT for this category */
  filter: (c: ContentItem) => boolean;
};

const CATEGORIES: Record<CategoryId, CategoryConfig> = {
  visual: {
    id: "visual",
    Icon: Eye,
    label: "Acessibilidade Visual",
    tagline: "Para quem ouve a história",
    description: "Conteúdo com audiodescrição, alto contraste e suporte a leitores de tela. Inclui pessoas com baixa visão, cegueira e daltonismo.",
    accent: "#c01a6f",
    accentDark: "#7a0d44",
    resources: [
      { name: "Audiodescrição (AD)",  description: "Narração que descreve cenas, expressões e elementos visuais entre os diálogos." },
      { name: "Alto contraste",       description: "Interface em preto/branco/amarelo para reduzir cansaço visual e melhorar leitura." },
      { name: "Leitor de tela",       description: "Compatível com NVDA, JAWS, VoiceOver e TalkBack. Todos os elementos têm rótulos descritivos." },
      { name: "Tamanho de fonte",     description: "Ajuste de 0,9× a 1,2× — escala toda a interface uniformemente." },
    ],
    tips: [
      "Procure pelo selo AD nos cards de conteúdo.",
      "Ative o alto contraste pela barra de navegação no canto superior direito.",
      "Use Tab pra navegar pelo teclado — o foco sempre aparece como contorno azul (ou amarelo no alto contraste).",
    ],
    links: [
      { label: "Vídeo descrito Brasil (catálogo de obras com AD)", url: "https://www.videodescritobrasil.com.br" },
      { label: "Comissão Brasileira de Audiodescrição",            url: "https://audiodescricao.com.br" },
    ],
    filter: (c) => c.badges.includes("AD"),
  },
  auditiva: {
    id: "auditiva",
    Icon: Ear,
    label: "Acessibilidade Auditiva",
    tagline: "Para quem vê o som",
    description: "Conteúdo com legendas descritivas (closed caption), janela de intérprete de Libras e alertas visuais. Inclui pessoas surdas e com baixa audição.",
    accent: "#005bb5",
    accentDark: "#003e7a",
    resources: [
      { name: "Legendas PT-BR",          description: "Sincronizadas com diálogo, incluindo identificação de quem fala." },
      { name: "Legendas descritivas",    description: "Closed Caption — descreve ruídos, música e tom de voz além do diálogo." },
      { name: "Intérprete de Libras",    description: "Janela permanente ou sob demanda com intérprete de Língua Brasileira de Sinais." },
      { name: "VLibras (atalho)",        description: "Plugin oficial do governo federal que traduz texto da interface para Libras em tempo real." },
    ],
    tips: [
      "O catálogo tem filtro por Libras — use o chip 'Libras' na busca.",
      "Globoplay é a plataforma líder em janela permanente de Libras no Brasil.",
      "Ative o VLibras pelo botão 'Libras' no topo da página.",
    ],
    links: [
      { label: "VLibras — plugin oficial do Governo Federal", url: "https://www.vlibras.gov.br" },
      { label: "FENEIS — Federação Nacional de Educação e Integração dos Surdos", url: "https://feneis.org.br" },
    ],
    filter: (c) => c.badges.includes("Leg") || c.badges.includes("Libras"),
  },
  cognitiva: {
    id: "cognitiva",
    Icon: Brain,
    label: "Acessibilidade Cognitiva",
    tagline: "Mais fácil de acompanhar",
    description: "Conteúdo com linguagem simplificada, ritmo mais lento, menos estímulos sensoriais. Inclui TDAH, TEA, dislexia, ansiedade e deficiência intelectual.",
    accent: "#3d7500",
    accentDark: "#264700",
    resources: [
      { name: "Linguagem simplificada",   description: "Roteiros e legendas em sentenças curtas, palavras comuns e estrutura linear." },
      { name: "Aviso de gatilhos",        description: "Marcações de conteúdo sensível: violência, gatilhos de epilepsia, sons altos repentinos." },
      { name: "Controle de ritmo",        description: "Velocidade de reprodução ajustável, pause inteligente em transições." },
      { name: "Resumo de cenas",          description: "Sinopse capítulo a capítulo pra retomar histórias longas sem se perder." },
    ],
    tips: [
      "Cards com selo Adapt têm linguagem simplificada disponível.",
      "Inside Out 2 e Wicked têm versões com narração adaptada pra neurodivergentes.",
      "Use o espaçamento 'Amplo' nas configurações de fonte se você tem dislexia.",
    ],
    links: [
      { label: "Plena Inclusão — recursos cognitivos (PT-BR)", url: "https://plenainclusao.org" },
      { label: "Tismoo — saúde cognitiva e neurodivergência",  url: "https://www.tismoo.us" },
    ],
    filter: (c) => c.badges.includes("Adapt"),
  },
  motora: {
    id: "motora",
    Icon: Hand,
    label: "Acessibilidade Motora",
    tagline: "Controles que se adaptam a você",
    description: "Conteúdo e jogos com controles adaptáveis, comandos por voz, navegação por teclado e suporte a eye-tracking. Inclui motora fina, cadeirantes e usuários de tecnologia assistiva.",
    accent: "#a35e00",
    accentDark: "#6b3d00",
    resources: [
      { name: "Controles adaptáveis",   description: "Remapear botões, ajustar sensibilidade, modo de uma mão (Xbox Adaptive Controller, PS Access)." },
      { name: "Navegação por teclado",  description: "Todos os recursos acessíveis via Tab/Enter — sem dependência de mouse ou toque preciso." },
      { name: "Comandos por voz",       description: "Atalhos de voz: 'reproduzir', 'pausar', 'próximo', integrado com Alexa/Google/Siri." },
      { name: "Eye-tracking",           description: "Compatível com Tobii e similares — controle por movimento dos olhos em jogos AAA." },
    ],
    tips: [
      "TLOU2, Forza Horizon 5 e Hi-Fi Rush têm os controles mais adaptáveis do mercado (vide ranking).",
      "Procure o badge Adapt nos cards — sinaliza controles configuráveis.",
      "Touch targets de 44×44px em toda a interface — confortável pra motora fina.",
    ],
    links: [
      { label: "Xbox Adaptive Controller",   url: "https://www.xbox.com/pt-BR/accessories/controllers/xbox-adaptive-controller" },
      { label: "PlayStation Access Controller", url: "https://www.playstation.com/pt-br/accessories/access-controller/" },
      { label: "AbleGamers — ONG global",    url: "https://ablegamers.org" },
    ],
    filter: (c) => c.badges.includes("Adapt"),
  },
};

interface CategoryPageProps {
  categoryId: CategoryId;
  onBack: () => void;
  onItemClick: () => void;
  onStreamingClick?: () => void;
  onNavigateCategory: (cat: CategoryId) => void;
}

export function CategoryPage({ categoryId, onBack, onItemClick, onStreamingClick, onNavigateCategory }: CategoryPageProps) {
  const cat = CATEGORIES[categoryId];
  const items = ALL_CONTENT.filter(cat.filter);
  const films = items.filter((c) => c.type !== "Jogos");
  const games = items.filter((c) => c.type === "Jogos");
  const otherCategories = (Object.keys(CATEGORIES) as CategoryId[]).filter((c) => c !== categoryId);

  return (
    <div style={{ backgroundColor: "#F5F7FA" }}>
      {/* Hero */}
      <section
        style={{
          background: `radial-gradient(ellipse at top right, ${cat.accent}33 0%, transparent 60%), linear-gradient(135deg, ${cat.accent} 0%, ${cat.accentDark} 100%)`,
          color: "white",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-8 pt-6 pb-10">
          <button
            type="button"
            onClick={onBack}
            className="af-focus-light inline-flex items-center gap-1.5 mb-6 text-sm rounded"
            style={{ color: "rgba(255,255,255,0.85)", minHeight: 44, padding: "0 4px" }}
            aria-label="Voltar para a página inicial"
          >
            <ChevronLeft size={18} aria-hidden="true" />
            Voltar
          </button>

          <div className="flex items-start gap-5">
            <span
              className="flex items-center justify-center rounded-3xl flex-shrink-0"
              style={{
                width: 80, height: 80,
                backgroundColor: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(8px)",
                border: "2px solid rgba(255,255,255,0.4)",
              }}
              aria-hidden="true"
            >
              <cat.Icon size={42} color="white" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-bold uppercase tracking-wider mb-1" style={{ color: "rgba(255,255,255,0.85)" }}>
                {cat.tagline}
              </p>
              <h1 className="font-black mb-2" style={{ fontSize: "clamp(28px, 4.5vw, 42px)", lineHeight: 1.05, letterSpacing: "-0.02em" }}>
                {cat.label}
              </h1>
              <p className="text-base md:text-lg" style={{ color: "rgba(255,255,255,0.92)", maxWidth: 640, lineHeight: 1.5 }}>
                {cat.description}
              </p>
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.18)" }}>
                <span className="text-sm font-bold">{items.length}</span>
                <span className="text-sm opacity-90">títulos disponíveis</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 flex flex-col gap-10">

        {/* Resources */}
        <section aria-labelledby="resources-heading">
          <h2 id="resources-heading" className="font-bold mb-4" style={{ color: "#1a1a2e", fontSize: "clamp(18px, 2.4vw, 22px)" }}>
            Recursos disponíveis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {cat.resources.map((r) => (
              <div
                key={r.name}
                className="bg-white rounded-2xl p-4 flex gap-3"
                style={{ border: "1px solid #e8ecf0" }}
              >
                <CheckCircle2 size={22} color={cat.accent} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h3 className="font-bold mb-1" style={{ color: "#1a1a2e", fontSize: 15 }}>{r.name}</h3>
                  <p className="text-sm" style={{ color: "#4a4a6a", lineHeight: 1.4 }}>{r.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tips */}
        <section
          aria-labelledby="tips-heading"
          className="rounded-2xl p-5 md:p-6"
          style={{ background: `linear-gradient(135deg, ${cat.accent}10, ${cat.accent}03)`, border: `1px solid ${cat.accent}40` }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Info size={20} color={cat.accent} aria-hidden="true" />
            <h2 id="tips-heading" className="font-bold" style={{ color: "#1a1a2e", fontSize: "clamp(17px, 2.2vw, 20px)" }}>
              Dicas pra usar o AccessFlix
            </h2>
          </div>
          <ul className="flex flex-col gap-2">
            {cat.tips.map((t, i) => (
              <li key={i} className="flex gap-2 text-sm" style={{ color: "#1a1a2e" }}>
                <span className="font-black flex-shrink-0" style={{ color: cat.accent }}>{i + 1}.</span>
                <span style={{ lineHeight: 1.5 }}>{t}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Films */}
        {films.length > 0 && (
          <section aria-labelledby="films-heading">
            <h2 id="films-heading" className="font-bold mb-4" style={{ color: "#1a1a2e", fontSize: "clamp(18px, 2.4vw, 22px)" }}>
              🎬 Filmes e séries · {films.length}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
              {films.map((c) => (
                <ContentCard key={c.id} item={c} onClick={onItemClick} onStreamingClick={onStreamingClick} />
              ))}
            </div>
          </section>
        )}

        {/* Games */}
        {games.length > 0 && (
          <section aria-labelledby="games-heading">
            <h2 id="games-heading" className="font-bold mb-4" style={{ color: "#1a1a2e", fontSize: "clamp(18px, 2.4vw, 22px)" }}>
              🎮 Jogos · {games.length}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
              {games.map((c) => (
                <ContentCard key={c.id} item={c} onClick={onItemClick} onStreamingClick={onStreamingClick} />
              ))}
            </div>
          </section>
        )}

        {/* External links */}
        <section aria-labelledby="links-heading">
          <h2 id="links-heading" className="font-bold mb-3" style={{ color: "#1a1a2e", fontSize: "clamp(17px, 2.2vw, 20px)" }}>
            Recursos externos
          </h2>
          <ul className="flex flex-col gap-2">
            {cat.links.map((l) => (
              <li key={l.url}>
                <a
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="af-focus inline-flex items-center gap-2 text-sm font-semibold rounded px-2 py-1 hover:underline"
                  style={{ color: cat.accent, minHeight: 36 }}
                >
                  ↗ {l.label}
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* Cross-link to other categories */}
        <section aria-label="Outras modalidades de acessibilidade" className="mt-2">
          <h2 className="font-bold mb-3" style={{ color: "#1a1a2e", fontSize: "clamp(17px, 2.2vw, 20px)" }}>
            Explore outras modalidades
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {otherCategories.map((id) => {
              const o = CATEGORIES[id];
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onNavigateCategory(id)}
                  className="af-focus rounded-2xl p-4 flex items-center gap-3 transition-transform hover:scale-[1.02] text-left"
                  style={{
                    background: `linear-gradient(135deg, ${o.accent}, ${o.accentDark})`,
                    color: "white",
                    minHeight: 80,
                    boxShadow: `0 6px 16px ${o.accent}40`,
                  }}
                >
                  <o.Icon size={28} color="white" aria-hidden="true" />
                  <div>
                    <div className="font-bold text-sm">{o.label}</div>
                    <div className="text-xs opacity-90">{o.tagline}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
