import React from "react"

import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles"
import createStyles from "@material-ui/core/styles/createStyles"
import { Theme } from "@material-ui/core/styles/createMuiTheme"
import Paper from "@material-ui/core/Paper"

const styles = ({ spacing }: Theme) => createStyles({
  root: {
    width: "680px",
    margin:  `${spacing.unit * 3}px auto`,
    "&:first-of-type": {
      marginTop: 0
    }
  }
})

interface PropsType extends WithStyles<typeof styles> {
  children: React.ReactNode
}

const SettingsWrap = (props: PropsType) => (
  <Paper elevation={2} component="section" className={props.classes.root}>{props.children}</Paper>
)

export default withStyles(styles)(SettingsWrap)
