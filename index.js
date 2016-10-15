const webpack = require('webpack')
const config = require('./config/webpack.config')
const compiler = webpack(config)

const app = require('express')()
const https = require('https')
const fs = require('fs')
const port = 5001

const options = {
  key: fs.readFileSync('./cert/privatekey.pem'),
  cert: fs.readFileSync('./cert/certificate.pem')
}

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath,
  hot: true,
  stats: {
    colors: true
  },
  inline: true
}))

app.use(require('webpack-hot-middleware')(compiler))

app.use('/api/weather', (req, res) => {
  const data = fs.readFileSync('./api/weather.json', 'utf8')
  res.header('Access-Control-Allow-Origin', '*')
  res.send(data)
})

https.createServer(options, app).listen(port, () => {
  console.log(`Listening at https://localhost:${port}`)
})