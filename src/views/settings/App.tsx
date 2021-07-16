import { hot } from "react-hot-loader/root"
import React, { useRef } from "react"
import { useObserver, useLocalStore } from "mobx-react"
import { ThemeProvider } from "@material-ui/core/styles"
import { SnackbarProvider } from "notistack"
import Layout from "./Layout"
import { themeStore as theme } from "./store"

function App() {
  const themeStore = useLocalStore(() => theme)
  const ref: any = useRef()

  return useObserver(() => (
    <ThemeProvider theme={themeStore.theme}>
      <SnackbarProvider
        maxSnack={1}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        autoHideDuration={2500}
        ref={el => ref.current = el}
        onClose={(event: any, reason: any) => {
          if (reason === "clickaway") {
            ref.current.closeSnackbar()
          }
        }}
      >
        <Layout />
      </SnackbarProvider>
    </ThemeProvider>
  ))
}

export default hot(App)
