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
import { theme } from './Setup'

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
      muiTheme: this.createTheme(theme[index])
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
    if (this.state.darkMode) {
      this.setState({
        muiTheme: getMuiTheme(darkBaseTheme)
      })
    }
  }
  createTheme = (color) => {
    return getMuiTheme({
      fontFamily: 'Roboto, 微软雅黑',
      palette: {
        primary1Color: color
      }
    }, { userAgent: 'all' })
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
    this.setState({
      muiTheme: this.createTheme(theme[index])
    })
    this.theme = this.state.muiTheme
  }
  darkMode = (bool) => {
    /*this.setState({
      darkMode: bool
    })*/
    if (bool) {
      this.setState({
        muiTheme: getMuiTheme(darkBaseTheme)
      })
    } else {
      this.changeTheme(this.props.settings.currentTheme)
    }
  }
  render() {
    const { linkTarget, searchTarget, hideAppsName, rememberBookmarksState, searchPredict, useHK, useFahrenheit, muiTheme, onboarding } = this.state
    // console.log(muiTheme)
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <Header hideAppsName={hideAppsName} rememberBookmarksState={rememberBookmarksState} useFahrenheit={useFahrenheit} muiTheme={muiTheme} />
          <Search target={searchTarget} searchPredict={searchPredict} useHK={useHK} />
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