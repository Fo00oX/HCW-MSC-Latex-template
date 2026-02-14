import * as pdfjsLib from "pdfjs-dist/build/pdf.mjs";
import workerUrl from "pdfjs-dist/build/pdf.worker.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

const viewer = document.getElementById("viewer");
const pageLabel = document.getElementById("pageLabel");
const btnPrev = document.getElementById("prev");
const btnNext = document.getElementById("next");

let pdf = null;
let pageNo = 1;
let numPages = 1;

let lastStamp = null;
let stableTimer = null;

const STABLE_MS = 700;
const POLL_MS = 700;

function clampPage(n){
    return Math.max(1, Math.min(numPages, n));
}

function pdfUrl(){
    return `/thesis.pdf?v=${Date.now()}`;
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
}

async function loadPdf(){
    const task = pdfjsLib.getDocument({
        url: pdfUrl(),
        disableStream: true,
        disableAutoFetch: true
    });

    pdf = await task.promise;
    numPages = pdf.numPages;
    pageNo = clampPage(pageNo);
    updateLabel();
    await renderPage();
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

window.addEventListener("keydown", (e) => {
    if (e.key === "PageDown" || e.key === "ArrowRight") btnNext.click();
    if (e.key === "PageUp" || e.key === "ArrowLeft") btnPrev.click();
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
