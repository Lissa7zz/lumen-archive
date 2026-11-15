import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { artworks as existingArtworks } from "../src/data/catalog.js";

const root = path.resolve(import.meta.dirname, "..");
const outputPath = path.join(root, "src", "data", "world-collection.json");
const api = "https://openaccess-api.clevelandart.org/api/artworks/";
const targetCount = 390;
const pageSize = 100;
const userAgent = "LumenArchive/0.5 (open-source educational art archive)";

const allocations = [
  ["European Painting and Sculpture", 50],
  ["Modern European Painting and Sculpture", 25],
  ["American Painting and Sculpture", 20],
  ["Photography", 45],
  ["Chinese Art", 45],
  ["Japanese Art", 35],
  ["Korean Art", 12],
  ["Indian and Southeast Asian Art", 35],
  ["Islamic Art", 30],
  ["African Art", 25],
  ["Art of the Americas", 35],
  ["Textiles", 10],
  ["Decorative Art and Design", 8],
  ["Oceania", 14],
  ["Oceania", 1, "Australia"]
];

const accents = [
  "#a86448",
  "#6f8a82",
  "#b08b50",
  "#667d91",
  "#96705f",
  "#7f8967",
  "#9b7b45",
  "#5e7d75"
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function clean(value = "") {
  return String(value)
    .replace(/<[^>]+>/g, " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&nbsp;", " ")
    .replace(/\s+/g, " ")
    .trim();
}

function workYear(item) {
  const start = Number(item.creation_date_earliest);
  const end = Number(item.creation_date_latest);
  if (Number.isFinite(start) && Number.isFinite(end) && start > 0 && end > 0) {
    return Math.round((start + end) / 2);
  }
  const match = String(item.creation_date ?? "").match(/\b(1[4-9]\d{2}|2000)\b/);
  return match ? Number(match[1]) : null;
}

async function fetchPage(department, skip, query = "") {
  const params = new URLSearchParams({
    department,
    cc0: "1",
    has_image: "1",
    skip: String(skip),
    limit: String(pageSize)
  });
  if (query) params.set("q", query);

  for (let attempt = 1; attempt <= 4; attempt += 1) {
    try {
      const response = await fetch(`${api}?${params}`, {
        headers: { "User-Agent": userAgent }
      });
      if (response.ok) return response.json();
    } catch {
      // Retry transient API failures with a short backoff.
    }
    await sleep(attempt * 1200);
  }
  throw new Error(`Cleveland API failed for ${department}, skip ${skip}`);
}

function score(item) {
  const print = item.images?.print ?? item.images?.web;
  let value = 0;
  if (item.is_highlight) value += 1000;
  if (item.description) value += 260;
  if (item.artlens_description) value += 180;
  if (item.did_you_know) value += 80;
  if (print) value += Math.min(Number(print.width || 0) / 40, 90);
  return value;
}

function imageAspectUsable(item) {
  const image = item.images?.print;
  if (!image) return false;
  const width = Number(image.width);
  const height = Number(image.height);
  if (!width || !height) return false;
  const ratio = width / height;
  return (
    ratio >= 0.22 &&
    ratio <= 4.5 &&
    Math.max(width, height) >= 1200
  );
}

function normalizeTitle(value) {
  return clean(value)
    .toLocaleLowerCase("en")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

function toWork(item) {
  const year = workYear(item);
  const image = item.images?.print ?? item.images?.web;
  const creator = item.creators?.[0];
  const artist = clean(
    creator?.name_in_original_language ||
      creator?.description?.replace(/\s*\([^)]*\)\s*$/, "") ||
      "Unknown maker"
  );
  const type = clean(item.type || item.classification_type || "Artwork");
  const isPhoto = /photograph/i.test(type) || item.department === "Photography";
  const medium = isPhoto
    ? "摄影"
    : /painting|print|drawing|manuscript/i.test(type)
      ? "绘画与版画"
      : "艺术与器物";
  const origin =
    item.culture?.map(clean).filter(Boolean).join(" · ") || item.department;
  const description = clean(
    item.artlens_description ||
      item.description ||
      item.did_you_know
  );
  const dimensions =
    clean(item.measurements) || clean(item.dimensions) || "馆藏数据";
  const index = Number(item.id) % accents.length;

  return {
    id: `cle-${item.id}`,
    slug: `cle-${item.id}`,
    titleZh: clean(item.title),
    titleEn: clean(item.title),
    artist,
    artistEn: artist,
    year,
    displayDate: clean(item.creation_date) || String(year),
    medium,
    mediumDetail: clean(item.technique) || type,
    origin,
    dimensions,
    collection: "克利夫兰艺术博物馆",
    sourceFile: `${item.accession_number || item.id}.jpg`,
    sourcePage: item.url,
    sourceImageUrl: image.url,
    detailWidth: 1600,
    imageWidths: [480, 1600],
    license: "CC0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    attribution: "Cleveland Museum of Art, CC0",
    description:
      description ||
      `${artist}创作于 ${clean(item.creation_date) || year} 年的${type}，来自${origin}，现藏于克利夫兰艺术博物馆。`,
    note: clean(item.did_you_know) || "",
    ratio:
      image && Number(image.width) > Number(image.height)
        ? "landscape"
        : "portrait",
    layout: "standard",
    accent: accents[index]
  };
}

const existingTitles = new Set(
  existingArtworks.map((work) => normalizeTitle(work.titleEn))
);
const selected = [];
const seenIds = new Set();
const seenTitles = new Set(existingTitles);

for (const [department, allocation, query = ""] of allocations) {
  const candidates = [];
  for (const skip of [0, 100, 200]) {
    try {
      const page = await fetchPage(department, skip, query);
      candidates.push(...(page.data ?? []));
    } catch (error) {
      console.warn(error.message);
    }
  }

  const departmentWorks = candidates
    .filter((item) => {
      const year = workYear(item);
      return (
        year >= 1400 &&
        year <= 2000 &&
        imageAspectUsable(item) &&
        item.title &&
        !seenIds.has(item.id)
      );
    })
    .sort((first, second) => score(second) - score(first));

  let taken = 0;
  for (const item of departmentWorks) {
    const normalized = normalizeTitle(item.title);
    if (!normalized || seenTitles.has(normalized)) continue;
    const work = toWork(item);
    selected.push(work);
    seenIds.add(item.id);
    seenTitles.add(normalized);
    taken += 1;
    if (taken === allocation) break;
  }
  console.log(
    `${department}${query ? ` / ${query}` : ""}: ${taken} selected (${selected.length}/${targetCount})`
  );
  await sleep(150);
}

if (selected.length > targetCount) selected.length = targetCount;

if (selected.length < targetCount) {
  const globalCandidates = [];
  for (const [department] of allocations) {
    for (const skip of [0, 100, 200, 300]) {
      try {
        const page = await fetchPage(department, skip);
        globalCandidates.push(...(page.data ?? []));
      } catch {
        // Continue with the other departments.
      }
    }
  }

  globalCandidates
    .filter((item) => {
      const year = workYear(item);
      return (
        year >= 1400 &&
        year <= 2000 &&
        imageAspectUsable(item) &&
        item.title &&
        !seenIds.has(item.id)
      );
    })
    .sort((first, second) => score(second) - score(first))
    .forEach((item) => {
      if (selected.length >= targetCount) return;
      const normalized = normalizeTitle(item.title);
      if (!normalized || seenTitles.has(normalized)) return;
      selected.push(toWork(item));
      seenIds.add(item.id);
      seenTitles.add(normalized);
    });
}

if (selected.length !== targetCount) {
  throw new Error(`Expected ${targetCount} works, received ${selected.length}`);
}

selected.sort((first, second) => first.year - second.year);
await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(selected, null, 2)}\n`);
console.log(`Wrote ${targetCount} works to ${path.relative(root, outputPath)}`);
