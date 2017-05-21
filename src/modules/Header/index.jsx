import './style.less'

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as settingsPageActions from '../../actions/settings-page'

import muiThemeable from 'material-ui/styles/muiThemeable'
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
import Bookmark from './Bookmark'

const style = {
  
}

class Header extends Component {
  static propsType = {
    showSettings: PropTypes.func.isRequired,
    hideSettings: PropTypes.func.isRequired
  }
  constructor(props) {
    super(props)
    this.state = {
      drawerOpen: false,
      bookmarkOpen: false
    }
    this.settingsOpen = false
  }
  componentDidMount() {
    document.onkeydown = () => {
      const { drawerOpen, bookmarkOpen } = this.state
      const { settingsOpen, showSettings, hideSettings } = this.props
      const code = window.event.keyCode
      // console.log(window.event)
      // listen Alt + B
      if (code === 66 && window.event.altKey) {
        this.setState({
          bookmarkOpen: !bookmarkOpen
        })
      }
      // listen Alt + A
      if (code === 65 && window.event.altKey) {
        this.setState({
          drawerOpen: !drawerOpen
        })
      }
      // listen Alt + S
      if (code === 83 && window.event.altKey) {
        settingsOpen ? hideSettings() : showSettings()
      }
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
  render() {
    // console.log(this.props)
    const {
      showSettings,
      hideAppsName,
      rememberBookmarksState,
      useFahrenheit,
      blockGeolocation,
      muiTheme
    } = this.props
    return (
      <Paper className="header-bar" rounded={false} zDepth={0}>
        <div className="tool-bar">
          <div className="bar-left">
            <IconButton
              onTouchTap={this.openDrawer}
            >
              <NavigationMenu color={muiTheme.palette.textColor} />
            </IconButton>
          </div>
          <div className="bar-right">
            <IconButton onTouchTap={this.openBookmark}>
              <ActionBookmark color={muiTheme.palette.textColor} />
            </IconButton>
            <IconButton onTouchTap={showSettings}>
              <ActionSettings color={muiTheme.palette.textColor} />
            </IconButton>
          </div>
        </div>
        <Drawer
          docked={false}
          width={600}
          open={this.state.drawerOpen}
          onRequestChange={drawerOpen => this.setState({ drawerOpen })}
        >
          <Weather useFahrenheit={useFahrenheit} blockGeolocation={blockGeolocation} />          
          <Apps hideAppsName={hideAppsName} />
        </Drawer>
        <Drawer
          docked={false}
          width={480}
          openSecondary={true}
          open={this.state.bookmarkOpen}
          onRequestChange={bookmarkOpen => this.setState({ bookmarkOpen })}
        >
          <Bookmark rememberBookmarksState={rememberBookmarksState} />
        </Drawer>
      </Paper>
    )
  }
}

const mapStateToProps = state => {
  const { status } = state.settingsPage
  return { settingsOpen: status }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(settingsPageActions, dispatch)
}

export default muiThemeable()(connect(mapStateToProps, mapDispatchToProps)(Header))
