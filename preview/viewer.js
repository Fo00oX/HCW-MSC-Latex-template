import * as pdfjsLib from "pdfjs-dist/build/pdf.mjs";
import workerUrl from "pdfjs-dist/build/pdf.worker.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

const viewer = document.getElementById("viewer");
const pageLabel = document.getElementById("pageLabel");
const btnPrev = document.getElementById("prev");
const btnNext = document.getElementById("next");
const btnReload = document.getElementById("reload");
const reloadLabel = btnReload.querySelector(".reload-label");
const spinner = btnReload.querySelector(".spinner");

const pageInput = document.getElementById("pageInput");
const btnGo = document.getElementById("go");

let pdf = null;
let pageNo = 1;
let numPages = 1;

let lastStamp = null;
let stableTimer = null;

const STABLE_MS = 700;
const POLL_MS = 5000;

function clampPage(n){
    return Math.max(1, Math.min(numPages, n));
}

function pdfUrl(version, nonce){
    const v = version ?? lastStamp ?? Date.now();
    const n = nonce ? `&n=${Date.now()}` : "";
    return `/thesis.pdf?v=${encodeURIComponent(v)}${n}`;
}

function getWrap(){
    let wrap = viewer.querySelector(".page");
    if (!wrap) {
        wrap = document.createElement("div");
        wrap.className = "page";
        viewer.appendChild(wrap);
    }
    return wrap;
}

function updateLabel(){
    pageLabel.textContent = `Page ${pageNo} / ${numPages}`;
    if (pageInput) {
        pageInput.min = "1";
        pageInput.max = String(numPages);
        pageInput.value = String(pageNo);
    }
}

async function loadPdf(version){
    const task = pdfjsLib.getDocument({
        url: pdfUrl(version),
        disableStream: true,
        disableAutoFetch: true
    });

    pdf = await task.promise;
    numPages = pdf.numPages;
    pageNo = clampPage(pageNo);
    updateLabel();

    await renderPage();
    await nextPaint(2);
}

async function renderPage(){
    if (!pdf) return;

    const page = await pdf.getPage(pageNo);
    const viewport = page.getViewport({ scale: 1.0 });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { alpha: false });

    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);

    await page.render({ canvasContext: ctx, viewport }).promise;

    const wrap = getWrap();
    wrap.replaceChildren(canvas);

    updateLabel();
}

btnPrev.addEventListener("click", async () => {
    pageNo = clampPage(pageNo - 1);
    await renderPage();
});

btnNext.addEventListener("click", async () => {
    pageNo = clampPage(pageNo + 1);
    await renderPage();
});

function nextPaint(frames = 2) {
    return new Promise((resolve) => {
        const step = () => {
            if (frames-- <= 0) return resolve();
            requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    });
}

btnReload.addEventListener("click", async () => {
    try {
        btnReload.disabled = true;
        spinner.hidden = false;
        reloadLabel.textContent = "Loading...";

        const before = lastStamp ?? await fetchStamp();

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


const STAMP_POLL_MS = 5000;
const STAMP_WAIT_TIMEOUT = 10000;

async function fetchStamp() {
    const r = await fetch(`/stamp.txt?v=${Date.now()}`, { cache: "no-store" });
    if (!r.ok) return null;
    return (await r.text()).trim() || null;
}

async function waitForNextStableStamp(prevStamp) {
    const start = Date.now();

    while (Date.now() - start < STAMP_WAIT_TIMEOUT) {

        await new Promise(res => setTimeout(res, STAMP_POLL_MS));

        const s = await fetchStamp();
        if (!s) continue;

        if (s !== prevStamp) {
            await new Promise(res => setTimeout(res, STABLE_MS));

            const confirm = await fetchStamp();
            if (confirm === s) {
                return s;
            }
        }
    }

    return prevStamp;
}

async function goToPageFromInput(){
    if (!pdf) return;
    const raw = pageInput?.value ?? "";
    const n = clampPage(parseInt(raw, 10) || 1);
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

window.addEventListener("keydown", (e) => {
    if (e.key === "PageDown" || e.key === "ArrowRight") btnNext.click();
    if (e.key === "PageUp" || e.key === "ArrowLeft") btnPrev.click();

    if ((e.ctrlKey || e.metaKey) && (e.key === "r" || e.key === "R")) {
        e.preventDefault();
        btnReload.click();
    }
});

function schedule(stamp){
    clearTimeout(stableTimer);
    stableTimer = setTimeout(() => {
        loadPdf().catch(console.error);
    }, STABLE_MS);
}

async function poll(){
    try {
        const r = await fetch(`/stamp.txt?v=${Date.now()}`, { cache: "no-store" });
        if (!r.ok) return;
        const stamp = (await r.text()).trim();
        if (!stamp) return;

        if (stamp !== lastStamp) {
            lastStamp = stamp;
            schedule(stamp);
        }
    } catch {}
}

updateLabel();
poll();
setInterval(poll, POLL_MS);
