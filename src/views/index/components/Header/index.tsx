import * as React from "react"

import withStyles, { WithStyles } from "material-ui/styles/withStyles"
import AppBar from "material-ui/AppBar"
import Toolbar from "material-ui/Toolbar"
import Tooltip from "material-ui/Tooltip"
import IconButton from "material-ui/IconButton"
import WallpaperIcon from "@material-ui/icons/Wallpaper"
import WidgetsIcon from "@material-ui/icons/Widgets"
import SettingsIcon from "@material-ui/icons/Settings"
import Drawer from "material-ui/Drawer"
import LazilyLoad, { importLazy } from "utils/LazilyLoad"

import "./style"

const styles = {
  root: {
    backgroundColor: "transparent",
    boxShadow: "none"
  },
  gutters: {
    justifyContent: "flex-end"
  }
}

type StylesType = "root" | "gutters"
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
      <div>
        <AppBar square className={classes.root}>
          <Toolbar className={classes.gutters}>
            <Tooltip id="tooltip-icon" enterDelay={300} title="Wallpaper">
              <IconButton aria-label="Wallpaper" onClick={this.openWallpaperDrawer}>
                <WallpaperIcon />
              </IconButton>
            </Tooltip>
            <Tooltip id="tooltip-icon" enterDelay={300} title="Widgets">
              <IconButton aria-label="Widgets">
                <WidgetsIcon />
              </IconButton>
            </Tooltip>
            <Tooltip id="tooltip-icon" enterDelay={300} title="Settings">
              <IconButton aria-label="Settings" href="./settings.html">
                <SettingsIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>
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

export default withStyles(styles)<{}>(Header)
