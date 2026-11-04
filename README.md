# Astro Base

A reusable Astro starter based on the structure and conventions from `blog_astro`.

## Commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
```

## Included

- Astro 5 with TypeScript
- Tailwind CSS and CSS variables
- React islands for interactive UI
- Markdown content collection with typed frontmatter
- Shared page/content layouts
- SEO metadata, sitemap, RSS, and view transitions
- `src/components`, `src/components/feature`, `src/components/layout`, and `src/components/ui`
- Optional Notion CMS sync that generates local Markdown and downloads article images

See [`docs/CONVENTION.md`](./docs/CONVENTION.md) before adding routes or features. For Notion CMS setup, read [`docs/NOTION-SYNC.md`](./docs/NOTION-SYNC.md).

## Optional Notion CMS

Copy `.env.example` to `.env`, set `NOTION_TOKEN` and `NOTION_DATABASE_ID`, share the database with your Notion integration, then run:

```bash
pnpm sync
```

The sync replaces `src/content/blog/` and `public/images/blog/` with the published Notion entries. This keeps the production site statically generated while Notion remains the authoring interface. See [`docs/NOTION-SYNC.md`](./docs/NOTION-SYNC.md) for the database schema and deployment workflow.
