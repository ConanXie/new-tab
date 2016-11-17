import React, { Component } from 'react'

import { connect } from 'react-redux'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import RaisedButton from 'material-ui/RaisedButton'
import { teal500 } from 'material-ui/styles/colors'

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: teal500
  }
}, {userAgent: 'all'})

import Header from './Header'
import Search from './Search'
import Navigation from './Navigation'
import Setup from './Setup'

class App extends Component {
  constructor(props) {
    super(props)
    const { linkTarget, searchTarget } = props.settings
    this.state = {
      linkTarget: linkTarget ? '_blank' : '_self',
      searchTarget: searchTarget ? '_blank' : '_self'
    }
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
  render() {
    const { linkTarget, searchTarget } = this.state
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <Header />
          <Search target={searchTarget} />
          <Navigation target={linkTarget} />
          <Setup setLinkTarget={this.setLinkTarget} setSearchTarget={this.setSearchTarget} />
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