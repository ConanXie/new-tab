import './style.less'

import React, { Component, PropTypes } from 'react'

import RaisedButton from 'material-ui/RaisedButton'
import MapsPlace from 'material-ui/svg-icons/maps/place'
import NavigationRefresh  from 'material-ui/svg-icons/navigation/refresh'

const style = {
  icon: {
    width: '18px',
    height: '18px',
    marginRight: '3px',
    color: '#fff'
  }
}

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
  calcWeek = (date) => {
    const weekArr = ['日', '一', '二', '三', '四', '五', '六']
    const week = new Date(date).getDay()
    return `周${weekArr[week]}`
  }
  render() {
    let Interface
    const { data } = this.state
    if (data) {
      Interface = (
        <div className="weather-interface">
          <header>
            <div className="now-info">
              <div className="now-tmp-sec">
                <h1 className="now-tmp">{data.now.tmp}°</h1>
                <p className="now-cond">{data.now.cond.txt}</p>
              </div>
              <p className="qlty">空气{data.aqi.city.qlty + ' '}{data.aqi.city.pm25}</p>
            </div>
            <div className="loc-info">
              <p className="loc-content">
                <MapsPlace style={style.icon} />
                <span>{data.basic.city}</span>
              </p>
              <p className="update-time">
                <NavigationRefresh style={style.icon} />
                <span>{String.prototype.split.call(data.basic.update.loc, ' ')[1]}</span>
              </p>
            </div>
          </header>
          <section className="now">
          </section>
          <section className="daily-forecast">
            {data.daily_forecast.map((value, index) => {
              const week = !index ? '今天' : this.calcWeek(value.date)
              return (
                <div className="forecast-box" key={value.date}>
                  <p title={value.date}>{week}</p>
                  <img src={`http://www.heweather.com/weather/images/icon/${value.cond.code_d}.png`} alt={value.cond.txt_d} />
                  {/*<p>{value.cond.txt_d}</p>*/}
                  <p>{value.tmp.min}°~{value.tmp.max}°</p>
                </div>
              )
            })}
          </section>
        </div>
      )
    }
    return (
      <div className="weather-component">
        {/*<RaisedButton
          label="weather"
          onTouchTap={this.getData}
        />
        <h1>Weather Component</h1>*/}
        {Interface}
      </div>
    )
  }
}

export default Weather