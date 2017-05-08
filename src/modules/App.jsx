import React, { Component } from 'react'

import { connect } from 'react-redux'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import RaisedButton from 'material-ui/RaisedButton'
// import { teal500, pink500 } from 'material-ui/styles/colors'

/*const muiTheme = getMuiTheme({
  palette: {
    primary1Color: teal500
  }
}, {userAgent: 'all'})*/
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
    const { linkTarget, searchTarget, hideAppsName, rememberBookmarksState, searchPredict, useHK, useFahrenheit, currentTheme, darkMode, customTheme } = props.settings
    const index = currentTheme ? currentTheme : 0
    let muiTheme
    if (index !== -1) {
      muiTheme = this.createTheme(themes[index].color)
    } else {
      muiTheme = this.createTheme(customTheme.color, customTheme.hue)
    }
    this.state = {
      linkTarget: linkTarget ? '_blank' : '_self',
      searchTarget: searchTarget ? '_blank' : '_self',
      hideAppsName,
      rememberBookmarksState,
      searchPredict,
      useHK,
      useFahrenheit,
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
      fontFamily: 'Roboto, Arial, 微软雅黑',
      palette: {
        primary1Color: color,
        settingsBackgroundColor: 'hsla(0, 0%, 98%, 1)'
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
    darkBaseTheme.fontFamily = 'Roboto, Arial, 微软雅黑'
    darkBaseTheme.palette = {
      ...darkBaseTheme.palette,
      primary1Color: '#546e7a',
      textColor: '#e2e4e4',
      settingsBackgroundColor: 'rgba(42, 42, 42, 1)'
    }
    darkBaseTheme.toggle = {
      thumbOnColor: '#32c5fa',
      thumbOffColor: '#fafafa',
      trackOnColor: '#265b6f',
      trackOffColor: '#646b6f'
    }
    return getMuiTheme(darkBaseTheme)
  }
  setLinkTarget = (bool) => {
    this.setState({
      linkTarget: bool ? '_blank' : '_self'
    })
  }
  setSearchTarget = (bool) => {
    this.setState({
      searchTarget: bool ? '_blank' : '_self'
    })
  }
  hideAppsName = (bool) => {
    this.setState({
      hideAppsName: bool
    })
  }
  rememberBookmarksState = (bool) => {
    this.setState({
      rememberBookmarksState: bool
    })
  }
  searchPredict = (bool) => {
    this.setState({
      searchPredict: bool
    })
  }
  useHK = (bool) => {
    this.setState({
      useHK: bool
    })
  }
  useFahrenheit = (bool) => {
    this.setState({
      useFahrenheit: bool
    })
  }
  changeTheme = data => {
    let theme
    if (typeof data === 'number') {
      theme = this.createTheme(themes[data].color)
    } else if (typeof data === 'object') {
      theme = this.createTheme(data.color, data.hue)
    } else {
      theme = this.createTheme(themes[0].color)
    }
    // console.log(theme)
    this.setState({
      muiTheme: theme
    })
    document.querySelector('#app').style.background = theme.paper.backgroundColor
  }
  darkMode = (bool) => {
    const { currentTheme, customTheme } = this.props.settings
    // console.log(this.darkTheme)
    if (bool) {
      this.setState({
        muiTheme: this.darkTheme
      })
      document.querySelector('#app').style.background = this.darkTheme.paper.backgroundColor
    } else {
      if (currentTheme !== -1) {
        this.changeTheme(currentTheme)
      } else if (customTheme) {
        this.changeTheme(customTheme)
      }
    }
  }
  render() {
    const { linkTarget, searchTarget, hideAppsName, rememberBookmarksState, searchPredict, useHK, useFahrenheit, muiTheme, onboarding } = this.state
    // console.log(muiTheme)
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <Header hideAppsName={hideAppsName} rememberBookmarksState={rememberBookmarksState} useFahrenheit={useFahrenheit} />
          <Search target={searchTarget} searchPredict={searchPredict} useHK={useHK} />
          <Navigation target={linkTarget} />
          <Settings
            setLinkTarget={this.setLinkTarget}
            setSearchTarget={this.setSearchTarget}
            hideAppsName={this.hideAppsName}
            rememberBookmarksState={this.rememberBookmarksState}
            searchPredict={this.searchPredict}
            useHK={this.useHK}
            useFahrenheit={this.useFahrenheit}
            changeTheme={this.changeTheme}
            darkMode={this.darkMode}
          />
          {onboarding && (
            <Onboarding />
          )}
        </div>
      </MuiThemeProvider>
    )
  }
}

const mapStateToProps = state => {
  const { data } = state.settings
  return { settings: data }
}

export default connect(mapStateToProps)(App)