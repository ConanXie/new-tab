import React, { useState } from "react"
import { useSnackbar } from "notistack"
import clsx from "clsx"
import Loadable from "react-loadable"
import Color from "color"

import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import Drawer from "@material-ui/core/Drawer"
import Divider from "@material-ui/core/Divider"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import ColorLensIcon from "@material-ui/icons/ColorLensOutlined"
import ViewModuleIcon from "@material-ui/icons/ViewModuleOutlined"
import InfoIcon from "@material-ui/icons/InfoOutlined"
import { makeStyles, withTheme, createStyles, Theme as MuiTheme } from "@material-ui/core/styles"

const useStyles = makeStyles(({ spacing, palette, overrides }: MuiTheme) =>
  createStyles({
    layout: {},
    appbar: {
      boxShadow: "none",
    },
    drawerPaper: {
      top: 64,
      minWidth: 280,
      borderRight: "none",
    },
    menuListItem: {
      borderTopRightRadius: spacing(6),
      borderBottomRightRadius: spacing(6),
    },
    menuActiveColor: {
      color: (overrides!.MuiButton!.textPrimary as React.CSSProperties)!.color,
    },
    menuActiveBg: {
      background: Color(palette.primary.main).alpha(0.15).toString(),
    },
    menuDivider: {
      margin: `${spacing(1)}px 0`,
    },
    main: {
      marginLeft: 280,
      backgroundColor: palette.background.paper,
    },
    content: {
      boxSizing: "border-box",
      maxWidth: 1120,
      padding: `${spacing(1)}px ${spacing(6)}px`,
      margin: "0 auto",
      height: `calc(100vh - ${spacing(8)}px)`,
      overflow: "auto",
    },
  })
)

const Theme = Loadable({
  loader: () => import("../components/Theme"),
  loading: () => null,
})

const Desktop = Loadable({
  loader: () => import("../components/Desktop"),
  loading: () => null,
})

const About = Loadable({
  loader: () => import("../components/About"),
  loading: () => null,
})

interface SettingsMenu {
  text: string
  icon: React.ComponentType<any>
  component: React.ComponentType<any>
}

const settingsMenu: (SettingsMenu | undefined)[] = [
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
  undefined,
  {
    text: chrome.i18n.getMessage("settings_about"),
    icon: InfoIcon,
    component: About,
  },
]

function Layout() {
  const snackbar = useSnackbar()
  const classes = useStyles()
  const [current, setCurrent] = useState(0)

  const Component = settingsMenu[current]!.component

  return (
    <div className={classes.layout}>
      <AppBar position="static" className={classes.appbar}>
        <Toolbar disableGutters={!open}>
          <Typography variant="h6" color="inherit" noWrap>
            {chrome.i18n.getMessage("settings_toolbar_title")}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <List>
          {settingsMenu.map((item, index) => {
            if (!item) {
              return <Divider className={classes.menuDivider} key={index} />
            }
            return (
              <ListItem
                key={index}
                button
                component="li"
                className={clsx(classes.menuListItem, current === index && [classes.menuActiveColor, classes.menuActiveBg])}
                onClick={() => setCurrent(index)}
              >
                <ListItemIcon>
                  <item.icon className={clsx(current === index && classes.menuActiveColor)} />
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            )
          })}
        </List>
      </Drawer>
      <main className={classes.main}>
        <div className={classes.content}>
          {Component && <Component />}
        </div>
      </main>
    </div>
  )
}

export default withTheme(Layout)
