// @ts-check
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import { defineConfig } from "astro/config";

// 公開ドメインが決まったら SITE またはここの URL を更新してください。
const site = process.env.SITE || "https://ban-mai-smart.pages.dev";

// https://astro.build/config
export default defineConfig({
  site,
  vite: {
    plugins: [
      {
        name: "astro-icon-virtual-pre",
        enforce: "pre",
        resolveId(id) {
          if (id === "virtual:astro-icon") {
            return "\0virtual:astro-icon";
          }
        },
      },
    ],
  },
  integrations: [
    icon(),
    sitemap({
      changefreq: "weekly",
      priority: 1,
      lastmod: new Date(),
      filter: (page) => !page.includes("/404"),
    }),
  ],
});
