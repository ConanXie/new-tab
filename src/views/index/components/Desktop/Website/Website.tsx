import React from "react"
import { inject, observer } from "mobx-react"

import Typography from "@material-ui/core/Typography"

import makeDumbProps from "utils/makeDumbProps"
import { ShortcutIconsStore } from "../../../store/shortcutIcons"
import { DesktopSettings } from "store/desktopSettings"
import { FoldersSettings } from "store/foldersSettings"

interface PropsType {
  id: string
  label: string
  url: string
  itemId: string
  index?: number
  icon?: string
  inFolder?: boolean
  shortcutIconsStore: ShortcutIconsStore
  foldersSettings: FoldersSettings
  desktopSettings: DesktopSettings
  onMouseDown(e: any): void
}

const textShadow = "0 1px 2px rgba(0, 0, 0, 0.36)"

@inject("shortcutIconsStore", "foldersSettings", "desktopSettings")
@observer
class Webiste extends React.Component<PropsType> {
  public render() {
    const { id, url, label, itemId, icon, index, inFolder } = this.props
    const { shortcutIcon, getURL } = this.props.shortcutIconsStore
    const iconURL = icon || getURL(shortcutIcon(id, url))
    const style: React.CSSProperties = {
      color: inFolder ? this.props.foldersSettings.shortcutLabelColor : this.props.desktopSettings.shortcutLabelColor,
      textShadow: inFolder ? (this.props.foldersSettings.shortcutLabelShadow ? textShadow : undefined) : (this.props.desktopSettings.shortcutLabelShadow ? textShadow : undefined)
    }
    const showLabel = inFolder ? this.props.foldersSettings.shortcutLabel : this.props.desktopSettings.shortcutLabel

    return (
      <a
        href={url}
        data-id={itemId}
        data-index={index}
        onMouseDown={this.props.onMouseDown}
        className="shortcut"
        data-type="shortcut"
      >
        <div className="shortcut-icon">
          {iconURL && <img src={iconURL} alt={label} />}
        </div>
        {showLabel && (
          <Typography className="shortcut-name" variant="subtitle1" style={style}>{label}</Typography>
        )}
      </a>
    )
  }
}

export default makeDumbProps(Webiste)
