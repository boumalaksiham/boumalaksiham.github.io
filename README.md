# Siham Boumalak — Research & Projects

[Live portfolio](https://boumalaksiham.github.io/)

A static portfolio built with HTML, CSS, and browser JavaScript. The page presents an introduction, research experience, project examples, a searchable project directory, education and teaching background, and contact links.

## Page structure

| Section | Contents |
|---|---|
| Research | Current Northeastern apprenticeship, Schneider Electric research internship, and Nexus-AI honors thesis |
| Projects | AI Guardian, leukemia classification, and breast cancer transcriptomics |
| More projects | 13 curated repository entries, with topic filters and local text search |
| About | Education and teaching background |
| Contact | Gmail web compose addressed to `boumaleksiham@gmail.com`, plus LinkedIn |

The directory is maintained manually; adding a GitHub repository does not automatically add it to this page. Featured projects also appear in the directory so they remain discoverable through filters.

## Local preview

Run from the repository root with Python installed:

```bash
python -m http.server 8000
```

Open http://localhost:8000. No package installation or build step is required.

Navigation, repository links, image links, and native detail disclosures work without JavaScript. Project filters, search, the AI Guardian replay, and the Privacy dialog require JavaScript.

## Files

| Path | Purpose |
|---|---|
| [index.html](index.html) | Page content, navigation, project cards, disclosures, and image captions |
| [assets/style.css](assets/style.css) | Lavender styling, layouts, responsive rules, and reduced-motion support |
| [assets/app.js](assets/app.js) | Search/filter behavior, Guardian fixtures, privacy controls, and optional analytics |
| [assets/config.js](assets/config.js) | Public analytics configuration; empty and disabled by default |
| [docs/ANALYTICS.md](docs/ANALYTICS.md) | Analytics configuration, events, and verification |

## AI Guardian demonstration

The example is inside the AI Guardian project entry. “Try an example workflow” opens a browser-only replay of a return-policy question. It displays fixture prompts and outputs, token counts, call durations, and a short interpretation of the trace.

These are synthetic examples, not live model responses or measurements from the AI Guardian backend. The replay makes no model/API calls. Each run resets its metrics; Reset cancels pending replay steps. The example policy comparison is not a factuality or safety guarantee.

“Implementation notes” explains the actual project architecture and limitations. The full implementation lives in the linked AI Guardian repository; this portfolio contains a small illustrative replay.

## Visual evidence

- `assets/guardian-preview.jpg`: actual AI Guardian React interface rendered with synthetic API fixtures. It does not show live traffic or benchmark results.
- `assets/leukemia-pca.png`: saved PCA figure from gene-expression-classification.
- `assets/breast-volcano.png`: saved volcano plot from breast_cancer_transcriptomics.

Clicking a figure opens the original image. Preserve captions, alternative text, and source context when replacing assets.

## Content maintenance

Keep research status, repository links, setup limitations, and evaluation claims aligned with the underlying work. Ongoing research is distinct from completed public project artifacts. A design-only or incomplete repository should retain its status label.

When updating CSS or JavaScript, update the corresponding version query in `index.html` to refresh cached assets. Preview narrow and wide layouts, keyboard navigation, disclosures, filters, search, replay/reset behavior, and contact links before publishing.

## Analytics and privacy

Optional Umami tracking is disabled with the current empty configuration. Search terms remain in the browser; the site does not identify visitors by name. See [analytics documentation](docs/ANALYTICS.md) before connecting a tracker.

## Hosting

The site is served through GitHub Pages from this repository. Check the Pages deployment workflow for the commit being reviewed. A successful commit alone does not prove deployment has finished; browser caching may also show an older version.
