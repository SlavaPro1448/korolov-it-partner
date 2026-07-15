import { tanstackRouter } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
// @ts-expect-error JS module without bundled types
import { viteContactApiPlugin } from "./server/viteContactPlugin.mjs";

export default defineConfig({
  plugins: [
    // muss vor react() stehen, generiert src/routeTree.gen.ts aus src/routes
    tanstackRouter({ target: "react" }),
    react(),
    tailwindcss(),
    tsConfigPaths(),
    viteContactApiPlugin(),
  ],
});
