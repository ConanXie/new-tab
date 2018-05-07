import * as React from "react"

import List, {
  ListItem,
  ListItemText
} from "material-ui/List"

import ColorPicker from "components/ColorPicker"

interface PropsType {
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
        <List>
          <ListItem button onClick={this.openColorPicker}>
            <ListItemText
              primary={chrome.i18n.getMessage("wallpaper_solid_color_primary")}
              secondary={this.props.color}
            />
          </ListItem>
        </List>
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
