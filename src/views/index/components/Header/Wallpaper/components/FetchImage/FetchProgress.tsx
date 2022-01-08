import React, { FC } from "react"
import LinearProgress from "@mui/material/LinearProgress"

interface Props {
  fetching: boolean
  progress: number
}

const FetchProgress: FC<Props> = ({ fetching, progress }) => {
  return (
    <LinearProgress
      variant="determinate"
      value={progress}
      sx={{
        position: "absolute",
        bottom: 0,
        width: "100%",
        opacity: fetching ? 1 : 0,
      }}
    />
  )
}

export default FetchProgress
