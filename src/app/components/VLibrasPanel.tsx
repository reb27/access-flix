import { useState, useRef, useEffect } from "react";
import { ChevronDown, X, GripHorizontal, User } from "lucide-react";

interface VLibrasPanelProps {
  onClose: () => void;
}

export function VLibrasPanel({ onClose }: VLibrasPanelProps) {
  const [expanded, setExpanded] = useState(true);
  const [position, setPosition] = useState(() => ({
    x: typeof window !== "undefined" ? Math.min(window.innerWidth - 320, window.innerWidth - 48) : 20,
    y: typeof window !== "undefined" ? window.innerHeight - 420 : 100,
  }));
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(true);
  const panelRef = useRef<HTMLDivElement>(null);

  /* ── drag ── */
  const handleDragStart = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleTouchDragStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    setIsDragging(true);
    setDragOffset({ x: t.clientX - position.x, y: t.clientY - position.y });
  };

  useEffect(() => {
    if (!isDragging) return;
    const move = (e: MouseEvent) =>
      setPosition({ x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y });
    const touchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      setPosition({ x: t.clientX - dragOffset.x, y: t.clientY - dragOffset.y });
    };
    const up = () => setIsDragging(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchmove", touchMove);
    window.addEventListener("touchend", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchmove", touchMove);
      window.removeEventListener("touchend", up);
    };
  }, [isDragging, dragOffset]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  if (!visible && !isDragging) return null;

  /* ── minimized bubble ── */
  if (!expanded) {
    return (
      <div
        role="button"
        title="Intérprete de Libras ativo"
        aria-label="Intérprete de Libras — clique para expandir"
        tabIndex={0}
        className="fixed z-50 rounded-full shadow-xl cursor-move select-none flex items-center justify-center"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: 64,
          height: 64,
          backgroundColor: "#0073e6",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
        onMouseDown={handleDragStart}
        onTouchStart={handleTouchDragStart}
        onKeyDown={(e) => e.key === "Enter" && setExpanded(true)}
        onClick={() => setExpanded(true)}
      >
        {/* Hands icon */}
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
          <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
          <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
          <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
        </svg>
        {/* Green active dot */}
        <div
          className="absolute top-1 right-1 rounded-full"
          style={{ width: 12, height: 12, backgroundColor: "#22c55e", border: "2px solid white" }}
          aria-hidden="true"
        />
      </div>
    );
  }

  /* ── expanded panel ── */
  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Intérprete de Libras"
      aria-live="polite"
      className="fixed z-50 select-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: 280,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.3s ease",
      }}
    >
      <div
        className="rounded-2xl overflow-hidden flex flex-col"
        style={{
          boxShadow: "0 16px 48px rgba(0,0,0,0.22)",
          border: "1px solid rgba(0,115,230,0.15)",
          backgroundColor: "#ffffff",
        }}
      >
        {/* Header — drag handle */}
        <div
          className="flex items-center justify-between px-4 py-3 cursor-grab active:cursor-grabbing"
          style={{ backgroundColor: "#0073e6" }}
          onMouseDown={handleDragStart}
          onTouchStart={handleTouchDragStart}
        >
          <div className="flex items-center gap-2">
            <GripHorizontal size={14} color="rgba(255,255,255,0.7)" aria-hidden="true" />
            <span className="text-sm font-semibold text-white">Intérprete de Libras</span>
            {/* VLibras badge */}
            <span
              className="px-1.5 py-0.5 rounded text-white"
              style={{ fontSize: 10, fontWeight: 700, backgroundColor: "rgba(255,255,255,0.2)" }}
            >
              VLibras
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setExpanded(false)}
              aria-label="Minimizar painel"
              className="p-1 rounded hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              style={{ minWidth: 28, minHeight: 28 }}
            >
              <ChevronDown size={16} color="white" />
            </button>
            <button
              onClick={handleClose}
              aria-label="Fechar intérprete de Libras"
              className="p-1 rounded hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              style={{ minWidth: 28, minHeight: 28 }}
            >
              <X size={16} color="white" />
            </button>
          </div>
        </div>

        {/* Avatar area */}
        <div
          className="flex flex-col items-center justify-center gap-4 py-8 px-4"
          style={{ backgroundColor: "#f0f4ff", minHeight: 200 }}
        >
          {/* Animated interpreter placeholder */}
          <div
            className="rounded-2xl flex flex-col items-center justify-center gap-2"
            style={{
              width: 140,
              height: 160,
              backgroundColor: "#dde8f8",
              border: "2px dashed #0073e6",
            }}
          >
            <User size={48} color="#0073e6" aria-hidden="true" />
            {/* Animated signal bars */}
            <div className="flex items-end gap-1" aria-hidden="true">
              {[3, 5, 4, 6, 3].map((h, i) => (
                <div
                  key={i}
                  className="rounded-full"
                  style={{
                    width: 4,
                    height: h * 2,
                    backgroundColor: "#0073e6",
                    opacity: 0.6 + i * 0.08,
                    animation: `pulse ${0.6 + i * 0.15}s ease-in-out infinite alternate`,
                  }}
                />
              ))}
            </div>
          </div>
          <p className="text-center text-sm" style={{ color: "#4a4a6a" }}>
            Traduzindo conteúdo da página...
          </p>
        </div>

        {/* Footer */}
        <div
          className="px-4 py-3 flex items-center justify-between"
          style={{ borderTop: "1px solid #e8ecf0" }}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#22c55e" }} aria-hidden="true" />
            <span className="text-xs" style={{ color: "#4a4a6a" }}>Libras ativo</span>
          </div>
          <span className="text-xs" style={{ color: "#9ca3af" }}>Powered by VLibras</span>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          from { transform: scaleY(0.6); }
          to { transform: scaleY(1.2); }
        }
      `}</style>
    </div>
  );
}
