import './style.less'

import moment from 'moment'

import classNames from 'classnames'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import muiThemeable from 'material-ui/styles/muiThemeable'
import RaisedButton from 'material-ui/RaisedButton'
import MapsPlace from 'material-ui/svg-icons/maps/place'
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh'
import ActionOpacity from 'material-ui/svg-icons/action/opacity'
import MapsNavigation from 'material-ui/svg-icons/maps/navigation'
import RefreshIndicator from 'material-ui/RefreshIndicator'
import SvgIcon from 'material-ui/SvgIcon'

const LeafIcon = props => {
  return (
    <SvgIcon {...props}>
      <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
    </SvgIcon>
  )
}

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
    this.state = {
      times: 1,
      base: 0,
      loading: true,
      empty: false,
      emptyText: ''
    }
    /*const local = JSON.parse(localStorage.getItem('weather'))
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
    }*/
  }
  componentWillMount() {
    const { intl } = this.context
    const local = JSON.parse(localStorage.getItem('weather'))
    if (local) {
      const lastUpdate = new Date(local.basic.update).getTime()
      const now = Date.now()
      const diff = now - lastUpdate
      if (diff < 3600000) {
        if (local.basic) {
          this.setState({
            loading: false,
            data: local
          })
        } else {
          this.setState({
            loading: false,
            empty: true,
            emptyText: intl.formatMessage({ id: 'weather.empty.noData' })
          })
        }
      } else {
        this.getData()
      }
    } else {
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
  responseHandler = res => {
    const { intl } = this.context
    if (res.ok) {
      res.json().then(data => {
        // 天气数据获取成功
        if (data.status === 'OK') {
          const result = data.result[0]
          result.basic.update = Date.now()
          this.setState({
            loading: false,
            data: result
          })
          localStorage.setItem('weather', JSON.stringify(result))
        } else {
          this.setState({
            loading: false,
            empty: true,
            emptyText: intl.formatMessage({ id: 'weather.empty.noData' })
          })
          // 防止请求不到数据而过度请求
          const temp = {
            basic: {
              update: Date.now()
            }
          }
          localStorage.setItem('weather', JSON.stringify(temp))
        }
      })
    } else {
      console.error(`Response wasn't perfect, got status ${res.status}`)
      this.setState({
        loading: false,
        empty: true,
        emptyText: intl.formatMessage({ id: 'weather.empty.requestError' })
      })
    }
  }
  responseError = err => {
    const { intl } = this.context

    console.error('Fetch failed!')

    this.setState({
      loading: false,
      empty: true,
      emptyText: intl.formatMessage({ id: 'weather.empty.requestError' })
    })
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
    const { intl } = this.context

    navigator.geolocation.getCurrentPosition(pos => {
      const lat = pos.coords.latitude.toFixed(6)
      const lng = pos.coords.longitude.toFixed(6)
      fetch(`https://tab.xiejie.co/api/weather/v4/${lat},${lng}`).then(this.responseHandler, this.responseError)
      // fetch(`http://localhost:5300/api/weather/v4/${lat},${lng}`).then(this.responseHandler, this.responseError)
    }, error => {
      let emptyText
      switch (error.code) {
        case 0:
          emptyText = intl.formatMessage({ id: 'weather.empty.geolocationError' }) + error.message
          break
        case 1:
          emptyText = intl.formatMessage({ id: 'weather.empty.geolocationClosed' })
          break
        case 2:
          emptyText = intl.formatMessage({ id: 'weather.empty.geolocationEmpty' })
          break
        case 3:
          emptyText = intl.formatMessage({ id: 'weather.empty.geolocationTimeout' })
          break
      }
      if (navigator.language === 'zh-CN') {
        fetch(`https://tab.xiejie.co/api/weather/v4`).then(this.responseHandler, this.responseError)
        // fetch(`http://localhost:5300/api/weather/v4`).then(this.responseHandler, this.responseError)
      } else {
        this.setState({
          loading: false,
          empty: true,
          emptyText
        })
      }
    }, { maximumAge: 60000, timeout: 3000 })
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
    const { data, times, base, loading, empty, emptyText } = this.state
    const { primary1Color, alternateTextColor } = this.props.muiTheme.palette
    const { intl } = this.context
    return (
      <div className={classNames('weather-component', { 'empty': empty })}>
        {empty && (
          <p className="empty-text">{emptyText}</p>
        )}
        {/*Weather data exist*/}
        {data && (
          <div className="weather-interface" style={{ backgroundColor: primary1Color, color: alternateTextColor }}>
            <header>
              <div className="now-info">
                <div className="now-tmp-sec">
                  <h1 className="now-tmp">{(data.now.temp * times + base).toFixed(0)}°</h1>
                  <p className="now-cond">{data.now.text}</p>
                </div>
                <div className="state">
                  {data.aqi && (
                    <p className="qlty">
                      <LeafIcon color={alternateTextColor} style={style.icon} />
                      <span></span>{data.aqi.city.qlty + ' '}{data.aqi.city.pm25}
                    </p>
                  )}
                  <p className="humidity">
                    <ActionOpacity color={alternateTextColor} style={style.icon} />
                    <span>{intl.formatMessage({ id: 'weather.humidity' })} {data.now.humidity}%</span>
                  </p>
                  <p className="wind">
                    <MapsNavigation color={alternateTextColor} style={{...style.icon, transform: `rotate(${180 + data.now.wind.direction * 1}deg)`}} />
                    <span>{data.now.wind.speed} km/h</span>
                  </p>
                </div>
              </div>
              <div className="loc-info">
                <p className="loc-content">
                  <MapsPlace color={alternateTextColor} style={style.icon} />
                  <span>{data.basic.city}</span>
                </p>
                <p className="update-time">
                  <NavigationRefresh color={alternateTextColor} style={style.icon} />
                  <span>{moment(data.basic.update).format('HH:mm')}</span>
                </p>
              </div>
            </header>
            <section className="now">
            </section>
            <section className="daily-forecast">
              {data.forecast.map((value, index) => {
                const week = this.calcWeek(value.date)
                return (
                  <div className="forecast-box" key={value.date}>
                    <p title={value.date}>{week}</p>
                    <div className={`weather-icon code-${value.code}`} title={value.text}></div>
                    {/*<img src={`http://files.heweather.com/cond_icon/${value.cond.code_d}.png`} alt={value.cond.txt_d} />*/}
                    {/*<p>{value.cond.txt_d}</p>*/}
                    <p>
                      <span className="high">{(value.high * times + base).toFixed(0)}°</span>
                      <span className="low">{(value.low * times + base).toFixed(0)}°</span>
                    </p>
                  </div>
                )
              })}
            </section>
          </div>
        )}
        {/*Loading*/}
        {loading && (
          <RefreshIndicator
            size={40}
            left={280}
            top={160}
            loadingColor={this.props.muiTheme.palette.primary1Color}
            status="loading"
            style={style.refresh}
          />
        )}
      </div>
    )
  }
}

export default muiThemeable()(Weather)