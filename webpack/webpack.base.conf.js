const path = require("path")
const ESLintPlugin = require("eslint-webpack-plugin")

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
      config: path.join(context, "config"),
      utils: path.join(context, "utils"),
      store: path.join(context, "store"),
      styles: path.join(context, "styles"),
      components: path.join(context, "components"),
    },
  },
  module: {
    rules: [
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
  plugins: [
    new ESLintPlugin({
      extensions: ["js", "ts", "tsx"],
    }),
  ],
}
