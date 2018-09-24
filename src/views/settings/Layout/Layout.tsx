import * as React from "react"
import * as classNames from "classnames"

import withStyle, { WithStyles, StyleRulesCallback } from "@material-ui/core/styles/withStyles"
import { withTheme } from "@material-ui/core/styles"
import { Theme } from "@material-ui/core/styles/createMuiTheme"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import IconButton from "@material-ui/core/IconButton"
import Typography from "@material-ui/core/Typography"
import Drawer from "@material-ui/core/Drawer"
import Divider from "@material-ui/core/Divider"
import MenuIcon from "@material-ui/icons/Menu"
import ChevronRightIcon from "@material-ui/icons/ChevronRight"
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft"
import ColorLensIcon from "@material-ui/icons/ColorLens"
import InfoIcon from "@material-ui/icons/Info"

import SettingsList, { SettingsItemType } from "./SettingsList"

const drawerWidth = 240

const styles: StyleRulesCallback = theme => ({
  root: {
    flexGrow: 1,
    height: 430,
    zIndex: 1,
    overflow: "hidden",
    position: "relative",
    display: "flex"
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36
  },
  hide: {
    display: "none"
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing.unit * 9
    }
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    height: "100vh",
    overflow: "auto"
  },
  layout: {
    display: "flex"
  },
})

type StylesType = "root"
  | "appBar"
  | "appBarShift"
  | "menuButton"
  | "hide"
  | "drawerPaper"
  | "drawerPaperClose"
  | "toolbar"
  | "content"
  | "layout"

interface PropsType {
  theme: Theme
}

class Layout extends React.Component<WithStyles<StylesType> & PropsType> {
  public state = {
    open: true,
    content: null as React.ComponentType | null,
  }
  /**
   * Control Drawer display
   */
  private handleDrawerOpen = () => {
    this.setState({ open: true })
  }
  private handleDrawerClose = () => {
    this.setState({ open: false })
  }
  /**
   * Two-part settings
   */
  private readonly settings: SettingsItemType[] = [{
    icon: ColorLensIcon,
    text: chrome.i18n.getMessage("settings_theme_title"),
    onClick: () => import("../components/Theme").then(this.loadContent)
  }]
  private readonly infoSettings: SettingsItemType[] = [{
    icon: InfoIcon,
    text: chrome.i18n.getMessage("settings_about_title"),
    onClick: () => import("../components/About").then(this.loadContent)
  }]
  private loadContent = (_: any) => {
    this.setState({ content: _.default })
  }
  public componentDidMount() {
    this.settings[0].onClick()
  }
  public render() {
    const { classes, theme } = this.props
    const { open, content: Content } = this.state
    return (
      <div className={classes.layout}>
        <AppBar
          position="absolute"
          className={classNames(classes.appBar, open && classes.appBarShift)}
        >
          <Toolbar disableGutters={!open}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={this.handleDrawerOpen}
              className={classNames(classes.menuButton, open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit" noWrap>
              {chrome.i18n.getMessage("settings_toolbar_title")}
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: classNames(classes.drawerPaper, !open && classes.drawerPaperClose)
          }}
          open={open}
        >
          <div className={classes.toolbar}>
            <IconButton onClick={this.handleDrawerClose}>
              {theme && theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </div>
          <Divider />
          <SettingsList items={this.settings} />
          <Divider />
          <SettingsList items={this.infoSettings} />
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          {Content && <Content />}
        </main>
      </div>
    )
  }
}

export default withTheme()(withStyle(styles)(Layout))
