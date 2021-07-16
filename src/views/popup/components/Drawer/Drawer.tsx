import React, { FC } from "react"

import Typography from "@material-ui/core/Typography"
import { makeStyles, createStyles } from "@material-ui/core/styles"
import { Theme } from "@material-ui/core/styles"

const useStyles = makeStyles(({ palette }: Theme) =>
  createStyles({
    drawer: {
      minHeight: "100%",
      background: palette.background.default,
    },
  }),
)

const Drawer: FC = () => {
  const classes = useStyles()
  return (
    <div className={classes.drawer}>
      <Typography variant="h1" color="primary">
        Drawer
      </Typography>
    </div>
  )
}

export default Drawer
