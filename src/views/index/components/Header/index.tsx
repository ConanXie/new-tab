import * as React from "react"

import withStyles, { WithStyles, StyleRulesCallback } from "@material-ui/core/styles/withStyles"
import AppBar from "@material-ui/core/AppBar"
import Drawer from "@material-ui/core/Drawer"
import LazilyLoad, { importLazy } from "utils/LazilyLoad"

import Toolbar from "./Toolbar"

import "./style"

type StylesType = "root" | "drawerMask"

const styles: StyleRulesCallback<StylesType> = theme => ({
  root: {
    backgroundColor: "transparent",
    boxShadow: "none"
  },
  drawerMask: {
    "& > div:first-child": {
      backgroundColor: "transparent"
    }
  }
})

class Header extends React.Component<WithStyles<StylesType>> {
  public state = {
    wallpaperOpen: false
  }
  private openWallpaperDrawer = () => {
    this.setState({
      wallpaperOpen: true
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
          classes={{ modal: classes.drawerMask }}
        >
          <div className="wallpaper-drawer">
            <LazilyLoad
              modules={{
                Wallpaper: () => importLazy(import("./Wallpaper"))
              }}
            >
              {({ Wallpaper }: { Wallpaper: React.ComponentType }) => (
                <Wallpaper />
              )}
            </LazilyLoad>
          </div>
        </Drawer>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(Header)
