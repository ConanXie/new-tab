import React from "react"
import { observer, useLocalStore } from "mobx-react-lite"

import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import Switch from "@material-ui/core/Switch"
import Divider from "@material-ui/core/Divider"

import { foldersSettings } from "../../store"

export default observer(() => {
  const { followNightMode, toggleFollowNightMode } = useLocalStore(() => foldersSettings)

  return (
    <List>
      <ListItem button onClick={toggleFollowNightMode}>
        <ListItemText
          primary={chrome.i18n.getMessage("settings_folders_night_mode")}
          secondary={chrome.i18n.getMessage("settings_folders_night_mode_ignore")}
        />
        <ListItemSecondaryAction>
          <Switch color="primary" checked={followNightMode} onChange={toggleFollowNightMode} />
        </ListItemSecondaryAction>
      </ListItem>
      <Divider />
    </List>
  )
})
