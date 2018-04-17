const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')

const baseConfig = require('./webpack.base.conf')

// inject module hot replacement
Object.keys(baseConfig.entry).forEach(name => {
  baseConfig.entry[name] = ['react-hot-loader/patch', 'webpack/hot/only-dev-server'].concat(baseConfig.entry[name])
})

const port = 5001

module.exports = merge(baseConfig, {
  mode: 'development',
  output: {
    publicPath: `http://localhost:${port}/`,
    filename: '[name].js'
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
