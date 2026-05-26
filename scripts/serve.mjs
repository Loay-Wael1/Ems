import { createReadStream, statSync } from "node:fs";
import { readFile } from "node:fs/promises";
import http from "node:http";
import path from "node:path";

const serveRoot = path.resolve(process.argv[2] || process.cwd());
const port = Number(process.env.PORT || 4173);

const mimeTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".mp4", "video/mp4"]
]);

const sendError = (response, statusCode, message) => {
  response.writeHead(statusCode, { "Content-Type": "text/plain; charset=utf-8" });
  response.end(message);
};

const server = http.createServer(async (request, response) => {
  try {
    const requestUrl = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
    let pathname = decodeURIComponent(requestUrl.pathname);

    if (pathname === "/") {
      pathname = "/index.html";
    }

    const filePath = path.resolve(serveRoot, `.${pathname}`);

    if (!filePath.startsWith(serveRoot)) {
      sendError(response, 403, "Forbidden");
      return;
    }

    const stats = statSync(filePath);
    const contentType = mimeTypes.get(path.extname(filePath).toLowerCase()) || "application/octet-stream";

    if (request.headers.range && contentType === "video/mp4") {
      const range = request.headers.range.replace(/bytes=/, "").split("-");
      const start = Number.parseInt(range[0], 10);
      const end = range[1] ? Number.parseInt(range[1], 10) : stats.size - 1;

      response.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${stats.size}`,
        "Accept-Ranges": "bytes",
        "Content-Length": end - start + 1,
        "Content-Type": contentType
      });
      createReadStream(filePath, { start, end }).pipe(response);
      return;
    }

    const body = await readFile(filePath);
    response.writeHead(200, {
      "Content-Type": contentType,
      "Content-Length": body.byteLength,
      "Accept-Ranges": contentType === "video/mp4" ? "bytes" : "none"
    });
    response.end(body);
  } catch {
    sendError(response, 404, "Not found");
  }
});

server.listen(port, () => {
  console.log(`Easy Fit landing page running at http://localhost:${port}`);
  console.log(`Serving ${serveRoot}`);
});
