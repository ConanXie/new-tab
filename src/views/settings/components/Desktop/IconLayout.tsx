import React from "react"
import { observer, useLocalStore } from "mobx-react-lite"

import { makeStyles, createStyles, Theme } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import Switch from "@material-ui/core/Switch"
import Divider from "@material-ui/core/Divider"

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
    icon: "youtube_2",
    label: "Youtube",
  },
]

const IconLayout = observer(() => {
  const { wallpaperStyles } = useLocalStore(() => wallpaperStore)
  const { shortcutLabel, shortcutColor, toggleShortcutLabel } = useLocalStore(() => desktopSettings)
  const classes = useStyles()

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
                <Typography className={classes.shortcutLabel} variant="subtitle1" style={{ color: shortcutColor }}>
                  {label}
                </Typography>
              )}
            </div>
          ))}
        </div>
      </div>
      <List>
        <ListItem button onClick={toggleShortcutLabel}>
          <ListItemText primary={chrome.i18n.getMessage("settings_desktop_shortcut_label")} />
          <ListItemSecondaryAction>
            <Switch color="primary" checked={shortcutLabel} onChange={toggleShortcutLabel} />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    </>
  )
})

export default IconLayout
