import * as React from "react"

import ColorPicker from "components/ColorPicker"

import Item, { ItemPropsType } from "./Item"

interface PropsType extends ItemPropsType {
  color: string
  onChange(value: string): void
}

class SelectColor extends React.Component<PropsType> {
  public state = {
    open: false
  }
  private openColorPicker = () => {
    this.setState({ open: true })
  }
  private closeColorPicker = (color?: string) => {
    this.setState({ open: false })

    if (color) {
      this.props.onChange(color)
    }
  }
  public render() {
    return (
      <React.Fragment>
        <Item
          disabled={this.props.disabled}
          primary={chrome.i18n.getMessage("wallpaper_color")}
          secondary={this.props.color}
          onClick={this.openColorPicker}
        />
        <ColorPicker
          color={this.props.color}
          open={this.state.open}
          onClose={this.closeColorPicker}
        />
      </React.Fragment>
    )
  }
}

export default SelectColor
