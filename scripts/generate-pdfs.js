import crypto from "crypto";
import fs from "fs";
import markdownPdf from "markdown-pdf";
import path from "path";
import { Readable } from "stream";

const OUTPUT_DIR = "public/pdfs";
const CONTENT_DIR = "src/content";
const REFLECTION_DIR = path.join(CONTENT_DIR, "reflection");
const TRANSLATIONS_DIR = path.join(CONTENT_DIR, "translation");
const CHECKSUM_FILE = path.join(OUTPUT_DIR, ".checksums.json");
const PDF_RENDER_VERSION = "2";
const FRONTMATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---\r?\n*/;
const TITLE_PATTERN = /^title:\s*(?:"([^"]*)"|'([^']*)'|(.+))$/m;

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

const generatePdf = (inputFile, outputFile) => {
  const content = fs.readFileSync(inputFile, "utf-8");
  const pdfContent = transformMarkdownForPdf(content);
  const hash = crypto
    .createHash("md5")
    .update(`${PDF_RENDER_VERSION}:${pdfContent}`)
    .digest("hex");

  if (checksums[inputFile] === hash && fs.existsSync(outputFile)) {
    console.log(`Skipping ${path.basename(inputFile)} (unchanged)`);
    return;
  }

  Readable.from([pdfContent])
    .pipe(markdownPdf())
    .pipe(fs.createWriteStream(outputFile))
    .on("finish", () => {
      checksums[inputFile] = hash;
      saveChecksums(checksums);
      console.log(`Generated PDF for ${path.basename(inputFile)}`);
    });
};

// Generate PDFs for all files in dhamma directory
fs.readdir(REFLECTION_DIR, (err, files) => {
  if (err) {
    console.error("Error reading reflection directory:", err);
    return;
  }

  files
    .filter((file) => path.extname(file) === ".md")
    .forEach((file) => {
      const inputFile = path.join(REFLECTION_DIR, file);
      const outputFile = path.join(
        OUTPUT_DIR,
        `${path.basename(file, ".md")}.pdf`,
      );
      generatePdf(inputFile, outputFile);
    });
});

// Generate PDFs for all files in translations directory
fs.readdir(TRANSLATIONS_DIR, (err, files) => {
  if (err) {
    console.error("Error reading translations directory:", err);
    return;
  }

  files
    .filter((file) => path.extname(file) === ".md")
    .forEach((file) => {
      const inputFile = path.join(TRANSLATIONS_DIR, file);
      const outputFile = path.join(
        OUTPUT_DIR,
        `${path.basename(file, ".md")}.pdf`,
      );
      generatePdf(inputFile, outputFile);
    });
});
