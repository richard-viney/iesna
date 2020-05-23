/* eslint-env node */

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

      extends: ["plugin:@typescript-eslint/all", "prettier/@typescript-eslint"],

      rules: {
        "@typescript-eslint/lines-between-class-members": "off",
        "@typescript-eslint/member-ordering": "off",
        "@typescript-eslint/no-magic-numbers": "off",
        "@typescript-eslint/no-unnecessary-condition": [
          "error",
          { allowConstantLoopConditions: true },
        ],
        "@typescript-eslint/prefer-readonly-parameter-types": "off",
        "@typescript-eslint/restrict-template-expressions": "off",
        "@typescript-eslint/typedef": "off",
      },
    },

    {
      files: ["demo/**/*.ts"],

      env: {
        browser: true,
      },
    },

    {
      files: ["test/**/*.ts"],

      env: {
        browser: true,
        jasmine: true,
      },
    },
  ],
};
