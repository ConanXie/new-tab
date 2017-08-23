const path = require('path')
const webpack = require('webpack')
const fs = require('fs')

const port = 5001

module.exports = {
  context: path.resolve(__dirname, '../src'),
  entry: [
    'babel-polyfill',
    'react-hot-loader/patch',
    'webpack/hot/only-dev-server',
    './Main.jsx'
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.less', '.css', '.jpg', '.png', '.svg', '.woff2', '.gif']
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: `http://localhost:${port}/`,
    filename: 'bundle.js'
  },
  module: {
    rules: [{
      test: /\.js(x)?$/,
      exclude: /node_modules/,
      use: [{
        loader: 'babel-loader',
        options: {
          plugins: ['react-hot-loader/babel']
        }
      }]
    }, {
      test: /\.less$/,
      use: [{
        loader: 'style-loader',
      }, {
        loader: 'css-loader',
        options: {
          sourceMap: true
        }
      }, {
        loader: 'less-loader'
      }]
    }, {
      test: /\.(jpg|jpeg|png|svg|gif|woff2)$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 10000
        }
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
    stats: {
      assets: false,
      chunks: false,
      timings: true,
      version: false
    }
  },
  devtool: 'eval'
}
