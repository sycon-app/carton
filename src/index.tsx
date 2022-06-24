import { ColorModeScript } from "@chakra-ui/react";
import * as React from "react";
import ReactDOM from "react-dom/client";

// fonts
import "@fontsource/plus-jakarta-sans/latin.css";

import App from "./App";
import { theme } from "./lib/styles/customTheme";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={theme.config?.initialColorMode} />
    <App />
  </React.StrictMode>
);
