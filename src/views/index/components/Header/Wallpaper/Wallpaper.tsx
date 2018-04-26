import * as React from "react"
import { observer, inject } from "mobx-react"

import Switch from "material-ui/Switch"
import Divider from "material-ui/Divider"
import List, {
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from "material-ui/List"

import { Wallpaper as WallpaperType } from "../../../store/wallpaper"
import TypeMenu from "./components/TypeMenu"
interface PropTypes {
  wallpaper: WallpaperType
}

@inject("wallpaper") @observer
class Wallpaper extends React.Component<PropTypes> {
  public state = {}
  private handleToggle = () => {
    this.props.wallpaper.saveUseWallpaper(!this.props.wallpaper.useWallpaper)
  }
  private handleTypeChange = (value: number) => {
    this.props.wallpaper.saveWallpaperType(value)
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
        </List>
      </div>
    )
  }
}

export default Wallpaper
