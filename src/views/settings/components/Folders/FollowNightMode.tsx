import React from "react"
import { observer, useLocalStore } from "mobx-react-lite"

import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction"
import Switch from "@mui/material/Switch"
import Divider from "@mui/material/Divider"

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
