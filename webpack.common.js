const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  mode: "development",
  entry: {
    app: "./src/index.js",
  },
  devtool: "eval-source-map",
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "build"),
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "all",
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "build"),
    },
    compress: true,
    port: 8080,
  },
  plugins: [
    new webpack.DefinePlugin({
      CANVAS_RENDERER: JSON.stringify(true),
      WEBGL_RENDERER: JSON.stringify(true),
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "index.html"),
      favicon: path.resolve(__dirname, "public/favicon.ico"),
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "assets"),
          to: path.resolve(__dirname, "build/assets"),
        },
      ],
    }),
  ],
};
