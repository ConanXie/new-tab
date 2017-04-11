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
import { code } from '../config'
import { themes } from './Setup'

import Header from './Header'
import Search from './Search'
import Navigation from './Navigation'
import Setup from './Setup'
import Onboarding from './Onboarding'


class App extends Component {
  constructor(props) {
    super(props)
    const { linkTarget, searchTarget, hideAppsName, rememberBookmarksState, searchPredict, useHK, useFahrenheit, currentTheme, darkMode } = props.settings
    const index = currentTheme ? currentTheme : 0
    this.state = {
      linkTarget: linkTarget ? '_blank' : '_self',
      searchTarget: searchTarget ? '_blank' : '_self',
      hideAppsName,
      rememberBookmarksState,
      searchPredict,
      useHK,
      useFahrenheit,
      darkMode,
      muiTheme: this.createTheme(themes[index])
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
  createTheme = (color) => {
    return getMuiTheme({
      fontFamily: 'Roboto, Arial, 微软雅黑',
      palette: {
        primary1Color: color,
        settingsBackgroundColor: 'hsla(0, 0%, 98%, 1)'
      }
    })
  }
  createDarkTheme = () => {
    darkBaseTheme.palette.primary1Color = '#546e7a'
    darkBaseTheme.palette.textColor = '#e2e4e4'
    darkBaseTheme.palette.settingsBackgroundColor = 'rgba(42, 42, 42, 1)'
    darkBaseTheme.fontFamily = 'Roboto, Arial, 微软雅黑'
    darkBaseTheme.toggle = {}
    darkBaseTheme.toggle.thumbOnColor = '#32c5fa'
    darkBaseTheme.toggle.thumbOffColor = '#fafafa'
    darkBaseTheme.toggle.trackOnColor = '#265b6f'
    darkBaseTheme.toggle.trackOffColor = '#646b6f'
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
  changeTheme = (index) => {
    const theme = this.createTheme(themes[index])
    // console.log(theme)
    this.setState({
      muiTheme: theme
    })
    document.querySelector('#app').style.background = theme.paper.backgroundColor
  }
  darkMode = (bool) => {
    const { currentTheme } = this.props.settings
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
    const { linkTarget, searchTarget, hideAppsName, rememberBookmarksState, searchPredict, useHK, useFahrenheit, muiTheme, onboarding } = this.state
    // console.log(muiTheme)
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <Header hideAppsName={hideAppsName} rememberBookmarksState={rememberBookmarksState} useFahrenheit={useFahrenheit} muiTheme={muiTheme} />
          <Search target={searchTarget} searchPredict={searchPredict} useHK={useHK} muiTheme={muiTheme} />
          <Navigation target={linkTarget} muiTheme={muiTheme} />
          <Setup
            setLinkTarget={this.setLinkTarget}
            setSearchTarget={this.setSearchTarget}
            hideAppsName={this.hideAppsName}
            rememberBookmarksState={this.rememberBookmarksState}
            searchPredict={this.searchPredict}
            useHK={this.useHK}
            useFahrenheit={this.useFahrenheit}
            changeTheme={this.changeTheme}
            darkMode={this.darkMode}
            muiTheme={muiTheme}
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