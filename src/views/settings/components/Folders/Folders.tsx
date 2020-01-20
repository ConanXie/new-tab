import React from "react"

import Wrapper from "../../Layout/SettingsWrapper"
import FolderSimulation from "./FolderSimulation"
import FoldersWindow from "./FoldersWindow"
import IconLayout from "./IconLayout"

function Folders() {
  return (
    <>
      <Wrapper>
        <FolderSimulation />
        <FoldersWindow />
        <IconLayout />
      </Wrapper>
    </>
  )
}

export default Folders
