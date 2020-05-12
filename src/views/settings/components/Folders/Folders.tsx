import React from "react"

import Wrapper from "../../Layout/SettingsWrapper"
import FolderSimulation from "./FolderSimulation"
import FoldersWindow from "./FoldersWindow"
import IconLayout from "./IconLayout"
import WindowEffect from "./WindowEffect"
import FollowNightMode from "./FollowNightMode"

function Folders() {
  return (
    <>
      <Wrapper>
        <FolderSimulation />
        <FollowNightMode />
        <FoldersWindow />
        <IconLayout />
        <WindowEffect />
      </Wrapper>
    </>
  )
}

export default Folders
