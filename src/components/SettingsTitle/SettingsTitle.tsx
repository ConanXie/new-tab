import React, { ReactNode } from "react"

import { makeStyles, createStyles, Theme } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"

const useStyles = makeStyles(({ spacing }: Theme) =>
  createStyles({
    root: {
      padding: `${spacing(2)}px ${spacing(2)}px ${spacing(1)}px`,
    },
    secondary: {
      paddingTop: spacing(1),
    },
  }),
)

interface Props {
  primary?: string
  secondary?: string
  children?: ReactNode
}

function SettingsTitle({ primary, secondary, children }: Props) {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Typography variant="h5">{primary || children}</Typography>
      {secondary && <Typography variant="body2" className={classes.secondary}>{secondary}</Typography>}
    </div>
  )
}

export default SettingsTitle
