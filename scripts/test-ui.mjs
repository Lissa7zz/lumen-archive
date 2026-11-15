import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { Window } from "happy-dom";

const root = path.resolve(import.meta.dirname, "..");
const dist = path.join(root, "dist");
const assets = await readdir(path.join(dist, "assets"));
const nativeFetch = globalThis.fetch;
let importCounter = 0;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function bundlePath(prefix) {
  const file = assets.find(
    (name) =>
      name.startsWith(`${prefix}-`) &&
      name.endsWith(".js") &&
      !name.includes("external-link")
  );
  if (!file) throw new Error(`Unable to find ${prefix} bundle`);
  return path.join(dist, "assets", file);
}

function createPage(url, rootId) {
  const window = new Window({ url });
  const document = window.document;
  document.body.innerHTML = `<div id="${rootId}"></div>`;

  globalThis.window = window;
  globalThis.document = document;
  globalThis.HTMLElement = window.HTMLElement;
  globalThis.Event = window.Event;
  globalThis.MouseEvent = window.MouseEvent;
  globalThis.KeyboardEvent = window.KeyboardEvent;
  globalThis.WheelEvent = window.WheelEvent;
  globalThis.IntersectionObserver = class {
    constructor(callback) {
      this.callback = callback;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  window.IntersectionObserver = globalThis.IntersectionObserver;
  globalThis.requestIdleCallback = (callback) => {
    callback();
    return 1;
  };
  window.requestIdleCallback = globalThis.requestIdleCallback;
  globalThis.cancelAnimationFrame = () => {};
  window.matchMedia = () => ({
    matches: false,
    addEventListener() {},
    removeEventListener() {}
  });
  window.HTMLElement.prototype.scrollIntoView = () => {};
  window.scrollTo = () => {};

  if (window.HTMLDialogElement) {
    window.HTMLDialogElement.prototype.showModal = function showModal() {
      this.open = true;
    };
    window.HTMLDialogElement.prototype.close = function close() {
      this.open = false;
      this.dispatchEvent(new window.Event("close"));
    };
  }

  globalThis.fetch = async (input, options = {}) => {
    const urlValue = String(input);
    if (urlValue.startsWith("data/")) {
      const body = await readFile(path.join(dist, urlValue));
      return new Response(body, {
        status: 200,
        headers: { "content-type": "application/json" }
      });
    }
    return nativeFetch(input, options);
  };

  return { window, document };
}

async function loadBundle(file) {
  importCounter += 1;
  await import(
    `${pathToFileURL(file).href}?ui-test=${importCounter}-${Date.now()}`
  );
}

async function wait(milliseconds) {
  await new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function testHome() {
  const { window, document } = createPage(
    "http://127.0.0.1:4173/",
    "app"
  );
  await loadBundle(bundlePath("main"));
  await wait(100);

  assert(
    document.querySelectorAll("[data-artwork-grid-item]").length === 12,
    "Homepage should render 12 curated works"
  );
  assert(
    document.querySelectorAll(".timeline-era-tile").length === 5,
    "Homepage should render five era entry tiles"
  );
  assert(
    document.querySelector("[data-catalog-total]")?.textContent === "322",
    "Homepage catalogue count should hydrate to 322"
  );
  assert(
    document.querySelectorAll("[data-timeline-prev]").length === 0,
    "Legacy timeline slider should be removed"
  );

  const search = document.querySelector("[data-search]");
  search.focus();
  search.click();
  const backdrop = document.querySelector("[data-search-backdrop]");
  const shell = document.querySelector(".site-shell");
  const input = document.querySelector("[data-search-panel-input]");
  assert(!backdrop.hidden, "Search dialog should open");
  assert(shell.inert, "Background should be inert while searching");
  assert(document.activeElement === input, "Search input should receive focus");
  input.dispatchEvent(
    new window.KeyboardEvent("keydown", { key: "Escape", bubbles: true })
  );
  assert(backdrop.hidden, "Search dialog should close on Escape");
  assert(!shell.inert, "Background inert state should be cleared");
  assert(
    document.activeElement === search,
    "Search should restore focus to its trigger"
  );
}

async function testArchive() {
  const { window, document } = createPage(
    "http://127.0.0.1:4173/archive.html?work=cle-124167",
    "archive-app"
  );
  await loadBundle(bundlePath("archive"));
  await wait(400);

  assert(
    document.querySelector("[data-total-count]")?.textContent === "322",
    "Archive should report 322 works"
  );
  assert(
    document.querySelector("[data-catalog-summary]")?.textContent.includes(
      "第 1 / 27 页"
    ),
    "Archive should expose 27 pages"
  );
  assert(
    Boolean(document.querySelector("[data-archive-viewer-title]")?.textContent),
    "Viewer should open from a work deep link even with no query match"
  );

  document.querySelector("[data-archive-viewer-close]").click();
  const url = new URL(window.location.href);
  assert(!url.searchParams.has("work"), "Closing viewer should clear work query");

  document.querySelector('[data-page="27"]').click();
  await wait(20);
  assert(
    document.querySelectorAll(".archive-card").length === 10,
    "Last archive page should contain 10 works"
  );
}

async function testTimeline() {
  const { window, document } = createPage(
    "http://127.0.0.1:4173/timeline.html",
    "timeline-app"
  );
  await loadBundle(bundlePath("timeline"));
  await wait(300);

  assert(
    document.querySelectorAll("[data-chrono-card]").length === 322,
    "Timeline should render all 322 works"
  );
  assert(
    document.querySelector("[data-year-start]")?.textContent === "1434",
    "Timeline should begin in 1434"
  );
  assert(
    document.querySelector("[data-year-end]")?.textContent === "1997",
    "Timeline should end in 1997"
  );

  document.querySelector('[data-chrono-filter="photo"]').click();
  await wait(20);
  assert(
    document.querySelectorAll("[data-chrono-card]").length === 108,
    "Timeline photo filter should contain 108 works"
  );

  document.querySelector('[data-chrono-filter="painting"]').click();
  await wait(20);
  assert(
    document.querySelectorAll("[data-chrono-card]").length === 214,
    "Timeline painting filter should contain 214 works"
  );

  document.querySelector('[data-era-target="era-modern"]').click();
  assert(window.location.hash === "#era-modern", "Era navigation should update hash");
}

try {
  await testHome();
  await testArchive();
  await testTimeline();
  console.log("UI smoke tests OK: homepage, archive, deep links, and timeline.");
} finally {
  globalThis.fetch = nativeFetch;
}
