import React from "react"
import { render } from "react-dom"
import "typeface-roboto"
import "../../styles"
import App from "./App"

document.title = chrome.i18n.getMessage("new_tab")

render(<App />, document.querySelector("#app"))
