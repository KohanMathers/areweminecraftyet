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
    throw new AggregateError(jsResult.logs, "Failed to build client bundle.");
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

  const template = await readFile(templatePath, "utf8");
  const appHtml = renderToString(
    React.createElement(App, { initialProjects: projects }),
  );
  const html = template
    .replace("<!--app-html-->", appHtml)
    .replace("<!--app-data-->", JSON.stringify(projects))
    .replace("/assets/client.js", `/assets/${basename(jsResult.outputs[0]!.path)}`);

  await writeFile(join(distDir, "index.html"), html);
}

await build();
