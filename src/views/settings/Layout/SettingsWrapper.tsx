import React, { FC } from "react"

import Paper from "@mui/material/Paper"

import { WRAPPER_MAX_WIDTH } from "./Layout"

interface Props {
  children: React.ReactNode
}

const SettingsWrapper: FC<Props> = (props) => {
  return (
    <Paper
      elevation={0}
      component="section"
      sx={({ spacing, palette }) => ({
        maxWidth: `${WRAPPER_MAX_WIDTH}px`,
        boxSizing: "border-box",
        margin: `${spacing(3)} 0`,
        border: `1px solid ${palette.divider}`,
        overflow: "hidden",
        "&:first-of-type": {
          marginTop: 0,
        },
      })}
    >
      {props.children}
    </Paper>
  )
}

export default SettingsWrapper
