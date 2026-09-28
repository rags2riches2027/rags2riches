# From Rags to Riches

An interactive companion to a scoping review of retrieval-augmented generation (RAG) in HCI. Explore the analysis, paper-level coding, and codebook for 100 included papers.

Built with Next.js and exported as a static website.

## Local development

Requires Node.js 22 or later.

```sh
npm ci
npm run dev
```

Open http://localhost:3000.

## Deployment

Enable **GitHub Actions** under **Settings → Pages**, then push to `main`. The included workflow builds and deploys the site to GitHub Pages.

To build locally, run `npm run build`. The static output is saved in `out/`.
