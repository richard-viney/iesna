import { defineConfig } from "vitest/config";

export default defineConfig({
  root: "demo",
  base: "/iesna",

  test: {
    root: ".",
    environment: "jsdom",
  },
});
