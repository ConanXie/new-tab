import * as React from "react"
import { observer, inject } from "mobx-react"

import Switch from "material-ui/Switch"
import Divider from "material-ui/Divider"
import List, {
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from "material-ui/List"
import Snackbar from "material-ui/Snackbar"

import makeDumbProps from "utils/makeDumbProps"
import { sendMessage } from "utils/message"
import { toBase64 } from "utils/fileConversions"

import { WallpaperStore } from "../../../store/wallpaper"
import TypeMenu from "./components/TypeMenu"
import SelectImage from "./components/SelectImage"
import FetchImage from "./components/FetchImage"
import SelectColor from "./components/SelectColor"
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

  private handleToggle = () => {
    this.props.wallpaperStore.useWallpaper = !this.props.wallpaperStore.useWallpaper
  }
  private handleTypeChange = (value: number) => {
    this.props.wallpaperStore.wallpaperType = value
  }

  private handleWallpaperUpdate = async (file: File | Blob) => {
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

  public render() {
    const { wallpaperStore } = this.props

    return (
      <div>
        <List>
          <ListItem button onClick={this.handleToggle}>
            <ListItemText primary={chrome.i18n.getMessage("desktop_wallpaper_label")} />
            <ListItemSecondaryAction>
              <Switch checked={wallpaperStore.useWallpaper} onChange={this.handleToggle} />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />
          <TypeMenu type={wallpaperStore.wallpaperType} onChange={this.handleTypeChange} />
          <Divider />
          <SelectImage onChange={this.handleWallpaperUpdate} onError={this.showMessage} />
          <Divider />
          <FetchImage onChange={this.handleWallpaperUpdate} onError={this.showMessage} />
          <Divider />
          <SelectColor onChange={this.handleColorChange} color={wallpaperStore.color} />
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
