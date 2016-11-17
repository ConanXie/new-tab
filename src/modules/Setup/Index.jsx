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
import Checkbox from 'material-ui/Checkbox'
import Toggle from 'material-ui/Toggle'
import { grey600 } from 'material-ui/styles/colors'

import Donor from './Donor'

const style = {
  headerBar: {
    backgroundColor: grey600
  }
}

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
      display: 'none'
    }
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
  render() {
    const { status, data, hideSetup } = this.props
    const { display } = this.state
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
          <Paper className="setup-content" zDepth={1}>
            <Toggle
              className="toggle"
              label="自动保存当前搜索引擎"
              defaultToggled={data.autoSaveEngine}
              onToggle={this.toggleAutoSaveEngine}
            />
          </Paper>
        </div>
        <div className="setup-section">
          <Paper className="setup-content about" zDepth={1}>
            <h3>关于</h3>
            <p className="name">Material Design New Tab <FlatButton label="1.0.0" /></p>
            <Donor />
            <p className="intro">Please create an issue on <a href="https://github.com/ConanXie/react-koa-website/issues" target="_blank">Github</a> if you have any problem when using this extension. Thank you 😉</p>
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