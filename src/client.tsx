import { hydrateRoot } from "react-dom/client";
import { App } from "./app";
import type { Project } from "./data";

const container = document.getElementById("root");
const initialProjectsNode = document.getElementById("initial-projects");

if (!container) {
  throw new Error("Missing root container.");
}

const initialProjects = initialProjectsNode?.textContent
  ? (JSON.parse(initialProjectsNode.textContent) as Project[])
  : undefined;

hydrateRoot(
  container,
  <App initialProjects={initialProjects} />,
);
