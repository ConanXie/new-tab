import './style.less'

import React, { Component, PropTypes } from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as setupPageActions from '../../actions/setup-page'

import Paper from 'material-ui/Paper'
import IconButton from 'material-ui/IconButton'
import NavigationMenu from 'material-ui/svg-icons/navigation/menu'
import FileFolder from 'material-ui/svg-icons/file/folder'
import ActionBookmark from 'material-ui/svg-icons/action/bookmark-border'
import ActionSettings from 'material-ui/svg-icons/action/settings'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'

const style = {
  headerBar: {
    borderRadius: 0
  }
}

class Header extends Component {
  static propsType = {
    showSetup: PropTypes.func.isRequired
  }
  constructor(props) {
    super(props)
    this.state = {
      drawerOpen: false
    }
  }
  openDrawer = () => {
    this.setState({
      drawerOpen: true
    })
  }
  render() {
    const { showSetup } = this.props
    return (
      <Paper className="header-bar" style={style.headerBar} zDepth={1}>
        <div className="tool-bar">
          <div className="bar-left">
            <IconButton
              onTouchTap={this.openDrawer}
            >
              <NavigationMenu />
            </IconButton>
            {/*<IconButton>
              <ActionBookmark />
            </IconButton>*/}
          </div>
          <div className="bar-right">
            <IconButton onTouchTap={showSetup}>
              <ActionSettings />
            </IconButton>
          </div>
        </div>
        <Drawer
          docked={false}
          width={305}
          open={this.state.drawerOpen}
          onRequestChange={drawerOpen => this.setState({ drawerOpen })}
        >

        </Drawer>
      </Paper>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(setupPageActions, dispatch)
}

export default connect(null, mapDispatchToProps)(Header)