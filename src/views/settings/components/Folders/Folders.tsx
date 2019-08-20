import React from "react"

import Wrap from "../../Layout/SettingsWrap"
import FolderSimulation from "./FolderSimulation"
import FoldersWindow from "./FoldersWindow"
import IconLayout from "./IconLayout"

function Folders() {
  return (
    <>
      <Wrap>
        <FolderSimulation />
        <FoldersWindow />
        <IconLayout />
      </Wrap>
    </>
  )
}

export default Folders
