import React, { Component } from 'react'

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
  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <Header />
          <Search />
          <Navigation />
          <Setup />
        </div>
      </MuiThemeProvider>
    )
  }
}

export default App