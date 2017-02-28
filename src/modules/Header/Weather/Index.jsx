import './style.less'

import React, { Component, PropTypes } from 'react'

import RaisedButton from 'material-ui/RaisedButton'
import MapsPlace from 'material-ui/svg-icons/maps/place'
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh'
import RefreshIndicator from 'material-ui/RefreshIndicator'

const style = {
  icon: {
    width: '18px',
    height: '18px',
    marginRight: '3px',
    color: '#fff'
  },
  refresh: {
    display: 'inline-block',
    position: 'relative'
  }
}

class Weather extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired
  }
  constructor(props) {
    super(props)
    const local = JSON.parse(localStorage.getItem('weather'))
    if (local) {
      const lastUpdate = new Date(local.basic.update.loc).getTime()
      const now = Date.now()
      const diff = now - lastUpdate
      if (diff < 3600000) {
        this.state = {
          data: local
        }
      } else {
        this.state = {
          times: 1,
          base: 0
        }
        this.getData()
      }
    } else {
      this.state = {
        times: 1,
        base: 0
      }
      this.getData()
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.useFahrenheit) {
      this.setState({
        times: 1.8,
        base: 32
      })
    } else {
      this.setState({
        times: 1,
        base: 0
      })
    }
  }
  getData = () => {
    // 'https://api.heweather.com/x3/weather?cityid=CN101280601&key=258c581b778d440ab34a85d5c8d82902'
    // const link = 'http://localhost:5300/api/weather'
    /*const link = 'https://tab.xiejie.co/api/weather'
    fetch(link).then(res => {
      if (res.ok) {
        res.json().then(data => {
          this.setState({
            data
          })
          localStorage.setItem('weather', JSON.stringify(data))
        })
      } else {
        console.log(`Response wasn't perfect, got status ${res.status}`)
      }
    }, e => {
      console.log('Fetch failed!')
    })*/
    navigator.geolocation.getCurrentPosition(pos => {
      const lat = pos.coords.latitude.toFixed(6)
      const lng = pos.coords.longitude.toFixed(6)
      fetch(`https://tab.xiejie.co/api/weather/v2/${lat},${lng}`).then(res => {
        if (res.ok) {
          res.json().then(data => {
            this.setState({ data })
            localStorage.setItem('weather', JSON.stringify(data))
          })
        } else {
          console.error(`Response wasn't perfect, got status ${res.status}`)
        }
      }, e => {
        console.error('Fetch failed!')
      })
    })
  }
  calcWeek = (date) => {
    const { intl } = this.context
    const weekArr = [
      intl.formatMessage({ id: 'weather.week.Sunday' }),
      intl.formatMessage({ id: 'weather.week.Monday' }),
      intl.formatMessage({ id: 'weather.week.Tuesday' }),
      intl.formatMessage({ id: 'weather.week.Wednesday' }),
      intl.formatMessage({ id: 'weather.week.Thurday' }),
      intl.formatMessage({ id: 'weather.week.Friday' }),
      intl.formatMessage({ id: 'weather.week.Saturday' })
    ]
    const week = new Date(date).getDay()
    // return `周${weekArr[week]}`
    return weekArr[week]
  }
  render() {
    let Interface
    let Qlty
    const { data, times, base } = this.state
    const { intl } = this.context
    if (data) {
      if (data.aqi) {
        Qlty = (
          <p className="qlty">{intl.formatMessage({ id: 'weather.air' })}{data.aqi.city.qlty + ' '}{data.aqi.city.pm25}</p>
        )
      }
      Interface = (
        <div className="weather-interface" style={{ backgroundColor: this.props.muiTheme.palette.primary1Color }}>
          <header>
            <div className="now-info">
              <div className="now-tmp-sec">
                <h1 className="now-tmp">{(data.now.tmp * times + base).toFixed(0)}°</h1>
                <p className="now-cond">{data.now.cond.txt}</p>
              </div>
              {Qlty}
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
              const week = this.calcWeek(value.date)
              return (
                <div className="forecast-box" key={value.date}>
                  <p title={value.date}>{week}</p>
                  <div className={`weather-icon code-${value.cond.code_d}`} title={value.cond.txt_d}></div>
                  {/*<img src={`http://files.heweather.com/cond_icon/${value.cond.code_d}.png`} alt={value.cond.txt_d} />*/}
                  {/*<p>{value.cond.txt_d}</p>*/}
                  <p>{(value.tmp.min * times + base).toFixed(0)}°~{(value.tmp.max * times + base).toFixed(0)}°</p>
                </div>
              )
            })}
          </section>
        </div>
      )
    } else {
      Interface = (
        <RefreshIndicator
          size={40}
          left={280}
          top={160}
          loadingColor='#009688'
          status="loading"
          style={style.refresh}
        />
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