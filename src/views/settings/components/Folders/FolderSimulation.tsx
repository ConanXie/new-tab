import React from "react"
import { observer, useLocalObservable } from "mobx-react-lite"

import { Theme } from "@mui/material/styles"

import makeStyles from "@mui/styles/makeStyles"
import createStyles from "@mui/styles/createStyles"

import { wallpaperStore } from "../../store"
import { folder } from "../Desktop/IconLayout"
import Wrap from "../../../index/components/Desktop/Wrap"
import Folder from "../../../index/components/Desktop/Folder"
import "../../../index/components/Desktop/style"

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
  }),
)

const FolderSimulation = observer(() => {
  const { wallpaperStyles } = useLocalObservable(() => wallpaperStore)

  const classes = useStyles()

  return (
    <div id="desktop" className={classes.desktop}>
      <div className={classes.desktopBg} style={wallpaperStyles} />
      <Wrap {...folder}>
        <Folder open {...folder} fixed />
      </Wrap>
    </div>
  )
})

export default FolderSimulation
