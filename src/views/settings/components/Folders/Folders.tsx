import React, { FC } from "react"

import Wrapper from "../../Layout/SettingsWrapper"
import FolderSimulation from "./FolderSimulation"
import FoldersWindow from "./FoldersWindow"
import IconLayout from "./IconLayout"
import WindowEffect from "./WindowEffect"
import FollowNightMode from "./FollowNightMode"

const Folders: FC = () => {
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
