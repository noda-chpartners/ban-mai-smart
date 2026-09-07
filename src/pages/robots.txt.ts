import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL("sitemap-index.xml", site ?? "https://banmaismart.jp").href;

  return new Response(
    ["User-agent: *", "Allow: /", "Disallow: /legal/", "", `Sitemap: ${sitemap}`, ""].join("\n"),
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    },
  );
};
