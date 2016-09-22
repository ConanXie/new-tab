import './setup.less'

import classNames from 'classnames'
import React, { Component, PropTypes } from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as setupPageActions from '../../actions/setup-page'
import * as settingsActions from '../../actions/settings'

import Paper from 'material-ui/Paper'
import IconButton from 'material-ui/IconButton'
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back'
import Checkbox from 'material-ui/Checkbox'
import Toggle from 'material-ui/Toggle'
import { grey600 } from 'material-ui/styles/colors'

const style = {
  headerBar: {
    backgroundColor: grey600,
    borderRadius: 0
  }
}

class Setup extends Component {
  static propTypes = {
    status: PropTypes.bool.isRequired,
    hideSetup: PropTypes.func.isRequired,
    getSettings: PropTypes.func.isRequired,
    saveSettings: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
  }
  constructor(props) {
    super(props)
    this.state = {
      display: 'none'
    }
    const { getSettings } = this.props
    getSettings()
  }
  componentWillReceiveProps(next) {
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
  toggleAutoSaveEngine = (event, value) => {
    // console.log(this.props.autoSaveEngine)
    console.log(value)
    const { saveSettings } = this.props
    saveSettings('autoSaveEngine', value)
  }
  render() {
    const { status, data, hideSetup } = this.props
    const { display } = this.state
    return (
      <div className={classNames('setup-page', { 'show-setup-page': status, 'hide-setup-page': !status })}
        style={{ display }}
      >
        <Paper className="header-bar" style={style.headerBar} zDepth={1}>
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
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { status } = state.setupPage
  const { data } = state.settings
  return {
    status,
    data
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ ...setupPageActions, ...settingsActions }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Setup)