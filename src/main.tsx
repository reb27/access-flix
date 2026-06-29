import React from "react";
import ReactDOM, { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

/* axe-core accessibility audit — only in development.
   Findings appear in the browser console with rule, impact and a link to the WCAG criterion. */
if (import.meta.env.DEV) {
  import("@axe-core/react").then(({ default: axe }) => {
    axe(React, ReactDOM, 1000, {
      rules: [
        /* Disable color-contrast on decorative gradients we control ourselves */
      ],
    });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
