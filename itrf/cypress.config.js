import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    devServer: {
      framework: "vue",
      bundler: "vite",
    },
  },
  e2e: {
    experimentalRunAllSpecs: true,
    setupNodeEvents() {
      // implement node event listeners here
    },
  },
});
