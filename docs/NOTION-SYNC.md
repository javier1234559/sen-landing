# Notion CMS sync guide

This template can use a Notion database as an optional CMS. Notion remains the writing interface; the sync script converts published pages into local Markdown so Astro can build a fast static site.

## How it works

```text
Notion database
  → query pages with Status = Published
  → fetch page blocks
  → convert blocks to Markdown
  → download remote images to public/images/blog
  → write frontmatter and Markdown to src/content/blog
  → Astro validates and builds the site
```

The website does not call Notion at runtime.

## 1. Create the Notion integration

1. Create an internal integration in Notion.
2. Copy its secret token.
3. Create or choose a Notion database for posts.
4. Open the database’s menu, choose **Connections**, and add the integration.
5. Copy the database ID from the database URL.

The integration must have access to the database. A token without a database connection will return a permissions error.

## 2. Configure environment variables

Copy the example file and fill in the two CMS values:

```bash
cp .env.example .env
```

```dotenv
NOTION_TOKEN=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Never commit `.env` or expose `NOTION_TOKEN` as a `PUBLIC_*` variable.

## 3. Configure the database

The sync currently expects these property names:

| Property | Type | Required | Notes |
| --- | --- | --- | --- |
| `Name` | Title | Yes | Post title |
| `Status` | Status | Yes | Must equal `Published` to sync |
| `Slug` | Rich text | No | Generated from `Name` when empty |
| `SEO Description` | Rich text | No | Used for descriptions and metadata |
| `Create at` | Date | No | Used as the publication date |
| `Author` | People | No | First selected person is used |
| `HashTag` | Multi-select | No | Converted to the `tags` frontmatter array |

Property names are case-sensitive. If your database uses different names, update `scripts/sync_notion.js` in `mapPage()` and update this guide.

## 4. Run a local sync

From the `astro-base` directory:

```bash
pnpm sync
pnpm dev
```

The command reports each generated post. Then visit `/blogs` and open an article to verify the result.

## Generated output

The sync writes:

- Markdown posts to `src/content/blog/<slug>.md`
- Downloaded article images to `public/images/blog/<hash>.<extension>`

The generated frontmatter matches the Astro schema in `src/content.config.ts`:

```yaml
title: "A post title"
description: "A short description"
date: 2026-01-01
slug: "a-post-title"
draft: false
author: "Your Name"
tags:
  - "astro"
readingTime: "2 min read"
```

## Important behavior

- Only pages whose `Status` is exactly `Published` are imported.
- The sync clears `src/content/blog/` and `public/images/blog/` before importing.
- The example post is removed on the first sync.
- Images hosted by Notion are downloaded so articles do not depend on expiring Notion URLs.
- A failed image download leaves the original remote image out of the local replacement and logs a warning.
- The sync is safe to run repeatedly; generated files are recreated from Notion.

Because the generated directories are cleared, do not keep hand-written posts or manually managed images there when using Notion as the source of truth. If you need both sources, use separate collections/directories and adapt `src/content.config.ts`.

## Build and deployment

For a local or CI build:

```bash
pnpm sync
pnpm build
```

In CI, add `NOTION_TOKEN` and `NOTION_DATABASE_ID` as encrypted environment variables. The sync must run before `astro build` so the generated Markdown exists during content collection loading.

## Troubleshooting

### `Could not find database` or `unauthorized`

Check that the database ID is correct and that the integration was added under the database’s **Connections** menu.

### No posts are synced

Check that the database has a `Status` property and at least one page whose status is exactly `Published`.

### A post is missing fields

Only `Name` and `Status` are required by the sync. Missing description, date, author, or tags produce valid but less complete frontmatter.

### The article route is missing

Check the generated filename and `slug` frontmatter. Slugs must be unique and should contain URL-safe characters.

### Markdown formatting is not preserved

The conversion is performed by `notion-to-md`. Unsupported or custom Notion blocks may need a custom transformer in `scripts/sync_notion.js`.

## Extending the workflow

Common extensions include:

- Adding a `Featured image` property and writing it to frontmatter.
- Supporting a `Projects` or `Notes` database with another collection.
- Adding a GitHub Actions workflow that runs `pnpm sync` before deployment.
- Adding a webhook endpoint that triggers a provider-specific rebuild.

Keep Notion-specific logic inside `scripts/` so the rest of the Astro app remains usable with local Markdown only.
