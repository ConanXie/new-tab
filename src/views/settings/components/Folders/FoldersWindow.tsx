import React, { useState } from "react"
import { observer, useLocalStore } from "mobx-react-lite"

import { makeStyles, createStyles, Theme } from "@material-ui/core/styles"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import Divider from "@material-ui/core/Divider"

import ColorPicker from "components/ColorPicker"
import SettingsTitle from "components/SettingsTitle"

import { foldersSettings } from "../../store"

export const useStyles = makeStyles(({ spacing }: Theme) =>
  createStyles({
    colorIndicator: {
      boxSizing: "border-box",
      width: spacing(4),
      height: spacing(4),
      marginRight: 12,
      border: "2px solid #bfbfbf",
      borderRadius: "50%",
      outline: "none",
    },
  }),
)

const FoldersWindow = observer(() => {
  const [colorPickerOpen, setColorPickerOpen] = useState(false)
  const { backgroundColor, saveBackgroundColor } = useLocalStore(() => foldersSettings)
  const classes = useStyles()

  function handleColorPickerClose(color?: string) {
    setColorPickerOpen(false)
    if (color) {
      saveBackgroundColor(color)
    }
  }

  return (
    <>
      <SettingsTitle>{chrome.i18n.getMessage("settings_folders_window")}</SettingsTitle>
      <List>
        <ListItem button onClick={() => setColorPickerOpen(true)}>
          <ListItemText
            primary={chrome.i18n.getMessage("settings_folders_window_background_color")}
            secondary={backgroundColor}
          />
          <ListItemSecondaryAction>
            <button
              className={classes.colorIndicator}
              style={{ backgroundColor: backgroundColor }}
              onClick={() => setColorPickerOpen(true)}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <Divider />
      </List>
      <ColorPicker
        open={colorPickerOpen}
        color={backgroundColor}
        onClose={handleColorPickerClose}
      />
    </>
  )
})

export default FoldersWindow
