import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = __dirname;
const publicDir = path.join(rootDir, "public");
const srcDir = path.join(rootDir, "src");
const envPort = typeof process !== "undefined" ? process.env.PORT : undefined;
const port = Number(envPort || 3000);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml; charset=utf-8",
  ".ico": "image/x-icon"
};

function isInside(childPath, parentPath) {
  const relative = path.relative(parentPath, childPath);
  return Boolean(relative) && !relative.startsWith("..") && !path.isAbsolute(relative);
}

function resolveRequestPath(requestUrl) {
  const url = new URL(requestUrl, `http://localhost:${port}`);
  const pathname = decodeURIComponent(url.pathname);

  if (pathname === "/" || !path.extname(pathname)) {
    return { filePath: path.join(publicDir, "index.html"), fallback: true };
  }

  if (pathname.startsWith("/src/")) {
    const filePath = path.join(srcDir, pathname.slice("/src/".length));
    return { filePath, allowedRoot: srcDir };
  }

  const filePath = path.join(publicDir, pathname);
  return { filePath, allowedRoot: publicDir };
}

const server = createServer(async (request, response) => {
  if (!["GET", "HEAD"].includes(request.method || "")) {
    response.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Method Not Allowed");
    return;
  }

  const { filePath, allowedRoot, fallback } = resolveRequestPath(request.url || "/");
  const rootToCheck = allowedRoot || publicDir;

  if (!isInside(filePath, rootToCheck) && filePath !== path.join(publicDir, "index.html")) {
    response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Forbidden");
    return;
  }

  const targetPath = existsSync(filePath) ? filePath : fallback ? path.join(publicDir, "index.html") : "";

  if (!targetPath) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not Found");
    return;
  }

  try {
    const content = await readFile(targetPath);
    const contentType = mimeTypes[path.extname(targetPath)] || "application/octet-stream";
    response.writeHead(200, {
      "Content-Type": contentType,
      "Cache-Control": "no-store"
    });
    if (request.method !== "HEAD") {
      response.end(content);
    } else {
      response.end();
    }
  } catch {
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Internal Server Error");
  }
});

server.listen(port, () => {
  console.log(`v0.1 demo running at http://localhost:${port}`);
});
