import React from "react"

import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles"
import createStyles from "@material-ui/core/styles/createStyles"
import { Theme } from "@material-ui/core/styles/createMuiTheme"
import Paper from "@material-ui/core/Paper"

const styles = ({ spacing, palette }: Theme) =>
  createStyles({
    root: {
      maxWidth: 840,
      boxSizing: "border-box",
      margin: `${spacing(3)}px 0`,
      border: `1px solid ${palette.divider}`,
      overflow: "hidden",
      "&:first-of-type": {
        marginTop: 0,
      },
    },
  })

interface PropsType extends WithStyles<typeof styles> {
  children: React.ReactNode
}

const SettingsWrap = (props: PropsType) => (
  <Paper elevation={0} component="section" className={props.classes.root}>
    {props.children}
  </Paper>
)

export default withStyles(styles)(SettingsWrap)
