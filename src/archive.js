import "./styles.css";
import "./archive.css";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  createIcons,
  ExternalLink,
  Github,
  Search,
  X
} from "lucide";

const app = document.querySelector("#archive-app");

app.innerHTML = `
  <div class="archive-shell">
    <header class="archive-header">
      <a class="brand" href="./" aria-label="光迹美术馆首页">
        <span class="brand__mark">L/A</span>
        <span class="brand__text">
          <strong>光迹美术馆</strong>
          <small>Lumen Archive</small>
        </span>
      </a>
      <nav class="archive-header__nav" aria-label="主导航">
        <a href="./">本期策展</a>
        <a href="archive.html" aria-current="page">完整典藏</a>
        <a href="timeline.html">时间轴</a>
      </nav>
      <a
        class="icon-button archive-github"
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
      <section class="archive-hero">
        <div class="archive-hero__index" data-hero-count aria-hidden="true">322</div>
        <div class="archive-hero__copy">
          <p class="eyebrow">Complete Collection / 完整典藏</p>
          <h1>五百年视觉档案</h1>
          <p>
            从文艺复兴的宗教图像到月球轨道上的地球，按年代浏览绘画、版画与摄影。
            图像、来源和授权信息均随作品保存。
          </p>
        </div>
        <dl class="archive-stats">
          <div><dt>作品</dt><dd data-total-count>322</dd></div>
          <div><dt>年代跨度</dt><dd><span data-year-span>563</span> 年</dd></div>
          <div><dt>数据分块</dt><dd data-chunk-count>13</dd></div>
        </dl>
      </section>

      <section class="archive-catalog" aria-labelledby="archive-title">
        <div class="archive-catalog__heading">
          <div>
            <p class="eyebrow">Catalogue / 图录</p>
            <h2 id="archive-title">全部作品</h2>
          </div>
          <p data-catalog-summary aria-live="polite">正在载入作品目录</p>
        </div>

        <div class="archive-toolbar">
          <label class="archive-search">
            <span class="sr-only">搜索完整典藏</span>
            <i data-lucide="search" aria-hidden="true"></i>
            <input
              type="search"
              placeholder="搜索作品、艺术家、年代或馆藏"
              autocomplete="off"
              data-archive-search
            />
          </label>
          <label class="archive-sort">
            <span>排序</span>
            <select data-archive-sort>
              <option value="year-asc">年代从早到晚</option>
              <option value="year-desc">年代从晚到早</option>
              <option value="title">标题</option>
              <option value="artist">艺术家</option>
            </select>
            <i data-lucide="arrow-down" aria-hidden="true"></i>
          </label>
        </div>

        <div class="catalog-status" data-catalog-status>
          <span></span><span></span><span></span>
          <p>正在分块载入作品数据</p>
        </div>
        <div class="archive-grid" data-archive-grid hidden></div>
        <div class="archive-empty" data-archive-empty hidden>
          <i data-lucide="search" aria-hidden="true"></i>
          <h3>没有找到匹配的作品</h3>
          <button type="button" class="text-link" data-clear-archive-search>清除搜索</button>
        </div>
        <nav class="archive-pagination" data-pagination aria-label="作品分页"></nav>
      </section>
    </main>

    <footer class="archive-footer">
      <div>
        <span>LUMEN ARCHIVE</span>
        <p>让经典回到可被凝视的日常。</p>
      </div>
      <a href="./">返回本期策展 <i data-lucide="arrow-right" aria-hidden="true"></i></a>
      <small>Code: MIT · Images: Public Domain / CC</small>
    </footer>
  </div>

  <dialog class="archive-viewer" data-archive-viewer aria-labelledby="archive-viewer-title">
    <header>
      <span data-archive-viewer-counter></span>
      <div>
        <a data-archive-viewer-source target="_blank" rel="noreferrer">
          原始档案
          <i data-lucide="external-link" aria-hidden="true"></i>
        </a>
        <button
          class="icon-button"
          type="button"
          data-archive-viewer-close
          aria-label="关闭作品查看器"
          title="关闭"
        >
          <i data-lucide="x" aria-hidden="true"></i>
        </button>
      </div>
    </header>
    <div class="archive-viewer__stage">
      <button type="button" data-archive-viewer-prev aria-label="上一件作品">
        <i data-lucide="arrow-left" aria-hidden="true"></i>
      </button>
      <a data-archive-viewer-full target="_blank" rel="noreferrer" title="在新标签页查看高清图像">
        <img data-archive-viewer-image alt="" />
      </a>
      <button type="button" data-archive-viewer-next aria-label="下一件作品">
        <i data-lucide="arrow-right" aria-hidden="true"></i>
      </button>
    </div>
    <div class="archive-viewer__info">
      <p class="eyebrow" data-archive-viewer-label></p>
      <h2 id="archive-viewer-title" data-archive-viewer-title></h2>
      <p data-archive-viewer-original></p>
      <p data-archive-viewer-byline></p>
      <p data-archive-viewer-description></p>
      <dl>
        <div><dt>年代</dt><dd data-archive-viewer-date></dd></div>
        <div><dt>媒介</dt><dd data-archive-viewer-medium></dd></div>
        <div><dt>收藏</dt><dd data-archive-viewer-collection></dd></div>
        <div><dt>许可</dt><dd data-archive-viewer-license></dd></div>
      </dl>
    </div>
  </dialog>
`;

const iconSet = {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Github,
  Search,
  X
};

function refreshIcons() {
  createIcons({
    icons: iconSet,
    attrs: { "stroke-width": 1.5 }
  });
}

refreshIcons();

const grid = document.querySelector("[data-archive-grid]");
const status = document.querySelector("[data-catalog-status]");
const summary = document.querySelector("[data-catalog-summary]");
const pagination = document.querySelector("[data-pagination]");
const emptyState = document.querySelector("[data-archive-empty]");
const searchInput = document.querySelector("[data-archive-search]");
const sortSelect = document.querySelector("[data-archive-sort]");
const viewer = document.querySelector("[data-archive-viewer]");
const viewerImage = document.querySelector("[data-archive-viewer-image]");
const viewerFull = document.querySelector("[data-archive-viewer-full]");

const state = {
  works: [],
  searchIndex: [],
  searchIndexPromise: null,
  query: "",
  sort: "year-asc",
  page: 1,
  perPage: 12,
  filteredWorks: [],
  filterToken: 0,
  viewerId: null,
  viewerWorks: [],
  lastFocusedElement: null
};

const collator = new Intl.Collator("zh-CN", {
  numeric: true,
  sensitivity: "base"
});

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function fetchJson(url, attempt = 0) {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout?.(12000)
    });
    if (!response.ok) throw new Error(`${url} returned ${response.status}`);
    return response.json();
  } catch (error) {
    if (attempt >= 2) throw error;
    await new Promise((resolve) => setTimeout(resolve, 350 * (attempt + 1)));
    return fetchJson(url, attempt + 1);
  }
}

async function loadCatalog() {
  const manifest = await fetchJson("data/manifest.json");
  let loadedChunks = 0;
  const chunkResults = await Promise.all(
    manifest.chunks.map(async (chunk) => {
      const data = await fetchJson(chunk.file);
      loadedChunks += 1;
      status.querySelector("p").textContent =
        `已载入 ${loadedChunks} / ${manifest.chunks.length} 个作品数据块`;
      return data;
    })
  );

  state.works = chunkResults.flat();
  state.perPage = manifest.pageSize;
  document.querySelector("[data-total-count]").textContent = manifest.total;
  document.querySelector("[data-hero-count]").textContent = manifest.total;
  document.querySelector("[data-chunk-count]").textContent =
    String(manifest.chunks.length).padStart(2, "0");
  document.querySelector("[data-year-span]").textContent = manifest.yearSpan;

  status.hidden = true;
  grid.hidden = false;

  if ("requestIdleCallback" in window) {
    requestIdleCallback(() => loadSearchIndex());
  } else {
    setTimeout(() => loadSearchIndex(), 200);
  }

  readUrlState();
  await applyFilters();

  if (new URLSearchParams(window.location.search).get("work")) {
    const workId = new URLSearchParams(window.location.search).get("work");
    if (state.works.some((work) => work.id === workId)) {
      window.setTimeout(() => openViewer(workId), 0);
    }
  }
}

function loadSearchIndex() {
  state.searchIndexPromise ??= fetchJson("data/search-index.json").then((index) => {
    state.searchIndex = index;
    return index;
  });
  return state.searchIndexPromise;
}

function sortWorks(works) {
  return [...works].sort((first, second) => {
    if (state.sort === "year-desc") return second.year - first.year;
    if (state.sort === "title") return collator.compare(first.titleZh, second.titleZh);
    if (state.sort === "artist") {
      return (
        collator.compare(first.artist, second.artist) ||
        first.year - second.year
      );
    }
    return first.year - second.year;
  });
}

async function applyFilters() {
  const token = ++state.filterToken;
  let works = state.works;
  const query = state.query.trim().toLocaleLowerCase("zh-CN");

  if (query) {
    const index = await loadSearchIndex();
    if (token !== state.filterToken) return;
    const tokens = query.split(/\s+/);
    const matches = new Set(
      index
        .filter((entry) => tokens.every((token) => entry.text.includes(token)))
        .map((entry) => entry.id)
    );
    works = works.filter((work) => matches.has(work.id));
  }

  state.filteredWorks = sortWorks(works);
  const totalPages = Math.max(
    1,
    Math.ceil(state.filteredWorks.length / state.perPage)
  );
  state.page = Math.min(Math.max(state.page, 1), totalPages);

  renderCatalog();
  writeUrlState(totalPages);
}

function renderCatalog() {
  const total = state.filteredWorks.length;
  const totalPages = Math.max(1, Math.ceil(total / state.perPage));
  const start = (state.page - 1) * state.perPage;
  const pageWorks = state.filteredWorks.slice(start, start + state.perPage);

  summary.textContent = state.query
    ? `找到 ${total} 件作品 · 第 ${state.page} / ${totalPages} 页`
    : `共 ${total} 件作品 · 第 ${state.page} / ${totalPages} 页`;

  grid.innerHTML = pageWorks
    .map(
      (work, index) => `
        <article class="archive-card">
          <button type="button" data-archive-work="${escapeHtml(work.id)}">
            <span class="archive-card__image">
              <img
                src="artworks/${work.slug}-480.webp"
                alt="${escapeHtml(work.titleZh)}，${escapeHtml(work.artist)}，${escapeHtml(work.displayDate)}"
                loading="${index < 4 ? "eager" : "lazy"}"
              />
              <span class="archive-card__number">${String(start + index + 1).padStart(2, "0")}</span>
              <span class="archive-card__open">
                <i data-lucide="external-link" aria-hidden="true"></i>
              </span>
            </span>
            <span class="archive-card__caption">
              <span class="archive-card__meta">${escapeHtml(work.displayDate)} · ${escapeHtml(work.medium)}</span>
              <strong>${escapeHtml(work.titleZh)}</strong>
              <small>${escapeHtml(work.titleEn)}</small>
              <span>${escapeHtml(work.artist)}</span>
            </span>
          </button>
        </article>
      `
    )
    .join("");

  emptyState.hidden = total > 0;
  grid.hidden = total === 0;
  renderPagination(totalPages);
  refreshIcons();
}

function pageItems(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);
  const pages = [...new Set([1, current - 1, current, current + 1, total])]
    .filter((page) => page >= 1 && page <= total)
    .sort((first, second) => first - second);
  const result = [];
  pages.forEach((page, index) => {
    if (index && page - pages[index - 1] > 1) result.push("ellipsis");
    result.push(page);
  });
  return result;
}

function renderPagination(totalPages) {
  if (!state.filteredWorks.length) {
    pagination.innerHTML = "";
    return;
  }

  pagination.innerHTML = `
    <button
      type="button"
      class="archive-pagination__arrow"
      data-page="${state.page - 1}"
      aria-label="上一页"
      ${state.page === 1 ? "disabled" : ""}
    >
      <i data-lucide="arrow-left" aria-hidden="true"></i>
    </button>
    <div class="archive-pagination__pages">
      ${pageItems(state.page, totalPages)
        .map((item) =>
          item === "ellipsis"
            ? `<span aria-hidden="true">…</span>`
            : `<button
                type="button"
                data-page="${item}"
                class="${item === state.page ? "is-active" : ""}"
                ${item === state.page ? 'aria-current="page"' : ""}
              >${item}</button>`
        )
        .join("")}
    </div>
    <button
      type="button"
      class="archive-pagination__arrow"
      data-page="${state.page + 1}"
      aria-label="下一页"
      ${state.page === totalPages ? "disabled" : ""}
    >
      <i data-lucide="arrow-right" aria-hidden="true"></i>
    </button>
  `;
  refreshIcons();
}

function readUrlState() {
  const params = new URLSearchParams(window.location.search);
  state.query = params.get("q") ?? "";
  state.sort = params.get("sort") ?? "year-asc";
  state.page = Number(params.get("page") ?? 1) || 1;
  searchInput.value = state.query;
  sortSelect.value = ["year-asc", "year-desc", "title", "artist"].includes(state.sort)
    ? state.sort
    : "year-asc";
  state.sort = sortSelect.value;
}

function writeUrlState(totalPages = 1) {
  const url = new URL(window.location.href);
  if (state.query) url.searchParams.set("q", state.query);
  else url.searchParams.delete("q");
  if (state.sort !== "year-asc") url.searchParams.set("sort", state.sort);
  else url.searchParams.delete("sort");
  if (state.page > 1) url.searchParams.set("page", state.page);
  else url.searchParams.delete("page");
  if (totalPages <= 1) url.searchParams.delete("page");
  window.history.replaceState(null, "", url);
}

function setViewerUrl(workId) {
  const url = new URL(window.location.href);
  url.searchParams.set("work", workId);
  window.history.replaceState(null, "", url);
}

function clearViewerUrl() {
  const url = new URL(window.location.href);
  if (!url.searchParams.has("work")) return;
  url.searchParams.delete("work");
  window.history.replaceState(null, "", url);
}

function openViewer(id) {
  let collection = state.filteredWorks;
  let index = collection.findIndex((work) => work.id === id);
  if (index < 0) {
    collection = state.works;
    index = collection.findIndex((work) => work.id === id);
  }
  if (index < 0) return;
  const work = collection[index];
  const wasOpen = viewer.open;

  if (!wasOpen) state.lastFocusedElement = document.activeElement;
  state.viewerId = id;
  state.viewerWorks = collection;
  viewerImage.src = `artworks/${work.slug}-1600.webp`;
  viewerImage.alt = `${work.titleZh}，${work.artist}，${work.displayDate}`;
  viewerFull.href = `artworks/${work.slug}-${work.detailWidth ?? 3200}.webp`;
  document.querySelector("[data-archive-viewer-counter]").textContent =
    `${String(index + 1).padStart(2, "0")} / ${String(collection.length).padStart(2, "0")}`;
  document.querySelector("[data-archive-viewer-source]").href = work.sourcePage;
  document.querySelector("[data-archive-viewer-label]").textContent =
    `${work.medium} · ${work.origin}`;
  document.querySelector("[data-archive-viewer-title]").textContent = work.titleZh;
  document.querySelector("[data-archive-viewer-original]").textContent = work.titleEn;
  document.querySelector("[data-archive-viewer-byline]").textContent =
    `${work.artist} / ${work.artistEn} · ${work.displayDate}`;
  document.querySelector("[data-archive-viewer-description]").textContent =
    work.description;
  document.querySelector("[data-archive-viewer-date]").textContent = work.displayDate;
  document.querySelector("[data-archive-viewer-medium]").textContent =
    work.mediumDetail;
  document.querySelector("[data-archive-viewer-collection]").textContent =
    work.collection;
  document.querySelector("[data-archive-viewer-license]").textContent = work.license;
  setViewerUrl(work.id);

  if (!wasOpen) viewer.showModal();
  document.body.classList.add("is-locked");
}

function closeViewer() {
  if (!viewer.open) return;
  viewer.close();
  document.body.classList.remove("is-locked");
  state.lastFocusedElement?.focus();
}

function moveViewer(direction) {
  const index = state.viewerWorks.findIndex((work) => work.id === state.viewerId);
  if (index < 0) return;
  const nextIndex =
    (index + direction + state.viewerWorks.length) %
    state.viewerWorks.length;
  openViewer(state.viewerWorks[nextIndex].id);
}

function changePage(nextPage) {
  const totalPages = Math.max(
    1,
    Math.ceil(state.filteredWorks.length / state.perPage)
  );
  const page = Math.min(Math.max(Number(nextPage), 1), totalPages);
  if (page === state.page) return;
  state.page = page;
  applyFilters();
  document
    .querySelector(".archive-catalog__heading")
    .scrollIntoView({ behavior: "smooth", block: "start" });
}

let searchTimer;
searchInput.addEventListener("input", () => {
  window.clearTimeout(searchTimer);
  searchTimer = window.setTimeout(() => {
    state.query = searchInput.value;
    state.page = 1;
    applyFilters();
  }, 180);
});

sortSelect.addEventListener("change", () => {
  state.sort = sortSelect.value;
  state.page = 1;
  applyFilters();
});

document.addEventListener("click", (event) => {
  const card = event.target.closest("[data-archive-work]");
  if (card) openViewer(card.dataset.archiveWork);

  const pageButton = event.target.closest("[data-page]");
  if (pageButton && !pageButton.disabled) changePage(pageButton.dataset.page);

  if (event.target.closest("[data-clear-archive-search]")) {
    searchInput.value = "";
    state.query = "";
    state.page = 1;
    applyFilters();
    searchInput.focus();
  }

  if (event.target.closest("[data-archive-viewer-close]")) closeViewer();
  if (event.target.closest("[data-archive-viewer-prev]")) moveViewer(-1);
  if (event.target.closest("[data-archive-viewer-next]")) moveViewer(1);
});

viewer.addEventListener("close", () => {
  document.body.classList.remove("is-locked");
  clearViewerUrl();
});

viewer.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") moveViewer(-1);
  if (event.key === "ArrowRight") moveViewer(1);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && viewer.open) closeViewer();
});

loadCatalog().catch((error) => {
  console.error(error);
  status.innerHTML = "<p>作品目录加载失败，请刷新页面重试。</p>";
  summary.textContent = "加载失败";
});
