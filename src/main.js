import "./styles.css";
import {
  createIcons,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Expand,
  Github,
  Image,
  Info,
  Maximize2,
  Minimize2,
  Minus,
  Plus,
  RotateCcw,
  Search,
  X
} from "lucide";
import { featuredArtwork, worksByYear } from "./data/artworks.js";

const app = document.querySelector("#app");

app.innerHTML = `
  <div class="site-shell">
    <header class="site-header" data-header>
      <a class="brand" href="#top" aria-label="光迹美术馆首页">
        <span class="brand__mark">L/A</span>
        <span class="brand__text">
          <strong>光迹美术馆</strong>
          <small>Lumen Archive</small>
        </span>
      </a>
      <nav class="site-nav" aria-label="主导航">
        <a href="#collection">展墙</a>
        <a href="#timeline">时间轴</a>
        <a href="archive.html">完整目录</a>
        <a href="#about">关于</a>
      </nav>
      <div class="header-tools">
        <label class="search-field">
          <span class="sr-only">搜索作品</span>
          <i data-lucide="search" aria-hidden="true"></i>
          <input
            id="global-search"
            type="search"
            placeholder="搜索作品 / 艺术家"
            autocomplete="off"
            data-search
          />
          <kbd>/</kbd>
        </label>
        <a
          class="icon-button github-link"
          href="https://github.com/Lissa7zz/lumen-archive"
          target="_blank"
          rel="noreferrer"
          aria-label="在 GitHub 查看源码"
          title="GitHub 源码"
        >
          <i data-lucide="github" aria-hidden="true"></i>
        </a>
      </div>
    </header>

    <main id="top">
      <section class="hero" aria-labelledby="hero-title">
        <div class="hero__media">
          <img
            src="artworks/night-watch-1600.webp"
            srcset="artworks/night-watch-1600.webp 1600w, artworks/night-watch-3200.webp 3200w"
            sizes="100vw"
            alt="伦勃朗《夜巡》局部"
            fetchpriority="high"
            data-hero-image
          />
          <div class="hero__wash"></div>
        </div>
        <div class="hero__kicker">
          <span>Vol. 01</span>
          <span>1434 — 1984</span>
        </div>
        <div class="hero__content">
          <p class="eyebrow">人类的凝视，被时间保存</p>
          <h1 id="hero-title">
            <span>光迹</span>
            <span>美术馆</span>
          </h1>
          <p class="hero__intro">
            从尼德兰的镜面，到月球轨道上的蓝色地球。十二件作品，一条跨越五百五十年的视觉时间线。
          </p>
          <a class="text-link hero__cta" href="#collection">
            进入展厅
            <i data-lucide="arrow-down" aria-hidden="true"></i>
          </a>
        </div>
        <button class="hero__feature" type="button" data-open-work="${featuredArtwork.id}">
          <span>本期焦点</span>
          <strong>${featuredArtwork.titleZh}</strong>
          <small>${featuredArtwork.artist} · ${featuredArtwork.displayDate}</small>
          <i data-lucide="arrow-right" aria-hidden="true"></i>
        </button>
        <div class="hero__index" aria-hidden="true">
          <span>01</span>
          <div></div>
          <span>12</span>
        </div>
      </section>

      <section class="collection" id="collection" aria-labelledby="collection-title">
        <div class="section-heading reveal">
          <div>
            <p class="eyebrow">Collection / 典藏</p>
            <h2 id="collection-title">本期十二次凝视</h2>
          </div>
          <div class="section-heading__aside">
            <p class="section-heading__intro">
              绘画把想象凝固，摄影把现实留下。本期精选 12 件，完整档案已扩充至 55 件。
            </p>
            <a class="archive-entry" href="archive.html">
              <span>查看完整典藏</span>
              <strong>55 件作品</strong>
              <i data-lucide="arrow-right" aria-hidden="true"></i>
            </a>
          </div>
        </div>

        <div class="collection-toolbar reveal">
          <div class="filters" role="group" aria-label="按媒介筛选">
            <button class="filter is-active" type="button" data-filter="all" aria-pressed="true">
              全部 <span>12</span>
            </button>
            <button class="filter" type="button" data-filter="绘画与版画" aria-pressed="false">
              绘画与版画 <span>08</span>
            </button>
            <button class="filter" type="button" data-filter="摄影" aria-pressed="false">
              摄影 <span>04</span>
            </button>
          </div>
          <p class="result-count" aria-live="polite" data-result-count>12 件作品</p>
        </div>

        <div class="gallery" data-gallery></div>
        <div class="empty-state" data-empty-state hidden>
          <i data-lucide="image" aria-hidden="true"></i>
          <p>没有找到匹配的作品</p>
          <button type="button" class="text-link" data-clear-search>清除搜索</button>
        </div>
      </section>

      <section class="timeline-section" id="timeline" aria-labelledby="timeline-title">
        <div class="timeline-heading reveal">
          <div>
            <p class="eyebrow">Chronology / 时间轴</p>
            <h2 id="timeline-title">五百年，一束光</h2>
          </div>
          <div class="timeline-controls">
            <button class="icon-button" type="button" data-timeline-prev aria-label="向前浏览时间轴">
              <i data-lucide="arrow-left" aria-hidden="true"></i>
            </button>
            <button class="icon-button" type="button" data-timeline-next aria-label="向后浏览时间轴">
              <i data-lucide="arrow-right" aria-hidden="true"></i>
            </button>
          </div>
        </div>
        <div class="timeline-track reveal" data-timeline></div>
      </section>

      <section class="about" id="about" aria-labelledby="about-title">
        <div class="about__lead reveal">
          <p class="eyebrow">About / 关于</p>
          <h2 id="about-title">一个持续生长的<br />开放艺术档案</h2>
        </div>
        <div class="about__copy reveal">
          <p>
            光迹美术馆是一个开源的非商业艺术索引。首版选取人类观看史中的十二个坐标，把高清图像、作品信息、创作背景与授权来源放在同一个页面里。
          </p>
          <p>
            图像均来自 Wikimedia Commons、美国国会图书馆或 NASA 等公共档案，并尽量使用高分辨率版本。代码以 MIT 许可开放，作品图像遵循各自的公共领域或 Creative Commons 许可。
          </p>
          <a
            class="text-link"
            href="https://github.com/Lissa7zz/lumen-archive"
            target="_blank"
            rel="noreferrer"
          >
            查看开源项目
            <i data-lucide="arrow-right" aria-hidden="true"></i>
          </a>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <div class="footer-brand">
        <span>LUMEN ARCHIVE</span>
        <p>让经典回到可被凝视的日常。</p>
      </div>
      <div class="footer-meta">
        <span>© 2026 Lumen Archive contributors</span>
        <span>Code: MIT</span>
        <span>Images: Public Domain / CC</span>
      </div>
      <a class="icon-button" href="#top" aria-label="返回顶部" title="返回顶部">
        <i data-lucide="arrow-down" class="rotate-180" aria-hidden="true"></i>
      </a>
    </footer>
  </div>

  <dialog class="viewer" data-viewer aria-labelledby="viewer-title">
    <header class="viewer__topbar">
      <div class="viewer__identity">
        <span class="viewer__counter" data-viewer-counter></span>
        <span class="viewer__identity-line" aria-hidden="true"></span>
        <span class="viewer__current" data-viewer-current></span>
      </div>
      <div class="viewer__topbar-actions">
        <a class="viewer__source" data-viewer-source target="_blank" rel="noreferrer">
          原始档案
          <i data-lucide="arrow-right" aria-hidden="true"></i>
        </a>
        <button
          class="viewer__info-button"
          type="button"
          data-viewer-info-toggle
          aria-controls="viewer-info"
          aria-expanded="false"
        >
          <i data-lucide="info" aria-hidden="true"></i>
          作品信息
        </button>
        <button class="icon-button" type="button" data-viewer-fullscreen aria-label="进入全屏" title="进入全屏">
          <i data-lucide="maximize-2" data-fullscreen-enter aria-hidden="true"></i>
          <i data-lucide="minimize-2" data-fullscreen-exit aria-hidden="true" hidden></i>
        </button>
        <button class="icon-button" type="button" data-viewer-close aria-label="关闭作品查看器" title="关闭">
          <i data-lucide="x" aria-hidden="true"></i>
        </button>
      </div>
    </header>

    <div class="viewer__body">
      <section class="viewer__stage" data-viewer-stage tabindex="0" aria-label="作品图像查看区">
        <div class="viewer__zoom-tools" role="group" aria-label="缩放控制">
          <button type="button" data-viewer-zoom-out aria-label="缩小" title="缩小">
            <i data-lucide="minus" aria-hidden="true"></i>
          </button>
          <button
            class="viewer__zoom-readout"
            type="button"
            data-viewer-fit
            aria-label="适应屏幕"
            title="适应屏幕"
          >
            <span data-viewer-zoom-value>100%</span>
          </button>
          <button type="button" data-viewer-zoom-in aria-label="放大" title="放大">
            <i data-lucide="plus" aria-hidden="true"></i>
          </button>
        </div>

        <button class="viewer__nav viewer__nav--prev" type="button" data-viewer-prev aria-label="上一件作品" title="上一件作品">
          <i data-lucide="arrow-left" aria-hidden="true"></i>
        </button>

        <div class="viewer__canvas" data-viewer-canvas>
          <img class="viewer__preview" data-viewer-preview alt="" aria-hidden="true" />
          <img class="viewer__full" data-viewer-image alt="" draggable="false" />
          <span class="viewer__loader" aria-hidden="true"><span></span></span>
        </div>

        <button class="viewer__nav viewer__nav--next" type="button" data-viewer-next aria-label="下一件作品" title="下一件作品">
          <i data-lucide="arrow-right" aria-hidden="true"></i>
        </button>

        <div class="viewer__stage-footer">
          <span class="viewer__scale-status" data-viewer-zoom-status aria-live="polite"></span>
          <button type="button" data-viewer-reset aria-label="恢复适应屏幕" title="恢复适应屏幕">
            <i data-lucide="rotate-ccw" aria-hidden="true"></i>
          </button>
        </div>
      </section>

      <aside class="viewer__info" id="viewer-info" data-viewer-info>
        <button class="viewer__info-close" type="button" data-viewer-info-close aria-label="收起作品信息">
          <i data-lucide="x" aria-hidden="true"></i>
        </button>
        <p class="eyebrow" data-viewer-label></p>
        <h2 id="viewer-title" data-viewer-title></h2>
        <p class="viewer__original-title" data-viewer-original-title></p>
        <p class="viewer__byline" data-viewer-byline></p>
        <p class="viewer__description" data-viewer-description></p>
        <blockquote data-viewer-note></blockquote>
        <dl class="artwork-facts">
          <div><dt>年代</dt><dd data-viewer-date></dd></div>
          <div><dt>媒介</dt><dd data-viewer-medium></dd></div>
          <div><dt>尺寸</dt><dd data-viewer-size></dd></div>
          <div><dt>收藏</dt><dd data-viewer-collection></dd></div>
        </dl>
        <div class="license-block">
          <span>图像许可</span>
          <a data-viewer-license target="_blank" rel="noreferrer"></a>
          <p data-viewer-attribution></p>
        </div>
      </aside>
    </div>
  </dialog>

  <div class="search-backdrop" data-search-backdrop hidden>
    <div class="search-panel">
      <label class="search-panel__field">
        <i data-lucide="search" aria-hidden="true"></i>
        <input
          type="search"
          placeholder="搜索作品、艺术家或年份"
          autocomplete="off"
          data-search-panel-input
        />
        <button class="icon-button" type="button" data-search-close aria-label="关闭搜索">
          <i data-lucide="x" aria-hidden="true"></i>
        </button>
      </label>
      <div class="search-results" data-search-results></div>
    </div>
  </div>
`;

const iconSet = {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Expand,
  Github,
  Image,
  Info,
  Maximize2,
  Minimize2,
  Minus,
  Plus,
  RotateCcw,
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

const gallery = document.querySelector("[data-gallery]");
const timeline = document.querySelector("[data-timeline]");
const viewer = document.querySelector("[data-viewer]");
const viewerImage = document.querySelector("[data-viewer-image]");
const viewerPreview = document.querySelector("[data-viewer-preview]");
const viewerStage = document.querySelector(".viewer__stage");
const viewerCanvas = document.querySelector("[data-viewer-canvas]");
const viewerInfo = document.querySelector("[data-viewer-info]");
const viewerInfoToggle = document.querySelector("[data-viewer-info-toggle]");
const viewerZoomValue = document.querySelector("[data-viewer-zoom-value]");
const viewerZoomStatus = document.querySelector("[data-viewer-zoom-status]");
const viewerFullscreenButton = document.querySelector("[data-viewer-fullscreen]");
const globalSearch = document.querySelector("[data-search]");
const searchBackdrop = document.querySelector("[data-search-backdrop]");
const searchPanelInput = document.querySelector("[data-search-panel-input]");
const searchResults = document.querySelector("[data-search-results]");
const resultCount = document.querySelector("[data-result-count]");
const emptyState = document.querySelector("[data-empty-state]");
const header = document.querySelector("[data-header]");

const state = {
  filter: "all",
  query: "",
  visibleWorks: [...worksByYear],
  selectedId: worksByYear[0].id,
  lastFocusedElement: null
};

const viewerState = {
  zoom: 1,
  panX: 0,
  panY: 0,
  minZoom: 1,
  maxZoom: 4,
  pointers: new Map(),
  gesture: null,
  currentSlug: "",
  loadToken: 0,
  preloads: []
};

function matchesSearch(work, query) {
  const normalizedQuery = query.trim().toLocaleLowerCase("zh-CN");
  if (!normalizedQuery) return true;

  const searchContent = [
    work.titleZh,
    work.titleEn,
    work.artist,
    work.artistEn,
    work.year,
    work.medium,
    work.origin
  ]
    .join(" ")
    .toLocaleLowerCase("zh-CN");

  return normalizedQuery
    .split(/\s+/)
    .every((token) => searchContent.includes(token));
}

function getVisibleWorks() {
  return worksByYear.filter((work) => {
    const matchesFilter =
      state.filter === "all" || work.medium === state.filter;
    return matchesFilter && matchesSearch(work, state.query);
  });
}

function artworkCard(work, index) {
  return `
    <article class="artwork-card artwork-card--${work.layout}" data-artwork-grid-item>
      <button class="artwork-card__button" type="button" data-open-work="${work.id}">
        <span class="artwork-card__image-wrap">
          <img
            src="artworks/${work.slug}-480.webp"
            srcset="artworks/${work.slug}-480.webp 480w, artworks/${work.slug}-1600.webp 1600w, artworks/${work.slug}-3200.webp 3200w"
            sizes="(max-width: 720px) 92vw, (max-width: 1100px) 46vw, 38vw"
            alt="${work.titleZh}，${work.artist}，${work.displayDate}"
            loading="${index < 2 ? "eager" : "lazy"}"
          />
          <span class="artwork-card__veil"></span>
          <span class="artwork-card__action">
            <i data-lucide="expand" aria-hidden="true"></i>
            查看细节
          </span>
        </span>
        <span class="artwork-card__caption">
          <span class="artwork-card__index">${String(index + 1).padStart(2, "0")}</span>
          <span class="artwork-card__titles">
            <strong>${work.titleZh}</strong>
            <small>${work.titleEn}</small>
          </span>
          <span class="artwork-card__meta">
            <span>${work.artist}</span>
            <span>${work.displayDate}</span>
          </span>
        </span>
      </button>
    </article>
  `;
}

function renderGallery() {
  state.visibleWorks = getVisibleWorks();
  gallery.innerHTML = state.visibleWorks.map(artworkCard).join("");
  resultCount.textContent = `${state.visibleWorks.length} 件作品`;
  emptyState.hidden = state.visibleWorks.length > 0;
  gallery.hidden = state.visibleWorks.length === 0;
  refreshIcons();
}

function renderTimeline() {
  timeline.innerHTML = worksByYear
    .map(
      (work, index) => `
        <button class="timeline-event" type="button" data-open-work="${work.id}">
          <span class="timeline-event__year">${work.year}</span>
          <span class="timeline-event__dot"><span></span></span>
          <span class="timeline-event__card">
            <img src="artworks/${work.slug}-480.webp" alt="" loading="lazy" />
            <span class="timeline-event__content">
              <span class="timeline-event__number">${String(index + 1).padStart(2, "0")} / ${work.medium}</span>
              <strong>${work.titleZh}</strong>
              <small>${work.artist}</small>
            </span>
          </span>
        </button>
      `
    )
    .join("");
}

function setFilter(filter) {
  state.filter = filter;
  document.querySelectorAll("[data-filter]").forEach((button) => {
    const active = button.dataset.filter === filter;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  renderGallery();
}

function searchWorks(query) {
  state.query = query;
  if (query.trim() && state.filter !== "all") {
    state.filter = "all";
    document.querySelectorAll("[data-filter]").forEach((button) => {
      const active = button.dataset.filter === "all";
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }
  renderGallery();
  updateSearchResults(query);
}

function findWorkIndex(id) {
  const visibleIndex = state.visibleWorks.findIndex((work) => work.id === id);
  if (visibleIndex !== -1) return { collection: state.visibleWorks, index: visibleIndex };
  return {
    collection: worksByYear,
    index: worksByYear.findIndex((work) => work.id === id)
  };
}

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum);
}

function viewerPanBounds(zoom = viewerState.zoom) {
  const canvasWidth = viewerCanvas.clientWidth || 1;
  const canvasHeight = viewerCanvas.clientHeight || 1;
  const imageWidth = viewerImage.offsetWidth || canvasWidth;
  const imageHeight = viewerImage.offsetHeight || canvasHeight;

  return {
    x: Math.max(0, (imageWidth * zoom - canvasWidth) / 2),
    y: Math.max(0, (imageHeight * zoom - canvasHeight) / 2)
  };
}

function clampViewerPan() {
  const bounds = viewerPanBounds();
  viewerState.panX = clamp(viewerState.panX, -bounds.x, bounds.x);
  viewerState.panY = clamp(viewerState.panY, -bounds.y, bounds.y);
}

function updateViewerZoomReadout() {
  const percentage = Math.round(viewerState.zoom * 100);
  viewerZoomValue.textContent = `${percentage}%`;
  viewerZoomStatus.textContent =
    viewerState.zoom <= 1.01
      ? "100% · 适应屏幕"
      : `已放大至 ${percentage}%`;
  viewerCanvas.classList.toggle("is-zoomed", viewerState.zoom > 1.01);
}

function applyViewerTransform(animate = false) {
  clampViewerPan();
  viewerImage.classList.toggle("is-animating", animate);
  viewerImage.style.transform =
    `translate3d(${viewerState.panX}px, ${viewerState.panY}px, 0) ` +
    `scale(${viewerState.zoom})`;
  updateViewerZoomReadout();

  if (animate) {
    window.setTimeout(() => viewerImage.classList.remove("is-animating"), 220);
  }
}

function setViewerZoom(nextZoom, focalPoint = null, animate = true) {
  const targetZoom = clamp(nextZoom, viewerState.minZoom, viewerState.maxZoom);
  const previousZoom = viewerState.zoom;
  const rect = viewerCanvas.getBoundingClientRect();
  const focalX =
    (focalPoint?.clientX ?? rect.left + rect.width / 2) -
    (rect.left + rect.width / 2);
  const focalY =
    (focalPoint?.clientY ?? rect.top + rect.height / 2) -
    (rect.top + rect.height / 2);
  const ratio = targetZoom / previousZoom;

  viewerState.panX = viewerState.panX * ratio + focalX * (1 - ratio);
  viewerState.panY = viewerState.panY * ratio + focalY * (1 - ratio);
  viewerState.zoom = targetZoom;
  applyViewerTransform(animate);
}

function resetViewerZoom(animate = true) {
  viewerState.zoom = 1;
  viewerState.panX = 0;
  viewerState.panY = 0;
  applyViewerTransform(animate);
}

function panViewerBy(deltaX, deltaY) {
  if (viewerState.zoom <= 1.01) return;
  viewerState.panX += deltaX;
  viewerState.panY += deltaY;
  applyViewerTransform(true);
}

function setViewerInfoOpen(open, focusControl = false) {
  const compact = window.matchMedia("(max-width: 760px)").matches;
  const shouldOpen = compact && open;

  viewerInfo.classList.toggle("is-open", shouldOpen);
  viewerInfoToggle.setAttribute("aria-expanded", String(shouldOpen));
  viewerInfo.toggleAttribute("inert", compact && !shouldOpen);
  if (compact) viewerInfo.setAttribute("aria-hidden", String(!shouldOpen));
  else viewerInfo.removeAttribute("aria-hidden");

  if (focusControl && compact) {
    requestAnimationFrame(() => {
      const target = shouldOpen
        ? document.querySelector("[data-viewer-info-close]")
        : viewerInfoToggle;
      target?.focus({ preventScroll: true });
    });
  }
}

function syncFullscreenControl() {
  const isFullscreen = document.fullscreenElement === viewer;
  viewerFullscreenButton.setAttribute(
    "aria-label",
    isFullscreen ? "退出全屏" : "进入全屏"
  );
  viewerFullscreenButton.title = isFullscreen ? "退出全屏" : "进入全屏";
  document.querySelector("[data-fullscreen-enter]")?.toggleAttribute("hidden", isFullscreen);
  document.querySelector("[data-fullscreen-exit]")?.toggleAttribute("hidden", !isFullscreen);
}

async function toggleViewerFullscreen() {
  try {
    if (document.fullscreenElement === viewer) {
      await document.exitFullscreen?.();
    } else {
      await viewer.requestFullscreen?.();
    }
  } catch {
    viewerZoomStatus.textContent = "当前浏览器无法进入全屏";
  }
  syncFullscreenControl();
}

function preloadAdjacentWorks(work) {
  viewerState.preloads = [];
  const target = findWorkIndex(work.id);
  const adjacentIndexes = [
    (target.index - 1 + target.collection.length) % target.collection.length,
    (target.index + 1) % target.collection.length
  ];

  viewerState.preloads = adjacentIndexes.map((index) => {
    const image = new window.Image();
    image.src = `artworks/${target.collection[index].slug}-3200.webp`;
    return image;
  });
}

function loadViewerArtwork(work) {
  const token = ++viewerState.loadToken;
  const alt = `${work.titleZh}，${work.artist}，${work.displayDate}`;

  viewerState.currentSlug = work.slug;
  viewerStage.classList.remove("is-loaded");
  viewerPreview.src = `artworks/${work.slug}-1600.webp`;
  viewerPreview.alt = "";
  viewerImage.alt = alt;
  viewerImage.onload = () => {
    if (token !== viewerState.loadToken) return;
    viewerStage.classList.add("is-loaded");
    requestAnimationFrame(() => resetViewerZoom(false));
  };
  viewerImage.onerror = () => {
    if (token === viewerState.loadToken) {
      viewerZoomStatus.textContent = "图像加载失败";
    }
  };
  viewerImage.src = `artworks/${work.slug}-3200.webp`;

  if (viewerImage.complete && viewerImage.naturalWidth > 0) {
    viewerStage.classList.add("is-loaded");
  }

  resetViewerZoom(false);
  preloadAdjacentWorks(work);
}

function openViewer(id) {
  const target = findWorkIndex(id);
  if (target.index < 0) return;

  state.selectedId = id;
  const work = target.collection[target.index];
  const wasOpen = viewer.open;

  if (!wasOpen) state.lastFocusedElement = document.activeElement;

  document.querySelector("[data-viewer-counter]").textContent =
    `${String(target.index + 1).padStart(2, "0")} / ${String(target.collection.length).padStart(2, "0")}`;
  document.querySelector("[data-viewer-current]").textContent = work.titleZh;
  document.querySelector("[data-viewer-label]").textContent =
    `${work.medium} · ${work.origin}`;
  document.querySelector("[data-viewer-title]").textContent = work.titleZh;
  document.querySelector("[data-viewer-original-title]").textContent = work.titleEn;
  document.querySelector("[data-viewer-byline]").textContent =
    `${work.artist} / ${work.artistEn} · ${work.displayDate}`;
  document.querySelector("[data-viewer-description]").textContent = work.description;
  document.querySelector("[data-viewer-note]").textContent = work.note;
  document.querySelector("[data-viewer-date]").textContent = work.displayDate;
  document.querySelector("[data-viewer-medium]").textContent = work.mediumDetail;
  document.querySelector("[data-viewer-size]").textContent = work.dimensions;
  document.querySelector("[data-viewer-collection]").textContent = work.collection;
  document.querySelector("[data-viewer-source]").href = work.sourcePage;
  document.querySelector("[data-viewer-license]").href = work.licenseUrl;
  document.querySelector("[data-viewer-license]").textContent = work.license;
  document.querySelector("[data-viewer-attribution]").textContent = work.attribution;
  loadViewerArtwork(work);
  setViewerInfoOpen(false);

  if (!wasOpen) {
    viewer.showModal();
    requestAnimationFrame(() => viewerStage.focus({ preventScroll: true }));
  }
  document.body.classList.add("is-locked");
}

function closeViewer() {
  if (!viewer.open) return;
  viewer.close();
  document.body.classList.remove("is-locked");
  setViewerInfoOpen(false);
  resetViewerZoom(false);
  state.lastFocusedElement?.focus();
}

function moveViewer(direction) {
  const target = findWorkIndex(state.selectedId);
  const nextIndex =
    (target.index + direction + target.collection.length) % target.collection.length;
  openViewer(target.collection[nextIndex].id);
}

function pointerDistance(first, second) {
  return Math.hypot(second.x - first.x, second.y - first.y);
}

function startViewerPinch() {
  const points = [...viewerState.pointers.values()];
  if (points.length < 2) return;
  viewerState.gesture = {
    type: "pinch",
    lastDistance: Math.max(1, pointerDistance(points[0], points[1]))
  };
  viewerStage.classList.add("is-interacting");
}

function handleViewerPointerDown(event) {
  if (event.pointerType === "mouse" && event.button !== 0) return;
  viewerCanvas.setPointerCapture?.(event.pointerId);
  viewerState.pointers.set(event.pointerId, {
    x: event.clientX,
    y: event.clientY,
    pointerType: event.pointerType
  });

  if (viewerState.pointers.size === 1) {
    viewerState.gesture = {
      type: "pan",
      startX: event.clientX,
      startY: event.clientY,
      originPanX: viewerState.panX,
      originPanY: viewerState.panY,
      deltaX: 0,
      deltaY: 0,
      moved: false,
      touch: event.pointerType !== "mouse"
    };
    viewerStage.classList.add("is-interacting");
  } else if (viewerState.pointers.size === 2) {
    startViewerPinch();
  }
}

function handleViewerPointerMove(event) {
  const pointer = viewerState.pointers.get(event.pointerId);
  if (!pointer) return;

  pointer.x = event.clientX;
  pointer.y = event.clientY;
  const points = [...viewerState.pointers.values()];

  if (points.length >= 2 && viewerState.gesture?.type === "pinch") {
    const distance = Math.max(1, pointerDistance(points[0], points[1]));
    const midpoint = {
      clientX: (points[0].x + points[1].x) / 2,
      clientY: (points[0].y + points[1].y) / 2
    };
    setViewerZoom(
      viewerState.zoom * (distance / viewerState.gesture.lastDistance),
      midpoint,
      false
    );
    viewerState.gesture.lastDistance = distance;
    viewerState.gesture.moved = true;
    return;
  }

  if (points.length === 1 && viewerState.gesture?.type === "pan") {
    const deltaX = event.clientX - viewerState.gesture.startX;
    const deltaY = event.clientY - viewerState.gesture.startY;
    viewerState.gesture.deltaX = deltaX;
    viewerState.gesture.deltaY = deltaY;
    viewerState.gesture.moved ||= Math.hypot(deltaX, deltaY) > 4;

    if (viewerState.zoom > 1.01) {
      viewerState.panX = viewerState.gesture.originPanX + deltaX;
      viewerState.panY = viewerState.gesture.originPanY + deltaY;
      applyViewerTransform(false);
    }
  }
}

function finishViewerPointer(event, allowSwipe) {
  const gesture = viewerState.gesture;
  const pointer = viewerState.pointers.get(event.pointerId);

  if (
    allowSwipe &&
    gesture?.type === "pan" &&
    gesture.touch &&
    viewerState.zoom <= 1.01 &&
    Math.abs(gesture.deltaX) > 72 &&
    Math.abs(gesture.deltaY) < 56
  ) {
    moveViewer(gesture.deltaX < 0 ? 1 : -1);
  }

  viewerCanvas.releasePointerCapture?.(event.pointerId);
  viewerState.pointers.delete(event.pointerId);

  if (viewerState.pointers.size === 1) {
    const [remaining] = viewerState.pointers.values();
    viewerState.gesture = {
      type: "pan",
      startX: remaining.x,
      startY: remaining.y,
      originPanX: viewerState.panX,
      originPanY: viewerState.panY,
      deltaX: 0,
      deltaY: 0,
      moved: false,
      touch: remaining.pointerType !== "mouse"
    };
  } else if (viewerState.pointers.size === 0) {
    viewerState.gesture = null;
    viewerStage.classList.remove("is-interacting");
  }

  if (pointer?.pointerType === "touch" && viewerState.zoom > 1.01) {
    viewerZoomStatus.textContent =
      `已放大至 ${Math.round(viewerState.zoom * 100)}%`;
  }
}

function handleViewerWheel(event) {
  event.preventDefault();
  const scaleFactor = Math.exp(-event.deltaY * 0.0014);
  setViewerZoom(
    viewerState.zoom * scaleFactor,
    { clientX: event.clientX, clientY: event.clientY },
    false
  );
}

function handleViewerDoubleClick(event) {
  if (viewerState.zoom > 1.01) {
    resetViewerZoom();
  } else {
    setViewerZoom(2.25, { clientX: event.clientX, clientY: event.clientY });
  }
}

function updateSearchResults(query) {
  const matches = worksByYear.filter((work) => matchesSearch(work, query)).slice(0, 6);
  if (!matches.length) {
    searchResults.innerHTML = `
      <p class="search-results__empty">本期精选没有匹配条目</p>
      <a
        class="search-results__archive"
        href="archive.html${query ? `?q=${encodeURIComponent(query)}` : ""}"
      >
        <span>在完整典藏中搜索</span>
        <i data-lucide="arrow-right" aria-hidden="true"></i>
      </a>
    `;
    refreshIcons();
    return;
  }

  const label = query ? "匹配作品" : "最近新增";
  searchResults.innerHTML = `
    <p class="search-results__label">${label}</p>
    ${matches
      .map(
        (work) => `
          <button type="button" class="search-result" data-open-work="${work.id}">
            <img src="artworks/${work.slug}-480.webp" alt="" />
            <span>
              <strong>${work.titleZh}</strong>
              <small>${work.artist} · ${work.displayDate}</small>
            </span>
            <i data-lucide="arrow-right" aria-hidden="true"></i>
          </button>
        `
      )
      .join("")}
    <a
      class="search-results__archive"
      href="archive.html${query ? `?q=${encodeURIComponent(query)}` : ""}"
    >
      <span>${query ? `在完整典藏中搜索“${query}”` : "浏览完整典藏 · 55 件作品"}</span>
      <i data-lucide="arrow-right" aria-hidden="true"></i>
    </a>
  `;
  refreshIcons();
}

function openSearch() {
  searchBackdrop.hidden = false;
  document.body.classList.add("is-locked");
  requestAnimationFrame(() => searchPanelInput.focus());
  updateSearchResults(searchPanelInput.value);
}

function closeSearch() {
  searchBackdrop.hidden = true;
  document.body.classList.remove("is-locked");
  globalSearch.focus();
}

document.addEventListener("click", (event) => {
  const openButton = event.target.closest("[data-open-work]");
  if (openButton) {
    if (!searchBackdrop.hidden) closeSearch();
    openViewer(openButton.dataset.openWork);
    return;
  }

  const filterButton = event.target.closest("[data-filter]");
  if (filterButton) setFilter(filterButton.dataset.filter);

  if (event.target.closest("[data-clear-search]")) {
    globalSearch.value = "";
    searchWorks("");
  }

  if (event.target.closest("[data-viewer-close]")) closeViewer();
  if (event.target.closest("[data-viewer-prev]")) moveViewer(-1);
  if (event.target.closest("[data-viewer-next]")) moveViewer(1);
  if (event.target.closest("[data-viewer-zoom-in]")) {
    setViewerZoom(viewerState.zoom + 0.25);
  }
  if (event.target.closest("[data-viewer-zoom-out]")) {
    setViewerZoom(viewerState.zoom - 0.25);
  }
  if (event.target.closest("[data-viewer-fit], [data-viewer-reset]")) {
    resetViewerZoom();
  }
  if (event.target.closest("[data-viewer-info-toggle]")) {
    setViewerInfoOpen(!viewerInfo.classList.contains("is-open"), true);
  }
  if (event.target.closest("[data-viewer-info-close]")) {
    setViewerInfoOpen(false, true);
  }
  if (event.target.closest("[data-viewer-fullscreen]")) toggleViewerFullscreen();

  if (event.target === viewer) closeViewer();
});

globalSearch.addEventListener("input", () => searchWorks(globalSearch.value));
globalSearch.addEventListener("click", openSearch);
globalSearch.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    if (globalSearch.value.trim()) {
      window.location.href =
        `archive.html?q=${encodeURIComponent(globalSearch.value.trim())}`;
      return;
    }
    document.querySelector("#collection").scrollIntoView({ behavior: "smooth" });
    closeSearch();
  }
});

searchPanelInput.addEventListener("input", () => {
  globalSearch.value = searchPanelInput.value;
  searchWorks(searchPanelInput.value);
});
searchPanelInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    if (searchPanelInput.value.trim()) {
      window.location.href =
        `archive.html?q=${encodeURIComponent(searchPanelInput.value.trim())}`;
      return;
    }
    closeSearch();
    document.querySelector("#collection").scrollIntoView({ behavior: "smooth" });
  }
});

document.querySelector("[data-search-close]").addEventListener("click", closeSearch);
searchBackdrop.addEventListener("click", (event) => {
  if (event.target === searchBackdrop) closeSearch();
});

viewer.addEventListener("close", () => {
  document.body.classList.remove("is-locked");
  viewerState.pointers.clear();
  viewerState.gesture = null;
  viewerStage.classList.remove("is-interacting");
});

viewer.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" && !event.shiftKey) {
    event.preventDefault();
    moveViewer(-1);
    return;
  }
  if (event.key === "ArrowRight" && !event.shiftKey) {
    event.preventDefault();
    moveViewer(1);
    return;
  }
  if (event.shiftKey && event.key.startsWith("Arrow")) {
    event.preventDefault();
    const step = 90;
    if (event.key === "ArrowLeft") panViewerBy(step, 0);
    if (event.key === "ArrowRight") panViewerBy(-step, 0);
    if (event.key === "ArrowUp") panViewerBy(0, step);
    if (event.key === "ArrowDown") panViewerBy(0, -step);
    return;
  }
  if (event.key === "+" || event.key === "=") {
    event.preventDefault();
    setViewerZoom(viewerState.zoom + 0.25);
  }
  if (event.key === "-" || event.key === "_") {
    event.preventDefault();
    setViewerZoom(viewerState.zoom - 0.25);
  }
  if (event.key === "0") {
    event.preventDefault();
    resetViewerZoom();
  }
  if (event.key.toLowerCase() === "f") toggleViewerFullscreen();
  if (event.key.toLowerCase() === "i") {
    setViewerInfoOpen(!viewerInfo.classList.contains("is-open"), true);
  }
});

viewerCanvas.addEventListener("pointerdown", handleViewerPointerDown);
viewerCanvas.addEventListener("pointermove", handleViewerPointerMove);
viewerCanvas.addEventListener("pointerup", (event) => finishViewerPointer(event, true));
viewerCanvas.addEventListener("pointercancel", (event) => finishViewerPointer(event, false));
viewerCanvas.addEventListener("wheel", handleViewerWheel, { passive: false });
viewerCanvas.addEventListener("dblclick", handleViewerDoubleClick);
document.addEventListener("fullscreenchange", syncFullscreenControl);
window.addEventListener("resize", () => setViewerInfoOpen(viewerInfo.classList.contains("is-open")));

document.addEventListener("keydown", (event) => {
  const isTyping = ["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName);

  if (event.key === "/" && !isTyping && !viewer.open) {
    event.preventDefault();
    openSearch();
  }

  if (event.key === "Escape") {
    if (!searchBackdrop.hidden) closeSearch();
    if (viewer.open) closeViewer();
  }
});

let timelineAnimationFrame;
document.querySelector("[data-timeline-prev]").addEventListener("click", () => {
  timeline.scrollBy({
    left: -Math.min(520, timeline.clientWidth * 0.72),
    behavior: "smooth"
  });
});
document.querySelector("[data-timeline-next]").addEventListener("click", () => {
  timeline.scrollBy({
    left: Math.min(520, timeline.clientWidth * 0.72),
    behavior: "smooth"
  });
});

let lastScrollY = window.scrollY;
window.addEventListener(
  "scroll",
  () => {
    const scrollY = window.scrollY;
    header.classList.toggle("is-scrolled", scrollY > 32);

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      cancelAnimationFrame(timelineAnimationFrame);
      timelineAnimationFrame = requestAnimationFrame(() => {
        const heroImage = document.querySelector("[data-hero-image]");
        const heroShift = Math.min(scrollY * 0.08, 80);
        heroImage.style.transform = `scale(1.04) translateY(${heroShift}px)`;
      });
    }
    lastScrollY = scrollY;
  },
  { passive: true }
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

if ("requestIdleCallback" in window) {
  requestIdleCallback(() => {
    document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
  });
} else {
  document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
}

renderGallery();
renderTimeline();
updateSearchResults("");
