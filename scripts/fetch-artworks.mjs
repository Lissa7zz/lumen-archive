import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { artworks } from "../src/data/artworks.js";

const root = path.resolve(import.meta.dirname, "..");
const sourceDir = path.join(root, "work", "artwork-sources");
const outputDir = path.join(root, "public", "artworks");
const manifestPath = path.join(root, "src", "data", "artworks.json");
const userAgent = "LumenArchive/0.1 (open-source educational art archive)";

async function exists(filePath) {
  try {
    return (await stat(filePath)).isFile();
  } catch {
    return false;
  }
}

async function download(work) {
  const sourcePath = path.join(sourceDir, `${work.slug}.jpg`);
  if (await exists(sourcePath)) return sourcePath;

  // Special:Redirect/File serves a Commons thumbnail without first asking
  // the MediaWiki API for another large metadata response.
  const encodedTitle = encodeURIComponent(work.sourceFile);
  const sourceUrl =
    `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodedTitle}` +
    "?width=3600";
  const response = await fetch(sourceUrl, {
    redirect: "follow",
    headers: { "User-Agent": userAgent }
  });

  if (!response.ok) {
    throw new Error(`${work.titleZh}: source download failed (${response.status})`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length < 20_000) {
    throw new Error(`${work.titleZh}: downloaded file is unexpectedly small`);
  }

  await writeFile(sourcePath, buffer);
  return sourcePath;
}

async function processArtwork(work) {
  const sourcePath = await download(work);
  const metadata = await sharp(sourcePath).metadata();
  if (!metadata.width || !metadata.height) {
    throw new Error(`${work.titleZh}: unable to read image dimensions`);
  }

  for (const width of [1600, 3200]) {
    const outputPath = path.join(outputDir, `${work.slug}-${width}.webp`);
    const info = await sharp(sourcePath)
      .rotate()
      .resize({
        width,
        height: width,
        fit: "inside",
        withoutEnlargement: true,
        kernel: sharp.kernel.lanczos3
      })
      .webp({ quality: width === 3200 ? 84 : 80, effort: 5 })
      .toFile(outputPath);

    console.log(
      `${work.slug}-${width}.webp  ${info.width}×${info.height}  ${Math.round(info.size / 1024)} KB`
    );
  }
}

await mkdir(sourceDir, { recursive: true });
await mkdir(outputDir, { recursive: true });

for (const work of artworks) {
  try {
    await processArtwork(work);
  } catch (error) {
    console.error(`FAILED ${work.slug}:`, error.message);
    process.exitCode = 1;
  }
}

const manifest = artworks.map(({ sourceFile, sourcePage, license, licenseUrl, attribution, ...work }) => ({
  ...work,
  source: {
    file: sourceFile,
    page: sourcePage,
    license,
    licenseUrl,
    attribution
  }
}));

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Wrote ${path.relative(root, manifestPath)}`);

const licenseReadme = await readFile(path.join(root, "ATTRIBUTION.template.md"), "utf8");
await writeFile(
  path.join(root, "ATTRIBUTION.md"),
  licenseReadme.replace(
    "{{ARTWORK_LIST}}",
    artworks
      .map(
        (work, index) =>
          `${index + 1}. **${work.titleZh} / ${work.titleEn}** — ${work.artist}, ${work.displayDate}. ` +
          `${work.license}. [Wikimedia Commons](${work.sourcePage}). ${work.attribution}.`
      )
      .join("\n")
  )
);
console.log("Wrote ATTRIBUTION.md");
