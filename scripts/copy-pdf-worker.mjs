// The /sign page renders documents with pdf.js; its worker is served from /pdfjs (copied at dev/build time,
// not committed). Same version as the pdfjs-dist package, legacy build for older phones.
import { copyFileSync, mkdirSync } from "node:fs";
mkdirSync("public/pdfjs", { recursive: true });
copyFileSync("node_modules/pdfjs-dist/legacy/build/pdf.worker.min.mjs", "public/pdfjs/pdf.worker.min.mjs");
