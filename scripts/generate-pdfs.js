import fs from "fs";
import markdownPdf from "markdown-pdf";
import path from "path";

const OUTPUT_DIR = "public/pdfs";
const CONTENT_DIR = "src/content";
const DHAMMA_PATH = path.join(CONTENT_DIR, "pages/dhamma.md");
const POSTS_DIR = path.join(CONTENT_DIR, "posts");

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const generatePdf = (inputFile, outputFile) => {
  fs.createReadStream(inputFile)
    .pipe(markdownPdf())
    .pipe(fs.createWriteStream(outputFile))
    .on("finish", () =>
      console.log(`Generated PDF for ${path.basename(inputFile)}`),
    );
};

// Generate PDF for dhamma.md
generatePdf(DHAMMA_PATH, path.join(OUTPUT_DIR, "dhamma.pdf"));

// Generate PDFs for all files in posts directory
fs.readdir(POSTS_DIR, (err, files) => {
  if (err) {
    console.error("Error reading posts directory:", err);
    return;
  }

  files
    .filter((file) => path.extname(file) === ".md")
    .forEach((file) => {
      const inputFile = path.join(POSTS_DIR, file);
      const outputFile = path.join(
        OUTPUT_DIR,
        `${path.basename(file, ".md")}.pdf`,
      );
      generatePdf(inputFile, outputFile);
    });
});
