import * as React from "react"
import { inject, observer } from "mobx-react"

import { MuiThemeProvider } from "material-ui/styles"
import Button from "material-ui/Button"

import Header from "./components/Header"

// import LazilyLoad, { importLazy } from "utils/LazilyLoad"
import { onMessage } from "utils/message"
import makeDumbProps from "utils/makeDumbProps"

import { Wallpaper as WallpaperType } from "./store/wallpaper"
import { Theme as ThemeSettings } from "stores/theme"

interface PropsType {
  wallpaper: WallpaperType
  themeSettings: ThemeSettings
}
@inject("wallpaper", "themeSettings")
@observer
class App extends React.Component<PropsType> {
  public state = {}
  private setPageTitle() {
    const title = document.createElement("title")
    title.innerHTML = chrome.i18n.getMessage("new_tab")
    document.head.appendChild(title)
  }
  private loadWallpaper() {
    const wallpaper = localStorage.getItem("wallpaper")
    if (wallpaper) {
      this.props.wallpaper.wallpaper = wallpaper
    }
  }
  public componentDidMount() {
    this.setPageTitle()
    onMessage("updateWallpaper", () => {
      console.log("update wallpaper")
      this.loadWallpaper()
    })
  }
  public render() {
    return (
      <MuiThemeProvider theme={this.props.themeSettings.theme}>
        <div id="bg" style={this.props.wallpaper.backgroundStyles} />
        <Header />
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <Button variant="raised" color="primary">Button</Button>
        <br/>
        <br/>
      </MuiThemeProvider>
    )
  }
}

export default makeDumbProps(App)
