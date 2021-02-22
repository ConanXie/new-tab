import React, { FC } from "react"
import { useLocalStore, observer } from "mobx-react"

import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import Switch from "@material-ui/core/Switch"

import SettingsTitle from "components/SettingsTitle"

import { foldersSettings } from "../../store"

const WindowEffect: FC = () => {
  const { acrylicEffect, toggleAcrylicEffect } = useLocalStore(() => foldersSettings)

  return (
    <>
      <SettingsTitle>{chrome.i18n.getMessage("settings_effect")}</SettingsTitle>
      <List>
        <ListItem button onClick={toggleAcrylicEffect}>
          <ListItemText
            primary={chrome.i18n.getMessage("settings_folders_acrylic")}
            secondary={chrome.i18n.getMessage("settings_folders_acrylic_secondary")}
          />
          <ListItemSecondaryAction>
            <Switch color="primary" checked={acrylicEffect} onChange={toggleAcrylicEffect} />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    </>
  )
}

export default observer(WindowEffect)
