import * as pdfjsLib from "pdfjs-dist/build/pdf.mjs";
import workerUrl from "pdfjs-dist/build/pdf.worker.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

const $ = (id) => document.getElementById(id);

const viewer = $("viewer");
const pageLabel = $("pageLabel");
const btnPrev = $("prev");
const btnNext = $("next");
const btnReload = $("reload");
const pageInput = $("pageInput");
const btnGo = $("go");

const reloadLabel = btnReload.querySelector(".reload-label");
const spinner = btnReload.querySelector(".spinner");

let pdf = null;
let pageNo = 1;
let numPages = 1;
let lastStamp = null;
let stableTimer = null;

const STABLE_MS = 700;
const POLL_MS = 5000;
const STAMP_WAIT_TIMEOUT = 10000;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function clampPage(n) {
    return Math.max(1, Math.min(numPages, n));
}

function pdfUrl(version, nonce = false) {
    const v = version ?? lastStamp ?? Date.now();
    const n = nonce ? `&n=${Date.now()}` : "";
    return `/thesis.pdf?v=${encodeURIComponent(v)}${n}`;
}

function ensureWrap() {
    let wrap = viewer.querySelector(".page");
    if (!wrap) {
        wrap = document.createElement("div");
        wrap.className = "page";
        viewer.appendChild(wrap);
    }
    return wrap;
}

function updateUi() {
    pageLabel.textContent = `Page ${pageNo} / ${numPages}`;
    if (pageInput) {
        pageInput.min = "1";
        pageInput.max = String(numPages);
        pageInput.value = String(pageNo);
    }
}

function nextPaint(frames = 2) {
    return new Promise((resolve) => {
        const step = () => {
            if (frames-- <= 0) return resolve();
            requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    });
}

async function renderPage() {
    if (!pdf) return;

    const page = await pdf.getPage(pageNo);
    const viewport = page.getViewport({ scale: 1.0 });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { alpha: false });

    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);

    await page.render({ canvasContext: ctx, viewport }).promise;

    ensureWrap().replaceChildren(canvas);
    updateUi();
}

async function loadPdf(version) {
    const task = pdfjsLib.getDocument({
        url: pdfUrl(version),
        disableStream: true,
        disableAutoFetch: true,
    });

    pdf = await task.promise;
    numPages = pdf.numPages;
    pageNo = clampPage(pageNo);
    updateUi();

    await renderPage();
    await nextPaint(2);
}

async function fetchStamp() {
    const r = await fetch(`/stamp.txt?v=${Date.now()}`, { cache: "no-store" });
    if (!r.ok) return null;
    return (await r.text()).trim() || null;
}

async function waitForNextStableStamp(prevStamp) {
    const start = Date.now();

    while (Date.now() - start < STAMP_WAIT_TIMEOUT) {
        await sleep(POLL_MS);

        const s = await fetchStamp();
        if (!s) continue;

        if (s !== prevStamp) {
            await sleep(STABLE_MS);
            const confirm = await fetchStamp();
            if (confirm === s) return s;
        }
    }
    return prevStamp;
}

function scheduleAutoReload(stamp) {
    clearTimeout(stableTimer);
    stableTimer = setTimeout(() => {
        loadPdf(stamp).catch(console.error);
    }, STABLE_MS);
}

async function poll() {
    try {
        const stamp = await fetchStamp();
        if (!stamp) return;

        if (stamp !== lastStamp) {
            lastStamp = stamp;
            scheduleAutoReload(stamp);
        }
    } catch {
    }
}

btnPrev.addEventListener("click", async () => {
    pageNo = clampPage(pageNo - 1);
    await renderPage();
});

btnNext.addEventListener("click", async () => {
    pageNo = clampPage(pageNo + 1);
    await renderPage();
});

async function goToPageFromInput() {
    if (!pdf) return;
    const n = clampPage(parseInt(pageInput?.value ?? "", 10) || 1);
    pageNo = n;
    await renderPage();
}

btnGo?.addEventListener("click", () => {
    goToPageFromInput().catch(console.error);
});

pageInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        btnGo?.click();
    }
    if (e.key === "Escape") {
        e.preventDefault();
        pageInput.value = String(pageNo);
        pageInput.blur();
    }
});

btnReload.addEventListener("click", async () => {
    try {
        btnReload.disabled = true;
        spinner.hidden = false;
        reloadLabel.textContent = "Loading...";

        const before = lastStamp ?? (await fetchStamp());
        const nextStamp = await waitForNextStableStamp(before);

        if (nextStamp) lastStamp = nextStamp;

        await loadPdf(nextStamp);
    } catch (e) {
        console.error(e);
    } finally {
        spinner.hidden = true;
        reloadLabel.textContent = "Reload";
        btnReload.disabled = false;
    }
});

window.addEventListener("keydown", (e) => {
    if (e.key === "PageDown" || e.key === "ArrowRight") btnNext.click();
    if (e.key === "PageUp" || e.key === "ArrowLeft") btnPrev.click();

    if ((e.ctrlKey || e.metaKey) && (e.key === "r" || e.key === "R")) {
        e.preventDefault();
        btnReload.click();
    }
});

updateUi();
poll();
setInterval(poll, POLL_MS);
