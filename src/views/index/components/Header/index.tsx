import * as React from "react"

import withStyles, { WithStyles, StyleRulesCallback } from "material-ui/styles/withStyles"
import AppBar from "material-ui/AppBar"
import Drawer from "material-ui/Drawer"
import LazilyLoad, { importLazy } from "utils/LazilyLoad"

import Toolbar from "./Toolbar"

import "./style"

type StylesType = "root"
  | "gutters"
  | "iconLight"
  | "iconDark"

const styles: StyleRulesCallback<StylesType> = theme => ({
  root: {
    backgroundColor: "transparent",
    boxShadow: "none"
  },
  gutters: {
    justifyContent: "flex-end"
  },
  iconLight: {
    color: theme.palette.grey["50"]
  },
  iconDark: {
    color: theme.palette.grey["800"]
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
    // const className = wallpaperStore.darkIcons ? classes.iconDark : classes.iconLight

    return (
      <div>
        <AppBar square className={classes.root}>
        <Toolbar onWallpaperIconClick={this.openWallpaperDrawer} />
        </AppBar>
        <Drawer anchor="right" open={this.state.wallpaperOpen} onClose={this.closeWallpaperDrawer}>
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
      </div>
    )
  }
}

export default withStyles(styles)(Header)
