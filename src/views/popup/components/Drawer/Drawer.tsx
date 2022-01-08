import React, { FC } from "react"

import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"

const Drawer: FC = () => {
  return (
    <Box
      sx={{
        height: "100%",
        backgroundColor: "background.paper",
      }}
    >
      <Typography variant="h1" color="primary">
        Drawer
      </Typography>
    </Box>
  )
}

export default Drawer
