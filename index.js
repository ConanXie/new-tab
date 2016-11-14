const webpack = require('webpack')
const config = require('./config/webpack.config')
const compiler = webpack(config)

const app = require('express')()
const https = require('https')
const fs = require('fs')
const request = require('request')
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

app.get('/api/weather', (req, res) => {
  const file = fs.readFileSync('./api/weather.json', 'utf8')
  const data = JSON.parse(file)
  res.header('Access-Control-Allow-Origin', '*')
  res.send(data.HeWeather5[0])
})

app.get('/api/position/:latitude/:longitude', (req, res) => {
  const { latitude, longitude } = req.params
  request(`http://api.map.baidu.com/telematics/v3/reverseGeocoding?location=${longitude},${latitude}&coord_type=wgs84&ak=v4Wf3i6LQtNU0CvL3fScxzIx&output=json`, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      res.header('Access-Control-Allow-Origin', '*')
      res.send(body)
    }
  })
})

https.createServer(options, app).listen(port, () => {
  console.log(`Listening at https://localhost:${port}`)
})