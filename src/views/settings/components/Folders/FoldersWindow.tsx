import React, { useState } from "react"
import { observer, useLocalStore } from "mobx-react-lite"

import { Theme } from "@mui/material/styles"
import makeStyles from "@mui/styles/makeStyles"
import createStyles from "@mui/styles/createStyles"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction"
import Divider from "@mui/material/Divider"

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
