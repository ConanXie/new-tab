const path = require('path')
const webpack = require('webpack')

const dir_src = path.resolve(__dirname, '../src')
const buildPath = path.resolve(__dirname, '../dist')
const node_modules = path.resolve(__dirname, '../node_modules')

const ExtractTextPlugin = require("extract-text-webpack-plugin")

module.exports = {
  context: path.resolve(__dirname, '../src'),
  entry: {
    app: [
      'babel-polyfill',
      './Main.jsx'
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
    extensions: ['.js', '.jsx', '.less', '.css', '.jpg', '.png']
  },
  output: {
    path: buildPath,
    filename: 'bundle.min.js'
  },
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: ['es2015', 'react', 'stage-0']
        }
      }]
    }, {
      test: /\.less$/,
      use: ExtractTextPlugin.extract({
        fallbackLoader: 'style-loader',
        loader: ['css-loader', 'less-loader']
      })
    }, {
      test: /\.(jpg|jpeg|png|svg|gif|woff2)$/,
      use: ['url-loader?limit=2048&name=assets/[name].[ext]']
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors',
      filename: 'vendors.min.js'
    }),
    new ExtractTextPlugin('style.min.css')
  ],
  stats: {
    colors: true
  }
}