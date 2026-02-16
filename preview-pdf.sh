#!/usr/bin/env bash
set -euo pipefail

OUT="out/preview"
MAIN="preview/preview-entry.tex"
THESIS_DIR="thesis"
OUTDIR="$OUT/latex"

mkdir -p "$OUT" "$OUTDIR"

copy_app() {
  cp -f preview/index.html "$OUT/index.html"
  cp -f preview/page.css   "$OUT/page.css"
  cp -f preview/viewer.js  "$OUT/viewer.js"
}

build_pdf() {
  local main_src="../$MAIN"
  local base="$(basename "$MAIN" .tex)"
  local pdf_src="$OUTDIR/$base.pdf"

  ( cd "$THESIS_DIR" && latexmk -pdf -bibtex- -interaction=nonstopmode -halt-on-error -outdir="../$OUTDIR" "$main_src" )
  cp -f "$pdf_src" "$OUT/thesis.pdf"
  date +%s%3N > "$OUT/stamp.txt"
}

copy_app
build_pdf || true

echo "[INFO] Starting live preview..."

( cd "$OUT" && npx -y vite . --host 127.0.0.1 --port 3000 --strictPort ) &
VITE_PID=$!

trap 'kill "$VITE_PID" 2>/dev/null || true; exit 0' INT TERM

last=""
while true; do
  newest="$(
    find "$THESIS_DIR" -type f \( -name "*.tex" -o -name "*.bib" -o -name "*.sty" -o -name "*.cls" \) \
      -printf '%T@\n' 2>/dev/null | sort -n | tail -1
  )"
  if [[ -n "$newest" && "$newest" != "$last" ]]; then
    last="$newest"
    sleep 0.4
    build_pdf >/dev/null 2>&1 || true
  fi
  sleep 0.2
done
