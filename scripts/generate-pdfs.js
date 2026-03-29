import crypto from "crypto";
import fs from "fs";
import markdownPdf from "markdown-pdf";
import path from "path";

const OUTPUT_DIR = "public/pdfs";
const CONTENT_DIR = "src/content";
const REFLECTION_DIR = path.join(CONTENT_DIR, "reflection");
const TRANSLATIONS_DIR = path.join(CONTENT_DIR, "translation");
const CHECKSUM_FILE = path.join(OUTPUT_DIR, ".checksums.json");

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

const generatePdf = (inputFile, outputFile) => {
  const content = fs.readFileSync(inputFile, "utf-8");
  const hash = crypto.createHash("md5").update(content).digest("hex");

  if (checksums[inputFile] === hash && fs.existsSync(outputFile)) {
    console.log(`Skipping ${path.basename(inputFile)} (unchanged)`);
    return;
  }

  fs.createReadStream(inputFile)
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
