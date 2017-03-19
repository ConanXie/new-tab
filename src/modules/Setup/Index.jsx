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
import BookmarkBorder from 'material-ui/svg-icons/action/bookmark-border'
import LightbulbOutline from 'material-ui/svg-icons/action/lightbulb-outline'
import TextFormat from 'material-ui/svg-icons/content/text-format'
import CallSplit from 'material-ui/svg-icons/communication/call-split'
import ColorLens from 'material-ui/svg-icons/image/color-lens'
import ImageLens from 'material-ui/svg-icons/image/lens'
import ImageBrightness from 'material-ui/svg-icons/image/brightness-2'
import CloudQueue from 'material-ui/svg-icons/file/cloud-queue'
import FileDownload from 'material-ui/svg-icons/file/file-download'
import FileUpload from 'material-ui/svg-icons/file/file-upload'
import SettingsRestore from 'material-ui/svg-icons/action/settings-backup-restore'
import ActionInfo from 'material-ui/svg-icons/action/info-outline'
import HardwareKeyboard from 'material-ui/svg-icons/hardware/keyboard'
import FileCloud from 'material-ui/svg-icons/file/cloud'
import Checkbox from 'material-ui/Checkbox'
import Toggle from 'material-ui/Toggle'
import { List, ListItem } from 'material-ui/List'
import Dialog from 'material-ui/Dialog'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import Snackbar from 'material-ui/Snackbar'
import { grey600, teal500, red500, pink500, indigo500, blue500, deepOrange500, purple500, green500, orange500, blueGrey500 } from 'material-ui/styles/colors'

import { version } from '../../config'

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

export const themes = [teal500, red500, pink500, indigo500, blue500, deepOrange500, purple500, green500, orange500, blueGrey500]

class Setup extends Component {
  static propTypes = {
    status: PropTypes.bool.isRequired,
    hideSetup: PropTypes.func.isRequired,
    saveSettings: PropTypes.func.isRequired,
    saveCurrentEngine: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    currentEngine: PropTypes.object.isRequired
  }
  static contextTypes = {
    intl: PropTypes.object.isRequired
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
    this.themes = themes
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
  toggleRememberBookmarksState = (event, bool) => {
    const { saveSettings, rememberBookmarksState } = this.props
    saveSettings('rememberBookmarksState', bool)
    rememberBookmarksState(bool)
  }
  toggleSearchPredict = (event, bool) => {
    const { saveSettings, searchPredict } = this.props
    saveSettings('searchPredict', bool)
    searchPredict(bool)
  }
  toggleUseHK = (event, bool) => {
    const { saveSettings, useHK } = this.props
    saveSettings('useHK', bool)
    useHK(bool)
  }
  toggleFahrenheit = (event, bool) => {
    const { saveSettings, useFahrenheit } = this.props
    saveSettings('useFahrenheit', bool)
    useFahrenheit(bool)
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
    this.toggleDarkMode(null, false)
    setTimeout(() => {
      this.hideTheme()
    }, 200)
  }
  toggleDarkMode = (event, bool) => {
    const { saveSettings, darkMode } = this.props
    saveSettings('darkMode', bool)
    darkMode(bool)
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
    const { intl } = this.context
    fr.onloadend = e => {
      const backups = JSON.parse(e.target.result)
      for (let i in backups) {
        window.localStorage.setItem(i, JSON.stringify(backups[i]))
      }
      this.setState({
        snackbarOpen: true,
        snackbarMessage: intl.formatMessage({ id: 'settings.br.restore.message' })
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
    const { intl } = this.context
    this.setState({
      snackbarOpen: true,
      snackbarMessage: intl.formatMessage({ id: 'settings.br.reset.message' })
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
    const { intl } = this.context
    const resetActions = [
      <FlatButton
        label={intl.formatMessage({ id: 'button.cancel' })}
        primary={true}
        onTouchTap={this.hideReset}
      />,
      <FlatButton
        label={intl.formatMessage({ id: 'button.confirm' })}
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
              <div className="bar-label">{intl.formatMessage({ id: 'settings.toolbar.title' })}</div>
            </div>
          </div>
        </Paper>
        <section style={{ backgroundColor: muiTheme.palette.settingsBackgroundColor }}>
          <div className="setup-section">
            <Paper className="setup-content" style={{ paddingLeft: 28, paddingRight: 28 }} zDepth={1}>
              <div className="toggle-box">
                <ContentLink style={style.toggleIcon} color={muiTheme.palette.primary1Color} />
                <div className="toggle-wrapper">
                  <Toggle
                    className="toggle"
                    label={intl.formatMessage({ id: 'settings.website.open.label' })}
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
                    label={intl.formatMessage({ id: 'settings.apps.display.label' })}
                    defaultToggled={data.hideAppsName}
                    onToggle={this.toggleHideAppsName}
                    labelStyle={style.toggleLabel}
                  />
                </div>
              </div>
              <div className="toggle-box">
                <CloudQueue style={style.toggleIcon} color={muiTheme.palette.primary1Color} />
                <div className="toggle-wrapper">
                  <Toggle
                    className="toggle"
                    label={intl.formatMessage({ id: 'settings.weather.fahrenheit.label' })}
                    defaultToggled={data.useFahrenheit}
                    onToggle={this.toggleFahrenheit}
                    labelStyle={style.toggleLabel}
                  />
                </div>
              </div>
              <div className="toggle-box">
                <BookmarkBorder style={style.toggleIcon} color={muiTheme.palette.primary1Color} />
                <div className="toggle-wrapper">
                  <Toggle
                    className="toggle"
                    label={intl.formatMessage({ id: 'settings.bookmarks.position.label' })}
                    defaultToggled={data.rememberBookmarksState}
                    onToggle={this.toggleRememberBookmarksState}
                    labelStyle={style.toggleLabel}
                  />
                </div>
              </div>
              {/*search*/}
              <h2 className="setup-title" style={{ color: muiTheme.palette.secondaryTextColor }}>{intl.formatMessage({ id: 'settings.search.title' })}</h2>
              <div className="toggle-box">
                <HardwareMemory style={style.toggleIcon} color={muiTheme.palette.primary1Color} />
                <div className="toggle-wrapper">
                  <Toggle
                    className="toggle"
                    label={intl.formatMessage({ id: 'settings.engine.save.label' })}
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
                    label={intl.formatMessage({ id: 'settings.engine.search.label' })}
                    defaultToggled={data.searchTarget}
                    onToggle={this.toggleSearchTarget}
                    labelStyle={style.toggleLabel}
                  />
                </div>
              </div>
              <div className="toggle-box">
                <LightbulbOutline style={style.toggleIcon} color={muiTheme.palette.primary1Color} />
                <div className="toggle-wrapper">
                  <Toggle
                    className="toggle"
                    label={intl.formatMessage({ id: 'settings.search.predict.label' })}
                    defaultToggled={data.searchPredict}
                    onToggle={this.toggleSearchPredict}
                    labelStyle={style.toggleLabel}
                  />
                </div>
              </div>
              {/*仅对中文用户展示*/}
              {navigator.language === 'zh-CN' &&
                <div className="toggle-box">
                  <CallSplit style={style.toggleIcon} color={muiTheme.palette.primary1Color} />
                  <div className="toggle-wrapper">
                    <Toggle
                      className="toggle"
                      label="Google 搜索使用 .hk"
                      defaultToggled={data.useHK}
                      onToggle={this.toggleUseHK}
                      labelStyle={style.toggleLabel}
                    />
                  </div>
                </div>
              }
              {/*theme*/}
              <h2 className="setup-title" style={{ color: muiTheme.palette.secondaryTextColor }}>{intl.formatMessage({ id: 'settings.theme.title' })}</h2>
              <List>
                <ListItem
                  leftIcon={<ColorLens style={style.listIcon} color={muiTheme.palette.primary1Color} />}
                  primaryText={intl.formatMessage({ id: 'settings.theme.switch.label' })}
                  innerDivStyle={{ paddingLeft: '58px' }}
                  onTouchTap={this.openTheme}
                />
              </List>
              <div className="toggle-box">
                <ImageBrightness style={style.toggleIcon} color={muiTheme.palette.primary1Color} />
                <div className="toggle-wrapper">
                  <Toggle
                    className="toggle"
                    label={intl.formatMessage({ id: 'settings.theme.dark.label' })}
                    defaultToggled={data.darkMode}
                    onToggle={this.toggleDarkMode}
                    labelStyle={style.toggleLabel}
                  />
                </div>
              </div>
              {/*backup and restore*/}
              <h2 className="setup-title" style={{ color: muiTheme.palette.secondaryTextColor }}>{intl.formatMessage({ id: 'settings.br.title' })}</h2>
              <List>
                <ListItem
                  leftIcon={<FileUpload style={style.listIcon} color={muiTheme.palette.primary1Color} />}
                  primaryText={intl.formatMessage({ id: 'settings.br.backup.label' })}
                  innerDivStyle={{ paddingLeft: '58px' }}
                  onTouchTap={this.createBackups}
                />
                <ListItem
                  leftIcon={<FileDownload style={style.listIcon} color={muiTheme.palette.primary1Color} />}
                  primaryText={intl.formatMessage({ id: 'settings.br.restore.label' })}
                  innerDivStyle={{ paddingLeft: '58px' }}
                >
                  <input type="file" style={style.fileInput} accept="application/json" onChange={this.restoreBackups} />
                </ListItem>
                <ListItem
                  leftIcon={<SettingsRestore style={style.listIcon} color={muiTheme.palette.primary1Color} />}
                  primaryText={intl.formatMessage({ id: 'settings.br.reset.label' })}
                  innerDivStyle={{ paddingLeft: '58px' }}
                  onTouchTap={this.openReset}
                />
              </List>
            </Paper>
            <Dialog
              title={intl.formatMessage({ id: 'settings.theme.select.title' })}
              open={this.state.themeOpen}
              onRequestClose={this.hideTheme}
              titleStyle={style.themeTitle}
              contentStyle={style.themeContent}
            >
              {this.themes.map((color, index) => {
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
              title={intl.formatMessage({ id: 'settings.reset.title' })}
              open={this.state.resetOpen}
              actions={resetActions}
              onRequestClose={this.hideReset}
              contentStyle={style.themeContent}
            >
              {intl.formatMessage({ id: 'settings.reset.warning' })}
            </Dialog>
          </div>
          <div className="setup-section">
            <Paper className="setup-content about" zDepth={1}>
              <h3>{intl.formatMessage({ id: 'settings.about.title' })}</h3>
              <p className="name">Material Design New Tab <a href="https://tab.xiejie.co/logs" target="_blank"><FlatButton label={version} /></a></p>
              {/*仅对中文用户展示*/}
              {navigator.language === 'zh-CN' &&
                <div>
                  <div className="donor-feedback">
                    <Donor />
                    <Feedback muiTheme={muiTheme} />
                  </div>
                  <p className="tip">
                    <ActionInfo style={{ width: 18, height: 18 }} color="#999" />
                    <span>翻墙使用体验更佳</span>
                  </p>
                </div>
              }
              <div className="hot-key-box">
                <div className="tip">
                  <HardwareKeyboard style={{ width: 18, height: 18 }} color="#999" />
                  <span>{intl.formatMessage({ id: 'hotkey.title' })}</span>
                </div>
                <div className="hot-key-list">
                  <span className="hot-key-item">{intl.formatMessage({ id: 'hotkey.apps' })}</span>
                  <span className="hot-key">Alt + A</span>
                </div>
                <div className="hot-key-list">
                  <span className="hot-key-item">{intl.formatMessage({ id: 'hotkey.bookmarks' })}</span>
                  <span className="hot-key">Alt + B</span>
                </div>
                <div className="hot-key-list">
                  <span className="hot-key-item">{intl.formatMessage({ id: 'hotkey.settings' })}</span>
                  <span className="hot-key">Alt + S</span>
                </div>
              </div>
              <div className="tip">
                <FileCloud style={{ width: 18, height: 18 }} color="#999" />
                <span>天气数据来源 Yahoo! HeWeather</span>
              </div>
              {/*<p className="intro">Please create an issue on <a href="https://github.com/ConanXie/react-koa-website/issues" target="_blank">Github</a> if you have any problems when using this extension. Thank you 😉</p>*/}
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