import * as React from "react"
import { inject, observer } from "mobx-react"

import List, {
  ListItem,
  ListItemText
} from "material-ui/List"

import ColorPicker from "../../../components/ColorPicker"

import { Theme as ThemeSettings } from "stores/theme"

interface PropsType {
  themeSettings: ThemeSettings
}

@inject("themeSettings")
@observer
class Theme extends React.Component<PropsType> {
  public state = {
    open: false
  }
  private openColorPicker = () => {
    this.setState({ open: true })
  }
  private closeColorPicker = (color?: string) => {
    this.setState({ open: false })

    if (color) {
      this.props.themeSettings.themeColor = color
    }
  }
  public render() {
    return (
      <div>
        <List>
          <ListItem button onClick={this.openColorPicker}>
            <ListItemText
              primary={chrome.i18n.getMessage("settings_theme_switch_label")}
              secondary={this.props.themeSettings.themeColor}
            />
          </ListItem>
        </List>
        <ColorPicker
          color={this.props.themeSettings.themeColor}
          open={this.state.open}
          onClose={this.closeColorPicker}
        />
      </div>
    )
  }
}

export default Theme
