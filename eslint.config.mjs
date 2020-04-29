import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ["src/**/*.ts"],
    ignores: ["dist/"],
    rules: {
      // "no-console": "warn",
      // "no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "error",
      // "@typescript-eslint/no-unused-vars": [
      //   "error",
      //   { argsIgnorePattern: "^_" },
      // ],
      // "@typescript-eslint/no-unsafe-return": "off",
    },
  },
);
