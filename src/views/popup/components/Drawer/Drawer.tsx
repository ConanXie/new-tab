import React from "react"

import Typography from "@material-ui/core/Typography"
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles"
import createStyles from "@material-ui/core/styles/createStyles"
import { Theme } from "@material-ui/core/styles/createMuiTheme"

const styles = ({ palette }: Theme) => createStyles({
  drawer: {
    minHeight: "100%",
    background: palette.background.default,
  },
})

class Drawer extends React.Component<WithStyles<typeof styles>> {
  public render() {
    const { classes } = this.props
    return (
      <div className={classes.drawer}>
        <Typography variant="h1" color="primary">Drawer</Typography>
      </div>
    )
  }
}

export default withStyles(styles)(Drawer)
