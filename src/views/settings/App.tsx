import * as React from "react"
import * as classNames from "classnames"
import { observer, inject } from "mobx-react"

import { MuiThemeProvider, createMuiTheme } from "material-ui/styles"
import withStyle, { WithStyles, StyleRulesCallback } from "material-ui/styles/withStyles"
import CssBaseline from "material-ui/CssBaseline"
import AppBar from "material-ui/AppBar"
import Toolbar from "material-ui/Toolbar"
import IconButton from "material-ui/IconButton"
import Typography from "material-ui/Typography"
import Drawer from "material-ui/Drawer"
import Divider from "material-ui/Divider"
import List, {
  ListItem,
  ListItemIcon,
  ListItemText
} from "material-ui/List"
import MenuIcon from "@material-ui/icons/Menu"
import ChevronRightIcon from "@material-ui/icons/ChevronRight"
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft"
import ColorLensIcon from "@material-ui/icons/ColorLens"
import InfoIcon from "@material-ui/icons/Info"

import makeDumbProps from "utils/makeDumbProps"
import { Settings as SettingsType } from "./store/Settings"
interface PropTypes {
  settings: SettingsType
}

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
    padding: theme.spacing.unit * 3
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

@inject("settings")
@observer
class App extends React.Component<WithStyles<StylesType> & PropTypes> {
  public state = {
    theme: this.createTheme(this.props.settings.themeColor),
    open: false,
    content: (() => <h1>12212</h1>) as React.ComponentType
  }
  private createTheme(color: string) {
    return createMuiTheme({
      palette: {
        primary: {
          main: color
        }
      }
    })
  }
  private handleDrawerOpen = () => {
    this.setState({ open: true })
  }
  private handleDrawerClose = () => {
    this.setState({ open: false })
  }
  private loadTheme = async () => {
    const component = await import("./components/Theme")
    this.setState({ content: component.default })
  }
  private loadAbout = async () => {
    const component = await import("./components/About")
    this.setState({ content: component.default })
  }
  public render() {
    const { classes, theme } = this.props
    const Component = this.state.content
    return (
      <MuiThemeProvider theme={this.state.theme}>
        <CssBaseline />
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
          <List>
            <ListItem button onClick={this.loadTheme}>
              <ListItemIcon>
                <ColorLensIcon />
              </ListItemIcon>
              <ListItemText primary="Theme" />
            </ListItem>
            <ListItem button onClick={this.loadAbout}>
              <ListItemIcon>
                <InfoIcon />
              </ListItemIcon>
              <ListItemText primary="About" />
            </ListItem>
          </List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Component />
        </main>
      </MuiThemeProvider>
    )
  }
}

export default makeDumbProps(withStyle(styles, { withTheme: true })<PropTypes>(App))
