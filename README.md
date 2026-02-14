# SDE-MA-Latex

Because Version control is cool

LaTeX thesis template for the Master’s program **Software Design & Engineering (SDE)** at **Hochschule Campus Wien**.

---
## Build

From the repository root run:

```bash
./build
```

This will:

* Compile the thesis using `latexmk`
* Execute `biber` for bibliography processing
* Store auxiliary files in `out/`
* Generate `thesis-main.pdf` in the repository root

---

## Bibliography

```
thesis/references.bib
```

---

## Structure

```
SDE-MA-Latex/
│
├── thesis/                         # LaTeX source directory
│   ├── thesis-main.tex             # Main document entry point
│   ├── references.bib              # Bibliography database
│   │
│   ├── assets/
│   │   └── hcw_thesis_setup.sty        # Formatting and layout definitions
│   │
│   ├── front/                # Front matter
│   │   ├── titlepage.tex
│   │   ├── abstract_en.tex
│   │   ├── abstract_de.tex
│   │   ├── acknowledgements.tex
│   │   ├── abbreviations.tex
│   │   ├── table-of_content.tex
│   │   ├── list_of_figures.tex
│   │   └── list_of_tables.tex
│   │
│   ├── chapters/                   # Main content chapters
│   │   ├── 00_introduction.tex
│   │   ├── 01_chapter1.tex
│   │   ├── 02_chapter2.tex
│   │   └── 99_overview_ai.tex
│   │
│   ├── back/                 # Back matter
│   │   ├── appendix.tex
│   │   └── bibliography.tex
│   │
│   └── figures/                    # Images and graphics
│
├── out/                            # Build artifacts (aux, log, bbl, etc.)
├── thesis-main.pdf                 # Generated output (after build)
├── build                           # Build script, run to build PDF
└── README.md
```
