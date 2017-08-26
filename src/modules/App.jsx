import React, { Component } from 'react'

import { connect } from 'react-redux'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import RaisedButton from 'material-ui/RaisedButton'

import { code } from '../config'
import { themes } from './Settings/Theme'

import LazilyLoad, { importLazy } from '@/scripts/LazilyLoad'
/* import Header from './Header'
import Search from './Search'
import Navigation from './Navigation'
import Settings from './Settings'
import Onboarding from './Onboarding' */

class App extends Component {
  constructor(props) {
    super(props)
    
    const {
      currentTheme,
      darkMode,
      customTheme
    } = props.settings
    
    // Create dark theme at first
    this.darkTheme = this.createDarkTheme()
    let muiTheme
    const index = currentTheme ? currentTheme : 0
    // Night mode
    if (darkMode) {
      muiTheme = this.darkTheme
    } else {
      // Use default themes
      if (index !== -1) {
        muiTheme = this.createTheme(themes[index].color)
      } else {
        // Use custom theme
        muiTheme = this.createTheme(customTheme.color, customTheme.hue)
      }
    }
    this.state = {
      darkMode,
      muiTheme
    }
  }
  componentDidMount() {
    if (!this.state.darkMode) {
      this.changeBackground()
    } else {
      this.setBackground(this.darkTheme.paper.backgroundColor)
    }

    const _code = localStorage.getItem('code')
    if (_code !== code) {
      this.setState({
        onboarding: true
      })
    }
    
    chrome.runtime.setUninstallURL('https://conanxie.typeform.com/to/I5WmdT')
    
    const errHandler = e => console.error(e)
    // Save bing wallpaper to temporary file system when user installed the extension
    window.webkitRequestFileSystem(window.TEMPORARY, 10 * 1024 * 1024, fs => {
      fs.root.getFile('wallpaper.jpg', { create: false }, () => {}, err => {
        fs.root.getFile('wallpaper.jpg', { create: true }, fileEntry => {
          fetch(`https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=${navigator.language}`, { credentials: 'include' }).then(res => {
            if (res.ok) {
              return res.json()
            }
          }).then(data => {
            const imageUrl = 'https://www.bing.com' + data.images[0].url
            fetch(imageUrl).then(res => {
              if (res.ok) {
                return res.blob()
              }
            }).then(data => {
              fileEntry.createWriter(fileWriter => {
                let truncated = false
                fileWriter.onerror = errHandler
                fileWriter.onwriteend = function () {
                  if (!truncated) {
                    truncated = true
                    this.truncate(this.position)
                    return
                  }
                }
                fileWriter.write(data)
              }, errHandler)
            }).catch(errHandler)
          }).catch(errHandler)
        }, errHandler)
      })
    }, errHandler)
  }
  createTheme = (color, hue) => {
    const theme = {
      fontFamily: 'Roboto, Microsoft Yahei',
      palette: {
        primary1Color: color,
        settingsBackgroundColor: 'hsla(0, 0%, 95%, 1)'
      }
    }
    if (hue === 'bright') {
      theme.palette.alternateTextColor = '#303030'
      theme.snackbar = {
        textColor: '#ffffff'
      }
    }
    return getMuiTheme(theme)
  }
  createDarkTheme = () => {
    darkBaseTheme.fontFamily = 'Roboto, Microsoft Yahei'
    darkBaseTheme.palette = {
      ...darkBaseTheme.palette,
      primary1Color: '#607d8b',
      textColor: '#e2e4e4',
      alternateTextColor: '#e2e4e4',
      settingsBackgroundColor: 'rgba(42, 42, 42, 1)'
    }
    darkBaseTheme.toggle = {
      thumbOnColor: '#32c5fa',
      thumbOffColor: '#fafafa',
      trackOnColor: '#265b6f',
      trackOffColor: '#646b6f'
    }
    darkBaseTheme.snackbar = {
      textColor: '#333'
    }
    return getMuiTheme(darkBaseTheme)
  }
  componentWillReceiveProps(nextProps) {
    // console.log(this.props, nextProps)
    const { currentTheme, darkMode, customTheme, background, backgroundSource, backgroundColor, blurRadius } = nextProps.settings
    if (currentTheme !== this.props.settings.currentTheme || (currentTheme === -1 && (customTheme.color !== this.props.settings.customTheme.color || customTheme.hue !== this.props.settings.customTheme.hue))) {
      setTimeout(() => {
        this.changeTheme(currentTheme)
      }, 0)
    }
    if (darkMode !== this.props.settings.darkMode) {
      this.darkMode(darkMode)
    }
    if ((background !== this.props.settings.background) || (backgroundSource !== this.props.settings.backgroundSource) || (backgroundColor !== this.props.settings.backgroundColor) || (blurRadius !== this.props.settings.blurRadius)) {
      setTimeout(() => {
        this.changeBackground()
      }, 0)
    }
  }
  changeTheme = (index = 0) => {
    let theme
    if (index === -1) {
      const { color, hue } = this.props.settings.customTheme
      theme = this.createTheme(color, hue)
    } else {
      theme = this.createTheme(themes[index].color)
    }
    this.setState({
      muiTheme: theme
    })
    this.changeBackground()
  }
  changeBackground() {
    const { background, backgroundSource, backgroundColor, blurRadius, maskStrength } = this.props.settings
    let color
    let image
    let mask
    if (background) {
      if (backgroundSource === undefined || backgroundSource === 1 || backgroundSource === 2) {
        image = `url(filesystem:chrome-extension://${chrome.app.getDetails().id}/temporary/wallpaper${blurRadius ? '-blur' : ''}.jpg?r=${Date.now()})`
      } else if (backgroundSource === 3 && backgroundColor) {
        color = backgroundColor
      } else {
        color = '#333'
      }
      mask = maskStrength
    }
    this.setBackground(color, image, mask)
  }
  setBackground(color = '#fff', image = 'none', strength = 0) {
    const bg = document.querySelector('#bg')
    bg.style.backgroundColor = color
    bg.style.backgroundImage = image
    document.querySelector('#mask').style.backgroundColor = `rgba(0, 0, 0, ${strength})`
  }
  darkMode = bool => {
    const { currentTheme, customTheme } = this.props.settings
    if (bool) {
      this.setState({
        muiTheme: this.darkTheme
      })
      this.setBackground(this.darkTheme.paper.backgroundColor)
    } else {
      this.changeTheme(currentTheme)
    }
  }
  render() {
    const { muiTheme, onboarding } = this.state
    const { hideWebsites, hideSearch } = this.props.settings

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <div id="bg"></div>
          <div id="mask"></div>
          <LazilyLoad modules={{
            Header: () => importLazy(import('./Header'))
          }}>
            {({ Header }) => {
              return <Header />
            }}
          </LazilyLoad>
          {/* <Header />
          {!hideSearch && (
            <Search />
          )}
          {!hideWebsites && (
            <Navigation />
          )}
          <Settings />
          {onboarding && (
            <Onboarding />
          )} */}
        </div>
      </MuiThemeProvider>
    )
  }
}

const mapStateToProps = state => {
  const { settings } = state
  return { settings }
}

export default connect(mapStateToProps)(App)
