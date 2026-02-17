#!/usr/bin/env bash
set -euo pipefail

OUT="out/preview"
MAIN="preview-entry.tex"
THESIS_DIR="thesis"
OUTDIR="$OUT/latex"

mkdir -p "$OUT" "$OUTDIR"

copy_app() {
  cp -f preview/index.html "$OUT/index.html"
  cp -f preview/page.css   "$OUT/page.css"
  cp -f preview/viewer.js  "$OUT/viewer.js"
}

build_pdf() {
  ( cd "$THESIS_DIR" && latexmk -pdf -bibtex- -interaction=nonstopmode -halt-on-error -outdir="../$OUTDIR" "$MAIN" )
  cp -f "$OUTDIR/${MAIN%.tex}.pdf" "$OUT/thesis.pdf"
  date +%s%3N > "$OUT/stamp.txt"
}

cleanup() {
  echo
  echo "[INFO] Shutting down preview..."
  kill "${VITE_PID:-}" 2>/dev/null || true
  rm -rf "$OUT" 2>/dev/null || true
  echo "[INFO] Cleaned up $OUT"
}

trap cleanup INT TERM EXIT

copy_app
build_pdf || true

echo "[INFO] Starting live preview..."

( cd "$OUT" && npx -y vite . --host 127.0.0.1 --port 3000 --strictPort ) &
VITE_PID=$!

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
