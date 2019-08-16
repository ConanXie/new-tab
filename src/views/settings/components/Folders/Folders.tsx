import React from "react"
import { observer, useLocalStore } from "mobx-react-lite"

import { makeStyles, createStyles, Theme } from "@material-ui/core/styles"
import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"

import Wrap from "../../Layout/SettingsWrap"

import { wallpaperStore, folersSettings } from "../../store"
import { shortcuts } from "../Desktop/IconLayout"

const useStyles = makeStyles(({ spacing }: Theme) =>
  createStyles({
    desktop: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: spacing(48),
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
    folder: {
      position: "relative",
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      padding: spacing(1),
    },
    shortcut: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: spacing(2),
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

const Folder = observer(() => {
  const { wallpaperStyles } = useLocalStore(() => wallpaperStore)
  const { shortcutLabel, shortcutLabelColor, shortcutLabelShadow } = useLocalStore(
    () => folersSettings,
  )

  const classes = useStyles()

  return (
    <>
      <Wrap>
        <div className={classes.desktop}>
          <div className={classes.desktopBg} style={wallpaperStyles} />
          <Paper elevation={8} className={classes.folder}>
            {shortcuts.map(({ icon, label }, index) => (
              <div className={classes.shortcut} key={index}>
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
          </Paper>
        </div>
      </Wrap>
    </>
  )
})

export default Folder
