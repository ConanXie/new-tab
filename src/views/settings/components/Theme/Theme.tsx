import * as React from "react"
import { inject, observer } from "mobx-react"

import { WithStyles, StyleRulesCallback, withStyles } from "@material-ui/core/styles"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import Switch from "@material-ui/core/Switch"
import Divider from "@material-ui/core/Divider"
import Checkbox from "@material-ui/core/Checkbox"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"

import ColorPicker from "components/ColorPicker"
import Wrap from "../../Layout/SettingsWrap"
import NightTime from "./NightTime"

import { ThemeStore, nightModeStatus, modeType } from "stores/theme"

const styles: StyleRulesCallback = theme => ({
  color: {
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4,
    marginRight: 12,
    border: "2px solid #bfbfbf",
    borderRadius: "50%",
    backgroundColor: theme.palette.primary.main,
    cursor: "pointer",
  },
  paper: {
    width: 200,
  },
})
interface PropsType extends WithStyles<typeof styles> {
  themeStore: ThemeStore
}

@inject("themeStore")
@observer
class Theme extends React.Component<PropsType> {
  public state = {
    colorPickerOpen: false,
    anchorEl: null,
    nightTimeOpen: false,
  }
  public openColorPicker = () => {
    this.setState({ colorPickerOpen: true })
  }
  public closeColorPicker = (color?: string) => {
    this.setState({ colorPickerOpen: false })

    if (color) {
      this.props.themeStore.saveColor(color.toUpperCase())
    }
  }
  public handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
    this.setState({ anchorEl: event.currentTarget })
  }
  public handleModeMenuClose = () => {
    this.setState({ anchorEl: null })
  }
  public handleModeMenuClick = (value: modeType) => {
    this.setState({ anchorEl: null })
    this.props.themeStore.changeNightMode(value)
  }

  public handleMenuItemClick = (value: modeType) => () => this.handleModeMenuClick(value)

  /**
   * open night time edit dialog
   */
  public editNightTime = () => {
    this.setState({ nightTimeOpen: true })
  }
  /**
   * change night time
   */
  public handleNightTimeChanged = (times: string[]) => {
    this.setState({ nightTimeOpen: false })
    if (times) {
      this.props.themeStore.setNightTime(times)
    }
  }

  public render() {
    const {
      color,
      whiteToolbar,
      nightMode,
      nightModeText,
      nightTime,
      darkToolbar,
      toggleWhiteToolbar,
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
              <ListItemSecondaryAction>
                <div onClick={this.openColorPicker} className={this.props.classes.color} />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
            <ListItem button onClick={toggleWhiteToolbar}>
              <ListItemText
                primary={chrome.i18n.getMessage("settings_theme_white_toolbar")}
              />
              <ListItemSecondaryAction>
                <Switch checked={whiteToolbar} color="primary" onChange={toggleWhiteToolbar} />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </Wrap>
        <ColorPicker
          color={color}
          open={this.state.colorPickerOpen}
          onClose={this.closeColorPicker}
        />
        <Wrap>
          <List>
            <ListItem button onClick={this.handleClickListItem}>
              <ListItemText
                primary={chrome.i18n.getMessage("settings_night_mode_label")}
                secondary={nightModeText}
              />
            </ListItem>
            <Menu
              anchorEl={this.state.anchorEl}
              open={Boolean(this.state.anchorEl)}
              onClose={this.handleModeMenuClose}
              classes={{ paper: this.props.classes.paper }}
            >
              {nightModeStatus.map(({ status, text }) => (
                <MenuItem
                  key={status}
                  selected={status === nightMode}
                  onClick={this.handleMenuItemClick(status)}
                >
                  {text}
                </MenuItem>
              ))}
            </Menu>
            <Divider />
            <ListItem button onClick={this.editNightTime} disabled={nightMode !== 2}>
              <ListItemText
                primary={chrome.i18n.getMessage("settings_night_mode_custom_primary")}
                secondary={chrome.i18n.getMessage(
                  "settings_night_mode_custom_secondary",
                  `${nightTime[0]} – ${nightTime[1]}`
                )}
              />
            </ListItem>
            <NightTime
              open={this.state.nightTimeOpen}
              times={nightTime}
              onClose={this.handleNightTimeChanged}
            />
            <Divider />
            <ListItem button onClick={toggleDarkToolbar}>
              <ListItemText
                primary={chrome.i18n.getMessage("settings_night_mode_toolbar")}
                secondary={chrome.i18n.getMessage("settings_night_mode_toolbar_secondary")}
              />
              <ListItemSecondaryAction>
                <Checkbox checked={darkToolbar} color="primary" onChange={toggleDarkToolbar} />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </Wrap>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(Theme)
