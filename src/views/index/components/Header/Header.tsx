import "./style"

import React from "react"
import Loadable from "react-loadable"
import { observer } from "mobx-react-lite"
import classNames from "classnames"

import { makeStyles } from "@material-ui/styles"
import { Theme } from "@material-ui/core/styles/createMuiTheme"
import AppBar from "@material-ui/core/AppBar"
import Drawer from "@material-ui/core/Drawer"
import Toolbar from "@material-ui/core/Toolbar"
import Tooltip from "@material-ui/core/Tooltip"
import IconButton from "@material-ui/core/IconButton"
import WallpaperIcon from "@material-ui/icons/WallpaperOutlined"
import WidgetsIcon from "@material-ui/icons/WidgetsOutlined"
import SettingsIcon from "@material-ui/icons/SettingsOutlined"

import { desktopStore, toolbarStore, wallpaperStore } from "../../store"

const Wallpaper = Loadable({
  loader: () => import("./Wallpaper"),
  loading: () => null,
})

const useStyles = makeStyles(({ palette }: Theme) => ({
  root: {
    backgroundColor: "transparent",
    boxShadow: "none",
  },
  gutters: {
    justifyContent: "flex-end",
  },
  iconLight: {
    color: palette.grey["50"],
  },
  iconDark: {
    color: palette.grey["800"],
  },
  drawerPaper: {
    width: 360,
    overflowX: "hidden",
  },
  drawerMask: {
    "& > div:first-child": {
      backgroundColor: "transparent",
    },
  },
}))

function Header() {
  const classes = useStyles()

  function handleWallpaperIconClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.currentTarget.blur()
    toolbarStore.loadAndOpenWallpaperDrawer()
  }

  const iconClassName = classNames(wallpaperStore.darkIcons ? classes.iconDark : classes.iconLight)

  return (
    <>
      {desktopStore.toolbar && (
        <AppBar square className={classes.root}>
          <Toolbar className={classes.gutters}>
            <Tooltip enterDelay={300} title="Wallpaper">
              <IconButton onClick={handleWallpaperIconClick}>
                <WallpaperIcon className={iconClassName} />
              </IconButton>
            </Tooltip>
            <Tooltip enterDelay={300} title="Widgets">
              <IconButton>
                <WidgetsIcon className={iconClassName} />
              </IconButton>
            </Tooltip>
            <Tooltip enterDelay={300} title="Settings">
              <IconButton href="./settings.html">
                <SettingsIcon className={iconClassName} />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
      )}
      <Drawer
        anchor="right"
        open={toolbarStore.wallpaperDrawerOpen}
        onClose={toolbarStore.closeWallpaperDrawer}
        classes={{
          modal: classes.drawerMask,
          paper: classes.drawerPaper,
        }}
      >
        {toolbarStore.wallpaperDrawerLoaded && <Wallpaper />}
      </Drawer>
    </>
  )
}

export default observer(Header)
