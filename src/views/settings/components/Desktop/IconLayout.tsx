import React, { useState } from "react"
import { observer, useLocalStore } from "mobx-react-lite"

import { makeStyles, createStyles, Theme } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import Switch from "@material-ui/core/Switch"
import Divider from "@material-ui/core/Divider"

import ColorPicker from "components/ColorPicker"
import SettingsTitle from "components/SettingsTitle"

import { wallpaperStore, desktopSettings } from "../../store"

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
      height: "100%",
    },
    shortcut: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
    shortcutIcon: {
      position: "relative",
      width: "5.5vw",
      height: "5.5vw",
      maxWidth: 96,
      maxHeight: 96,
      minWidth: 48,
      minHeight: 48,
      "& > img": {
        width: "100%",
        height: "100%",
        objectFit: "cover",
      },
    },
    shortcutLabel: {
      marginTop: spacing(1),
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

const shortcuts = [
  {
    icon: "google",
    label: "Google",
  },
  {
    icon: "twitter",
    label: "Twitter",
  },
  {
    icon: "amazon",
    label: "Amazon",
  },
  {
    icon: "youtube",
    label: "Youtube",
  },
]

const IconLayout = observer(() => {
  const { wallpaperStyles } = useLocalStore(() => wallpaperStore)
  const {
    shortcutLabel,
    shortcutLabelColor,
    shortcutLabelShadow,
    disabledLabelOptions,
    toggleShortcutLabel,
    saveShortcutLabelColor,
    toggleShortcutLabelShadow,
  } = useLocalStore(() => desktopSettings)
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
          {shortcuts.map(({ icon, label }, index) => (
            <div
              className={classes.shortcut}
              style={{ gridArea: `1 / ${index + 1} / auto / auto` }}
              key={index}
            >
              <div className={classes.shortcutIcon}>
                <img src={chrome.runtime.getURL(`icons/${icon}.png`)} alt="" />
              </div>
              {shortcutLabel && (
                <Typography
                  className={classes.shortcutLabel}
                  variant="subtitle1"
                  style={{
                    color: shortcutLabelColor,
                    textShadow: shortcutLabelShadow ? `0 1px 2px rgba(0, 0, 0, 0.36)` : "",
                  }}
                >
                  {label}
                </Typography>
              )}
            </div>
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
          <ListItemText primary={chrome.i18n.getMessage("settings_desktop_shortcut_label_shadow")} />
          <ListItemSecondaryAction>
            <Switch color="primary" checked={shortcutLabelShadow} onChange={toggleShortcutLabelShadow} />
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
