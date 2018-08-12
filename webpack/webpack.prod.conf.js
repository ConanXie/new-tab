const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const baseConfig = require('./webpack.base.conf')
const vendors = 'vendors'
const automaticNameDelimiter = '~'

const webpackConfig = merge(baseConfig, {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, '../extension'),
    filename: '[name].js'
  },
  module: {
    rules: [{
      test: /\.(css|styl)$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        'stylus-loader'
      ]
    }]
  },
  optimization: {
    minimizer: [
      new UglifyJSPlugin(),
      new OptimizeCSSAssetsPlugin()
    ],
    splitChunks: {
      chunks: 'all',
      automaticNameDelimiter
    }
  },
  plugins: [
    new webpack.HashedModuleIdsPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ]
})

const allPermutations = chunkPermutaions(Object.keys(webpackConfig.entry))

for (let name in webpackConfig.entry) {
  const chunks = allPermutations.filter(item => item.match(name))
  chunks.push(name)

  const config = {
    filename: name + '.html',
    template: path.resolve(__dirname, '../index.html'),
    inject: true,
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true
    },
    chunks,
    chunksSortMode: 'dependency',
    hash: true
  }
  webpackConfig.plugins.push(new HtmlWebpackPlugin(config))
}

module.exports = webpackConfig



/**
 * Get chunk permutations by entries for html-webpack-plugin injection
 * @param {Array} data 
 */
function chunkPermutaions(data) {
  data = data.sort()
  const chunks = []
  for (let i = 0; i < data.length; i++) {
    const next = i + 1
    const base = data.slice(i, next)
    const others = data.slice(next)
    chunks.push(base)
    permut(base, others)
  }

  return chunks.map(item => {
    item.unshift(vendors)
    return item.join(automaticNameDelimiter)
  })

  /**
   * Generate permutations
   * @param {Array} base 
   * @param {Array} others 
   */
  function permut(base, others) {
    for (let i = 0; i < others.length; i++) {
      const copy = base.slice()
      copy.push(others[i])
      chunks.push(copy)
      const rest = others.slice(i + 1)
      permut(copy, rest)
    }
  }
}
