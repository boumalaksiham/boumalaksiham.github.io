# Siham Boumalak — Portfolio

A static, responsive portfolio organized around project questions, technical decisions, and evaluation evidence. The homepage features AI Guardian, gene expression classification, and breast cancer transcriptomics, followed by a searchable collection of 13 projects.

## Local preview

From the repository root:

```bash
python -m http.server 8000
```

Open `http://localhost:8000`. No build step or package installation is required. Project links and case-study disclosures work without JavaScript; search, filters, and the Privacy dialog use JavaScript.

## Files

| File | Purpose |
|---|---|
| [index.html](index.html) | Content, semantic markup, and project output images |
| [assets/style.css](assets/style.css) | Layout, responsive styles, and reduced-motion handling |
| [assets/app.js](assets/app.js) | Project discovery,  privacy preferences, and analytics events |
| [assets/config.js](assets/config.js) | Optional public analytics configuration; disabled by default |
| [docs/ANALYTICS.md](docs/ANALYTICS.md) | Owner setup and tracking details |

## Content maintenance

Update project content against each repository's documentation. The collection is curated, rather than automatically synchronized. Do not present incomplete checkouts or design plans as runnable completed systems.

The featured visuals are real project artifacts:

- `assets/guardian-preview.jpg`: the actual AI Guardian React interface, rendered with explicitly synthetic API fixture data for preview. It is not a screenshot of live traffic or measured performance.
- `assets/leukemia-pca.png`: the original saved PCA figure from gene-expression-classification.
- `assets/breast-volcano.png`: the original saved volcano plot from breast_cancer_transcriptomics.

Figures can be opened at full resolution by clicking them. Keep source attribution, alternative text, and limitations in sync when updating these assets. No AI-generated illustrations or simulated execution logs are used.

## Checks before publishing

Check layouts at narrow and wide widths, keyboard focus, case-study disclosures, project filters and search, the Privacy dialog, all project links, and the browser console. Analytics should make no requests with the default empty configuration.

## Hosting

This repository follows GitHub's user-site convention. Inspect Pages configuration and its deployment status before changing hosting settings. Intended public URL: https://boumalaksiham.github.io/.

## Interactive header demo

The product-comparison dashboard computes Jaccard word overlap and simple model, storage, and color conflicts in the browser. It uses editable titles and three example pairs. This is an explanatory rules demo, not inference with the repository's embedding model or a calibrated match probability. Unknown attributes are not treated as matches, and the interface does not confirm product identity. Input text is not sent to a server or recorded by analytics.
