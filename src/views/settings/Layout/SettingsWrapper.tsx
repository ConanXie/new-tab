import React, { FC } from "react"

import { Theme } from "@mui/material/styles"
import makeStyles from "@mui/styles/makeStyles"
import createStyles from "@mui/styles/createStyles"
import Paper from "@mui/material/Paper"

import { WRAPPER_MAX_WIDTH } from "./Layout"

const useStyles = makeStyles(({ spacing, palette }: Theme) =>
  createStyles({
    root: {
      maxWidth: WRAPPER_MAX_WIDTH,
      boxSizing: "border-box",
      margin: `${spacing(3)} 0`,
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

const SettingsWrapper: FC<Props> = (props) => {
  const classes = useStyles()

  return (
    <Paper elevation={0} component="section" className={classes.root}>
      {props.children}
    </Paper>
  )
}

export default SettingsWrapper
