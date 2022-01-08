import React, { FC, useState } from "react"
import { observer, useLocalObservable } from "mobx-react"

import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction"
import Divider from "@mui/material/Divider"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Box from "@mui/material/Box"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"
import ToggleButton from "@mui/material/ToggleButton"
import Tooltip from "@mui/material/Tooltip"
import WallpaperOutlinedIcon from "@mui/icons-material/WallpaperOutlined"
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined"

import ColorPicker from "components/ColorPicker"
import Wrapper from "../../Layout/SettingsWrapper"
import NightTime from "./NightTime"

import themeStore, { nightModeMenu, NightModeStatus, ThemeSource } from "store/theme"
import ColorIndicator from "../Folders/ColorIndicator"
import { wallpaperStore } from "../../store"
import SettingsTitle from "components/SettingsTitle"

const Theme: FC = () => {
  const [colorPickerOpen, setColorPickerOpen] = useState(false)
  const [nightTimeOpen, setNightTimeOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<EventTarget & HTMLElement>()

  const {
    color: themeColor,
    nightMode,
    nightModeText,
    nightTime,
    themeSource,
    wallpaperPalette,
    customColor,
    setNightTime,
    changeNightMode,
    changeThemeSource,
    saveCustomColor,
    applyThemeColor,
  } = useLocalObservable(() => themeStore)

  const { wallpaperStyles } = useLocalObservable(() => wallpaperStore)

  function openColorPicker() {
    setColorPickerOpen(true)
  }

  function closeColorPicker(color?: string) {
    setColorPickerOpen(false)

    if (color) {
      saveCustomColor(color.toUpperCase())
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
        <Box
          sx={({ spacing }) => ({
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: spacing(40),
            overflow: "hidden",
          })}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              zIndex: 0,
              backgroundPosition: "center",
              backgroundSize: "cover",
              ...wallpaperStyles,
            }}
          />
        </Box>
        <SettingsTitle>Theme source</SettingsTitle>
        <ToggleButtonGroup
          exclusive
          value={themeSource}
          onChange={(_, value) => changeThemeSource(value)}
          sx={{
            ml: 2,
            mt: 1,
          }}
        >
          <ToggleButton value={ThemeSource.Wallpaper}>
            <Tooltip enterDelay={300} title="Wallpaper">
              <WallpaperOutlinedIcon />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value={ThemeSource.Custom}>
            <Tooltip enterDelay={300} title="Custom">
              <PaletteOutlinedIcon />
            </Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>
        {themeSource == ThemeSource.Wallpaper && (
          <Box
            sx={{
              mx: 2,
              my: 1.5,
              fontSize: 0,
            }}
          >
            {wallpaperPalette.map((color) => (
              <Box
                key={color}
                sx={{
                  position: "relative",
                  display: "inline-block",
                  width: 48,
                  height: 48,
                  mr: 2,
                  my: 1,
                  borderRadius: "50%",
                  backgroundColor: color,
                  "&:active": {
                    transform: "scale(0.98)",
                  },
                  "&::after": {
                    content: "''",
                    position: "absolute",
                    bottom: -10,
                    left: "50%",
                    transform: `translateX(-50%) scale(${themeColor == color ? 1 : 0})`,
                    width: 8,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: "primary.main",
                    transition: "all 260ms ease-out",
                  },
                }}
                onClick={() => applyThemeColor(color)}
              ></Box>
            ))}
          </Box>
        )}
        {themeSource == ThemeSource.Custom && (
          <List>
            <ListItem button onClick={openColorPicker}>
              <ListItemText primary="Custom theme main color" secondary={customColor} />
              <ListItemSecondaryAction>
                <ColorIndicator backgroundColor={customColor} onClick={openColorPicker} />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        )}
      </Wrapper>
      <ColorPicker color={customColor} open={colorPickerOpen} onClose={closeColorPicker} />
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
            sx={{
              "& .MuiList-root": {
                width: 200,
              },
            }}
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
