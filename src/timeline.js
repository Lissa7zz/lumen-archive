import "./styles.css";
import "./timeline.css";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  createIcons,
  ExternalLink,
  Github
} from "lucide";
import { eras, eraForYear } from "./data/eras.js";

const app = document.querySelector("#timeline-app");

app.innerHTML = `
  <div class="chrono-shell">
    <header class="chrono-header">
      <a class="brand" href="./" aria-label="光迹美术馆首页">
        <span class="brand__mark">L/A</span>
        <span class="brand__text">
          <strong>光迹美术馆</strong>
          <small>Lumen Archive</small>
        </span>
      </a>
      <nav class="chrono-header__nav" aria-label="主导航">
        <a href="./">本期策展</a>
        <a href="archive.html">完整典藏</a>
        <a href="timeline.html" aria-current="page">时间轴</a>
      </nav>
      <a
        class="icon-button chrono-github"
        href="https://github.com/Lissa7zz/lumen-archive"
        target="_blank"
        rel="noreferrer"
        aria-label="在 GitHub 查看源码"
        title="GitHub 源码"
      >
        <i data-lucide="github" aria-hidden="true"></i>
      </a>
    </header>

    <main>
      <section class="chrono-hero">
        <span class="chrono-hero__number" aria-hidden="true">563</span>
        <div class="chrono-hero__copy">
          <p class="eyebrow">Interactive Chronology / 时间之河</p>
          <h1>从宫廷之光<br />到全球视野</h1>
          <p>
            五百多年的观看方式被压缩成一面可滚动展墙。亚洲绘画、欧洲版画、
            美洲摄影、战争现场与行星视角，在同一条年代轨道上依次展开。
          </p>
        </div>
        <div class="chrono-hero__range" aria-label="时间范围">
          <span data-year-start>1434</span>
          <div><i></i></div>
          <span data-year-end>1997</span>
        </div>
      </section>

      <section class="chrono-intro" aria-labelledby="chrono-title">
        <div>
          <p class="eyebrow">Chronological Wall / 年代展墙</p>
          <h2 id="chrono-title">全部作品，沿时间展开</h2>
        </div>
        <p class="chrono-intro__summary" data-chrono-summary>
          正在载入 322 件作品
        </p>
      </section>

      <div class="chrono-filterbar">
        <div class="chrono-filters" role="group" aria-label="按媒介筛选时间轴">
          <button class="is-active" type="button" data-chrono-filter="all" aria-pressed="true">
            全部 <span data-count-all>322</span>
          </button>
          <button type="button" data-chrono-filter="painting" aria-pressed="false">
            绘画与版画 <span data-count-painting>214</span>
          </button>
          <button type="button" data-chrono-filter="photo" aria-pressed="false">
            摄影 <span data-count-photo>108</span>
          </button>
        </div>
        <span class="chrono-filterbar__hint">按创作年代排列</span>
      </div>

      <section class="chrono-layout">
        <aside class="chrono-rail" aria-label="年代导航">
          <p>此刻经过</p>
          <strong data-current-year>1434</strong>
          <span data-current-title>正在载入作品</span>
          <div class="chrono-progress" aria-hidden="true">
            <span data-chrono-progress></span>
          </div>
          <nav class="chrono-rail__nav">
            ${eras
              .map(
                (era) => `
                  <button type="button" data-era-target="era-${era.id}">
                    <span>${era.numeral}</span>
                    <strong>${era.title}</strong>
                    <small>${era.range}</small>
                  </button>
                `
              )
              .join("")}
          </nav>
          <span class="chrono-rail__count">
            <strong data-current-index>001</strong> / <span data-current-total>322</span>
          </span>
        </aside>

        <div class="chrono-stream" data-chrono-stream>
          <div class="chrono-loading" data-chrono-loading>
            <span></span>
            <p>正在按年代整理作品</p>
          </div>
        </div>
      </section>
    </main>

    <footer class="chrono-footer">
      <div>
        <span>LUMEN ARCHIVE / CHRONOLOGY</span>
        <p>所有年代，都是此刻观看的一部分。</p>
      </div>
      <div class="chrono-footer__links">
        <a href="archive.html">完整图录 <i data-lucide="arrow-right" aria-hidden="true"></i></a>
        <a href="#top" data-back-to-top>返回顶部 <i data-lucide="arrow-up" aria-hidden="true"></i></a>
      </div>
    </footer>
  </div>
`;

const iconSet = { ArrowDown, ArrowRight, ArrowUp, ExternalLink, Github };

function refreshIcons() {
  createIcons({
    icons: iconSet,
    attrs: { "stroke-width": 1.5 }
  });
}

refreshIcons();

const stream = document.querySelector("[data-chrono-stream]");
const summary = document.querySelector("[data-chrono-summary]");
const currentYear = document.querySelector("[data-current-year]");
const currentTitle = document.querySelector("[data-current-title]");
const currentIndex = document.querySelector("[data-current-index]");
const currentTotal = document.querySelector("[data-current-total]");
const progress = document.querySelector("[data-chrono-progress]");

const state = {
  works: [],
  filter: "all",
  cardObserver: null,
  activeEraId: null
};

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return response.json();
}

async function loadTimeline() {
  const manifest = await fetchJson("data/manifest.json");
  const chunkData = await Promise.all(
    manifest.chunks.map((chunk) => fetchJson(chunk.file))
  );
  state.works = chunkData
    .flat()
    .sort((first, second) => first.year - second.year || first.titleZh.localeCompare(second.titleZh, "zh-CN"));

  const paintingCount = state.works.filter((work) => work.medium !== "摄影").length;
  const photoCount = state.works.length - paintingCount;
  document.querySelector("[data-count-all]").textContent = state.works.length;
  document.querySelector("[data-count-painting]").textContent = paintingCount;
  document.querySelector("[data-count-photo]").textContent = photoCount;
  summary.textContent =
    `${state.works.length} 件作品 · ${eras.length} 个历史阶段 · ` +
    `${state.works.at(-1).year - state.works[0].year} 年`;
  document.querySelector("[data-year-start]").textContent = state.works[0].year;
  document.querySelector("[data-year-end]").textContent = state.works.at(-1).year;
  renderStream();

  if (window.location.hash.startsWith("#era-")) {
    window.setTimeout(() => {
      document.querySelector(window.location.hash)?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 120);
  }
}

function filteredWorks() {
  if (state.filter === "photo") {
    return state.works.filter((work) => work.medium === "摄影");
  }
  if (state.filter === "painting") {
    return state.works.filter((work) => work.medium !== "摄影");
  }
  return state.works;
}

function cardMarkup(work, index) {
  return `
    <a
      class="chrono-card"
      href="archive.html?work=${encodeURIComponent(work.id)}"
      data-chrono-card
      data-index="${index}"
      data-year="${work.year}"
      data-title="${escapeHtml(work.titleZh)}"
      data-era="${eraForYear(work.year).id}"
      style="--card-accent:${work.accent}"
    >
      <span class="chrono-card__image">
        <img
          src="artworks/${work.slug}-480.webp"
          alt="${escapeHtml(work.titleZh)}，${escapeHtml(work.artist)}，${escapeHtml(work.displayDate)}"
          loading="lazy"
          decoding="async"
        />
        <span class="chrono-card__open">
          <i data-lucide="external-link" aria-hidden="true"></i>
        </span>
      </span>
      <span class="chrono-card__body">
        <span class="chrono-card__meta">
          <strong>${work.year}</strong>
          <span>${escapeHtml(work.medium)} · ${escapeHtml(work.origin)}</span>
        </span>
        <span class="chrono-card__title">${escapeHtml(work.titleZh)}</span>
        <span class="chrono-card__artist">${escapeHtml(work.artist)}</span>
        <span class="chrono-card__description">${escapeHtml(work.description)}</span>
      </span>
    </a>
  `;
}

function renderStream() {
  const works = filteredWorks();
  currentTotal.textContent = works.length;
  state.cardObserver?.disconnect();
  document.querySelectorAll("[data-era-target]").forEach((button) => {
    const era = eras.find((item) => `era-${item.id}` === button.dataset.eraTarget);
    button.hidden = !era || !works.some((work) => work.year >= era.start && work.year <= era.end);
  });

  if (!works.length) {
    stream.innerHTML = `<div class="chrono-loading"><p>当前筛选没有作品</p></div>`;
    return;
  }

  let runningIndex = 0;
  stream.innerHTML = eras
    .map((era) => {
      const eraWorks = works.filter((work) => work.year >= era.start && work.year <= era.end);
      if (!eraWorks.length) return "";
      const cards = eraWorks.map((work) => cardMarkup(work, runningIndex++)).join("");
      return `
        <section class="chrono-era" id="era-${era.id}" data-era-section="${era.id}">
          <header class="chrono-era__header">
            <span class="chrono-era__numeral">${era.numeral}</span>
            <div>
              <p>${era.range} · ${eraWorks.length} 件</p>
              <h3>${era.title}</h3>
            </div>
            <p>${era.summary}</p>
          </header>
          <div class="chrono-era__wall">${cards}</div>
        </section>
      `;
    })
    .join("");

  refreshIcons();
  setupTimelineTracking();
  updateCurrentCard(document.querySelector("[data-chrono-card]"));
}

function updateCurrentCard(card) {
  if (!card) return;
  const cards = [...document.querySelectorAll("[data-chrono-card]")];
  const index = cards.indexOf(card);
  const era = eraForYear(Number(card.dataset.year));

  currentYear.textContent = card.dataset.year;
  currentTitle.textContent = card.dataset.title;
  currentIndex.textContent = String(index + 1).padStart(3, "0");
  progress.style.transform = `scaleY(${index / Math.max(1, cards.length - 1)})`;

  document.querySelectorAll("[data-era-section]").forEach((section) => {
    section.classList.toggle("is-current", section.dataset.eraSection === era.id);
  });
  document.querySelectorAll("[data-era-target]").forEach((button) => {
    const active = button.dataset.eraTarget === `era-${era.id}`;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-current", active ? "true" : "false");
  });
  state.activeEraId = era.id;
}

function setupTimelineTracking() {
  const cards = document.querySelectorAll("[data-chrono-card]");
  state.cardObserver = new IntersectionObserver(
    (entries) => {
      const intersecting = entries
        .filter((entry) => entry.isIntersecting)
        .sort(
          (first, second) =>
            Number(first.target.dataset.index) - Number(second.target.dataset.index)
        );
      if (intersecting.length) updateCurrentCard(intersecting.at(-1).target);
    },
    { rootMargin: "-36% 0px -60% 0px", threshold: 0 }
  );
  cards.forEach((card) => state.cardObserver.observe(card));
}

document.addEventListener("click", (event) => {
  const filter = event.target.closest("[data-chrono-filter]");
  if (filter) {
    state.filter = filter.dataset.chronoFilter;
    document.querySelectorAll("[data-chrono-filter]").forEach((button) => {
      const active = button === filter;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    renderStream();
  }

  const eraButton = event.target.closest("[data-era-target]");
  if (eraButton) {
    document.querySelector(`#${eraButton.dataset.eraTarget}`)?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  if (event.target.closest("[data-back-to-top]")) {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

loadTimeline().catch((error) => {
  console.error(error);
  stream.innerHTML = `<div class="chrono-loading"><p>时间轴加载失败，请刷新页面重试。</p></div>`;
  summary.textContent = "加载失败";
});
