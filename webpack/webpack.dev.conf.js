const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.conf')

const port = 5001

module.exports = merge(baseConfig, {
  mode: 'development',
  output: {
    publicPath: `http://localhost:${port}/`,
    filename: '[name].js'
  },
  module: {
    rules: [{
      test: /\.(css|styl)$/,
      use: [{
        loader: 'style-loader',
      }, {
        loader: 'css-loader',
        options: {
          sourceMap: true
        }
      }, {
        loader: 'stylus-loader'
      }]
    }]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    port,
    hot: true,
    overlay: true,
    compress: true,
    clientLogLevel: 'warning',
    stats: {
      assets: false,
      timings: true,
      modules: false,
      version: false,
      hash: false
    }
  },
  devtool: 'cheap-module-source-map'
})
