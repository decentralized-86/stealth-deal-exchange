const path = require("path");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
  entry: "./worker/index.ts",
  resolve: {
    extensions: [".ts"],
  },
  plugins: [
    new NodePolyfillPlugin({
      excludeAliases: "process",
    }),
  ],
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, ".worker"),
  },
  target: "node",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    fallback: {
      net: false,
      tls: false,
      dns: false,
      child_process: false,
    },
    extensions: [".ts", ".js"],
    aliasFields: ["server"],
    alias: {
      "@": __dirname,
    },
  },
};
