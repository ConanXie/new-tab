import React, { Component } from 'react'

import { connect } from 'react-redux'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import RaisedButton from 'material-ui/RaisedButton'

import { code } from '../configs'
import { themes } from './Settings/Theme'

import Header from './Header'
import Search from './Search'
import Navigation from './Navigation'
import Settings from './Settings'
import Onboarding from './Onboarding'


class App extends Component {
  constructor(props) {
    super(props)
    
    const {
      currentTheme,
      darkMode,
      customTheme
    } = props.settings

    const index = currentTheme ? currentTheme : 0
    let muiTheme
    if (index !== -1) {
      muiTheme = this.createTheme(themes[index].color)
    } else {
      muiTheme = this.createTheme(customTheme.color, customTheme.hue)
    }
    this.state = {
      darkMode,
      muiTheme
    }
  }
  componentWillMount() {
    const _code = localStorage.getItem('code')
    if (_code !== code) {
      this.setState({
        onboarding: true
      })
    }
    const { darkMode, muiTheme } = this.state

    this.changeBackground()
    
    this.darkTheme = this.createDarkTheme()
    // console.log(this.darkTheme)
    if (darkMode) {
      this.darkMode(true)
    }
  }
  componentDidMount() {
    chrome.runtime.setUninstallURL('https://conanxie.typeform.com/to/I5WmdT')
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
      primary1Color: '#546e7a',
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
    const { currentTheme, darkMode, customTheme, background, backgroundSource, backgroundColor } = nextProps.settings
    if (currentTheme !== this.props.settings.currentTheme || (currentTheme === -1 && (customTheme.color !== this.props.settings.customTheme.color || customTheme.hue !== this.props.settings.customTheme.hue))) {
      setTimeout(() => {
        this.changeTheme(currentTheme)
      }, 0)
    }
    if (darkMode !== this.props.settings.darkMode) {
      this.darkMode(darkMode)
    }
    if ((background !== this.props.settings.background) || (backgroundSource !== this.props.settings.backgroundSource) || (backgroundColor !== this.props.settings.backgroundColor)) {
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
    const { background, backgroundSource, backgroundColor } = this.props.settings

    if (background && backgroundSource === 3 && backgroundColor) {
      // Set background with solid color
      document.querySelector('#app').style.background = backgroundColor
    } else {
      document.querySelector('#app').style.background = '#fff'
    }

  }
  darkMode = bool => {
    const { currentTheme, customTheme } = this.props.settings
    if (bool) {
      this.setState({
        muiTheme: this.darkTheme
      })
      document.querySelector('#app').style.background = this.darkTheme.paper.backgroundColor
    } else {
      this.changeTheme(currentTheme)
    }
  }
  render() {
    const { muiTheme, onboarding } = this.state
    const { hideWebsites } = this.props.settings

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <Header />
          <Search />
          {!hideWebsites && (
            <Navigation />
          )}
          <Settings />
          {onboarding && (
            <Onboarding />
          )}
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
