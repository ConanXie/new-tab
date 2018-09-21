import * as React from "react"
import * as classNames from "classnames"

import withStyles, { WithStyles, StyleRules } from "@material-ui/core/styles/withStyles"
import LinearProgress from "@material-ui/core/LinearProgress"

type StylesType = "root" | "hide"
const styles: StyleRules<StylesType> = {
  root: {
    position: "absolute",
    bottom: 0,
    width: "100%"
  },
  hide: {
    opacity: 0
  }
}

interface PropsType {
  fetching: boolean,
  progress: number
}

class FetchProgress extends React.Component<WithStyles<StylesType> & PropsType> {
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
