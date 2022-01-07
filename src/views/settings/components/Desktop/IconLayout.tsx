import React, { useState } from "react"
import { observer, useLocalObservable } from "mobx-react-lite"

import { makeStyles, createStyles, Theme } from "@material-ui/core/styles"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import Switch from "@material-ui/core/Switch"
import Divider from "@material-ui/core/Divider"

import ColorPicker from "components/ColorPicker"
import SettingsTitle from "components/SettingsTitle"

import { wallpaperStore, desktopSettings } from "../../store"
import { Desktop, Shortcut } from "../../../index/store/desktop"
import Wrap from "../../../index/components/Desktop/Wrap"
import Website from "../../../index/components/Desktop/Website"
import "../../../index/components/Desktop/style"

const useStyles = makeStyles(({ spacing }: Theme) =>
  createStyles({
    desktop: {
      position: "relative",
      height: spacing(30),
      overflow: "hidden",
    },
    desktopBg: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      zIndex: 0,
      backgroundPosition: "center",
      backgroundSize: "cover",
    },
    wrapper: {
      position: "relative",
      zIndex: 1,
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      height: "100%",
    },
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
  const classes = useStyles()
  const [colorPickerOpen, setColorPickerOpen] = useState(false)

  function handleColorPickerClose(color?: string) {
    setColorPickerOpen(false)
    if (color) {
      saveShortcutLabelColor(color)
    }
  }

  return (
    <>
      <div className={classes.desktop}>
        <div className={classes.desktopBg} style={wallpaperStyles} />
        <div className={classes.wrapper}>
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
        </div>
      </div>
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
            <button
              className={classes.colorIndicator}
              style={{ backgroundColor: shortcutLabelColor }}
              disabled={disabledLabelOptions}
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
        color={shortcutLabelColor}
        open={colorPickerOpen}
        onClose={handleColorPickerClose}
      />
    </>
  )
})

export default IconLayout
