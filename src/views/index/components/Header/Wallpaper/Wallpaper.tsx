import * as React from "react"
import { observer, inject } from "mobx-react"

import Divider from "@material-ui/core/Divider"
import List from "@material-ui/core/List"
import Snackbar from "@material-ui/core/Snackbar"

import makeDumbProps from "utils/makeDumbProps"

import { WallpaperStore } from "../../../store/wallpaper"
import WallpaperSwitch from "./components/WallpaperSwitch"
import TypeMenu from "./components/TypeMenu"
import SelectImage from "./components/SelectImage"
import FetchImage from "./components/FetchImage"
import SelectColor from "./components/SelectColor"
import SaveImage from "./components/SaveImage"
import DarkIcons from "./components/DarkIcons"
import BlurImage from "./components/BlurImage"
import Brightness from "./components/Brightness"
interface PropsType {
  wallpaperStore: WallpaperStore
}

@inject("wallpaperStore") @observer
class Wallpaper extends React.Component<PropsType> {
  public state = {
    snackbarOpen: false,
    message: ""
  }
  private closeSnackbar = () => {
    this.setState({ snackbarOpen: false })
  }
  private handleSnackbarClose = (event: React.SyntheticEvent<any>, reason: string) => {
    if (reason === "clickaway") {
      return
    }
    this.closeSnackbar()
  }
  private showMessage = (message: string) => {
    this.setState({
      snackbarOpen: true,
      message
    })
  }

  public render() {
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
    } = this.props.wallpaperStore

    return (
      <>
        <List>
          <WallpaperSwitch
            checked={useWallpaper}
            onChange={wallpaperSwitch}
          />
          <Divider />
          <TypeMenu
            disabled={disabledImage && disabledColor}
            type={wallpaperType}
            onChange={changeWallpaperType}
          />
          <Divider />
          <SelectImage
            disabled={disabledImage}
            onChange={updateWallpaper}
            onError={this.showMessage}
          />
          <Divider />
          <FetchImage
            disabled={disabledImage}
            onChange={updateWallpaper}
            onError={this.showMessage}
          />
          <Divider />
          <SaveImage
            disabled={disabledImage}
            url={wallpaper}
          />
          <Divider />
          <SelectColor
            disabled={disabledColor}
            color={color}
            onChange={handleColorChange}
          />
          <Divider />
          <DarkIcons
            onChange={toggleDarkIcons}
            checked={darkIcons}
          />
          <Divider />
          <BlurImage
            disabled={disabledImage}
            value={blurRadius}
            onChange={handleBlurChange}
          />
          <Divider />
          <Brightness
            value={backgroundBrightness}
            onChange={handleBackgroundBrightnessChange}
          />
          <Divider />
        </List>
        <Snackbar
          open={this.state.snackbarOpen}
          autoHideDuration={2000}
          onClose={this.handleSnackbarClose}
          message={this.state.message}
        />
      </>
    )
  }
}

export default makeDumbProps(Wallpaper)
