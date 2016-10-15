import './style.less'

import React, { Component, PropTypes } from 'react'

import RaisedButton from 'material-ui/RaisedButton'

class Weather extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.getData()
  }
  getData = () => {
    // console.log(123)
    // 'https://api.heweather.com/x3/weather?cityid=CN101280601&key=258c581b778d440ab34a85d5c8d82902'
    const link = 'https://localhost:5001/api/weather'
    fetch(link).then(res => {
      if (res.ok) {
        res.json().then(data => {
          console.log(data['HeWeather data service 3.0'][0])
          this.setState({
            data: data['HeWeather data service 3.0'][0]
          })
        })
      } else {
        console.log(`Response wasn't perfect, got status ${res.status}`)
      }
    }, e => {
      console.log('Fetch failed!')
    })
  }
  render() {
    let Interface
    const { data } = this.state
    if (data) {
      Interface = (
        <div className="weather-interface">
          <header>
            <h3>{data.basic.city}</h3>
            <p>{data.basic.update.loc}</p>
          </header>
          <section className="now">
            <h1>{data.now.tmp}°</h1>
            <p>{data.now.cond.txt}</p>
            <p>空气{data.aqi.city.qlty} {data.aqi.city.pm25}</p>
          </section>
          <section className="daily-forecast">
            {data.daily_forecast.map(value => {
              return (
                <div className="forecast-box">
                  <p>{value.date}</p>
                  <p>{value.cond.txt_d}</p>
                  <p>{value.tmp.min}° ~ {value.tmp.max}°</p>
                </div>
              )
            })}
          </section>
        </div>
      )
    }
    return (
      <div className="weather-component">
        <RaisedButton
          label="weather"
          onTouchTap={this.getData}
        />
        <h1>Weather Component</h1>
        {Interface}
      </div>
    )
  }
}

export default Weather