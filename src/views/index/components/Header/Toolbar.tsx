import * as React from "react"
import * as classNames from "classnames"
import { inject, observer } from "mobx-react"

import withStyles, { WithStyles, StyleRulesCallback } from "@material-ui/core/styles/withStyles"
import Toolbar from "@material-ui/core/Toolbar"
import Tooltip from "@material-ui/core/Tooltip"
import IconButton from "@material-ui/core/IconButton"
import WallpaperIcon from "@material-ui/icons/Wallpaper"
import WidgetsIcon from "@material-ui/icons/Widgets"
import SettingsIcon from "@material-ui/icons/Settings"

import { WallpaperStore } from "../../store/wallpaper"

type StylesType = "gutters"
  | "iconLight"
  | "iconDark"

const styles: StyleRulesCallback<StylesType> = theme => ({
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

interface PropsType {
  wallpaperStore?: WallpaperStore
  onWallpaperIconClick(): void
}

@inject("wallpaperStore")
@observer
class TopToolbar extends React.Component<WithStyles<StylesType> & PropsType> {
  private handleWallpaperIconClick = () => {
    this.props.onWallpaperIconClick()
  }
  public render() {
    const { classes, wallpaperStore } = this.props
    const cls = wallpaperStore!.darkIcons ? classes.iconDark : classes.iconLight
    return (
      <Toolbar className={classes.gutters}>
        <Tooltip id="tooltip-icon" enterDelay={300} title="Wallpaper">
          <IconButton aria-label="Wallpaper" onClick={this.handleWallpaperIconClick}>
            <WallpaperIcon className={classNames(cls)} />
          </IconButton>
        </Tooltip>
        <Tooltip id="tooltip-icon" enterDelay={300} title="Widgets">
          <IconButton aria-label="Widgets">
            <WidgetsIcon className={classNames(cls)} />
          </IconButton>
        </Tooltip>
        <Tooltip id="tooltip-icon" enterDelay={300} title="Settings">
          <IconButton aria-label="Settings" href="./settings.html">
            <SettingsIcon className={classNames(cls)} />
          </IconButton>
        </Tooltip>
      </Toolbar>
    )
  }
}

export default withStyles(styles)<PropsType>(TopToolbar)
