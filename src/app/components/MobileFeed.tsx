import { useState, useRef } from "react";
import { Search, Bookmark, Play, Share2 } from "lucide-react";
import { ALL_CONTENT, type ContentItem } from "./ContentCard";

/* ── Category chips ── */
const CHIPS = [
  { id: "visual",    label: "Visual",    color: "#e6308a" },
  { id: "auditiva",  label: "Auditiva",  color: "#0073e6" },
  { id: "cognitiva", label: "Cognitiva", color: "#5ba300" },
  { id: "motora",    label: "Motora",    color: "#f5a623" },
  { id: "tdah",      label: "TDAH",      color: "#7c3aed" },
  { id: "tea",       label: "TEA",       color: "#0891b2" },
];

/* ── Access badge pill colors ── */
const BADGE = {
  AD:     { bg: "rgba(91,163,0,0.88)",   text: "white" },
  Leg:    { bg: "rgba(0,115,230,0.88)",  text: "white" },
  Libras: { bg: "rgba(230,48,138,0.88)", text: "white" },
  Adapt:  { bg: "rgba(124,58,237,0.88)", text: "white" },
} as Record<string, { bg: string; text: string }>;

/* ── Individual full-screen feed card ── */
function FeedCard({
  item,
  onDetailClick,
}: {
  item: ContentItem;
  onDetailClick: () => void;
}) {
  const [posterErr, setPosterErr] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    /*
     * Full viewport height card — the parent scroll container
     * is 100svh minus header(56) minus chips(44) minus bottombar(60) = ~684px.
     * scroll-snap-align: start snaps each card to the top.
     */
    <article
      style={{
        /* Fill the scrollport — height set by parent item wrapper */
        width: "100%",
        height: "100%",
        position: "relative",
        borderRadius: 16,
        overflow: "hidden",
        backgroundColor: item.posterColor,
        cursor: "pointer",
        flexShrink: 0,
      }}
      aria-label={`${item.title} — ${item.type}`}
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onDetailClick()}
      onFocus={(e) => {
        e.currentTarget.style.outline = "3px solid #0073e6";
        e.currentTarget.style.outlineOffset = "4px";
      }}
      onBlur={(e) => {
        e.currentTarget.style.outline = "none";
      }}
    >
      {/* Poster image */}
      {!posterErr && (
        <img
          src={item.poster}
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          onError={() => setPosterErr(true)}
          loading="lazy"
        />
      )}

      {/* Gradient overlay — transparent 0%→45%, opaque 45%→100% */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.9) 100%)",
        }}
      />

      {/* ── Top badges (category + score) ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          right: 12,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            height: 28,
            borderRadius: 14,
            padding: "0 10px",
            backgroundColor: "rgba(255,255,255,0.2)",
            backdropFilter: "blur(6px)",
            color: "white",
            fontSize: 12,
            fontWeight: 600,
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          {item.type}
        </span>
        <span
          style={{
            height: 28,
            borderRadius: 14,
            padding: "0 10px",
            backgroundColor: item.perfect ? "#22c55e" : "rgba(255,255,255,0.2)",
            backdropFilter: "blur(6px)",
            color: "white",
            fontSize: 12,
            fontWeight: 700,
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          {item.perfect ? "100%" : `${item.rating.toFixed(1)}★`}
        </span>
      </div>

      {/* ── Bottom content layer ── */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "0 16px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
        onClick={onDetailClick}
      >
        {/* Title */}
        <h3
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "white",
            lineHeight: 1.25,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {item.title}
        </h3>

        {/* Access pills */}
        {item.badges.length > 0 && (
          <div
            aria-label={`Recursos: ${item.badges.join(", ")}`}
            style={{ display: "flex", flexWrap: "wrap", gap: 6 }}
          >
            {item.badges.map((b) => (
              <span
                key={b}
                style={{
                  padding: "3px 8px",
                  borderRadius: 12,
                  fontSize: 11,
                  fontWeight: 700,
                  backgroundColor: BADGE[b]?.bg ?? "rgba(0,0,0,0.5)",
                  color: BADGE[b]?.text ?? "white",
                }}
              >
                {b}
              </span>
            ))}
          </div>
        )}

        {/* Action row */}
        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
          <ActionBtn
            icon={<Bookmark size={20} fill={saved ? "white" : "none"} />}
            label={saved ? "Salvo" : "Salvar"}
            onClick={(e) => {
              e.stopPropagation();
              setSaved((s) => !s);
            }}
          />
          <ActionBtn
            icon={<Play size={20} fill="white" />}
            label="Ver agora"
            primary
            onClick={(e) => {
              e.stopPropagation();
              onDetailClick();
            }}
          />
          <ActionBtn
            icon={<Share2 size={20} />}
            label="Compartilhar"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>
    </article>
  );
}

function ActionBtn({
  icon,
  label,
  primary,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  primary?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: primary ? "0 16px" : "0 12px",
        height: 44,
        minWidth: 44,
        borderRadius: 22,
        backgroundColor: primary ? "#0073e6" : "rgba(255,255,255,0.18)",
        border: primary ? "none" : "1px solid rgba(255,255,255,0.35)",
        color: "white",
        fontSize: 12,
        fontWeight: 600,
        backdropFilter: "blur(6px)",
        cursor: "pointer",
        outline: "none",
      }}
      onFocus={(e) => {
        e.currentTarget.style.outline = "3px solid rgba(255,255,255,0.7)";
        e.currentTarget.style.outlineOffset = "2px";
      }}
      onBlur={(e) => {
        e.currentTarget.style.outline = "none";
      }}
    >
      {icon}
      {label}
    </button>
  );
}

/* ── Main feed ── */
interface MobileFeedProps {
  onItemClick: () => void;
  onSearchClick?: () => void;
}

export function MobileFeed({ onItemClick, onSearchClick }: MobileFeedProps) {
  const [activeChip, setActiveChip] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const items = ALL_CONTENT.slice(0, 6).filter((item) => {
    if (!activeChip) return true;
    if (activeChip === "visual")    return item.badges.includes("AD");
    if (activeChip === "auditiva")  return item.badges.includes("Leg") || item.badges.includes("Libras");
    if (activeChip === "cognitiva") return item.badges.includes("AD");
    if (activeChip === "motora")    return item.badges.includes("Adapt");
    return true;
  });

  return (
    /*
     * Full-height dark container.
     * Layout: fixed header + chips, then snap-scroll feed, then fixed bottom bar.
     * The bottom bar lives in App.tsx; this component fills the space between header and bar.
     */
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: "#0a0a0a",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* ── Fixed header with backdrop blur ── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 56,
          zIndex: 20,
          backgroundColor: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
        }}
        aria-label="Cabeçalho"
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="26" height="26" viewBox="0 0 36 36" fill="none" aria-hidden="true">
            <defs>
              <linearGradient id="feedLg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#0073e6" />
                <stop offset="100%" stopColor="#005bb5" />
              </linearGradient>
            </defs>
            <rect width="36" height="36" rx="9" fill="url(#feedLg)" />
            <path d="M13 9L13 27L30 18Z" fill="white" />
          </svg>
          <span style={{ fontSize: 17, fontWeight: 800, color: "white", letterSpacing: "-0.02em" }}>
            Access<span style={{ color: "#4da3ff" }}>Flix</span>
          </span>
        </div>

        {/* Search icon */}
        <button
          onClick={onSearchClick}
          aria-label="Buscar"
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            backgroundColor: "transparent",
            border: "none",
            color: "white",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            outline: "none",
          }}
          onFocus={(e) => { e.currentTarget.style.outline = "3px solid #0073e6"; e.currentTarget.style.outlineOffset = "2px"; }}
          onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
        >
          <Search size={24} aria-hidden="true" />
        </button>
      </div>

      {/* ── Chips row — below header ── */}
      <div
        style={{
          position: "absolute",
          top: 56,
          left: 0,
          right: 0,
          height: 44,
          zIndex: 19,
          backgroundColor: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "0 16px",
          overflowX: "auto",
          scrollbarWidth: "none",
        }}
        aria-label="Filtros de categoria"
      >
        {CHIPS.map((chip) => {
          const active = activeChip === chip.id;
          return (
            <button
              key={chip.id}
              onClick={() => setActiveChip(active ? null : chip.id)}
              aria-pressed={active}
              style={{
                height: 28,
                padding: "0 12px",
                borderRadius: 14,
                backgroundColor: active ? "white" : "transparent",
                border: `1px solid ${active ? "white" : "rgba(255,255,255,0.5)"}`,
                color: active ? "#0a0a0a" : "white",
                fontSize: 13,
                fontWeight: active ? 700 : 500,
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
                outline: "none",
                transition: "all 0.15s ease",
              }}
              onFocus={(e) => { e.currentTarget.style.outline = `3px solid ${chip.color}`; e.currentTarget.style.outlineOffset = "2px"; }}
              onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      {/* ── Snap-scroll feed ── */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          scrollSnapType: "y mandatory",
          overscrollBehaviorY: "contain",
          WebkitOverflowScrolling: "touch",
          /* Push content below the absolute header+chips (56+44=100px) */
          paddingTop: 100,
          scrollbarWidth: "none",
        }}
        aria-label="Feed de conteúdo acessível"
      >
        {items.length === 0 ? (
          <div
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              color: "white",
            }}
            role="status"
          >
            <span style={{ fontSize: 48 }} aria-hidden="true">🎬</span>
            <p style={{ fontSize: 15, fontWeight: 600 }}>Nenhum conteúdo com esse filtro</p>
            <button
              onClick={() => setActiveChip(null)}
              style={{
                padding: "8px 20px",
                borderRadius: 20,
                backgroundColor: "#0073e6",
                color: "white",
                fontSize: 14,
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                outline: "none",
              }}
              onFocus={(e) => { e.currentTarget.style.outline = "3px solid #0073e6"; e.currentTarget.style.outlineOffset = "2px"; }}
              onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
            >
              Ver todos
            </button>
          </div>
        ) : (
          items.map((item) => (
            /*
             * Each wrapper = one full "screen".
             * Height = 100svh minus header(56) minus chips(44) minus bottombar(60) = calc(100svh - 160px).
             * We pad inside the scroll area by 100px (header+chips), so each snap slot
             * just needs to be 100% of the remaining visible space.
             */
            <div
              key={item.id}
              style={{
                scrollSnapAlign: "start",
                height: "calc(100svh - 160px)",
                minHeight: 380,
                maxHeight: 700,
                padding: "8px 16px",
                boxSizing: "border-box",
                display: "flex",
              }}
            >
              <FeedCard item={item} onDetailClick={onItemClick} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
