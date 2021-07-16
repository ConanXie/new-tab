import { hot } from "react-hot-loader/root"
import React, { useRef } from "react"
import { Provider } from "mobx-react"
import { SnackbarProvider } from "notistack"
import Layout from "./Layout"

import Theme from "components/Theme"

import * as store from "./store"

function App() {
  const ref: any = useRef()

  return (
    <Provider {...store}>
      <Theme>
        <SnackbarProvider
          maxSnack={1}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          autoHideDuration={2500}
          ref={(el) => (ref.current = el)}
          onClose={(event: any, reason: any) => {
            if (reason === "clickaway") {
              ref.current.closeSnackbar()
            }
          }}
        >
          <Layout />
        </SnackbarProvider>
      </Theme>
    </Provider>
  )
}

export default hot(App)
