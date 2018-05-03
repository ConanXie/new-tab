import * as React from "react"
import { inject, observer } from "mobx-react"

import List, {
  ListItem,
  ListItemText
} from "material-ui/List"

import ColorPicker from "../../../components/ColorPicker"

import { Settings as SettingsType } from "../store/Settings"

interface PropTypes {
  settings: SettingsType
}

@inject("settings")
@observer
class Theme extends React.Component<PropTypes> {
  public state = {
    open: false
  }
  private openColorPicker = () => {
    this.setState({ open: true })
  }
  private closeColorPicker = (color?: string) => {
    this.setState({ open: false })

    if (color) {
      this.props.settings.themeColor = color
    }
  }
  public render() {
    return (
      <div>
        <List>
          <ListItem button onClick={this.openColorPicker}>
            <ListItemText
              primary={chrome.i18n.getMessage("settings_theme_switch_label")}
              secondary={this.props.settings.themeColor}
            />
          </ListItem>
        </List>
        <ColorPicker
          color={this.props.settings.themeColor}
          open={this.state.open}
          onClose={this.closeColorPicker}
        />
      </div>
    )
  }
}

export default Theme
