import * as React from "react"
import { observer, inject } from "mobx-react"

import Divider from "material-ui/Divider"
import List from "material-ui/List"
import Snackbar from "material-ui/Snackbar"

import makeDumbProps from "utils/makeDumbProps"
import { sendMessage } from "utils/message"
import { toBase64 } from "utils/fileConversions"

import { WallpaperStore } from "../../../store/wallpaper"
import WallpaperSwitch from "./components/WallpaperSwitch"
import TypeMenu from "./components/TypeMenu"
import SelectImage from "./components/SelectImage"
import FetchImage from "./components/FetchImage"
import SelectColor from "./components/SelectColor"
import SaveImage from "./components/SaveImage"
import DarkIcons from "./components/DarkIcons"
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

  private handleWallpaperSwitchChange = () => {
    this.props.wallpaperStore.useWallpaper = !this.props.wallpaperStore.useWallpaper
  }
  private handleTypeChange = (value: number) => {
    this.props.wallpaperStore.wallpaperType = value
  }

  private handleWallpaperUpdate = async (file: File | Blob) => {
    URL.revokeObjectURL(this.props.wallpaperStore.wallpaper)
    const url = URL.createObjectURL(file)
    // Update wallpaper
    this.props.wallpaperStore.wallpaper = url
    // Sync update
    sendMessage("updateWallpaper", url)

    // Save base64 data to storage
    const base64 = await toBase64(file)
    sendMessage("saveWallpaper", base64)
  }

  private handleColorChange = (color: string) => {
    this.props.wallpaperStore.color = color
  }

  private handleDarkIconsToggle = () => {
    this.props.wallpaperStore.darkIcons = !this.props.wallpaperStore.darkIcons
  }

  public render() {
    const {
      useWallpaper,
      wallpaperType,
      wallpaper,
      color,
      darkIcons,
      disabledImage,
      disabledColor
    } = this.props.wallpaperStore

    return (
      <div>
        <List>
          <WallpaperSwitch
            checked={useWallpaper}
            onChange={this.handleWallpaperSwitchChange}
          />
          <Divider />
          <TypeMenu
            disabled={disabledImage && disabledColor}
            type={wallpaperType}
            onChange={this.handleTypeChange}
          />
          <Divider />
          <SelectImage
            disabled={disabledImage}
            onChange={this.handleWallpaperUpdate}
            onError={this.showMessage}
          />
          <Divider />
          <FetchImage
            disabled={disabledImage}
            onChange={this.handleWallpaperUpdate}
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
            onChange={this.handleColorChange}
          />
          <Divider />
          <DarkIcons
            onChange={this.handleDarkIconsToggle}
            checked={darkIcons}
          />
          <Divider />
        </List>
        <Snackbar
          open={this.state.snackbarOpen}
          autoHideDuration={2000}
          onClose={this.handleSnackbarClose}
          message={<span>{this.state.message}</span>}
        />
      </div>
    )
  }
}

export default makeDumbProps(Wallpaper)
