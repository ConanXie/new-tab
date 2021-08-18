import React, { FC } from "react"
import clsx from "clsx"
import { observer } from "mobx-react-lite"

import { makeStyles, createStyles, Theme } from "@material-ui/core/styles"
import Popover, { PopoverOrigin } from "@material-ui/core/Popover"

import folderStore from "../../../store/folder"
import foldersSettings from "store/foldersSettings"
import Website from "../Website"
import Wrap from "../Wrap"
import grab, { Env } from "../Website/grab"
import { useAcrylic } from "../../../../../styles/acrylic"

const origin: PopoverOrigin = {
  vertical: "center",
  horizontal: "center",
}

const useStyles = makeStyles(({ spacing, palette }: Theme) =>
  createStyles({
    window: {
      display: "grid",
      padding: spacing(1),
      "& > .wrap": {
        padding: spacing(2),
        height: "auto",
        transition: "transform 0.2s cubic-bezier(0.333, 0, 0, 1)",
      },
      "& .shortcut-name": {
        color: `${palette.text.primary} !important`,
        textShadow: "none",
      },
    },
  }),
)

interface Props {
  open: boolean
  anchorEl: HTMLElement
  onClose: (...args: any[]) => void
}

const FolderWindow: FC<Props> = (props) => {
  const { open, anchorEl, onClose } = props
  const classes = useStyles()
  const { tempShortcutId, id, shortcuts } = folderStore
  const { backgroundColor, acrylicEffect } = foldersSettings
  const acrylic = useAcrylic()

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
      classes={{
        paper: clsx(acrylicEffect ? acrylic.root : null),
      }}
      PaperProps={{
        style: { backgroundColor },
      }}
    >
      <div
        className={clsx(["folder-window", classes.window])}
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
      </div>
    </Popover>
  )
}

export default observer(FolderWindow)
