import React, { FC } from "react"

import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction"
import Switch from "@mui/material/Switch"

import Item from "./Item"

interface Props {
  checked: boolean
  onChange(): void
}

const WallpaperSwitch: FC<Props> = (props) => (
  <Item
    primary={chrome.i18n.getMessage("desktop_wallpaper_label")}
    onClick={props.onChange}
  >
    <ListItemSecondaryAction>
      <Switch checked={props.checked} onChange={props.onChange} color="primary" />
    </ListItemSecondaryAction>
  </Item>
)

export default WallpaperSwitch
