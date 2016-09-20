const path = require('path')
const webpack = require('webpack')

const dir_src = path.resolve(__dirname, '../src')
const buildPath = path.resolve(__dirname, '../dist')
const node_modules = path.resolve(__dirname, '../node_modules')

const ExtractTextPlugin = require("extract-text-webpack-plugin")

module.exports = {
  entry: {
    app: [
      'babel-polyfill',
      path.resolve(dir_src, 'Main.jsx')
    ],
    vendors: [
      'react',
      'react-dom',
      'react-tap-event-plugin',
      'react-redux',
      'redux',
      'redux-thunk'
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx', 'less', 'css', '.jpg', '.png']
  },
  output: {
    path: buildPath,
    filename: 'bundle.min.js'
  },
  module: {
    loaders: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loaders: ['babel?presets[]=es2015&presets[]=react&presets[]=stage-0&plugins[]=react-hot-loader/babel']
    }, {
      test: /\.less$/,
      loader: ExtractTextPlugin.extract('style', 'css!less')
    }, {
      test: /\.(jpg|jpeg|png|svg|gif)$/,
      loader: 'url?limit=2048&name=images/[name].[ext]'
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.min.js'),
    new ExtractTextPlugin('style.min.css')
  ],
  stats: {
    colors: true
  }
}