# Brand update guide

Use this document when rebranding the template. The app identity has one source of truth in `src/config.ts`; the favicon and metadata are wired to that configuration.

## Brand configuration

Update `brandConfig` in `src/config.ts`:

```ts
export const brandConfig = {
  NAME: "Your App",
  DESCRIPTION: "A short description for search and social sharing.",
  VERSION: "0.1.0",
  AUTHOR: "Your Name",
  AUTHOR_EMAIL: "you@example.com",
  AUTHOR_URL: "https://example.com",
};
```

`SITE_TITLE`, `SITE_DESCRIPTION`, `SITE_AUTHOR`, and `SITE_URL` are derived values used by the layouts, footer, home page, RSS feed, and SEO metadata. Prefer importing those values instead of duplicating brand strings.

## Favicon and icons

Replace `public/favicon.svg` with your own SVG, or add these files under `public/`:

| Asset | Location |
| --- | --- |
| Browser favicon | `public/favicon.svg` or `public/favicon.ico` |
| Apple touch icon | `public/apple-touch-icon.png` |
| PWA icons | `public/icon-192.png`, `public/icon-512.png` |
| Social preview | `public/og-image.png` |

If you only have a logo, generate the browser and platform sizes with [RealFaviconGenerator](https://realfavicongenerator.net/), then place the generated files in `public/` and update the `<head>` in `src/layouts/PageLayout.astro` if additional link tags are required.

## SEO and social metadata

- Update the default title and description in `src/config.ts`.
- Keep page-specific metadata in `PageMeta.astro` calls from each route.
- Add an Open Graph image to `PageMeta.astro` when the project has a stable social image.
- Set `PUBLIC_SITE_URL` in production so canonical URLs, sitemap, and RSS links are correct.

## Visual system

Update global design tokens in `src/styles/index.css` and Tailwind extensions in `tailwind.config.cjs`. Keep semantic names such as `background`, `foreground`, `muted`, and `primary` so components do not depend on a specific brand color.

When changing fonts, update both the Google Fonts import in `src/styles/index.css` and the `fontFamily` entries in `tailwind.config.cjs`.

## Rebrand checklist

- [ ] Update `brandConfig` in `src/config.ts`.
- [ ] Set `PUBLIC_SITE_URL` and optional public site environment values.
- [ ] Replace `public/favicon.svg` and add any platform icons.
- [ ] Review `PageMeta.astro` for Open Graph/Twitter image defaults.
- [ ] Update colors and typography in `src/styles/index.css`.
- [ ] Update navigation and footer copy in `src/content/NavLinks.ts` and `src/components/layout/Footer.astro`.
- [ ] Run `pnpm build` and inspect the home, blog, and RSS routes.
