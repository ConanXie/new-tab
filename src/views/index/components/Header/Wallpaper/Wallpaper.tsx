import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"

import Divider from "@material-ui/core/Divider"
import List from "@material-ui/core/List"
import Snackbar from "@material-ui/core/Snackbar"

import { wallpaperStore, desktopStore } from "../../../store"
import WallpaperSwitch from "./components/WallpaperSwitch"
import TypeMenu from "./components/TypeMenu"
import SelectImage from "./components/SelectImage"
import FetchImage from "./components/FetchImage"
import SelectColor from "./components/SelectColor"
import SaveImage from "./components/SaveImage"
import DarkIcons from "./components/DarkIcons"
import BlurImage from "./components/BlurImage"
import Brightness from "./components/Brightness"

const Wallpaper: FC = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [message, setMessage] = useState("")

  const closeSnackbar = () => {
    setSnackbarOpen(false)
  }

  const handleSnackbarClose = (event: React.SyntheticEvent<any>, reason: string) => {
    if (reason === "clickaway") {
      return
    }
    closeSnackbar()
  }

  const showMessage = (message: string) => {
    setSnackbarOpen(true)
    setMessage(message)
  }

  const {
    useWallpaper,
    wallpaperType,
    wallpaper,
    color,
    darkIcons,
    blurRadius,
    backgroundBrightness,
    disabledImage,
    disabledColor,
    wallpaperSwitch,
    changeWallpaperType,
    updateWallpaper,
    handleColorChange,
    toggleDarkIcons,
    handleBlurChange,
    handleBackgroundBrightnessChange,
  } = wallpaperStore

  return (
    <>
      <List>
        <WallpaperSwitch checked={useWallpaper} onChange={wallpaperSwitch} />
        <TypeMenu
          disabled={disabledImage && disabledColor}
          type={wallpaperType}
          onChange={changeWallpaperType}
        />
        <SelectImage
          disabled={disabledImage}
          onChange={updateWallpaper}
          onError={showMessage}
        />
        <FetchImage
          disabled={disabledImage}
          onChange={updateWallpaper}
          onError={showMessage}
        />
        <SaveImage disabled={disabledImage} url={wallpaper} />
        <BlurImage disabled={disabledImage} value={blurRadius} onChange={handleBlurChange} />
        <SelectColor disabled={disabledColor} color={color} onChange={handleColorChange} />
        <Divider />
        <Brightness value={backgroundBrightness} onChange={handleBackgroundBrightnessChange} />
        <DarkIcons
          disabled={!desktopStore.toolbar}
          onChange={toggleDarkIcons}
          checked={darkIcons}
        />
      </List>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        message={message}
      />
    </>
  )
}

export default observer(Wallpaper)
