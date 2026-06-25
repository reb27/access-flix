import { useState, useEffect } from "react";
import { Hand } from "lucide-react";

export function LibrasAvatar() {
  const [position, setPosition] = useState(() => ({
    x: typeof window !== "undefined" ? window.innerWidth - 100 : 0,
    y: typeof window !== "undefined" ? window.innerHeight - 100 : 0,
  }));
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  return (
    <div
      role="dialog"
      aria-label="Intérprete de Libras"
      className="fixed z-50 rounded-full shadow-lg cursor-move select-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: "64px",
        height: "64px",
        backgroundColor: "#e6308a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onMouseDown={handleMouseDown}
    >
      <Hand size={32} color="white" aria-hidden="true" />
    </div>
  );
}
