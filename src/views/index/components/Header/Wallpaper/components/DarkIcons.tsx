import React from "react"

import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import Switch from "@material-ui/core/Switch"

import Item, { ItemPropsType } from "./Item"

interface PropsType extends ItemPropsType {
  checked: boolean
  onChange(): void
}

const DarkIcons = (props: PropsType) => (
  <Item
    disabled={props.disabled}
    primary={chrome.i18n.getMessage("wallpaper_dark_icons")}
    secondary={chrome.i18n.getMessage("wallpaper_dark_icons_descr")}
    onClick={props.onChange}
  >
    <ListItemSecondaryAction>
      <Switch checked={props.checked} onClick={props.onChange} color="primary" />
    </ListItemSecondaryAction>
  </Item>
)

export default DarkIcons
