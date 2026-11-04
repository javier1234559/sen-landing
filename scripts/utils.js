import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

const CONTENT_DIR = path.join(process.cwd(), "src/content/blog");
const IMAGES_DIR = path.join(process.cwd(), "public/images/blog");

export function createSlugFromTitle(title) {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 200);
}

export function calculateReadingTime(content) {
  const words = content.trim() ? content.trim().split(/\s+/).length : 0;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

function yamlString(value) {
  return JSON.stringify(String(value));
}

function escapeMarkdownUrl(url) {
  return url.replace(/[()\\]/g, "\\$&");
}

export async function resetGeneratedDirectories() {
  await fs.rm(CONTENT_DIR, { recursive: true, force: true });
  await fs.rm(IMAGES_DIR, { recursive: true, force: true });
  await fs.mkdir(CONTENT_DIR, { recursive: true });
  await fs.mkdir(IMAGES_DIR, { recursive: true });
}

export async function downloadImage(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Image request failed (${response.status})`);

  const pathname = new URL(url).pathname;
  const extension = path.extname(pathname) || ".png";
  const filename = `${crypto.createHash("md5").update(url).digest("hex")}${extension}`;
  await fs.writeFile(path.join(IMAGES_DIR, filename), Buffer.from(await response.arrayBuffer()));
  return `/images/blog/${filename}`;
}

export async function processMarkdownImages(markdown) {
  const imageRegex = /!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/g;
  let result = markdown;

  for (const match of markdown.matchAll(imageRegex)) {
    const [fullMatch, alt, remoteUrl] = match;
    try {
      const localUrl = await downloadImage(remoteUrl);
      result = result.replace(fullMatch, `![${alt}](${escapeMarkdownUrl(localUrl)})`);
    } catch (error) {
      console.warn(`Could not download image ${remoteUrl}: ${error.message}`);
    }
  }

  return result;
}

export async function writePost(post) {
  const tags = post.tags.length
    ? `tags:\n${post.tags.map((tag) => `  - ${yamlString(tag)}`).join("\n")}`
    : "tags: []";
  const frontmatter = [
    "---",
    `title: ${yamlString(post.title)}`,
    post.description ? `description: ${yamlString(post.description)}` : null,
    post.date ? `date: ${post.date}` : null,
    `slug: ${yamlString(post.slug)}`,
    `draft: ${post.draft}`,
    post.author ? `author: ${yamlString(post.author)}` : null,
    tags,
    `readingTime: ${yamlString(calculateReadingTime(post.content))}`,
    "---",
    "",
    post.content || "No content available.",
    "",
  ].filter(Boolean).join("\n");

  const filePath = path.join(CONTENT_DIR, `${post.slug}.md`);
  await fs.writeFile(filePath, frontmatter, "utf8");
  return filePath;
}
