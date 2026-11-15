import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { artworks as featuredArtworks } from "../src/data/catalog.js";
import { eras } from "../src/data/eras.js";

const root = path.resolve(import.meta.dirname, "..");
const world = JSON.parse(
  await readFile(path.join(root, "src", "data", "world-collection.json"), "utf8")
);
const manifest = JSON.parse(
  await readFile(path.join(root, "public", "data", "manifest.json"), "utf8")
);
const searchIndex = JSON.parse(
  await readFile(path.join(root, "public", "data", "search-index.json"), "utf8")
);
const allWorks = [...featuredArtworks, ...world];
const errors = [];

function check(condition, message) {
  if (!condition) errors.push(message);
}

const ids = allWorks.map((work) => work.id);
const slugs = allWorks.map((work) => work.slug);
check(new Set(ids).size === ids.length, "Duplicate work IDs found");
check(new Set(slugs).size === slugs.length, "Duplicate work slugs found");
check(allWorks.length === manifest.total, "Manifest total does not match catalog");
check(
  searchIndex.length === allWorks.length,
  "Search index count does not match catalog"
);
for (const era of eras) {
  const actualCount = allWorks.filter(
    (work) => work.year >= era.start && work.year <= era.end
  ).length;
  check(
    actualCount === era.count,
    `Era count mismatch for ${era.id}: ${era.count}/${actualCount}`
  );
}

for (const work of allWorks) {
  check(
    Boolean(work.id && work.slug && work.titleEn && work.sourcePage),
    `Missing required metadata: ${work.id ?? "unknown"}`
  );
  check(
    Number.isFinite(work.year) &&
      work.year >= manifest.minYear &&
      work.year <= manifest.maxYear,
    `Year outside manifest range: ${work.id} (${work.year})`
  );
  check(Boolean(work.license), `Missing license: ${work.id}`);
  check(
    !/器物|文物/.test(work.medium ?? ""),
    `Artifact record should not be present: ${work.id}`
  );
}

const chunkWorks = [];
for (const chunk of manifest.chunks) {
  const chunkPath = path.join(root, "public", chunk.file);
  const data = JSON.parse(await readFile(chunkPath, "utf8"));
  check(Array.isArray(data), `Chunk is not an array: ${chunk.file}`);
  check(
    data.length === chunk.count,
    `Chunk count mismatch: ${chunk.file} (${data.length}/${chunk.count})`
  );
  chunkWorks.push(...data);
}
check(chunkWorks.length === allWorks.length, "Chunk total does not match catalog");
check(
  new Set(chunkWorks.map((work) => work.id)).size === allWorks.length,
  "Chunk content contains duplicate or missing IDs"
);

const expectedImages = new Set();
const validatedImages = [];
for (const work of allWorks) {
  const widths = work.imageWidths ?? [480, 1600, 3200];
  for (const width of widths) {
    const relative = `artworks/${work.slug}-${width}.webp`;
    const imagePath = path.join(root, "public", relative);
    expectedImages.add(path.basename(relative));
      validatedImages.push({ relative, imagePath });
    try {
      const image = await stat(imagePath);
      check(image.size > 1000, `Image is unexpectedly small: ${relative}`);
      check(
        image.size < 100 * 1024 * 1024,
        `Image exceeds GitHub's 100 MB file limit: ${relative}`
      );
    } catch {
      errors.push(`Missing image: ${relative}`);
    }
  }
}

for (let offset = 0; offset < validatedImages.length; offset += 32) {
  await Promise.all(
    validatedImages.slice(offset, offset + 32).map(async ({ relative, imagePath }) => {
      try {
        const metadata = await sharp(imagePath).metadata();
        check(Boolean(metadata.width && metadata.height), `Invalid image: ${relative}`);
        check(metadata.format === "webp", `Unexpected image format: ${relative}`);
      } catch {
        errors.push(`Unreadable image: ${relative}`);
      }
    })
  );
}

const artworkFiles = (await readdir(path.join(root, "public", "artworks"))).filter(
  (file) => file.endsWith(".webp")
);
const orphanImages = artworkFiles.filter((file) => !expectedImages.has(file));
check(orphanImages.length === 0, `Orphan images found: ${orphanImages.length}`);

if (errors.length) {
  console.error(`Catalog validation failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  `Catalog OK: ${allWorks.length} works, ${manifest.chunks.length} chunks, ` +
    `${searchIndex.length} search records, ${artworkFiles.length} images, ` +
    `${manifest.minYear}–${manifest.maxYear}.`
);
