import './style.less'

import classNames from 'classnames'
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
import DeviceWallpaper from 'material-ui/svg-icons/device/wallpaper'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'

import Weather from './Weather'
import Apps from './Apps'
import Bookmark from './Bookmark'
import Wallpaper from './Wallpaper'

const style = {
  headerBar: {
    backgroundColor: 'transparent'
  },
  rightIcon: {
    marginLeft: '4px'
  }
}

class Header extends Component {
  static propsType = {
    showSettings: PropTypes.func.isRequired,
    hideSettings: PropTypes.func.isRequired
  }
  constructor(props) {
    super(props)
    this.state = {
      weatherOpen: false,
      bookmarkOpen: false,
      wallpaperOpen: false
    }
  }
  componentDidMount() {
    document.onkeydown = () => {
      const { weatherOpen, bookmarkOpen } = this.state
      const { settingsPage, showSettings, hideSettings } = this.props
      const { keyCode, altKey } = window.event
      // console.log(window.event)
      // listen Alt + B
      if (keyCode === 66 && altKey) {
        this.setState({
          bookmarkOpen: !bookmarkOpen
        })
      }
      // listen Alt + A
      if (keyCode === 65 && altKey) {
        this.setState({
          weatherOpen: !weatherOpen
        })
      }
      // listen Alt + S
      if (keyCode === 83 && altKey) {
        settingsPage ? hideSettings() : showSettings()
      }
    }
  }
  render() {
    const { showSettings, settings, muiTheme } = this.props
    const { weatherOpen, bookmarkOpen, wallpaperOpen } = this.state
    const { topShadow, darkMode, background, backgroundShade } = settings
    
    let iconColor
    if ((topShadow && !darkMode) || (background && backgroundShade === 2)) {
      iconColor = 'rgba(255, 255, 255, 0.87)'
    } else {
      iconColor = muiTheme.palette.textColor
    }
    // const iconColor = (settings.topShadow && !settings.darkMode) ? '#fff' : muiTheme.palette.textColor
    
    return (
      <Paper
        className={classNames('header-bar', { 'has-shadow': settings.topShadow })}
        rounded={false}
        zDepth={0}
        style={style.headerBar}
      >
        <div className="tool-bar">
          <div className="bar-left">
            <IconButton
              onTouchTap={() => this.setState({ weatherOpen: true })}
            >
              <NavigationMenu color={iconColor} />
            </IconButton>
          </div>
          <div className="bar-right">
            <IconButton style={style.rightIcon} onTouchTap={() => this.setState({ bookmarkOpen: true })}>
              <ActionBookmark color={iconColor} />
            </IconButton>
            <IconButton style={style.rightIcon} onTouchTap={() => this.setState({ wallpaperOpen: true })}>
              <DeviceWallpaper color={iconColor} />
            </IconButton>
            <IconButton style={style.rightIcon} onTouchTap={showSettings}>
              <ActionSettings color={iconColor} />
            </IconButton>
          </div>
        </div>
        <Drawer
          docked={false}
          width={600}
          open={weatherOpen}
          onRequestChange={state => this.setState({ weatherOpen: state })}
        >
          <Weather />
          <Apps />
        </Drawer>
        <Drawer
          docked={false}
          width={360}
          openSecondary={true}
          open={wallpaperOpen}
          onRequestChange={state => this.setState({ wallpaperOpen: state })}
        >
          <Wallpaper close={() => this.setState({ wallpaperOpen: false })} />
        </Drawer>
        <Drawer
          docked={false}
          width={480}
          openSecondary={true}
          open={bookmarkOpen}
          onRequestChange={state => this.setState({ bookmarkOpen: state })}
        >
          <Bookmark />
        </Drawer>
      </Paper>
    )
  }
}

const mapStateToProps = state => {
  const { settingsPage, settings } = state
  return { settingsPage, settings }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(settingsPageActions, dispatch)
}

export default muiThemeable()(connect(mapStateToProps, mapDispatchToProps)(Header))
