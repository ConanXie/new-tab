import React, { FC } from "react"
import { observer } from "mobx-react-lite"

import Typography from "@mui/material/Typography"

import { shortcutIconsStore, foldersSettings, desktopSettings, themeStore } from "../../../store"

interface Props {
  id: string
  label: string
  url: string
  itemId: string
  index?: number
  icon?: string
  inFolder?: boolean
  onMouseDown?(e: any): void
  onClick?(e: any): void
}

const textShadow = "0 1px 2px rgba(0, 0, 0, 0.36)"

const Webiste: FC<Props> = (props) => {
  const { id, url, label, itemId, icon, index, inFolder } = props
  const { shortcutIcon, getURL } = shortcutIconsStore
  const iconURL = icon || getURL(shortcutIcon(id, url))
  const style: React.CSSProperties = {
    color: inFolder
      ? foldersSettings.followNightMode
        ? themeStore.theme.palette.text.primary
        : foldersSettings.shortcutLabelColor
      : desktopSettings.shortcutLabelColor,
    textShadow:
      (inFolder && foldersSettings.shortcutLabelShadow) ||
      (!inFolder && desktopSettings.shortcutLabelShadow)
        ? textShadow
        : undefined,
  }

  const showLabel = inFolder ? foldersSettings.shortcutLabel : desktopSettings.shortcutLabel

  return (
    <a
      href={url}
      data-id={itemId}
      data-index={index}
      onMouseDown={props.onMouseDown}
      className="shortcut"
      data-type="shortcut"
      onClick={props.onClick}
    >
      <div className="shortcut-icon">{iconURL && <img src={iconURL} alt={label} />}</div>
      {showLabel && (
        <Typography className="shortcut-name" variant="subtitle1" style={style}>
          {label}
        </Typography>
      )}
    </a>
  )
}

export default observer(Webiste)
