// process.traceDeprecation = true
process.noDeprecation = true

const path = require('path')
const webpack = require('webpack')

module.exports = {
  context: path.resolve(__dirname, '../src'),
  entry: [
    'babel-polyfill',
    'react-hot-loader/patch',
    'webpack/hot/only-dev-server',
    'webpack-hot-middleware/client?path=https://localhost:5001/__webpack_hmr',
    './Main.jsx'
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.less', '.css', '.jpg', '.png', '.svg', '.woff2', '.gif']
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: 'https://localhost:5001/',
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
  devtool: 'eval'
}