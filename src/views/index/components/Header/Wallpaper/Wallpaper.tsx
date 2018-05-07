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

import { Wallpaper as WallpaperType } from "../../../store/wallpaper"
import TypeMenu from "./components/TypeMenu"
import SelectImage from "./components/SelectImage"
import FetchImage from "./components/FetchImage"
import SelectColor from "./components/SelectColor"
interface PropsType {
  wallpaper: WallpaperType
}

@inject("wallpaper") @observer
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
    this.props.wallpaper.saveUseWallpaper(!this.props.wallpaper.useWallpaper)
  }
  private handleTypeChange = (value: number) => {
    this.props.wallpaper.saveWallpaperType(value)
  }

  private handleWallpaperUpdate = async (file: File | Blob) => {
    const url = URL.createObjectURL(file)
    // Update wallpaper
    this.props.wallpaper.wallpaper = url
    localStorage.setItem("wallpaper", url)
    sendMessage("updateWallpaper", url)

    // Save base64 data to storage
    const base64 = await toBase64(file)
    sendMessage("saveWallpaper", base64)
  }

  private handleColorChange = (color: string) => {
    this.props.wallpaper.color = color
  }

  public render() {
    const { wallpaper } = this.props

    return (
      <div>
        <List>
          <ListItem button onClick={this.handleToggle}>
            <ListItemText primary={chrome.i18n.getMessage("desktop_wallpaper_label")} />
            <ListItemSecondaryAction>
              <Switch checked={wallpaper.useWallpaper} onChange={this.handleToggle} />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />
          <TypeMenu type={wallpaper.wallpaperType} onChange={this.handleTypeChange} />
          <Divider />
          <SelectImage onChange={this.handleWallpaperUpdate} onError={this.showMessage} />
          <Divider />
          <FetchImage onChange={this.handleWallpaperUpdate} onError={this.showMessage} />
          <Divider />
          <SelectColor onChange={this.handleColorChange} color={wallpaper.color} />
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
