const path = require('path')
const webpack = require('webpack')

const dir_src = path.resolve(__dirname, '../src')
const buildPath = path.resolve(__dirname, '../dist')
const node_modules = path.resolve(__dirname, '../node_modules')

module.exports = {
  context: path.resolve(__dirname, '../src'),
  entry: [
    'react-hot-loader/patch',
    'babel-polyfill',
    'webpack/hot/only-dev-server',
    'webpack-hot-middleware/client?path=https://localhost:5001/__webpack_hmr',
    './Main.jsx'
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  },
  output: {
    path: buildPath,
    publicPath: 'https://localhost:5001/',
    filename: 'bundle.js'
  },
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: ['es2015', 'react', 'stage-0'],
          plugins: ['react-hot-loader/babel']
        }
      }]
    }, {
      test: /\.less$/,
      use: ['style-loader', 'css-loader?sourceMap', 'less-loader']
    }, {
      test: /\.(jpg|jpeg|png|svg|gif|woff2)$/,
      use: ['url-loader?limit=10000']
    }]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  devtool: 'source-map'
}