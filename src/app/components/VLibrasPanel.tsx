import { useEffect } from "react";

/**
 * VLibras controller — toggles the VISIBILITY of the official widget
 * that's already mounted from index.html (`<div vw="true">`).
 *
 * When this component is mounted, we show the widget.
 * When unmounted, we hide it again so it doesn't float forever.
 *
 * Loaded script: https://vlibras.gov.br/app/vlibras-plugin.js
 * Markup: <div vw="true" class="enabled"> in index.html.
 */
interface VLibrasPanelProps {
  onClose: () => void;
}

export function VLibrasPanel(_: VLibrasPanelProps) {
  useEffect(() => {
    const wrap = document.querySelector<HTMLElement>('[vw="true"]');
    if (!wrap) return;
    /* Make sure the widget is visible */
    wrap.classList.add("enabled");
    wrap.style.display = "";
    /* Auto-open the panel by clicking the access button */
    const btn = wrap.querySelector<HTMLElement>("[vw-access-button]");
    btn?.click();

    return () => {
      /* Re-hide when component unmounts (Libras button toggled off) */
      wrap.classList.remove("enabled");
      wrap.style.display = "none";
    };
  }, []);

  /* No UI of our own — the official widget renders itself. */
  return null;
}
