/**
 * Generates an inline SVG poster (as data URI) for a game.
 * No network call — always loads. Stylized cover with gradient,
 * game title, studio and year.
 */
export function gamePoster(opts: {
  title: string;
  studio?: string;
  year?: number;
  /** Two CSS colors that compose the gradient background */
  colors: [string, string];
  /** Optional emoji-style symbol shown big behind text */
  glyph?: string;
}): string {
  const { title, studio, year, colors, glyph = "🎮" } = opts;

  // Escape XML special characters
  const safe = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  // Wrap long titles to ~14 chars per line, max 3 lines
  const words = title.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const w of words) {
    if ((current + " " + w).trim().length > 14 && current) {
      lines.push(current);
      current = w;
    } else {
      current = (current + " " + w).trim();
    }
  }
  if (current) lines.push(current);
  const top3 = lines.slice(0, 3);

  const titleSvg = top3
    .map((line, i) =>
      `<tspan x="20" dy="${i === 0 ? "0" : "1.05em"}">${safe(line)}</tspan>`
    )
    .join("");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${colors[0]}"/>
      <stop offset="100%" stop-color="${colors[1]}"/>
    </linearGradient>
    <radialGradient id="r" cx="30%" cy="20%" r="60%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.35)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
    </radialGradient>
  </defs>
  <rect width="200" height="300" fill="url(#g)"/>
  <rect width="200" height="300" fill="url(#r)"/>
  <text x="180" y="80" font-size="120" text-anchor="end" opacity="0.18">${safe(glyph)}</text>
  <text x="20" y="180" fill="white" font-family="'Atkinson Hyperlegible', 'Inter', system-ui, sans-serif" font-weight="900" font-size="22" letter-spacing="-0.5">
    ${titleSvg}
  </text>
  ${studio ? `<text x="20" y="266" fill="rgba(255,255,255,0.85)" font-family="'Atkinson Hyperlegible', system-ui, sans-serif" font-weight="700" font-size="11">${safe(studio)}</text>` : ""}
  ${year ? `<text x="20" y="282" fill="rgba(255,255,255,0.6)" font-family="'Atkinson Hyperlegible', system-ui, sans-serif" font-weight="400" font-size="10">${year}</text>` : ""}
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
