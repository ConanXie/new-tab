import React from "react"

import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"

export interface SettingsItemType {
  icon: React.ComponentType
  text: string
  onClick: () => void
}

/**
 * Settings item component in the drawer
 */
const SettingsList = (props: { items: SettingsItemType[] }) => (
  <List>
    {props.items.map(item => (
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
