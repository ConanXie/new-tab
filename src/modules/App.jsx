import React, { Component, cloneElement } from 'react'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import RaisedButton from 'material-ui/RaisedButton'

const muiTheme = getMuiTheme(null, {userAgent: 'all'})

import Search from './Search'

class App extends Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          {/*<h1>Hello World!</h1>
          <p>A new tab extension.</p>
          <a href="https://www.google.com" target="_blank">
            <RaisedButton
              label="google"
            />
          </a>*/}
          <Search />
        </div>
      </MuiThemeProvider>
    )
  }
}

export default App