const path = require('path')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const config = require('./webpack.config')
const compiler = webpack(config)

const server = new WebpackDevServer(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath,
  hot: true,
  stats: {
    colors: true
  },
  inline: true
})

server.use(require('webpack-hot-middleware')(compiler))

const port = 5001
server.listen(port, e => {
  if (e) return
  console.log(`Listening at http://localhost:${port}`)
})