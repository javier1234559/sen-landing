import { Client } from "@notionhq/client";
import dotenv from "dotenv";
import { NotionToMarkdown } from "notion-to-md";
import {
  createSlugFromTitle,
  processMarkdownImages,
  resetGeneratedDirectories,
  writePost,
} from "./utils.js";

dotenv.config();

const { NOTION_TOKEN, NOTION_DATABASE_ID } = process.env;
if (!NOTION_TOKEN || !NOTION_DATABASE_ID) {
  throw new Error("Set NOTION_TOKEN and NOTION_DATABASE_ID in .env before running pnpm sync.");
}

const notion = new Client({ auth: NOTION_TOKEN });
const n2m = new NotionToMarkdown({ notionClient: notion });

function plainText(property) {
  return property?.title?.[0]?.plain_text
    || property?.rich_text?.[0]?.plain_text
    || "";
}

async function getPageMarkdown(pageId) {
  const blocks = await n2m.pageToMarkdown(pageId);
  return n2m.toMarkdownString(blocks).parent || "";
}

function mapPage(page) {
  const properties = page.properties;
  const title = plainText(properties.Name);
  if (!title) return null;

  const status = properties.Status?.status?.name || "";
  const date = properties["Create at"]?.date?.start || "";
  const tags = (properties.HashTag?.multi_select || []).map((tag) => tag.name);

  return {
    id: page.id,
    title,
    slug: plainText(properties.Slug) || createSlugFromTitle(title),
    description: plainText(properties["SEO Description"]),
    date: date ? date.slice(0, 10) : "",
    author: properties.Author?.people?.[0]?.name || "",
    tags,
    draft: status !== "Published",
  };
}

async function getPublishedPages() {
  const pages = [];
  let cursor;

  do {
    const response = await notion.databases.query({
      database_id: NOTION_DATABASE_ID,
      filter: { property: "Status", status: { equals: "Published" } },
      start_cursor: cursor,
    });
    pages.push(...response.results);
    cursor = response.has_more ? response.next_cursor : undefined;
  } while (cursor);

  return pages.map(mapPage).filter(Boolean);
}

async function main() {
  await resetGeneratedDirectories();
  const posts = await getPublishedPages();
  console.log(`Syncing ${posts.length} published Notion posts...`);

  for (const post of posts) {
    post.content = await getPageMarkdown(post.id);
    post.content = await processMarkdownImages(post.content);
    const filePath = await writePost(post);
    console.log(`Synced ${post.slug} → ${filePath}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
