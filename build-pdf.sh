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
echo "Built successfully:"
echo "  PDF        : ./$PDF"
echo "  Aux files  : ./$OUTDIR/"
