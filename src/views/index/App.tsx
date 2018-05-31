import * as React from "react"
import { inject, observer } from "mobx-react"

import { MuiThemeProvider } from "@material-ui/core/styles"

import Header from "./components/Header"
import Background from "./components/Background"
import Desktop from "./components/Desktop"

// import LazilyLoad, { importLazy } from "utils/LazilyLoad"
import { onMessage } from "utils/message"
import makeDumbProps from "utils/makeDumbProps"

import { WallpaperStore } from "./store/wallpaper"
import { ThemeStore } from "stores/theme"

interface PropsType {
  wallpaperStore: WallpaperStore
  themeStore: ThemeStore
}
@inject("wallpaperStore", "themeStore")
@observer
class App extends React.Component<PropsType> {
  private setPageTitle() {
    document.title = chrome.i18n.getMessage("new_tab")
  }
  public componentDidMount() {
    this.setPageTitle()
    onMessage("updateWallpaper", this.props.wallpaperStore.wallpaperUpdated)
  }
  public render() {
    return (
      <MuiThemeProvider theme={this.props.themeStore.theme}>
        <Background />
        <Header />
        <Desktop />
      </MuiThemeProvider>
    )
  }
}

export default makeDumbProps(App)
