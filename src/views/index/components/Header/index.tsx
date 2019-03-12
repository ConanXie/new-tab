import "./style"

import React from "react"
import Loadable from "react-loadable"

import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles"
import createStyles from "@material-ui/core/styles/createStyles"
import { Theme } from "@material-ui/core/styles/createMuiTheme"
import AppBar from "@material-ui/core/AppBar"
import Drawer from "@material-ui/core/Drawer"

import Toolbar from "./Toolbar"

const Wallpaper = Loadable({
  loader: () => import("./Wallpaper"),
  loading: () => null,
})

const styles = (theme: Theme) => createStyles({
  root: {
    backgroundColor: "transparent",
    boxShadow: "none"
  },
  drawerPaper: {
    width: 360,
    overflowX: "hidden",
  },
  drawerMask: {
    "& > div:first-child": {
      backgroundColor: "transparent"
    }
  }
})

class Header extends React.Component<WithStyles<typeof styles>> {
  public state = {
    wallpaperOpen: false,
    wallpaperLoaded: false,
  }
  private openWallpaperDrawer = () => {
    this.setState({
      wallpaperOpen: true,
      wallpaperLoaded: true,
    })
  }
  private closeWallpaperDrawer = () => {
    this.setState({
      wallpaperOpen: false
    })
  }
  public render() {
    const { classes } = this.props

    return (
      <React.Fragment>
        <AppBar square className={classes.root}>
          <Toolbar onWallpaperIconClick={this.openWallpaperDrawer} />
        </AppBar>
        <Drawer
          anchor="right"
          open={this.state.wallpaperOpen}
          onClose={this.closeWallpaperDrawer}
          classes={{
            modal: classes.drawerMask,
            paper: classes.drawerPaper,
          }}
        >
          {this.state.wallpaperLoaded && <Wallpaper />}
        </Drawer>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(Header)
