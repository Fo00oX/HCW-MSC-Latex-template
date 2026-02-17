#!/usr/bin/env bash
set -euo pipefail

SRCDIR="thesis"
MAIN="thesis-main.tex"
OUTDIR="out/build"
PDF="thesis-main.pdf"

mkdir -p "$OUTDIR"

cd "$SRCDIR"

latexmk -pdf -g \
  -outdir="../$OUTDIR" \
  -interaction=nonstopmode \
  -halt-on-error \
  "$MAIN"

cd ..

cp "$OUTDIR/$PDF" "$PDF"

echo
echo "[INFO] Built successfully:"
echo "  [INFO] PDF        : ./$PDF"
echo
echo "[INFO] Clean up Aux files in: ./$OUTDIR/"

cleanup() {
  echo
  echo "[INFO] Shutting down out..."
  rm -rf "$OUTDIR" 2>/dev/null || true
  echo "[INFO] Cleaned up $OUTDIR"
}

trap cleanup INT TERM EXIT
