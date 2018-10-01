import * as React from "react"
import { inject, observer } from "mobx-react"

import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import Switch from "@material-ui/core/Switch"
import Divider from "@material-ui/core/Divider"
import Checkbox from "@material-ui/core/Checkbox"

import ColorPicker from "components/ColorPicker"
import Wrap from "../Layout/SettingsWrap"

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
      this.props.themeStore.saveColor(color.toUpperCase())
    }
  }
  public render() {
    const {
      color,
      nightMode,
      darkToolbar,
      toggleNightMode,
      toggleDarkToolbar,
    } = this.props.themeStore
    return (
      <React.Fragment>
        <Wrap>
          <List>
            <ListItem button onClick={this.openColorPicker}>
              <ListItemText
                primary={chrome.i18n.getMessage("settings_theme_switch_label")}
                secondary={this.props.themeStore.color}
              />
            </ListItem>
          </List>
        </Wrap>
        <ColorPicker
          color={color}
          open={this.state.open}
          onClose={this.closeColorPicker}
        />
        <Wrap>
          <List>
            <ListItem button onClick={toggleNightMode}>
              <ListItemText
                primary={chrome.i18n.getMessage("settings_night_mode_label")}
              />
              <ListItemSecondaryAction>
                <Switch checked={nightMode} color="primary" onChange={toggleNightMode} />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
            <ListItem button onClick={toggleDarkToolbar}>
              <ListItemText
                primary={chrome.i18n.getMessage("settings_night_mode_on_toolbar")}
                secondary={chrome.i18n.getMessage("settings_night_mode_on_toolbar_secondary")}
              />
              <ListItemSecondaryAction>
                {/* <Switch checked={nightMode} color="primary" onChange={toggleNightMode} /> */}
                <Checkbox checked={darkToolbar} color="primary" onChange={toggleDarkToolbar} />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </Wrap>
      </React.Fragment>
    )
  }
}

export default Theme
