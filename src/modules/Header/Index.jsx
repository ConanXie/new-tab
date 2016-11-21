import './style.less'

import React, { Component, PropTypes } from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as setupPageActions from '../../actions/setup-page'

import Paper from 'material-ui/Paper'
import IconButton from 'material-ui/IconButton'
import RaisedButton from 'material-ui/RaisedButton'
import NavigationMenu from 'material-ui/svg-icons/navigation/menu'
import FileFolder from 'material-ui/svg-icons/file/folder'
import ActionBookmark from 'material-ui/svg-icons/action/bookmark-border'
import ActionSettings from 'material-ui/svg-icons/action/settings'
import ActionRoom from 'material-ui/svg-icons/action/room'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'

import Weather from './Weather'
import Apps from './Apps'

const style = {
  
}

class Header extends Component {
  static propsType = {
    showSetup: PropTypes.func.isRequired
  }
  constructor(props) {
    super(props)
    this.state = {
      drawerOpen: false,
      bookmarkOpen: false
    }
  }
  openDrawer = () => {
    this.setState({
      drawerOpen: true
    })
  }
  openBookmark = () => {
    this.setState({
      bookmarkOpen: true
    })
  }
  /*trigger = () => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords
      fetch(`https://localhost:5001/api/position/${latitude}/${longitude}`, {
        method: 'GET'
      }).then(res => {
        res.json().then(data => {
          console.log(data)
        })
      }) 
    })
  }*/
  render() {
    const { showSetup, hideAppsName, muiTheme } = this.props
    return (
      <Paper className="header-bar" rounded={false} zDepth={0}>
        <div className="tool-bar">
          <div className="bar-left">
            <IconButton
              onTouchTap={this.openDrawer}
            >
              <NavigationMenu />
            </IconButton>
          </div>
          <div className="bar-right">
            <IconButton onTouchTap={showSetup}>
              <ActionBookmark />
            </IconButton>
            <IconButton onTouchTap={this.openBookmark}>
              <ActionSettings />
            </IconButton>
          </div>
        </div>
        <Drawer
          docked={false}
          width={600}
          open={this.state.drawerOpen}
          onRequestChange={drawerOpen => this.setState({ drawerOpen })}
        >
          <Weather muiTheme={muiTheme} />
          {/*<IconButton onTouchTap={this.trigger}>
            <ActionRoom />
          </IconButton>*/}
          <Apps hideAppsName={hideAppsName} muiTheme={muiTheme} />
        </Drawer>
        <Drawer
          width={200}
          openSecondary={true}
          open={this.state.bookmarkOpen}
          onRequestChange={bookmarkOpen => this.setState({ bookmarkOpen })}
        >
          <h1>sdhhash</h1>
        </Drawer>
      </Paper>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(setupPageActions, dispatch)
}

export default connect(null, mapDispatchToProps)(Header)