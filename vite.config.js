import { cloudflare } from "@cloudflare/vite-plugin";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    cloudflare({
      config: {
        name: "chocord-site",
        main: "./worker/index.js",
        compatibility_date: "2026-07-23",
        assets: {
          binding: "ASSETS"
        }
      }
    })
  ]
});
