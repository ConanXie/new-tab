import * as React from "react"

import Switch from "material-ui/Switch"
import Divider from "material-ui/Divider"
import List, {
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from "material-ui/List"

class Wallpaper extends React.Component {
  public state = {
    useWallpaper: false
  }
  private handleToggle = () => {
    this.setState({
      useWallpaper: !this.state.useWallpaper
    })
  }
  public render() {
    return (
      <List>
        <ListItem button onClick={this.handleToggle}>
          <ListItemText primary={chrome.i18n.getMessage("desktop_wallpaper_label")} />
          <ListItemSecondaryAction>
            <Switch checked={this.state.useWallpaper} onChange={this.handleToggle} />
          </ListItemSecondaryAction>
        </ListItem>
        <Divider />
        <ListItem button onClick={this.handleToggle}>
          <ListItemText primary={chrome.i18n.getMessage("desktop_top_shadow_label")} />
          <ListItemSecondaryAction>
            <Switch checked={this.state.useWallpaper} onChange={this.handleToggle} />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    )
  }
}

export default Wallpaper
