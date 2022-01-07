import React, { FC } from "react"

import Typography from "@mui/material/Typography"
import makeStyles from "@mui/styles/makeStyles"
import createStyles from "@mui/styles/createStyles"
import { Theme } from "@mui/material/styles"

const useStyles = makeStyles(({ palette }: Theme) =>
  createStyles({
    drawer: {
      height: "100%",
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
