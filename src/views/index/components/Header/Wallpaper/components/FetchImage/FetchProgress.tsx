import React from "react"
import classNames from "classnames"

import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles"
import createStyles from "@material-ui/core/styles/createStyles"
import LinearProgress from "@material-ui/core/LinearProgress"

const styles = createStyles({
  root: {
    position: "absolute",
    bottom: 0,
    width: "100%"
  },
  hide: {
    opacity: 0
  }
})

interface PropsType extends WithStyles<typeof styles> {
  fetching: boolean
  progress: number
}

class FetchProgress extends React.PureComponent<PropsType> {
  public render() {
    const { fetching, progress, classes } = this.props
    return (
      <LinearProgress
        className={classNames(!fetching && classes.hide)}
        classes={{ root: classes.root }}
        variant="determinate"
        value={progress}
      />
    )
  }
}

export default withStyles(styles)(FetchProgress)
