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
├── thesis/                         # LaTeX source directory
│   ├── thesis-main.tex             # Main document entry point
│   ├── hcw_thesis_setup.sty        # Formatting and layout definitions
│   ├── references.bib              # Bibliography database
│   │
│   ├── frontmatter/                # Front matter
│   │   ├── titlepage.tex
│   │   ├── abstract_en.tex
│   │   ├── abstract_de.tex
│   │   ├── acknowledgements.tex
│   │   ├── abbreviations.tex
│   │   ├── toc.tex
│   │   ├── list_of_figures.tex
│   │   └── list_of_tables.tex
│   │
│   ├── chapters/                   # Main content chapters
│   │   ├── 01_introduction.tex
│   │   ├── 02_chapter1.tex
│   │   ├── 03_chapter2.tex
│   │   └── 99_overview_ai.tex
│   │
│   ├── backmatter/                 # Back matter
│   │   ├── appendix.tex
│   │   └── bibliography.tex
│   │
│   ├── figures/                    # Images and graphics
│   └── tables/                     # Table data (if separated)
│
├── out/                            # Build artifacts (aux, log, bbl, etc.)
├── thesis-main.pdf                 # Generated output (after build)
├── build                           # Build script, run to build PDF
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
---

## Bibliography

The project uses `biblatex` with the `biber` backend. Bibliographic entries are maintained in:

```
thesis/references.bib
```
