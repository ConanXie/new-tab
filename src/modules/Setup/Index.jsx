import './setup.less'

import classNames from 'classnames'
import React, { Component, PropTypes } from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as searchEngineActions from '../../actions/search-engine'
import * as setupPageActions from '../../actions/setup-page'
import * as settingsActions from '../../actions/settings'

import Paper from 'material-ui/Paper'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back'
import HardwareMemory from 'material-ui/svg-icons/hardware/memory'
import ContentLink from 'material-ui/svg-icons/content/link'
import ActionSearch from 'material-ui/svg-icons/action/search'
import CheckCircle from 'material-ui/svg-icons/action/check-circle'
import TextFormat from 'material-ui/svg-icons/content/text-format'
import ColorLens from 'material-ui/svg-icons/image/color-lens'
import ImageLens from 'material-ui/svg-icons/image/lens'
import Checkbox from 'material-ui/Checkbox'
import Toggle from 'material-ui/Toggle'
import { List, ListItem } from 'material-ui/List'
import Dialog from 'material-ui/Dialog'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import { grey600, teal500, red500, pink500, indigo500, blue500, deepOrange500, purple500, green500, yellow500, blueGrey500 } from 'material-ui/styles/colors'

import Donor from './Donor'

const style = {
  headerBar: {
    backgroundColor: grey600
  },
  toggleLabel: {
    fontSize: '15px'
  },
  toggleIcon: {
    marginRight: '30px',
    marginLeft: '4px'
  },
  listIcon: {
    marginLeft: 0
  },
  themeContent: {
    width: '380px'
  },
  themeTitle: {
    paddingBottom: '18px'
  },
  smallIcon: {
    width: 32,
    height: 32
  },
  small: {
    width: 64,
    height: 64,
    padding: 12,
  }
}

export const theme = [teal500, red500, pink500, indigo500, blue500, deepOrange500, purple500, green500, yellow500, blueGrey500]

class Setup extends Component {
  static propTypes = {
    status: PropTypes.bool.isRequired,
    hideSetup: PropTypes.func.isRequired,
    saveSettings: PropTypes.func.isRequired,
    saveCurrentEngine: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    currentEngine: PropTypes.object.isRequired
  }
  constructor(props) {
    super(props)
    this.state = {
      display: 'none',
      currentTheme: props.data.currentTheme ? props.data.currentTheme : 0,
      themeOpen: false
    }
    this.theme = theme
  }
  componentWillReceiveProps(next) {
    // show or hide the setup page
    if (next.status) {
      this.setState({
        display: 'block'
      })
    } else {
      setTimeout(() => {
        this.setState({
          display: 'none'
        })
      }, 200)
    }
  }
  toggleAutoSaveEngine = (event, bool) => {
    const { saveSettings, saveCurrentEngine } = this.props
    saveSettings('autoSaveEngine', bool)
    if (bool) {
      saveCurrentEngine()
    }
  }
  toggleLinkTarget = (event, bool) => {
    const { saveSettings, setLinkTarget } = this.props
    saveSettings('linkTarget', bool)
    setLinkTarget(bool)
  }
  toggleSearchTarget = (event, bool) => {
    const { saveSettings, setSearchTarget } = this.props
    saveSettings('searchTarget', bool)
    setSearchTarget(bool)
  }
  toggleHideAppsName = (event, bool) => {
    const { saveSettings, hideAppsName } = this.props
    saveSettings('hideAppsName', bool)
    hideAppsName(bool)
  }
  openTheme = () => {
    this.setState({
      themeOpen: true
    })
  }
  hideTheme = () => {
    this.setState({
      themeOpen: false
    })
  }
  switchTheme = (index) => {
    const { saveTheme, changeTheme } = this.props
    saveTheme(index)
    changeTheme(index)
    this.setState({
      currentTheme: index
    })
    setTimeout(() => {
      this.hideTheme()
    }, 200)
  }
  render() {
    const { status, data, hideSetup, muiTheme } = this.props
    const { display, currentTheme } = this.state
    return (
      <div className={classNames('setup-page', { 'show-setup-page': status, 'hide-setup-page': !status })}
        style={{ display }}
      >
        <Paper className="header-bar" style={style.headerBar} rounded={false} zDepth={1}>
          <div className="tool-bar">
            <div className="bar-left">
              <IconButton onTouchTap={hideSetup}>
                <ArrowBack color="#fff" />
              </IconButton>
              <div className="bar-label">设置</div>
            </div>
          </div>
        </Paper>
        <div className="setup-section">
          <Paper className="setup-content" style={{ paddingLeft: 28, paddingRight: 28 }} zDepth={1}>
            <div className="toggle-box">
              <HardwareMemory style={style.toggleIcon} color={muiTheme.palette.primary1Color} />
              <div className="toggle-wrapper">
                <Toggle
                  className="toggle"
                  label="自动保存当前搜索引擎"
                  defaultToggled={data.autoSaveEngine}
                  onToggle={this.toggleAutoSaveEngine}
                  labelStyle={style.toggleLabel}
                />
              </div>
            </div>
            <div className="toggle-box">
              <ActionSearch style={style.toggleIcon} color={muiTheme.palette.primary1Color} />
              <div className="toggle-wrapper">
                <Toggle
                  className="toggle"
                  label="在新标签页中打开搜索"
                  defaultToggled={data.searchTarget}
                  onToggle={this.toggleSearchTarget}
                  labelStyle={style.toggleLabel}
                />
              </div>
            </div>
            <div className="toggle-box">
              <ContentLink style={style.toggleIcon} color={muiTheme.palette.primary1Color} />
              <div className="toggle-wrapper">
                <Toggle
                  className="toggle"
                  label="在新标签页中打开链接"
                  defaultToggled={data.linkTarget}
                  onToggle={this.toggleLinkTarget}
                  labelStyle={style.toggleLabel}
                />
              </div>
            </div>
            <div className="toggle-box">
              <TextFormat style={style.toggleIcon} color={muiTheme.palette.primary1Color} />
              <div className="toggle-wrapper">
                <Toggle
                  className="toggle"
                  label="隐藏应用的标签"
                  defaultToggled={data.hideAppsName}
                  onToggle={this.toggleHideAppsName}
                  labelStyle={style.toggleLabel}
                />
              </div>
            </div>
            <h2 className="setup-title" style={{ color: muiTheme.palette.secondaryTextColor }}>主题</h2>
            <List>
              <ListItem
                leftIcon={<ColorLens style={style.toggleIcon, { marginLeft: 0 }} color={muiTheme.palette.primary1Color} />}
                primaryText="切换主题"
                innerDivStyle={{ paddingLeft: '58px' }}
                onTouchTap={this.openTheme}
              />
            </List>
          </Paper>
          <Dialog
            title="选择主题"
            open={this.state.themeOpen}
            onRequestClose={this.hideTheme}
            titleStyle={style.themeTitle}
            contentStyle={style.themeContent}
          >
            {this.theme.map((color, index) => {
              if (currentTheme === index) {
                return (
                  <IconButton style={style.small} iconStyle={style.smallIcon} key={index} onTouchTap={e => { this.hideTheme() }}>
                    <CheckCircle color={color} />
                  </IconButton>
                )
              } else {
                return (
                  <IconButton style={style.small} iconStyle={style.smallIcon} key={index} onTouchTap={e => { this.switchTheme(index) }}>
                    <ImageLens color={color} />
                  </IconButton>
                )
              }
            })}
            {/*<IconButton style={style.small} iconStyle={style.smallIcon}>
              <CheckCircle color={red500} />
            </IconButton>*/}
          </Dialog>
        </div>
        <div className="setup-section">
          <Paper className="setup-content about" zDepth={1}>
            <h3>关于</h3>
            <p className="name">Material Design New Tab <FlatButton label="1.0.0" /></p>
            <Donor />
            <p className="intro">Please create an issue on <a href="https://github.com/ConanXie/react-koa-website/issues" target="_blank">Github</a> if you have any problems when using this extension. Thank you 😉</p>
          </Paper>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { status } = state.setupPage
  const { data } = state.settings
  const { currentEngine } = state.searchEngine
  return {
    status,
    data,
    currentEngine
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    ...setupPageActions,
    ...settingsActions,
    ...searchEngineActions
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Setup)