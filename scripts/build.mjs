import { access, cp, mkdir, readFile, rm } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
const requiredFiles = [
  "index.html",
  "styles.css",
  "main.js",
  "logo.jpg",
  "logo-transparent.png",
  "posters/feedback-1.jpg",
  "posters/feedback-2.jpg",
  "posters/feedback-3.jpg",
  "posters/studio-1.jpg",
  "posters/studio-2.jpg",
  "posters/studio-3.jpg",
  "feedback/1.mp4",
  "feedback/2.mp4",
  "feedback/3.mp4",
  "اعلان.mp4",
  "اعلان 1.mp4",
  "اعلان (2).mp4"
];

await Promise.all(requiredFiles.map((file) => access(path.join(root, file))));

const html = await readFile(path.join(root, "index.html"), "utf8");
const checks = [
  ["meta title", "<title>Easy Fit Alexandria | Alexandria's 1st EMS Studio</title>"],
  ["intro storage key", "easyfitIntroSeen"],
  ["video modal", "id=\"videoModal\""],
  ["no video autoplay", "autoplay"]
];

if (!html.includes(checks[0][1]) || !html.includes(checks[1][1]) || !html.includes(checks[2][1])) {
  throw new Error("Build validation failed: required landing page markup is missing.");
}

if (html.includes(checks[3][1])) {
  throw new Error("Build validation failed: testimonial videos must not autoplay.");
}

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

for (const file of ["index.html", "styles.css", "main.js", "logo.jpg", "logo-transparent.png", "package.json"]) {
  await cp(path.join(root, file), path.join(dist, file));
}

await cp(path.join(root, "feedback"), path.join(dist, "feedback"), { recursive: true });
await cp(path.join(root, "posters"), path.join(dist, "posters"), { recursive: true });

for (const file of ["اعلان.mp4", "اعلان 1.mp4", "اعلان (2).mp4"]) {
  await cp(path.join(root, file), path.join(dist, file));
}

console.log("Built Easy Fit landing page to dist/");
