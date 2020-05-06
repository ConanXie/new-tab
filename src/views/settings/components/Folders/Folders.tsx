import React from "react"

import Wrapper from "../../Layout/SettingsWrapper"
import FolderSimulation from "./FolderSimulation"
import FoldersWindow from "./FoldersWindow"
import IconLayout from "./IconLayout"
import WindowEffect from "./WindowEffect"

function Folders() {
  return (
    <>
      <Wrapper>
        <FolderSimulation />
        <FoldersWindow />
        <IconLayout />
        <WindowEffect />
      </Wrapper>
    </>
  )
}

export default Folders
