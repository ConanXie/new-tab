const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')

const baseConfig = require('./webpack.base.conf')

const port = 5001

module.exports = merge(baseConfig, {
  mode: 'development',
  entry: [
    'react-hot-loader/patch',
    'webpack/hot/only-dev-server',
    './index'
  ],
  output: {
    publicPath: `http://localhost:${port}/`,
    filename: 'bundle.js'
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
