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
import FileDownload from 'material-ui/svg-icons/file/file-download'
import FileUpload from 'material-ui/svg-icons/file/file-upload'
import SettingsRestore from 'material-ui/svg-icons/action/settings-backup-restore'
import Checkbox from 'material-ui/Checkbox'
import Toggle from 'material-ui/Toggle'
import { List, ListItem } from 'material-ui/List'
import Dialog from 'material-ui/Dialog'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import Snackbar from 'material-ui/Snackbar'
import { grey600, teal500, red500, pink500, indigo500, blue500, deepOrange500, purple500, green500, orange500, blueGrey500 } from 'material-ui/styles/colors'

import Donor from './Donor'
import Feedback from './Feedback'

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
  },
  fileInput: {
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    opacity: 0
  },
  snackbar: {
    maxWidth: '150px'
  }
}

export const theme = [teal500, red500, pink500, indigo500, blue500, deepOrange500, purple500, green500, orange500, blueGrey500]

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
      themeOpen: false,
      resetOpen: false,
      snackbarOpen: false,
      snackbarMessage: ''
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
  createBackups = () => {
    const currentEngine = JSON.parse(window.localStorage.currentEngine)
    const settings = JSON.parse(window.localStorage.settings)
    const websites = JSON.parse(window.localStorage.websites)
    const data = JSON.stringify({
      currentEngine,
      settings,
      websites
    })
    const backups = new Blob([data], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = window.URL.createObjectURL(backups)
    a.download = 'backups.json'
    a.click()
  }
  restoreBackups = (e) => {
    const file = e.target.files[0]
    const fr = new FileReader()
    fr.onloadend = e => {
      const backups = JSON.parse(e.target.result)
      for (let i in backups) {
        window.localStorage.setItem(i, JSON.stringify(backups[i]))
      }
      this.setState({
        snackbarOpen: true,
        snackbarMessage: '已从备份文件恢复, 刷新后生效'
      })
    }
    fr.readAsText(file)
  }
  openReset = () => {
    this.setState({
      resetOpen: true
    })
  }
  hideReset = () => {
    this.setState({
      resetOpen: false
    })
  }
  resetSettings = () => {
    window.localStorage.removeItem('currentEngine')
    window.localStorage.removeItem('settings')
    this.setState({
      snackbarOpen: true,
      snackbarMessage: '已重置设置，刷新后生效'
    })
    this.hideReset()
  }
  closeSnackerbar = () => {
    this.setState({
      snackbarOpen: false
    })
  }
  render() {
    const { status, data, hideSetup, muiTheme } = this.props
    const { display, currentTheme, snackbarOpen, snackbarMessage } = this.state
    const resetActions = [
      <FlatButton
        label="取消"
        primary={true}
        onTouchTap={this.hideReset}
      />,
      <FlatButton
        label="确认"
        primary={true}
        onTouchTap={this.resetSettings}
      />
    ]
    return (
      <div className={classNames('setup-page', { 'show-setup-page': status, 'hide-setup-page': !status })}
        style={{ display }}
      >
        <Paper className="header-bar setup-header-bar" style={{ backgroundColor: muiTheme.palette.primary1Color }} rounded={false} zDepth={1}>
          <div className="tool-bar">
            <div className="bar-left">
              <IconButton onTouchTap={hideSetup}>
                <ArrowBack color="#fff" />
              </IconButton>
              <div className="bar-label">设置</div>
            </div>
          </div>
        </Paper>
        <section>
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
                  leftIcon={<ColorLens style={style.listIcon} color={muiTheme.palette.primary1Color} />}
                  primaryText="切换主题"
                  innerDivStyle={{ paddingLeft: '58px' }}
                  onTouchTap={this.openTheme}
                />
              </List>
              <h2 className="setup-title" style={{ color: muiTheme.palette.secondaryTextColor }}>备份与重置</h2>
              <List>
                <ListItem
                  leftIcon={<FileUpload style={style.listIcon} color={muiTheme.palette.primary1Color} />}
                  primaryText="生成备份文件"
                  innerDivStyle={{ paddingLeft: '58px' }}
                  onTouchTap={this.createBackups}
                />
                <ListItem
                  leftIcon={<FileDownload style={style.listIcon} color={muiTheme.palette.primary1Color} />}
                  primaryText="从备份中恢复"
                  innerDivStyle={{ paddingLeft: '58px' }}
                >
                  <input type="file" style={style.fileInput} accept="application/json" onChange={this.restoreBackups} />
                </ListItem>
                <ListItem
                  leftIcon={<SettingsRestore style={style.listIcon} color={muiTheme.palette.primary1Color} />}
                  primaryText="重置为默认设置"
                  innerDivStyle={{ paddingLeft: '58px' }}
                  onTouchTap={this.openReset}
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
            </Dialog>
            <Dialog
              title="确认重置设置？"
              open={this.state.resetOpen}
              actions={resetActions}
              onRequestClose={this.hideReset}
              contentStyle={style.themeContent}
            >
              将会重置为初始化设置
            </Dialog>
          </div>
          <div className="setup-section">
            <Paper className="setup-content about" zDepth={1}>
              <h3>关于</h3>
              <p className="name">Material Design New Tab <a href="https://tab.xiejie.co/logs" target="_blank"><FlatButton label="1.0.0" /></a></p>
              <div className="donor-feedback">
                <Donor />
                <Feedback />
              </div>
              <p className="intro">Please create an issue on <a href="https://github.com/ConanXie/react-koa-website/issues" target="_blank">Github</a> if you have any problems when using this extension. Thank you 😉</p>
            </Paper>
          </div>
        </section>
        <Snackbar
          open={snackbarOpen}
          message={snackbarMessage}
          autoHideDuration={2000}
          onRequestClose={this.closeSnackerbar}
          bodyStyle={style.snackbar}
        />
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