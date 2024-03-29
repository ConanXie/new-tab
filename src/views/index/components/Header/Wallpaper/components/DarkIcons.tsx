import React, { FC } from "react"

import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction"
import Switch from "@mui/material/Switch"

import Item, { ItemProps } from "./Item"

interface Props extends ItemProps {
  checked: boolean
  onChange(): void
}

const DarkIcons: FC<Props> = (props: Props) => (
  <Item
    disabled={props.disabled}
    primary={chrome.i18n.getMessage("wallpaper_dark_icons")}
    secondary={chrome.i18n.getMessage("wallpaper_dark_icons_descr")}
    onClick={props.onChange}
  >
    <ListItemSecondaryAction>
      <Switch
        checked={props.checked}
        disabled={props.disabled}
        onClick={props.onChange}
        color="primary"
      />
    </ListItemSecondaryAction>
  </Item>
)

export default DarkIcons
