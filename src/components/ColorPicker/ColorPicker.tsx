import * as React from "react"

import { ChromePicker, CirclePicker, ColorResult } from "react-color"
import Button from "material-ui/Button"
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from "material-ui/Dialog"

interface PropsType {
  color: string
  open: boolean
  onClose(color?: string): void
}

class ColorPicker extends React.Component<PropsType> {
  state = {
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
        <DialogTitle>Color Picker</DialogTitle>
        <DialogContent>
          <ChromePicker color={color} onChangeComplete={this.stageColor} disableAlpha={true} />
          <CirclePicker color={color} onChangeComplete={this.stageColor} />
        </DialogContent>
        <DialogActions>
          <Button size="small" onClick={this.handleCancel} color="primary">
            {chrome.i18n.getMessage("button_cancel")}
          </Button>
          <Button id="ok" size="small" onClick={this.handleOK} color="primary" autoFocus>
            {chrome.i18n.getMessage("button_confirm")}
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default ColorPicker
