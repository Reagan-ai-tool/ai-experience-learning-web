import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptsDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptsDir, "..");
const distDir = path.join(rootDir, "dist");

await rm(distDir, { recursive: true, force: true });
await mkdir(distDir, { recursive: true });
await cp(path.join(rootDir, "public", "index.html"), path.join(distDir, "index.html"));
await cp(path.join(rootDir, "src"), path.join(distDir, "src"), { recursive: true });

console.log("Static Vercel build written to dist/");
