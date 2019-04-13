const path = require("path")

const context = path.resolve(__dirname, "../src")

module.exports = {
  context,
  entry: {
    index: "./views/index",
    popup: "./views/popup",
    settings: "./views/settings",
    background: "./views/background",
  },
  resolve: {
    extensions: [
      ".js",
      ".ts",
      ".tsx",
      ".styl",
      ".css",
      ".jpg",
      ".png",
      ".svg",
      ".woff",
      ".woff2",
      ".gif",
    ],
    alias: {
      mobx: path.resolve(__dirname, "../node_modules/mobx/lib/mobx.es6.js"),
      config: path.join(context, "config"),
      utils: path.join(context, "utils"),
      store: path.join(context, "store"),
      components: path.join(context, "components"),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "eslint-loader",
        enforce: "pre",
        include: [path.resolve(__dirname, "../src")],
        options: {
          formatter: require("eslint-friendly-formatter"),
        },
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          cacheDirectory: true,
        },
      },
      {
        test: /\.(jpe?g|png|svg|gif)$/,
        loader: "url-loader",
        options: {
          name: "images/[name].[ext]",
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/,
        loader: "file-loader",
        options: {
          name: "fonts/[name].[ext]",
        },
      },
    ],
  },
}
