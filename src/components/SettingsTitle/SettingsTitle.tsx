import React, { FC, ReactNode } from "react"

import { Theme } from "@mui/material/styles"
import makeStyles from "@mui/styles/makeStyles"
import createStyles from "@mui/styles/createStyles"
import Typography from "@mui/material/Typography"

const useStyles = makeStyles(({ spacing }: Theme) =>
  createStyles({
    root: {
      padding: `${spacing(2)} ${spacing(2)} ${spacing(1)}`,
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

const SettingsTitle: FC<Props> = ({ primary, secondary, children }) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Typography variant="h5">{primary || children}</Typography>
      {secondary && (
        <Typography variant="body2" className={classes.secondary}>
          {secondary}
        </Typography>
      )}
    </div>
  )
}

export default SettingsTitle
