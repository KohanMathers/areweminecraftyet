import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";
import React from "react";
import { renderToString } from "react-dom/server";
import { App } from "./src/app";
import { projects } from "./src/data";

const root = import.meta.dir;
const distDir = join(root, "dist");
const assetsDir = join(distDir, "assets");
const templatePath = join(root, "src", "index.html");

function serializeForScript(value: unknown) {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

async function build() {
  await rm(distDir, { force: true, recursive: true });
  await mkdir(assetsDir, { recursive: true });

  const jsResult = await Bun.build({
    entrypoints: [join(root, "src", "client.tsx")],
    format: "esm",
    minify: true,
    outdir: assetsDir,
    target: "browser",
  });

  if (!jsResult.success) {
    throw new AggregateError(
      jsResult.logs,
      "Failed to build the client bundle for src/client.tsx.",
    );
  }

  const cssResult = Bun.spawnSync({
    cmd: [
      join(root, "node_modules", ".bin", "tailwindcss"),
      "-i",
      join(root, "src", "styles.css"),
      "-o",
      join(assetsDir, "styles.css"),
      "--minify",
    ],
    cwd: root,
    stderr: "inherit",
    stdout: "inherit",
  });

  if (cssResult.exitCode !== 0) {
    throw new Error("Failed to build Tailwind CSS.");
  }

  const clientOutput = jsResult.outputs.find((output) => output.path.endsWith(".js"));

  if (!clientOutput) {
    throw new Error("Client bundle did not produce a JavaScript output.");
  }

  const template = await readFile(templatePath, "utf8");
  const appHtml = renderToString(
    React.createElement(App, { initialProjects: projects }),
  );
  const html = template
    .replace("<!--app-html-->", appHtml)
    .replace("<!--app-data-->", serializeForScript(projects))
    .replace("/assets/client.js", `/assets/${basename(clientOutput.path)}`);

  await writeFile(join(distDir, "index.html"), html);
}

await build();
