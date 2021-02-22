import "./style"

import React, { Suspense } from "react"
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

import { desktopStore, desktopSettings, toolbarStore, wallpaperStore } from "../../store"
import { useAcrylic } from "../../../../styles/acrylic"

const Wallpaper = React.lazy(() => import("./Wallpaper"))

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
    boxShadow: "none",
  },
  drawerMask: {
    "& > div:first-child": {
      backgroundColor: "transparent",
    },
  },
}))

function Header() {
  const classes = useStyles()
  const acrylic = useAcrylic()

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
          paper: classNames(
            desktopSettings.acrylicWallpaperDrawer ? acrylic.root : null,
            classes.drawerPaper,
          ),
        }}
      >
        {toolbarStore.wallpaperDrawerLoaded && (
          <Suspense fallback>
            <Wallpaper />
          </Suspense>
        )}
      </Drawer>
    </>
  )
}

export default observer(Header)
