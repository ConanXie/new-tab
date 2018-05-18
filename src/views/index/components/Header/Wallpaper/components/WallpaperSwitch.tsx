import * as React from "react"

import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import Switch from "@material-ui/core/Switch"

import Item from "./Item"

interface PropsType {
  checked: boolean
  onChange(): void
}

export default (props: PropsType) => (
  <Item
    primary={chrome.i18n.getMessage("desktop_wallpaper_label")}
    onClick={props.onChange}
  >
    <ListItemSecondaryAction>
      <Switch checked={props.checked} onChange={props.onChange} color="primary" />
    </ListItemSecondaryAction>
  </Item>
)
