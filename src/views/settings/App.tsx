import * as React from "react"
import { observer, inject } from "mobx-react"

import { MuiThemeProvider, createMuiTheme } from "material-ui/styles"
import AppBar from "material-ui/AppBar"
import Toolbar from "material-ui/Toolbar"
import IconButton from "material-ui/IconButton"
import Typography from "material-ui/Typography"
import MenuIcon from "@material-ui/icons/Menu"

import { Settings as SettingsType } from "./store/Settings"
interface PropTypes {
  settings: SettingsType
}

function makeDumbProps(a: React.ComponentType) {
  return a
}
@inject("settings")
@observer
class App extends React.Component<PropTypes> {
  public state = {
    theme: this.createTheme(this.props.settings.themeColor),
    open: false
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
  public render() {
    return (
      <MuiThemeProvider theme={this.state.theme}>
        <AppBar position="absolute">
          <Toolbar disableGutters={!this.state.open}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit" noWrap>
              {chrome.i18n.getMessage("settings_toolbar_title")}
            </Typography>
          </Toolbar>
        </AppBar>
      </MuiThemeProvider>
    )
  }
}

export default makeDumbProps(App)
