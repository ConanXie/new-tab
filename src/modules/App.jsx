import React, { Component } from 'react'

import { connect } from 'react-redux'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import RaisedButton from 'material-ui/RaisedButton'
// import { teal500, pink500 } from 'material-ui/styles/colors'

/*const muiTheme = getMuiTheme({
  palette: {
    primary1Color: teal500
  }
}, {userAgent: 'all'})*/
import { theme } from './Setup'

import Header from './Header'
import Search from './Search'
import Navigation from './Navigation'
import Setup from './Setup'

class App extends Component {
  constructor(props) {
    super(props)
    const { linkTarget, searchTarget, hideAppsName, currentTheme } = props.settings

    this.state = {
      linkTarget: linkTarget ? '_blank' : '_self',
      searchTarget: searchTarget ? '_blank' : '_self',
      hideAppsName,
      muiTheme: this.createTheme(theme[currentTheme])
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
  changeTheme = (index) => {
    this.setState({
      muiTheme: this.createTheme(theme[index])
    })
  }
  render() {
    const { linkTarget, searchTarget, hideAppsName, muiTheme } = this.state
    // console.log(muiTheme)
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <Header hideAppsName={hideAppsName} muiTheme={muiTheme} />
          <Search target={searchTarget} />
          <Navigation target={linkTarget} muiTheme={muiTheme} />
          <Setup
            setLinkTarget={this.setLinkTarget}
            setSearchTarget={this.setSearchTarget}
            hideAppsName={this.hideAppsName}
            changeTheme={this.changeTheme}
            muiTheme={muiTheme}
          />
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