const path = require("path");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  entry: {
    index: "./src/index.ts",
  },
  mode: "development",
  devServer: {
    port: 1234,
    hot: true,
  },
  watchOptions: {
    ignored: /.*\.#.*/,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
        options: {
          configFile: path.resolve("./tsconfig.json"),
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    plugins: [
      new TsconfigPathsPlugin({ configFile: path.resolve("./tsconfig.json") }),
    ],
    fallback: {
      stream: require.resolve("stream-browserify"),
      url: require.resolve("url/"),
      crypto: false,
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: "process",
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./src/index.html"),
      filename: "index.html",
      chunks: ["index"],
      // emit non-blocking scripts to improve page load appearance
      scriptLoading: "defer",
    }),
    new ProgressBarPlugin(),
  ],
  output: {
    filename: "[name].bundle.js",
  },
};
