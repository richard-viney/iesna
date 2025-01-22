import { defineConfig } from "vite";

export default defineConfig({
  root: "demo",
  base: "/iesna",

  test: {
    root: "test",
    environment: "jsdom",
  },
});
