import crypto from "crypto";
import fs from "fs";
// md-to-pdf ships as CommonJS, so import the default and destructure.
import mdToPdfPkg from "md-to-pdf";
import path from "path";

const { mdToPdf } = mdToPdfPkg;

const OUTPUT_DIR = "public/pdfs";
const CONTENT_DIR = "src/content";
// Collections that produce downloadable PDFs. Each now contains one
// sub-folder per language (e.g. reflection/en, reflection/es).
const PDF_COLLECTIONS = ["reflection", "translation"];
const CHECKSUM_FILE = path.join(OUTPUT_DIR, ".checksums.json");
// Bump when the rendering pipeline changes so every PDF is regenerated.
// 2 -> 3: switched from markdown-pdf (PhantomJS) to md-to-pdf (Chromium).
const PDF_RENDER_VERSION = "3";
const FRONTMATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---\r?\n*/;
const TITLE_PATTERN = /^title:\s*(?:"([^"]*)"|'([^']*)'|(.+))$/m;

// Font stack that covers Latin (incl. Vietnamese tone marks) and CJK, so the
// es/pt/vi/zh PDFs render real glyphs rather than tofu boxes. Per-character
// fallback walks this list and uses the first font that (a) Chromium can load
// and (b) has a glyph for the character.
//
// IMPORTANT: list only fonts the rendering machine can actually load. macOS
// "PingFang SC" is a .ttc that Puppeteer's bundled Chromium cannot load, so it
// must NOT be relied on — "Heiti SC"/"Songti SC" are the macOS fonts that work.
// On a Linux build host install a CJK font (e.g. `fonts-noto-cjk`) so the
// "Noto Sans CJK SC" entry resolves; otherwise zh PDFs will be blank.
const PDF_CSS = `
  body {
    font-family: -apple-system, "Helvetica Neue", Arial, "Noto Sans",
      "Heiti SC", "Songti SC", "Noto Sans CJK SC", "Noto Serif CJK SC",
      "WenQuanYi Zen Hei", sans-serif;
    line-height: 1.6;
    color: #18181b;
  }
  h1, h2, h3 { line-height: 1.3; }
`;

const PDF_CONFIG = {
  css: PDF_CSS,
  pdf_options: {
    format: "A4",
    margin: { top: "20mm", bottom: "20mm", left: "18mm", right: "18mm" },
    printBackground: true,
  },
  launch_options: {
    // --no-sandbox is required for headless Chromium in most CI environments.
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
};

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const loadChecksums = () => {
  if (fs.existsSync(CHECKSUM_FILE)) {
    return JSON.parse(fs.readFileSync(CHECKSUM_FILE, "utf-8"));
  }
  return {};
};

const saveChecksums = (checksums) => {
  fs.writeFileSync(CHECKSUM_FILE, JSON.stringify(checksums, null, 2));
};

const checksums = loadChecksums();

const transformMarkdownForPdf = (content) => {
  const frontmatterMatch = content.match(FRONTMATTER_PATTERN);

  if (!frontmatterMatch) {
    return content;
  }

  const frontmatter = frontmatterMatch[1];
  const body = content.slice(frontmatterMatch[0].length).trimStart();
  const titleMatch = frontmatter.match(TITLE_PATTERN);
  const title = (
    titleMatch?.[1] ??
    titleMatch?.[2] ??
    titleMatch?.[3] ??
    ""
  ).trim();

  if (!title) {
    return body;
  }

  return `## ${title}\n\n${body}`.trimEnd();
};

// Render a single markdown file to PDF. Returns true if a PDF was written (or
// was already up to date), false if rendering failed.
const generatePdf = async (inputFile, outputFile) => {
  const content = fs.readFileSync(inputFile, "utf-8");
  const pdfContent = transformMarkdownForPdf(content);
  const hash = crypto
    .createHash("md5")
    .update(`${PDF_RENDER_VERSION}:${PDF_CSS}:${pdfContent}`)
    .digest("hex");

  if (checksums[inputFile] === hash && fs.existsSync(outputFile)) {
    console.log(`Skipping ${inputFile} (unchanged)`);
    return true;
  }

  try {
    const pdf = await mdToPdf({ content: pdfContent }, PDF_CONFIG);
    // mdToPdf renders fully in memory, so the file is written atomically in a
    // single call — a render failure throws before anything touches disk.
    fs.writeFileSync(outputFile, pdf.content);
    checksums[inputFile] = hash;
    console.log(`Generated PDF for ${inputFile}`);
    return true;
  } catch (err) {
    console.error(`Failed to generate PDF for ${inputFile}: ${err.message}`);
    return false;
  }
};

// For each collection, walk every language sub-folder and emit PDFs into a
// matching language sub-folder under public/pdfs (e.g. public/pdfs/en/<slug>.pdf).
let failures = 0;
try {
  for (const collection of PDF_COLLECTIONS) {
    const collectionDir = path.join(CONTENT_DIR, collection);
    if (!fs.existsSync(collectionDir)) continue;

    const langDirs = fs
      .readdirSync(collectionDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);

    for (const lang of langDirs) {
      const langDir = path.join(collectionDir, lang);
      const mdFiles = fs
        .readdirSync(langDir)
        .filter((file) => path.extname(file) === ".md");

      // Skip empty language folders (e.g. translations not started yet) so we
      // don't litter public/pdfs with empty directories.
      if (mdFiles.length === 0) continue;

      const outDir = path.join(OUTPUT_DIR, lang);
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
      }

      for (const file of mdFiles) {
        const inputFile = path.join(langDir, file);
        const outputFile = path.join(
          outDir,
          `${path.basename(file, ".md")}.pdf`,
        );
        const ok = await generatePdf(inputFile, outputFile);
        if (!ok) failures += 1;
      }
    }
  }
} finally {
  // Persist checksums once, after all work is done.
  saveChecksums(checksums);
}

if (failures > 0) {
  console.error(`\n${failures} PDF(s) failed to generate.`);
}

// md-to-pdf keeps a single shared Chromium instance alive with no public way
// to close it, so the event loop never drains on its own. Exit explicitly —
// Puppeteer tears down the browser on process exit.
process.exit(failures > 0 ? 1 : 0);
