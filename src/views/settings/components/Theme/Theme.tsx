import React, { useState } from "react"
import { useLocalStore } from "mobx-react-lite"

import { makeStyles, createStyles, Theme as MuiTheme } from "@material-ui/core/styles"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import Switch from "@material-ui/core/Switch"
import Divider from "@material-ui/core/Divider"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"

import ColorPicker from "components/ColorPicker"
import Wrap from "../../Layout/SettingsWrap"
import NightTime from "./NightTime"

import themeStore, { nightModeMenu, NightModeStatus } from "store/theme"

const useStyles = makeStyles(({ spacing, palette }: MuiTheme) =>
  createStyles({
    color: {
      boxSizing: "border-box",
      width: spacing(4),
      height: spacing(4),
      marginRight: 12,
      border: "2px solid #bfbfbf",
      borderRadius: "50%",
      backgroundColor: palette.primary.main,
      cursor: "pointer",
    },
    paper: {
      width: 200,
    },
  }),
)

function Theme() {
  const classes = useStyles()
  const [colorPickerOpen, setColorPickerOpen] = useState(false)
  const [nightTimeOpen, setNightTimeOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState()

  const {
    color,
    whiteToolbar,
    nightMode,
    nightModeText,
    nightTime,
    darkToolbar,
    applyNightMode,
    toggleWhiteToolbar,
    toggleDarkToolbar,
    saveColor,
    setNightTime,
    changeNightMode,
  } = useLocalStore(() => themeStore)

  function openColorPicker() {
    setColorPickerOpen(true)
  }

  function closeColorPicker(color?: string) {
    setColorPickerOpen(false)

    if (color) {
      saveColor(color.toUpperCase())
    }
  }

  function handleClickListItem(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget)
  }

  function handleModeMenuClose() {
    setAnchorEl(null)
  }

  function handleModeMenuClick(value: NightModeStatus) {
    handleModeMenuClose()
    changeNightMode(value)
  }

  const handleMenuItemClick = (value: NightModeStatus) => () => handleModeMenuClick(value)

  /**
   * open night time edit dialog
   */
  function editNightTime() {
    setNightTimeOpen(true)
  }

  /**
   * change night time
   * @param times start and end time
   */
  function handleNightTimeChanged(times: string[]) {
    setNightTimeOpen(false)
    if (times) {
      setNightTime(times)
    }
  }

  return (
    <>
      <Wrap>
        <List>
          <ListItem button onClick={openColorPicker}>
            <ListItemText
              primary={chrome.i18n.getMessage("settings_theme_switch_label")}
              secondary={color}
            />
            <ListItemSecondaryAction>
              <div onClick={openColorPicker} className={classes.color} />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />
          <ListItem button disabled={applyNightMode && darkToolbar} onClick={toggleWhiteToolbar}>
            <ListItemText primary={chrome.i18n.getMessage("settings_theme_white_toolbar")} />
            <ListItemSecondaryAction>
              <Switch
                color="primary"
                checked={whiteToolbar}
                disabled={applyNightMode && darkToolbar}
                onChange={toggleWhiteToolbar}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Wrap>
      <ColorPicker
        color={color}
        open={colorPickerOpen}
        onClose={closeColorPicker}
      />
      <Wrap>
        <List>
          <ListItem button onClick={handleClickListItem}>
            <ListItemText
              primary={chrome.i18n.getMessage("settings_night_mode_label")}
              secondary={nightModeText}
            />
          </ListItem>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleModeMenuClose}
            classes={{ paper: classes.paper }}
          >
            {nightModeMenu.map(({ status, text }) => (
              <MenuItem
                key={status}
                selected={status === nightMode}
                onClick={handleMenuItemClick(status)}
              >
                {text}
              </MenuItem>
            ))}
          </Menu>
          <Divider />
          <ListItem button onClick={editNightTime} disabled={nightMode !== 2}>
            <ListItemText
              primary={chrome.i18n.getMessage("settings_night_mode_custom_primary")}
              secondary={chrome.i18n.getMessage(
                "settings_night_mode_custom_secondary",
                `${nightTime[0]} – ${nightTime[1]}`,
              )}
            />
          </ListItem>
          <NightTime
            open={nightTimeOpen}
            times={nightTime}
            onClose={handleNightTimeChanged}
          />
          <Divider />
          <ListItem button disabled={!applyNightMode} onClick={toggleDarkToolbar}>
            <ListItemText
              primary={chrome.i18n.getMessage("settings_night_mode_toolbar")}
              secondary={chrome.i18n.getMessage("settings_night_mode_toolbar_secondary")}
            />
            <ListItemSecondaryAction>
              <Switch
                color="primary"
                disabled={!applyNightMode}
                checked={darkToolbar}
                onChange={toggleDarkToolbar}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Wrap>
    </>
  )
}

export default Theme
