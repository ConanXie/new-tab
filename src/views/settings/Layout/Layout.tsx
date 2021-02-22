import React, { useState, FC } from "react"
import clsx from "clsx"
import Loadable from "react-loadable"
import Color from "color"
import { observer } from "mobx-react"

import { makeStyles, createStyles, Theme as MuiTheme } from "@material-ui/core/styles"
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
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUncheckedOutlined"
import InfoIcon from "@material-ui/icons/InfoOutlined"

export const WRAPPER_MAX_WIDTH = 840
export const NAV_WIDTH = 280

const useStyles = makeStyles(({ spacing, palette, overrides }: MuiTheme) =>
  createStyles({
    appbar: {
      boxShadow: "none",
      backgroundColor: palette.background.paper,
    },
    drawerPaper: {
      zIndex: 0,
      top: 64,
      minWidth: NAV_WIDTH,
      borderRight: "none",
    },
    navListItem: {
      borderTopRightRadius: spacing(6),
      borderBottomRightRadius: spacing(6),
    },
    navActiveColor: {
      color: (overrides!.MuiButton!.textPrimary as React.CSSProperties)!.color,
    },
    navActiveBg: {
      background: Color(palette.primary.main)
        .alpha(0.15)
        .toString(),
    },
    navDivider: {
      margin: `${spacing(1)}px 0`,
    },
    main: {
      marginLeft: NAV_WIDTH,
      backgroundColor: palette.background.paper,
    },
    content: {
      boxSizing: "border-box",
      maxWidth: WRAPPER_MAX_WIDTH + NAV_WIDTH + spacing(6) * 2,
      padding: `${spacing(1)}px ${spacing(6)}px`,
      margin: "0 auto",
      height: `calc(100vh - ${spacing(8)}px)`,
      overflow: "auto",
    },
  }),
)

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
  const classes = useStyles()
  const [current, setCurrent] = useState(0)

  const Component = settingsNav[current]!.component

  return (
    <>
      <AppBar position="static" className={classes.appbar}>
        <Toolbar disableGutters={!open}>
          <Typography variant="h6" color="textPrimary" noWrap>
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
          {settingsNav.map((item, index) => {
            if (!item) {
              return <Divider className={classes.navDivider} key={index} />
            }
            return (
              <ListItem
                key={index}
                button
                component="li"
                className={clsx(
                  classes.navListItem,
                  current === index && [classes.navActiveColor, classes.navActiveBg],
                )}
                onClick={() => setCurrent(index)}
              >
                <ListItemIcon>
                  <item.icon className={clsx(current === index && classes.navActiveColor)} />
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            )
          })}
        </List>
      </Drawer>
      <main className={classes.main}>
        <div className={classes.content}>{Component && <Component />}</div>
      </main>
    </>
  )
}

export default observer(Layout)
