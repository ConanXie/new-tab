import React, { FC } from "react"

import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"

export interface SettingsItemType {
  icon: React.ComponentType
  text: string
  onClick: () => void
}

interface Props {
  items: SettingsItemType[]
}

/**
 * Settings item component in the drawer
 */
const SettingsList: FC<Props> = (props) => (
  <List>
    {props.items.map((item) => (
      <ListItem key={item.text} button onClick={item.onClick}>
        <ListItemIcon>
          <item.icon />
        </ListItemIcon>
        <ListItemText primary={item.text} />
      </ListItem>
    ))}
  </List>
)

export default SettingsList
