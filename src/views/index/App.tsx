import { hot } from "react-hot-loader/root"
import React, { useEffect } from "react"
import { Provider } from "mobx-react"

import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider"

import Header from "./components/Header"
import Background from "./components/Background"
import Desktop from "./components/Desktop"
import ContextMenu from "components/ContextMenu"

import { onMessage } from "utils/message"

import * as store from "./store"

const App = () => {
  useEffect(() => {
    onMessage("updateWallpaper", (url: string, sender, sendResponse) => {
      sendResponse()
      store.wallpaperStore.wallpaperUpdated(url)
    })
  }, [])

  return (
    <Provider {...store}>
      <MuiThemeProvider theme={store.themeStore.theme}>
        <Background />
        <Header />
        <Desktop />
        <ContextMenu />
      </MuiThemeProvider>
    </Provider>
  )
}

export default hot(App)
