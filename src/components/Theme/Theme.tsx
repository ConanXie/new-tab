import React, { FC, ReactNode } from "react"
import { ThemeProvider } from "@mui/material/styles"
import { observer, useLocalObservable } from "mobx-react"

import themeStore from "store/theme"

interface Props {
  children?: ReactNode
}

const Theme: FC<Props> = ({ children }) => {
  const store = useLocalObservable(() => themeStore)

  return (
    <ThemeProvider theme={store.theme}>{children}</ThemeProvider>
  )
}

export default observer(Theme)
