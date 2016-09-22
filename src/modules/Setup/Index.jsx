import './setup.less'

import classNames from 'classnames'
import React, { Component, PropTypes } from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as setupPageActions from '../../actions/setup-page'

import Paper from 'material-ui/Paper'
import IconButton from 'material-ui/IconButton'
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back'
import Checkbox from 'material-ui/Checkbox'
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
    hideSetup: PropTypes.func.isRequired
  }
  constructor(props) {
    super(props)
    this.state = {
      display: 'none'
    }
  }
  componentWillReceiveProps(next) {
    console.log(next)
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
  render() {
    const { status, hideSetup } = this.props
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
        <div className="setup-content">
          <Checkbox
            label="自动保存当前搜索引擎"
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { status } = state.setupPage
  return { status }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(setupPageActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Setup)