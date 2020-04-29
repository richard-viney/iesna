module.exports = {
  root: true,

  extends: ["eslint:recommended", "prettier"],

  ignorePatterns: ["demo/index.js", "dist/"],

  rules: {
    "no-constant-condition": ["error", { checkLoops: false }],
  },

  overrides: [
    {
      files: ["**/*.js"],

      parser: "espree",
      parserOptions: {
        sourceType: "module",
        ecmaVersion: 2015,
      },
    },

    {
      files: ["**/*.ts"],

      plugins: ["@typescript-eslint"],

      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: "./tsconfig.json",
      },

      extends: [
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "prettier/@typescript-eslint",
      ],
    },
  ],
};
