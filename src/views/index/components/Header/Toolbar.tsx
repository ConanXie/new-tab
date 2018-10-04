import * as React from "react"
import * as classNames from "classnames"
import { inject, observer } from "mobx-react"

import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles"
import createStyles from "@material-ui/core/styles/createStyles"
import { Theme } from "@material-ui/core/styles/createMuiTheme"
import Toolbar from "@material-ui/core/Toolbar"
import Tooltip from "@material-ui/core/Tooltip"
import IconButton from "@material-ui/core/IconButton"
import WallpaperIcon from "@material-ui/icons/Wallpaper"
import WidgetsIcon from "@material-ui/icons/Widgets"
import SettingsIcon from "@material-ui/icons/Settings"

import { WallpaperStore } from "../../store/wallpaper"

const styles = ({ palette }: Theme) => createStyles({
  gutters: {
    justifyContent: "flex-end"
  },
  iconLight: {
    color: palette.grey["50"]
  },
  iconDark: {
    color: palette.grey["800"]
  }
})

interface PropsType extends WithStyles<typeof styles> {
  wallpaperStore?: WallpaperStore
  onWallpaperIconClick(): void
}

@inject("wallpaperStore")
@observer
class TopToolbar extends React.Component<PropsType> {

  public handleWallpaperIconClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur()
    this.props.onWallpaperIconClick()
  }

  public render() {
    const { classes, wallpaperStore } = this.props
    const cls = wallpaperStore!.darkIcons ? classes.iconDark : classes.iconLight
    return (
      <Toolbar className={classes.gutters}>
        <Tooltip enterDelay={300} title="Wallpaper">
          <IconButton onClick={this.handleWallpaperIconClick}>
            <WallpaperIcon className={classNames(cls)} />
          </IconButton>
        </Tooltip>
        <Tooltip enterDelay={300} title="Widgets">
          <IconButton>
            <WidgetsIcon className={classNames(cls)} />
          </IconButton>
        </Tooltip>
        <Tooltip enterDelay={300} title="Settings">
          <IconButton href="./settings.html">
            <SettingsIcon className={classNames(cls)} />
          </IconButton>
        </Tooltip>
      </Toolbar>
    )
  }
}

export default withStyles(styles)(TopToolbar)
