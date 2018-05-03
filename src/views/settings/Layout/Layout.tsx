import * as React from "react"
import * as classNames from "classnames"

import withStyle, { WithStyles, StyleRulesCallback } from "material-ui/styles/withStyles"
import AppBar from "material-ui/AppBar"
import Toolbar from "material-ui/Toolbar"
import IconButton from "material-ui/IconButton"
import Typography from "material-ui/Typography"
import Drawer from "material-ui/Drawer"
import Divider from "material-ui/Divider"
import Paper from "material-ui/Paper"
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
  paper: {
    width: "680px",
    margin: "0 auto"
  }
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
  | "paper"

class Layout extends React.Component<WithStyles<StylesType>> {
  public state = {
    open: false,
    content: null as React.ComponentType | null
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
  public componentWillMount() {
    import("../components/Theme").then(this.loadContent)
  }
  public render() {
    const { classes, theme } = this.props
    const Content = this.state.content
    return (
      <div className={classes.layout}>
        <AppBar
          position="absolute"
          className={classNames(classes.appBar, this.state.open && classes.appBarShift)}
        >
          <Toolbar disableGutters={!this.state.open}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={this.handleDrawerOpen}
              className={classNames(classes.menuButton, this.state.open && classes.hide)}
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
            paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose)
          }}
          open={this.state.open}
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
          <Paper elevation={2} classes={{ root: classes.paper }}>
            {Content && <Content />}
          </Paper>
        </main>
      </div>
    )
  }
}

export default withStyle(styles, { withTheme: true })(Layout)
