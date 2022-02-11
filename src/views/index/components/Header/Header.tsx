import "./style"

import React, { Suspense, useMemo } from "react"
import { observer, useLocalObservable } from "mobx-react-lite"

import { SxProps, Theme } from "@mui/material/styles"
import grey from "@mui/material/colors/grey"
import AppBar from "@mui/material/AppBar"
import Drawer from "@mui/material/Drawer"
import Toolbar from "@mui/material/Toolbar"
import Tooltip from "@mui/material/Tooltip"
import IconButton from "@mui/material/IconButton"
import WallpaperIcon from "@mui/icons-material/WallpaperOutlined"
import WidgetsIcon from "@mui/icons-material/WidgetsOutlined"
import SettingsIcon from "@mui/icons-material/SettingsOutlined"

import { desktopSettings, toolbarStore, wallpaperStore } from "../../store"
import { acrylicBg } from "styles/acrylic"

const Wallpaper = React.lazy(() => import("./Wallpaper"))
const WidgetList = React.lazy(() => import("./WidgetList"))

function Header() {
  const wallpaperState = useLocalObservable(() => wallpaperStore)

  function handleWallpaperIconClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.currentTarget.blur()
    toolbarStore.openWallpaperDrawer()
  }

  function handleWidgetIconClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.currentTarget.blur()
    toolbarStore.openWidgetDrawer()
  }

  const iconStyles: SxProps<Theme> = useMemo(
    () => ({
      color: wallpaperState.darkIcons ? grey["800"] : grey["50"],
    }),
    [wallpaperState.darkIcons],
  )

  return (
    <>
      {desktopSettings.toolbar && (
        <AppBar
          square
          sx={{
            backgroundColor: "transparent",
            backgroundImage: "none",
            boxShadow: 0,
          }}
        >
          <Toolbar
            sx={{
              justifyContent: "flex-end",
            }}
          >
            <Tooltip enterDelay={300} title="Wallpaper">
              <IconButton size="large" onClick={handleWallpaperIconClick}>
                <WallpaperIcon sx={iconStyles} />
              </IconButton>
            </Tooltip>
            <Tooltip enterDelay={300} title="Widgets">
              <IconButton size="large" onClick={handleWidgetIconClick}>
                <WidgetsIcon sx={iconStyles} />
              </IconButton>
            </Tooltip>
            <Tooltip enterDelay={300} title="Settings">
              <IconButton href="./settings.html" size="large">
                <SettingsIcon sx={iconStyles} />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
      )}
      <Drawer
        anchor="right"
        open={toolbarStore.drawerOpen}
        onClose={toolbarStore.closeDrawer}
        sx={[
          {
            "& .MuiPaper-root": {
              width: 360,
              overflowX: "hidden",
              boxShadow: "none",
            },
            "& .MuiBackdrop-root": {
              backgroundColor: "transparent",
            },
          },
          {
            "& .MuiPaper-root": desktopSettings.acrylicWallpaperDrawer ? acrylicBg : null,
          },
        ]}
      >
        <Suspense fallback>
          {toolbarStore.isWallpaperDrawer && <Wallpaper />}
          {toolbarStore.isWidgetDrawer && <WidgetList />}
        </Suspense>
      </Drawer>
    </>
  )
}

export default observer(Header)
