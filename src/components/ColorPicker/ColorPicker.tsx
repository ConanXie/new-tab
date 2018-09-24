import * as React from "react"

import { ChromePicker, CirclePicker, ColorResult } from "react-color"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"

interface PropsType {
  color: string
  open: boolean
  onClose(color?: string): void
}

class ColorPicker extends React.Component<PropsType> {
  public state = {
    color: this.props.color
  }
  private stageColor = (result: ColorResult) => {
    this.setState({ color: result.hex })
  }
  private handleCancel = () => {
    this.props.onClose()
  }
  private handleOK = () => {
    this.props.onClose(this.state.color)
  }
  public render() {
    const { color } = this.state

    return (
      <Dialog
        open={this.props.open}
        onClose={this.handleCancel}
      >
        <DialogTitle>{chrome.i18n.getMessage("color_picker_title")}</DialogTitle>
        <DialogContent>
          <ChromePicker color={color} onChangeComplete={this.stageColor} disableAlpha={true} />
          <CirclePicker color={color} onChangeComplete={this.stageColor} />
        </DialogContent>
        <DialogActions>
          <Button size="small" onClick={this.handleCancel}>
            {chrome.i18n.getMessage("button_cancel")}
          </Button>
          <Button id="ok" size="small" onClick={this.handleOK} autoFocus>
            {chrome.i18n.getMessage("button_done")}
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default ColorPicker
