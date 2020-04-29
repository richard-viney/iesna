/* eslint-env node */

const path = require("path");

// Webpack configuration for the demo app in ./demo
module.exports = {
  entry: "./demo/index.ts",

  output: {
    filename: "index.js",
    path: path.join(__dirname, "demo"),
  },

  // Development server
  devServer: {
    contentBase: path.join(__dirname, "demo"),
    port: 5000,
  },

  // Enable sourcemaps for debugging
  devtool: "source-map",

  // Resolve the following files
  resolve: {
    extensions: [".ts", ".js"],
  },

  // Module configuration
  module: {
    rules: [
      // All files with a '.ts'extension will be handled by 'awesome-typescript-loader'
      {
        test: /\.ts$/,
        loader: "awesome-typescript-loader",
        options: { configFileName: "./demo/tsconfig.json" },
      },

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
    ],
  },
};
