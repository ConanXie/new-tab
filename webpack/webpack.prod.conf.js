const path = require('path')
const webpack = require('webpack')

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
      'react-redux',
      'redux',
      'redux-thunk',
      'react-intl',
      'classnames'
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.less', '.css', '.jpg', '.png', '.svg', '.woff2', '.gif'],
    alias: {
      '@': path.join(__dirname, '../src')
    }
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'bundle.min.js'
  },
  module: {
    rules: [{
      test: /\.js(x)?$/,
      exclude: /node_modules/,
      use: [{
        loader: 'babel-loader'
      }]
    }, {
      test: /\.less$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader', 'less-loader']
      })
    }, {
      test: /\.(jpg|jpeg|png|svg|gif|woff2)$/,
      use: ['url-loader?limit=10240&name=assets/[name].[ext]']
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/(en|zh-cn|zh-tw)$/),
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
