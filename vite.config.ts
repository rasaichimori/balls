import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "path"; // Import the path module

// https://vite.dev/config/
export default defineConfig({
  base: "/balls/",
  plugins: [svelte()],
  resolve: {
    alias: {
      $assets: path.resolve("./src/assets"), // Alias for src/components
      $utils: path.resolve("./src/utils"), // Alias for src/utils
      // Add more aliases as needed
      $lib: path.resolve("./src/lib"), //SvelteKit $lib alias
    },
  },
});
