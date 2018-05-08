import * as React from "react"
import { inject, observer } from "mobx-react"

import { MuiThemeProvider } from "material-ui/styles"
import Button from "material-ui/Button"

import Header from "./components/Header"

// import LazilyLoad, { importLazy } from "utils/LazilyLoad"
import { onMessage } from "utils/message"
import makeDumbProps from "utils/makeDumbProps"

import { WallpaperStore } from "./store/wallpaper"
import { Theme as ThemeSettings } from "stores/theme"

interface PropsType {
  wallpaperStore: WallpaperStore
  themeSettings: ThemeSettings
}
@inject("wallpaperStore", "themeSettings")
@observer
class App extends React.Component<PropsType> {
  public state = {}
  private setPageTitle() {
    const title = document.createElement("title")
    title.innerHTML = chrome.i18n.getMessage("new_tab")
    document.head.appendChild(title)
  }
  public componentDidMount() {
    this.setPageTitle()
    onMessage("updateWallpaper", url => {
      console.log("update wallpaper")
      this.props.wallpaperStore.wallpaper = url
    })
  }
  public render() {
    return (
      <MuiThemeProvider theme={this.props.themeSettings.theme}>
        <div id="bg" style={this.props.wallpaperStore.backgroundStyles} />
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
