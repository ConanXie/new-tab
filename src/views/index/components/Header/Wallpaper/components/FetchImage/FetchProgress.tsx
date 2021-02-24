import React, { FC } from "react"
import classNames from "classnames"

import createStyles from "@material-ui/core/styles/createStyles"
import makeStyles from "@material-ui/core/styles/makeStyles"
import LinearProgress from "@material-ui/core/LinearProgress"

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      position: "absolute",
      bottom: 0,
      width: "100%",
    },
    hide: {
      opacity: 0,
    },
  }),
)

interface Props {
  fetching: boolean
  progress: number
}

const FetchProgress: FC<Props> = ({ fetching, progress }) => {
  const classes = useStyles()
  return (
    <LinearProgress
      className={classNames(!fetching && classes.hide)}
      classes={{ root: classes.root }}
      variant="determinate"
      value={progress}
    />
  )
}

export default FetchProgress
