# Frontend Convention (Astro)

This document describes where to add or change UI, content, features, and routes.

## Overview

The app uses Astro for routing and server/static rendering. Pages in `src/pages/` compose layouts and feature components. Shared shell elements live in `src/components/layout/`; reusable components live in `src/components/`; interactive React islands live in `src/components/feature/` or `src/components/ui/`.

Prefer Astro components for static content. Use React only where client-side state or browser interaction is needed, and add the smallest appropriate `client:*` directive.

## File structure

```text
astro-base/
├── public/                     # Static files copied as-is
├── src/
│   ├── components/
│   │   ├── layout/             # Header, footer, page shell
│   │   ├── feature/            # Feature/page-level UI and islands
│   │   ├── ui/                 # Small reusable primitives
│   │   └── *.astro             # Shared content components
│   ├── content/
│   │   └── blog/               # Markdown/MDX entries
│   ├── layouts/                # Document and content layouts
│   ├── lib/                    # Pure helpers and integrations
│   ├── pages/                  # Astro routes only
│   ├── styles/                 # Global and content styles
│   └── content.config.ts       # Typed content collections
├── docs/CONVENTION.md
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## 1. Pages and routes

- Every file in `src/pages/` becomes a route.
- Keep frontmatter limited to data loading, metadata, and composition.
- Do not put reusable business logic directly in a page.
- Use `[slug].astro` with `getStaticPaths()` for content-driven routes.
- Use `Astro.redirect()` or a `Response` for explicit redirects and 404s.

Example:

```astro
---
import PageLayout from "@/layouts/PageLayout.astro";
import PageMeta from "@/components/PageMeta.astro";
import FeatureView from "@/components/feature/FeatureView.astro";
---

<PageLayout>
  <PageMeta slot="meta" title="Feature" description="Feature description" />
  <FeatureView slot="main" />
</PageLayout>
```

## 2. Components

| Folder | Purpose |
| --- | --- |
| `components/layout` | Site shell: header, footer, navigation, providers |
| `components/feature` | A feature or page section, including React islands |
| `components/ui` | Small reusable controls and visual primitives |
| `components/` | Shared Astro components used across features |

Name Astro components in PascalCase (`PageMeta.astro`). Name React components in PascalCase and export a named component when practical.

Interactive components must declare a client directive at the route boundary, for example `client:load`, `client:visible`, or `client:only="react"`. Prefer `client:visible` for below-the-fold UI.

## 3. Layouts

- `PageLayout.astro` is the default document shell for pages.
- `ContentLayout.astro` is for article/detail pages that need content styling.
- Layouts own global CSS, document metadata slots, navigation, footer, and transitions.
- Use the `meta` and `main` named slots instead of duplicating the document shell.

## 4. Content collections

Add Markdown or MDX to the matching collection directory and define its frontmatter in `src/content.config.ts`.

```md
---
title: A post title
description: A short summary
date: 2026-01-01
slug: a-post-title
draft: false
---
```

Always load collection data through `getCollection`, `getEntry`, and `render` from `astro:content`. Filter drafts before rendering or listing them.

## 5. Styling

- Use Tailwind utility classes for component-level styling.
- Put global tokens, typography, resets, and Markdown styles in `src/styles/`.
- Use CSS variables for theme values and semantic Tailwind colors.
- Keep content width and responsive layout rules in layouts or feature components, not route files.

## 6. Configuration and aliases

- `src/config.ts` is the single source for site identity and URLs.
- Import source files with the `@/` alias.
- Keep environment-specific values in `.env` and document required keys in `.env.example`.
- Keep Astro integrations and build settings in `astro.config.mjs`.

## 7. Validation

Before handing off changes, run:

```bash
pnpm build
```

For UI work, also inspect the affected route with `pnpm dev` at desktop and mobile widths.

## 8. Optional Notion CMS workflow

The template includes `scripts/sync_notion.js` as an optional content-ingestion workflow:

```text
Notion database → query Published pages → fetch page blocks
  → convert to Markdown → download images → write src/content/blog
  → Astro validates frontmatter and builds the site
```

Enable it by setting `NOTION_TOKEN` and `NOTION_DATABASE_ID` in `.env`, sharing the database with the integration, and running `pnpm sync`.

The expected database properties are:

| Property | Notion type | Required | Purpose |
| --- | --- | --- | --- |
| `Name` | Title | Yes | Post title |
| `Slug` | Rich text | No | URL slug; generated from `Name` when empty |
| `SEO Description` | Rich text | No | Description and social metadata |
| `Create at` | Date | No | Publish date |
| `Author` | People | No | Author name |
| `HashTag` | Multi-select | No | Tags |
| `Status` | Status | Yes | Only `Published` pages are synced |

The sync writes frontmatter matching `src/content.config.ts`. It is intentionally a build-time import, not a runtime Notion dependency, so the site can remain static and fast. The sync command is destructive for the generated content directories; keep hand-written posts outside those directories or disable the sync before editing them.
