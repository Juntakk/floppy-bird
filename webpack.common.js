import { resolve, join } from "path";
import CopyPlugin from "copy-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { DefinePlugin } from "webpack";

export const mode = "development";
export const entry = {
  app: "./src/index.js",
};
export const devtool = "eval-source-map";
export const output = {
  filename: "[name].js",
  path: resolve(__dirname, "build"),
};
export const optimization = {
  splitChunks: {
    cacheGroups: {
      commons: {
        test: /[\\/]node_modules[\\/]/,
        name: "vendor",
        chunks: "all",
      },
    },
  },
};
export const module = {
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: "babel-loader",
      },
    },
  ],
};
export const devServer = {
  static: {
    directory: join(__dirname, "build"),
  },
  compress: true,
  port: 8080,
};
export const plugins = [
  new DefinePlugin({
    CANVAS_RENDERER: JSON.stringify(true),
    WEBGL_RENDERER: JSON.stringify(true),
  }),
  new HtmlWebpackPlugin({
    template: resolve(__dirname, "index.html"),
    favicon: resolve(__dirname, "public/favicon.ico"),
  }),
  new CopyPlugin({
    patterns: [
      {
        from: resolve(__dirname, "assets"),
        to: resolve(__dirname, "build/assets"),
      },
    ],
  }),
];
