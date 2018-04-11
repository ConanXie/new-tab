const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const baseConfig = require('./webpack.base.conf')
const node_modules = path.resolve(__dirname, '../node_modules')

// Replace css & less rule
baseConfig.module.rules.splice(1, 1, {
  test: /\.(css|styl)$/,
  use: ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: [{
      loader: 'css-loader',
      options: {
        minimize: true
      }
    }, 'stylus-loader']
  })
})

module.exports = merge(baseConfig, {
  mode: 'production',
  entry: './index',
  output: {
    path: path.resolve(__dirname, '../extension'),
    filename: '[name].min.js'
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },
  plugins: [
    new webpack.HashedModuleIdsPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new UglifyJSPlugin(),
    new ExtractTextPlugin({
      filename: '[name].min.css'
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, '../index.html'),
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: false,
        removeAttributeQuotes: true
      },
      chunksSortMode: 'dependency'
    })
  ]
})
