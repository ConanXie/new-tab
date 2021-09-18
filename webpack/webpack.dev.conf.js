const { merge } = require("webpack-merge")
const baseConfig = require("./webpack.base.conf")

const port = 5001

module.exports = merge(baseConfig, {
  mode: "development",
  resolve: {
    alias: {
      "react-dom": "@hot-loader/react-dom",
    },
  },
  output: {
    publicPath: `http://localhost:${port}/`,
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.(css|styl)$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
            },
          },
          {
            loader: "stylus-loader",
          },
        ],
      },
    ],
  },
  devServer: {
    port,
    hot: true,
    allowedHosts: "all",
    client: {
      overlay: true,
      logging: "warn",
    },
    devMiddleware: {
      stats: {
        assets: false,
        timings: true,
        modules: false,
        version: false,
        hash: false,
      },
    },
  },
  devtool: "cheap-module-source-map",
})
