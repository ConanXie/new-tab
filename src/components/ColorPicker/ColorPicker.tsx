import React, { useState, useEffect, FC } from "react"

import { ChromePicker, CirclePicker, ColorResult } from "react-color"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"

interface Props {
  color: string
  open: boolean
  onClose: (color?: string) => void
}

const ColorPicker: FC<Props> = ({ open, color: initColor, onClose }) => {
  const [color, setColor] = useState("")

  useEffect(() => {
    if (open) {
      setColor(initColor)
    }
  }, [open, initColor])

  function handleColorChange(result: ColorResult) {
    setColor(result.hex)
  }

  function handleClose() {
    onClose()
  }

  function handleDone() {
    onClose(color)
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{chrome.i18n.getMessage("color_picker_title")}</DialogTitle>
      <DialogContent>
        <ChromePicker color={color} onChange={handleColorChange} disableAlpha={true} />
        <CirclePicker color={color} onChange={handleColorChange} />
      </DialogContent>
      <DialogActions>
        <Button color="primary" size="small" onClick={handleClose}>
          {chrome.i18n.getMessage("button_cancel")}
        </Button>
        <Button color="primary" id="ok" size="small" onClick={handleDone} autoFocus>
          {chrome.i18n.getMessage("button_done")}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ColorPicker
