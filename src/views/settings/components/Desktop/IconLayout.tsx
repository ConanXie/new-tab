import React, { useState } from "react"
import { observer, useLocalObservable } from "mobx-react-lite"

import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction"
import Switch from "@mui/material/Switch"
import Divider from "@mui/material/Divider"
import Box from "@mui/material/Box"

import ColorPicker from "components/ColorPicker"
import SettingsTitle from "components/SettingsTitle"

import { wallpaperStore, desktopSettings } from "../../store"
import { Desktop, Shortcut } from "../../../index/store/desktop"
import Wrap from "../../../index/components/Desktop/Wrap"
import Website from "../../../index/components/Desktop/Website"
import "../../../index/components/Desktop/style"
import ColorIndicator from "../Folders/ColorIndicator"

export const shortcuts: Shortcut[] = [
  {
    id: "i001",
    label: "Steam",
    url: "https://www.steampowered.com",
  },
  {
    id: "i002",
    label: "Youtube",
    url: "https://www.youtube.com",
  },
  {
    id: "i003",
    label: "Twitter",
    url: "https://www.twitter.com",
  },
  {
    id: "i004",
    label: "Google",
    url: "https://www.google.com",
  },
]

export const folder: Desktop = {
  type: 1,
  row: 1,
  column: 1,
  id: "folder-sample",
  shortcuts,
}

const IconLayout = observer(() => {
  const { wallpaperStyles } = useLocalObservable(() => wallpaperStore)
  const {
    shortcutLabel,
    shortcutLabelColor,
    shortcutLabelShadow,
    disabledLabelOptions,
    toggleShortcutLabel,
    saveShortcutLabelColor,
    toggleShortcutLabelShadow,
  } = useLocalObservable(() => desktopSettings)
  const [colorPickerOpen, setColorPickerOpen] = useState(false)

  function handleColorPickerClose(color?: string) {
    setColorPickerOpen(false)
    if (color) {
      saveShortcutLabelColor(color)
    }
  }

  return (
    <>
      <Box
        sx={({ spacing }) => ({
          position: "relative",
          height: spacing(30),
          overflow: "hidden",
        })}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: 0,
            backgroundPosition: "center",
            backgroundSize: "cover",
            ...wallpaperStyles,
          }}
        />
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            height: "100%",
          }}
        >
          {shortcuts.map(({ id, label, url }, index) => (
            <Wrap row={1} column={index + 1} key={id}>
              <Website
                id={id}
                label={label}
                url={url}
                itemId={id}
                index={0}
                onClick={(e) => e.preventDefault()}
              />
            </Wrap>
          ))}
        </Box>
      </Box>
      <SettingsTitle>{chrome.i18n.getMessage("settings_desktop_shortcut_title")}</SettingsTitle>
      <List>
        <ListItem button onClick={toggleShortcutLabel}>
          <ListItemText primary={chrome.i18n.getMessage("settings_desktop_shortcut_label")} />
          <ListItemSecondaryAction>
            <Switch color="primary" checked={shortcutLabel} onChange={toggleShortcutLabel} />
          </ListItemSecondaryAction>
        </ListItem>
        <Divider />
        <ListItem button disabled={disabledLabelOptions} onClick={() => setColorPickerOpen(true)}>
          <ListItemText
            primary={chrome.i18n.getMessage("settings_desktop_shortcut_label_color")}
            secondary={shortcutLabelColor}
          />
          <ListItemSecondaryAction>
            <ColorIndicator
              backgroundColor={shortcutLabelColor}
              onClick={() => setColorPickerOpen(true)}
              disabled={disabledLabelOptions}
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
        color={shortcutLabelColor}
        open={colorPickerOpen}
        onClose={handleColorPickerClose}
      />
    </>
  )
})

export default IconLayout
