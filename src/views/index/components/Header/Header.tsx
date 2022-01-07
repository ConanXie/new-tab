import "./style"

import React, { Suspense } from "react"
import { observer } from "mobx-react-lite"
import classNames from "classnames"

import { makeStyles } from "@mui/styles"
import { Theme } from "@mui/material/styles"
import AppBar from "@mui/material/AppBar"
import Drawer from "@mui/material/Drawer"
import Toolbar from "@mui/material/Toolbar"
import Tooltip from "@mui/material/Tooltip"
import IconButton from "@mui/material/IconButton"
import WallpaperIcon from "@mui/icons-material/WallpaperOutlined"
import WidgetsIcon from "@mui/icons-material/WidgetsOutlined"
import SettingsIcon from "@mui/icons-material/SettingsOutlined"

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
              <IconButton onClick={handleWallpaperIconClick} size="large">
                <WallpaperIcon className={iconClassName} />
              </IconButton>
            </Tooltip>
            <Tooltip enterDelay={300} title="Widgets">
              <IconButton size="large">
                <WidgetsIcon className={iconClassName} />
              </IconButton>
            </Tooltip>
            <Tooltip enterDelay={300} title="Settings">
              <IconButton href="./settings.html" size="large">
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
