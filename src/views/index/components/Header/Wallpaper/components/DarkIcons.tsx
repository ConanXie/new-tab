import * as React from "react"

import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from "material-ui/List"

import Switch from "material-ui/Switch"
import { ItemPropsType } from "../types"

interface PropsType extends ItemPropsType {
  checked: boolean
  onChange(): void
}

class DarkIcons extends React.Component<PropsType> {
  private handleToggle = () => {
    this.props.onChange()
  }
  public render() {
    return (
      <ListItem button onClick={this.handleToggle}>
        <ListItemText
          primary={chrome.i18n.getMessage("wallpaper_dark_icons")}
          secondary={chrome.i18n.getMessage("wallpaper_dark_icons_descr")}
        />
        <ListItemSecondaryAction>
          <Switch checked={this.props.checked} />
        </ListItemSecondaryAction>
      </ListItem>
    )
  }
}

export default DarkIcons
