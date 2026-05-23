const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// eslint-disable-next-line no-unused-vars
module.exports = (env, argv) => {
  return {
    entry: "./src/main.js",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].[contenthash].js",
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: "vue-loader",
        },
        {
          test: /\.js$/,
          loader: "babel-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: ["vue-style-loader", "css-loader"],
        },
      ],
    },
    plugins: [
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        template: "./public/index.html",
      }),
      new MiniCssExtractPlugin({
        filename: "[name].[contenthash].css",
      }),
    ],
    resolve: {
      extensions: [".js", ".vue", ".json"],
      alias: {
        vue$: "vue/dist/vue.runtime.esm.js",
        "vue2-dlg-lib$": path.resolve(
          __dirname,
          "../vue2-dlg-lib/src/index.js",
        ),
        "vue2-dlg-lib/src": path.resolve(__dirname, "../vue2-dlg-lib/src"),
      },
    },
    devServer: {
      port: 8081,
      hot: true,
    },
  };
};
