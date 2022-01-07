import { hot } from "react-hot-loader/root"
import React, { useEffect } from "react"
import { Provider } from "mobx-react"

import Header from "./components/Header"
import Background from "./components/Background"
import Desktop from "./components/Desktop"
import ContextMenu from "components/ContextMenu"
import Theme from "components/Theme"

import { onMessage } from "utils/message"

import * as store from "./store"

const setCssVariables = () => {
  document.body.style.setProperty("--width", `${innerWidth}`)
  document.body.style.setProperty("--height", `${innerHeight}`)
  document.body.style.setProperty(
    "--desktop-cell-width",
    `${innerWidth / store.desktopStore.columns}`,
  )
  document.body.style.setProperty(
    "--desktop-cell-height",
    `${innerHeight / store.desktopStore.rows}`,
  )
}

const App = () => {
  useEffect(() => {
    onMessage("updateWallpaper", (url: string, sender, sendResponse) => {
      sendResponse()
      store.wallpaperStore.wallpaperUpdated(url)
    })

    setCssVariables()

    window.onresize = setCssVariables
  }, [])

  return (
    <Provider {...store}>
      <Theme>
        <Background />
        <Header />
        <Desktop />
        <ContextMenu />
      </Theme>
    </Provider>
  )
}

export default hot(App)
