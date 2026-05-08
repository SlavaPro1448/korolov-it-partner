import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
// @ts-expect-error JS module without bundled types
import { viteContactApiPlugin } from "./server/viteContactPlugin.mjs";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    tsConfigPaths(),
    viteContactApiPlugin(),
  ],
});
