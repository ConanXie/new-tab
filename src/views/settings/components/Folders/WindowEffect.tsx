import React, { FC } from "react"
import { useLocalStore, observer } from "mobx-react"

import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction"
import Switch from "@mui/material/Switch"

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
