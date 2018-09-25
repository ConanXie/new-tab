import * as React from "react"

import withStyles, { WithStyles, StyleRulesCallback } from "@material-ui/core/styles/withStyles"
import Paper from "@material-ui/core/Paper"

const styles: StyleRulesCallback = theme => ({
  root: {
    width: "680px",
    margin:  `${theme.spacing.unit * 3}px auto`,
    "&:first-of-type": {
      marginTop: 0
    }
  }
})

type StylesType = "root"

interface PropsType extends WithStyles<StylesType> {
  children: any
}

const SettingsWrap = (props: PropsType) => (
  <Paper elevation={2} component="section" className={props.classes.root}>{props.children}</Paper>
)

export default withStyles(styles)(SettingsWrap)
