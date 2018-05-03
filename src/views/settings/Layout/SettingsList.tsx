import * as React from "react"

import List, {
  ListItem,
  ListItemIcon,
  ListItemText
} from "material-ui/List"

export interface SettingsItemType {
  icon: React.ComponentType,
  text: string
  onClick(): Promise<void>
}

/**
 * Settings item component in the drawer
 */
export default (props: { items: SettingsItemType[] }) => (
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
