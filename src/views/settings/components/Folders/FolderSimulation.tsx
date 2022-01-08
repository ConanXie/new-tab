import React from "react"
import { observer, useLocalObservable } from "mobx-react-lite"

import Box from "@mui/material/Box"

import { wallpaperStore } from "../../store"
import { folder } from "../Desktop/IconLayout"
import Wrap from "../../../index/components/Desktop/Wrap"
import Folder from "../../../index/components/Desktop/Folder"
import "../../../index/components/Desktop/style"

const FolderSimulation = observer(() => {
  const { wallpaperStyles } = useLocalObservable(() => wallpaperStore)

  return (
    <Box
      id="desktop"
      sx={({ spacing }) => ({
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: spacing(48),
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
      <Wrap {...folder}>
        <Folder open {...folder} fixed />
      </Wrap>
    </Box>
  )
})

export default FolderSimulation
