const path = require('path')
const webpack = require('webpack')

const dir_src = path.resolve(__dirname, '../src')
const buildPath = path.resolve(__dirname, '../dist')
const node_modules = path.resolve(__dirname, '../node_modules')

module.exports = {
  entry: [
    'react-hot-loader/patch',
    'babel-polyfill',
    'webpack/hot/only-dev-server',
    'webpack-hot-middleware/client?path=https://localhost:5001/__webpack_hmr',
    path.resolve(dir_src, 'Main.jsx')
  ],
  resolve: {
    extensions: ['', '.js', '.jsx', 'less', 'css', '.jpg', '.png']
  },
  output: {
    path: buildPath,
    publicPath: 'https://localhost:5001/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loaders: ['babel?presets[]=es2015&presets[]=react&presets[]=stage-0&plugins[]=react-hot-loader/babel']
    }, {
      test: /\.less$/,
      loader: 'style!css?sourceMap!less?sourceMap=source-map-less-inline'
    }, {
      test: /\.(jpg|jpeg|png|svg|gif|woff2)$/,
      loader: 'url?limit=10000'
    }]
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  devtool: 'source-map'
}