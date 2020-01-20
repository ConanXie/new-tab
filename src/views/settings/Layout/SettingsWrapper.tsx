import React from "react"

import { Theme, makeStyles, createStyles } from "@material-ui/core/styles"
import Paper from "@material-ui/core/Paper"

import { WRAPPER_MAX_WIDTH } from "./Layout"

const useStyles = makeStyles(({ spacing, palette }: Theme) =>
  createStyles({
    root: {
      maxWidth: WRAPPER_MAX_WIDTH,
      boxSizing: "border-box",
      margin: `${spacing(3)}px 0`,
      border: `1px solid ${palette.divider}`,
      overflow: "hidden",
      "&:first-of-type": {
        marginTop: 0,
      },
    },
  }),
)

interface Props {
  children: React.ReactNode
}

function SettingsWrapper(props: Props) {
  const classes = useStyles()

  return (
    <Paper elevation={0} component="section" className={classes.root}>
      {props.children}
    </Paper>
  )
}

export default SettingsWrapper
