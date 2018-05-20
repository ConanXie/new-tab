const path = require('path')
const webpack = require('webpack')

const context = path.resolve(__dirname, '../src')

module.exports = {
  context,
  entry: {
    index: './views/index',
    popup: './views/popup',
    settings: './views/settings',
    background: './views/background'
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.styl', '.css', '.jpg', '.png', '.svg', '.woff', '.woff2', '.gif'],
    alias: {
      config: path.join(context, 'config'),
      utils: path.join(context, 'utils'),
      stores: path.join(context, 'stores'),
      components: path.join(context, 'components')
    }
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
