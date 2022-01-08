import React, { FC } from "react"
import Box from "@mui/material/Box"

interface Props {
  onClick: () => void
  backgroundColor?: string
  disabled?: boolean
}

const ColorIndicator: FC<Props> = (props) => {
  return (
    <Box
      component="button"
      onClick={props.onClick}
      disabled={props.disabled}
      sx={({ spacing }) => ({
        boxSizing: "border-box",
        width: spacing(4),
        height: spacing(4),
        marginRight: "12px",
        border: "2px solid #bfbfbf",
        borderRadius: "50%",
        outline: "none",
        backgroundColor: props.backgroundColor || "primary.main",
      })}
    />
  )
}

export default ColorIndicator
