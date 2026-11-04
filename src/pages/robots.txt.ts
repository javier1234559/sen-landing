import type { APIRoute } from "astro";
import { SITE_URL } from "@/config";

export const GET: APIRoute = () => {
  const body = `User-agent: *
Allow: /

Sitemap: ${new URL("sitemap-index.xml", SITE_URL).toString()}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
