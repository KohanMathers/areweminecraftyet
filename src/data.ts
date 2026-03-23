export type ComplianceState = "compliant" | "in-progress";

export type Project = {
  name: string;
  sourceUrl: string;
  status: ComplianceState;
  summary: string;
  language: string;
  focus: string;
  version: string;
};

export const projects: Project[] = [
  {
    name: "Minestom VRI",
    sourceUrl: "https://github.com/Minestom/VanillaReimplementation/",
    status: "in-progress",
    summary:
      "A vanilla reimplementation effort built around matching protocol behavior and game rules.",
    language: "Java",
    focus: "Vanilla reimplementation",
    version: "Experimental",
  },
  {
    name: "Pumpkin",
    sourceUrl: "https://github.com/Pumpkin-MC/Pumpkin",
    status: "in-progress",
    summary:
      "A performance-focused Rust server project still working through full vanilla parity and quirks.",
    language: "Rust",
    focus: "Fast custom engine",
    version: "Early access",
  },
  {
    name: "Paper",
    sourceUrl: "https://github.com/PaperMC/Paper",
    status: "in-progress",
    summary:
      "A production-ready fork that intentionally diverges in behavior, so it is not counted as fully compliant here.",
    language: "Java",
    focus: "Optimized fork",
    version: "Release",
  },
];
