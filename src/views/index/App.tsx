import * as React from "react"
import { inject, observer } from "mobx-react"

import { MuiThemeProvider } from "@material-ui/core/styles"

import Header from "./components/Header"
import Background from "./components/Background"
import Desktop from "./components/Desktop"
import ContextMenu from "components/ContextMenu"

// import LazilyLoad, { importLazy } from "utils/LazilyLoad"
import { onMessage } from "utils/message"
import makeDumbProps from "utils/makeDumbProps"

import { WallpaperStore } from "./store/wallpaper"
import { ThemeStore } from "stores/theme"
import { MenuStore } from "stores/menu"

interface PropsType {
  wallpaperStore: WallpaperStore
  themeStore: ThemeStore
  menuStore: MenuStore
}
@inject("wallpaperStore", "themeStore", "menuStore")
@observer
class App extends React.Component<PropsType> {
  private setPageTitle() {
    document.title = chrome.i18n.getMessage("new_tab")
  }
  public componentDidMount() {
    onMessage("updateWallpaper", this.props.wallpaperStore.wallpaperUpdated)
    this.setPageTitle()
    document.addEventListener("click", this.props.menuStore.clearMenus, false)
  }
  public render() {
    return (
      <MuiThemeProvider theme={this.props.themeStore.theme}>
        <Background />
        <Header />
        <Desktop />
        <ContextMenu />
      </MuiThemeProvider>
    )
  }
}

export default makeDumbProps(App)
