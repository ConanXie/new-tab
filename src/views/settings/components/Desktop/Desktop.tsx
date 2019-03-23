import React from "react"
import { observer, useObservable } from "mobx-react-lite"

import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import Switch from "@material-ui/core/Switch"
// import Divider from "@material-ui/core/Divider"

import Wrap from "../../Layout/SettingsWrap"

import { desktopSettings } from "../../store"

const Desktop = observer(() => {

  const { toolbar, toggleToolbar } = useObservable(desktopSettings)

  return (
    <Wrap>
      <List>
        <ListItem button onClick={toggleToolbar}>
          <ListItemText
            primary={chrome.i18n.getMessage("settings_desktop_toolbar")}
            secondary={chrome.i18n.getMessage("settings_desktop_toolbar_secondary")}
          />
          <ListItemSecondaryAction>
            <Switch
              color="primary"
              checked={toolbar}
              onChange={toggleToolbar}
            />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    </Wrap>
  )
})

export default Desktop
