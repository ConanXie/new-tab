import './style.less'

import React, { Component } from 'react'

import Paper from 'material-ui/Paper'
import IconButton from 'material-ui/IconButton'
import NavigationMenu from 'material-ui/svg-icons/navigation/menu'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'

class Header extends Component {
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
    return (
      <Paper className="header-bar" zDepth={1}>
        <IconButton
          onClick={this.openDrawer}
        >
          <NavigationMenu />
        </IconButton>
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

export default Header