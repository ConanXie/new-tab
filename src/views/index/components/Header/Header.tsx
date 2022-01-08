import "./style"

import React, { Suspense, useMemo } from "react"
import { observer, useLocalObservable } from "mobx-react-lite"
import classNames from "classnames"

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

function Header() {
  const wallpaperState = useLocalObservable(() => wallpaperStore)

  function handleWallpaperIconClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.currentTarget.blur()
    toolbarStore.loadAndOpenWallpaperDrawer()
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
            boxShadow: 0,
          }}
        >
          <Toolbar
            sx={{
              justifyContent: "flex-end",
            }}
          >
            <Tooltip enterDelay={300} title="Wallpaper">
              <IconButton onClick={handleWallpaperIconClick} size="large">
                <WallpaperIcon sx={iconStyles} />
              </IconButton>
            </Tooltip>
            <Tooltip enterDelay={300} title="Widgets">
              <IconButton size="large">
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
        open={toolbarStore.wallpaperDrawerOpen}
        onClose={toolbarStore.closeWallpaperDrawer}
        sx={[
          {
            "& .MuiPaper-root": {
              backgroundColor: "transparent",
              width: 360,
              overflowX: "hidden",
              boxShadow: "none",
            },
          },
          {
            "& .MuiPaper-root": desktopSettings.acrylicWallpaperDrawer ? acrylicBg : null,
          },
        ]}
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
