import React, { useState } from "react"
import { observer, useLocalStore } from "mobx-react-lite"

import { makeStyles, createStyles, Theme } from "@material-ui/core/styles"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import Switch from "@material-ui/core/Switch"
import Divider from "@material-ui/core/Divider"

import ColorPicker from "components/ColorPicker"
import SettingsTitle from "components/SettingsTitle"

import { foldersSettings } from "../../store"
import { useStyles } from "./FoldersWindow"

const IconLayout = observer(() => {
  const [colorPickerOpen, setColorPickerOpen] = useState(false)
  const {
    shortcutLabelColor,
    shortcutLabel,
    shortcutLabelShadow,
    saveShortcutLabelColor,
    toggleShortcutLabel,
    toggleShortcutLabelShadow,
  } = useLocalStore(() => foldersSettings)
  const classes = useStyles()

  function handleColorPickerClose(color?: string) {
    setColorPickerOpen(false)
    if (color) {
      saveShortcutLabelColor(color)
    }
  }

  return (
    <>
      <SettingsTitle>{chrome.i18n.getMessage("settings_desktop_shortcut_title")}</SettingsTitle>
      <List>
        <ListItem button onClick={toggleShortcutLabel}>
          <ListItemText primary={chrome.i18n.getMessage("settings_desktop_shortcut_label")} />
          <ListItemSecondaryAction>
            <Switch color="primary" checked={shortcutLabel} onChange={toggleShortcutLabel} />
          </ListItemSecondaryAction>
        </ListItem>
        <Divider />
        <ListItem button onClick={() => setColorPickerOpen(true)}>
          <ListItemText
            primary={chrome.i18n.getMessage("settings_desktop_shortcut_label_color")}
            secondary={shortcutLabelColor}
          />
          <ListItemSecondaryAction>
            <button
              className={classes.colorIndicator}
              style={{ backgroundColor: shortcutLabelColor }}
              onClick={() => setColorPickerOpen(true)}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <Divider />
        <ListItem button onClick={toggleShortcutLabelShadow}>
          <ListItemText
            primary={chrome.i18n.getMessage("settings_desktop_shortcut_label_shadow")}
          />
          <ListItemSecondaryAction>
            <Switch
              color="primary"
              checked={shortcutLabelShadow}
              onChange={toggleShortcutLabelShadow}
            />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
      <ColorPicker
        open={colorPickerOpen}
        color={shortcutLabelColor}
        onClose={handleColorPickerClose}
      />
    </>
  )
})

export default IconLayout
