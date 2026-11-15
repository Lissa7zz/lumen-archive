import { mkdir, readFile, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { artworks } from "../src/data/catalog.js";

const root = path.resolve(import.meta.dirname, "..");
const sourceDir = path.join(root, "work", "artwork-sources");
const outputDir = path.join(root, "public", "artworks");
const userAgent = "LumenArchive/0.1 (open-source educational art archive)";
const supplementalWorks = JSON.parse(
  await readFile(
    path.join(root, "src", "data", "world-collection.json"),
    "utf8"
  )
);
const allArtworks = [...artworks, ...supplementalWorks];

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
    work.sourceImageUrl ??
    (`https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodedTitle}` +
      "?width=3600");
  const thumbnailUrl =
    "https://commons.wikimedia.org/w/thumb.php?f=" +
    encodeURIComponent(work.sourceFile.replaceAll(" ", "_")) +
    "&w=3600";
  let response;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      response = await fetch(sourceUrl, {
        redirect: "follow",
        headers: { "User-Agent": userAgent }
      });
      if (response.ok) break;
      if (response.status === 429) break;
    } catch {
      response = null;
    }
    await new Promise((resolve) => setTimeout(resolve, attempt * 1200));
  }

  if (!response?.ok) {
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      try {
        response = await fetch(thumbnailUrl, {
          redirect: "follow",
          headers: { "User-Agent": userAgent }
        });
        if (response.ok) break;
      } catch {
        response = null;
      }
      await new Promise((resolve) => setTimeout(resolve, attempt * 1200));
    }
  }

  if (!response?.ok) {
    throw new Error(
      `${work.titleZh}: source download failed (${response?.status ?? "network error"})`
    );
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length < 20_000) {
    throw new Error(`${work.titleZh}: downloaded file is unexpectedly small`);
  }

  await writeFile(sourcePath, buffer);
  return sourcePath;
}

async function processArtwork(work) {
  const imageWidths = work.imageWidths ?? [480, 1600, 3200];
  const outputPaths = imageWidths.map((width) =>
    path.join(outputDir, `${work.slug}-${width}.webp`)
  );
  if ((await Promise.all(outputPaths.map(exists))).every(Boolean)) {
    console.log(`${work.slug}: up to date`);
    return;
  }

  const sourcePath = await download(work);
  const metadata = await sharp(sourcePath).metadata();
  if (!metadata.width || !metadata.height) {
    throw new Error(`${work.titleZh}: unable to read image dimensions`);
  }

  for (const width of imageWidths) {
    const outputPath = path.join(outputDir, `${work.slug}-${width}.webp`);
    const quality = width === 480 ? 76 : width === 1600 ? 80 : 84;
    const info = await sharp(sourcePath)
      .rotate()
      .resize({
        width,
        height: width,
        fit: "inside",
        withoutEnlargement: true,
        kernel: sharp.kernel.lanczos3
      })
      .webp({ quality, effort: 5 })
      .toFile(outputPath);

    console.log(
      `${work.slug}-${width}.webp  ${info.width}×${info.height}  ${Math.round(info.size / 1024)} KB`
    );
  }

  if (work.sourceImageUrl) await unlink(sourcePath).catch(() => {});
}

await mkdir(sourceDir, { recursive: true });
await mkdir(outputDir, { recursive: true });

for (const work of allArtworks) {
  try {
    await processArtwork(work);
  } catch (error) {
    console.error(`FAILED ${work.slug}:`, error.message);
    process.exitCode = 1;
  }
}

const licenseReadme = await readFile(path.join(root, "ATTRIBUTION.template.md"), "utf8");
await writeFile(
  path.join(root, "ATTRIBUTION.md"),
  licenseReadme.replace(
    "{{ARTWORK_LIST}}",
    allArtworks
      .map(
        (work, index) => {
          const title =
            work.titleZh === work.titleEn
              ? work.titleEn
              : `${work.titleZh} / ${work.titleEn}`;
          return (
            `${index + 1}. **${title}** — ${work.artist}, ${work.displayDate}. ` +
            `${work.license}. [原始档案](${work.sourcePage}). ${work.attribution}.`
          );
        }
      )
      .join("\n")
  )
);
console.log("Wrote ATTRIBUTION.md");
