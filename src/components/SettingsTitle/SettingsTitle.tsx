import React, { FC, ReactNode } from "react"

import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"

interface Props {
  primary?: string
  secondary?: string
  children?: ReactNode
}

const SettingsTitle: FC<Props> = ({ primary, secondary, children }) => {
  return (
    <Box
      sx={{
        px: 2,
        pt: 2,
        pb: 1,
      }}
    >
      <Typography variant="h5">{primary || children}</Typography>
      {secondary && (
        <Typography
          variant="body2"
          sx={{
            pt: 1,
          }}
        >
          {secondary}
        </Typography>
      )}
    </Box>
  )
}

export default SettingsTitle
