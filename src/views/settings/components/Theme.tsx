import * as React from "react"
import { inject, observer } from "mobx-react"

import List, {
  ListItem,
  ListItemText
} from "material-ui/List"

import ColorPicker from "../../../components/ColorPicker"

import { ThemeStore } from "stores/theme"

interface PropsType {
  themeStore: ThemeStore
}

@inject("themeStore")
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
      this.props.themeStore.color = color
    }
  }
  public render() {
    return (
      <div>
        <List>
          <ListItem button onClick={this.openColorPicker}>
            <ListItemText
              primary={chrome.i18n.getMessage("settings_theme_switch_label")}
              secondary={this.props.themeStore.color}
            />
          </ListItem>
        </List>
        <ColorPicker
          color={this.props.themeStore.color}
          open={this.state.open}
          onClose={this.closeColorPicker}
        />
      </div>
    )
  }
}

export default Theme
