# SDE-MA-Latex-Template

LaTeX thesis template for the Master’s program
**Software Design & Engineering (SDE)** at
**Hochschule Campus Wien**

---

# Build (PDF)

From the repository root:

```bash
./build-pdf.sh
```
Output:

```
thesis-main.pdf
```
---
# Live HTML PDF Preview (Browser)

For instant browser preview with auto-reload:

```bash
./preview-pdf.sh
```
Then open:

```
http://localhost:3000
```
---
# HTML Wrapper File

For HTML builds, the following wrapper must exist:

```
thesis/preview-entry.tex
```
---
# Bibliography

Bibliography file

(Processed automatically via `biber`.):

```
thesis/references.bib
```

---

# Project Structure

```
SDE-MA-Latex-Template/
│
├── thesis/
│   ├── thesis-main.tex            # Main PDF entry point
│   ├── preview-entry.tex          # HTML preview wrapper
│   ├── references.bib             # Bibliography database
│   │
│   ├── assets/
│   │   └── hcw_thesis_setup.sty
│   │
│   ├── front/                     # Stuf before actual Thesis
│   │   ├── titlepage.tex
│   │   ├── abstract.tex
│   │   ├── abstract_de.tex
│   │   ├── acknowledgments.tex
│   │   ├── abbreviations.tex
│   │   ├── table_of_contents.tex
│   │   ├── list_of_figures.tex
│   │   └── list_of_tables.tex
│   │
│   ├── chapters/                  # Actual Thesis
│   │   ├── introduction.tex
│   │   ├── chapter1.tex
│   │   ├── chapter2.tex
│   │   └── overview_ai.tex
│   │
│   ├── back/                      # Stuff after actual Thesis
│   │   ├── appendix.tex
│   │   └── bibliography.tex
│   │
│   └── figures/
│
├── out/                           # Generated stuf
│
├── thesis-main.pdf                # Generated PDF (after build-pdf)
├── build-pdf.sh                   # PDF build script
├── preview-pdf.sh                 # Live HTML preview script
└── README.md
```