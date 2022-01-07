import React, { FC } from "react"
import classNames from "classnames"

import createStyles from "@mui/styles/createStyles"
import makeStyles from "@mui/styles/makeStyles"
import LinearProgress from "@mui/material/LinearProgress"

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
