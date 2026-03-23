import { hydrateRoot } from "react-dom/client";
import { App } from "./app";
import type { Project } from "./data";

declare global {
  interface Window {
    __INITIAL_PROJECTS__?: Project[];
  }
}

const container = document.getElementById("root");

if (!container) {
  throw new Error("Missing root container.");
}

hydrateRoot(
  container,
  <App initialProjects={window.__INITIAL_PROJECTS__} />,
);
