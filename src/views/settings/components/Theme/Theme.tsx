import React, { FC, useState } from "react"
import { observer, useLocalObservable } from "mobx-react"

import { Theme as MuiTheme } from "@mui/material/styles"
import makeStyles from "@mui/styles/makeStyles"
import createStyles from "@mui/styles/createStyles"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction"
import Divider from "@mui/material/Divider"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"

import ColorPicker from "components/ColorPicker"
import Wrapper from "../../Layout/SettingsWrapper"
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

const Theme: FC = () => {
  const classes = useStyles()
  const [colorPickerOpen, setColorPickerOpen] = useState(false)
  const [nightTimeOpen, setNightTimeOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<EventTarget & HTMLElement>()

  const { color, nightMode, nightModeText, nightTime, saveColor, setNightTime, changeNightMode } =
    useLocalObservable(() => themeStore)

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
    setAnchorEl(undefined)
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
  function handleNightTimeChanged(times?: string[]) {
    setNightTimeOpen(false)
    if (times) {
      setNightTime(times)
    }
  }

  return (
    <>
      <Wrapper>
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
        </List>
      </Wrapper>
      <ColorPicker color={color} open={colorPickerOpen} onClose={closeColorPicker} />
      <Wrapper>
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
          <ListItem button onClick={editNightTime} disabled={nightMode !== NightModeStatus.Custom}>
            <ListItemText
              primary={chrome.i18n.getMessage("settings_night_mode_custom_primary")}
              secondary={chrome.i18n.getMessage(
                "settings_night_mode_custom_secondary",
                `${nightTime[0]} – ${nightTime[1]}`,
              )}
            />
          </ListItem>
          <NightTime open={nightTimeOpen} times={nightTime} onClose={handleNightTimeChanged} />
        </List>
      </Wrapper>
    </>
  )
}

export default observer(Theme)
