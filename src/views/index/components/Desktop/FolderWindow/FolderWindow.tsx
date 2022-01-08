import React, { FC } from "react"
import { observer } from "mobx-react-lite"

import Popover, { PopoverOrigin } from "@mui/material/Popover"

import folderStore from "../../../store/folder"
import foldersSettings from "store/foldersSettings"
import Website from "../Website"
import Wrap from "../Wrap"
import grab, { Env } from "../Website/grab"
import Box from "@mui/material/Box"

const origin: PopoverOrigin = {
  vertical: "center",
  horizontal: "center",
}

interface Props {
  open: boolean
  anchorEl: HTMLElement
  onClose: (...args: any[]) => void
}

const FolderWindow: FC<Props> = (props) => {
  const { open, anchorEl, onClose } = props
  const { tempShortcutId, id, shortcuts } = folderStore
  const { backgroundColor } = foldersSettings

  const handleGrab = (index: number) => (event: React.MouseEvent<HTMLElement>) => {
    if (event.button === 0) {
      grab(event, shortcuts[index], id, Env.Folder)
    }
  }

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={origin}
      transformOrigin={origin}
      PaperProps={{
        style: { backgroundColor },
      }}
    >
      <Box
        // className={clsx(["folder-window", classes.window])}
        className="folder-window"
        sx={{
          display: "grid",
          padding: 1,
          "& > .wrap": {
            padding: 2,
            height: "auto",
            transition: "transform 0.2s cubic-bezier(0.333, 0, 0, 1)",
          },
          "& .shortcut-name": {
            color: `text.primary !important`,
            textShadow: "none",
          },
        }}
        style={{
          gridTemplateColumns: `repeat(${folderStore.gridColumns}, 1fr)`,
        }}
      >
        {folderStore.shortcuts.map((shortcut, index) => {
          const { id, label, url } = shortcut
          return (
            <Wrap grabbed={tempShortcutId === shortcut.id} row={0} column={0} key={Math.random()}>
              <Website
                inFolder
                id={id}
                label={label}
                url={url}
                key={id}
                itemId={folderStore.id}
                index={index}
                onMouseDown={handleGrab(index)}
              />
            </Wrap>
          )
        })}
      </Box>
    </Popover>
  )
}

export default observer(FolderWindow)
