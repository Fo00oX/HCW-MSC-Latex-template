# SDE-MA-Latex

LaTeX thesis template for the Master’s program **Software Design & Engineering (SDE)** at **Hochschule Campus Wien**.

---

## Purpose

This template supports the preparation of a Master’s thesis in accordance with the formal requirements of Hochschule Campus Wien. Users are responsible for ensuring compliance with the current official thesis guidelines.

---

## Structure

```
SDE-MA-Latex/
│
├── thesis/                 # LaTeX source files
│   ├── thesis-main.tex     # Main document entry point
│   ├── parts/              # Front matter, chapters, appendix
│   ├── hcw_thesis_setup.sty
│   └── references.bib
│
├── out/                    # Build artifacts (aux, log, bbl, etc.)
│
├── thesis-main.pdf         # Generated output (after build)
│
├── build                   # Build script
├── clean                   # Clean script
└── README.md
```

---

## Requirements

* MiKTeX (Windows) or TeX Live (Linux/macOS)
* `latexmk`
* `biber`
* Bash-compatible shell (e.g., Git Bash on Windows)

Verify installation:

```bash
latexmk -v
biber --version
```

---

## Build

From the repository root:

```bash
./build
```

This will:

* Compile the thesis using `latexmk`
* Execute `biber` for bibliography processing
* Store auxiliary files in `out/`
* Generate `thesis-main.pdf` in the repository root

---

## Clean

To remove all generated files:

```bash
./clean
```

This removes:

* All files in `out/`
* The generated `thesis-main.pdf`

---

## Bibliography

The project uses `biblatex` with the `biber` backend. Bibliographic entries are maintained in:

```
thesis/references.bib
```
# HCW-MSC-Latex-template
