# Siham Boumalak — Portfolio

A static, responsive portfolio organized around project questions, technical decisions, and evaluation evidence. The homepage features AI Guardian, scientific-paper triage, and gene expression classification, followed by a searchable collection of 13 projects.

## Local preview

From the repository root:

```bash
python -m http.server 8000
```

Open `http://localhost:8000`. No build step or package installation is required. Project links and case-study disclosures work without JavaScript; search, filters, the architecture walkthrough, and the Privacy dialog use JavaScript.

## Files

| File | Purpose |
|---|---|
| [index.html](index.html) | Content, semantic markup, and the recorded results chart |
| [assets/style.css](assets/style.css) | Layout, responsive styles, and reduced-motion handling |
| [assets/app.js](assets/app.js) | Project discovery, walkthrough, privacy preferences, and analytics events |
| [assets/config.js](assets/config.js) | Optional public analytics configuration; disabled by default |
| [docs/ANALYTICS.md](docs/ANALYTICS.md) | Owner setup and tracking details |

## Content maintenance

Update project content against each repository's documentation. The collection is curated, rather than automatically synchronized. Do not present incomplete checkouts or design plans as runnable completed systems.

The gene-expression chart is derived from the committed `results/tables/model_comparison.csv` in the gene-expression-classification repository. Mean accuracies are 95.8% (Random Forest), 95.9% (XGBoost), and 97.1% (Logistic Regression); whiskers show fold standard deviation clipped at the chart bounds. These are recorded five-fold CV results, not a new run or external clinical validation. Update the chart and accessibility description together if the underlying table changes.

The architecture and paper-processing illustrations are schematics, rather than live dashboards or fabricated execution logs.

## Checks before publishing

Check layouts at narrow and wide widths, keyboard focus, case-study disclosures, project filters and search, the Privacy dialog, all project links, and the browser console. Analytics should make no requests with the default empty configuration.

## Hosting

This repository follows GitHub's user-site convention. Inspect Pages configuration and its deployment status before changing hosting settings. Intended public URL: https://boumalaksiham.github.io/.
