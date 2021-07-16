import React, { FC, ReactNode } from "react"
import { ThemeProvider } from "@material-ui/core/styles"
import { Observer, useLocalObservable } from "mobx-react"

import themeStore from "store/theme"

interface Props {
  children?: ReactNode
}

const Theme: FC<Props> = ({ children }) => {
  const store = useLocalObservable(() => themeStore)

  return (
    <Observer>{() => <ThemeProvider theme={store.theme}>{children}</ThemeProvider>}</Observer>
  )
}

export default Theme
