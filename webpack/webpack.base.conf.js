const path = require('path')
const webpack = require('webpack')

module.exports = {
  context: path.resolve(__dirname, '../src'),
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.styl', '.css', '.jpg', '.png', '.svg', '.woff', '.woff2', '.gif']
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      exclude: /node_modules/,
      loader: 'awesome-typescript-loader'
    }, {
      test: /\.(css|styl)$/,
      use: [{
        loader: 'style-loader',
      }, {
        loader: 'css-loader',
        options: {
          sourceMap: true
        }
      }, {
        loader: 'stylus-loader'
      }]
    }, {
      test: /\.(jpe?g|png|svg|gif)$/,
      loader: 'url-loader',
      options: {
        name: 'images/[name].[ext]'
      }
    }, {
      test: /\.(woff2?|eot|ttf|otf)$/,
      loader: 'file-loader',
      options: {
        name: 'fonts/[name].[ext]'
      }
    }]
  }
}
