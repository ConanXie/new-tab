import React, { useState, FC } from "react"
import Loadable from "react-loadable"
import Color from "color"
import { observer } from "mobx-react"

import Typography from "@mui/material/Typography"
import Drawer from "@mui/material/Drawer"
import Divider from "@mui/material/Divider"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import ColorLensIcon from "@mui/icons-material/ColorLensOutlined"
import ViewModuleIcon from "@mui/icons-material/ViewModuleOutlined"
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUncheckedOutlined"
import InfoIcon from "@mui/icons-material/InfoOutlined"
import Box from "@mui/material/Box"

export const WRAPPER_MAX_WIDTH = 840
export const NAV_WIDTH = 280

const Theme = Loadable({
  loader: () => import("../components/Theme"),
  loading: () => null,
})

const Desktop = Loadable({
  loader: () => import("../components/Desktop"),
  loading: () => null,
})

const Folders = Loadable({
  loader: () => import("../components/Folders"),
  loading: () => null,
})

const About = Loadable({
  loader: () => import("../components/About"),
  loading: () => null,
})

interface SettingsNav {
  text: string
  icon: React.ComponentType<any>
  component: React.ComponentType<any>
}

const settingsNav: (SettingsNav | undefined)[] = [
  {
    text: chrome.i18n.getMessage("settings_theme"),
    icon: ColorLensIcon,
    component: Theme,
  },
  {
    text: chrome.i18n.getMessage("settings_desktop"),
    icon: ViewModuleIcon,
    component: Desktop,
  },
  {
    text: chrome.i18n.getMessage("settings_folders"),
    icon: RadioButtonUncheckedIcon,
    component: Folders,
  },
  undefined,
  {
    text: chrome.i18n.getMessage("settings_about"),
    icon: InfoIcon,
    component: About,
  },
]

const Layout: FC = () => {
  const [current, setCurrent] = useState(0)

  const Component = settingsNav[current]!.component

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          "& .MuiPaper-root": {
            zIndex: 0,
            minWidth: NAV_WIDTH,
            borderRight: "none",
          },
        }}
      >
        <Typography
          variant="h6"
          color="textPrimary"
          noWrap
          sx={{
            display: "flex",
            alignItems: "center",
            height: 64,
            pl: 2,
          }}
        >
          {chrome.i18n.getMessage("settings_toolbar_title")}
        </Typography>
        <List>
          {settingsNav.map((item, index) => {
            if (!item) {
              return (
                <Divider
                  sx={{
                    my: 1,
                  }}
                  key={index}
                />
              )
            }
            return (
              <ListItem
                key={index}
                button
                component="li"
                sx={[
                  ({ spacing, palette }) => ({
                    borderTopRightRadius: spacing(6),
                    borderBottomRightRadius: spacing(6),
                    background:
                      current === index ? Color(palette.primary.main).alpha(0.15).toString() : null,
                    "& .MuiListItemText-root": {
                      color: current === index ? "primary.main" : null,
                    },
                    "& .MuiSvgIcon-root": {
                      fill: current === index ? palette.primary.main : null,
                    },
                  }),
                ]}
                onClick={() => setCurrent(index)}
              >
                <ListItemIcon>
                  <item.icon />
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            )
          })}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          marginLeft: `${NAV_WIDTH}px`,
          backgroundColor: "background.paper",
        }}
      >
        <Box
          sx={({ spacing }) => ({
            boxSizing: "border-box",
            maxWidth: `${WRAPPER_MAX_WIDTH + NAV_WIDTH + parseInt(spacing(6)) * 2}px`,
            px: 6,
            py: 8,
            margin: "0 auto",
            height: "100vh",
            overflow: "auto",
          })}
        >
          {Component && <Component />}
        </Box>
      </Box>
    </>
  )
}

export default observer(Layout)
